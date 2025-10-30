
import React, { useRef } from 'react';
import { UploadIcon, SpinnerIcon } from './Icons';

interface TrackUploaderProps {
    onFilesChange: (files: FileList) => void;
    isAnalyzing: boolean;
}

const TrackUploader: React.FC<TrackUploaderProps> = ({ onFilesChange, isAnalyzing }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            onFilesChange(event.target.files);
            // Reset the input value to allow re-uploading the same file
            event.target.value = '';
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="audio/*"
            />
            <button
                onClick={handleButtonClick}
                disabled={isAnalyzing}
                className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-green-500 transition-colors disabled:bg-brand-accent disabled:cursor-not-allowed"
            >
                {isAnalyzing ? (
                    <>
                        <SpinnerIcon className="animate-spin h-5 w-5" />
                        Analyzing...
                    </>
                ) : (
                    <>
                        <UploadIcon className="h-5 w-5" />
                        Add Tracks
                    </>
                )}
            </button>
        </div>
    );
};

export default TrackUploader;
   