import React from 'react';

interface MobilePromptProps {
  onClose: () => void;
}

const MobilePrompt: React.FC<MobilePromptProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-4 text-black">Mobile Device Detected</h2>
        <p className="mb-6 text-black">
          We are switching your preference as you are using a mobile device.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default MobilePrompt;
