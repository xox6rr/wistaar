import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Shield, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: BookOpen,
    title: "Complete Creative Control",
    description: "Retain full ownership of your work. Set your own pricing, choose your distribution, and build your readership on your terms."
  },
  {
    icon: Users,
    title: "Direct Reader Connection",
    description: "Build meaningful relationships with your readers. No algorithms standing between you and the people who love your stories."
  },
  {
    icon: Shield,
    title: "Secure Distribution",
    description: "Your content is protected with industry-leading security. Focus on writing — we handle the protection."
  }
];

const AuthorSection = () => {
  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-accent/30 rounded-full blur-3xl translate-x-1/2" />
      
      <div className="container-editorial relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-caption text-primary uppercase tracking-widest font-medium">
                For Authors
              </p>
            </div>
            <h2 className="headline-editorial text-heading text-foreground mb-6">
              Publish with freedom,
              <span className="block text-primary">reach readers with care.</span>
            </h2>
            <p className="text-body text-muted-foreground mb-10 max-w-md leading-relaxed">
              Wistaar gives independent authors a respectful platform to share their work — 
              whether freely or through premium access. Your stories, your rules.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex gap-4 p-4 rounded-lg hover:bg-accent/30 transition-colors duration-300 -ml-4"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-primary to-sage flex items-center justify-center shadow-soft">
                    <feature.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/publish">
              <Button variant="editorial" size="lg" className="group shadow-medium hover:shadow-glow transition-shadow">
                Start Publishing
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Visual */}
          <div className="relative">
            {/* Main quote card */}
            <div className="relative bg-gradient-to-br from-card to-cream rounded-xl border border-border/50 p-8 lg:p-10 shadow-medium">
              {/* Decorative line */}
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-sage mb-8 rounded-full" />
              
              <blockquote className="headline-editorial text-2xl lg:text-3xl text-foreground leading-relaxed mb-8">
                "Writing is not about being published. It is about finding 
                readers who understand your voice."
              </blockquote>
              
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-sm font-medium text-accent-foreground">W</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">A Wistaar Author</p>
                  <p className="text-xs text-muted-foreground">Published 12 books</p>
                </div>
              </footer>
              
              {/* Floating accent */}
              <div className="absolute -top-3 -right-3 w-20 h-20 bg-gold/20 rounded-full blur-2xl" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-xl border-2 border-primary/10 -z-10" />
            <div className="absolute -bottom-8 -right-8 w-full h-full rounded-xl border border-border/30 -z-20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
