import React from 'react';
import { CatchLog } from '../types';

interface CatchHistoryProps {
  logs: CatchLog[];
}

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);


const CatchHistory: React.FC<CatchHistoryProps> = ({ logs }) => {
  const handleExport = () => {
    if (logs.length === 0) return;

    // The data includes both predicted (estimated) and user-provided values
    const dataStr = JSON.stringify(logs, null, 2); // Pretty-print JSON
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catch-log.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  if (logs.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white">Your Catch Log is Empty</h2>
        <p className="mt-2 text-slate-400">Start by identifying a fish to add it to your logbook.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">My Catch Log</h2>
            <button
                onClick={handleExport}
                className="inline-flex items-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                <DownloadIcon />
                Export Data
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {logs.map(log => (
                <div key={log.id} className="bg-ocean-blue/50 rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-1 transition-transform duration-300">
                    <img src={log.imageUrl} alt={log.species} className="w-full h-48 object-cover"/>
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-white">{log.species}</h3>
                        <p className="text-sm text-sea-green font-medium">{log.habitat}</p>
                        <div className="mt-4 space-y-2 text-sm text-slate-300">
                            <p><strong>Date:</strong> {log.date}</p>
                            <p><strong>Location:</strong> {log.location}</p>
                            <p><strong>Size:</strong> {log.size}</p>
                            {log.weight && <p><strong>Weight:</strong> {log.weight}</p>}
                            {log.notes && <p className="text-slate-400 italic">"{log.notes}"</p>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default CatchHistory;