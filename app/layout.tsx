import type { Metadata } from "next";
import { Averia_Libre } from "next/font/google";
import BG from "../public/illustration_wo_squid.png";
import "./globals.css";

const averiaLibre = Averia_Libre({ weight: "400" });

export const metadata: Metadata = {
  title: "Vulvatorious",
  description: "Vulvatorious",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body
        className="min-h-full flex flex-col text-white bg-black p-10"
        style={{
          backgroundImage: `url(${BG.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          fontFamily: averiaLibre.style.fontFamily,
        }}
      >
        {children}
      </body>
    </html>
  );
}
