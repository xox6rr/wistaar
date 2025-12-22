import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
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

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/explore" 
              className="text-sm text-foreground hover:text-primary transition-colors duration-200"
            >
              Explore
            </Link>
            <Link 
              to="/read" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Read
            </Link>
            <Link 
              to="/publish" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Publish
            </Link>
            <Link 
              to="/premium" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Premium
            </Link>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign in
            </Button>
            <Button variant="editorial" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
