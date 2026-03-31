export function lex(text) {
  const lines = text.split(/\n/);
  return lines.map((line, i) => {
    if (!line.trim()) return null;
    line = line.replace(/".*$/,'')
    const indent = line.match(/^\s*/)[0].length / 4;
    const raw = line.trim();

    if (raw.startsWith('@')) {
      const parts = raw.slice(1).split(/\s+/);
      return { phase: 'lex', kind: 'Decorator', name: parts[0], args: parts.slice(1), indent, line: i + 1 };
    }

    const tokens = raw.split(/\s+/).map(v => isNaN(v) ? v : Number(v));
    return { phase: 'lex', kind: 'Words', tokens, indent, line: i + 1 };
  }).filter(Boolean);
}

export function structure(tokens) {
    const root = { type: 'file', children: [] };
    let activeDecorator = null;
    let stack = [];

    for (const t of tokens) {
        if (t.kind === 'Decorator') {
            const node = {
                type: t.name,
                subject: null,
                args: t.name=='include'? t.args : [],
                children: [],
            };
            root.children.push(node);
            activeDecorator = node;
            stack = [{ indent: t.indent, node }];
            continue;
        }

        if (!activeDecorator) continue;

        if (activeDecorator.type === 'include' && t.indent === 1) {
            activeDecorator.args.push(...(t.tokens));
            continue;
        }

        if (activeDecorator.subject === null && t.indent === stack[0].indent) {
            activeDecorator.subject = t.tokens.shift();
            activeDecorator.args = t.tokens;
            continue;
        }

        while (stack.length && t.indent <= stack[stack.length - 1].indent) {
            stack.pop();
        }

        const parent = stack.length ? stack[stack.length - 1].node : activeDecorator;
        const node = { kind: 'Words', tokens: t.tokens, children: [] };
        parent.children.push(node);
        stack.push({ indent: t.indent, node });
    }
    return root;
}

export function declarative(tree) {
      const registry = {};
      const output = { type: "file", children: [], registry };

      for (const node of tree.children) {
        if (node.type === "type") {
          const schema = {};
          for (const w of node.children) {
            const [key, ...types] = w.tokens;
            schema[key] = types;
          }
          registry[node.subject] = schema;
        }
        else if (node.type === "include") {
          output.children.push({
            type: node.type,
            children: node.args
          });
        }
        else {
          const schema = registry[node.type];
          if (!schema) continue; 
          
          const parts = node.subject.split(/\s+/);
          const name = parts[0];

          const props = {};
          for (let i = 1; i < parts.length;) {
            const key = parts[i++];
            const arity = schema[key] ? schema[key].length : 0;
            if (arity > 0) {
              props[key] = parts.slice(i, i + arity).map(Number);
            }
            i += arity;
          }

          const children = node.children.map(w => {
            const toks = w.tokens;
            const target = toks[0];
            const p = {};
            for (let i = 1; i < toks.length;) {
              const key = toks[i++];
              const arity = schema[key] ? schema[key].length : 0;
              if (arity > 0) {
                 p[key] = toks.slice(i, i + arity);
              }
              i += arity;
            }
            return {
              type: node.type + ".child",
              target,
              props: p,
              children: []
            };
          });

          output.children.push({
            type: node.type,
            name,
            props,
            children
          });
        }
      }
      return output;
}

export function collectTypes(ast) {
  return ast.registry;
}

export function resolve(ast, registry) {
  for (const node of ast.children) {
    if (node.type !== 'type') {
      node.schema = registry[node.type] || null;
    }
  }
  return ast;
}
