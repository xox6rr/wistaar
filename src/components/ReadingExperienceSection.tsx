import { Lock, Eye, Moon, Smartphone } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Distraction-Free",
    description: "Clean, focused interface designed for deep reading. No ads, no notifications — just you and the story."
  },
  {
    icon: Moon,
    title: "Gentle on Eyes",
    description: "Warm color palette and comfortable typography optimized for long reading sessions."
  },
  {
    icon: Lock,
    title: "Secure Content",
    description: "Advanced protection ensures your purchased content remains private and accessible only to you."
  },
  {
    icon: Smartphone,
    title: "Read Anywhere",
    description: "Seamlessly sync your progress across devices. Pick up exactly where you left off."
  }
];

const ReadingExperienceSection = () => {
  return (
    <section className="section-spacing bg-foreground text-background">
      <div className="container-editorial">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-caption text-background/60 uppercase tracking-widest mb-3">
            The Reading Experience
          </p>
          <h2 className="text-heading text-background mb-6">
            Built for readers who value their time.
          </h2>
          <p className="text-body text-background/70">
            Every detail of Wistaar is designed around one goal: 
            helping you get lost in great stories without distraction.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-md bg-background/10 flex items-center justify-center mx-auto mb-5">
                <feature.icon className="w-5 h-5 text-background" />
              </div>
              <h3 className="font-medium text-background mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-background/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reading Preview */}
        <div className="mt-20 bg-background rounded-md p-6 md:p-10 max-w-2xl mx-auto">
          <div className="prose-reading text-foreground">
            <p className="first-letter:text-4xl first-letter:font-serif first-letter:mr-1 first-letter:float-left first-letter:leading-none">
              The morning light filtered through the bamboo blinds, casting 
              long shadows across the worn wooden floor. She had always loved 
              this time of day, when the world seemed to hold its breath 
              between night and morning...
            </p>
          </div>
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <span className="text-xs text-muted-foreground">Page 42 of 286</span>
            <span className="text-xs text-muted-foreground">~3 min remaining in chapter</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadingExperienceSection;
