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
  description: "A photography portfolio showcasing stunning landscapes, portraits and artistic photography",
  keywords: "photography, portfolio, landscape, portrait, gallery, photographer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${poppins.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
