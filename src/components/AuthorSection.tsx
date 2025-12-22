import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Shield, Users } from "lucide-react";

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
    <section className="section-spacing border-t border-border">
      <div className="container-editorial">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <p className="text-caption text-muted-foreground uppercase tracking-widest mb-3">
              For Authors
            </p>
            <h2 className="text-heading text-foreground mb-6">
              Publish with freedom, <br />reach readers with care.
            </h2>
            <p className="text-body text-muted-foreground mb-10 max-w-md">
              Wistaar gives independent authors a respectful platform to share their work — 
              whether freely or through premium access. Your stories, your rules.
            </p>

            {/* Features */}
            <div className="space-y-8 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-md bg-accent flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="editorial" size="lg" className="group">
              Start Publishing
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-[4/5] bg-card rounded-md border border-border p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-1 bg-primary mb-8" />
                <p className="headline-editorial text-2xl text-foreground leading-relaxed italic">
                  "Writing is not about being published. It is about finding 
                  readers who understand your voice."
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  — A Wistaar Author
                </p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-border rounded-md -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
