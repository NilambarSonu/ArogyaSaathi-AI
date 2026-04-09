import { useState, useEffect } from "react";
import { Leaf, Bell } from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageToggle } from "@/components/LanguageToggle";

interface NavbarProps {
  role?: string;
  userName?: string;
  location?: string;
}

export function Navbar({ role = "ASHA Worker", userName = "Sunita Devi", location = "Kalahandi, Odisha" }: NavbarProps) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 active-scale group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg leading-tight text-foreground">SwasthyaSaar</span>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{role}</span>
              <span className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500" : "bg-amber-500 animate-pulse"}`}
                />
                <span className={`text-[10px] font-medium ${isOnline ? "text-green-600" : "text-amber-600"}`}>
                  {isOnline ? "Synced" : "Offline"}
                </span>
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageToggle />
          </div>

          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-sm font-semibold">{userName}</span>
            <span className="text-xs text-muted-foreground">{location}</span>
          </div>

          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted" data-testid="button-notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background animate-pulse" />
          </button>

          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {userName.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
