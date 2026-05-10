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

export const LINEUPS: Lineup[] = [
  {
    id: 'mirage-t-smoke-stairs',
    mapId: 'mirage',
    side: 'T',
    type: 'SMOKE',
    title: 'STAIRS SA A-RAMPE',
    origin: 'A-RAMPA',
    target: 'STAIRS',
    thumbnail: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop',
    videoUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHRxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5pXp7KVO/giphy.gif',
    difficulty: 'EASY',
    tickRate: 'BOTH',
    steps: [
      'Stani u ugao kod drvene ograde na A-rampi.',
      'Naciljaj sredinu izbočine na zidu iznad Stairsa.',
      'Skoči i baci (JUMP-THROW).'
    ],
    coordinates: { x: '142.5', y: '88.2' }
  },
  {
    id: 'mirage-t-smoke-jungle',
    mapId: 'mirage',
    side: 'T',
    type: 'SMOKE',
    title: 'JUNGLE SA A-RAMPE',
    origin: 'A-RAMPA',
    target: 'JUNGLE',
    thumbnail: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop',
    videoUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHRxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5pXp7KVO/giphy.gif',
    difficulty: 'MEDIUM',
    tickRate: 'BOTH',
    steps: [
      'Stani ispred drugog stuba na A-rampi.',
      'Naciljaj vrh antene i pomjeri malo ulijevo.',
      'Baci lijevim klikom (LEFT-CLICK).'
    ],
    coordinates: { x: '150.1', y: '75.4' }
  },
  {
    id: 'mirage-t-smoke-ct',
    mapId: 'mirage',
    side: 'T',
    type: 'SMOKE',
    title: 'CT SPAWN SA A-RAMPE',
    origin: 'A-RAMPA',
    target: 'CT SPAWN',
    thumbnail: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop',
    videoUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHRxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5pXp7KVO/giphy.gif',
    difficulty: 'EASY',
    tickRate: 'BOTH',
    steps: [
      'Stani u ćošak kod kutija na A-rampi.',
      'Naciljaj vrh drvene grede.',
      'Skoči i baci (JUMP-THROW).'
    ],
    coordinates: { x: '120.0', y: '45.0' }
  },
  {
    id: 'inferno-t-smoke-long',
    mapId: 'inferno',
    side: 'T',
    type: 'SMOKE',
    title: 'LONG SA BANANE',
    origin: 'BANANA',
    target: 'LONG A',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
    videoUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHRxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5pXp7KVO/giphy.gif',
    difficulty: 'MEDIUM',
    tickRate: '128',
    steps: [
      'Stani u ćošak kod drva na Banani.',
      'Naciljaj vrh krova zgrade.',
      'Skoči i baci (JUMP-THROW).'
    ],
    coordinates: { x: '88.5', y: '12.4' }
  },
  {
    id: 'dust2-ct-smoke-mid',
    mapId: 'dust2',
    side: 'CT',
    type: 'SMOKE',
    title: 'MID XBOX SA CT-A',
    origin: 'CT SPAWN',
    target: 'XBOX',
    thumbnail: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2084&auto=format&fit=crop',
    videoUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHRxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsMXZxeXVsJmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5pXp7KVO/giphy.gif',
    difficulty: 'EASY',
    tickRate: '64',
    steps: [
      'Stani pored kutije na CT spawn-u.',
      'Naciljaj donji desni ugao prozora.',
      'Baci lijevim klikom (LEFT-CLICK).'
    ],
    coordinates: { x: '100.2', y: '110.5' }
  }
];
