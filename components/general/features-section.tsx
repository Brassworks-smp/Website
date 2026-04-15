"use client";

import * as React from "react";
import { useState } from "react";

const features = [
  {
    image: "/images/showcase/community-family.png?v=1",
    title: "A Community Like Family",
    description:
        "A highly active, welcoming, and beginner-friendly community where everyone supports each other. You're never just a player - you're part of something bigger.",
  },
  {
    image: "/images/showcase/custom-features.png?v=1",
    title: "Exclusive Custom Features",
    description:
        "Unique systems and mechanics developed specifically for our server, designed to enhance your gameplay experience in meaningful and exciting ways.",
  },
  {
    image: "/images/showcase/constantly-evolving.png?v=1",
    title: "Constantly Evolving",
    description:
        "Regular updates, new content, and continuous improvements ensure the server always feels fresh and exciting to explore.",
  },
  {
    image: "/images/showcase/community-driven.png?v=1",
    title: "Player-Driven World",
    description:
        "From massive builds to thriving markets, the world is shaped by its players - your ideas and creations truly matter.",
  },
];

export function FeaturesSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [fade, setFade] = React.useState(true);
  const [animateSniffer, setAnimateSniffer] = useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setAnimateSniffer(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % features.length);
        setFade(true);

        setAnimateSniffer(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const feature = features[currentIndex];

  return (
      <section className="pb-4 pt-36 relative overflow-hidden bg-gradient-to-t from-background via-background/70 to-transparent">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 uppercase font-bold font-minecraft">
            A cooperative Minecraft experience
          </h2>
          <p className="text-muted-foreground text-lg max-w-4xl">
            Build, trade and create together in a fully customized world with quests, economy, and reliability at it's core.
          </p>
        </div>

        <div className="max-w-7xl px-8 mx-auto relative flex grid grid-cols-2 gap-12 z-10 overflow-hidden">
          <div
              className={`w-full h-80 rounded-lg border border-neutral-700 overflow-hidden transition-all duration-700 transform ${
                  fade
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
              }`}
          >
            <img
                key={feature.image}
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-cover"
            />
          </div>

          <div
              className={`max-w-4xl transition-all duration-700 transform ${
                  fade
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-10"
              }`}
          >
            <p className="text-2xl mb-2 uppercase font-bold font-minecraft">
              {feature.title}
            </p>
            <p className="text-muted-foreground text-lg max-w-4xl">
              {feature.description}
            </p>
          </div>

          <img
              src="/images/showcase/scroll/sniffer.gif"
              alt="Sniffer"
              className={`pointer-events-none absolute pixelated bottom-[-0.35rem] w-16 transition-all ease-linear ${
                  animateSniffer
                      ? "left-1/2 translate-x-[-50%] opacity-100 animate-sniffer-move"
                      : "left-full opacity-0"
              }`}
          />
        </div>

        <style jsx>{`
        @keyframes snifferMove {
          0% {
            left: 53%;
            transform: translateX(-50%);
          }
          100% {
            left: 100%;
            transform: translateX(-100%);
          }
        }

        .animate-sniffer-move {
          animation: snifferMove 8s linear forwards;
        }
      `}</style>
      </section>
  );
}