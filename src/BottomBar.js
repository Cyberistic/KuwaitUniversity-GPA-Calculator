import { useState, useEffect } from "react";
import Select from "react-select";
import { read, utils } from "xlsx";

let options = [];

export default function BottomBar(props) {
  const [pastCredits, setPastCredits] = useState(0);
  const [pastGpa, setPastGpa] = useState(0);

  const [students, setStudents] = useState([]);
  const [curStudent, setCurStudent] = useState(null);

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
          accumulatedCreditsPassed: student.ACCUMULATED_CREDITS_PASSED,
          accumulatedGPA: student.ACCUMULATED_GPA
        };
      });
      setStudents(studentInfo); // update state
    })();
  }, []);

  useEffect(() => {
    options = students.map((student) => {
      return {
        label: student.studentID,
        value: student.studentID
      };
    });
  }, [students]);
  useEffect(() => {
    props.onBottomBarChange(pastGpa, pastCredits);
  }, [pastGpa, pastCredits]);

  const onStudentChange = (e) => {
    setCurStudent(e);

    const student = students.find((student) => student.studentID === e.value);
    if (student) {
      setPastCredits(student.accumulatedCreditsPassed);
      setPastGpa(student.accumulatedGPA);
      console.log(student);
    }
  };

  const onCreditsChange = (credits) => {
    // Ensure that credits is an integer or an empty string
    if (Number.isInteger(parseInt(credits)) || credits === "") {
      // Clamp credits between 0 and 9
      if (credits > 200) {
        setPastCredits(200);
      } else if (credits < 0) {
        setPastCredits(0);
      } else {
        // If credits is a float, round down to the nearest integer
        if (credits % 1 !== 0) {
          setPastCredits(Math.floor(credits));
        } else {
          setPastCredits(parseInt(credits));
        }
      }
    }
  };

  const onGpaChange = (gpa) => {
    // Ensure that credits is an integer or an empty string
    if (Number.isInteger(parseInt(gpa)) || gpa === "") {
      // Clamp credits between 0 and 9
      if (gpa > 4) {
        setPastGpa(4);
      } else if (gpa < 0) {
        setPastGpa(0);
      } else {
        setPastGpa(parseFloat(gpa));
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-200 py-2 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-medium">
          GPA: <span className="font-bold">{props.gpa}</span>
        </div>
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
              onChange={onCreditsChange}
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
