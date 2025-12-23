import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Menu, BookOpen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { to: "/explore", label: "Explore" },
    { to: "/library", label: "My Library", requiresAuth: true },
    { to: "/publish", label: "Publish" },
  ];

  const filteredNavLinks = navLinks.filter(
    (link) => !link.requiresAuth || user
  );

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-soft border-b border-border/50' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container-editorial">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground font-serif">
              Wistaar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  isActiveLink(link.to)
                    ? 'text-primary bg-accent font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-lg" />
            ) : user ? (
              <>
                <span className="text-sm text-muted-foreground max-w-[150px] truncate">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="editorial" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background border-l border-border">
                <SheetHeader className="text-left border-b border-border pb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-semibold font-serif">Wistaar</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col py-6">
                  {/* Mobile Nav Links */}
                  <div className="flex flex-col gap-1">
                    {filteredNavLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={handleNavClick}
                        className={`px-4 py-3 text-base rounded-lg transition-all duration-200 ${
                          isActiveLink(link.to)
                            ? 'text-primary bg-accent font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Auth */}
                  <div className="mt-8 pt-6 border-t border-border">
                    {loading ? (
                      <div className="h-10 bg-muted animate-pulse rounded-lg" />
                    ) : user ? (
                      <div className="flex flex-col gap-3">
                        <span className="px-4 text-sm text-muted-foreground truncate">
                          {user.email}
                        </span>
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={handleSignOut}
                          className="justify-start gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 px-2">
                        <Link to="/auth" onClick={handleNavClick}>
                          <Button variant="ghost" size="lg" className="w-full">
                            Sign in
                          </Button>
                        </Link>
                        <Link to="/auth" onClick={handleNavClick}>
                          <Button variant="editorial" size="lg" className="w-full">
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
