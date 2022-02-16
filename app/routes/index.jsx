import { useRef, useState } from 'react';
import Editor from "@monaco-editor/react";

export default function Index() {
  const [editor, setEditor] = useState(null);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>

      <button onClick={() => { if (editor) console.log(editor.getValue()) }}>print value</button>

      <div style={{ width: '600px', height: '500px', borderStyle: 'solid', }}>
        <Editor
          theme="vs-dark"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          onMount={(editor, _) => {
            setEditor(editor)
          }}
        />
      </div>
    </div>
  );
}
