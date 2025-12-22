import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container-editorial">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-semibold tracking-tight text-foreground">
              Wistaar
            </Link>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              A secure platform for authors to publish freely and readers 
              to enjoy exceptional stories.
            </p>
          </div>

          {/* Readers */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">For Readers</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explore Books
                </Link>
              </li>
              <li>
                <Link to="/free" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Free Reading
                </Link>
              </li>
              <li>
                <Link to="/premium" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Premium Access
                </Link>
              </li>
              <li>
                <Link to="/genres" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse Genres
                </Link>
              </li>
            </ul>
          </div>

          {/* Authors */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">For Authors</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/publish" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Start Publishing
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Author Resources
                </Link>
              </li>
              <li>
                <Link to="/success" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Made with care in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
