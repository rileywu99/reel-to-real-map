import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Check, Loader2, MapPin, Radar, Upload, Sparkles, X, Link2 } from "lucide-react";
import { CATEGORY_LABEL, POOL, SAMPLES, SEED, type Category, type Place, type Sample } from "@/lib/places";

const MapView = lazy(() => import("@/components/MapView"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CLIP2MAP // 社群靈感瞬移地圖" },
      { name: "description", content: "貼上 IG Reels、TikTok 或截圖，AI 空間推理自動定位真實地點並同步到你的地圖。" },
      { property: "og:title", content: "CLIP2MAP // 社群靈感瞬移地圖" },
      { property: "og:description", content: "AI 空間推理，把短影音靈感瞬移到你的個人地圖。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEP_TITLES = ["視覺微線索 OCR", "語音與文案錨點", "空間拓撲交叉比對", "座標鎖定與同步"];

function Index() {
  const [places, setPlaces] = useState<Place[]>(SEED);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [input, setInput] = useState("");
  const [sample, setSample] = useState<Sample | null>(null);
  const [run, setRun] = useState<{ sample: Sample; done: number } | null>(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const analyze = (s?: Sample) => {
    const chosen: Sample = s ?? sample ?? {
      label: "自訂", input,
      result: POOL[Math.floor(Math.random() * POOL.length)]!,
      steps: ["掃描 24 個關鍵影格，偵測招牌局部字樣與建築立面特徵", "分析口白與 Hashtags，提取街區與交通線索", "比對半徑 500m 內候選地點並排除不符特徵", "鎖定最佳候選座標並計算信心度"],
    };
    if (!chosen.input) return;
    setRun({ sample: chosen, done: 0 });
    [1, 2, 3, 4].forEach((n) => setTimeout(() => setRun((r) => (r ? { ...r, done: n } : r)), n * 750));
    setTimeout(() => {
      const id = `p${Date.now()}`;
      setPlaces((p) => [{ ...chosen.result, id }, ...p]);
      setFilter("all");
      setActiveId(id);
      setRun(null); setInput(""); setSample(null);
    }, 3700);
  };

  const pickSample = (s: Sample) => { setSample(s); setInput(s.input); analyze(s); };
  const onFile = (f?: File) => { if (f) { setSample(null); setInput(f.name); } };
  const select = useCallback((id: string) => setActiveId(id), []);
  const shown = places.filter((p) => filter === "all" || p.category === filter);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <aside className="grid-bg flex h-full w-[35%] min-w-[360px] flex-col gap-5 overflow-y-auto border-r border-border p-6">
        <header className="flex items-center gap-3">
          <div className="glow-primary flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Radar className="h-5 w-5" /></div>
          <div>
            <h1 className="font-mono text-lg font-semibold tracking-tight">CLIP2MAP <span className="text-primary">//</span></h1>
            <p className="text-xs text-muted-foreground">社群靈感瞬移地圖 · Spatial Intelligence</p>
          </div>
        </header>

        <section className="glass rounded-xl p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Quick Capture</p>
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
            className={`flex items-center gap-2 rounded-lg border bg-background/60 px-3 py-2 transition ${drag ? "border-primary glow-primary" : "border-input"}`}
          >
            <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input value={input} onChange={(e) => { setInput(e.target.value); setSample(null); }} placeholder="貼上 IG Reels / TikTok 連結，或拖曳截圖" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            <button onClick={() => fileRef.current?.click()} className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="上傳截圖"><Upload className="h-4 w-4" /></button>
            <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          </div>
          <button disabled={!input || !!run} onClick={() => analyze()} className="glow-primary mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-40 disabled:shadow-none">
            <Sparkles className="h-4 w-4" /> 解析並瞬移至地圖
          </button>
          <div className="mt-3 flex flex-col gap-2">
            {SAMPLES.map((s) => (
              <button key={s.label} disabled={!!run} onClick={() => pickSample(s)} className="rounded-md border border-dashed border-input px-3 py-2 text-left font-mono text-xs text-muted-foreground transition hover:border-accent hover:text-accent disabled:opacity-40">
                [{s.label}]
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Saved Places · {places.length}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "food", "cafe", "art", "view"] as const).map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`rounded-full border px-3 py-1 text-xs transition ${filter === c ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {c === "all" ? "全部" : CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
          {shown.map((p) => (
            <button key={p.id} onClick={() => setActiveId(p.id)} className={`glass animate-in fade-in slide-in-from-top-2 rounded-xl p-4 text-left transition hover:border-primary/50 ${activeId === p.id ? "border-primary/70 glow-primary" : ""}`}>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-semibold">{p.name}</h3>
                    <span className="font-mono text-[10px] text-primary">{p.confidence}%</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{p.address}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-secondary-foreground/80">{p.note}</p>
                  <div className="mt-2 flex gap-2 font-mono text-[10px] text-muted-foreground"><span className="rounded bg-secondary px-1.5 py-0.5">{CATEGORY_LABEL[p.category]}</span><span className="rounded bg-secondary px-1.5 py-0.5">{p.source}</span></div>
                </div>
              </div>
            </button>
          ))}
        </section>
      </aside>

      <main className="relative h-full flex-1">
        <ClientOnly fallback={<div className="h-full w-full bg-background" />}>
          <Suspense fallback={<div className="h-full w-full bg-background" />}>
            <MapView places={shown} activeId={activeId} onSelect={select} />
          </Suspense>
        </ClientOnly>
        <div className="glass pointer-events-none absolute left-5 top-5 z-[500] rounded-lg px-4 py-2 font-mono text-[11px] text-muted-foreground">
          <span className="text-primary">●</span> LIVE · {shown.length} PINS · LOS ANGELES
        </div>

        {run && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="glass relative w-[460px] overflow-hidden rounded-2xl p-6">
              <div className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
              <div className="mb-1 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">AI Detective Pipeline</p>
                <button onClick={() => setRun(null)} className="text-muted-foreground hover:text-foreground" aria-label="關閉"><X className="h-4 w-4" /></button>
              </div>
              <p className="mb-5 truncate font-mono text-xs text-muted-foreground">› {run.sample.input}</p>
              <ol className="space-y-4">
                {STEP_TITLES.map((t, i) => {
                  const state = run.done > i ? "done" : run.done === i ? "active" : "idle";
                  return (
                    <li key={t} className={`flex gap-3 transition-opacity ${state === "idle" ? "opacity-30" : "opacity-100"}`}>
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${state === "done" ? "border-primary bg-primary text-primary-foreground" : "border-primary/50 text-primary"}`}>
                        {state === "done" ? <Check className="h-3.5 w-3.5 animate-in zoom-in" /> : state === "active" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span className="font-mono text-[10px]">{i + 1}</span>}
                      </div>
                      <div>
                        <p className="text-sm font-medium">Step {i + 1} [{t}]</p>
                        {state !== "idle" && <p className="mt-0.5 font-mono text-xs text-muted-foreground animate-in fade-in">{run.sample.steps[i]}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
              {run.done >= 4 && <p className="mt-5 text-center font-mono text-xs text-accent animate-in fade-in">✦ 已鎖定「{run.sample.result.name}」· 瞬移中…</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
