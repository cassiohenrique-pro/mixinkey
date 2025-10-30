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
            <button onClick={() => onSort(sortKey)} className="flex items-center gap-1 group whitespace-nowrap">
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
    
    const [editValue, setEditValue] = useState(String(value));

    useEffect(() => {
        setEditValue(String(value));
    }, [value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onUpdateTrack(trackId, field, e.currentTarget.value);
        } else if (e.key === 'Escape') {
            onCancelEditing();
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (String(value) !== e.currentTarget.value) {
            onUpdateTrack(trackId, field, e.currentTarget.value);
        } else {
            onCancelEditing();
        }
    };

    if (isEditing) {
        return (
            <td className="p-0">
                 <input
                    type={inputType}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    autoFocus
                    className={`w-full bg-brand-background border border-brand-primary rounded px-2 py-1 text-sm outline-none ${className}`}
                />
            </td>
        );
    }

    return (
        <td onDoubleClick={() => onStartEditing(trackId, field)} className={`p-3 ${className}`}>
            <div className="truncate">
                 {value}
            </div>
        </td>
    );
};

// FIX: Omitted `currentTrackId` from props type as it's not used in TrackTableRow.
const TrackTableRow: React.FC<Omit<TrackTableProps, 'tracks' | 'onSort' | 'sortConfig' | 'currentTrackId'> & { track: Track, isSelected: boolean }> = React.memo(({ track, isSelected, onSelectTrack, editingCell, onStartEditing, onCancelEditing, onUpdateTrack }) => {
    const isEditingField = (field: keyof Omit<Track, 'id'>) => editingCell?.trackId === track.id && editingCell?.field === field;

    return (
        <tr
            onClick={() => onSelectTrack(track)}
            className={`cursor-pointer hover:bg-brand-secondary transition-colors ${
                isSelected ? 'bg-brand-accent' : ''
            } ${editingCell?.trackId === track.id ? 'bg-brand-secondary' : ''}`}
        >
            <EditableCell 
                value={track.title} trackId={track.id} field="title"
                isEditing={isEditingField('title')}
                onStartEditing={onStartEditing} onCancelEditing={onCancelEditing} onUpdateTrack={onUpdateTrack}
                className="font-medium max-w-xs"
            />
            <EditableCell 
                value={track.artist} trackId={track.id} field="artist"
                isEditing={isEditingField('artist')}
                onStartEditing={onStartEditing} onCancelEditing={onCancelEditing} onUpdateTrack={onUpdateTrack}
                className="text-brand-text-secondary max-w-xs"
            />
            {isEditingField('key') ? (
                 <EditableCell 
                    value={track.key} trackId={track.id} field="key"
                    isEditing={true}
                    onStartEditing={onStartEditing} onCancelEditing={onCancelEditing} onUpdateTrack={onUpdateTrack}
                    className="text-center font-mono"
                />
            ) : (
                <td onDoubleClick={() => onStartEditing(track.id, 'key')} className="p-3 text-center">
                    <span className="bg-brand-primary/20 text-brand-primary text-sm font-bold py-1 px-2 rounded">
                        {track.key}
                    </span>
                </td>
            )}
            <EditableCell 
                value={track.bpm} trackId={track.id} field="bpm"
                isEditing={isEditingField('bpm')}
                onStartEditing={onStartEditing} onCancelEditing={onCancelEditing} onUpdateTrack={onUpdateTrack}
                inputType="number" className="text-center font-mono"
            />
            <EditableCell 
                value={track.energy} trackId={track.id} field="energy"
                isEditing={isEditingField('energy')}
                onStartEditing={onStartEditing} onCancelEditing={onCancelEditing} onUpdateTrack={onUpdateTrack}
                inputType="number" className="text-center font-mono"
            />
        </tr>
    );
});


const TrackTable: React.FC<TrackTableProps> = ({ tracks, onSelectTrack, currentTrackId, sortConfig, onSort, editingCell, onStartEditing, onCancelEditing, onUpdateTrack }) => {
    return (
        <div className="overflow-auto flex-grow relative">
            <table className="w-full text-left table-fixed">
                <thead className="sticky top-0 bg-brand-surface z-10">
                    <tr>
                        <SortableHeader sortKey="title" title="TITLE" onSort={onSort} sortConfig={sortConfig} className="w-2/5" />
                        <SortableHeader sortKey="artist" title="ARTIST" onSort={onSort} sortConfig={sortConfig} className="w-2/5" />
                        <SortableHeader sortKey="key" title="KEY" onSort={onSort} sortConfig={sortConfig} className="w-[80px]" />
                        <SortableHeader sortKey="bpm" title="BPM" onSort={onSort} sortConfig={sortConfig} className="w-[80px]" />
                        <SortableHeader sortKey="energy" title="ENERGY" onSort={onSort} sortConfig={sortConfig} className="w-[100px]" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-secondary">
                    {tracks.map((track) => (
                        <TrackTableRow
                            key={track.id}
                            track={track}
                            isSelected={currentTrackId === track.id}
                            onSelectTrack={onSelectTrack}
                            editingCell={editingCell}
                            onStartEditing={onStartEditing}
                            onCancelEditing={onCancelEditing}
                            onUpdateTrack={onUpdateTrack}
                         />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TrackTable;