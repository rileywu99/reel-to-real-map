import { useState } from "react";
import { FolderHeart, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useWorkspace, DEFAULT_COLLECTION } from "@/lib/workspace";
export function CollectionsManager() {
  const w = useWorkspace();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  return <div>
    <div className="collection-grid">{w.collections.map(c => <div className={`collection-card ${w.selectedCollection === c.id ? "selected" : ""}`} key={c.id}>
      <Button variant="ghost" className="collection-select" onClick={() => w.setSelectedCollection(c.id)} aria-pressed={w.selectedCollection === c.id}><FolderHeart /><strong>{c.name}</strong><small>{w.places.filter(p => p.collectionId === c.id).length} 個地點</small></Button>
      {c.id !== DEFAULT_COLLECTION && <Button variant="ghost" size="icon" aria-label={`刪除清單 ${c.name}`} title="刪除清單（地點移至預設珍藏）" onClick={() => { if (window.confirm(`刪除「${c.name}」？地點將移至預設珍藏。`)) w.removeCollection(c.id); }}><Trash2 /></Button>}
    </div>)}</div>
    <form className="collection-create" onSubmit={e => { e.preventDefault(); if (w.createCollection(name)) { setName(""); setError(""); } else setError("請輸入不同的清單名稱"); }}><input aria-label="新清單名稱" placeholder="為下一次探索建立清單…" value={name} onChange={e => setName(e.target.value)} /><Button type="submit" variant="outline"><Plus />建立清單</Button></form>
    {error && <p className="text-destructive text-sm mt-2" role="alert">{error}</p>}
  </div>;
}
