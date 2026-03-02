"use client";

import {ReactNode} from "react";
import {usePathname} from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type LayoutShellProps = {
  children: ReactNode;
};

export default function LayoutShell({children}: LayoutShellProps) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/ranking");

  return (
    <>
      {!hideChrome && <Header />}
      <main>{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}
