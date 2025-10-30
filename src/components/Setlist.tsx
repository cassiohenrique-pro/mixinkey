import React from 'react';
import { Track } from '../types';
import { TrashIcon, MusicNoteIcon } from './Icons';

interface SetlistProps {
    setlist: Track[];
    onRemoveFromSetlist: (trackId: string) => void;
    currentTrackId?: string;
}

const Setlist: React.FC<SetlistProps> = ({ setlist, onRemoveFromSetlist, currentTrackId }) => {
    return (
        <div className="bg-brand-surface rounded-lg p-4 shadow-lg flex flex-col mt-6">
            <h2 className="text-xl font-semibold mb-4">Current Setlist ({setlist.length})</h2>
            <div className="flex-grow space-y-2 overflow-y-auto pr-2 max-h-60">
                {setlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-4 h-full bg-brand-secondary rounded-lg min-h-[120px]">
                         <MusicNoteIcon className="h-12 w-12 text-brand-accent mb-3" />
                         <p className="text-sm text-brand-text-secondary">Your setlist is empty.</p>
                         <p className="text-xs text-brand-text-secondary">Add tracks from the Mixing Assistant.</p>
                    </div>
                ) : (
                    setlist.map((track, index) => (
                        <div key={track.id} className={`flex items-center justify-between p-2 rounded-md ${currentTrackId === track.id ? 'bg-brand-accent' : 'bg-brand-secondary'}`}>
                            <div className="flex items-center gap-3 truncate min-w-0">
                                <span className="text-sm font-mono text-brand-text-secondary w-5 flex-shrink-0">{index + 1}.</span>
                                <div className="truncate">
                                    <p className="font-medium truncate" title={track.title}>{track.title}</p>
                                    <p className="text-xs text-brand-text-secondary truncate" title={track.artist}>{track.artist}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => onRemoveFromSetlist(track.id)}
                                className="text-brand-text-secondary hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                                title="Remove from setlist"
                                aria-label={`Remove ${track.title} from setlist`}
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Setlist;
