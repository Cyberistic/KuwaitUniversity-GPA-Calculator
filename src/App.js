import "./App.css";
import { useState, useEffect, useRef } from "react";
import BigForm from "./BigForm.js";
import BottomBar from "./BottomBar";

function App() {
  const [forms, setForms] = useState([0]);
  const [keyCounter, setKeyCounter] = useState(1);
  const [totalCredits, setTotalCredits] = useState(0);
  const [totalCreditsByWeight, setTotalCreditsByWeight] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [pastValues, setPastValues] = useState([]);
  const [gpa, setGpa] = useState(0);

  const prevFormValues = useRef({});
  const prevPastValues = useRef([]);

  const onBigFormChange = (index, credits, grade, repeated) => {
    const newValues = {
      credits: credits,
      grade: grade,
      repeated: repeated,
    };
    setFormValues({ ...formValues, [index]: newValues });
  };

  const onBottomBarChange = (pastGpa, pastCredits) => {
    const newValues = [pastCredits, pastGpa];
    setPastValues(newValues);
  };

  const deleteForm = (index) => {
    const updatedForms = forms.filter((form) => form !== index);
    setForms(updatedForms);
    const updatedFormValues = { ...formValues };
    delete updatedFormValues[index];
    setFormValues(updatedFormValues);
  };

  const clearForms = () => {
    setForms([]);
    setKeyCounter(0);
    setTotalCredits(0);
    setTotalCreditsByWeight(0);
    setFormValues({});
    setPastValues([]);
    setGpa(0);
  };

  useEffect(() => {
    if (prevFormValues.current === formValues && prevPastValues.current === pastValues) {
      return;
    }
  
    if (forms.length === 0) {
      setForms([0]);
      setKeyCounter(1);
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
  }, [formValues, forms, prevFormValues, prevPastValues]);
  
  useEffect(() => {
    if (pastValues.length === 0 && totalCredits === 0) {
      setGpa(0);
    } else if (pastValues.length === 0) {
      const currentGpa = Number(totalCreditsByWeight / totalCredits).toPrecision(3);
      setGpa(currentGpa);
    } else if (totalCredits === 0) {
      setGpa(pastValues[1].toPrecision(3));
    } else {
      const currentGpa = Number(totalCreditsByWeight / totalCredits).toPrecision(3);
      const pastGpa = pastValues[1];
      const pastCredits = pastValues[0];
      const weightedAvg = ((pastGpa * pastCredits) + (currentGpa * totalCredits)) / (pastCredits + totalCredits);
      setGpa(weightedAvg.toPrecision(3));
    }
  
    prevPastValues.current = pastValues;
  }, [pastValues, totalCredits, totalCreditsByWeight]);
  
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
            KU GPA THINGY
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
      <BottomBar gpa={gpa}
              onBottomBarChange={onBottomBarChange}/>
    </div>
  );
}

export default App;
