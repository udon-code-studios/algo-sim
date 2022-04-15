import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import * as constants from "../constants";

// editor starting values
const defaultJavaScriptValue = "function add(a, b) {\n\t// complete function\n\treturn (99);\n}";
const defaultPythonValue = "def add(a, b):\n\t# complete function\n\treturn (99)";

export default function Add() {
  const [editor, setEditor] = useState(null);
  const [editorValue, setEditorValue] = useState(defaultJavaScriptValue);

  // form fields
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  // results
  const [c, setC] = useState(null);
  const [output, setOutput] = useState(null);

  // change default editor value when new language is selected
  useEffect(() => {
    switch (language) {
      case "javascript":
        setEditorValue(defaultJavaScriptValue);
        break;
      case "python":
        setEditorValue(defaultPythonValue);
        break;
      default:
        console.log("[ ERROR ] - unknown language:", language);
        break;
    }
  }, [language]);

  // call backend to execute code on form submission
  function handleSubmit(event) {
    console.log('[ STATUS ] making POST request to /add -', Date());

    fetch(`${constants.BACKEND_URI}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        a: a.toString(), // string
        b: b.toString(), // string
        language: language, // string
        code: code, // string
      }),
    }).then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log('[ STATUS ] POST request to /add succeeded -', Date());
          console.log('[ DATA ] -', data);
          setC(data.c);
          setOutput(data.output);
        });
      } else {
        response.json().then(error => {
          console.log('[ STATUS ] POST request to /add failed -', Date());
          console.log('[ ERROR ] -', error);
        });
      }
    });

    // prevent default form submission
    event.preventDefault();
  }

  // update states with form field values
  function handleInputChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case "language":
        setLanguage(value);
        break;
      case "a":
        setA(value);
        break;
      case "b":
        setB(value);
        break;
      default:
        console.log('[ ERROR ] -', `Unknown input name: ${name}`);
        break;
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-500">
      {/* back button */}
      <Link to="/" className="absolute top-10 left-10">
        <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-xl">Back</button>
      </Link>

      <h1 className="mt-4 text-4xl font-bold">Just an add function...</h1>

      <form onSubmit={handleSubmit} className="m-4 flex w-full max-w-xl flex-col rounded-2xl bg-gray-200 font-mono">
        {/* language selctor */}
        <div className="flex w-full max-w-xl justify-end space-x-2 rounded-t-2xl bg-black px-3 pt-2 pr-6 font-mono text-gray-300">
          <label>select language</label>
          <select
            name="language"
            onChange={handleInputChange}
            className="bg-gray-700"
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
            value={editorValue}
            onMount={(editor, _) => {
              setEditor(editor);
            }}
          />
        </div>

        {/* argument inputs */}
        <div className="m-4 flex justify-center space-x-8 ">
          <label className="text-xl font-extrabold">
            A
            <input
              name="a"
              type="text"
              defaultValue={101}
              onChange={handleInputChange}
              className="ml-2 w-20 text-center"
            />
          </label>
          <label className="text-xl font-extrabold">
            B
            <input
              name="b"
              type="text"
              defaultValue={722}
              onChange={handleInputChange}
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
            className="w-72 rounded-md bg-teal-500 font-mono shadow-xl duration-300 hover:bg-teal-900 hover:text-teal-200"
          >
            execute code
          </button>
        </div>
      </form>

      {/* output */}
      <div className="h-80 max-w-xl space-y-4">
        <p className="text-center font-bold">
          {c && `Result: ${c}`}
        </p>
        <pre>{output && output}</pre>
      </div>
    </div>
  );
}
