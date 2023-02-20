import { useState, useEffect } from "react";

export default function BottomBar(props) {
    const [pastCredits, setPastCredits] = useState(0);
    const [pastGpa, setPastGpa] = useState(0);
    

    useEffect(() => {
        props.onBottomBarChange(props.index, pastGpa, pastCredits);
    }, [pastGpa, pastCredits]);

    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-200 py-2 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-lg font-medium">
            GPA: <span className="font-bold">{props.gpa}</span>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <label htmlFor="oldCredits" className="block font-medium text-gray-700">
                Old Credits
              </label>
              <input
                type="number"
                id="oldCredits"
                name="oldCredits"
                className="w-20 py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                onChange={(e) => setPastCredits(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="oldGpa" className="block font-medium text-gray-700">
                Old GPA
              </label>
              <input
                type="number"
                id="oldGpa"
                name="oldGpa"
                className="w-20 py-2 px-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                max="4"
                step="0.01"
                onChange={(e) => setPastGpa(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }