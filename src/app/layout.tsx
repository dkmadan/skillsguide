import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import LayoutClientWrapper from '@/components/LayoutClientWrapper';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800', '900']
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['300', '400', '500', '600', '700', '800']
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://skillsguide.in'),
  title: {
    default: 'SkillsGuide.in | Empower Your Career Journey With Modern In-Demand Skills',
    template: '%s | SkillsGuide.in'
  },
  description: 'India\'s leading career skilling and roadmap platform. Master High-Demand Tech (AI, Data, Cloud), Non-IT, Tally GST, and Business skills with verified Indian salary benchmarks.',
  keywords: [
    'skillsguide', 'skillsguide.in', 'career roadmaps india', 'data analyst salary india',
    'full stack developer roadmap', 'tally prime gst course', 'prompt engineering jobs india',
    'indian salary benchmarks', 'fresher high paying skills', 'learn coding from scratch'
  ],
  authors: [{ name: 'SkillsGuide Editorial Team', url: 'https://skillsguide.in' }],
  creator: 'SkillsGuide.in',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://skillsguide.in',
    title: 'SkillsGuide.in | Empower Your Career Journey With Modern In-Demand Skills',
    description: 'Master High-Demand Tech, Non-IT, and Business Skills with verified Indian salary benchmarks and step-by-step career roadmaps.',
    siteName: 'SkillsGuide.in',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'SkillsGuide.in Career Skilling Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillsGuide.in | In-Demand Skills & Indian Salary Benchmarks',
    description: 'Expert-verified career roadmaps, salary benchmarks, and interactive tools for Indian aspirants.',
    images: ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=630&q=80']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'google53ac920835170e31'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable} ${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="canonical" href="https://skillsguide.in" />
      </head>
      <body className="font-sans antialiased selection:bg-purple-600 selection:text-white min-h-screen flex flex-col justify-between relative bg-[#0d0f18] text-slate-100">
        
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H8YRVGPK56"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-H8YRVGPK56');
          `}
        </Script>

        {/* Ambient Floating Glow Orbs */}
        <div className="fixed top-10 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="fixed top-1/3 right-10 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="fixed bottom-20 left-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <LayoutClientWrapper>
          {children}
        </LayoutClientWrapper>

      </body>
    </html>
  );
}
