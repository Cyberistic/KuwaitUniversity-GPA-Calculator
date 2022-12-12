import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [forms, setForms] = useState([<BigForm />]);
  return (
    <div className="App ">
      <body class="flex flex-col min-h-screen  bg-slate-300">
        <div class="flex ">
          <div class="p-5">01</div>
          <div class="p-5">02</div>
          <div class="p-5">03</div>
        </div>

        <button onClick={(e) => setForms([...forms, <BigForm />])}>Add</button>
        <button onClick={(e) => setForms([])}>Clear</button>

        <button onClick={(e) => console.log(forms)}>Log</button>
        <div>{forms}</div>
      </body>
    </div>
  );
}

function BigForm() {
  return (
    <form class="flex flex-row">
      <div className="mb-4 p-5">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="credits"
        >
          Credits
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="credits"
          type="text"
          placeholder="Enter number of credits"
        />
      </div>
      <div className="mb-4 p-5">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="repeated"
        >
          Repeated
        </label>
        <input
          className="shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="repeated"
          type="checkbox"
        />
      </div>
      <div className="mb-4 p-5">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="grade"
        >
          Grade
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="grade"
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
        </select>
      </div>
    </form>
  );
}
export default App;
