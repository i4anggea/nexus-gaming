/** Formato determinista para nuestras plantillas HTML, sin dependencias. */
export function formatHTML(html) {
  const tokens = html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || [];
  const voidElements = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
    'param', 'source', 'track', 'wbr',
  ]);
  const lines = [];
  let depth = 0;

  const content = tokens.map((token) => token.trim()).filter(Boolean);
  for (let index = 0; index < content.length; index += 1) {
    const token = content[index];
    if (!token) continue;
    const tag = token.match(/^<([\w-]+)/)?.[1].toLowerCase();
    // Un elemento con texto simple se lee mejor en una línea; los contenedores
    // conservan su sangría y sus hijos en líneas separadas.
    if (tag && !content[index + 1]?.startsWith('<') && content[index + 2] === `</${tag}>`) {
      lines.push(`${'  '.repeat(depth)}${token}${content[index + 1]}</${tag}>`);
      index += 2;
      continue;
    }
    if (token.startsWith('</')) depth = Math.max(0, depth - 1);
    lines.push(`${'  '.repeat(depth)}${token}`);
    if (token.startsWith('<') && !/^<[/!?]/.test(token)) {
      if (tag && !voidElements.has(tag) && !token.endsWith('/>')) depth += 1;
    }
  }
  return `${lines.join('\n')}\n`;
}
