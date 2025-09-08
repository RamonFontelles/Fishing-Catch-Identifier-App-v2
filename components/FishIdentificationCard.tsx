import React from 'react';
import { FishInfo } from '../types';

interface FishIdentificationCardProps {
  fishInfo: FishInfo;
  imageUrl: string;
  onLogCatch: () => void;
  onTryAgain: () => void;
}

const RulerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L3 8.4a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0l12.3 12.3Z"/><path d="M14.5 7.5 3 19"/><path d="m16.5 9.5 1-1"/><path d="m12.5 11.5 1-1"/><path d="m8.5 15.5 1-1"/><path d="m10.5 13.5 1-1"/></svg>
);
const WeightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5a3 3 0 0 1 3 3c0 1.2-.8 2-2 2H8a2 2 0 0 0-2 2 3 3 0 0 1-3 3"/><path d="M12 19a3 3 0 0 0-3-3c0-1.2.8-2 2-2h4a2 2 0 0 1 2 2 3 3 0 0 0 3 3"/><circle cx="12" cy="12" r="10"/></svg>
);

const FishIdentificationCard: React.FC<FishIdentificationCardProps> = ({ fishInfo, imageUrl, onLogCatch, onTryAgain }) => {
  return (
    <div className="bg-ocean-blue/50 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
      <img src={imageUrl} alt={fishInfo.species} className="w-full h-64 object-cover" />
      <div className="p-6">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-bold text-white">{fishInfo.species}</h2>
                <p className="text-lg text-sea-green font-semibold">{fishInfo.habitat}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${fishInfo.isEdible ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {fishInfo.isEdible ? 'Edible' : 'Not Edible'}
            </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-700 pt-4">
            <div className="flex items-center">
                <RulerIcon className="h-6 w-6 text-sea-green mr-3"/>
                <div>
                    <p className="text-sm text-slate-400">Estimated Size</p>
                    <p className="font-semibold text-white">{fishInfo.estimatedSize}</p>
                </div>
            </div>
            <div className="flex items-center">
                <WeightIcon className="h-6 w-6 text-sea-green mr-3"/>
                <div>
                    <p className="text-sm text-slate-400">Estimated Weight</p>
                    <p className="font-semibold text-white">{fishInfo.estimatedWeight}</p>
                </div>
            </div>
        </div>
        
        <p className="mt-4 text-slate-300">
          {fishInfo.description}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onLogCatch} 
            className="flex-1 bg-sea-green hover:bg-sea-green/80 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Log This Catch
          </button>
          <button 
            onClick={onTryAgain} 
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Identify Another
          </button>
        </div>
      </div>
    </div>
  );
};

export default FishIdentificationCard;