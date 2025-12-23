import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Menu, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const navLinks = [
    { to: "/explore", label: "Explore", active: true },
    { to: "/read", label: "Read", active: false },
    { to: "/publish", label: "Publish", active: false },
    { to: "/premium", label: "Premium", active: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav className="container-editorial">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold tracking-tight text-foreground">
              Wistaar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors duration-200 ${
                  link.active
                    ? "text-foreground hover:text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded" />
            ) : user ? (
              <>
                <span className="text-sm text-muted-foreground">
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
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-background">
                <SheetHeader className="text-left border-b border-border pb-4">
                  <SheetTitle className="text-xl font-semibold">Wistaar</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col py-6">
                  {/* Mobile Nav Links */}
                  <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={handleNavClick}
                        className={`px-3 py-3 text-base rounded-md transition-colors ${
                          link.active
                            ? "text-foreground bg-muted"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Auth */}
                  <div className="mt-6 pt-6 border-t border-border">
                    {loading ? (
                      <div className="h-10 bg-muted animate-pulse rounded" />
                    ) : user ? (
                      <div className="flex flex-col gap-3">
                        <span className="px-3 text-sm text-muted-foreground truncate">
                          {user.email}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSignOut}
                          className="justify-start gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 px-3">
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
