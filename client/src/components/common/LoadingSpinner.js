import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex justify-center items-center py-8">
      <div className={`${sizes[size]} border-4 border-steel-200 dark:border-gray-700 border-t-primary-500 rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
