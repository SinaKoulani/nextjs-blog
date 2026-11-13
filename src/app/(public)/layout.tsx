import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
