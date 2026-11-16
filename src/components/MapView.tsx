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
    const markerLayer = layer.current;
    markerLayer.clearLayers();
    places.forEach((p) => {
      const icon = L.divIcon({ className: "", html: `<div class="pin ${p.id === activeId ? "active" : ""}"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] });
      const m = L.marker([p.lat, p.lng], { icon }).addTo(markerLayer);
      const popup = document.createElement("div");
      popup.className = "map-popup";
      const meta = document.createElement("small");
      meta.textContent = `${CATEGORY_LABEL[p.category]} · ${p.source} · ${p.confidence}%`;
      const title = document.createElement("strong");
      title.textContent = p.name;
      const address = document.createElement("p");
      address.textContent = p.address;
      const note = document.createElement("p");
      note.textContent = p.note;
      popup.append(meta, title, address, note);
      m.bindPopup(popup);
      m.on("click", () => onSelect(p.id));
      if (p.id === activeId) m.openPopup();
    });
    if (!activeId && places.length) map.current.fitBounds(L.latLngBounds(places.map(p => [p.lat, p.lng])), { padding: [50, 50], maxZoom: 13 });
  }, [places, activeId, onSelect]);

  useEffect(() => {
    const p = places.find((x) => x.id === activeId);
    if (p && map.current) map.current.flyTo([p.lat, p.lng], 15, { duration: 1.4 });
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={el} className="h-full w-full" />;
}
