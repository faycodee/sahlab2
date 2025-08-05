import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Headphones, PenSquare, MessageSquare, LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'LESEN', path: '/lesen', icon: BookOpen },
    { name: 'HÖREN', path: '/horen', icon: Headphones },
    { name: 'SCHREIBEN', path: '/schreiben', icon: PenSquare },
    { name: 'SPRECHEN', path: '/sprechen', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <h1 className="text-2xl font-bold text-indigo-400">SAHLAB2</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end // 'end' is important for the root path
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const DashboardLayout = () => {
  return (
    <div className="flex  h-screen bg-gray-100 dark:bg-gray-800 w-full">
      <Sidebar />
      <main className=" flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Panel</h2>
            {/* You can add user profile, notifications here */}
        </header>
        <div className="flex-1 overflow-y-auto p-8 w-full">
          <Outlet /> {/* Les pages dyalna ghadi ybano hna */}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
