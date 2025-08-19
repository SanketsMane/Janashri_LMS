import React from 'react';

const Loading = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <div className={`spinner ${sizeClasses[size]}`}></div>
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
