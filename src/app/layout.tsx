import type { Metadata } from "next";
import { Cinzel, Rajdhani } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Forge — Robert Blaylock | Senior Full Stack & 3D Engineer",
  description:
    "Interactive 3D portfolio of Robert Blaylock — Senior Full Stack Developer & 3D Software Engineer. Explore skills, projects, and career journey in an immersive walkable world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${rajdhani.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
