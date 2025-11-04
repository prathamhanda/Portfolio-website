import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command } from "@/components/ui/command";
import { X } from "lucide-react";

interface MobileCommandDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const MobileCommandDialog: React.FC<MobileCommandDialogProps> = ({ open, onOpenChange, children }) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const startY = React.useRef<number | null>(null);
  const currentY = React.useRef<number>(0);
  const [dragging, setDragging] = React.useState(false);

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
        const newMax = Math.max(200, window.innerHeight - touchY + 40); // leave some top gap
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

        <DialogPrimitive.Content ref={contentRef as any} className="fixed left-0 right-0 bottom-0 z-[9999] mx-auto w-full max-w-3xl rounded-t-xl bg-popover p-4 shadow-2xl max-h-[92vh] overflow-auto animate-slide-up">
          {/* drag handle */}
          <div className="w-full flex justify-center mb-3">
            <div className="h-1.5 w-14 rounded-full bg-border/60" />
          </div>

          <div className="relative">
            <Command className="w-full" value="">
              {children}
            </Command>

            <DialogPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 opacity-80 hover:opacity-100">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default MobileCommandDialog;
