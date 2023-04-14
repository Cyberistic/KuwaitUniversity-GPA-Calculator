import "./App.css";
import { useState, useEffect } from "react";
import BigForm from "./BigForm.js";
import BottomBar from "./BottomBar";
// import { stringify } from "querystring";
// import Dropzone from "react-dropzone";
// import html2canvas from "html2canvas";
// import downloadjs from "downloadjs";

// import Select from "react-select";
import { read, utils } from "xlsx";
// preparing for file upload, please ignore
// function getFile(newfile) {
//   if (newfile) {
//     let parser = new DOMParser().parseFromString(newfile, "text/html");
//     let schedule = parser.getElementsByClassName("c86")[0];
//     let coursename = parser.getElementsByClassName("c18")[0];
//     return [
//       schedule.innerHTML,
//       tableToJSON(coursename.innerHTML)._headers[0][0].split("Term: ")[1]
//     ];
//   } else {
//     return "";
//   }
// }

// function tableToJSON(table) {
//   const HtmlTableToJson = require("html-table-to-json");
//   return HtmlTableToJson.parse("<table>" + table + "</table>");
// }

// const useFetch = (url) => {
//   const [data, setData] = useState("");

//   useEffect(() => {
//     fetch(url)
//       .then((res) => res.text())
//       .then((data) => setData(data));
//   }, [url]);

//   return data;
// };

const CURTERM = 1868;

function App() {
  const [forms, setForms] = useState({});

  const [totalCredits, setTotalCredits] = useState(0);
  const [totalCreditsByWeight, setTotalCreditsByWeight] = useState(0);

  const [pastValues, setPastValues] = useState([]);
  const [gpa, setGpa] = useState(0);

  const [students, setStudents] = useState([]);

  /* Fetch and update the state once */
  useEffect(() => {
    if (Object.keys(forms).length === 0) {
      addForm();
    }
    (async () => {
      const f = await (await fetch("courses.xlsx")).arrayBuffer();
      const wb = read(f); // parse the array buffer
      const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
      const data = utils.sheet_to_json(ws); // generate objects
      const transformedData = {};
      data.map((student) => {
        if (student.TERM_CODE === CURTERM) {
          const repeated = data.filter(
            (s) =>
              s.STUDENT_ID === student.STUDENT_ID &&
              s.COURSE_CODE === student.COURSE_CODE &&
              s.TERM_CODE !== CURTERM &&
              s.COURSE_GRADE !== "CW" &&
              s.COURSE_GRADE !== "W"
          );
          const pastGrade =
            repeated.length === 0
              ? 0
              : repeated.reduce(
                  (acc, curr) => (acc.TERMCODE > curr.TERMCODE ? acc : curr),
                  {}
                ).COURSE_GRADE;

          if (!transformedData[student.STUDENT_ID]) {
            transformedData[student.STUDENT_ID] = {
              0: {
                COURSE_CODE: student.COURSE_CODE,
                COURSE_CREDIT: student.COURSE_CREDIT,
                repeated: repeated.length > 0,
                pastGrade: repeated ? pastGrade : 0
              }
            };
          } else {
            transformedData[student.STUDENT_ID][
              Object.keys(transformedData[student.STUDENT_ID]).length
            ] = {
              COURSE_CODE: student.COURSE_CODE,
              COURSE_CREDIT: student.COURSE_CREDIT,
              repeated: repeated.length > 0,
              pastGrade: repeated ? pastGrade : 0
            };
          }
        }
      });
      setStudents(transformedData); // update state
    })();
  }, []);

  useEffect(() => {
    const tempCredits = Object.values(forms).reduce((a, b) => {
      const courseCredit = b.repeated === true ? 0 : parseInt(b.credits);
      return parseInt(a) + courseCredit;
    }, pastValues[0]);
    setTotalCredits(tempCredits);

    const tempCreditsByWeight = Object.values(forms).reduce((a, b) => {
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
  }, [forms, pastValues]);

  useEffect(() => {
    const currentGpa = Number(totalCreditsByWeight / totalCredits).toPrecision(
      3
    );
    if (totalCredits === 0) {
      setGpa(0.0);
    } else if (currentGpa > 4) {
      setGpa(4.0);
    } else if (currentGpa === "NaN") {
      setGpa(0.0);
    } else {
      setGpa(currentGpa);
    }
  }, [totalCredits, totalCreditsByWeight]);
  

  const onBigFormChange = (
    index,
    credits,
    grade,
    repeated,
    pastGrade,
    name
  ) => {
    const newValues = {
      credits: credits,
      grade: grade,
      repeated: repeated,
      pastGrade: pastGrade,
      name: name
    };
    setForms({ ...forms, [index]: newValues });
  };

  const onBottomBarChange = (studentID, pastGpa, pastCredits) => {
    const newValues = [pastCredits, pastGpa, studentID];
    if (pastValues[2] !== newValues[2]) {
      generateForm(newValues);
    }
    setPastValues(newValues);
  };
  // when student ID is changed, update the form values to match the student's courses and credits
  const generateForm = (newValues) => {
    const studentID = newValues[2];
    if (!students[studentID]) {
      return;
    }
    const studentCourses = students[studentID];
  
    const newFormValues = {};
    if (studentCourses) {
      Object.keys(studentCourses).map((key) => {
        newFormValues[key] = {
          name: studentCourses[key].COURSE_CODE,
          credits: studentCourses[key].COURSE_CREDIT,
          grade: 0,
          repeated: studentCourses[key].repeated,
          pastGrade: studentCourses[key].pastGrade
        };
      });
    }
    setForms(newFormValues);
    console.log(newFormValues);
  };

  const deleteForm = (index) => {
    const tempForms = { ...forms };
    delete tempForms[index];
    setForms(tempForms);
  };

  const clearForms = () => {
    setForms({});
    setTotalCredits(0);
    setTotalCreditsByWeight(0);
    setGpa(0);
  };

  const addForm = (name, credits, grade, repeated, pastGrade) => {
    const tempForm = {
      name: name ? name : "",
      credits: credits ? credits : 0,
      grade: grade ? grade : 0,
      repeated: repeated ? repeated : false,
      pastGrade: pastGrade ? pastGrade : 0
    };
    setForms({ ...forms, [Object.keys(forms).length]: { tempForm } });
    console.log(forms);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16 ">
          {Object.entries(forms).map(([key, value]) => (
            <BigForm
              key={key}
              name={value.name ? value.name : ""}
              credits={value.credits ? value.credits : 0}
              repeated={value.repeated ? value.repeated : false}
              pastGrade={value.pastGrade ? value.pastGrade : 0}
              index={key}
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
