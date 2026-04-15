import { SectionBar } from "@/components/schematic/section-bar";
import { SchematicSection } from "@/components/schematic/schematic-section";

export const metadata = {
    other: {
        'og:title': "Brassworks - Create SMP",
        'og:description': "Our public server thrives on cooperation between players - express your creativity freely, with each other.",
        'og:url': "https://brassworks.opnsoc.org/",
        'og:type': "website",
        'og:image': "https://brassworks.opnsoc.org/images/icon.png",
    },
};

export default function Home() {
    return (
        <div className="relative mx-auto min-h-screen">
            <SectionBar/>
            <SchematicSection/>
        </div>
    );
}