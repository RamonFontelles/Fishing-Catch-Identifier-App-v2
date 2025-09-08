import React, { useState, useEffect, useCallback } from 'react';
import { FishInfo, CatchLog } from './types';
import { identifyFish } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import FishIdentificationCard from './components/FishIdentificationCard';
import CatchLogForm from './components/CatchLogForm';
import CatchHistory from './components/CatchHistory';
import Spinner from './components/Spinner';

type View = 'upload' | 'result' | 'logging' | 'history';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('upload');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [fishInfo, setFishInfo] = useState<FishInfo | null>(null);
  const [catchLogs, setCatchLogs] = useState<CatchLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('catchLogs');
      if (storedLogs) {
        setCatchLogs(JSON.parse(storedLogs));
      }
    } catch (e) {
      console.error("Failed to load catch logs from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('catchLogs', JSON.stringify(catchLogs));
    } catch (e) {
      console.error("Failed to save catch logs to localStorage", e);
    }
  }, [catchLogs]);

  const handleImageUpload = useCallback(async (b64: string, mimeType: string) => {
    setImageBase64(b64);
    setImageMimeType(mimeType);
    setIsLoading(true);
    setError(null);
    setFishInfo(null);
    setCurrentView('result');

    try {
      const result = await identifyFish(b64, mimeType);
      setFishInfo(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleReset = () => {
    setCurrentView('upload');
    setImageBase64(null);
    setImageMimeType(null);
    setFishInfo(null);
    setError(null);
    setIsLoading(false);
  };

  const handleStartLogging = () => {
    if (fishInfo) {
      setCurrentView('logging');
    }
  };

  const handleSaveLog = (logData: { location: string; date: string; size: string; weight?: string; notes?: string; }) => {
    if (fishInfo && imageBase64) {
      const newLog: CatchLog = {
        id: new Date().toISOString(),
        imageUrl: `data:${imageMimeType};base64,${imageBase64}`,
        ...fishInfo,
        ...logData,
      };
      setCatchLogs(prevLogs => [newLog, ...prevLogs]);
      setCurrentView('history');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'upload':
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case 'result':
        return (
          <div className="w-full max-w-2xl mx-auto">
            {isLoading && <Spinner message="Analyzing your catch..." />}
            {error && (
              <div className="text-center p-4 bg-red-900/50 rounded-lg">
                <p className="text-red-300 font-semibold">Identification Failed</p>
                <p className="text-red-400 mt-2">{error}</p>
                <button onClick={handleReset} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Try Again
                </button>
              </div>
            )}
            {fishInfo && imageBase64 && (
              <FishIdentificationCard
                fishInfo={fishInfo}
                imageUrl={`data:${imageMimeType};base64,${imageBase64}`}
                onLogCatch={handleStartLogging}
                onTryAgain={handleReset}
              />
            )}
          </div>
        );
      case 'logging':
        return fishInfo && <CatchLogForm fishInfo={fishInfo} onSubmit={handleSaveLog} onCancel={() => setCurrentView('result')} />;
      case 'history':
        return <CatchHistory logs={catchLogs} />;
      default:
        return <ImageUploader onImageUpload={handleImageUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-deep-water text-sand font-sans">
      <Header setCurrentView={setCurrentView} currentView={currentView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;