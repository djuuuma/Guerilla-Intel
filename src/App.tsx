import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  Shield, 
  Sword, 
  ChevronLeft, 
  Crosshair, 
  Save,
  Check,
  Terminal,
  Activity,
  Wifi,
  Clock,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import { MAPS, LINEUPS } from './data';
import { MapData, Lineup, Side, SiteZone, UtilityType } from './types';

type SiteFilter = 'ALL' | SiteZone;
const SITE_SORT: Record<SiteZone, number> = { A: 0, MID: 1, B: 2 };

function siteLabel(z: SiteZone) {
  if (z === 'A') return 'SITE A';
  if (z === 'B') return 'SITE B';
  return 'MID';
}

function siteBadgeClass(z: SiteZone) {
  if (z === 'A') return 'border-success/50 text-success bg-success/10';
  if (z === 'B') return 'border-sky-500/50 text-sky-300 bg-sky-500/10';
  return 'border-accent/50 text-accent bg-accent/10';
}

// --- Components ---

const ScanlineOverlay = () => <div className="scanline absolute inset-0 pointer-events-none z-50 overflow-hidden" />;

const StatusText = ({ label, value, color = "text-[#D1D1C4]" }: { label: string; value: string; color?: string }) => (
  <div className="flex flex-col items-end leading-none">
    <span className="text-[10px] text-muted-fg mb-0.5 tracking-tighter uppercase">{label}</span>
    <span className={`text-xs font-bold ${color}`}>{value}</span>
  </div>
);

// --- Main App ---

export default function App() {
  const reduceMotion = useReducedMotion();
  const pageTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'tween' as const, duration: 0.22, ease: 'easeOut' as const };

  const [view, setView] = useState<'MAPS' | 'LINEUPS' | 'DETAIL'>('MAPS');
  const [selectedMap, setSelectedMap] = useState<MapData>(MAPS[0]);
  const [selectedSide, setSelectedSide] = useState<Side>('T');
  const [selectedUtility, setSelectedUtility] = useState<UtilityType | null>('SMOKE');
  const [siteFilter, setSiteFilter] = useState<SiteFilter>('ALL');
  const [selectedLineup, setSelectedLineup] = useState<Lineup | null>(null);
  const [savedLineups, setSavedLineups] = useState<Set<string>>(new Set());
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredLineups = useMemo(() => {
    if (!selectedMap || !selectedUtility) return [];
    let rows = LINEUPS.filter(
      (l) =>
        l.mapId === selectedMap.id && l.side === selectedSide && l.type === selectedUtility,
    );
    if (selectedUtility === 'SMOKE' && siteFilter !== 'ALL') {
      rows = rows.filter((l) => l.siteZone === siteFilter);
    }
    rows = [...rows].sort((a, b) => {
      if (selectedUtility === 'SMOKE' && siteFilter === 'ALL') {
        const z = SITE_SORT[a.siteZone] - SITE_SORT[b.siteZone];
        if (z !== 0) return z;
      }
      const o = a.origin.localeCompare(b.origin);
      if (o !== 0) return o;
      return a.target.localeCompare(b.target);
    });
    return rows;
  }, [selectedMap, selectedSide, selectedUtility, siteFilter]);

  const toggleSave = (id: string) => {
    const newSaved = new Set(savedLineups);
    if (newSaved.has(id)) newSaved.delete(id);
    else newSaved.add(id);
    setSavedLineups(newSaved);
  };

  const handleMapSelect = (map: MapData) => {
    setSelectedMap(map);
    setSiteFilter('ALL');
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
      <header className="min-h-14 pt-[env(safe-area-inset-top,0px)] border-b-2 border-muted bg-surface flex items-center justify-between px-4 shrink-0 z-40 relative pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]">
        <div className="flex items-center gap-3 min-w-0">
          {view !== 'MAPS' ? (
            <button 
              type="button"
              onClick={navigateBack} 
              className="min-h-11 min-w-11 shrink-0 flex items-center justify-center border border-muted hover:border-primary text-primary active:bg-primary/20 transition-colors cursor-pointer touch-manipulation"
              aria-label="Natrag"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
          ) : (
            <div className="w-8 h-8 shrink-0 bg-primary flex items-center justify-center text-background font-black text-lg" aria-hidden>GI</div>
          )}
          <div className="flex flex-col min-w-0">
            <h1 className="text-xs md:text-sm font-black text-primary leading-none font-system uppercase truncate">
              {view === 'MAPS' && 'ANESOV CENTAR ZA BOMBE'}
              {view === 'LINEUPS' && `${selectedMap.name} // TAKTIKE`}
              {view === 'DETAIL' && 'ANALIZA_TAKTIKE'}
            </h1>
            <span className="text-[11px] md:text-xs text-muted-fg tracking-[0.18em] mt-0.5 uppercase">SEKTOR_01 // KOMANDA</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden min-[480px]:flex flex-col items-end">
            <StatusText label="STATUS" value="OPERATIVAN" color="text-success" />
          </div>
          <div className="w-1.5 h-1.5 bg-success animate-pulse shadow-[0_0_8px_var(--color-success)] motion-reduce:animate-none" />
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative flex bg-background">
        <AnimatePresence mode="wait">
          {/* MAP SELECTION VIEW */}
          {view === 'MAPS' && (
            <motion.div 
              key="maps"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={reduceMotion ? false : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? false : { opacity: 0, scale: 1.02 }}
              transition={pageTransition}
              className="flex-1 overflow-y-auto p-4 space-y-4 select-text"
            >
              <div className="flex items-center justify-between border-b border-muted pb-2">
                <h2 className="text-[11px] font-bold text-muted-fg uppercase tracking-widest">AKTIVNI ZADACI // MAPE</h2>
                <span className="text-[11px] text-primary">POVEZANO...</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {MAPS.map((map) => (
                  <button
                    key={map.id}
                    type="button"
                    onClick={() => handleMapSelect(map)}
                    className="relative w-full aspect-[21/9] border-2 border-muted hover:border-primary group overflow-hidden tactical-border-bold bg-surface cursor-pointer touch-manipulation text-left"
                  >
                    <img 
                      src={map.image} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/65 md:from-background/90 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                       <div className="flex flex-col items-start translate-y-1 group-hover:translate-y-0 motion-safe:transition-transform">
                          <span className="text-[11px] text-primary uppercase font-bold tracking-tighter bg-background px-1 border border-primary/30 mb-1">MAP_{map.id.substring(0,3)}</span>
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
              initial={reduceMotion ? false : { opacity: 0, x: 30 }}
              animate={reduceMotion ? false : { opacity: 1, x: 0 }}
              exit={reduceMotion ? false : { opacity: 0, x: -30 }}
              transition={pageTransition}
              className="flex-1 flex flex-col h-full"
            >
              <div className="min-h-16 shrink-0 border-b-2 border-muted flex">
                 <button 
                  type="button"
                  onClick={() => { setSelectedSide('T'); setSiteFilter('ALL'); }}
                  className={`flex-1 min-h-14 font-black text-sm transition-colors uppercase flex items-center justify-center gap-2 cursor-pointer touch-manipulation motion-safe:active:scale-[0.99] ${selectedSide === 'T' ? 'bg-primary text-background' : 'bg-surface/50 text-muted-fg'}`}
                 >
                   <Sword size={14} aria-hidden /> TERORISTI [T]
                 </button>
                 <button 
                  type="button"
                  onClick={() => { setSelectedSide('CT'); setSiteFilter('ALL'); }}
                  className={`flex-1 min-h-14 font-black text-sm border-l-2 border-muted transition-colors uppercase flex items-center justify-center gap-2 cursor-pointer touch-manipulation motion-safe:active:scale-[0.99] ${selectedSide === 'CT' ? 'bg-[#1a2b3c] text-white' : 'bg-surface/50 text-muted-fg'}`}
                 >
                   <Shield size={14} aria-hidden /> ANTI-TEROR [CT]
                 </button>
              </div>

              <div className="flex overflow-x-auto p-2 border-b-2 border-muted bg-surface/30 gap-2 shrink-0 scrollbar-none touch-pan-x">
                {(['SMOKE', 'FLASH', 'MOLOTOV', 'HE'] as const).map((u) => (
                  <button 
                    key={u}
                    type="button"
                    onClick={() => { setSelectedUtility(u); setSiteFilter('ALL'); }}
                    className={`min-h-10 px-4 py-2 border text-[11px] font-black whitespace-nowrap shadow-[2px_2px_0px_var(--color-muted)] motion-safe:transition-shadow motion-safe:active:shadow-none motion-safe:active:translate-x-[2px] motion-safe:active:translate-y-[2px] cursor-pointer touch-manipulation ${selectedUtility === u ? 'border-primary text-primary bg-primary/10' : 'border-muted text-muted-fg bg-background'}`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              {selectedUtility === 'SMOKE' && (
                <div className="flex overflow-x-auto p-2 border-b-2 border-muted bg-background/50 gap-2 shrink-0 scrollbar-none touch-pan-x">
                  {(['ALL', 'A', 'MID', 'B'] as const).map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setSiteFilter(z)}
                      className={`min-h-10 px-4 py-2 border text-[11px] font-black uppercase tracking-tight whitespace-nowrap motion-safe:transition-colors ${
                        siteFilter === z
                          ? 'border-primary text-primary bg-primary/15 cursor-pointer touch-manipulation'
                          : 'border-muted text-muted-fg bg-surface/40 hover:border-muted/80 cursor-pointer touch-manipulation'
                      }`}
                    >
                      {z === 'ALL' ? 'SVE' : z === 'MID' ? 'MID / CHOKE' : `SITE ${z}`}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-grid grid-lines select-text">
                <div className="text-[11px] text-muted-fg mb-2 uppercase flex justify-between items-center border-b border-muted pb-1">
                  <span>REZULTATI PRETRAGE: {filteredLineups.length} VRSTA</span>
                  <Layers size={14} className="shrink-0 text-muted-fg opacity-70" aria-hidden />
                </div>
                {filteredLineups.length > 0 ? filteredLineups.map((lineup) => (
                  <button
                    key={lineup.id}
                    type="button"
                    onClick={() => handleLineupSelect(lineup)}
                    className="w-full min-h-[4.25rem] bg-surface border border-muted p-3 hover:border-primary motion-safe:transition-colors text-left group active:bg-muted/20 relative flex gap-3 cursor-pointer touch-manipulation"
                  >
                    <img
                      src={lineup.thumbnail}
                      alt={`${lineup.title} — ${lineup.origin} do ${lineup.target}`}
                      className="shrink-0 w-24 h-[3.375rem] object-cover border border-muted grayscale-[0.2] opacity-85 group-hover:opacity-100 group-hover:grayscale-0 motion-safe:transition-all"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1.5 gap-2">
                         <h3 className="text-sm font-black text-primary uppercase leading-tight font-system">{lineup.origin} &gt; {lineup.target}</h3>
                         <div className="flex flex-col items-end gap-0.5 shrink-0">
                           {lineup.type === 'SMOKE' && (
                             <span className={`text-[10px] px-1.5 py-0.5 border font-bold uppercase ${siteBadgeClass(lineup.siteZone)}`}>
                               {siteLabel(lineup.siteZone)}
                             </span>
                           )}
                           <span className="text-[11px] bg-background border border-muted px-1.5 py-0.5 text-muted-fg uppercase font-bold">{lineup.tickRate}T</span>
                         </div>
                      </div>
                      <div className="text-[11px] font-bold tracking-tight">
                         <span className={lineup.difficulty === 'EASY' ? 'text-success' : 'text-accent'}>TEŽINA: {lineup.difficulty}</span>
                      </div>
                    </div>
                    <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 motion-safe:transition-opacity max-sm:opacity-100">
                      <Crosshair size={12} className="text-primary" aria-hidden />
                    </div>
                  </button>
                )) : (
                  <div className="flex flex-col items-center justify-center p-10 opacity-30 text-center grayscale">
                    <Terminal size={48} className="mb-4" aria-hidden />
                    <span className="text-xs uppercase font-black">NEMA PRONAĐENIH TAKTIKA</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* DETAIL VIEW */}
          {view === 'DETAIL' && selectedLineup && (
            <motion.div 
              key="detail"
              initial={reduceMotion ? false : { opacity: 0, y: 50 }}
              animate={reduceMotion ? false : { opacity: 1, y: 0 }}
              exit={reduceMotion ? false : { opacity: 0, y: 50 }}
              transition={pageTransition}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto pb-[calc(9rem+env(safe-area-inset-bottom,0px))]">
                {/* Media Block */}
                <div className="w-full aspect-video bg-black relative border-b-2 border-primary overflow-hidden group">
                  {/\.(mp4|webm)(\?|$)/i.test(selectedLineup.videoUrl) ? (
                    <video
                      key={selectedLineup.id}
                      src={selectedLineup.videoUrl}
                      title={selectedLineup.title}
                      className="w-full h-full object-contain"
                      autoPlay
                      muted
                      playsInline
                      controls
                      poster={selectedLineup.thumbnail}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <img
                      src={selectedLineup.videoUrl}
                      alt={`Demonstracija bacanja: ${selectedLineup.origin} » ${selectedLineup.target}`}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <ScanlineOverlay />
                  <div className="absolute top-[max(0.5rem,env(safe-area-inset-top))] left-[max(0.5rem,env(safe-area-inset-left))] bg-background/90 border border-primary px-2 py-1 text-[11px] text-primary flex items-center gap-1.5 font-bold uppercase">
                    <Activity size={12} className="animate-pulse motion-reduce:animate-none shrink-0" aria-hidden />
                    SIGN_ID: {selectedLineup.id.substring(0, 8)}
                  </div>
                </div>

                {/* Tactical Content */}
                <div className="p-4 space-y-6 bg-background select-text">
                  <div className="border-l-4 border-primary pl-4 py-1 bg-surface/30">
                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                      <h2 className="text-xl font-black text-primary leading-tight font-system uppercase">{selectedLineup.origin} &rarr; {selectedLineup.target}</h2>
                      {selectedLineup.type === 'SMOKE' && (
                        <span className={`text-[10px] px-1.5 py-0.5 border font-black uppercase ${siteBadgeClass(selectedLineup.siteZone)}`}>
                          {siteLabel(selectedLineup.siteZone)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-fg mt-1 uppercase tracking-widest">{selectedLineup.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface border border-muted p-2.5 flex flex-col gap-1">
                      <span className="text-[11px] text-muted-fg uppercase font-bold">Težina_Izvršenja</span>
                      <span className={`text-sm font-black tracking-widest ${selectedLineup.difficulty === 'EASY' ? 'text-success' : 'text-accent'}`}>{selectedLineup.difficulty}</span>
                    </div>
                    <div className="bg-surface border border-muted p-2.5 flex flex-col gap-1">
                      <span className="text-[11px] text-muted-fg uppercase font-bold">Standard_Servera</span>
                      <span className="text-sm font-black text-primary tracking-widest">{selectedLineup.tickRate} TICK</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[11px] font-black text-muted-fg tracking-[0.25em] uppercase border-b border-muted pb-1 flex justify-between items-center">
                      <span>PROCEDURA BACANJA</span>
                      <Crosshair size={14} className="shrink-0 opacity-80" aria-hidden />
                    </h3>
                    <div className="space-y-2">
                       {selectedLineup.steps.map((step, i) => (
                         <div key={i} className="flex gap-4 items-start bg-surface p-3 border border-muted/50 rounded-none relative overflow-hidden group">
                           <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted group-hover:bg-primary motion-safe:transition-colors" />
                           <span className="text-primary font-black text-xs shrink-0 mt-0.5">0{i+1}</span>
                           <p className="text-sm leading-relaxed text-text font-medium">
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
                        <div className="absolute bottom-1 right-1 text-[10px] text-muted-fg uppercase">SENZOR_A1</div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Action FAB */}
              <div className="fixed bottom-0 left-0 right-0 z-50 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-4 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] bg-background border-t-2 border-muted shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                 <button 
                  type="button"
                  onClick={() => toggleSave(selectedLineup.id)}
                  className={`w-full min-h-14 py-4 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 cursor-pointer touch-manipulation motion-safe:active:scale-[0.98] motion-safe:transition-transform ${
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
      <footer className="min-h-10 pb-[env(safe-area-inset-bottom,0px)] border-t-2 border-muted bg-surface shrink-0 z-40 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] flex items-center justify-between text-[11px] text-muted-fg font-bold tracking-tight gap-2">
        <div className="flex gap-4 items-center min-w-0">
          <div className="flex items-center gap-1.5 border-r border-muted pr-3 shrink-0">
             <MapIcon size={14} className="text-primary shrink-0" aria-hidden />
             <span className="uppercase truncate max-w-[9rem] sm:max-w-none">{selectedMap.name}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
             <Activity size={14} className="text-success shrink-0" aria-hidden />
             <span className="uppercase hidden min-[380px]:inline">VEZA: STABILNA</span>
             <span className="uppercase min-[380px]:hidden">STABILNA</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
           <div className="hidden min-[480px]:flex items-center gap-1 bg-background px-2 py-1 border border-muted/30">
              <Clock size={14} aria-hidden />
              <span className="tabular-nums">{systemTime}</span>
           </div>
           <Wifi size={14} className="text-success animate-pulse motion-reduce:animate-none shrink-0" aria-hidden />
        </div>
      </footer>
      <ScanlineOverlay />
    </div>
  );
}


