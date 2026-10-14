import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://50lemons.com"), title: { default: "50Lemons — недвижимость на Пхукете", template: "%s | 50Lemons" }, description: "Подбор вилл и инвестиционных проектов на Пхукете. Помогаем сравнить варианты и организовать проверку документов до оплаты.", robots: { index: true, follow: true } };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ru"><body><Header/><main className="site-main">{children}</main><footer className="footer"><a className="brand" href="/">🍋 50Lemons</a><span>Подбор недвижимости на Пхукете</span><a href="/faq">FAQ</a></footer></body></html> }
