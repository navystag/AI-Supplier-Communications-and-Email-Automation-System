import React from 'react';
import { 
  MessageSquare, 
  Mail, 
  LayoutDashboard, 
  Bot,
  Settings, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  darkMode,
  setDarkMode,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'edith', label: 'Edith (AI Assistant)', icon: Bot },
    { id: 'simulator', label: 'AI Enquiry', icon: MessageSquare },
    { id: 'email', label: 'AI Email Generator', icon: Mail },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'help', label: 'Help & Documentation', icon: HelpCircle },
  ];

  return (
    <aside 
      className={`h-full flex flex-col shrink-0 border transition-all duration-300 z-20 select-none rounded-3xl overflow-hidden shadow-xl ${
        isCollapsed ? 'w-20' : 'w-72'
      } ${
        darkMode 
          ? 'bg-[#24303D] border-[#3A4654] text-[#F3F4F6]' 
          : 'bg-[#EEF3F8] border-[#DCE3EA] text-[#1F2937]'
      }`}
    >
      {/* Sidebar Header / Logo */}
      <div className={`transition-all border-b ${
        isCollapsed 
          ? 'p-3 flex flex-col items-center justify-center gap-2' 
          : 'p-4 flex items-center justify-between'
      } ${darkMode ? 'border-[#3A4654]' : 'border-[#DCE3EA]'}`}>
        <div className={`flex items-center overflow-hidden ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20">
            BH
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-bold tracking-tight truncate">Boon Huat</h1>
              <p className={`text-[10px] truncate ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
                Supplier Email & Enquiry AI
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center shrink-0 ${
            darkMode ? 'hover:bg-[#2A3441] text-[#CBD5E1]' : 'hover:bg-white text-gray-500 shadow-2xs'
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 pt-4 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
            Core Communication Modules
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-3' : 'space-x-3.5 px-3.5 py-3'
              } rounded-2xl text-xs font-semibold transition-all duration-200 group relative ${
                isActive
                  ? darkMode 
                    ? 'bg-gradient-to-r from-blue-600/25 to-indigo-600/25 text-[#60A5FA] border border-blue-500/40 shadow-md shadow-blue-500/10 font-bold' 
                    : 'bg-white text-blue-600 shadow-md shadow-gray-200/80 border border-blue-100 font-bold'
                  : darkMode 
                    ? 'text-[#CBD5E1] hover:bg-[#2A3441] hover:text-white hover:rounded-2xl' 
                    : 'text-[#6B7280] hover:bg-white/80 hover:text-[#1F2937] hover:shadow-2xs'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? (darkMode ? 'text-[#60A5FA]' : 'text-blue-600') : ''}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              
              {/* Tooltip for collapsed view */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-xl shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile & Controls */}
      <div className={`p-3.5 border-t space-y-3 ${darkMode ? 'border-[#3A4654] bg-[#1E2630]/50' : 'border-[#DCE3EA] bg-white/50'}`}>
        {/* Dark Mode Slider Switch */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              {darkMode ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              <span className={`text-xs font-semibold ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
                {darkMode ? 'Dark Theme' : 'Light Theme'}
              </span>
            </div>
          )}
          
          {/* Interactive Slider Switch */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 border transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-inner ${
              darkMode 
                ? 'bg-indigo-950/90 border-indigo-500/50' 
                : 'bg-amber-100/90 border-amber-300/80'
            }`}
            role="switch"
            aria-checked={darkMode}
            title={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
          >
            <span className="sr-only">Toggle theme</span>
            <span
              className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full shadow-md ring-0 transition-all duration-300 ease-in-out ${
                darkMode 
                  ? 'translate-x-5 bg-indigo-600 text-indigo-100' 
                  : 'translate-x-0 bg-white text-amber-500 shadow-amber-500/20'
              }`}
            >
              {darkMode ? (
                <Moon className="w-3 h-3 text-white shrink-0 leading-none" />
              ) : (
                <Sun className="w-3 h-3 text-amber-500 shrink-0 leading-none" />
              )}
            </span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className={`p-2.5 rounded-2xl flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} transition-colors ${
          darkMode ? 'bg-[#2A3441]' : 'bg-[#EEF3F8]'
        }`}>
          <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-500 font-bold text-xs flex items-center justify-center shrink-0">
            BH
          </div>
          {!isCollapsed && (
            <div className="truncate flex-1">
              <div className={`text-xs font-semibold truncate ${darkMode ? 'text-[#F3F4F6]' : 'text-[#1F2937]'}`}>
                Boon Huat
              </div>
              <div className={`text-[10px] truncate flex items-center space-x-1 ${darkMode ? 'text-[#CBD5E1]' : 'text-[#6B7280]'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>Active Session</span>
              </div>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={onLogout}
              className={`p-1.5 rounded-xl transition-colors ${
                darkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
              }`}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
