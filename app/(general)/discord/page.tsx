import type { Metadata } from "next";
import { redirect } from "next/navigation";

const inviteCode = "brassworks";
const discordInviteUrl = `https://discord.gg/${inviteCode}`;

type DiscordInvite = {
  approximate_member_count?: number;
  approximate_presence_count?: number;
  guild?: {
    name?: string;
    description?: string | null;
    icon?: string | null;
    id?: string;
  };
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetch(
        `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true&with_expiration=true`,
        {
          next: {
            revalidate: 300,
          },
        }
    );

    if (!response.ok) {
      throw new Error("Discord invite metadata request failed");
    }

    const invite: DiscordInvite = await response.json();

    const guildName = invite.guild?.name ?? "Brassworks Discord";
    const memberCount = invite.approximate_member_count ?? 0;
    const onlineCount = invite.approximate_presence_count ?? 0;
    const description = `Join ${guildName} on Discord. ${memberCount.toLocaleString("en-US")} members, ${onlineCount.toLocaleString("en-US")} online.`;

    const iconUrl =
        invite.guild?.id && invite.guild.icon
            ? `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png?size=512`
            : "https://brassworks.opn-soc.org/images/icon.png";

    return {
      title: `${guildName} - Discord`,
      description,
      openGraph: {
        title: `${guildName} - Discord`,
        description,
        url: "https://brassworks.opn-soc.org/discord",
        siteName: "Brassworks",
        type: "website",
        images: [
          {
            url: iconUrl,
            width: 512,
            height: 512,
            alt: `${guildName} Discord Icon`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${guildName} - Discord`,
        description,
        images: [iconUrl],
      },
      alternates: {
        canonical: discordInviteUrl,
      },
    };
  } catch {
    return {
      title: "Brassworks - Discord",
      description: "Join the Brassworks Discord community.",
      openGraph: {
        title: "Brassworks - Discord",
        description: "Join the Brassworks Discord community.",
        url: "https://brassworks.opn-soc.org/discord",
        type: "website",
        images: ["/images/icon.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: "Brassworks - Discord",
        description: "Join the Brassworks Discord community.",
        images: ["/images/icon.png"],
      },
      alternates: {
        canonical: discordInviteUrl,
      },
    };
  }
}

export default function DiscordPage() {
  redirect(discordInviteUrl);
}