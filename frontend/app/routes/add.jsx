// file: app/routes/add.jsx

import { useEffect, useState } from "react";
import { useFetcher } from "remix";
import Editor from "@monaco-editor/react";

export default function Add() {
  const [editor, setEditor] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const fetcher = useFetcher();

  const defaultJavaScriptValue =
    "function add(a, b) {\n\t// complete function\n\treturn (99);\n}";
  const defaultPythonValue =
    "def add(a, b):\n\t# complete function\n\treturn (99)";
  const [value, setValue] = useState(defaultJavaScriptValue);

  // change default editor value when new language is selected
  useEffect(() => {
    switch (language) {
      case "javascript":
        setValue(defaultJavaScriptValue);
        break;
      case "python":
        setValue(defaultPythonValue);
        break;
    }
  }, [language]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-500">
      <h1 className="mt-4 text-4xl font-bold">Just an add function...</h1>

      <fetcher.Form
        method="post"
        action="/api/add"
        className="m-4 flex w-full max-w-xl flex-col rounded-2xl bg-gray-200 font-mono"
      >
        {/* language selctor */}
        <div className="flex w-full max-w-xl justify-end space-x-2 rounded-t-2xl bg-black px-3 pt-2 pr-6 font-mono text-gray-300">
          <label>select language</label>
          <select
            name="language"
            className="bg-gray-700"
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
        </div>

        {/* code editor */}
        <div className="h-80 w-full max-w-xl rounded-b-2xl bg-black p-3">
          <Editor
            theme="vs-dark"
            language={language}
            value={value}
            onMount={(editor, _) => {
              setEditor(editor);
            }}
          />
        </div>

        {/* hidden code input */}
        <input name="code" type="hidden" value={code} />

        {/* argument inputs */}
        <div className="m-4 flex justify-center space-x-8 ">
          <label className="text-xl font-extrabold">
            A
            <input
              name="a"
              type="text"
              defaultValue={101}
              className="ml-2 w-20 text-center"
            />
          </label>
          <label className="text-xl font-extrabold">
            B
            <input
              name="b"
              type="text"
              defaultValue={722}
              className="ml-2 w-20 text-center"
            />
          </label>
        </div>

        {/* form submission */}
        <div className="mb-4 flex justify-center">
          <button
            type="submit"
            onClick={() => {
              if (editor) setCode(editor.getValue());
            }}
            className="w-72 rounded-md bg-teal-500 font-mono shadow-xl"
          >
            execute code
          </button>
        </div>
      </fetcher.Form>

      {/* output */}
      <div className="h-80 max-w-xl space-y-4">
        <p className="text-center font-bold">
          {fetcher.type === "done" && `Result: ${fetcher.data.c}`}
          {fetcher.state === "submitting" && "submitting request..."}
        </p>
        <pre>{fetcher.type === "done" && fetcher.data.output}</pre>
      </div>
    </div>
  );
}
