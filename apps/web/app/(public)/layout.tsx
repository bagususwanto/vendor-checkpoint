import { InteractiveBackground } from '@/components/interactive-background';

export default function QueueStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col bg-linear-to-br from-background to-muted/20 min-h-screen">
      <InteractiveBackground color="59, 130, 246" />
      <div className="z-10 relative flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center p-6 w-full">
          <div className="w-full max-w-3xl slide-in-from-bottom-4 animate-in duration-500 fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
