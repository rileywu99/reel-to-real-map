import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Compass, Globe2, LogOut, Pencil, UserRound } from "lucide-react";
import { $getSessionUser } from "@/lib/session";
import { useWorkspace, statistics } from "@/lib/workspace";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CollectionsManager } from "@/components/CollectionsManager";
import { GoogleSyncHub } from "@/components/GoogleSyncHub";
export const Route = createFileRoute("/my")({
  // Static hosts (GitHub Pages) have no server function endpoint; fall back to the guest profile.
  loader: () => $getSessionUser().catch(() => null),
  head: () => ({ meta: [{ title: "我的空間與設定 // CLIP2MAP" }, { name: "description", content: "管理個人探索數據、珍藏清單與地圖連動偏好。" }, { property: "og:title", content: "我的空間與設定 // CLIP2MAP" }, { property: "og:description", content: "你的探索足跡、珍藏與地圖設定。" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: MySpace,
});
function MySpace() {
  const user = Route.useLoaderData();
  const w = useWorkspace();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(w.profile);
  const stats = statistics(w.places);
  return <main className="space-page"><div className="page-heading"><p className="eyebrow">YOUR PERSONAL ATLAS</p><h1>我的空間與設定<span className="text-primary"> // </span></h1><p>My Space & Settings</p></div>
    <section className="profile-section"><div className="profile-avatar"><UserRound /></div><div className="profile-copy"><span className="status-label">{w.signedOut ? "虛擬空間已登出" : user ? "Lovable 身分已識別 · 虛擬個人資料" : "虛擬個人資料"}</span><h2>{w.signedOut ? "訪客" : w.profile.name}</h2><p>{w.profile.bio}</p>{user && !w.signedOut && <p className="text-xs text-muted-foreground">Lovable · {user.displayName}</p>}</div><Button variant="outline" onClick={() => { setDraft(w.profile); setEditing(true); }}><Pencil />編輯個人簡介</Button></section>
    <div className="stats-grid">{[{ icon: Compass, label: "已捕捉靈感數", value: stats.captured.toString().padStart(2, "0"), unit: "個地點" }, { icon: Check, label: "已踩點完成率", value: `${stats.completed}%`, unit: "探索進度" }, { icon: Globe2, label: "解鎖城市數", value: stats.cities.toString().padStart(2, "0"), unit: "座城市" }].map(s => <div className="stat-card" key={s.label}><s.icon /><span>{s.label}</span><strong>{s.value}</strong><small>{s.unit}</small></div>)}</div>
    <section className="settings-section"><div className="section-heading"><div><p className="eyebrow">CURATED BY YOU</p><h2>我的珍藏清單</h2></div><span className="text-muted-foreground text-sm">{w.collections.length} 個清單</span></div><CollectionsManager /></section>
    <GoogleSyncHub />
    <section className="settings-section"><div className="section-heading"><div><p className="eyebrow">APP PREFERENCES</p><h2>探索偏好</h2></div></div>
      <div className="setting-row"><div><strong>地圖導航偏好</strong><p>預設外部開啟工具</p></div><div className="segmented" role="radiogroup" aria-label="地圖導航偏好">{(["google", "apple"] as const).map(p => <Button key={p} role="radio" aria-checked={w.settings.navigation === p} variant={w.settings.navigation === p ? "secondary" : "ghost"} onClick={() => w.setSettings({ ...w.settings, navigation: p })}>{p === "google" ? "Google Maps" : "Apple Maps"}</Button>)}</div></div>
      <div className="setting-row"><div><strong>靠近珍藏地點 500m 時發送提醒</strong><p>虛擬偏好 · 尚未啟用定位或通知服務</p></div><Switch aria-label="靠近珍藏地點 500m 時發送提醒" checked={w.settings.nearby} onCheckedChange={nearby => w.setSettings({ ...w.settings, nearby })} /></div>
      <div className="setting-row"><div><strong>每週五自動生成週末探索建議</strong><p>虛擬偏好 · 尚未啟用自動排程</p></div><Switch aria-label="每週五自動生成週末探索建議" checked={w.settings.weekend} onCheckedChange={weekend => w.setSettings({ ...w.settings, weekend })} /></div>
      <div className="setting-row"><div><strong>地圖顯示模式</strong><p>更清楚地看見下一站</p></div><div className="segmented" role="radiogroup" aria-label="地圖顯示模式">{[false, true].map(contrast => <Button key={String(contrast)} role="radio" aria-checked={w.settings.contrast === contrast} variant={w.settings.contrast === contrast ? "secondary" : "ghost"} onClick={() => w.setSettings({ ...w.settings, contrast })}>{contrast ? "高對比" : "深色"}</Button>)}</div></div>
      <div className="setting-row"><div><strong>帳號操作</strong><p>此操作僅切換虛擬空間，不會登出 Lovable。</p></div><Button variant="outline" onClick={() => w.setSignedOut(!w.signedOut)}><LogOut />{w.signedOut ? "返回我的空間" : "登出帳號（模擬）"}</Button></div>
    </section>
    <footer className="space-footer"><span>CLIP2MAP // YOUR NEXT COORDINATE</span><span>虛擬資料僅保留於本次使用，重新整理會重設。</span></footer>
    <Dialog open={editing} onOpenChange={setEditing}><DialogContent><DialogHeader><DialogTitle>編輯個人簡介</DialogTitle></DialogHeader><form className="form-stack" onSubmit={e => { e.preventDefault(); w.setProfile(draft); setEditing(false); }}><label>顯示名稱<input required maxLength={40} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label><label>個人簡介<textarea maxLength={200} value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} /></label><Button disabled={!draft.name.trim()} type="submit"><Check />儲存</Button></form></DialogContent></Dialog>
  </main>;
}
