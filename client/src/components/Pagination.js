import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`text-orange-500 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-full font-medium text-sm ${
                  currentPage === page ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {page.toString().padStart(2, '0')}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`text-orange-500 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            →
          </button>
        </div>
      </div>
    );
}

export default Pagination;
