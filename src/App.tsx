import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Sword, 
  ChevronLeft, 
  Crosshair, 
  Wind, 
  Zap, 
  Flame, 
  Bomb,
  Save,
  Check,
  Terminal,
  Activity,
  User,
  Wifi,
  Clock,
  Layers,
  Map as MapIcon,
  ExternalLink
} from 'lucide-react';
import { MAPS, LINEUPS } from './data';
import { MapData, Lineup, Side, UtilityType } from './types';

// --- Components ---

const ScanlineOverlay = () => <div className="scanline absolute inset-0 pointer-events-none z-50 overflow-hidden" />;

const StatusText = ({ label, value, color = "text-[#D1D1C4]" }: { label: string; value: string; color?: string }) => (
  <div className="flex flex-col items-end leading-none">
    <span className="text-[9px] text-muted mb-0.5 tracking-tighter uppercase">{label}</span>
    <span className={`text-[10px] font-bold ${color}`}>{value}</span>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'MAPS' | 'LINEUPS' | 'DETAIL'>('MAPS');
  const [selectedMap, setSelectedMap] = useState<MapData>(MAPS[0]);
  const [selectedSide, setSelectedSide] = useState<Side>('T');
  const [selectedUtility, setSelectedUtility] = useState<UtilityType | null>('SMOKE');
  const [selectedLineup, setSelectedLineup] = useState<Lineup | null>(null);
  const [savedLineups, setSavedLineups] = useState<Set<string>>(new Set());
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredLineups = useMemo(() => {
    if (!selectedMap || !selectedUtility) return [];
    return LINEUPS.filter(l => 
      l.mapId === selectedMap.id && 
      l.side === selectedSide && 
      l.type === selectedUtility
    );
  }, [selectedMap, selectedSide, selectedUtility]);

  const toggleSave = (id: string) => {
    const newSaved = new Set(savedLineups);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedLineups(newSaved);
  };

  const handleMapSelect = (map: MapData) => {
    setSelectedMap(map);
    setView('LINEUPS');
  };

  const handleLineupSelect = (lineup: Lineup) => {
    setSelectedLineup(lineup);
    setView('DETAIL');
  };

  const navigateBack = () => {
    if (view === 'DETAIL') setView('LINEUPS');
    else if (view === 'LINEUPS') setView('MAPS');
  };

  return (
    <div className="fixed inset-0 bg-background text-text flex flex-col font-mono overflow-hidden tactical-border-bold select-none">
      {/* Top Header */}
      <header className="h-14 border-b-2 border-muted bg-surface flex items-center justify-between px-4 shrink-0 z-40 relative">
        <div className="flex items-center gap-3">
          {view !== 'MAPS' ? (
            <button 
              onClick={navigateBack} 
              className="p-1.5 border border-muted hover:border-primary text-primary active:bg-primary/20 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <div className="w-8 h-8 bg-primary flex items-center justify-center text-background font-black text-lg">GI</div>
          )}
          <div className="flex flex-col">
            <h1 className="text-xs md:text-sm font-black text-primary leading-none font-system uppercase">
              {view === 'MAPS' && 'INTEL_CENTAR'}
              {view === 'LINEUPS' && `${selectedMap.name} // TAKTIKE`}
              {view === 'DETAIL' && 'ANALIZA_TAKTIKE'}
            </h1>
            <span className="text-[7px] md:text-[9px] text-muted tracking-[0.2em] mt-0.5 uppercase">SEKTOR_01 // KOMANDA</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden xs:flex flex-col items-end">
            <StatusText label="STATUS" value="OPERATIVAN" color="text-success" />
          </div>
          <div className="w-1.5 h-1.5 bg-success animate-pulse shadow-[0_0_8px_var(--color-success)]" />
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative flex bg-background">
        <AnimatePresence mode="wait">
          {/* MAP SELECTION VIEW */}
          {view === 'MAPS' && (
            <motion.div 
              key="maps"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-muted pb-2">
                <h2 className="text-[9px] font-bold text-muted uppercase tracking-widest">AKTIVNI ZADACI // MAPE</h2>
                <span className="text-[8px] text-primary">POVEZANO...</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {MAPS.map((map) => (
                  <button
                    key={map.id}
                    onClick={() => handleMapSelect(map)}
                    className="relative w-full aspect-[21/9] border-2 border-muted hover:border-primary group overflow-hidden tactical-border-bold bg-surface"
                  >
                    <img 
                      src={map.image} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                       <div className="flex flex-col items-start translate-y-1 group-hover:translate-y-0 transition-transform">
                          <span className="text-[8px] text-primary uppercase font-bold tracking-tighter bg-background px-1 border border-primary/30 mb-1">MAP_{map.id.substring(0,3)}</span>
                          <h3 className="text-xl font-black font-system text-white uppercase">{map.name}</h3>
                       </div>
                       <div className={`w-3 h-3 ${map.status === 'OUTDATED' ? 'bg-red-500' : 'bg-success'} animate-pulse`} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* LINEUPS LIST VIEW */}
          {view === 'LINEUPS' && (
            <motion.div 
              key="lineups"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex-1 flex flex-col h-full"
            >
              <div className="h-16 shrink-0 border-b-2 border-muted flex">
                 <button 
                  onClick={() => setSelectedSide('T')}
                  className={`flex-1 font-black text-sm transition-all uppercase flex items-center justify-center gap-2 ${selectedSide === 'T' ? 'bg-primary text-background' : 'bg-surface/50 text-muted'}`}
                 >
                   <Sword size={14} /> TERORISTI [T]
                 </button>
                 <button 
                  onClick={() => setSelectedSide('CT')}
                  className={`flex-1 font-black text-sm border-l-2 border-muted transition-all uppercase flex items-center justify-center gap-2 ${selectedSide === 'CT' ? 'bg-[#1a2b3c] text-white' : 'bg-surface/50 text-muted'}`}
                 >
                   <Shield size={14} /> ANTI-TEROR [CT]
                 </button>
              </div>

              <div className="flex overflow-x-auto p-2 border-b-2 border-muted bg-surface/30 gap-2 shrink-0 scrollbar-none">
                {['SMOKE', 'FLASH', 'MOLOTOV', 'HE'].map((u) => (
                  <button 
                    key={u} 
                    onClick={() => setSelectedUtility(u as UtilityType)}
                    className={`px-4 py-2 border text-[9px] font-black transition-all whitespace-nowrap shadow-[2px_2px_0px_var(--color-muted)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${selectedUtility === u ? 'border-primary text-primary bg-primary/10' : 'border-muted text-muted bg-background'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-grid grid-lines">
                <div className="text-[9px] text-muted mb-2 uppercase flex justify-between border-b border-muted pb-1">
                  <span>REZULTATI PRETRAGE: {filteredLineups.length} VRSTA</span>
                  <Layers size={10} />
                </div>
                {filteredLineups.length > 0 ? filteredLineups.map((lineup) => (
                  <button
                    key={lineup.id}
                    onClick={() => handleLineupSelect(lineup)}
                    className="w-full bg-surface border border-muted p-2 hover:border-primary transition-all text-left group active:bg-muted/20 relative flex gap-3"
                  >
                    <img
                      src={lineup.thumbnail}
                      alt=""
                      className="shrink-0 w-24 h-[3.375rem] object-cover border border-muted grayscale-[0.2] opacity-85 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1.5 gap-2">
                         <h3 className="text-xs font-black text-primary uppercase leading-tight font-system">{lineup.origin} &gt; {lineup.target}</h3>
                         <span className="text-[8px] bg-background border border-muted px-1 text-muted uppercase font-bold shrink-0">{lineup.tickRate}T</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-muted font-bold tracking-tight gap-2">
                         <span className={lineup.difficulty === 'EASY' ? 'text-success' : 'text-accent'}>TEŽINA: {lineup.difficulty}</span>
                         <span className="opacity-60 truncate">{lineup.title}</span>
                      </div>
                    </div>
                    <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Crosshair size={10} className="text-primary" />
                    </div>
                  </button>
                )) : (
                  <div className="flex flex-col items-center justify-center p-10 opacity-30 text-center grayscale">
                    <Terminal size={48} className="mb-4" />
                    <span className="text-[10px] uppercase font-black">NEMA PRONAĐENIH TAKTIKA</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* DETAIL VIEW */}
          {view === 'DETAIL' && selectedLineup && (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto pb-32">
                {/* Media Block */}
                <div className="w-full aspect-video bg-black relative border-b-2 border-primary overflow-hidden group">
                  {/\.(mp4|webm)(\?|$)/i.test(selectedLineup.videoUrl) ? (
                    <video
                      key={selectedLineup.id}
                      src={selectedLineup.videoUrl}
                      className="w-full h-full object-contain"
                      autoPlay
                      muted
                      playsInline
                      controls
                      poster={selectedLineup.thumbnail}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <img src={selectedLineup.videoUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  )}
                  <ScanlineOverlay />
                  <div className="absolute top-2 left-2 bg-background/90 border border-primary px-2 py-0.5 text-[8px] text-primary flex items-center gap-1.5 font-bold uppercase">
                    <Activity size={10} className="animate-pulse" />
                    SIGN_ID: {selectedLineup.id.substring(0, 8)}
                  </div>
                </div>

                {/* Tactical Content */}
                <div className="p-4 space-y-6 bg-background">
                  <div className="border-l-4 border-primary pl-4 py-1 bg-surface/30">
                    <h2 className="text-xl font-black text-primary leading-tight font-system uppercase">{selectedLineup.origin} &rarr; {selectedLineup.target}</h2>
                    <p className="text-[10px] text-muted mt-1 uppercase tracking-widest">{selectedLineup.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface border border-muted p-2.5 flex flex-col gap-1">
                      <span className="text-[8px] text-muted uppercase font-bold">Težina_Izvršenja</span>
                      <span className={`text-[11px] font-black tracking-widest ${selectedLineup.difficulty === 'EASY' ? 'text-success' : 'text-accent'}`}>{selectedLineup.difficulty}</span>
                    </div>
                    <div className="bg-surface border border-muted p-2.5 flex flex-col gap-1">
                      <span className="text-[8px] text-muted uppercase font-bold">Standard_Servera</span>
                      <span className="text-[11px] font-black text-primary tracking-widest">{selectedLineup.tickRate} TICK</span>
                    </div>
                  </div>

                  {selectedLineup.sourceUrl && (
                    <a
                      href={selectedLineup.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 border border-primary/40 bg-primary/5 text-[10px] font-bold uppercase tracking-wide text-primary hover:bg-primary/10 transition-colors"
                    >
                      <ExternalLink size={14} className="shrink-0" />
                      <span>Puna demonstracija na CSNADES.gg — otvori u novom tabu</span>
                    </a>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-[9px] font-black text-muted tracking-[0.3em] uppercase border-b border-muted pb-1 flex justify-between items-center">
                      <span>PROCEDURA BACANJA</span>
                      <Crosshair size={10} />
                    </h3>
                    <div className="space-y-2">
                       {selectedLineup.steps.map((step, i) => (
                         <div key={i} className="flex gap-4 items-start bg-surface p-3 border border-muted/50 rounded-none relative overflow-hidden group">
                           <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted group-hover:bg-primary transition-colors" />
                           <span className="text-primary font-black text-[10px] mt-0.5">0{i+1}</span>
                           <p className="text-xs leading-relaxed text-[#D1D1C4] font-medium">
                             {step.split(' ').map((word, j) => {
                               const isAction = ['SKOK-BACANJE', 'BACANJE', 'LIJEVIM', 'JUMP-THROW', 'STANITE'].some(k => word.toUpperCase().includes(k));
                               return <span key={j} className={isAction ? 'text-primary font-black underline decoration-primary/30 underline-offset-2' : ''}>{word} </span>
                             })}
                           </p>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Visual Aid */}
                  <div className="pt-4 flex flex-col items-center">
                     <div className="w-24 h-24 border border-muted/30 relative flex items-center justify-center bg-surface/20 grid-lines">
                        <Crosshair size={32} className="text-primary/40" />
                        <div className="absolute inset-0 border border-primary/10 rotate-45 scale-75" />
                        <div className="absolute bottom-1 right-1 text-[7px] text-muted uppercase">SENZOR_A1</div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Action FAB */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t-2 border-muted z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                 <button 
                  onClick={() => toggleSave(selectedLineup.id)}
                  className={`w-full py-4 font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                    savedLineups.has(selectedLineup.id) 
                    ? 'bg-muted text-text border-2 border-text' 
                    : 'bg-primary text-background shadow-[0_0_15px_rgba(255,95,31,0.2)]'
                  }`}
                 >
                   {savedLineups.has(selectedLineup.id) ? (
                     <><Check size={16} /> DOKUMENTOVANO</>
                   ) : (
                     <><Save size={16} /> SPREMI INSTRUKCIJE</>
                   )}
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav / Tracker */}
      <footer className="h-10 border-t-2 border-muted bg-surface shrink-0 z-40 px-3 flex items-center justify-between text-[8px] text-muted font-bold tracking-tighter">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5 border-r border-muted pr-3">
             <MapIcon size={10} className="text-primary" />
             <span className="uppercase">{selectedMap.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
             <Activity size={10} className="text-success" />
             <span className="uppercase">VEZA: STABILNA</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden xs:flex items-center gap-1 bg-background px-1.5 py-0.5 border border-muted/30">
              <Clock size={10} />
              <span>{systemTime}</span>
           </div>
           <Wifi size={12} className="text-success animate-pulse" />
        </div>
      </footer>
      <ScanlineOverlay />
    </div>
  );
}


