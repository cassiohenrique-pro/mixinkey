import React, { useState, useCallback, useMemo } from 'react';
import { Track, Suggestion } from './types';
import { analyzeFile, getSuggestions } from './services/geminiService';
import TrackUploader from './components/TrackUploader';
import TrackTable from './components/TrackTable';
import MixingAssistant from './components/MixingAssistant';
import LibraryControls from './components/LibraryControls';
import { MusicNoteIcon, LogoIcon, DownloadIcon } from './components/Icons';
import LandingPage from './components/LandingPage';

type AppState = 'landing' | 'app';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('landing');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    
    const [filters, setFilters] = useState({
        key: '',
        bpm: { min: '', max: '' },
        energy: { min: '', max: '' },
    });

    const [sortConfig, setSortConfig] = useState<{ key: keyof Track; direction: 'ascending' | 'descending' }>({
        key: 'artist',
        direction: 'ascending',
    });
    
    const [editingCell, setEditingCell] = useState<{ trackId: string; field: keyof Omit<Track, 'id'> } | null>(null);
    
    const handleLaunchApp = () => setAppState('app');

    const handleFilesChange = useCallback(async (files: FileList) => {
        setIsAnalyzing(true);
        setError(null);
        const newTracks: Track[] = [];
        try {
            for (const file of files) {
                if (!tracks.some(t => t.id === file.name) && !newTracks.some(t => t.id === file.name)) {
                    const analyzedTrack = await analyzeFile(file.name);
                    newTracks.push({ ...analyzedTrack, id: file.name });
                }
            }
            setTracks(prev => [...prev, ...newTracks]);
        } catch (err) {
            console.error("Error analyzing files:", err);
            setError("Failed to analyze one or more tracks. Please check the console for details.");
        } finally {
            setIsAnalyzing(false);
        }
    }, [tracks]);

    const handleSelectTrack = useCallback((track: Track) => {
        if (editingCell && editingCell.trackId !== track.id) return;
        setCurrentTrack(track);
        setSuggestions([]);
    }, [editingCell]);

    const handleGetSuggestions = useCallback(async () => {
        if (!currentTrack) return;
        
        setIsSuggesting(true);
        setError(null);
        setSuggestions([]);

        try {
            const otherTracks = tracks.filter(t => t.id !== currentTrack.id);
            if (otherTracks.length > 0) {
                const result = await getSuggestions(currentTrack, otherTracks);
                setSuggestions(result);
            }
        } catch (err) {
            console.error("Error getting suggestions:", err);
            setError("Failed to get suggestions. The model might be unavailable or the request timed out.");
        } finally {
            setIsSuggesting(false);
        }
    }, [currentTrack, tracks]);
    
    const handleFilterChange = useCallback((filterName: string, value: any) => {
        const [field, subfield] = filterName.split('.');
        if (subfield) {
            setFilters(prev => ({
                ...prev,
                [field]: { ...prev[field as 'bpm' | 'energy'], [subfield]: value }
            }));
        } else {
            setFilters(prev => ({ ...prev, [field]: value }));
        }
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({ key: '', bpm: { min: '', max: '' }, energy: { min: '', max: '' } });
    }, []);
    
    const handleSort = useCallback((key: keyof Track) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);
    
    const handleStartEditing = (trackId: string, field: keyof Omit<Track, 'id'>) => {
        setEditingCell({ trackId, field });
    };

    const handleCancelEditing = () => {
        setEditingCell(null);
    };

    const handleUpdateTrack = (trackId: string, field: keyof Omit<Track, 'id'>, value: string) => {
        const numericFields = ['bpm', 'energy'];
        let processedValue: string | number = value;

        if (numericFields.includes(field)) {
            processedValue = parseFloat(value);
            if (isNaN(processedValue)) {
                setEditingCell(null);
                return;
            }
        }
        
        const updatedTracks = tracks.map(track => {
            if (track.id === trackId) {
                return { ...track, [field]: processedValue };
            }
            return track;
        });
        setTracks(updatedTracks);
        
        if (currentTrack?.id === trackId) {
            const updatedCurrentTrack = updatedTracks.find(t => t.id === trackId)!;
            setCurrentTrack(updatedCurrentTrack);
            if (['key', 'bpm', 'energy'].includes(field)) {
                setSuggestions([]);
            }
        }

        setEditingCell(null);
    };

    const processedTracks = useMemo(() => {
        let filtered = [...tracks].filter(track => {
            const keyMatch = track.key.toLowerCase().includes(filters.key.toLowerCase());
            const bpmMin = filters.bpm.min ? parseFloat(filters.bpm.min) : 0;
            const bpmMax = filters.bpm.max ? parseFloat(filters.bpm.max) : Infinity;
            const bpmMatch = track.bpm >= bpmMin && track.bpm <= bpmMax;
            const energyMin = filters.energy.min ? parseInt(filters.energy.min, 10) : 0;
            const energyMax = filters.energy.max ? parseInt(filters.energy.max, 10) : Infinity;
            const energyMatch = track.energy >= energyMin && track.energy <= energyMax;
            return keyMatch && bpmMatch && energyMatch;
        });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [tracks, filters, sortConfig]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFilesChange(files);
        }
    };

    const handleExport = () => {
        if (processedTracks.length === 0) return;
        const headers = ['Filename', 'Title', 'Artist', 'Key', 'BPM', 'Energy'];
        const escapeCsvCell = (cell: any) => {
            const stringCell = String(cell);
            if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
                return `"${stringCell.replace(/"/g, '""')}"`;
            }
            return stringCell;
        };
        const csvRows = [
            headers.join(','),
            ...processedTracks.map(track => [
                escapeCsvCell(track.id),
                escapeCsvCell(track.title),
                escapeCsvCell(track.artist),
                escapeCsvCell(track.key),
                escapeCsvCell(track.bpm),
                escapeCsvCell(track.energy)
            ].join(','))
        ];
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) URL.revokeObjectURL(link.href);
        link.href = URL.createObjectURL(blob);
        link.download = 'harmonic-mix-playlist.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    if (appState === 'landing') {
        return <LandingPage onLaunchApp={handleLaunchApp} />;
    }

    return (
        <div className="min-h-screen bg-brand-background font-sans p-4 lg:p-6 animate-fade-in-up">
            <header className="flex items-center justify-between pb-4 border-b border-brand-accent mb-6">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-8 w-8 text-brand-primary" />
                    <h1 className="text-2xl lg:text-3xl font-bold text-brand-text-primary">Harmonic Mix AI</h1>
                </div>
                 <a href="https://ai.google.dev/edge" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">
                    Powered by Gemini
                </a>
            </header>
            
            <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div 
                    className={`lg:col-span-3 bg-brand-surface rounded-lg p-4 shadow-lg flex flex-col transition-colors ${isDraggingOver ? 'bg-brand-primary/20' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex justify-between items-center mb-4 flex-shrink-0 gap-2">
                        <h2 className="text-xl font-semibold">Music Library ({processedTracks.length})</h2>
                        <div className="flex items-center gap-2">
                             <button
                                onClick={handleExport}
                                disabled={processedTracks.length === 0}
                                className="flex items-center gap-2 bg-brand-accent text-brand-text-primary font-semibold py-2 px-4 rounded-full hover:bg-brand-accent/70 transition-colors disabled:bg-brand-secondary disabled:text-brand-text-secondary disabled:cursor-not-allowed"
                                title="Export filtered list as CSV"
                            >
                                <DownloadIcon className="h-5 w-5" />
                                Export
                            </button>
                            <TrackUploader onFilesChange={handleFilesChange} isAnalyzing={isAnalyzing} />
                        </div>
                    </div>
                    {tracks.length > 0 ? (
                        <>
                            <LibraryControls 
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onResetFilters={handleResetFilters}
                            />
                            <TrackTable 
                                tracks={processedTracks} 
                                onSelectTrack={handleSelectTrack} 
                                currentTrackId={currentTrack?.id}
                                sortConfig={sortConfig}
                                onSort={handleSort}
                                editingCell={editingCell}
                                onStartEditing={handleStartEditing}
                                onCancelEditing={handleCancelEditing}
                                onUpdateTrack={handleUpdateTrack}
                             />
                        </>
                    ) : (
                        <div className={`flex-grow flex flex-col items-center justify-center h-96 border-2 border-dashed border-brand-accent rounded-lg transition-colors ${isDraggingOver ? 'border-brand-primary' : ''}`}>
                            <MusicNoteIcon className="h-16 w-16 text-brand-accent mb-4" />
                            <p className="text-brand-text-secondary">Your library is empty.</p>
                            <p className="text-brand-text-secondary">Drag & drop your music files here or</p>
                            <p className="text-brand-text-secondary">use the "Add Tracks" button to start.</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-brand-surface rounded-lg p-4 shadow-lg">
                    <MixingAssistant 
                        currentTrack={currentTrack} 
                        suggestions={suggestions}
                        onGetSuggestions={handleGetSuggestions}
                        isSuggesting={isSuggesting}
                    />
                </div>
            </main>
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-xl max-w-sm">
                    <h3 className="font-bold">An Error Occurred</h3>
                    <p>{error}</p>
                    <button onClick={() => setError(null)} className="absolute top-2 right-2 text-xl">&times;</button>
                </div>
            )}
        </div>
    );
};

export default App;