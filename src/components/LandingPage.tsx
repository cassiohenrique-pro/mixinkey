import React from 'react';
import { LogoIcon, BrainIcon, LibraryIcon, SparklesIcon } from './Icons';

interface LandingPageProps {
    onLaunchApp: () => void;
    onLaunchDemo: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-brand-surface p-6 rounded-lg border border-brand-accent/50 transform hover:scale-105 hover:border-brand-primary transition-all duration-300">
        <div className="flex items-center justify-center h-12 w-12 bg-brand-secondary rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-brand-text-primary mb-2">{title}</h3>
        <p className="text-brand-text-secondary text-sm">{description}</p>
    </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onLaunchDemo }) => {
    return (
        <div className="min-h-screen bg-brand-background font-sans text-brand-text-primary animate-fade-in-up">
            <header className="py-4 px-6 lg:px-12 flex justify-between items-center border-b border-brand-accent/30">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-8 w-8 text-brand-primary" />
                    <h1 className="text-2xl font-bold">Harmonic Mix AI</h1>
                </div>
                <a href="https://ai.google.dev/edge" target="_blank" rel="noopener noreferrer" className="text-sm text-brand-text-secondary hover:text-brand-primary transition-colors">
                    Powered by Gemini
                </a>
            </header>

            <main className="px-6 lg:px-12">
                {/* Hero Section */}
                <section className="text-center py-20 lg:py-32">
                    <h2 className="text-4xl lg:text-6xl font-extrabold text-brand-text-primary leading-tight">
                        Unlock the Perfect Mix, <br /> Every Single Time.
                    </h2>
                    <p className="max-w-2xl mx-auto mt-6 text-lg text-brand-text-secondary">
                        Stop guessing and start mixing with intelligence. Harmonic Mix AI analyzes your entire music library, providing you with perfect, harmonically-compatible track suggestions in seconds.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={onLaunchApp}
                            className="bg-brand-primary text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-green-500 transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto"
                        >
                            Launch App & Start Mixing
                        </button>
                        <button
                            onClick={onLaunchDemo}
                            className="bg-transparent border-2 border-brand-primary text-brand-primary font-bold py-4 px-8 rounded-full text-lg hover:bg-brand-primary hover:text-white transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        >
                            Try a Demo
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16">
                    <div className="text-center mb-12">
                         <h3 className="text-3xl font-bold">Your Intelligent DJ Assistant</h3>
                         <p className="text-brand-text-secondary mt-2">Everything you need to elevate your DJ sets.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <FeatureCard 
                            icon={<BrainIcon className="h-6 w-6 text-brand-primary" />}
                            title="AI-Powered Analysis"
                            description="Automatically analyze your tracks for key, BPM, and energy level with cutting-edge AI. No more manual tagging."
                        />
                        <FeatureCard 
                            icon={<SparklesIcon className="h-6 w-6 text-brand-primary" />}
                            title="Harmonic Suggestions"
                            description="Get expert recommendations based on the Camelot wheel system for seamless, in-key transitions that sound amazing."
                        />
                        <FeatureCard 
                            icon={<LibraryIcon className="h-6 w-6 text-brand-primary" />}
                            title="Advanced Library Tools"
                            description="Filter, sort, and even edit your track data on the fly. Export your filtered playlists to CSV for any DJ software."
                        />
                    </div>
                </section>
                
                 {/* How it Works Section */}
                <section className="py-20 text-center">
                    <h3 className="text-3xl font-bold mb-12">Get Started in 3 Simple Steps</h3>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-16 max-w-4xl mx-auto">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 text-xl font-bold bg-brand-secondary rounded-full border-2 border-brand-primary">1</div>
                            <p className="text-lg">Upload Your Tracks</p>
                        </div>
                        <div className="text-brand-accent hidden md:block">→</div>
                        <div className="flex items-center gap-4">
                             <div className="flex items-center justify-center w-12 h-12 text-xl font-bold bg-brand-secondary rounded-full border-2 border-brand-primary">2</div>
                            <p className="text-lg">Select a Track</p>
                        </div>
                         <div className="text-brand-accent hidden md:block">→</div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 text-xl font-bold bg-brand-secondary rounded-full border-2 border-brand-primary">3</div>
                            <p className="text-lg">Get AI Suggestions</p>
                        </div>
                    </div>
                </section>
            </main>
            
            <footer className="text-center py-8 border-t border-brand-accent/30 mt-16">
                <p className="text-brand-text-secondary text-sm">&copy; {new Date().getFullYear()} Harmonic Mix AI. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
