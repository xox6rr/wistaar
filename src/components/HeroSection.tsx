import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-24 lg:pt-44 lg:pb-36 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-cream/50" />
        
        {/* Floating decorative shapes */}
        <div className="absolute top-32 left-[10%] w-64 h-64 rounded-full bg-sage-light/30 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-[15%] w-48 h-48 rounded-full bg-gold-light/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container-editorial relative">
        <div className="max-w-4xl mx-auto text-center stagger-children">
          {/* Tagline with icon */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-primary/10 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-caption text-primary font-medium">
              A sanctuary for stories
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="headline-editorial text-display-sm lg:text-display text-foreground mb-8">
            Where stories are written
            <span className="block mt-2 text-primary">— and read with care.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-body text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            A secure, distraction-free reading platform where authors publish freely 
            and readers discover exceptional stories across every genre. Your next 
            favorite book awaits.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/explore">
              <Button variant="editorial" size="xl" className="group shadow-medium hover:shadow-glow transition-shadow duration-300">
                <BookOpen className="w-5 h-5" />
                Start Reading
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/publish">
              <Button variant="outline" size="xl" className="hover:bg-accent/50 transition-colors">
                Publish Your Book
              </Button>
            </Link>
          </div>

        </div>

        {/* Decorative book preview cards */}
        <div className="hidden lg:block absolute -bottom-12 left-8 opacity-60">
          <div className="w-24 h-36 rounded-sm bg-gradient-to-br from-accent to-sage-light rotate-[-8deg] shadow-medium" />
        </div>
        <div className="hidden lg:block absolute -bottom-8 right-12 opacity-60">
          <div className="w-28 h-40 rounded-sm bg-gradient-to-br from-secondary to-accent rotate-[6deg] shadow-medium" />
        </div>
      </div>

      {/* Elegant divider */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent to-border" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <div className="w-24 h-px bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
