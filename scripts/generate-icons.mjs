/**
 * Renders every icon and the social card from the brand marks in `public/`.
 *
 * The marks are the application's own SVGs, copied from the Suite Level client,
 * so the site, the favicon and the share card are all the same logo rather than
 * three drawings of it. Re-run with `bun run icons` after changing a mark.
 *
 * Outputs (all committed, so a deploy never depends on this script running):
 *   favicon.ico          16/32/48, the sizes Windows and older browsers ask for
 *   apple-touch-icon.png 180, opaque - iOS composites no alpha and would
 *                        otherwise put the mark on a black tile
 *   icon-192/512.png     manifest and Android
 *   og-image.png         1200x630 share card
 */
import { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');

const PAPER = '#F8FAFC';
const RAIL = '#333333';
const ACCENT = '#F19220';

const square = await fs.readFile(path.join(pub, 'suite-level-square.svg'));

/** The mark, centred on a square tile with breathing room around it. */
async function tile(size, background, padRatio = 0.18) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const mark = await sharp(square, { density: 600 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer();
}

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const paper = { r: 0xf8, g: 0xfa, b: 0xfc, alpha: 1 };

await fs.writeFile(path.join(pub, 'icon-192.png'), await tile(192, transparent));
await fs.writeFile(path.join(pub, 'icon-512.png'), await tile(512, transparent));
// iOS ignores transparency and composites onto black, so this one is opaque.
await fs.writeFile(path.join(pub, 'apple-touch-icon.png'), await tile(180, paper, 0.14));

/* ---- favicon.ico ----
   The ICO container holds PNG frames directly, which is what every browser that
   still asks for a .ico supports. Built by hand because sharp has no ICO
   encoder: a 6-byte header, one 16-byte directory entry per frame, then the
   frames back to back. */
const icoSizes = [16, 32, 48];
const frames = await Promise.all(
  icoSizes.map(async (s) => sharp(await tile(s * 4, transparent, 0.1)).resize(s, s).png().toBuffer()),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = icon
header.writeUInt16LE(frames.length, 4);

let offset = 6 + frames.length * 16;
const entries = frames.map((frame, i) => {
  const e = Buffer.alloc(16);
  // 0 in the width/height byte means 256; none of our sizes reach it.
  e.writeUInt8(icoSizes[i] === 256 ? 0 : icoSizes[i], 0);
  e.writeUInt8(icoSizes[i] === 256 ? 0 : icoSizes[i], 1);
  e.writeUInt8(0, 2); // palette colours: 0 for a true-colour PNG frame
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(frame.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += frame.length;
  return e;
});
await fs.writeFile(path.join(pub, 'favicon.ico'), Buffer.concat([header, ...entries, ...frames]));

/* ---- og-image.png ----
   Drawn as SVG and rasterised, rather than generated, so the wordmark and the
   headline are the real ones and stay legible at the size a timeline shows
   them. The type is converted to paths by no one: it is set in the system sans
   stack, which resvg resolves at render time, so the file must be regenerated
   if the headline changes. */
const OG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="14" fill="${ACCENT}"/>
  <g transform="translate(88, 150)">
    <text x="0" y="0" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="27" font-weight="600"
          letter-spacing="6" fill="#64748B">SUITE LEVEL</text>
    <text x="0" y="112" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="92" font-weight="700"
          letter-spacing="-3.4" fill="#0F172A">Your market.</text>
    <text x="0" y="214" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="92" font-weight="700"
          letter-spacing="-3.4" fill="#0F172A">Your portfolio.</text>
    <text x="0" y="292" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" font-weight="400"
          fill="#475569">Tenants in the market, lease comps, supply and</text>
    <text x="0" y="336" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" font-weight="400"
          fill="#475569">client reporting, in one system.</text>
  </g>
  <rect x="88" y="524" width="150" height="5" rx="2.5" fill="${ACCENT}"/>
  <rect x="0" y="616" width="1200" height="14" fill="${RAIL}"/>
</svg>`;

const ogMark = await sharp(square, { density: 600 }).resize(250, 250, { fit: 'contain', background: transparent }).png().toBuffer();
await sharp(Buffer.from(OG))
  .composite([{ input: ogMark, top: 180, left: 860 }])
  .png()
  .toFile(path.join(pub, 'og-image.png'));

console.log('icons + og-image written to public/');
