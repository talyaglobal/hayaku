// components/Logo.tsx
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

type LogoProps = {
  variant?: "full" | "icon";
  href?: string;
  className?: string;
};

export function Logo({ variant = "full", href = "/", className }: LogoProps) {
  const content =
    variant === "full" ? (
      <Image
        src="/logo-hayaku.svg"
        alt={`${BRAND.name} logo`}
        width={140}
        height={40}
        priority
      />
    ) : (
      <div
        aria-label={`${BRAND.name} icon`}
        className={`flex items-center justify-center rounded-full border border-black bg-white text-black font-extrabold text-xl ${className ?? ""}`}
        style={{ width: 40, height: 40, lineHeight: "40px" }}
      >
        H
      </div>
    );

  if (!href) return content;

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}