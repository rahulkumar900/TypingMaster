import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ConfigProvider } from "@/context/config-context";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  metadataBase: new URL("https://typingthunder.com"),
  title: "Typing Test & WPM Speed Test | TypingThunder",
  description: "Test your typing speed (WPM) and accuracy with our beautiful, minimalist typing test. Features Zen mode, Government Exam mode, and Weak Key drills.",
  keywords: "typing test, wpm test, typing speed test, keyboard test, words per minute, online typing practice, government typing test",
  authors: [{ name: "TypingThunder" }],
  category: "productivity",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Typing Test & WPM Speed Test | TypingThunder",
    description: "Check your typing speed (WPM) and accuracy online for free.",
    url: "https://typingthunder.com",
    siteName: "TypingThunder Typing Test",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typing Test & WPM Speed Test | TypingThunder",
    description: "Check your typing speed (WPM) and accuracy online for free.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "TypingThunder Typing Test",
      "url": "https://typingthunder.com",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any",
      "description": "A free online typing test to measure words per minute (WPM) and typing accuracy."
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
      className="h-full antialiased"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full transition-colors duration-500 overflow-x-hidden">
        <AuthProvider>
          <ConfigProvider>
            {children}
            <Toaster theme="dark" position="top-right" richColors />
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

