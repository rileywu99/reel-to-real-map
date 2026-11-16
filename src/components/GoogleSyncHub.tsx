import { useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, Link2, Loader2, Upload, Unplug } from "lucide-react";
import { Button } from "./ui/button";
import { useWorkspace } from "@/lib/workspace";
import { exportMapsCsv, GOOGLE_DEMO_PLACES, isGoogleMapsListUrl, parseMapsFile } from "@/lib/maps-transfer";
export function ExportCollection() {
  const w = useWorkspace();
  const chosen = w.places.filter(p => p.collectionId === w.selectedCollection);
  const download = () => {
    const url = URL.createObjectURL(new Blob([exportMapsCsv(chosen)], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `${w.collections.find(c => c.id === w.selectedCollection)?.name ?? "CLIP2MAP"}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="export-row"><select aria-label="匯出清單" value={w.selectedCollection} onChange={e => w.setSelectedCollection(e.target.value)}>{w.collections.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select><Button disabled={!chosen.length} variant="outline" onClick={download}><ArrowDownToLine />匯出 My Maps CSV</Button><span className="text-xs text-muted-foreground">{chosen.length} 個地點</span></div>;
}
export function GoogleSyncHub() {
  const w = useWorkspace();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const importLink = async () => {
    if (!isGoogleMapsListUrl(url.trim())) { setMessage("請貼上有效的 Google Maps 分享網址"); return; }
    setBusy(true); await new Promise(r => setTimeout(r, 1000));
    w.addPlaces(GOOGLE_DEMO_PLACES.map(p => ({ ...p, city: "Los Angeles" })), w.selectedCollection);
    setMessage("示範匯入完成：3 個示範地點已加入清單與地圖；未讀取分享清單內容。"); setUrl(""); setBusy(false);
  };
  const importFile = async (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setMessage("請使用小於 10 MB 的檔案"); return; }
    setBusy(true);
    try { const result = parseMapsFile(await file.text(), file.name); if (!result.places.length) { setMessage("未找到可定位的地點。檔案需包含名稱及緯度／經度，或 GeoJSON 座標；沒有座標的項目不會猜測位置。"); } else { w.addPlaces(result.places); setMessage(`已匯入 ${result.places.length} 個地點${result.skipped ? `；略過 ${result.skipped} 個缺少有效座標的項目` : ""}。`); } } catch (e) { setMessage(e instanceof SyntaxError ? "JSON 格式不正確，請檢查檔案" : e instanceof Error ? e.message : "無法讀取檔案"); } finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  };
  return <section className="settings-section">
    <div className="section-heading"><div><p className="eyebrow">DATA & MAP CONNECTIONS</p><h2>Google Maps 雙向橋接</h2></div><span className="status-label">{w.googleLinked ? "● 示範已連結" : "○ 尚未連結"}</span></div>
    <div className="google-account"><span className="google-mark">G</span><div className="flex-1"><strong>Google 帳號</strong><p className="text-muted-foreground text-xs mt-1">模擬綁定 · 不會授權或自動同步 Google 帳號</p></div><Button variant="outline" onClick={() => w.setGoogleLinked(!w.googleLinked)}>{w.googleLinked ? <Unplug /> : <Link2 />}{w.googleLinked ? "解除綁定" : "一鍵模擬綁定"}</Button></div>
    <div className="transfer-grid"><div><div className="transfer-title"><span>01</span><h3>從 Google Maps 匯入</h3></div><label className="field-label" htmlFor="maps-link">分享清單網址 · 示範模式</label><div className="import-link"><input id="maps-link" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://maps.app.goo.gl/…" /><Button disabled={busy || !url.trim()} onClick={importLink}>{busy ? <Loader2 className="animate-spin" /> : <ArrowDownToLine />}匯入</Button></div>
      <div className={`file-drop ${drag ? "dragging" : ""}`} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); if (!busy) void importFile(e.dataTransfer.files[0]); }}><Upload /><strong>Google Takeout</strong><span>CSV / JSON · 最大 10 MB</span><Button variant="ghost" disabled={busy} onClick={() => fileRef.current?.click()}>選擇檔案<ArrowUpRight /></Button><input hidden type="file" accept=".csv,.json" ref={fileRef} onChange={e => void importFile(e.target.files?.[0])} /></div>
    </div><div><div className="transfer-title"><span>02</span><h3>將珍藏帶到 Google My Maps</h3></div><ExportCollection /><div className="export-footnote">CSV 包含地點名稱、座標、地址與備註。匯入 My Maps 時選擇 Latitude / Longitude。</div><div className="bridge-path"><span>CLIP2MAP</span><ArrowUpRight /><span>Google My Maps</span></div></div></div>
    {message && <p className="transfer-message" role="status"><Check />{message}</p>}
  </section>;
}
