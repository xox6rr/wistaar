import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="container-main text-center">
        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-6 fade-up">
          A sanctuary for stories
        </p>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 animate-fade-in">
          Where stories are written
          <br />
          <span className="text-accent">and read with care.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12 fade-up delay-2">
          A distraction-free reading platform for authors and readers who value simplicity.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-up delay-3">
          <Link to="/explore">
            <Button size="lg" className="gap-2 px-8">
              Start Reading
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/publish">
            <Button variant="outline" size="lg" className="px-8">
              Publish Your Book
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;