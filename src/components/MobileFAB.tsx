import React from 'react';

const MobileFAB: React.FC = () => {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <button
      aria-label="Open command palette"
      onClick={handleClick}
      id="mobile-fab"
      className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:scale-105 transform transition overflow-hidden p-0" 
    >
      <div className="w-full h-full flex items-center justify-center">
        <img 
          src="/sparkles.gif" 
          alt="" 
          className="w-full h-full object-cover"
          aria-hidden
        />
      </div>
    </button>
  );
};

export default MobileFAB;
