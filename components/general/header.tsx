"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

// @ts-ignore
function HoverImage({ src, hoverSrc, alt, href }) {
  const [isHovered, setIsHovered] = React.useState(false);

  const image = (
      <Image
          src={isHovered ? hoverSrc : src}
          alt={alt}
          width={24}
          height={24}
          className="pixelated transition-all duration-250 ease-out"
          style={{
            transform: isHovered ? "scale(0.91)" : "scale(1)",
            cursor: "pointer",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      />
  );

  if (href) {
    return (
        <Link href={href} target="_blank">
          {image}
        </Link>
    );
  }

  return image;
}

export function Header() {
  return (
      <header className="top-0 z-50 w-full transition-colors duration-300 bg-card border-b-2 border-b-gray-200/10">
        <div className="container2 flex h-10 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/icon.png" alt="icon" width={28} height={28} />
            <p className="text-sm  text-gray-300 font-minecraft tracking-widest">BRASSWORKS</p>
          </Link>

          <div className="py-1 flex items-center gap-3">
            <HoverImage
                src="/images/icons/kofi.png"
                hoverSrc="/images/icons/kofi-hover.png"
                alt="kofi"
                href="https://ko-fi.com/brassworks"
            />
            <HoverImage
                src="/images/icons/discord.png"
                hoverSrc="/images/icons/discord-hover.png"
                alt="discord"
                href="https://brassworks.opnsoc.org/discord"
            />
            <HoverImage
                src="/images/icons/modrinth.png"
                hoverSrc="/images/icons/modrinth-hover.png"
                alt="modrinth"
                href="https://modrinth.com/organization/brassworks"
            />
            <HoverImage
                src="/images/icons/github.png"
                hoverSrc="/images/icons/github-hover.png"
                alt="github"
                href="https://github.com/Brassworks-smp"
            />
          </div>
        </div>
      </header>
  );
}