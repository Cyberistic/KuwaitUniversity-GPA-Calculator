import "./App.css";
import { useState, useEffect, useRef } from "react";
import BigForm from "./BigForm.js";

function App() {
  const [forms, setForms] = useState([0]);
  const [keyCounter, setKeyCounter] = useState(1);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalCreditsByWeight, setTotalCreditsByWeight] = useState(0);
  const [formValues, setFormValues] = useState({});
  const prevFormValues = useRef({});

  const onBigFormChange = (index, credits, grade, repeated) => {
    const newValues = {
      credits: credits,
      grade: grade,
      repeated: repeated
    };
    setFormValues({ ...formValues, [index]: newValues });
  };

  const deleteForm = (index) => {
    setForms(forms.filter((form) => form !== index));
    delete formValues[index];
    setFormValues(formValues);
  };
  const clearForms = () => {
    // Erase all forms and reset state
    // then add a new empty form
    setForms([]);
    setKeyCounter(0);
    setTotalCredits(0);
    setTotalCreditsByWeight(0);
    setFormValues({});
  };
  
  useEffect(() => {
    if (prevFormValues.current === formValues) {
      return; // skip update
    }

    if (forms.length === 0) {
      setForms([0]);
      setKeyCounter(1)
    }

    const tempCredits = Object.values(formValues).reduce(
      (a, b) => parseInt(a) + parseInt(b.credits),
      0
    );
    setTotalCredits(tempCredits);

    const tempCreditsByWeight = Object.values(formValues).reduce(
      (a, b) => {
        if (parseInt(b.credits) === 0) {
          return parseFloat(a);
        }
        return parseFloat(a) + parseInt(b.credits) * parseFloat(b.grade);
      },
      0
    );
    setTotalCreditsByWeight(tempCreditsByWeight);

    prevFormValues.current = formValues;
  }, [formValues, forms, prevFormValues]);

  const addForm = () => {
    setKeyCounter((prev) => prev + 1);
    const newKey = keyCounter;
    setForms([...forms, newKey]);
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

export default App;
