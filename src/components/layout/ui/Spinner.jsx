import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ className = '', message = 'Loading...' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <Loader2 className="w-10 h-10 text-agreen-500 animate-spin" />
      {message && <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">{message}</p>}
    </div>
  );
}
