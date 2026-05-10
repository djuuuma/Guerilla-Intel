import csnades from './generated/csnades-lineups.json';
import { MapData, Lineup } from './types';

export const MAPS: MapData[] = [
  { id: 'mirage', name: 'MIRAGE', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop', status: 'UPDATED' },
  { id: 'inferno', name: 'INFERNO', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', status: 'UPDATED' },
  { id: 'dust2', name: 'DUST 2', image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2084&auto=format&fit=crop', status: 'UPDATED' },
  { id: 'ancient', name: 'ANCIENT', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2069&auto=format&fit=crop', status: 'UPDATED' },
  { id: 'anubis', name: 'ANUBIS', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop', status: 'UPDATED' },
  { id: 'nuke', name: 'NUKE', image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=2070&auto=format&fit=crop', status: 'OUTDATED' },
  { id: 'vertigo', name: 'VERTIGO', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', status: 'UPDATED' },
];

/** Five highest-priority smokes / utilities per map scraped from production CSNADES (see `npm run sync:csnades`). */
export const LINEUPS: Lineup[] = csnades.lineups as Lineup[];
