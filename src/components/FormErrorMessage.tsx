/* ===== Child components ===== */
import { ReactNode } from 'react';

interface IFormErrorMessage {
  icon?: ReactNode;
  children?: ReactNode;
}

export default function FormErrorMessage({ icon, children }: IFormErrorMessage) {
  return (
    <div className="text-sm text-red-800/60" role="alert">
      {icon}
      {children}
    </div>
  );
}
