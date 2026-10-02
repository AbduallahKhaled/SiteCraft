// Renders the hero cover site and its source code at the same size, so the
// x-ray lens reveals the code behind the page.
// Run: node tools/hero-xray.mjs   (needs Edge + network for fonts/photo)
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import sharp from "sharp";

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const OUT_HTML = resolve("tools/mock");
const OUT_IMG = resolve("public/hero");
mkdirSync(OUT_HTML, { recursive: true });
mkdirSync(OUT_IMG, { recursive: true });

const PHOTO = "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1400&q=85&auto=format&fit=crop";

// --- tiny JSX highlighter (same palette as lib/highlight.ts) ---------------
const C = { text: "#89938d", comment: "#5a645e", kw: "#19c37d", str: "#f5f7f6", tag: "#8be5bd", num: "#e6c07b", brace: "#6b756f" };
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hl = (code) =>
  code
    .split("\n")
    .map((line) =>
      line
        .split(/("[^"]*"|<\/?[A-Za-z.]+|\/>|>|\b(?:import|from|export|default|function|return|const)\b|\{|\}|\b\d+\b)/g)
        .filter(Boolean)
        .map((p) => {
          let c = C.text;
          if (p.startsWith('"')) c = C.str;
          else if (/^(import|from|export|default|function|return|const)$/.test(p)) c = C.kw;
          else if (p.startsWith("<") || p === "/>" || p === ">") c = C.tag;
          else if (/^\d+$/.test(p)) c = C.num;
          else if (p === "{" || p === "}") c = C.brace;
          return `<span style="color:${c}">${esc(p)}</span>`;
        })
        .join("")
    )
    .join("\n");

const code = (src, style) => `<pre class="code" style="${style}">${hl(src)}</pre>`;

const html = (mode) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=block">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:760px;overflow:hidden;background:#f2efe9;font-family:Inter;color:#161616;-webkit-font-smoothing:antialiased}
.chrome{height:44px;display:flex;align-items:center;gap:8px;padding:0 18px;background:#e7e4de;border-bottom:1px solid #d9d5ce}
.chrome i{width:11px;height:11px;border-radius:50%}
.url{margin-left:18px;width:460px;height:26px;border-radius:7px;background:#fff;color:#777;font:13px Inter;display:flex;align-items:center;padding:0 12px}
.page{position:relative;height:716px;display:flex;flex-direction:column}
nav{display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:76px}
.logo{font:italic 400 34px 'Instrument Serif';letter-spacing:-.01em}
.links{display:flex;gap:34px;font-size:14px;color:#3b3b3b}
.cart{font-size:14px;display:flex;align-items:center;gap:8px}
.cart b{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#161616;color:#f2efe9;font-size:11px;font-weight:600}
main{display:grid;grid-template-columns:1fr 1.06fr;gap:44px;padding:0 48px 28px;flex:1;min-height:0}
.left{display:flex;flex-direction:column;justify-content:center;padding-bottom:10px}
.eyebrow{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#4a4a4a;width:max-content}
.eyebrow span:not(.tag){width:7px;height:7px;border-radius:50%;background:#5b8f91}
h1{font:400 108px/0.9 'Instrument Serif';letter-spacing:-.025em;margin-top:22px}
h1 em{color:#3f7476}
.lede{margin-top:22px;font-size:17px;line-height:1.55;color:#555;max-width:400px}
.buy{margin-top:30px;display:flex;align-items:center;gap:22px;width:max-content}
.price{font:400 40px 'Instrument Serif'}
.sw{display:flex;gap:8px}
.sw i{width:22px;height:22px;border-radius:50%;border:2px solid #f2efe9;box-shadow:0 0 0 1px #bdb8b0}
.sw i:first-child{box-shadow:0 0 0 1.5px #161616}
.actions{margin-top:24px;display:flex;gap:12px;width:max-content}
.btn{padding:16px 26px;border-radius:999px;font-size:15px;font-weight:500}
.btn.dark{background:#161616;color:#f2efe9}
.btn.line{border:1px solid #bdb8b0}
.specs{margin-top:34px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #d9d5ce;max-width:500px}
.specs div{padding-top:14px;font-size:13px;color:#555}
.specs b{display:block;font-weight:500;color:#161616;font-size:14px;margin-bottom:2px}
.media{position:relative;border-radius:22px;overflow:hidden;background:#86aeb1}
.media img{width:100%;height:100%;object-fit:cover;object-position:50% 60%;display:block}
.card{position:absolute;left:20px;bottom:20px;background:#f2efe9;border-radius:14px;padding:14px 16px;display:flex;gap:14px;align-items:center;font-size:13px}
.card .thumb{width:44px;height:44px;border-radius:9px;background:#86aeb1}
.card b{display:block;font-weight:600;font-size:14px}
.dots{position:absolute;right:22px;bottom:30px;display:flex;gap:6px}
.dots i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.55)}
.dots i:first-child{background:#fff;width:22px;border-radius:4px}
.code,.tag,.dim{display:none}

</style></head>
<body class="${mode}">
<div class="chrome"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i>
  <div class="url">${mode === "xray" ? "view-source:forma.store" : "forma.store"}</div></div>
<div class="page">
  <nav data-x><span class="tag">&lt;Nav /&gt;</span>
    <span class="logo">forma</span>
    <span class="links"><span>Chairs</span><span>Tables</span><span>Lighting</span><span>Journal</span></span>
    <span class="cart">Cart <b>2</b></span>
    ${code(`<Nav links={categories} />`, "left:150px;top:22px")}
  </nav>
  <main>
    <div class="left">
      <div class="eyebrow" data-x><span class="tag">&lt;Eyebrow&gt;</span><span></span>New · The Nord chair</div>
      <h1 data-x><span class="tag">&lt;h1&gt;</span>Made to be<br><em>sat in.</em>
        ${code(`<h1 className="font-serif">
  Made to be <em>sat in.</em>
</h1>`, "left:258px;top:104px")}
      </h1>
      <p class="lede" data-x><span class="tag">&lt;p&gt;</span>Solid oak legs, a seat shaped around you, and a 12-year warranty. Built to outlast trends.
        
      </p>
      <div class="buy" data-x><span class="tag">&lt;Price /&gt; &lt;Swatches /&gt;</span>
        <span class="price">$240</span>
        <span class="sw"><i style="background:#161616"></i><i style="background:#c8a47a"></i><i style="background:#ffffff"></i></span>
        ${code(`<Price value={240} />`, "left:calc(100% + 22px);top:4px")}
      </div>
      <div class="actions" data-x><span class="tag">&lt;Actions&gt;</span>
        <a class="btn dark">Add to cart</a><a class="btn line">See it in your room</a>
        ${code(`<AddToCart />`, "left:calc(100% + 22px);top:10px")}
      </div>
      <div class="specs" data-x><span class="tag">&lt;Specs&gt;</span>
        <div><b>Solid oak</b>FSC certified</div><div><b>4.2 kg</b>Easy to move</div><div><b>Ships in 3 days</b>Free returns</div>
        
      </div>
    </div>
    <div class="media" data-x><span class="tag">&lt;Image priority /&gt;</span>
      <img src="${PHOTO}" alt="">
      ${code(`<Image
  src="/products/nord-black.jpg"
  alt="Nord chair in black"
  width={1200}
  height={1400}
  priority
  sizes="(min-width: 768px) 50vw, 100vw"
  className="rounded-3xl object-cover"
/>`, "left:22px;top:30px")}
      <span class="dim" style="right:14px;top:12px">560 × 612</span>
      <div class="card" data-x><span class="tag">&lt;ProductCard&gt;</span><span class="thumb"></span><span><b>Nord chair</b>Black · Oak legs</span>
        ${code(`<ProductCard {...product} />`, "left:0;top:-62px")}
      </div>
      <div class="dots"><i></i><i></i><i></i><i></i></div>
    </div>
  </main>
</div>
</body></html>`;


// The source view behind the lens: a code editor showing the page's JSX.
const SOURCE = `// app/products/nord/page.tsx · forma.store
import { Eyebrow, Price, Swatches, AddToCart } from "@/components"
import Image from "next/image"

export default function NordChair() {
  return (
    <main className="grid lg:grid-cols-2 gap-11 px-12">
      <section className="flex flex-col justify-center">
        <Eyebrow>New · The Nord chair</Eyebrow>
        <h1 className="font-serif text-8xl">
          Made to be <em>sat in.</em>
        </h1>
        <Price value={240} currency="USD" />
        <Swatches colors={["black", "oak", "white"]} />
        <AddToCart sku="NORD-BLK" />
      </section>
      <Image src="/nord-black.jpg" alt="Nord chair"
        width={1200} height={1400} priority />
    </main>
  )
}`;

const source = () => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=block">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:760px;overflow:hidden;background:#080b09;color:#89938d;-webkit-font-smoothing:antialiased}
.chrome{height:44px;display:flex;align-items:center;gap:8px;padding:0 18px;background:#0d1511;border-bottom:1px solid #1d2a23}
.chrome i{width:11px;height:11px;border-radius:50%;background:#2e3a33}
.url{margin-left:18px;width:460px;height:26px;border-radius:7px;background:#121a16;color:#8be5bd;font:12px 'JetBrains Mono';display:flex;align-items:center;padding:0 12px}
.tabs{height:40px;display:flex;border-bottom:1px solid #1d2a23;font:13px 'JetBrains Mono'}
.tabs span{padding:0 20px;display:flex;align-items:center;border-right:1px solid #1d2a23}
.tabs .on{color:#f5f7f6;background:#0d1511;box-shadow:inset 0 -2px #19c37d}
pre{padding:18px 0;font:400 21px/29px 'JetBrains Mono';white-space:pre}
pre div{display:flex}
pre b{width:72px;padding-right:22px;text-align:right;color:#34403a;font-weight:400;flex-shrink:0}
.status{position:absolute;left:0;right:0;bottom:0;height:30px;display:flex;gap:24px;align-items:center;padding:0 18px;background:#0d1511;border-top:1px solid #1d2a23;font:12px 'JetBrains Mono';color:#5a645e}
.status span:first-child{color:#19c37d}
</style></head><body>
<div class="chrome"><i></i><i></i><i></i><div class="url">view-source:forma.store</div></div>
<div class="tabs"><span class="on">page.tsx</span><span>Price.tsx</span><span>globals.css</span></div>
<pre>${hl(SOURCE).split("\n").map((l, i) => `<div><b>${i + 1}</b><span>${l || " "}</span></div>`).join("")}</pre>
<div class="status"><span>● compiled</span><span>TypeScript JSX</span><span>UTF-8</span><span>Ln 10, Col 11</span></div>
</body></html>`;

const profile = resolve("tools/.edge-profile");
for (const mode of ["front", "xray"]) {
  const htmlPath = join(OUT_HTML, `forma-${mode}.html`);
  writeFileSync(htmlPath, mode === "xray" ? source() : html(mode));
  const png = join(OUT_HTML, `forma-${mode}.png`);
  execFileSync(EDGE, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${profile}`,
    "--force-device-scale-factor=2", "--window-size=1200,760", "--virtual-time-budget=15000",
    `--screenshot=${png}`, `file:///${htmlPath.replace(/\\/g, "/")}`,
  ], { stdio: "ignore" });
  await sharp(png).resize(1400).webp({ quality: mode === "xray" ? 88 : 82 }).toFile(join(OUT_IMG, `forma-${mode}.webp`));
  console.log("ok", mode);
}
rmSync(profile, { recursive: true, force: true });
