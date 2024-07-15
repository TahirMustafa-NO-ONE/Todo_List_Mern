import React from 'react';
import tablet from './tablet.png'; // Adjust the path to your image file

const Navbar = () => {
  return (
    <nav className='flex justify-between bg-violet-900 text-white py-2'>
      <div className="logo flex items-center logoo cursor-pointer">
        <img src={tablet} alt="Tablet logo" className="w-8 h-8 ml-2 mr-0" /> {/* Adjust size as needed */}
        <span className="font-bold text-xl mx-1">morTodo</span>
      </div>
      <ul className='flex gap-4 mx-2'>
        <li className='cursor-pointer hover:font-bold'>Home</li>
        <li className='cursor-pointer hover:font-bold'>About us</li>
        <li className='cursor-pointer hover:font-bold'>Your Tasks</li>
      </ul>
    </nav>
  );
}

export default Navbar;
