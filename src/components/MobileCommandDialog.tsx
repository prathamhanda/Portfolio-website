import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command } from "@/components/ui/command";
import { X } from "lucide-react";

interface MobileCommandDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  searchValue?: string;
  onClear?: () => void;
  children?: React.ReactNode;
}

const MobileCommandDialog: React.FC<MobileCommandDialogProps> = ({ open, onOpenChange, children, searchValue, onClear }) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const startY = React.useRef<number | null>(null);
  const currentY = React.useRef<number>(0);
  const [dragging, setDragging] = React.useState(false);
  const [viewportHeight, setViewportHeight] = React.useState(window.innerHeight);

  // Handle viewport height changes (especially for virtual keyboard)
  React.useEffect(() => {
    if (!open) return;
    
    // Prevent body scroll when dialog is open
    document.body.style.overflow = 'hidden';
    
    const handleResize = () => {
      const newHeight = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(newHeight);
    };

    const handleViewportChange = () => {
      const newHeight = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(newHeight);
    };

    // Listen to both window resize and visual viewport changes
    window.addEventListener('resize', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    // Set initial height
    handleResize();

    // Add viewport meta tag adjustment for iOS if needed
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const originalContent = viewportMeta?.getAttribute('content') || '';
    
    if (viewportMeta && !originalContent.includes('viewport-fit=cover')) {
      viewportMeta.setAttribute('content', `${originalContent}, viewport-fit=cover`);
    }

    return () => {
      // Restore body scroll
      document.body.style.overflow = '';
      
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
      
      // Restore original viewport meta
      if (viewportMeta && originalContent) {
        viewportMeta.setAttribute('content', originalContent);
      }
    };
  }, [open]);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startY.current = e.touches[0].clientY;
      setDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startY.current) return;
      const touchY = e.touches[0].clientY;
      const delta = touchY - startY.current;
      // If user drags down, allow resize via maxHeight change
      if (delta > 0) {
        currentY.current = delta;
        const currentViewportHeight = window.visualViewport?.height || window.innerHeight;
        const newMax = Math.max(200, currentViewportHeight - touchY + 40); // leave some top gap
        el.style.maxHeight = `${newMax}px`;
        el.style.transition = `none`;
      }
    };

    const handleTouchEnd = () => {
      setDragging(false);
      const threshold = 120; // px to dismiss
      if (currentY.current > threshold) {
        onOpenChange?.(false);
      } else {
        // reset height to auto (allow content to size naturally)
        el.style.maxHeight = '';
        el.style.transition = '';
      }
      startY.current = null;
      currentY.current = 0;
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);

    return () => {
      el.removeEventListener('touchstart', handleTouchStart as any);
      el.removeEventListener('touchmove', handleTouchMove as any);
      el.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [onOpenChange]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" />

        <DialogPrimitive.Content 
          ref={contentRef as any} 
          className="fixed left-0 right-0 bottom-0 z-[9999] mx-auto w-full max-w-3xl rounded-t-xl bg-popover p-4 shadow-2xl overflow-auto animate-slide-up mobile-command-content"
          style={{
            maxHeight: `${Math.min(viewportHeight * 0.92, viewportHeight - 20)}px`,
            height: 'auto',
            // Ensure the dialog is positioned correctly relative to the visual viewport
            bottom: window.visualViewport && window.visualViewport.height !== window.innerHeight 
              ? `${Math.max(0, window.innerHeight - window.visualViewport.height)}px`
              : '0px'
          }}
        >
          {/* drag handle */}
          <div className="w-full flex justify-center mb-3">
            <div className="h-1.5 w-14 rounded-full bg-border/60" />
          </div>

          <div className="relative flex flex-col h-full">
            <Command className="w-full flex flex-col h-full" value="">
              {children}
            </Command>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (searchValue && searchValue.trim().length > 0) {
                  onClear?.();
                } else {
                  onOpenChange?.(false);
                }
              }}
              aria-label="Close"
              className="absolute right-2 top-2 rounded-md p-1 opacity-80 hover:opacity-100 z-10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default MobileCommandDialog;
