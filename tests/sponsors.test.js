import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { sponsorLogos } from '../src/sponsors.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const expectedNames = [
  'Paavli Kultuurivabrik',
  'IDA',
  'HALL',
  'Kumu',
  'D3',
  'MOD',
  'EKKM',
  'Hungr',
  'Uus Laine',
  'Ülase 12',
  'FONOTEEK',
  'TOPS',
  'Plastik',
  'Kurvad Uudised Records',
  'Von Krahl',
  'EKA',
  'Biit Me',
  'Kino Sõprus',
  'Xinhai 1911',
  'Pudel',
  'Stuudio',
  'Burger Box',
  'Terminal',
  'Tallinn',
];

test('sponsor manifest exposes all 24 sponsors in the approved order', () => {
  assert.equal(sponsorLogos.length, 24);
  assert.deepEqual(sponsorLogos.map(({ alt }) => alt), expectedNames);
});

test('each sponsor item has accessible labels and a unique library path', () => {
  const paths = sponsorLogos.map(({ src }) => src);

  for (const item of sponsorLogos) {
    assert.match(item.src, /^\/assets\/sponsors\/[a-z0-9-]+\.(?:png|svg)$/);
    assert.ok(item.alt.trim());
    assert.ok(item.title.trim());
    assert.equal(item.title, item.alt);
    assert.match(item.href, /^https:\/\//);
    assert.equal(new URL(item.href).protocol, 'https:');
    assert.equal(typeof item.opticalScale, 'number');
    assert.ok(item.opticalScale >= 0.7 && item.opticalScale <= 1.3, `${item.alt} optical scale`);
  }

  assert.equal(new Set(paths).size, sponsorLogos.length);
});

test('every manifest asset exists and is recorded in SOURCES.md', () => {
  const sourcesPath = path.join(projectRoot, 'assets', 'sponsors', 'SOURCES.md');
  const sources = readFileSync(sourcesPath, 'utf8');

  for (const { src } of sponsorLogos) {
    const relativePath = src.replace(/^\//, '');
    assert.ok(existsSync(path.join(projectRoot, relativePath)), `missing ${relativePath}`);
    assert.match(sources, new RegExp(`\\| ${path.basename(src).replace('.', '\\.') } \\|`));
  }
});

test('fixed-height loop assets avoid extreme intrinsic aspect ratios', () => {
  for (const { src, alt } of sponsorLogos) {
    const assetPath = path.join(projectRoot, src.replace(/^\//, ''));
    const contents = readFileSync(assetPath);
    let width;
    let height;

    if (path.extname(assetPath) === '.png') {
      width = contents.readUInt32BE(16);
      height = contents.readUInt32BE(20);
    } else {
      const svg = contents.toString('utf8');
      const viewBox = svg.match(/viewBox=["'](?:[-\d.]+\s+){2}([\d.]+)\s+([\d.]+)["']/);
      assert.ok(viewBox, `${alt} SVG must expose a viewBox`);
      width = Number(viewBox[1]);
      height = Number(viewBox[2]);
    }

    assert.ok(width / height <= 5, `${alt} intrinsic aspect ratio is ${width / height}:1`);
  }
});

test('the official EKA lockup is mirrored into both sponsor asset trees', () => {
  const source = readFileSync(path.join(projectRoot, 'assets', 'sponsors', 'eka.svg'), 'utf8');
  const publicCopy = readFileSync(path.join(projectRoot, 'public', 'assets', 'sponsors', 'eka.svg'), 'utf8');

  assert.equal(publicCopy, source);
  assert.match(source, /viewBox="0 0 116\.85 40\.6"/);
  assert.match(source, /<title>EKA_LOGO_black<\/title>/);
});

test('the combined Tallinn crest and wordmark is mirrored into both sponsor asset trees', () => {
  const source = readFileSync(path.join(projectRoot, 'assets', 'sponsors', 'tallinn.svg'), 'utf8');
  const publicCopy = readFileSync(path.join(projectRoot, 'public', 'assets', 'sponsors', 'tallinn.svg'), 'utf8');

  assert.equal(publicCopy, source);
  assert.match(source, /viewBox="0 0 68\.7938 16\.6972"/);
  assert.match(source, /<title>Tallinn<\/title>/);
  assert.match(source, /<g transform="translate\(17\.7879 2\.0871\)">/);
});

test('the sponsor loop island uses the exact React LogoLoop integration contract', () => {
  const islandSource = readFileSync(path.join(projectRoot, 'src', 'sponsor-loop.jsx'), 'utf8');
  const componentSource = readFileSync(path.join(projectRoot, 'src', 'components', 'LogoLoop.jsx'), 'utf8');
  const packageJson = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));

  assert.match(islandSource, /import \{ createRoot \} from 'react-dom\/client';/);
  assert.match(islandSource, /import LogoLoop from '\.\/components\/LogoLoop\.jsx';/);
  assert.match(islandSource, /import \{ sponsorLogos \} from '\.\/sponsors\.js';/);
  assert.match(islandSource, /export function mountSponsorLoop\(element\)/);
  assert.match(islandSource, /speed=\{32\}/);
  assert.match(islandSource, /direction="left"/);
  assert.match(islandSource, /logoHeight=\{48\}/);
  assert.match(islandSource, /gap=\{48\}/);
  assert.match(islandSource, /pauseOnHover/);
  assert.match(islandSource, /fadeOut=\{false\}/);
  assert.match(islandSource, /scaleOnHover/);
  assert.match(islandSource, /ariaLabel="HELI venues and partners"/);
  assert.match(islandSource, /return \(\) => root\.unmount\(\);/);

  assert.match(componentSource, /const ANIMATION_CONFIG/);
  assert.match(componentSource, /ResizeObserver/);
  assert.match(componentSource, /copyCount/);
  assert.match(componentSource, /requestAnimationFrame/);
  assert.match(componentSource, /tabIndex=\{isDuplicate \? -1 : undefined\}/);
  assert.match(componentSource, /--logoloop-optical-scale/);
  assert.match(componentSource, /onFocusCapture=\{handleFocusCapture\}/);
  assert.match(packageJson.dependencies.react, /19\./);
  assert.match(packageJson.dependencies['react-dom'], /19\./);
});

test('the 48px sponsor gap remains a protected visual gutter during logo hover scaling', () => {
  const islandSource = readFileSync(path.join(projectRoot, 'src', 'sponsor-loop.jsx'), 'utf8');
  const componentCss = readFileSync(path.join(projectRoot, 'src', 'components', 'LogoLoop.css'), 'utf8');
  const homepageCss = readFileSync(path.join(projectRoot, 'src', 'styles.css'), 'utf8');

  assert.match(islandSource, /gap=\{48\}/);
  assert.match(componentCss, /\.logoloop__item\s*\{[^}]*margin-right:\s*var\(--logoloop-gap\);/s);
  assert.match(homepageCss, /\.paper-sponsor-loop \.logoloop__item\s*\{[^}]*max-width:\s*calc\(var\(--logoloop-logoHeight\) \* 5\);[^}]*position:\s*relative;[^}]*isolation:\s*isolate;/s);
  assert.match(homepageCss, /\.paper-sponsor-loop \.logoloop__item img\s*\{[^}]*max-width:\s*100%;/s);
});

test('the sponsor island suppresses native list markers without changing LogoLoop CSS', () => {
  const homepageCss = readFileSync(path.join(projectRoot, 'src', 'styles.css'), 'utf8');
  const componentCss = readFileSync(path.join(projectRoot, 'src', 'components', 'LogoLoop.css'), 'utf8');

  assert.match(homepageCss, /\.paper-sponsor-loop \.logoloop__list\s*\{[^}]*list-style:\s*none;[^}]*margin:\s*0;[^}]*padding:\s*0;/s);
  assert.doesNotMatch(componentCss, /list-style:\s*none/);
});
