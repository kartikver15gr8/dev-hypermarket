import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { teachersFont } from "../fonts/fonts";
import KeplrButton from "@/components/KeplrButton";
import SellerSidebar from "@/components/SellerSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sendit",
  description: "Sendit Zone ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* <KeplrButton /> */}
      <div className="flex bg-[#FCFCFC] ">
        <SellerSidebar />
        {children}
      </div>
    </>
  );
}
