"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coffee, Map } from "lucide-react";

export function CommunitySection() {
    const [status, setStatus] = useState({
        online: false,
        players: { online: 0, max: 0 },
    });

    useEffect(() => {
        async function fetchStatus() {
            try {
                const res = await fetch("https://api.mcstatus.io/v2/status/java/brassworks.opnsoc.org");
                const data = await res.json();

                setStatus({
                    online: data.online,
                    players: data.players || { online: 0, max: 0 },
                });
            } catch (err) {
                console.error("Fehler beim Laden des Serverstatus:", err);
                setStatus({ online: false, players: { online: 0, max: 0 } });
            }
        }

        fetchStatus();
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="pb-20 pt-36">
            <div className="container">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl mb-4 uppercase font-bold font-minecraft">
                        Stay Connected
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        Whether you want to chat, support us, or explore the world - here's how you can
                        join the Brassworks community beyond the game.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <div className="flex flex-col gap-6 w-full h-[500px]">
                        {[
                            {
                                href: "https://brassworks.opnsoc.org/map",
                                icon: <Map className="h-5 w-5" />,
                                iconBg:
                                    "bg-green-500/20 text-green-600 dark:bg-green-400/20 dark:text-green-300",
                                title: "Our Live Map",
                                description:
                                    "Explore the Brassworks world live from your browser. See builds, terrain, and players in real-time.",
                                buttonText: "View Map",
                                buttonColor: {
                                    bg: "bg-green-600",
                                    ring: "ring-green-400",
                                    border: "border-green-700",
                                    hoverBg: "hover:bg-green-500",
                                    shadow: "shadow-[0_4px_theme(colors.green.700)]",
                                    hoverShadow: "hover:shadow-[0_2px_theme(colors.green.600)]",
                                },
                            },
                            {
                                href: "https://ko-fi.com/brassworks",
                                icon: <Coffee className="h-5 w-5" />,
                                iconBg:
                                    "bg-amber-500/25 text-amber-600 dark:bg-amber-400/20 dark:text-amber-300",
                                title: "Buy us a Coffee",
                                description:
                                    "Support the development and help keep the project alive with a small donation.",
                                buttonText: "Support Us",
                                buttonColor: {
                                    bg: "bg-amber-500",
                                    ring: "ring-amber-400",
                                    border: "border-amber-600",
                                    hoverBg: "hover:bg-amber-400",
                                    shadow: "shadow-[0_4px_theme(colors.amber.600)]",
                                    hoverShadow: "hover:shadow-[0_2px_theme(colors.amber.500)]",
                                },
                            },
                        ].map(
                            (
                                {
                                    href,
                                    icon,
                                    iconBg,
                                    title,
                                    description,
                                    buttonText,
                                    buttonColor,
                                },
                                i
                            ) => (
                                <div
                                    key={i}
                                    className={` border border-neutral-700
                    relative rounded-lg bg-white px-6 py-6 flex flex-col
                    shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)]
                    dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)]
                    dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-lg 
                    dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset]
                  `}
                                >
                                    <div className="relative pl-14 pr-2">
                                        <div
                                            className={`absolute top-0 left-0 flex w-10 h-10 items-center justify-center rounded-full ${iconBg}`}
                                            aria-hidden="true"
                                        >
                                            {icon}
                                        </div>

                                        <dt className="text-base text-zinc-800 dark:text-white font-medium">
                                            {title}
                                        </dt>
                                        <dd className="mt-1 text-base text-zinc-500 dark:text-zinc-400">
                                            {description}
                                        </dd>
                                    </div>

                                    <div className="mt-auto flex justify-end">
                                        <Link href={href} target="_blank">
                                            <button
                                                className={`
                          font-minecraft inline-flex items-center justify-center
                          px-4 py-2 h-10 text-sm ring-2 ring-inset text-white
                          ${buttonColor.bg} ${buttonColor.ring} ${buttonColor.border}
                          ${buttonColor.shadow}
                          ${buttonColor.hoverBg} ${buttonColor.hoverShadow}
                          hover:translate-y-0.5 transition
                        `}
                                            >
                                                {buttonText}
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        )}
                        <div
                            className={` border border-neutral-700 flex-1
                    relative rounded-lg bg-white px-6 py-6
                    shadow-[0px_0px_0px_1px_rgba(9,9,11,0.07),0px_2px_2px_0px_rgba(9,9,11,0.05)]
                    dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1)]
                    dark:before:pointer-events-none dark:before:absolute dark:before:-inset-px dark:before:rounded-lg 
                    dark:before:shadow-[0px_2px_8px_0px_rgba(0,0,0,0.20),0px_1px_0px_0px_rgba(255,255,255,0.06)_inset]
                  `}
                        >
                            <div className="relative w-full h-full overflow-hidden rounded-xl">
                                <motion.img
                                    src="images/icon.png"
                                    className="absolute inset-0 h-full object-cover"
                                    alt="Brassworks Logo"
                                />
                                <div className="h-full w-full pl-20 ml-2">
                                    <div className="h-6 w-full">
                                        <span className="text-base font-medium">
                                            Server Status
                                        </span>
                                        <span className={`ml-1.5 px-1.5 py-0.5 rounded-lg ${status.online ? "bg-emerald-500" : "bg-rose-600"}  text-xs`}>{status.online ? "online" : "offline"}</span>
                                    </div>
                                    <div className="bg-gray-500 rounded-l-lg w-4 h-0.5 mt-2.5 mb-2">
                                    </div>
                                    <dt className="text-sm text-gray-300">
                                        {status.players.online}/{status.players.max} players
                                    </dt>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg border border-neutral-700">
                        <iframe
                            src="https://discord.com/widget?id=1346614274415398975&theme=dark"
                            width="100%"
                            height="100%"
                            allowTransparency={true}
                            frameBorder="0"
                            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
