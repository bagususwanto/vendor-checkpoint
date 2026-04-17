export default function FidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col bg-background min-h-screen overflow-hidden">
      {children}
    </div>
  );
}
