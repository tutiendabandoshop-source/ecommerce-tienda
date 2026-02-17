import type { Metadata } from "next";
import { Inter, Poppins, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Áurea – Tu estilo, tu esencia",
    template: "%s | Áurea",
  },
  description: "Belleza que te acompaña. Productos que realzan tu esencia. Envío rápido. Áurea – elegancia y cuidado.",
  keywords: ["Áurea", "tienda", "ecommerce", "belleza", "cuidado personal", "moda", "compras online"],
  authors: [{ name: "Áurea" }],
  icons: {
    icon: "/Fabicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://aurea.com",
    siteName: "Áurea",
    title: "Áurea – Tu estilo, tu esencia",
    description: "Belleza que te acompaña. Elegancia y cuidado.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} ${bebasNeue.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
