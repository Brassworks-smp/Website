export const metadata = {
    title: 'Brassworks - Live Map',
    description:
      'See our SMP world unfold in real time: track player activity, explore builds, follow roads and regions, and watch the Brassworks community shape the landscape together.',
    other: {
        'og:title': "Brassworks - Live Map",
        'og:description': "See our SMP world unfold in real time: track player activity, explore builds, follow roads and regions, and watch the Brassworks community shape the landscape together.",
        'og:url': "https://brassworks.opnsoc.org/map",
        'og:type': "website",
        'og:image': "https://brassworks.opnsoc.org/images/icon.png",
    },
};

export default function Map() {
  return (
    <section className="relative mt-16 justify-center overflow-hidden">
        <iframe src="https://brassmap.572.at/" width="100%" className="min-h-[93vh] h-screen">
        </iframe>
    </section>
  );
}
