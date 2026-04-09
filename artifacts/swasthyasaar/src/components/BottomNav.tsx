import { Home, Users, Mic, Bell, MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", href: "/asha-dashboard" },
    { icon: Users, label: "Patients", href: "/patients" },
    { icon: Mic, label: "Voice", href: "/voice-assessment", isCenter: true },
    { icon: Bell, label: "Alerts", href: "/supervisor-dashboard" }, // Pointing to supervisor for demo
    { icon: MoreHorizontal, label: "More", href: "/analytics" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-2 z-40 pb-safe">
      <div className="flex justify-between items-center relative">
        {navItems.map((item) => {
          const isActive = location === item.href || (location.startsWith('/patient') && item.href === '/patients');
          const Icon = item.icon;
          
          if (item.isCenter) {
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="relative -top-5 flex flex-col items-center justify-center"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95",
                  isActive ? "bg-primary shadow-primary/30" : "bg-primary/90"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={cn(
                  "text-[10px] mt-1 font-medium transition-colors",
                  isActive ? "text-primary font-bold" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          }
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 p-2 active-scale"
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-[10px] transition-colors",
                isActive ? "text-primary font-bold" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
