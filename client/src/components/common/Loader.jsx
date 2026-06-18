import React from 'react';

const Loader = () => {
  return (
    <div className="loading-spinner">
      <div className="text-center">
        <div className="spinner mb-3"></div>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
