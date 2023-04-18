import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// This object maps letter grades to their corresponding GPAs
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
  F: 0,
  FA: 0
};

// This component represents a form for entering class information
export default function BigForm(props) {
  // Define three pieces of state: credits, whether the class is repeated, and the selected grade
  const [credits, setCredits] = useState(props.credits);
  const [repeated, setRepeated] = useState(props.repeated);
  const [grade, setGrade] = useState(4);
  const [pastGrade, setPastGrade] = useState(grades[props.pastGrade]);

  // This function handles changes to the credits input field
  const onCreditsChange = (credits) => {
    // Ensure that credits is an integer or an empty string
    if (Number.isInteger(parseInt(credits)) || credits === "") {
      // Clamp credits between 0 and 9
      if (credits > 9) {
        setCredits(9);
      } else if (credits < 0) {
        setCredits(0);
      } else {
        // If credits is a float, round down to the nearest integer
        if (credits % 1 !== 0) {
          setCredits(Math.floor(credits));
        } else {
          setCredits(credits);
        }
      }
    }
  };

  // This effect runs every time credits, grade, or repeated changes, and updates the parent component's state
  useEffect(() => {
    props.onBigFormChange(
      props.index,
      credits,
      grade,
      repeated,
      pastGrade,
      props.name ? props.name : "Class " + props.index + 1
    );
  }, [credits, grade, repeated, pastGrade]);

  // Render the form
  return (
    <div className="bg-white p-4 rounded shadow-md relative">
      <div className="w-5/6">
        <h2 className="text-xl font-medium mb-4">
          {props.name ? props.name : "Class " + props.index + 1}
        </h2>
      </div>
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
        <Grade
          header={"Grade"}
          visible={true}
          grade={grade}
          setGrade={setGrade}
        />
      </div>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex justify-center items-center ">
          <input
            defaultChecked={repeated}
            onChange={(e) => setRepeated(e.target.checked)}
            id="default-checkbox"
            type="checkbox"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <div>
            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Repeated
            </label>
          </div>
        </div>
        <Grade
          header={"Previous Grade"}
          visible={repeated}
          grade={pastGrade}
          setGrade={setPastGrade}
        />
      </div>

      <div className="absolute top-0 right-0 mt-3 px-2">
        {props.index === 0 ? null : (
          <button
            onClick={() => props.delete(props.index)}
            className="hover:bg-gray-200 py-2 px-2.5 rounded-full"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        )}
      </div>
    </div>
  );
}

function Grade(props) {
  return (
    <div className={`${props.visible ? "" : "collapse"}`}>
      <label className="text-gray-700 font-medium block mb-2">
        {props.header}
      </label>
      <select
        className="border border-gray-300 p-2 rounded w-full"
        value={props.grade}
        onChange={(e) => props.setGrade(parseFloat(e.target.value))}
      >
        {/* Map over the grades object and create an option for each key/value pair */}
        {Object.keys(grades).map((key) => (
          <option key={key} value={grades[key]}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}
