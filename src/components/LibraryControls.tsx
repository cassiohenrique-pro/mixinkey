import React from 'react';

interface LibraryControlsProps {
    filters: {
        key: string;
        bpm: { min: string; max: string };
        energy: { min: string; max: string };
    };
    onFilterChange: (filterName: string, value: any) => void;
    onResetFilters: () => void;
}

const FilterInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div className="flex flex-col">
        <label className="text-xs text-brand-text-secondary mb-1">{label}</label>
        <input 
            className="bg-brand-secondary border border-brand-accent rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary w-full"
            {...props} 
        />
    </div>
);

const LibraryControls: React.FC<LibraryControlsProps> = ({ filters, onFilterChange, onResetFilters }) => {
    return (
        <div className="flex-shrink-0 bg-brand-secondary/50 p-3 rounded-lg mb-4 flex flex-wrap items-end gap-4">
            <div className="flex-grow min-w-[100px]">
                <FilterInput 
                    label="Key"
                    type="text"
                    placeholder="e.g. 8A"
                    value={filters.key}
                    onChange={(e) => onFilterChange('key', e.target.value)}
                />
            </div>
            <div className="flex-grow flex items-end gap-2 min-w-[150px]">
                <FilterInput 
                    label="BPM Min"
                    type="number"
                    placeholder="Min"
                    value={filters.bpm.min}
                    onChange={(e) => onFilterChange('bpm.min', e.target.value)}
                />
                <FilterInput 
                    label="BPM Max"
                    type="number"
                    placeholder="Max"
                    value={filters.bpm.max}
                    onChange={(e) => onFilterChange('bpm.max', e.target.value)}
                />
            </div>
             <div className="flex-grow flex items-end gap-2 min-w-[150px]">
                <FilterInput 
                    label="Energy Min"
                    type="number"
                    placeholder="Min"
                    min="1"
                    max="10"
                    value={filters.energy.min}
                    onChange={(e) => onFilterChange('energy.min', e.target.value)}
                />
                <FilterInput 
                    label="Energy Max"
                    type="number"
                    placeholder="Max"
                    min="1"
                    max="10"
                    value={filters.energy.max}
                    onChange={(e) => onFilterChange('energy.max', e.target.value)}
                />
            </div>
            <button 
                onClick={onResetFilters}
                className="bg-brand-accent hover:bg-brand-accent/70 text-brand-text-secondary text-sm font-semibold py-2 px-4 rounded-md transition-colors"
            >
                Clear
            </button>
        </div>
    );
};

export default LibraryControls;
