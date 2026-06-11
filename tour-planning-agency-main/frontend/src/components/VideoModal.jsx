// src/components/VideoModal.jsx
import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

/**
 * VideoModal – renders a fullscreen modal with an embedded YouTube video.
 * Props:
 *   open (bool) – whether the modal is visible.
 *   onClose (func) – callback to close the modal.
 *   videoUrl (string) – YouTube embed URL (e.g., https://www.youtube.com/embed/xxxx).
 */
export default function VideoModal({ open, onClose, videoUrl }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-3xl mx-4 rounded-lg overflow-hidden bg-black">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-300 transition-colors"
          aria-label="Close video"
        >
          <FiX size={24} />
        </button>
        {/* Responsive iframe */}
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={videoUrl}
            title="TravelGo tutorial video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
