import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Whispers Through My Lens | Photography Portfolio",
  description: "A photography portfolio showcasing stunning landscapes, portraits and artistic photography from around the world. Explore the beauty captured through my lens.",
  keywords: "photography, portfolio, landscape, portrait, gallery, photographer, photo stories, artistic photography",
  metadataBase: new URL('https://whispers-through-my-lens.netlify.app/'),
  openGraph: {
    title: "Whispers Through My Lens | Photography Portfolio",
    description: "A photography portfolio showcasing stunning landscapes, portraits and artistic photography",
    images: [
      {
        url: '/images/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Whispers Through My Lens Photography',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Whispers Through My Lens | Photography Portfolio",
    description: "A photography portfolio showcasing stunning landscapes, portraits and artistic photography",
    images: ['/images/hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    // Add your Google Search Console verification code when you have it
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased bg-white`}
        style={{
          overscrollBehavior: 'none',
          scrollBehavior: 'smooth'
        }}
      >
        {children}
      </body>
    </html>
  );
}
