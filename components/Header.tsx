import React from 'react';

type View = 'upload' | 'result' | 'logging' | 'history';

interface HeaderProps {
    setCurrentView: (view: View) => void;
    currentView: View;
}

const FishIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M6.5 12c.9 0 1.6.3 2.2.8.5.5.8 1.3.8 2.2s-.3 1.7-.8 2.2c-.6.5-1.3.8-2.2.8s-1.6-.3-2.2-.8c-.5-.5-.8-1.3-.8-2.2 0-.9.3-1.7.8-2.2.6-.5 1.3-.8 2.2-.8Z"/>
        <path d="M18 12c-2.5 0-4.5 2-4.5 4.5S15.5 21 18 21s4.5-2 4.5-4.5-2-4.5-4.5-4.5Z"/>
        <path d="M13.5 12H10c-2 0-4 1-4 3 0 2 2 3 4 3h2"/>
        <path d="m18 15-2-2"/>
        <path d="M13.5 6H10c-2 0-4 1-4 3 0 2 2 3 4 3h3.5"/>
        <path d="M18 9s-2-2-4.5-2-4.5 2-4.5 2"/>
        <path d="M22 9s-2-2-4.5-2-4.5 2-4.5 2"/>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ setCurrentView, currentView }) => {
    
    const navItemClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClasses = "bg-sea-green text-white";
    const inactiveClasses = "text-slate-300 hover:bg-ocean-blue/70 hover:text-white";

    return (
        <header className="bg-ocean-blue/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <FishIcon className="text-sea-green mr-3 h-8 w-8" />
                        <h1 className="text-xl font-bold text-white">Fishing Catch Identifier</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setCurrentView('upload')} 
                            className={`${navItemClasses} ${currentView === 'upload' || currentView === 'result' || currentView === 'logging' ? activeClasses : inactiveClasses}`}>
                            Identify
                        </button>
                        <button 
                            onClick={() => setCurrentView('history')}
                            className={`${navItemClasses} ${currentView === 'history' ? activeClasses : inactiveClasses}`}>
                            My Catches
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
