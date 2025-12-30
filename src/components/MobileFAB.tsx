import React, { useState, useEffect, useRef } from 'react';

const MobileFAB: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fabRef = useRef<HTMLButtonElement>(null);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    // Show FAB immediately
    setShowGlow(true);
    
    // Check if tooltip message has been shown before
    const tooltipShown = localStorage.getItem('fab-tooltip-shown');
    if (!tooltipShown) {
      // Show tooltip after page load
      const timer = setTimeout(() => {
        setShowTooltip(true);
        
        // Auto fade out tooltip after 8 seconds
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem('fab-tooltip-shown', 'true');
        }, 10000);  // ← 8000ms = 8 seconds
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!fabRef.current) return;
      
      const fabRect = fabRef.current.getBoundingClientRect();
      const fabCenterX = fabRect.left + fabRect.width / 2;
      const fabCenterY = fabRect.top + fabRect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - fabCenterX, 2) + Math.pow(e.clientY - fabCenterY, 2)
      );
      
      // Magnet effect within 100px radius
      if (distance < 100) {
        const attraction = Math.max(0, (100 - distance) / 100);
        const offsetX = (e.clientX - fabCenterX) * attraction * 0.15;
        const offsetY = (e.clientY - fabCenterY) * attraction * 0.15;
        
        setMousePosition({ x: offsetX, y: offsetY });
      } else {
        setMousePosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
    setShowTooltip(false);
  };

  return (
    <>
      <button
        ref={fabRef}
        aria-label="Open command palette"
        onClick={handleClick}
        id="mobile-fab"
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform transition-all duration-300 overflow-hidden p-0 group"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1)`,
          animation: showGlow ? 'fabGlow 3s ease-in-out' : 'none'
        }}
      >
        <div className="w-full h-full flex items-center justify-center relative">
          <img 
            src="/sparkles.gif" 
            alt="" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            aria-hidden
          />
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div 
          className="fixed bottom-8 right-20 md:bottom-10 md:right-24 z-50 bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm border border-white/10 max-w-[200px] text-center"
          style={{
            animation: 'tooltipAppear 0.5s ease-out, tooltipFadeOut 0.5s ease-in 7.5s forwards',
            animationFillMode: 'both'
          }}
        >
          Try the AI assistant to explore my work
          <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-black/90" />
        </div>
      )}

      <style>{`
        @keyframes fabGlow {
          0% { box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 8px 40px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.4); }
          100% { box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3); }
        }
        
        @keyframes tooltipAppear {
          0% { opacity: 0; transform: translateY(10px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes tooltipFadeOut {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.8); }
        }
      `}</style>
    </>
  );
};

export default MobileFAB;
