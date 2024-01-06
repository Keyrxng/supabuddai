import React from "react";

type Props = {};

function Navbar({}: Props) {
  return (
    <nav className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
      <div className="text-xl font-bold">Your Logo</div>
      <div className="flex space-x-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Settings
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
