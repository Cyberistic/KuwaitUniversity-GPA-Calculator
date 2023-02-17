import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  
  const [forms, setForms] = useState([0]);
  const [keyCounter, setKeyCounter] = useState(1);
  
  const deleteForm = (index) => {
    // const newForms = forms.filter((form) => form.index !== index);
    // setForms(newForms);
    console.log(index);
    setForms(forms.filter((form) => form !== index));
    
  }
  
  const addForm = () => {
    setKeyCounter((prev) => (prev + 1))
    const newKey = keyCounter;
    setForms([...forms, newKey]);
  }

  const clearForms = () => {
    setForms([0]);
    setKeyCounter(1);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">GPA Calculator</h1>
          <div className="flex">
            <button 
              className="bg-indigo-500 hover:bg-indigo-800 text-white font-medium py-2 px-4 rounded mr-4"
              onClick={addForm}
            >
              Add Course
            </button>
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
              onClick={clearForms}
            >
              Clear All
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {forms.map((form) => <BigForm key={form} index={form} delete={deleteForm}/>)}
        </div>
      </main>
    </div>
  );
}
function BigForm(props) {
  const [credits, setCredits] = useState("");
  const [repeated, setRepeated] = useState(false);
  const [grade, setGrade] = useState("A");

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-medium mb-4">Class {props.index + 1}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-700 font-medium block mb-2">Credits</label>
          <input
            type="number"
            className="border border-gray-300 p-2 rounded w-full"
            value={credits}
            onChange={e => setCredits(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-700 font-medium block mb-2">Grade</label>
          <select 
            className="border border-gray-300 p-2 rounded w-full"
            value={grade}
            onChange={e => setGrade(e.target.value)}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
        </div>
      </div>
      <div className="mt-3 flex justify-center items-center ">
        <input onChange={e => setRepeated(e.target.value)} id="default-checkbox" type="checkbox" value={repeated} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <label for="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Repeated</label>
      </div>
      <div className="mt-4 flex justify-center items-center">
      {props.index === 0 ? null : <button onClick={() => props.delete(props.index)} className= "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Delete</button>} 
      </div>
    </div>
  );
}
export default App;
