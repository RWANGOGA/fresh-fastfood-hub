// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fresh$FastFood-Hub | Fast & Fresh in Kampala",
  description: "Quick Rolex, burgers, chapati, chicken & more – delivered hot!",
  icons: {
    icon: "/favicon.ico", // Add your favicon later in public/
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900 min-h-screen`}>
        {/* Fixed Navbar */}
        <Navbar />

        {/* Main content with padding to avoid overlap with fixed navbar */}
        <main className="pt-20">
          {children}
        </main>

        {/* Toast notifications container */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000, // Show for 3 seconds
            style: {
              background: "#10B981", // Green success color
              color: "white",
              fontWeight: "bold",
              borderRadius: "9999px", // Very rounded (pill shape)
              padding: "12px 24px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              maxWidth: "90vw",
            },
            success: {
              iconTheme: {
                primary: "white",
                secondary: "#10B981",
              },
            },
          }}
        />
      </body>
    </html>
  );
}