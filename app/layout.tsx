import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Botanica Luxury Villas — Phuket",
  description: "Find your Botanica villa in Phuket.",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
