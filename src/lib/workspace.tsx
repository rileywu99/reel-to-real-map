import { createContext, useContext, useState, type ReactNode } from "react";
import { SEED, type Place } from "./places";

export interface SavedPlace extends Place { collectionId: string; visited: boolean; city: string }
export interface Collection { id: string; name: string }
export const DEFAULT_COLLECTION = "default";
export const REMINDER_DISTANCE_METERS = 500;
export const WEEKEND_REMINDER_DAY = 5;
export const INITIAL_COLLECTIONS: Collection[] = [
  { id: DEFAULT_COLLECTION, name: "預設珍藏" },
  { id: "coffee", name: "週末咖啡地圖" },
  { id: "travel", name: "下次旅行清單" },
];
export function statistics(places: SavedPlace[]) {
  return { captured: places.length, completed: places.length ? Math.round(places.filter(p => p.visited).length / places.length * 100) : 0, cities: new Set(places.map(p => p.city.trim()).filter(Boolean)).size };
}
function useWorkspaceState() {
  const [places, setPlaces] = useState<SavedPlace[]>(() => SEED.map(p => ({ ...p, collectionId: DEFAULT_COLLECTION, visited: false, city: "Los Angeles" })));
  const [collections, setCollections] = useState(INITIAL_COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState(DEFAULT_COLLECTION);
  const [profile, setProfile] = useState({ name: "城市探索者", bio: "把每一次心動，收藏成下一站。" });
  const [settings, setSettings] = useState({ navigation: "google" as "google" | "apple", nearby: false, weekend: false, contrast: false });
  const [googleLinked, setGoogleLinked] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const addPlaces = (items: Place[], collectionId = selectedCollection) => {
    const added = items.map((p, i) => ({ ...p, id: `${p.id}-${Date.now()}-${i}`, collectionId, visited: false, city: (p as Partial<SavedPlace>).city ?? "" }));
    setPlaces(old => [...added, ...old]);
    return added;
  };
  const updatePlace = (id: string, patch: Partial<SavedPlace>) => setPlaces(old => old.map(p => p.id === id ? { ...p, ...patch } : p));
  const createCollection = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || collections.some(c => c.name === trimmed)) return false;
    const id = `c-${Date.now()}`;
    setCollections(old => [...old, { id, name: trimmed }]);
    setSelectedCollection(id);
    return true;
  };
  const removeCollection = (id: string) => {
    if (id === DEFAULT_COLLECTION) return;
    setPlaces(old => old.map(p => p.collectionId === id ? { ...p, collectionId: DEFAULT_COLLECTION } : p));
    setCollections(old => old.filter(c => c.id !== id));
    setSelectedCollection(DEFAULT_COLLECTION);
  };
  return { places, setPlaces, collections, selectedCollection, setSelectedCollection, profile, setProfile, settings, setSettings, googleLinked, setGoogleLinked, signedOut, setSignedOut, addPlaces, updatePlace, createCollection, removeCollection };
}
const WorkspaceContext = createContext<ReturnType<typeof useWorkspaceState> | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const value = useWorkspaceState();
  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("WorkspaceProvider is required");
  return value;
}
