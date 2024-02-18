import React, { useState } from 'react';

const Approve = ({ rowNumber }) => {
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const dropdownId = `dropdownMenu${rowNumber}`;
  const buttonId = `dropdownButton${rowNumber}`;

  const toggleDropdown = () => {
    setDropdownVisibility(!isDropdownVisible);
  };

  return (
    <>
      {/* Row */}
      <tr className="h-16 p-2">
        <td className="border-2 p-5 text-center border-black"></td>
        <td className="border-2 text-center border-black"></td>
        <td className="border-2 text-center border-black"></td>
        <td className="border-2 text-center border-black">
          <a href="#">
            <img src="../images/detail.png" className="pl-32" alt="Get All Details" />
          </a>
        </td>
        <td className="border-2 text-center border-black">
          <button
            type="button"
            id={buttonId}
            onClick={toggleDropdown}
            className="inline-flex justify-center items-center w-12 h-12 bg-transparent focus:outline-none"
          >
            <img src="../images/Vector.png" alt="" />
          </button>
        </td>
      </tr>

      {/* Drop-down menu */}
      <div
        id={dropdownId}
        className={`absolute ${isDropdownVisible ? '' : 'hidden'} origin-top-right right-0 mt-16 ml-10 w-48 shadow-lg bg-pink-here ring-1 ring-black ring-opacity-5 focus:outline-none font-kons text-xl`}
      >
        <div className="py-1 border-2 border-black">
          <a
            href="#"
            className="block px-4 py-2 text-sm bg-pink-here text-black bottom-3 hover:bg-background"
          >
            Approve
          </a>
          <hr className="border-b-2 border-black" />
          <a
            href="#"
            className="block px-4 py-2 text-sm text-black hover:bg-background"
          >
            Disapprove
          </a>
        </div>
      </div>
    </>
  );
};

export default Approve;
