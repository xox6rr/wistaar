import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="section-spacing border-t border-border">
      <div className="container-editorial">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="headline-editorial text-display-sm text-foreground mb-6">
            Begin your journey.
          </h2>
          <p className="text-body text-muted-foreground mb-10">
            Whether you're here to discover your next favorite book or share 
            your stories with the world, Wistaar welcomes you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="editorial" size="xl" className="group">
              Start Reading
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl">
              Publish Your Book
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
