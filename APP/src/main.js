import './style.css'
import { lex, structure, declarative, collectTypes, resolve } from './parser.js'

function clone(o) { return JSON.parse(JSON.stringify(o)) }

function initEditor(id) {
    if (!window.ace) {
       console.error("Ace Editor library is not loaded!");
       return null;
    }
    const editor = ace.edit(id);
    editor.setTheme("ace/theme/tomorrow_night_bright");
    editor.session.setMode("ace/mode/json");
    editor.setReadOnly(true);
    editor.setOptions({ fontSize: "14pt" });
    return editor;
}

async function start() {
    const ed1 = initEditor("editor1");
    const ed2 = initEditor("editor2");
    const ed3 = initEditor("editor3");
    const ed4 = initEditor("editor4");

    try {
        const res = await fetch('/main.fa');
        if (!res.ok) throw new Error("Failed to fetch public/main.fa");
        const code = await res.text();

        const t1 = lex(code);
        if(ed1) ed1.setValue(JSON.stringify(t1, null, 2), -1);

        const t2 = structure(clone(t1));
        if(ed2) ed2.setValue(JSON.stringify(t2, null, 2), -1);

        const t3 = declarative(clone(t2));
        if(ed3) ed3.setValue(JSON.stringify(t3, null, 2), -1);

        const registry = collectTypes(clone(t3));
        const t4 = resolve(clone(t3), registry);
        if(ed4) ed4.setValue(JSON.stringify({ registry, ast: t4 }, null, 2), -1);

    } catch (err) {
        console.error(err);
        if(ed1) ed1.setValue(`Error: ${err.message}`, -1);
    }
}

// Ace Initialization check
function run() {
    if (window.ace) {
        start()
    } else {
        setTimeout(run, 100);
    }
}

run();
