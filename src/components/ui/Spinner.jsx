import React from 'react';

export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-12 h-12 border-4 border-agreen-200 border-t-agreen-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400 font-medium">{message}</p>
    </div>
  );
}
