import { redirect } from "next/navigation";

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
  redirect("https://discord.com/invite/neqEBnPVgY");
}