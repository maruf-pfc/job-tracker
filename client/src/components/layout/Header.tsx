import { useNavigate } from "react-router-dom";
import { LogOut, Menu, UserRound } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface HeaderProps { onMenuToggle?: () => void; }
export default function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const initials = (user?.name || "JT").trim().split(/\s+/).slice(0,2).map(v => v[0]?.toUpperCase()).join("");
  return <header className="sticky top-0 z-30 flex h-[70px] shrink-0 items-center justify-between border-b border-[#e3e9e0] bg-[#fcfdfa]/95 px-4 backdrop-blur-xl sm:px-7">
    <div className="flex min-w-0 items-center gap-3">
      {onMenuToggle && <button type="button" aria-label="Open navigation" onClick={onMenuToggle} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#dfe7dc] text-[#385441] transition-colors hover:bg-[#eef4eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2e6442] lg:hidden"><Menu size={19}/></button>}
      <div className="min-w-0"><div className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#8b9a8e]">Career workspace</div><div className="truncate text-[13px] font-medium text-[#344a3b]">Track the work. See the progress.</div></div>
    </div>
    <div className="flex items-center gap-3 sm:gap-4"><div className="hidden min-w-0 text-right sm:block"><p className="max-w-44 truncate text-[13px] font-semibold text-[#24362a]">{user?.name || "Your account"}</p><p className="max-w-44 truncate text-[11px] text-[#829186]">{user?.email || "Account"}</p></div>
      <div aria-label="Account avatar" className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#cddfcd] bg-[#dcebd9] text-[12px] font-semibold text-[#28543b]">
        <img src="/avatar.png" alt={user?.name || "Account avatar"} className="relative z-10 h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <span className="absolute">{initials || <UserRound size={16}/>}</span>
      </div>
      <button type="button" onClick={() => {logout(); navigate("/login");}} title="Sign out" aria-label="Sign out" className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e0e7dd] text-[#6a786c] transition-colors hover:border-[#cbdccb] hover:bg-[#edf4ea] hover:text-[#274e36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2e6442]"><LogOut size={17}/></button>
    </div>
  </header>;
}
