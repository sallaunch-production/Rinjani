import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "../globals.css";
import SideBar from "@/components/_nav";
import LiveClock from "@/components/liveclock";
import React from "react";
import Clock from "react-live-clock";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Rinjani",
  description: "Arsema Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-row h-[calc(100vh-3rem)]">
        <aside className="overflow-y-auto w-30 card">
          <SideBar></SideBar>
        </aside>
        <main className="w-full overflow-y-auto">{children}</main>
      </div>
      <footer className="content-center text-center mx-auto px-auto h-20 bg-red-700 text-white pt-3">
        &copy; 2024 - Arsema
      </footer>
    </>
  );
}
