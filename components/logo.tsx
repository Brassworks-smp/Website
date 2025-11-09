import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return <Image width={100} height={100} src="/images/seasons/season1.png" alt="brassworks" className={className} />;
}