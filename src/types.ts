export type MapId = 'mirage' | 'inferno' | 'dust2' | 'ancient' | 'anubis' | 'nuke' | 'vertigo';

export type Side = 'CT' | 'T';

export type UtilityType = 'SMOKE' | 'FLASH' | 'MOLOTOV' | 'HE';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface MapData {
  id: MapId;
  name: string;
  image: string;
  status: 'UPDATED' | 'OUTDATED';
}

export interface Lineup {
  id: string;
  mapId: MapId;
  side: Side;
  type: UtilityType;
  title: string;
  origin: string;
  target: string;
  thumbnail: string;
  videoUrl: string;
  difficulty: Difficulty;
  tickRate: '64' | '128' | 'BOTH';
  steps: string[];
  /** Link to CSNADES.gg map / guide for full video & angles (attribution). */
  sourceUrl?: string;
  coordinates?: {
    x: string;
    y: string;
  };
}
