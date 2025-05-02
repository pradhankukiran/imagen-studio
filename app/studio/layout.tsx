import { StudioNavbar } from '@/components/studio/studio-navbar';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <StudioNavbar />
      <div className="flex-1 w-full max-w-screen-2xl mx-auto">
        {children}
      </div>
    </div>
  );
}