import { HeroSection } from '@/components/general/hero-section';
import { FeaturesSection } from '@/components/general/features-section';
import { TeamList } from "@/components/general/team-list";
import { CommunitySection } from '@/components/general/community-section';
import { SeasonsSection } from "@/components/general/seasons";
import { ModpackSection } from "@/components/general/modpack";
import { GallerySlider } from "@/components/general/gallery";

export const metadata = {
    other: {
        'og:title': "Brassworks – Create SMP",
        'og:description': "Our public server thrives on cooperation between players - express your creativity freely, with each other.",
        'og:url': "https://brassworks.572.at/",
        'og:type': "website",
        'og:image': "https://brassworks.572.at/images/logo.png",
    },
};

export default function Home() {
  return (
    <div className="relative mx-auto">
      <HeroSection/>
      <FeaturesSection/>
      <ModpackSection/>
      <SeasonsSection/>
        <GallerySlider
            items={[
                { src: "/images/gallery/1.png?v=1", author: "Welcome to Season 2!" },
                { src: "/images/gallery/2.png?v=1", author: "Nether Tomfoolery..." },
                { src: "/images/gallery/3.png?v=1", author: "Steph_OVGU & Arturias_Yulind" },
            ]}
            autoPlay
            interval={5000}
        />
      <TeamList/>
      <CommunitySection/>
    </div>
  );
}