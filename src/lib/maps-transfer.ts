import Papa from "papaparse";
import type { Place } from "./places";
import type { SavedPlace } from "./workspace";

export function googleMapsUrl(p: Pick<Place, "name" | "lat" | "lng">) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.lat},${p.lng}`)}`;
}
export function externalMapsUrl(p: Place, provider: "google" | "apple") {
  return provider === "google" ? googleMapsUrl(p) : `https://maps.apple.com/?ll=${p.lat},${p.lng}&q=${encodeURIComponent(p.name)}`;
}
export function isGoogleMapsListUrl(text: string) {
  try { const u = new URL(text); return u.protocol === "https:" && (u.hostname === "maps.app.goo.gl" || u.hostname === "goo.gl" && u.pathname.startsWith("/maps") || /(^|\.)google\.[a-z.]+$/.test(u.hostname) && (u.pathname.startsWith("/maps") || u.hostname.startsWith("maps."))); } catch { return false; }
}
const text = (v: unknown): string => typeof v === "string" || typeof v === "number" ? String(v) : "";
const object = (v: unknown): Record<string, unknown> => v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
function normalize(raw: unknown, index: number): SavedPlace | null {
  const row = object(raw), props = object(row.properties), geometry = object(row.geometry);
  const loc = object(props.location ?? row.location), coords = geometry.coordinates;
  const lookup = (keys: string[]) => { for (const k of keys) { const value = row[k] ?? props[k] ?? loc[k]; if (value !== undefined && value !== null && value !== "") return value; } return undefined; };
  let latValue = lookup(["Latitude", "latitude", "lat", "緯度"]), lngValue = lookup(["Longitude", "longitude", "lng", "lon", "經度"]);
  if (Array.isArray(coords)) { lngValue = coords[0]; latValue = coords[1]; }
  const url = text(lookup(["Google Maps URL", "URL", "url", "google_maps_url"]));
  if (latValue === undefined || lngValue === undefined) {
    const match = url.match(/(?:@|!3d|[?&]q=)(-?\d+\.\d+)(?:,|!4d)(-?\d+\.\d+)/);
    if (match) { latValue = match[1]; lngValue = match[2]; }
  }
  if (latValue === undefined || lngValue === undefined || text(latValue).trim() === "" || text(lngValue).trim() === "") return null;
  const lat = Number(latValue), lng = Number(lngValue);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  const name = text(lookup(["Title", "title", "Name", "name", "Business Name", "名稱"])) || "未命名地點";
  return { id: `import-${index}`, name, lat, lng, category: "view", address: text(lookup(["Address", "address", "地址"])), source: "Google Takeout", confidence: 100, note: text(lookup(["Note", "note", "Comment", "comment", "備註"])), city: text(lookup(["City", "city", "城市"])), collectionId: "default", visited: false };
}
export function parseMapsFile(content: string, filename: string) {
  let rows: unknown[];
  if (/\.json$/i.test(filename)) {
    const parsed: unknown = JSON.parse(content.replace(/^\uFEFF/, ""));
    const root = object(parsed);
    rows = Array.isArray(parsed) ? parsed : Array.isArray(root.features) ? root.features : Array.isArray(root.places) ? root.places : Array.isArray(root.saved_places) ? root.saved_places : [];
  } else if (/\.csv$/i.test(filename)) {
    const result = Papa.parse<Record<string, string>>(content.replace(/^\uFEFF/, ""), { header: true, skipEmptyLines: "greedy", transformHeader: h => h.trim() });
    if (result.errors.some(e => e.code === "MissingQuotes")) throw new Error("CSV 引號格式不完整");
    rows = result.data;
  } else throw new Error("請上傳 CSV 或 JSON 檔案");
  const places = rows.map(normalize).filter((p): p is SavedPlace => p !== null);
  return { places, skipped: rows.length - places.length };
}
const safeCell = (value: string) => /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
export function exportMapsCsv(places: SavedPlace[]) {
  return '\uFEFF' + Papa.unparse(places.map(p => ({ Name: safeCell(p.name), Latitude: p.lat, Longitude: p.lng, Address: safeCell(p.address), Note: safeCell(p.note), City: safeCell(p.city), "Google Maps URL": googleMapsUrl(p) })), { columns: ["Name", "Latitude", "Longitude", "Address", "Note", "City", "Google Maps URL"] });
}
export const GOOGLE_DEMO_PLACES: Place[] = [
  { id: "google1", name: "Getty Center", category: "art", lat: 34.078, lng: -118.4741, address: "1200 Getty Center Dr, Los Angeles", source: "Google 分享示範", confidence: 100, note: "" },
  { id: "google2", name: "Santa Monica Pier", category: "view", lat: 34.0092, lng: -118.4976, address: "200 Santa Monica Pier, Santa Monica", source: "Google 分享示範", confidence: 100, note: "" },
  { id: "google3", name: "Blue Bottle Coffee · Arts District", category: "cafe", lat: 34.0394, lng: -118.2329, address: "582 Mateo St, Los Angeles", source: "Google 分享示範", confidence: 100, note: "" },
];
