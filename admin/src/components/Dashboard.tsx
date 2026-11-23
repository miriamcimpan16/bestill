import { useState } from 'react';
import { TabView } from '../types';
import { useAuth } from '../hooks/useAuth';
import WeeksScreen from './WeeksScreen';
import CategoriesScreen from './CategoriesScreen';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabView>('weeks');
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Ești sigur că vrei să te deconectezi?')) {
      await signOut();
    }
  };

  return (
    <div className="flex min-h-screen h-auto lg:h-screen bg-[#1E1815] flex-col lg:flex-row overflow-x-hidden overflow-y-visible lg:overflow-y-hidden max-w-full">
      {/* MOBILE/TABLET: Header top cu tabs orizontale (< 1024px) */}
      <div className="flex lg:hidden flex-col bg-[#1E1815] border-b border-[#F4EFEA]/10 flex-shrink-0">
        {/* Logo și deconectare */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F4EFEA]/10">
          <h1 className="text-2xl text-[#F4EFEA]" style={{ fontFamily: '"MonteCarlo", cursive', fontWeight: 500 }}>
            Be Still
          </h1>
          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 text-[#F4EFEA]/70 hover:text-[#F4EFEA] text-sm min-h-[44px]"
          >
            Ieșire
          </button>
        </div>

        {/* Tabs orizontale */}
        <div className="flex w-full">
          <button
            onClick={() => setActiveTab('weeks')}
            className={`flex-1 px-4 py-3 font-medium transition min-h-[44px] ${
              activeTab === 'weeks'
                ? 'bg-[#F4EFEA] text-[#1E1815]'
                : 'text-[#F4EFEA] active:bg-[#F4EFEA]/10'
            }`}
          >
            Săptămâni
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 px-4 py-3 font-medium transition min-h-[44px] ${
              activeTab === 'categories'
                ? 'bg-[#F4EFEA] text-[#1E1815]'
                : 'text-[#F4EFEA] active:bg-[#F4EFEA]/10'
            }`}
          >
            Categorii
          </button>
        </div>
      </div>

      {/* DESKTOP: Sidebar fix în stânga (>= 1024px) */}
      <div className="hidden lg:flex w-[220px] bg-[#1E1815] flex-col border-r border-[#F4EFEA]/10 flex-shrink-0">
        <div className="px-6 pt-8 pb-6 border-b border-[#F4EFEA]/10">
          <h1 className="text-4xl text-[#F4EFEA] mb-2" style={{ fontFamily: '"MonteCarlo", cursive', fontWeight: 500 }}>
            Be Still
          </h1>
          <p className="text-xs text-[#F4EFEA]/60 uppercase tracking-wider">
            Administrare
          </p>
        </div>

        <nav className="flex-1 px-4 py-6">
          <button
            onClick={() => setActiveTab('weeks')}
            className={`w-full text-left px-4 py-3 rounded mb-2 transition font-medium ${
              activeTab === 'weeks'
                ? 'bg-[#F4EFEA] text-[#1E1815]'
                : 'text-[#F4EFEA] hover:bg-[#F4EFEA]/10'
            }`}
          >
            Săptămâni
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-left px-4 py-3 rounded transition font-medium ${
              activeTab === 'categories'
                ? 'bg-[#F4EFEA] text-[#1E1815]'
                : 'text-[#F4EFEA] hover:bg-[#F4EFEA]/10'
            }`}
          >
            Categorii
          </button>
        </nav>

        <div className="px-4 pb-6 border-t border-[#F4EFEA]/10 pt-4">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2.5 text-[#F4EFEA] hover:bg-[#F4EFEA]/10 rounded transition text-sm"
          >
            Deconectare
          </button>
        </div>
      </div>

      {/* Conținutul principal */}
      <div className="flex-1 min-w-0 lg:h-screen lg:overflow-hidden">
        {activeTab === 'weeks' ? <WeeksScreen /> : <CategoriesScreen />}
      </div>
    </div>
  );
}
