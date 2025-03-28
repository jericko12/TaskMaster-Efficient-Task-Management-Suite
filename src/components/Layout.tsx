import { Outlet } from 'react-router-dom';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { useState, useEffect } from 'react';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row">
      {/* Sidebar - Fixed on desktop, slide over on mobile */}
      <div 
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          fixed lg:static z-20 transition-transform duration-300 ease-in-out h-screen`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>
      
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <div className="transition-all duration-300 ease-in-out">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>TaskMaster by ProTech &copy; {new Date().getFullYear()} - Efficient Task Management Suite</p>
          <div className="flex justify-center space-x-4 mt-3">
            <a href="https://www.facebook.com/profile.php?id=61574105611075" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <i className="fab fa-facebook"></i> Facebook
            </a>
            <a href="https://www.youtube.com/@ghostedph834" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <i className="fab fa-youtube"></i> YouTube
            </a>
            <a href="https://github.com/jericko12" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
              <i className="fab fa-github"></i> GitHub
            </a>
            <a href="https://www.instagram.com/justcallme.eko/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>
          <div className="mt-4">
            <button
              className="inline-flex items-center px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors text-sm font-medium"
              onClick={() => setShowDonateModal(true)}
            >
              <i className="fas fa-mug-hot mr-2"></i> Donate a Coffee
            </button>
          </div>
        </footer>
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                <i className="fas fa-mug-hot text-yellow-500 mr-2"></i>
                GCash Donation Information
              </h3>
              <div className="mt-4 space-y-2 text-left bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Number:</span> 09706436276</p>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Account Name:</span> JE****O G.</p>
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Thank you for your support!</p>
            </div>
            <div className="mt-6 flex justify-center">
              <button 
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
                onClick={() => setShowDonateModal(false)}
              >
                OK
              </button>
            </div>
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowDonateModal(false)}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 