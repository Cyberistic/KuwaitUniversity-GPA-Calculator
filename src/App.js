import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import BigForm from "./BigForm.js";
import BottomBar from "./BottomBar";
import { stringify } from "querystring";
import Dropzone from "react-dropzone";
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";

// preparing for file upload, please ignore
function getFile(newfile) {
  if (newfile) {
    let parser = new DOMParser().parseFromString(newfile, "text/html");
    let schedule = parser.getElementsByClassName("c86")[0];
    let coursename = parser.getElementsByClassName("c18")[0];
    return [
      schedule.innerHTML,
      tableToJSON(coursename.innerHTML)._headers[0][0].split("Term: ")[1]
    ];
  } else {
    return "";
  }
}

function tableToJSON(table) {
  const HtmlTableToJson = require("html-table-to-json");
  return HtmlTableToJson.parse("<table>" + table + "</table>");
}

const useFetch = (url) => {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch(url)
      .then((res) => res.text())
      .then((data) => setData(data));
  }, [url]);

  return data;
};

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

  const onBigFormChange = (index, credits, grade, repeated, pastGrade) => {
    const newValues = {
      credits: credits,
      grade: grade,
      repeated: repeated,
      pastGrade: pastGrade
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
    if (
      prevFormValues.current === formValues &&
      prevPastValues.current === pastValues
    ) {
      return;
    }

    if (forms.length === 0) {
      setForms([0]);
      setKeyCounter(1);
    }

    const tempCredits = Object.values(formValues).reduce((a, b) => {
      const courseCredit = b.repeated === true ? 0 : parseInt(b.credits);
      return parseInt(a) + courseCredit;
    }, pastValues[0]);
    setTotalCredits(tempCredits);

    const tempCreditsByWeight = Object.values(formValues).reduce((a, b) => {
      if (parseInt(b.credits) === 0) {
        return parseFloat(a);
      }

      const subtractedCredits =
        b.repeated === true ? parseInt(b.credits) * parseFloat(b.pastGrade) : 0;

      return (
        parseFloat(a) +
        parseInt(b.credits) * parseFloat(b.grade) -
        subtractedCredits
      );
    }, pastValues[0] * pastValues[1]);
    setTotalCreditsByWeight(tempCreditsByWeight);
  }, [formValues, forms, prevFormValues, prevPastValues, pastValues]);

  useEffect(() => {
    const currentGpa = Number(totalCreditsByWeight / totalCredits).toPrecision(
      3
    );
    if (currentGpa > 4){
      setGpa(4.00);
    }
    else if (currentGpa === 'NaN') {
      setGpa(0.00);
    }
    else {
    setGpa(currentGpa);
    }
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
          <h1 className="text-2xl font-bold">KU GPA THINGY</h1>
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
      <BottomBar gpa={gpa} onBottomBarChange={onBottomBarChange} />
    </div>
  );
}

export default App;
