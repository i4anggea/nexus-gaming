import { readdir, readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(target) : [target];
  }));
  return groups.flat();
}

const files = await filesIn('src');
for (const file of files.filter((name) => name.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr);
}

const html = await readFile('dist/index.html', 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
if (new Set(ids).size !== ids.length) throw new Error('Hay identificadores HTML repetidos.');
if (/\{\{\w+\}\}/.test(html)) throw new Error('Hay componentes sin resolver.');

const references = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((value) => !/^(?:https?:|data:|#|mailto:)/.test(value));
const css = await readFile('dist/style.css', 'utf8');
references.push(...[...css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map((match) => match[1]));
for (const reference of new Set(references)) await access(path.join('dist', reference));
for (const file of (await filesIn('dist')).filter((name) => name.endsWith('.js'))) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/from ['"](\.[^'"]+)['"]/g)) {
    await access(path.resolve(path.dirname(file), match[1]));
  }
}
console.log(`Verificación correcta: sintaxis JS, ${ids.length} IDs únicos y recursos locales disponibles.`);
