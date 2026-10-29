import { ReactNode } from 'react';

interface NavButtonProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export const NavButton = ({ icon, label, active, onClick }: NavButtonProps) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 ${
      active 
        ? 'text-blue-600 bg-blue-50 scale-105 shadow-sm' 
        : 'text-gray-400 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
