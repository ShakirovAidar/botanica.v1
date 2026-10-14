import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "50Lemons — Fast Booking | Phuket Villas",
  description: "Find and book a villa in Phuket with 50Lemons.",
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body style={{ margin: 0 }}>{children}</body></html>;
}
