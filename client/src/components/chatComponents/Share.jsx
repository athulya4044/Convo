import React from "react";

const Share = ({ sharedItems }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shared Files</h2>
      {sharedItems.length === 0 ? (
        <p className="text-gray-500 text-center">No shared items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sharedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 border border-gray-200 rounded-lg shadow-md bg-white"
            >
              {item.type === "image" ? (
                <div className="flex items-center w-full">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                    onError={(e) => {
                      e.target.src = "/fallback-image.png"; // Placeholder image
                    }}
                  />
                  <div className="truncate w-full">
                    <p
                      className="text-sm font-medium text-gray-800 truncate"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">Image</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 flex items-center justify-center rounded-md mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 text-red-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m-3 0h12m-12 0a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 006.75 21h10.5a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25m-12 0V9m0 0V5.25A2.25 2.25 0 016.75 3h10.5A2.25 2.25 0 0119.5 5.25V9"
                      />
                    </svg>
                  </div>
                  <div className="truncate w-full">
                    <p
                      className="text-sm font-medium text-gray-800 truncate"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.type.toUpperCase()}
                    </p>
                    <a
                      href={item.url}
                      download
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Share;
