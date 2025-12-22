import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="container-editorial">
        <div className="max-w-3xl mx-auto text-center stagger-children">
          {/* Tagline */}
          <p className="text-caption text-muted-foreground uppercase tracking-widest mb-6">
            A home for stories
          </p>

          {/* Main Headline */}
          <h1 className="headline-editorial text-display-sm lg:text-display text-foreground mb-6">
            Where stories are written — and read with care.
          </h1>

          {/* Subheadline */}
          <p className="text-body text-muted-foreground max-w-xl mx-auto mb-10">
            A secure, distraction-free reading platform where authors publish freely 
            and readers discover exceptional stories across every genre.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="editorial" size="xl" className="group">
              Start Reading
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl">
              Publish Your Book
            </Button>
          </div>

          {/* Trust indicator */}
          <p className="text-caption text-muted-foreground mt-12">
            Trusted by independent authors across India and beyond
          </p>
        </div>
      </div>

      {/* Subtle decorative element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-border" />
    </section>
  );
};

export default HeroSection;
