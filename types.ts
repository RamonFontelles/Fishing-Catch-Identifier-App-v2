export interface FishInfo {
  species: string;
  description: string;
  habitat: string;
  isEdible: boolean;
  estimatedSize: string;
  estimatedWeight: string;
  error?: string;
}

export interface CatchLog extends FishInfo {
  id: string;
  imageUrl: string;
  location: string;
  date: string;
  size: string; // User-provided actual size
  weight?: string; // User-provided actual weight
  notes?: string;
}