import React, { FC } from 'react';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

const LoadingModal: FC<LoadingModalProps> = ({ visible, message = 'Carregando...' }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1E293B] border border-blue-800 rounded-xl p-8 flex flex-col items-center shadow-2xl">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-400 mb-4"></div>
        <p className="text-blue-100 font-medium text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
