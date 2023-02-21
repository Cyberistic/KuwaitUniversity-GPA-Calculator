import { useState, useEffect } from "react";

export default function BottomBar(props) {
  const [pastCredits, setPastCredits] = useState(0);
  const [pastGpa, setPastGpa] = useState(0);

  useEffect(() => {
    props.onBottomBarChange(pastGpa, pastCredits);
  }, [pastGpa, pastCredits]);

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
