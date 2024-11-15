import React from "react";

function Toggle({ isChecked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-10 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  );
}

export {Toggle};
