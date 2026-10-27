import type { Metadata, Viewport } from 'next';
import { Cinzel, Rajdhani } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '700', '900'],
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0a0806',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'The Forge — Robert Blaylock | Senior Full Stack & 3D Engineer',
  description:
    'Interactive 3D portfolio of Robert Blaylock — Senior Full Stack Developer & 3D Software Engineer. Explore skills, projects, and career journey in an immersive walkable world.',
  keywords: [
    'Robert Blaylock',
    'Full Stack Developer',
    '3D Engineer',
    'Three.js',
    'React',
    'Next.js',
    'WebGL',
    'Portfolio',
    'Interactive',
  ],
  authors: [{ name: 'Robert Blaylock' }],
  creator: 'Robert Blaylock',
  metadataBase: new URL('https://rblaylock.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rblaylock.dev',
    siteName: 'The Forge',
    title: 'The Forge — Robert Blaylock | Senior Full Stack & 3D Engineer',
    description:
      'Explore an immersive 3D portfolio — walk through skills, projects, and career milestones in an interactive forge world.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Forge — Robert Blaylock',
    description:
      'Interactive 3D portfolio — explore skills, projects, and career journey in an immersive walkable world.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Robert Blaylock',
              jobTitle: 'Senior Full Stack & 3D Engineer',
              url: 'https://rblaylock.dev',
              sameAs: [
                'https://www.linkedin.com/in/rblaylock286/',
                'https://github.com/RBlaylock-Dev',
              ],
            }),
          }}
        />
      </head>
      <body className={`${cinzel.variable} ${rajdhani.variable} antialiased`}>
        <a
          href="#main-content"
          className="skip-to-content"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            zIndex: 9999,
          }}
        >
          Skip to content
        </a>
        <main id="main-content">{children}</main>

        {/* Fallback content for users with JavaScript disabled */}
        <noscript>
          <div
            style={{
              background: '#0a0806',
              color: '#f5deb3',
              padding: '48px 24px',
              fontFamily: 'sans-serif',
              textAlign: 'center',
              minHeight: '100vh',
            }}
          >
            <h1 style={{ color: '#e8a54b', marginBottom: 16 }}>The Forge — Robert Blaylock</h1>
            <p style={{ marginBottom: 8 }}>
              Senior Full Stack Developer &amp; 3D Software Engineer
            </p>
            <p style={{ color: '#6a5a4a', fontSize: 14 }}>
              This interactive 3D portfolio requires JavaScript to run. Please enable JavaScript to
              explore The Forge.
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
