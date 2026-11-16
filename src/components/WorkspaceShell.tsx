import { Link, useLocation } from "@tanstack/react-router";
import { Compass, FolderHeart, Radar, UserRound, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { useWorkspace } from "@/lib/workspace";
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { settings, profile, signedOut } = useWorkspace();
  const path = useLocation().pathname;
  return <div className={`workspace ${settings.contrast ? "high-contrast" : ""}`}>
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
  </div>;
}
