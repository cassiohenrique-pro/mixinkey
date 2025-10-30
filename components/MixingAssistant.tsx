
import React from 'react';
import { Track, Suggestion } from '../types';
import { PlayIcon, SpinnerIcon } from './Icons';

interface MixingAssistantProps {
    currentTrack: Track | null;
    suggestions: Suggestion[];
    onGetSuggestions: () => void;
    isSuggesting: boolean;
}

const MixingAssistant: React.FC<MixingAssistantProps> = ({ currentTrack, suggestions, onGetSuggestions, isSuggesting }) => {
    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4">Mixing Assistant</h2>
            
            {!currentTrack ? (
                 <div className="flex-grow flex flex-col items-center justify-center bg-brand-secondary rounded-lg text-center p-4">
                    <PlayIcon className="h-16 w-16 text-brand-accent mb-4" />
                    <p className="text-brand-text-secondary">Select a track from your library</p>
                    <p className="text-brand-text-secondary text-sm">to get mixing suggestions.</p>
                </div>
            ) : (
                <div className="flex-grow flex flex-col">
                    <div className="bg-brand-secondary p-4 rounded-lg mb-4">
                        <p className="text-sm text-brand-text-secondary">Current Track</p>
                        <h3 className="text-lg font-bold text-brand-primary">{currentTrack.title}</h3>
                        <p className="text-md text-brand-text-secondary mb-2">{currentTrack.artist}</p>
                        <div className="flex gap-4 text-sm">
                            <span>Key: <strong className="font-mono">{currentTrack.key}</strong></span>
                            <span>BPM: <strong className="font-mono">{currentTrack.bpm}</strong></span>
                            <span>Energy: <strong className="font-mono">{currentTrack.energy}/10</strong></span>
                        </div>
                    </div>

                    <button 
                        onClick={onGetSuggestions}
                        disabled={isSuggesting}
                        className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-full hover:bg-green-500 transition-colors disabled:bg-brand-accent disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                    >
                        {isSuggesting ? (
                             <>
                                <SpinnerIcon className="animate-spin h-5 w-5" />
                                Finding Next Track...
                            </>
                        ) : (
                            "Get Suggestions"
                        )}
                    </button>

                    <div className="flex-grow space-y-3 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className="bg-brand-secondary p-3 rounded-lg animate-fade-in">
                                <p className="font-semibold">{suggestion.title}</p>
                                <p className="text-sm text-brand-text-secondary mb-1">{suggestion.artist}</p>
                                <p className="text-xs text-brand-text-secondary border-l-2 border-brand-primary pl-2">{suggestion.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MixingAssistant;
   