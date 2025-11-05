"use client";

import { useState, useEffect } from 'react';
import { 
  HandCoins,
  Wrench,
  ServerCog,
  Handshake
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: HandCoins,
    title: "Economy System",
    description: "Earn currency through quests, trading, and various in-game activities. A dynamic system designed to reward your efforts."
  },
  {
    icon: Wrench,
    title: "Fully Customized",
    description: "A carefully crafted custom modpack, finely tuned with love for a unique gameplay experience."
  },
  {
    icon: ServerCog,
    title: "High-End Server",
    description: "A high-performance server built for stability and speed - always pushing to deliver the best experience possible."
  },
  {
    icon: Handshake,
    title: "Amazing Community",
    description: "Join parties, trade with others, or start your own project. It's the players who bring Brasswork's world to life."
  }
];

export function FeaturesSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.getAttribute('data-idx') || '0');
          setVisibleItems(prev => [...prev, idx]);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-item').forEach(item => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="pb-4 pt-36" id="our-server">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 uppercase font-bold font-minecraft">A cooperative Minecraft server</h2>
          <p className="text-muted-foreground text-lg max-w-4xl">
            Our public server thrives on cooperation between players - express your creativity freely, with each other.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
              <div
                  key={idx}
                  data-idx={idx}
                  className={cn(
                      "feature-item bg-card/60 p-6 transition-all duration-500 relative",
                      visibleItems.includes(idx)
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                  )}
                  style={{transitionDelay: `${idx * 100}ms`}}
              >
                  <div className="absolute top-0 right-0 z-10 h-1.5 w-3 bg-background"></div>
                  <div className="absolute top-0 left-0 z-10 h-1.5 w-3 bg-background"></div>
                  <div className="absolute bottom-0 right-0 z-10 h-1.5 w-3 bg-background"></div>
                  <div className="absolute bottom-0 left-0 z-10 h-1.5 w-3 bg-background"></div>
                  <div className="h-12 w-12 bg-amber-400/60 flex items-center justify-center rounded-lg mb-5">
                      <feature.icon className="h-6 w-6 text-neutral-100"/>
                  </div>
                  <h3 className="font-bold font-minecraft text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}