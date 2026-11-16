import { createFileRoute } from "@tanstack/react-router";
import { FolderHeart } from "lucide-react";
import { CollectionsManager } from "@/components/CollectionsManager";
import { ExportCollection } from "@/components/GoogleSyncHub";
import { PlaceCard } from "@/components/PlaceCard";
import { useWorkspace } from "@/lib/workspace";
export const Route = createFileRoute("/collections")({
  head: () => ({ meta: [{ title: "儲存分類庫 // CLIP2MAP" }, { name: "description", content: "依主題整理珍藏地點、標記踩點與匯出旅行清單。" }, { property: "og:title", content: "儲存分類庫 // CLIP2MAP" }, { property: "og:description", content: "每一份珍藏，都是下一次探索的起點。" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Collections,
});
function Collections() {
  const w = useWorkspace();
  const shown = w.places.filter(p => p.collectionId === w.selectedCollection);
  return <main className="space-page"><div className="page-heading"><p className="eyebrow">SAVED FOR YOUR NEXT ADVENTURE</p><h1>儲存分類庫<span className="text-primary"> // </span></h1><p>Collections Library</p></div><CollectionsManager /><section className="settings-section"><div className="section-heading"><h2>{w.collections.find(c => c.id === w.selectedCollection)?.name}</h2><span className="text-muted-foreground">{shown.length} 個地點</span></div><ExportCollection /><div className="library-grid">{shown.map(p => <PlaceCard place={p} key={p.id} />)}</div>{!shown.length && <div className="empty-library"><FolderHeart /><h3>下一站，等你收藏</h3></div>}</section></main>;
}
