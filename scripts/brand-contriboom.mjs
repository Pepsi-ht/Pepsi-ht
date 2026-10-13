import { readFileSync, writeFileSync } from "node:fs";

const START = "<!-- contriboom-pepsi:start -->";
const END = "<!-- contriboom-pepsi:end -->";

const files = process.argv.slice(2);
if (files.length === 0) {
  throw new Error("Usage: node scripts/brand-contriboom.mjs <svg...>");
}

function brandSvg(file) {
  let svg = readFileSync(file, "utf8");
  svg = svg.replace(new RegExp(`${START}[\\s\\S]*?${END}`, "g"), "");

  const animated = svg.includes('<g id="player"');
  const duration = svg.match(/\bdur="([^"]+)"/)?.[1] ?? '38.16s';
  const opacity = animated
    ? '<animate attributeName="opacity" dur="' + duration + '" repeatCount="indefinite" calcMode="linear" keyTimes="0;0.14544;0.208595;0.931866;0.973795;1" values="1;1;0;0;1;1"/>'
    : "";
  const brand = `${START}
<style id="pepsi-brand-style">#contributions &gt; g[data-cell] { display: none; }</style>
<g id="pepsi-wordmark" opacity="1">
${opacity}
<text x="588" y="101" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="92" font-weight="900" font-style="italic" textLength="360" lengthAdjust="spacingAndGlyphs" fill="#2da44e">Pepsi</text>
</g>
${END}`;

  const insertAt = animated ? svg.indexOf('<g id="player"') : svg.lastIndexOf("</svg>");
  if (insertAt < 0) {
    throw new Error(`Could not find SVG insertion point in ${file}`);
  }

  svg = `${svg.slice(0, insertAt)}${brand}${svg.slice(insertAt)}`;
  writeFileSync(file, svg);
}

for (const file of files) {
  brandSvg(file);
}