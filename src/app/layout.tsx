import type { Metadata } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Typing Test & WPM Speed Test | Centerville",
  description: "Test your typing speed (WPM) and accuracy with our beautiful, minimalist typing test. Features Zen mode, Government Exam mode, and Weak Key drills.",
  keywords: "typing test, wpm test, typing speed test, keyboard test, words per minute, online typing practice, government typing test",
  alternates: {
    canonical: "https://centerville-typing.vercel.app", // Adjust domain when deploying
  },
  openGraph: {
    title: "Typing Test & WPM Speed Test | Centerville",
    description: "Check your typing speed (WPM) and accuracy online for free.",
    url: "https://centerville-typing.vercel.app",
    siteName: "Centerville Typing Test",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typing Test & WPM Speed Test | Centerville",
    description: "Check your typing speed (WPM) and accuracy online for free.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Centerville Typing Test",
      "url": "https://centerville-typing.vercel.app",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any",
      "description": "A free online typing test to measure words per minute (WPM) and typing accuracy."
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is a good typing speed (WPM)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An average typing speed is around 40 WPM. Speeds above 60 WPM are considered good for most administrative jobs, while speeds over 90 WPM are excellent."
          }
        },
        {
          "@type": "Question",
          "name": "How is WPM calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WPM (Words Per Minute) is calculated by dividing the total number of characters typed by 5 (the standard length of a word) and then dividing by the time in minutes."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full transition-colors duration-500 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
