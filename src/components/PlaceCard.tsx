import { Check, ExternalLink, MapPin, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CATEGORY_LABEL, type Category } from "@/lib/places";
import { useWorkspace, type SavedPlace } from "@/lib/workspace";
import { externalMapsUrl, googleMapsUrl } from "@/lib/maps-transfer";
export function PlaceCard({ place: p, active, onSelect }: { place: SavedPlace; active?: boolean; onSelect?: (id: string) => void }) {
  const w = useWorkspace();
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(p);
  return <article className={`place-card ${active ? "selected" : ""}`}>
    <Button variant="ghost" className="place-heading" onClick={() => onSelect?.(p.id)}><MapPin className="text-accent" /><span><strong>{p.name}</strong><small>{p.address || `${p.lat}, ${p.lng}`}</small></span><span className="text-primary font-mono text-xs">{p.confidence}%</span></Button>
    {p.note && <p className="place-note">{p.note}</p>}
    <div className="place-tags"><span>{CATEGORY_LABEL[p.category]}</span><span>{p.source}</span>{p.visited && <span className="text-primary">已踩點</span>}</div>
    <div className="place-actions">
      <Button variant="ghost" size="sm" onClick={() => w.updatePlace(p.id, { visited: !p.visited })} aria-pressed={p.visited}><Check />{p.visited ? "已完成" : "標記踩點"}</Button>
      <Button variant="ghost" size="icon" title="編輯地點" aria-label={`編輯 ${p.name}`} onClick={() => { setDraft(p); setEdit(true); }}><Pencil /></Button>
      <Button asChild variant="ghost" size="icon"><a href={externalMapsUrl(p, w.settings.navigation)} target="_blank" rel="noopener noreferrer" title="開啟導航" aria-label="開啟導航"><ExternalLink /></a></Button>
      <Button asChild variant="ghost" size="sm" className="google-save"><a href={googleMapsUrl(p)} target="_blank" rel="noopener noreferrer">儲存至 Google Maps<ExternalLink /></a></Button>
    </div>
    <Dialog open={edit} onOpenChange={setEdit}><DialogContent><DialogHeader><DialogTitle>編輯珍藏地點</DialogTitle></DialogHeader>
      <form onSubmit={e => { e.preventDefault(); w.updatePlace(p.id, draft); setEdit(false); }} className="form-stack">
        <label>地點名稱<input required value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label>
        <label>城市<input value={draft.city} onChange={e => setDraft({ ...draft, city: e.target.value })} /></label>
        <label>分類<select value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value as Category })}>{Object.entries(CATEGORY_LABEL).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        <label>儲存至清單<select value={draft.collectionId} onChange={e => setDraft({ ...draft, collectionId: e.target.value })}>{w.collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label>備註<textarea value={draft.note} onChange={e => setDraft({ ...draft, note: e.target.value })} /></label>
        <div className="flex justify-between"><Button type="button" variant="destructive" onClick={() => { w.setPlaces(old => old.filter(x => x.id !== p.id)); setEdit(false); }}><Trash2 />刪除地點</Button><Button type="submit"><Check />儲存變更</Button></div>
      </form>
    </DialogContent></Dialog>
  </article>;
}
