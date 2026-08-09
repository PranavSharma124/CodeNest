import type { LucideIcon } from "lucide-react";

type FeatureCardProp = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProp) {
  const Icon = icon;

  return (
    <div className="rounded-xl border bg-background p-6 transition-colors hover:bg-muted/50">
      <Icon className="mb-4 h-8 w-8 text-primary" />

      <h3 className="mb-2 text-xl font-semibold">{title}</h3>

      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
