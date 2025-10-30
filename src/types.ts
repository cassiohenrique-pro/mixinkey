export interface Track {
    id: string;
    title: string;
    artist: string;
    key: string;
    bpm: number;
    energy: number;
}

export interface Suggestion {
    title: string;
    artist: string;
    reason: string;
}
