import { Link } from "react-router-dom";
import { BookOpen, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-cream/50 border-t border-border py-16 lg:py-20">
      <div className="container-editorial">
        <div className="grid md:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-foreground font-serif">
                Wistaar
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              A secure platform for authors to publish freely and readers 
              to enjoy exceptional stories from India and beyond.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-accent hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-200">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Readers */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5">For Readers</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Explore Books
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=free" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Free Reading
                </Link>
              </li>
              <li>
                <Link to="/explore?filter=premium" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Premium Access
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  My Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Authors */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5">For Authors</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/publish" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Start Publishing
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Author Resources
                </Link>
              </li>
              <li>
                <Link to="/success" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors link-animated">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wistaar. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0 flex items-center gap-2">
            Made with care in India
            <span className="inline-block">🇮🇳</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
