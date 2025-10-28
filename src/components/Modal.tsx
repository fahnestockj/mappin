import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import FocusTrap from "focus-trap-react";
import classNames from "classnames";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg";
  container?: HTMLElement | null;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  container,
}: ModalProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal content */}
      <FocusTrap>
        <div
          className={classNames(
            "relative bg-white rounded-xl shadow-2xl border-2 border-gray-200 w-full",
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            </div>
          )}
          <div className="px-6 py-4">{children}</div>
        </div>
      </FocusTrap>
    </div>,
    container || (document.getElementById("root") as HTMLElement)
  );
}
