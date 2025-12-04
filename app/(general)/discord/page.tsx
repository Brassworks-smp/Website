import { DiscordRedirect } from "@/components/general/discordredirect";

export const metadata = {
  title: 'Brassworks - Discord',
  description:
    'Join the Brassworks community on Discord - connect with players, get updates, and stay informed about our SMP world.',
  other: { 
    'og:title': "Brassworks - Discord",
    'og:description': "Join the Brassworks community on Discord - connect with players, get updates, and stay informed about our SMP world.",
    'og:url': "https://brassworks.opnsoc.org/discord",
    'og:type': "website",
    'og:image': "https://brassworks.opnsoc.org/images/icon-discord.png",
  },
};

export default function DiscordPage() {
  return (
    <DiscordRedirect/>
  );
}