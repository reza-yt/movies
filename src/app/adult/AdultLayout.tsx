"use client";

import AgeVerification from "@/components/AgeVerification";

export default function AdultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AgeVerification />
      {children}
    </>
  );
}
