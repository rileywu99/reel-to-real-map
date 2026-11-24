import { Link, useLocation } from "@tanstack/react-router";
import { Compass, FolderHeart, Radar, UserRound, ArrowUpRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "./ui/button";
import { useWorkspace } from "@/lib/workspace";
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { settings, profile, signedOut } = useWorkspace();
  const location = useLocation().pathname;
  // On GitHub Pages every deep link is served the prerendered "/" shell, and React keeps the
  // shell's classes during hydration. Render as "/" until mounted there, then use the real path.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const path = hydrated || import.meta.env.BASE_URL === "/" ? location : "/";
   return <div className={`workspace ${path === "/" ? "workspace-map" : ""} ${settings.contrast ? "high-contrast" : ""}`}>
    <nav className="studio-nav">
      <Link to="/" className="brand"><span className="brand-icon"><Radar /></span><span>CLIP2MAP <span className="text-primary">//</span><small>SPATIAL INTELLIGENCE</small></span></Link>
      <div className="nav-links">
        <Button asChild variant="ghost" className={path === "/" ? "nav-active" : ""}><Link to="/"><Compass />探索地圖</Link></Button>
        <Button asChild variant="ghost" className={path === "/collections" ? "nav-active" : ""}><Link to="/collections"><FolderHeart />分類庫</Link></Button>
        <Button asChild variant="ghost" className={path === "/my" ? "nav-active" : ""}><Link to="/my"><UserRound />我的</Link></Button>
      </div>
      <Button asChild variant="ghost" className="nav-profile"><Link to="/my"><span className="avatar-mini">{signedOut ? <UserRound /> : profile.name.slice(0, 1)}</span><span>{signedOut ? "訪客空間" : profile.name}</span><ArrowUpRight /></Link></Button>
    </nav>
    {children}
     <nav className="mobile-bottom-nav" aria-label="手機導覽">
       <Button asChild variant="ghost" className={path === "/" ? "nav-active" : ""}><Link to="/" aria-current={path === "/" ? "page" : undefined}><Compass /><span>探索地圖</span></Link></Button>
       <Button asChild variant="ghost" className={path === "/collections" ? "nav-active" : ""}><Link to="/collections" aria-current={path === "/collections" ? "page" : undefined}><FolderHeart /><span>分類庫</span></Link></Button>
       <Button asChild variant="ghost" className={path === "/my" ? "nav-active" : ""}><Link to="/my" aria-current={path === "/my" ? "page" : undefined}><UserRound /><span>我的</span></Link></Button>
     </nav>
  </div>;
}
