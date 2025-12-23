import { Lock, Eye, Moon, Smartphone, Zap } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Distraction-Free",
    description: "Clean, focused interface designed for deep reading. No ads, no notifications."
  },
  {
    icon: Moon,
    title: "Gentle on Eyes",
    description: "Warm color palette and comfortable typography for long sessions."
  },
  {
    icon: Lock,
    title: "Secure Content",
    description: "Advanced protection ensures your purchased content remains private."
  },
  {
    icon: Smartphone,
    title: "Read Anywhere",
    description: "Seamlessly sync your progress across all your devices."
  }
];

const ReadingExperienceSection = () => {
  return (
    <section className="section-spacing bg-foreground text-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sage-glow/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container-editorial relative">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 border border-background/20 mb-6">
            <Zap className="w-4 h-4 text-sage-glow" />
            <span className="text-caption text-background/80 font-medium">
              The Reading Experience
            </span>
          </div>
          <h2 className="headline-editorial text-heading text-background mb-6">
            Built for readers who value their time.
          </h2>
          <p className="text-body text-background/70 leading-relaxed">
            Every detail of Wistaar is designed around one goal: 
            helping you get lost in great stories without distraction.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-xl bg-background/5 border border-background/10 backdrop-blur-sm hover:bg-background/10 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-sage-glow/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-sage-glow" />
              </div>
              <h3 className="font-medium text-background mb-2 text-lg">
                {feature.title}
              </h3>
              <p className="text-sm text-background/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reading Preview */}
        <div className="relative max-w-3xl mx-auto">
          {/* Glow effect behind card */}
          <div className="absolute inset-4 bg-sage-glow/20 blur-2xl rounded-2xl" />
          
          <div className="relative bg-background rounded-2xl p-8 md:p-12 shadow-medium">
            {/* Book title indicator */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <div className="w-8 h-12 rounded bg-gradient-to-br from-accent to-sage-light" />
              <div>
                <p className="text-sm font-medium text-foreground">The Silent Garden</p>
                <p className="text-xs text-muted-foreground">Chapter 3 · The Morning Light</p>
              </div>
            </div>
            
            <div className="prose-reading text-foreground">
              <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:text-primary">
                The morning light filtered through the bamboo blinds, casting 
                long shadows across the worn wooden floor. She had always loved 
                this time of day, when the world seemed to hold its breath 
                between night and morning, between dreams and waking...
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">Page 42 of 286</span>
                <span className="text-xs text-muted-foreground">~3 min remaining</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 3 ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadingExperienceSection;
