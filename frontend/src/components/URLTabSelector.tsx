interface TabSelectorProps {
    activeTab: 'shorten' | 'retrieve';
    onTabChange: (tab: 'shorten' | 'retrieve') => void;
  }
  
  export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
    return (
      <div className="flex rounded-lg bg-gray-100 dark:bg-slate-700 p-1 mt-4">
        <button
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'shorten'
              ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
          onClick={() => onTabChange('shorten')}
        >
          Shorten URL
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'retrieve'
              ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          }`}
          onClick={() => onTabChange('retrieve')}
        >
          Retrieve URL
        </button>
      </div>
    );
  };