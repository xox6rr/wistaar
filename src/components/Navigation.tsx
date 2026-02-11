import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: "/explore", label: "Explore" },
    { to: "/library", label: "Library", requiresAuth: true },
    { to: "/publish", label: "Publish" },
  ].filter((link) => !link.requiresAuth || user);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-border' : ''
      }`}
    >
      <nav className="container-main">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-serif">
            Wistaar
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${
                  isActive(link.to) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {loading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded" />
            ) : user ? (
              <div className="flex items-center gap-1">
                <Link to="/profile">
                  <Button variant="ghost" size="sm">Profile</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm">Get Started</Button>
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="text-sm py-2"
                >
                  {link.label}
                </Link>
              ))}
              {!loading && !user && (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              )}
              {user && (
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">Profile</Button>
                </Link>
              )}
              {user && (
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
