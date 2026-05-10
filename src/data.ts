import csnades from './generated/csnades-lineups.json';
import { MapData, Lineup } from './types';

export const MAPS: MapData[] = [
  { id: 'mirage', name: 'MIRAGE', image: '/mirage.jpg', status: 'UPDATED' },
  { id: 'inferno', name: 'INFERNO', image: '/inferno.webp', status: 'UPDATED' },
  { id: 'dust2', name: 'DUST 2', image: '/dust2.webp', status: 'UPDATED' },
  { id: 'ancient', name: 'ANCIENT', image: '/ancient.jpg', status: 'UPDATED' },
  { id: 'anubis', name: 'ANUBIS', image: '/anubis.webp', status: 'UPDATED' },
  { id: 'nuke', name: 'NUKE', image: '/nuke.avif', status: 'OUTDATED' },
  { id: 'vertigo', name: 'VERTIGO', image: '/vertigo.webp', status: 'UPDATED' },
];

/** Five highest-priority smokes / utilities per map scraped from production CSNADES (see `npm run sync:csnades`). */
export const LINEUPS: Lineup[] = csnades.lineups as Lineup[];
