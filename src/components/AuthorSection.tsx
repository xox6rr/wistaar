import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { title: "Complete Control", desc: "Retain full ownership. Set your own pricing." },
  { title: "Direct Connection", desc: "Build relationships with readers directly." },
  { title: "Secure Distribution", desc: "Industry-leading content protection." },
];

const AuthorSection = () => {
  return (
    <section className="section-padding border-t border-border">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="text-sm tracking-widest uppercase text-accent mb-4">
            For Authors
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 max-w-2xl mx-auto">
            Publish with freedom, reach readers with care.
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Wistaar gives independent authors a respectful platform to share their work.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((f, i) => (
            <div key={i} className="text-center p-6">
              <h3 className="font-sans font-medium mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto text-center mb-12">
          <blockquote className="text-2xl md:text-3xl italic mb-6">
            "Writing is about finding readers who understand your voice."
          </blockquote>
          <p className="text-sm text-muted-foreground">— A Wistaar Author</p>
        </div>

        <div className="text-center">
          <Link to="/publish">
            <Button size="lg" className="gap-2">
              Start Publishing
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;