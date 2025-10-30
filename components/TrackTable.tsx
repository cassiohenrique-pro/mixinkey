import React, { useState, useEffect } from 'react';
import { Track } from '../types';
import { ChevronUpIcon, ChevronDownIcon } from './Icons';

interface TrackTableProps {
    tracks: Track[];
    onSelectTrack: (track: Track) => void;
    currentTrackId: string | undefined;
    sortConfig: { key: keyof Track; direction: 'ascending' | 'descending' } | null;
    onSort: (key: keyof Track) => void;
    editingCell: { trackId: string; field: keyof Omit<Track, 'id'> } | null;
    onStartEditing: (trackId: string, field: keyof Omit<Track, 'id'>) => void;
    onCancelEditing: () => void;
    onUpdateTrack: (trackId: string, field: keyof Omit<Track, 'id'>, value: string) => void;
}

const SortableHeader: React.FC<{
    sortKey: keyof Track;
    title: string;
    onSort: (key: keyof Track) => void;
    sortConfig: TrackTableProps['sortConfig'];
    className?: string;
}> = ({ sortKey, title, onSort, sortConfig, className = '' }) => {
    const isSorted = sortConfig?.key === sortKey;
    const direction = sortConfig?.direction;

    return (
        <th className={`p-3 text-sm font-semibold text-brand-text-secondary ${className}`}>
            <button onClick={() => onSort(sortKey)} className="flex items-center gap-1 group">
                {title}
                <span className="opacity-30 group-hover:opacity-100 transition-opacity">
                    {isSorted ? (
                        direction === 'ascending' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                        <ChevronUpIcon className="h-4 w-4 opacity-50" />
                    )}
                </span>
            </button>
        </th>
    );
};

const EditableCell: React.FC<{
    value: string | number;
    trackId: string;
    field: keyof Omit<Track, 'id'>;
    isEditing: boolean;
    onStartEditing: (trackId: string, field: keyof Omit<Track, 'id'>) => void;
    onCancelEditing: () => void;
    onUpdateTrack: (trackId: string, field: keyof Omit<Track, 'id'>, value: string) => void;
    className?: string;
    inputType?: 'text' | 'number';
}> = ({ value, trackId, field, isEditing, onStartEditing, onCancelEditing, onUpdateTrack, className = '', inputType = 'text' }) => {
    
    const [editValue, setEditValue] = useState(value);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onUpdateTrack(trackId, field, e.currentTarget.value);
        } else if (e.key === 'Escape') {
            onCancelEditing();
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        onUpdateTrack(trackId, field, e.currentTarget.value);
    };

    if (isEditing) {
        return (
            <input
                type={inputType}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                autoFocus
                className={`w-full bg-brand-background border border-brand-primary rounded px-1 py-0.5 text-sm outline-none ${className}`}
            />
        );
    }

    return (
        <div onDoubleClick={() => onStartEditing(trackId, field)} className={`w-full h-full truncate ${className}`}>
            {value}
        </div>
    );
};


const TrackTable: React.FC<TrackTableProps> = ({ tracks, onSelectTrack, currentTrackId, sortConfig, onSort, editingCell, onStartEditing, onCancelEditing, onUpdateTrack }) => {
    return (
        <div className="overflow-auto flex-grow">
            <table className="w-full text-left table-auto">
                <thead className="sticky top-0 bg-brand-secondary z-10">
                    <tr>
                        <SortableHeader sortKey="title" title="TITLE" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="artist" title="ARTIST" onSort={onSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="key" title="KEY" onSort={onSort} sortConfig={sortConfig} className="text-center" />
                        <SortableHeader sortKey="bpm" title="BPM" onSort={onSort} sortConfig={sortConfig} className="text-center" />
                        <SortableHeader sortKey="energy" title="ENERGY" onSort={onSort} sortConfig={sortConfig} className="text-center" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-secondary">
                    {tracks.map((track) => {
                        const isSelected = currentTrackId === track.id;
                        return (
                            <tr
                                key={track.id}
                                onClick={() => onSelectTrack(track)}
                                className={`cursor-pointer hover:bg-brand-secondary transition-colors ${
                                    isSelected ? 'bg-brand-accent' : ''
                                }`}
                            >
                                <td className="p-3 font-medium max-w-xs">
                                    <EditableCell 
                                        value={track.title}
                                        trackId={track.id}
                                        field="title"
                                        isEditing={editingCell?.trackId === track.id && editingCell?.field === 'title'}
                                        onStartEditing={onStartEditing}
                                        onCancelEditing={onCancelEditing}
                                        onUpdateTrack={onUpdateTrack}
                                    />
                                </td>
                                <td className="p-3 text-brand-text-secondary max-w-xs">
                                     <EditableCell 
                                        value={track.artist}
                                        trackId={track.id}
                                        field="artist"
                                        isEditing={editingCell?.trackId === track.id && editingCell?.field === 'artist'}
                                        onStartEditing={onStartEditing}
                                        onCancelEditing={onCancelEditing}
                                        onUpdateTrack={onUpdateTrack}
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    <span className={`font-mono ${editingCell?.trackId === track.id && editingCell?.field === 'key' ? 'p-0' : 'bg-brand-primary/20 text-brand-primary text-sm font-bold py-1 px-2 rounded'}`}>
                                        <EditableCell 
                                            value={track.key}
                                            trackId={track.id}
                                            field="key"
                                            isEditing={editingCell?.trackId === track.id && editingCell?.field === 'key'}
                                            onStartEditing={onStartEditing}
                                            onCancelEditing={onCancelEditing}
                                            onUpdateTrack={onUpdateTrack}
                                            className="text-center font-mono"
                                        />
                                    </span>
                                </td>
                                <td className="p-3 text-brand-text-secondary text-center font-mono">
                                    <EditableCell 
                                        value={track.bpm}
                                        trackId={track.id}
                                        field="bpm"
                                        isEditing={editingCell?.trackId === track.id && editingCell?.field === 'bpm'}
                                        onStartEditing={onStartEditing}
                                        onCancelEditing={onCancelEditing}
                                        onUpdateTrack={onUpdateTrack}
                                        inputType="number"
                                        className="text-center"
                                    />
                                </td>
                                <td className="p-3 text-brand-text-secondary text-center font-mono">
                                     <EditableCell 
                                        value={track.energy}
                                        trackId={track.id}
                                        field="energy"
                                        isEditing={editingCell?.trackId === track.id && editingCell?.field === 'energy'}
                                        onStartEditing={onStartEditing}
                                        onCancelEditing={onCancelEditing}
                                        onUpdateTrack={onUpdateTrack}
                                        inputType="number"
                                        className="text-center"
                                    />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TrackTable;