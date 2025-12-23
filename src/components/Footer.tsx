import { Link } from "react-router-dom";

const Footer = () => {
  const links = [
    { title: "Readers", items: [{ to: "/explore", label: "Explore" }, { to: "/library", label: "Library" }] },
    { title: "Authors", items: [{ to: "/publish", label: "Publish" }, { to: "/pricing", label: "Pricing" }] },
    { title: "Company", items: [{ to: "/about", label: "About" }, { to: "/privacy", label: "Privacy" }] },
  ];

  return (
    <footer className="border-t border-border py-16">
      <div className="container-main">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link to="/" className="text-xl font-serif">
              Wistaar
            </Link>
            <p className="text-sm text-muted-foreground mt-3 max-w-xs">
              A platform for authors and readers who value simplicity.
            </p>
          </div>

          {links.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-sm text-foreground hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Wistaar</p>
          <p>Made with care in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;