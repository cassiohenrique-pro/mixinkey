import React from 'react';
import { Track, Suggestion } from '../types';
import { PlayIcon, SpinnerIcon, PlusIcon } from './Icons';

interface MixingAssistantProps {
    currentTrack: Track | null;
    suggestions: Suggestion[];
    onSelectSuggestion: (suggestion: Suggestion) => void;
    isSuggesting: boolean;
    onAddToSetlist: (track: Track) => void;
    isTrackInSetlist: (trackId: string) => boolean;
}

const MixingAssistant: React.FC<MixingAssistantProps> = ({ currentTrack, suggestions, onSelectSuggestion, isSuggesting, onAddToSetlist, isTrackInSetlist }) => {
    return (
        <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Mixing Assistant</h2>
            
            {!currentTrack ? (
                 <div className="flex-grow flex flex-col items-center justify-center bg-brand-secondary rounded-lg text-center p-4 min-h-[200px]">
                    <PlayIcon className="h-16 w-16 text-brand-accent mb-4" />
                    <p className="text-brand-text-secondary">Select a track from your library</p>
                    <p className="text-brand-text-secondary text-sm">to get mixing suggestions.</p>
                </div>
            ) : (
                <div className="flex-grow flex flex-col">
                    <div className="bg-brand-secondary p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-start gap-2">
                             <div className="flex-grow min-w-0">
                                <p className="text-sm text-brand-text-secondary">Current Track</p>
                                <h3 className="text-lg font-bold text-brand-primary truncate" title={currentTrack.title}>{currentTrack.title}</h3>
                                <p className="text-md text-brand-text-secondary mb-2 truncate" title={currentTrack.artist}>{currentTrack.artist}</p>
                             </div>
                             <button
                                onClick={() => onAddToSetlist(currentTrack!)}
                                disabled={isTrackInSetlist(currentTrack!.id)}
                                className="flex items-center gap-2 bg-brand-accent text-brand-text-primary text-sm font-semibold py-2 px-3 rounded-full hover:bg-brand-primary transition-colors disabled:bg-brand-secondary disabled:text-brand-text-secondary disabled:cursor-not-allowed flex-shrink-0"
                                title="Add to Setlist"
                            >
                                <PlusIcon className="h-5 w-5"/>
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                            <span>Key: <strong className="font-mono">{currentTrack.key}</strong></span>
                            <span>BPM: <strong className="font-mono">{currentTrack.bpm}</strong></span>
                            <span>Energy: <strong className="font-mono">{currentTrack.energy}/10</strong></span>
                        </div>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-2 min-h-[150px]">
                        {isSuggesting && (
                             <div className="flex items-center justify-center gap-2 text-brand-text-secondary p-4">
                                <SpinnerIcon className="animate-spin h-5 w-5" />
                                <span>Finding Next Track...</span>
                            </div>
                        )}
                        {suggestions.map((suggestion, index) => (
                            <button 
                                key={index} 
                                onClick={() => onSelectSuggestion(suggestion)}
                                className="w-full text-left bg-brand-secondary p-3 rounded-lg animate-fade-in hover:bg-brand-accent transition-colors"
                            >
                                <p className="font-semibold truncate" title={suggestion.title}>{suggestion.title}</p>
                                <p className="text-sm text-brand-text-secondary mb-1 truncate" title={suggestion.artist}>{suggestion.artist}</p>
                                <p className="text-xs text-brand-text-secondary border-l-2 border-brand-primary pl-2">{suggestion.reason}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MixingAssistant;