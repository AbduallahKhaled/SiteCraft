// Tiny JSX highlighter shared by the hero x-ray (canvas) and the CTA compare (DOM).
export type Token = { t: string; c: string };

export const CODE_COLORS = {
  text: "#89938d",
  comment: "#5a645e",
  keyword: "#19c37d",
  string: "#f5f7f6",
  tag: "#8be5bd",
  number: "#e6c07b",
  brace: "#6b756f",
  lineNo: "#2f3d35",
};

const SPLIT = /("[^"]*"|<\/?[A-Za-z.]+|\/>|\b(?:import|from|export|default|function|return|const)\b|\{|\}|\b\d+\b)/g;
const KEYWORD = /^(import|from|export|default|function|return|const)$/;

export function tokenize(line: string): Token[] {
  if (line.trim().startsWith("//")) return [{ t: line, c: CODE_COLORS.comment }];
  return line
    .split(SPLIT)
    .filter(Boolean)
    .map((p) => {
      if (p.startsWith('"')) return { t: p, c: CODE_COLORS.string };
      if (KEYWORD.test(p)) return { t: p, c: CODE_COLORS.keyword };
      if (p.startsWith("<") || p === "/>") return { t: p, c: CODE_COLORS.tag };
      if (/^\d+$/.test(p)) return { t: p, c: CODE_COLORS.number };
      if (p === "{" || p === "}") return { t: p, c: CODE_COLORS.brace };
      return { t: p, c: CODE_COLORS.text };
    });
}
