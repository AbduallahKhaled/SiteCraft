"use client";
// X-ray hover reveal: a liquid lens follows the pointer and shows a second,
// pixel-aligned render of the same page (its blueprint + code) underneath.
// Inspired by Framer's HoverMaskReveal, rebuilt as one small WebGL shader
// (metaball trail + low-frequency wobble), no three.js.
// Without WebGL the front screenshot stays visible.
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MAX_POINTS = 28;

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform sampler2D u_front;
uniform sampler2D u_back;
uniform vec2 u_res;
uniform vec3 u_pts[${MAX_POINTS}];
uniform int u_n;
uniform float u_time;
uniform float u_dpr;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float field(vec2 p) {
  float f = 0.0;
  for (int i = 0; i < ${MAX_POINTS}; i++) {
    if (i >= u_n) break;
    vec3 pt = u_pts[i];
    vec2 d = p - pt.xy;
    f += (pt.z * pt.z) / (dot(d, d) + 1.0);
  }
  return f;
}

void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 uv = p / u_res;
  vec2 q = p / u_dpr;

  // slow, low-frequency wobble so the edge breathes like liquid
  float n = noise(q * 0.007 + vec2(u_time * 0.25, -u_time * 0.18));
  float f = field(p) * (0.88 + n * 0.24);

  vec2 grad = vec2(dFdx(f), dFdy(f));
  float g = length(grad) + 1e-5;         // change of f per pixel
  float m = smoothstep(1.0 - g, 1.0 + g, f);  // crisp, anti-aliased mask

  // lens depth: soft shadow just outside, gentle darkening just inside
  float outside = (1.0 - m) * smoothstep(0.55, 1.0, f);
  float inner = m * (1.0 - smoothstep(1.0, 1.7, f));

  // refraction: bend what is underneath near the rim, like looking through glass
  vec2 bend = -grad / g * inner * 6.0 * u_dpr / u_res;

  vec3 front = texture2D(u_front, uv).rgb;
  vec3 back = texture2D(u_back, uv + bend).rgb;

  front *= 1.0 - outside * 0.22;
  back *= 1.0 - inner * 0.35;

  vec3 col = mix(front, back, m);

  // a thin, crisp lime ring on the lens edge
  float ring = 1.0 - smoothstep(0.0, 1.6 * u_dpr, abs(f - 1.0) / g);
  col = mix(col, vec3(0.098, 0.765, 0.49), ring * 0.9);

  gl_FragColor = vec4(col, 1.0);
}
`;

type Pt = { x: number; y: number; life: number };

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function XRayReveal({
  src,
  backSrc,
  alt,
  aspect,
  className,
}: {
  src: string;
  /** pixel-aligned "x-ray" render of the same page */
  backSrc: string;
  alt: string;
  /** width / height of the screenshots */
  aspect: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current!;
    // A fresh canvas per mount: React dev mode mounts twice, and a lost context cannot be reused.
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 h-full w-full";
    layerRef.current!.appendChild(canvas);

    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    const cleanupCanvas = () => {
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
    if (!gl || !gl.getExtension("OES_standard_derivatives")) {
      cleanupCanvas();
      return;
    }

    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, "#extension GL_OES_standard_derivatives : enable\n" + FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch {
      cleanupCanvas();
      return;
    }
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("u_res"), uPts = U("u_pts"), uN = U("u_n"), uTime = U("u_time"), uDpr = U("u_dpr");
    gl.uniform1i(U("u_front"), 0);
    gl.uniform1i(U("u_back"), 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const texture = (unit: number, img: HTMLImageElement) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(wrap.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(wrap.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // --- pointer, head with inertia, liquid trail -------------------------
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const trail: Pt[] = [];
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0, r: 0 };
    let hovering = false;
    let lastInput = -1e9;

    const baseR = () => Math.max(Math.min(canvas.width, canvas.height) * 0.19, 70 * dpr);

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      target.x = (e.clientX - r.left) * dpr;
      target.y = (r.height - (e.clientY - r.top)) * dpr;
      if (!hovering && head.r < 2) {
        head.x = target.x;
        head.y = target.y;
      }
      hovering = true;
      lastInput = performance.now();
    };
    const onLeave = () => {
      hovering = false;
      lastInput = performance.now();
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointercancel", onLeave);

    const data = new Float32Array(MAX_POINTS * 3);
    let raf = 0;
    let visible = true;
    let shown = false;
    let t0 = performance.now();
    let prev = t0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const t = (now - t0) / 1000;
      const R = baseR();

      // Idle: a slow wandering lens hints that there is something underneath.
      const idle = !hovering && now - lastInput > 2200 && !reduce;
      if (idle) {
        target.x = canvas.width * (0.5 + 0.28 * Math.sin(t * 0.31));
        target.y = canvas.height * (0.5 + 0.2 * Math.sin(t * 0.47 + 1.2));
      }

      // inertia: the lens lags slightly behind the pointer, like a drop of liquid
      const k = 1 - Math.pow(0.0008, dt);
      head.x += (target.x - head.x) * k;
      head.y += (target.y - head.y) * k;
      const targetR = hovering ? R : idle ? R * 0.72 : 0;
      head.r += (targetR - head.r) * (1 - Math.pow(0.002, dt));

      const last = trail[trail.length - 1];
      if (head.r > 1 && (!last || Math.hypot(head.x - last.x, head.y - last.y) > 10 * dpr)) {
        trail.push({ x: head.x, y: head.y, life: 1 });
        if (trail.length > MAX_POINTS - 1) trail.shift();
      }
      for (const p of trail) p.life -= dt / 0.55;
      while (trail.length && trail[0].life <= 0) trail.shift();

      let n = 0;
      for (const p of trail) {
        data[n * 3] = p.x;
        data[n * 3 + 1] = p.y;
        data[n * 3 + 2] = Math.pow(Math.max(0, p.life), 1.5) * Math.max(head.r, R * 0.5) * 0.36;
        n++;
      }
      data[n * 3] = head.x;
      data[n * 3 + 1] = head.y;
      data[n * 3 + 2] = head.r;
      n++;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3fv(uPts, data);
      gl.uniform1i(uN, n);
      gl.uniform1f(uTime, reduce ? 0 : t);
      gl.uniform1f(uDpr, dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!shown) {
        shown = true;
        setReady(true);
      }
    };

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      prev = performance.now();
    });

    let cancelled = false;
    Promise.all([loadImage(src), loadImage(backSrc)])
      .then(([front, back]) => {
        if (cancelled) return;
        texture(0, front);
        texture(1, back);
        resize();
        ro.observe(wrap);
        io.observe(wrap);
        t0 = prev = performance.now();
        head.x = target.x = canvas.width * 0.5;
        head.y = target.y = canvas.height * 0.5;
        raf = requestAnimationFrame(frame);
      })
      .catch(() => cleanupCanvas());

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointercancel", onLeave);
      cleanupCanvas();
      setReady(false);
    };
  }, [src, backSrc]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative cursor-crosshair overflow-hidden", className)}
      style={{ aspectRatio: aspect, touchAction: "pan-y" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <div
        ref={layerRef}
        aria-hidden
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  );
}

export default XRayReveal;
