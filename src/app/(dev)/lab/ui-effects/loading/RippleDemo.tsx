import { Ripple } from "@/components/ui/ui-effects/loading/loading";

export function RippleDemo() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-5xl font-medium tracking-tighter text-center whitespace-pre-wrap text-foreground">
        Ripple
      </p>
      <Ripple />
    </div>
  );
} 