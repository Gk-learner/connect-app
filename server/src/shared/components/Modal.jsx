import React from 'react';

// A reusable modal component that can display general content or
// simple status messages (success, error, info, warning).
//
// **Usage Example:**
//
// ```jsx
// import { useState } from 'react';
// import Modal from '../shared/Modal';
//
// function Demo() {
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <button onClick={() => setOpen(true)}>Show success</button>
//       <Modal
//         isOpen={open}
//         type="success"
//         title="Success"
//         message="Your operation completed successfully."
//         onClose={() => setOpen(false)}
//       />
//     </>
//   );
// }
// ```
//
// The component supports an overlay click handler, optional title,
// message, and accepts arbitrary children for custom content.

export default function Modal({
  isOpen = false,
  onClose = () => {},
  type = 'ignored' | 'interested', // 'success' | 'error' | 'warning' | 'info' | 'default'
  title,
  message,
  children,
  className = ''
}) {
  if (!isOpen) return null;

  const colourMap = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-white text-black'
  };

  const colourClasses = colourMap[type] || colourMap.default;

  return (
    <div className="fixed inset-0 z-50 flex m-auto items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-b opacity-50"
        onClick={onClose}
      />

      <div
        className={`relative max-w-md w-full p-6 rounded-lg shadow-lg ${colourClasses} ${className}`}
      >
        {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
        {message && <p className="mb-4">{message}</p>}
        {children}
      </div>
    </div>
  );
}
