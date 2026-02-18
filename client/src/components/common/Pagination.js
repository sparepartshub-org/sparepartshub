import React from 'react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg border border-steel-300 text-sm disabled:opacity-50 hover:bg-steel-100 transition"
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1.5 rounded-lg text-sm transition ${
            page === i + 1
              ? 'bg-primary-500 text-white'
              : 'border border-steel-300 hover:bg-steel-100'
          }`}
        >
          {i + 1}
        </button>
      )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-lg border border-steel-300 text-sm disabled:opacity-50 hover:bg-steel-100 transition"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
