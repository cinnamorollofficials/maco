import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Repeat, 
  Shuffle, 
  Music as MusicIcon,
  Home,
  Compass,
  Radio,
  Clock,
  Mic2,
  ListMusic,
  Share2,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const TRACKS = [
  {
    id: 1,
    title: "After Hours",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300&h=300",
    color: "bg-red-900"
  },
  {
    id: 2,
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=300&h=300",
    color: "bg-blue-900"
  },
  {
    id: 3,
    title: "Blueberry Eyes",
    artist: "MAX ft. SUGA",
    album: "Colour Vision",
    cover: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=300&h=300",
    color: "bg-yellow-900"
  },
  {
    id: 4,
    title: "Positions",
    artist: "Ariana Grande",
    album: "Positions",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300&h=300",
    color: "bg-green-900"
  }
];

const MusicContent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(75);

  useEffect(() => {
    let interval: any;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.5, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white select-none">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[180px] bg-black/20 backdrop-blur-md border-r border-white/5 flex flex-col p-4 gap-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/10 text-white text-[13px] font-medium cursor-default">
                <Home size={16} className="text-pink-500" />
                Listen Now
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-[13px] font-medium cursor-default transition-colors">
                <Compass size={16} className="text-pink-500" />
                Browse
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-[13px] font-medium cursor-default transition-colors">
                <Radio size={16} className="text-pink-500" />
                Radio
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-bold text-white/30 uppercase px-2 mb-2 tracking-wider">Library</div>
              {[
                { label: "Recently Added", icon: <Clock size={16} /> },
                { label: "Artists", icon: <Mic2 size={16} /> },
                { label: "Albums", icon: <div className="w-4 h-4 border border-current rounded-sm opacity-60" /> },
                { label: "Songs", icon: <MusicIcon size={16} /> },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-[13px] font-medium cursor-default transition-colors">
                  <span className="text-pink-500">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-1">
            <div className="text-[11px] font-bold text-white/30 uppercase px-2 mb-2 tracking-wider">Playlists</div>
            <div className="px-2 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 text-[13px] font-medium cursor-default transition-colors">
              All Playlists
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 pt-6 relative">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Listen Now</h1>
            <div className="h-px bg-white/10 mt-4" />
          </header>

          <section className="space-y-8">
            {/* Hero Section */}
            <div className="relative h-[220px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1514525253361-bee045d40fb3?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Featured"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[12px] font-bold uppercase tracking-[2px] text-pink-500 mb-1">Featured Station</span>
                <h2 className="text-4xl font-black italic tracking-tighter">APPLE MUSIC 1</h2>
                <p className="text-white/70 text-[14px] mt-1">The new music that matters now.</p>
              </div>
            </div>

            {/* Recently Played */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Recently Played</h3>
                <span className="text-pink-500 text-[13px] font-medium cursor-pointer hover:underline">See All</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
                {TRACKS.map(track => (
                  <motion.div 
                    key={track.id}
                    whileHover={{ y: -4 }}
                    onClick={() => setCurrentTrack(track)}
                    className="flex flex-col gap-2 group cursor-pointer"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden shadow-lg relative">
                      <img src={track.cover} className="w-full h-full object-cover" alt={track.title} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
                          <Play size={20} className="fill-white text-white translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-[14px] line-clamp-1">{track.title}</h4>
                      <p className="text-white/50 text-[12px]">{track.artist}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Player Bar */}
      <footer className="h-[80px] bg-[#252525]/90 backdrop-blur-3xl border-t border-white/10 px-4 flex items-center justify-between z-10">
        {/* Left: Track Info */}
        <div className="flex items-center gap-3 w-[25%] overflow-hidden">
          <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg">
            <img src={currentTrack.cover} className="w-full h-full object-cover" alt="Cover" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[13px] font-bold truncate">{currentTrack.title}</span>
            <span className="text-[11px] text-white/50 truncate">{currentTrack.artist}</span>
          </div>
          <button className="ml-2 text-white/40 hover:text-pink-500 transition-colors">
            <Heart size={16} />
          </button>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex flex-col items-center gap-2 max-w-[40%] flex-1">
          <div className="flex items-center gap-6">
            <button className="text-white/40 hover:text-white transition-colors"><Shuffle size={14} /></button>
            <button className="text-white/80 hover:text-white transition-colors" onClick={() => setProgress(0)}><SkipBack size={20} fill="currentColor" /></button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="translate-x-0.5" />}
            </button>
            <button className="text-white/80 hover:text-white transition-colors"><SkipForward size={20} fill="currentColor" /></button>
            <button className="text-white/40 hover:text-white transition-colors"><Repeat size={14} /></button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-[400px]">
            <span className="text-[10px] text-white/30 font-medium tabular-nums w-8 text-right">
              {Math.floor((progress * 180) / 100 / 60)}:{(Math.floor((progress * 180) / 100) % 60).toString().padStart(2, '0')}
            </span>
            <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-white/60 group-hover:bg-pink-500 rounded-full transition-colors"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-white/30 font-medium tabular-nums w-8 text-left">
              -{Math.floor(((100 - progress) * 180) / 100 / 60)}:{(Math.floor(((100 - progress) * 180) / 100) % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Right: Tools & Volume */}
        <div className="flex items-center justify-end gap-3 w-[25%] text-white/60">
          <ListMusic size={16} className="hover:text-white cursor-pointer" />
          <Share2 size={16} className="hover:text-white cursor-pointer" />
          <div className="flex items-center gap-2 group min-w-[100px]">
            <Volume2 size={16} />
            <div className="w-[80px] h-1 bg-white/10 rounded-full relative overflow-hidden group-hover:h-1 transition-all">
              <div 
                className="absolute inset-y-0 left-0 bg-white/60 group-hover:bg-pink-500"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MusicContent;
