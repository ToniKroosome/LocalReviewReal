import React from 'react';
import { Award, Search, Filter, LogOut } from 'lucide-react';

const Header = ({
  showHeader,
  toggleSearchBar,
  toggleFilters,
  user,
  handleLogin,
  handleLogout,
  setShowReviewForm,
  language,
  setLanguage,
  GoogleIcon,
}) => (
  <header
    className={`bg-gray-900/90 backdrop-blur-xl border-b border-gray-800/50 fixed top-0 w-full z-20 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}
    style={{ minHeight: '40px', padding: '0.25rem 0' }}
  >
    <div className="max-w-4xl mx-auto flex items-center justify-between px-3 py-1 gap-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Award className="text-white" size={18} />
        </div>
        <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
          ReviewAnything
        </h1>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={toggleSearchBar} className="p-1 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg" title="Search">
          <Search size={15} />
        </button>
        <button onClick={toggleFilters} className="p-1 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg" title="Filters">
          <Filter size={15} />
        </button>
        <div className="w-px h-5 bg-gray-700 mx-1"></div>
        {user ? (
          <>
            <img src={user.photoURL} alt={user.displayName} className="w-6 h-6 rounded-full" />
            <button onClick={handleLogout} className="p-1 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg" title="Logout">
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="px-2 py-1 bg-white text-gray-800 rounded-lg text-xs shadow hover:shadow-md flex items-center gap-1">
            <GoogleIcon />
            Sign in
          </button>
        )}
        <button
          onClick={() => setShowReviewForm(true)}
          disabled={!user}
          className={`px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs ml-1 ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Write
        </button>
        <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')} className="px-2 py-1 rounded-lg bg-gray-800 text-gray-100 text-xs ml-1">
          {language === 'en' ? '🇹🇭' : '🇬🇧'}
        </button>
      </div>
    </div>
  </header>
);

export default Header;
