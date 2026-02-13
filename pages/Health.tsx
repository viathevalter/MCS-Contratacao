import React from 'react';

const Health: React.FC = () => {
  return (
    <div className="p-4 font-mono">
      {JSON.stringify({ status: 'OK', environment: 'staging', storage: 'local' }, null, 2)}
    </div>
  );
};

export default Health;