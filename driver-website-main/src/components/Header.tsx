import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/translations";
import LanguageToggle from "./LanguageToggle";
import flagLogo from "@/assets/gallery/flag-logo.jpeg";
import { useAuth } from "@/contexts/AuthContext";
import { User, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [driverData, setDriverData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (user.id === '00000000-0000-0000-0000-000000000000') {
        setDriverData({
          name: 'Demo Driver',
          membership_id: 'AID-DEMO-001',
          membership_plan: 'gold'
        });
        return;
      }
      const fetchDriver = async () => {
        const { data } = await supabase.from('drivers').select('*').eq('user_id', user.id).single();
        if (data) setDriverData(data);
      };
      fetchDriver();

      // Subscribe to realtime updates for this driver's profile
      const channel = supabase
        .channel(`driver_profile_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'drivers',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Driver profile updated realtime:', payload);
            setDriverData(payload.new as any);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const navItems = [
    { name: t("header.home", language) || "Home", path: "/" },
    { name: t("header.benefits", language), path: "/benefits" },
    { name: t("header.legalIssue", language), path: "/legal-support" },
    { name: t("header.gallery", language), path: "/gallery" },
    { name: t("header.membership", language), path: "/membership" },
    { name: t("header.about", language), path: "/about" },
    { name: t("header.contact", language), path: "/contact" },
  ].filter(item => {
    // Hide membership link if user is already logged in
    if (user && item.path === "/membership") return false;
    return true;
  });

  // Only legal-support requires authentication for navigation.
  const PROTECTED_NAV_PATHS = ["/legal-support"];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (!user && PROTECTED_NAV_PATHS.includes(path)) {
      e.preventDefault();
      toast.info("Please login to access Legal Support");
      navigate("/pin-login", { state: { from: { pathname: path } } });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" onClick={() => window.scrollTo(0, 0)}>
          <img src={flagLogo} alt="AIDRMK Logo" className="h-10 w-auto" />
          <span className="text-2xl font-serif font-bold text-primary uppercase tracking-wider">AIDRMK</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-link",
                location.pathname === item.path ? "text-primary after:w-full" : "text-muted-foreground"
              )}
              onClick={(e) => handleNavClick(e, item.path)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{driverData?.name || "Member"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || user.phone}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {driverData?.membership_id && (
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-semibold text-xs uppercase text-muted-foreground mb-1">Membership Card</div>
                    <div className="flex justify-between items-center mb-1">
                      <span>Card No:</span>
                      <span className="font-mono text-primary font-bold">{driverData.membership_id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Plan:</span>
                      <span className="capitalize font-medium" style={{ color: driverData.membership_plan?.toLowerCase() === 'premium' ? '#8b5cf6' : driverData.membership_plan?.toLowerCase() === 'standard' ? '#ef4444' : '#eab308' }}>
                        {driverData.membership_plan || "Basic"}
                      </span>
                    </div>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/driver-dashboard")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                   await supabase.auth.signOut();
                   localStorage.removeItem('demo_user');
                   window.location.href = "/";
                }}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" className="gradient-primary rounded-full px-6 h-10 uppercase text-xs tracking-wider font-bold shadow-md hover:shadow-lg transition-all" asChild>
              <Link to="/pin-login" onClick={() => window.scrollTo(0, 0)}>{t("header.login", language)}</Link>
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-in slide-in-from-top duration-300">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Menu</span>
              <LanguageToggle />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-lg font-bold uppercase tracking-wide py-2",
                  location.pathname === item.path ? "text-primary" : "text-foreground"
                )}
                onClick={(e) => handleNavClick(e, item.path)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
