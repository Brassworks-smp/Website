import RoadmapUI from "@/components/roadmap/roadmap";

export const metadata = {
    other: {
        'og:title': "Brassworks - Roadmap",
        'og:description': "A quick overview of upcoming features, planned updates, and ongoing improvements shaping the future of our SMP experience.",
        'og:url': "https://brassworks.opnsoc.org/roadmap",
        'og:type': "website",
        'og:image': "https://brassworks.opnsoc.org/images/icon.png",
    },
};

export default function Home() {
  return (
    <div className="relative mx-auto">
      <RoadmapUI/>
    </div>
  );
}