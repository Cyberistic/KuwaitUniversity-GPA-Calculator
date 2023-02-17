import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

const grades = {
  A: 4,
  "A-": 3.67,
  "B+": 3.33,
  B: 3,
  "B-": 2.67,
  "C+": 2.33,
  C: 2,
  "C-": 1.67,
  "D+": 1.33,
  D: 1,
  F: 0
};

function App() {
  const [forms, setForms] = useState([0]);
  const [keyCounter, setKeyCounter] = useState(1);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalCreditsByWeight, setTotalCreditsByWeight] = useState(0);

  const [formValues, setFormValues] = useState({});

  const onBigFormChange = (index, credits, grade, repeated) => {
    // console.log(index, credits, grade, repeated);
    // sum all credits in forms
    // setTotalCredits();
    // console.log(forms);
    const newValues = {
      credits: credits,
      grade: grade,
      repeated: repeated
    };
    setFormValues({ ...formValues, [index]: newValues });
    // sum all credits in formValues and log them
  };
  const deleteForm = (index) => {
    // const newForms = forms.filter((form) => form.index !== index);
    // setForms(newForms);
    // console.log(index);
    setForms(forms.filter((form) => form !== index));
  };

  useEffect(() => {
    const tempCredits = Object.values(formValues).reduce(
      (a, b) => parseInt(a) + parseInt(b.credits),
      0
    );
    setTotalCredits(tempCredits);
    const tempCreditsByWeight = Object.values(formValues).reduce(
      (a, b) => parseInt(a) + parseInt(b.credits) * parseFloat(b.grade),
      0
    );
    console.log(formValues);
    setTotalCreditsByWeight(tempCreditsByWeight);
    console.log(tempCreditsByWeight);
  }, [formValues, forms]);

  const addForm = () => {
    setKeyCounter((prev) => prev + 1);
    const newKey = keyCounter;
    setForms([...forms, newKey]);
  };

  const clearForms = () => {
    setForms([0]);
    setKeyCounter(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            GPA ={" "}
            {totalCredits > 0
              ? Number(totalCreditsByWeight / totalCredits).toPrecision(3)
              : 0}
          </h1>
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
          {forms.map((form) => (
            <BigForm
              key={form}
              index={form}
              delete={deleteForm}
              onBigFormChange={onBigFormChange}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
function BigForm(props) {
  const [credits, setCredits] = useState(0);
  const [repeated, setRepeated] = useState(false);
  const [grade, setGrade] = useState(4);

  const onCreditsChange = (credits) => {
    // check if credit is a whole number (integer)
    // check if number is not e (exponential)

    if (Number.isInteger(parseInt(credits)) || credits === "") {
      if (credits > 9) {
        setCredits(9);
      } else if (credits < 0) {
        setCredits(0);
      } else {
        // check if float
        if (credits % 1 !== 0) {
          setCredits(Math.floor(credits));
        } else {
          setCredits(credits);
        }
      }
    }
  };

  useEffect(() => {
    props.onBigFormChange(props.index, credits, grade, repeated);
  }, [credits, grade, props, repeated]);
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-medium mb-4">Class {props.index + 1}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-700 font-medium block mb-2">
            Credits
          </label>
          <input
            type="number"
            min={0}
            max={9}
            className="border border-gray-300 p-2 rounded w-full"
            value={credits}
            onChange={(e) => onCreditsChange(e.target.value)}
          />
        </div>
        <div>
          <label className="text-gray-700 font-medium block mb-2">Grade</label>
          <select
            className="border border-gray-300 p-2 rounded w-full"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            {Object.keys(grades).map((key) => (
              <option value={grades[key]}>{key}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-3 flex justify-center items-center ">
        <input
          onChange={(e) => setRepeated(e.target.value)}
          id="default-checkbox"
          type="checkbox"
          value={repeated}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Repeated
        </label>
      </div>
      <div className="mt-4 flex justify-center items-center">
        {props.index === 0 ? null : (
          <button
            onClick={() => props.delete(props.index)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
export default App;
