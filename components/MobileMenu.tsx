import React from 'react';
import { Screen } from '../types';
import { useCredits } from '../hooks/useCredits';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3h18v18H3z"></path></svg>;

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onNavigate }) => {
  const { currentScreen, userRole, sidebarVisibility } = useCredits();

  if (!isOpen) return null;

  const menuItems = [
    { screen: 'home' as Screen, label: 'Home', icon: <HomeIcon /> },
    { screen: 'my-bio' as Screen, label: 'My Bio', icon: <UserIcon /> },
    { screen: 'creator-chat' as Screen, label: 'Creator Chat', icon: <ChatIcon /> },
    { screen: 'store' as Screen, label: 'Store', icon: <StoreIcon />, visibility: 'store' },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-neutral-800 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-neutral-700">
          <h1 className="text-xl font-bold text-white">
            FUN<span className="text-brand-primary">FANS</span>
          </h1>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <nav className="p-4">
            {menuItems
              .filter(item => !item.visibility || sidebarVisibility[item.visibility])
              .map(item => (
                <button
                  key={item.screen}
                  onClick={() => onNavigate(item.screen)}
                  className={`w-full flex items-center p-3 rounded-lg mb-2 transition-colors ${
                    currentScreen === item.screen
                      ? 'bg-brand-primary text-white'
                      : 'text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <span className="w-5 h-5 mr-3">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export const MobileMenuButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden p-2 text-white hover:bg-neutral-700 rounded-lg transition-colors"
    aria-label="Menu"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  </button>
);
