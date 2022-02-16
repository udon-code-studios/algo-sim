import { useRef, useState } from 'react';
import Editor from "@monaco-editor/react";

export default function Index() {
  const [editor, setEditor] = useState(null);
  const [code, setCode] = useState('');

  return (
    <div className='w-screen flex flex-col items-center space-y-4'>
      <h1 className='text-4xl font-bold'>Welcome to AlgoSim</h1>

      <button
        onClick={() => { if (editor) setCode(editor.getValue()) }}
        className='w-72 bg-emerald-500 shadow rounded font-mono hover:shadow-lg'
      >
        capture editor contents
      </button>

      <div className='flex space-x-4'>
        {/* code editor */}
        <div className='w-96 h-96'>
          <h1 className='pb-2 text-xl'>Code Editor:</h1>
          <Editor
            theme='vs-dark'
            defaultLanguage='javascript'
            defaultValue='// some comment'
            onMount={(editor, _) => {
              setEditor(editor)
            }}
          />
        </div>

        {/* captured text */}
        <div className='w-96 h-96'>
          <h1 className='pb-2 text-xl'>Captured Text:</h1>
          <pre>{code}</pre>
        </div>
      </div>

    </div>
  );
}
