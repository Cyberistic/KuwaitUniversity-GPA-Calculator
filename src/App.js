import "./App.css";
import { useState, useEffect, useMemo } from "react";
import BigForm from "./BigForm.js";
import BottomBar from "./BottomBar";
import { read, utils } from "xlsx";

const CURTERM = 1868;

function App() {
  const [forms, setForms] = useState({});
  const [pastValues, setPastValues] = useState([]);

  const [students, setStudents] = useState(null);
  // Init student data from excel file
  useEffect(() => {
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
      setStudents(transformedData);
    })();
  });


  // Calculate the total credits by adding up all the credits from the forms
  const totalCredits = Object.values(forms).reduce((a, b) => {
    const courseCredit = b.repeated === true ? 0 : parseInt(b.credits);
    return parseInt(a) + courseCredit;
  }, pastValues[2]);

  // Calculate the total credits by weight by adding up all the credits from the forms multiplied by the grade
  const totalCreditsByWeight = Object.values(forms).reduce((a, b) => {
    if (parseInt(b.credits) === 0) {
      return parseFloat(a);
    }

    const subtractedCredits =
      b.repeated === true ? parseInt(b.credits) * parseFloat(b.pastGrade) : 0;

    // log before return
    const computed =
      parseFloat(a) +
      parseInt(b.credits) * parseFloat(b.grade) -
      subtractedCredits;
    // check if computed is NaN or undefined
    if (isNaN(computed) || computed === undefined) {
      return 0.0;
    }
    return computed;
  }, pastValues[1] * pastValues[2]);

  // Calculate the gpa by dividing the total credits by weight by the total credits

  // gpa in 1 line
  const [gpa, setGPA] = useState(0.0);
  useEffect(() => {
    console.log(forms);
    if (totalCreditsByWeight === 0.0) {
      setGPA(0.0);
      return;
    }
    const gpaValue = totalCreditsByWeight / totalCredits;
    if (isNaN(gpaValue)) {
      setGPA(0.0);
    }
    const roundedGpaValue = Math.min(gpaValue, 4.0).toPrecision(3);

    setGPA(roundedGpaValue);
  }, [totalCreditsByWeight]);

  // Add a new form to the forms object
  const addForm = (name, credits, grade, repeated, pastGrade) => {
    const tempForm = {
      name: name ? name : "",
      credits: credits ? credits : 4,
      grade: grade ? grade : "A",
      repeated: repeated ? repeated : false,
      pastGrade: pastGrade ? pastGrade : "A"
    };
    setForms((forms) => ({
      ...forms,
      [Object.keys(forms).length]: { tempForm }
    }));
  };

  // Delete a form from the forms object
  const deleteForm = (index) => {
    const tempForms = { ...forms };
    delete tempForms[index];
    setForms(tempForms);
  };

  // Clear all the forms
  const clearForms = () => {
    setForms({});
  };

  // When a form is changed, update the forms object
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
    setForms((curforms) => {
      return { ...curforms, [index]: newValues };
    });
  };
  // when student ID is changed, update the form values to match the student's courses and credits
  const generateForm = () => {
    const studentID = pastValues[0];

    if (!students[studentID] || !students || !studentID) {
      console.log("no student found");
      console.log(students[studentID]);
      return;
    }
    const studentCourses = students[studentID];

    if (studentCourses) {
      const newFormValues = Object.entries(studentCourses).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: {
            name: value.COURSE_CODE,
            credits: value.COURSE_CREDIT,
            grade: 0,
            repeated: value.repeated,
            pastGrade: value.pastGrade || "A"
          }
        }),
        {}
      );
      

      setForms(newFormValues);
    }
  };

  // When the student ID is changed, generate the forms
  useEffect(() => {
    if (!pastValues[0]) return;
    generateForm();

  }, [pastValues[0]]);

  // Init the form with one empty form
  if (Object.keys(forms).length === 0) {
    addForm();
  }

  // Map the forms object to an array of BigForm components
  const formEnteries = Object.entries(forms).map(([key, value]) => (
    <BigForm
      key={key+value.name}
      name={value.name ? value.name : ""}
      credits={value.credits ? value.credits : 0}
      repeated={value.repeated ? value.repeated : false}
      pastGrade={value.pastGrade ? value.pastGrade : "A"}
      index={key}
      delete={deleteForm}
      onBigFormChange={onBigFormChange}
    />
  ));

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
          {formEnteries}
        </div>
      </main>
      <BottomBar gpa={gpa} setPastValues={setPastValues} />
    </div>
  );
}

export default App;
