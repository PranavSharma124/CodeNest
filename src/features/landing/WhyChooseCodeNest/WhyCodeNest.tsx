import { Zap, Folder, Globe, Laptop } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Zap,
    title: "Real-Time Collaboration",
    description:
      "Work together instantly with live messaging and project discussions.",
  },
  {
    icon: Folder,
    title: "Everything in One Place",
    description:
      "Keep conversations, projects, and collaboration organized in a single workspace.",
  },
  {
    icon: Globe,
    title: "Open Source",
    description:
      "Transparent, community-driven, and built in public for developers everywhere.",
  },
  {
    icon: Laptop,
    title: "Built for Developers",
    description:
      "Designed around real development workflows—not generic team communication.",
  },
];
export default function WhyChooseCodeNest() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Why Choose CodeNest
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to collaborate, organize projects, and build
            software together.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
