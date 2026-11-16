import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CATEGORY_LABEL, type Place } from "@/lib/places";

export default function MapView({ places, activeId, onSelect }: { places: Place[]; activeId: string | null; onSelect: (id: string) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!el.current || map.current) return;
    map.current = L.map(el.current, { zoomControl: false }).setView([34.06, -118.32], 11);
    L.control.zoom({ position: "bottomright" }).addTo(map.current);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors", className: "dark-tiles", maxZoom: 19 }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
    return () => { map.current?.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    if (!layer.current || !map.current) return;
    layer.current.clearLayers();
    places.forEach((p) => {
      const icon = L.divIcon({ className: "", html: `<div class="pin ${p.id === activeId ? "active" : ""}"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] });
      const m = L.marker([p.lat, p.lng], { icon }).addTo(layer.current!);
      m.bindPopup(`<div style="min-width:200px"><div style="font-size:10px;letter-spacing:.15em;color:var(--primary);font-family:var(--font-mono)">${CATEGORY_LABEL[p.category]} · ${p.source} · ${p.confidence}%</div><div style="font-weight:600;font-size:15px;margin:4px 0">${p.name}</div><div style="font-size:12px;color:var(--muted-foreground)">${p.address}</div><div style="font-size:12px;margin-top:6px">${p.note}</div></div>`);
      m.on("click", () => onSelect(p.id));
      if (p.id === activeId) m.openPopup();
    });
  }, [places, activeId, onSelect]);

  useEffect(() => {
    const p = places.find((x) => x.id === activeId);
    if (p && map.current) map.current.flyTo([p.lat, p.lng], 15, { duration: 1.4 });
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={el} className="h-full w-full" />;
}
