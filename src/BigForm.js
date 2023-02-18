import {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'


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



export default function BigForm(props) {
    const [credits, setCredits] = useState(0);
    const [repeated, setRepeated] = useState(false);
    const [grade, setGrade] = useState(4);

    const onCreditsChange = (credits) => {

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
        <div className="bg-white p-4 rounded shadow-md relative">
            <div className="w-5/6">
                <h2 className="text-xl font-medium mb-4" contenteditable="true">Class {props.index + 1}</h2>
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
