import { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import { read, utils } from "xlsx";

export default function BottomBar(props) {
  const [curStudent, setCurStudent] = useState(null);
  const [[studentID, pastGpa, pastCredits], setPastValues] = useState([
    "",
    0,
    0
  ]);
  const [students, setStudents] = useState(null);
  /* Fetch and update the state once */
  useEffect(() => {
    (async () => {
      const f = await (await fetch("grades.xlsx")).arrayBuffer();
      const wb = read(f); // parse the array buffer
      const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
      const data = utils.sheet_to_json(ws); // generate objects
      const studentInfo = data.map((student) => {
        return {
          studentID: student.STUDENT_ID,
          accumulatedCreditsPassed: Number(student.ACCUMULATED_CREDITS_PASSED),
          accumulatedGPA: Number(student.ACCUMULATED_GPA)
        };
      });
      setStudents(studentInfo);
    })();
  }, []);

  const options = students
    ? students.map((student) => {
        return {
          label: student.studentID,
          value: student.studentID
        };
      })
    : [];

  useEffect(() => {
    props.setPastValues([studentID, pastGpa, pastCredits]);
  }, [studentID, pastGpa, pastCredits]);

  const onStudentChange = (e) => {
    setCurStudent(e);

    const student = students.find((student) => student.studentID === e.value);
    if (student) {
      setPastValues([
        student.studentID,
        student.accumulatedGPA,
        student.accumulatedCreditsPassed
      ]);

      console.log(student);
    }
  };

  const onCreditsChange = (credits) => {
    // Ensure that credits is an integer or an empty string
    if (Number.isInteger(parseInt(credits)) || credits === "") {
      // Clamp credits between 0 and 9
      if (credits > 200) {
        setPastValues([studentID, pastGpa, 200]);
      } else if (credits < 0) {
        setPastValues([studentID, pastGpa, 0]);
      } else {
        // If credits is a float, round down to the nearest integer
        if (credits % 1 !== 0) {
          setPastValues([studentID, pastGpa, Math.floor(credits)]);
        } else {
          setPastValues([studentID, pastGpa, parseInt(credits)]);
        }
      }
    }
  };

  const onGpaChange = (gpa) => {
    // Ensure that credits is an integer or an empty string
    if (Number.isInteger(parseInt(gpa)) || gpa === "") {
      // Clamp credits between 0 and 9
      if (gpa > 4) {
        setPastValues([studentID, 4.0, pastCredits]);
      } else if (gpa < 0) {
        setPastValues([studentID, 0.0, pastCredits]);
      } else {
        setPastValues([studentID, parseFloat(gpa), pastCredits]);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-200 py-2 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-medium">GPA: {props.gpa}</div>
        <div className="flex items-center">
          <div className="mr-4">
            <label className="block font-medium text-gray-700">
              Student ID
            </label>
            <div className="min-w-[200px]">
              <Select
                options={options}
                menuPlacement="top"
                value={curStudent}
                onChange={onStudentChange}
              />
            </div>
          </div>
          <div className="mr-4">
            <label className="block font-medium text-gray-700">Credits</label>
            <input
              type="number"
              className="w-20 py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              value={pastCredits}
              onChange={(e) => onCreditsChange(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">GPA</label>
            <input
              type="number"
              className="w-20 py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              min="0"
              max="4"
              step="0.01"
              value={pastGpa}
              onChange={(e) => onGpaChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
