import React from 'react';

export const AntigravityIcon = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width="1em" 
      height="1em" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M 5 20 C 6 12, 9 4, 12 4 C 15 4, 18 12, 19 20 C 20 22, 17 22, 16 20 C 14 14, 13 10, 12 10 C 11 10, 10 14, 8 20 C 7 22, 4 22, 5 20 Z" 
        fill="currentColor" 
      />
    </svg>
  );
};
