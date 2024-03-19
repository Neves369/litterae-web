import React, { useState } from "react";
import { ReactReader } from "react-reader";

const FullScreenEpubReader = ({ onClose, epubUrl }: any) => {
  const [location, setLocation] = useState<string | number>(0);
  console.log("chegou: ", epubUrl);
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 p-5"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-11/12 h-full md:w-3/4 md:h-4/6 lg:w-2/3 lg:h-full xl:w-3/5 xl:h-full rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute z-30 top-4 right-4 bg-gray-300 rounded-full w-8 h-8 flex justify-center items-center"
          onClick={onClose}
        >
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <ReactReader
          url={epubUrl}
          location={location}
          locationChanged={(epubcfi: string) => setLocation(epubcfi)}
        />
      </div>
    </div>
  );
};

export default FullScreenEpubReader;
