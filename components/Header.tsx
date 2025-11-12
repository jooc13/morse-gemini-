import React from 'react';

type Page = 'history' | 'log' | 'exercises';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const navLinkClasses = (page: Page) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      currentPage === page 
      ? 'bg-blue-600 text-white' 
      : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
    }`;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-gray-200">
      <div className="text-center sm:text-left mb-4 sm:mb-0">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
          morse
        </h1>
        <p className="text-gray-500 mt-1">
          AI-Powered Workout History
        </p>
      </div>
      <nav className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
        <button onClick={() => onNavigate('history')} className={navLinkClasses('history')}>
          History
        </button>
        <button onClick={() => onNavigate('exercises')} className={navLinkClasses('exercises')}>
          Exercises
        </button>
        <button onClick={() => onNavigate('log')} className={navLinkClasses('log')}>
          Log New Workout
        </button>
      </nav>
    </header>
  );
};

export default Header;