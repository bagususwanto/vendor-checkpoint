export default function FidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden">
      {children}
    </div>
  );
}
