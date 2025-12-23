import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Feather } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage-light/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container-editorial relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative element */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-sage flex items-center justify-center shadow-glow animate-pulse-glow">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          
          <h2 className="headline-editorial text-display-sm lg:text-heading text-foreground mb-6">
            Begin your journey.
          </h2>
          <p className="text-body text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed">
            Whether you're here to discover your next favorite book or share 
            your stories with the world, Wistaar welcomes you.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/explore">
              <Button variant="editorial" size="xl" className="group shadow-medium hover:shadow-glow transition-shadow">
                <BookOpen className="w-5 h-5" />
                Start Reading
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/publish">
              <Button variant="outline" size="xl" className="group">
                <Feather className="w-5 h-5" />
                Publish Your Book
              </Button>
            </Link>
          </div>
          
          {/* Trust badge */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-accent/50 border border-primary/10">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent border-2 border-background flex items-center justify-center"
                >
                  <span className="text-xs font-medium text-accent-foreground">{String.fromCharCode(64 + i)}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Join <span className="font-medium text-foreground">10,000+</span> readers today
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
