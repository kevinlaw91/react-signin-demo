/* ===== Child components ===== */
import React from 'react';

interface IFormErrorMessage {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function FormErrorMessage({ icon, children }: IFormErrorMessage) {
  return (
    <div className="text-sm text-red-800/60" role="alert">
      {icon}
      {children}
    </div>
  );
}
