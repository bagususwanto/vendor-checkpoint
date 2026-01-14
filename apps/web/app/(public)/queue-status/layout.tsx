import { InteractiveBackground } from '@/components/interactive-background';

export default function QueueStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-linear-to-br from-background to-muted/20">
      <InteractiveBackground color="59, 130, 246" />
      {children}
    </div>
  );
}
