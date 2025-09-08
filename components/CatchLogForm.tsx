import React, { useState } from 'react';
import { FishInfo } from '../types';

interface CatchLogFormProps {
    fishInfo: FishInfo;
    onSubmit: (data: { location: string; date: string; size: string; weight: string; notes?: string }) => void;
    onCancel: () => void;
}

const CatchLogForm: React.FC<CatchLogFormProps> = ({ fishInfo, onSubmit, onCancel }) => {
    const [location, setLocation] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [size, setSize] = useState(fishInfo.estimatedSize !== 'Cannot be estimated' ? fishInfo.estimatedSize : '');
    const [weight, setWeight] = useState(fishInfo.estimatedWeight !== 'Cannot be estimated' ? fishInfo.estimatedWeight : '');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ location, date, size, weight, notes });
    };

    const inputClasses = "w-full px-4 py-2 bg-deep-water border border-slate-600 rounded-md text-sand placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sea-green transition-all";

    return (
        <div className="max-w-lg mx-auto bg-ocean-blue/50 p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Log Your Catch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1">Location</label>
                    <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Lakeview Pier" className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="size" className="block text-sm font-medium text-slate-300 mb-1">Size / Length (Actual)</label>
                    <input type="text" id="size" value={size} onChange={e => setSize(e.target.value)} placeholder="e.g., 35 cm" className={inputClasses} required />
                </div>
                 <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-slate-300 mb-1">Weight (Actual)</label>
                    <input type="text" id="weight" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g., 1.2 kg" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                    <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g., Caught on a rainy morning with a silver spinner." className={inputClasses}></textarea>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="bg-sea-green hover:bg-sea-green/80 text-white font-bold py-2 px-6 rounded-lg transition-colors">Save Log</button>
                </div>
            </form>
        </div>
    );
};

export default CatchLogForm;