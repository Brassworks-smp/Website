"use client";

import { useEffect } from "react";

export function DiscordRedirect() {
  useEffect(() => {
    window.location.href = "https://discord.com/invite/nDhkgzAPR2";
  }, []);
}