import { ButtonWipe } from "./ButtonWipe";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function NotFoundPage() {
    return (
        <>
            <Header />
            <main className="grid min-h-[100svh] place-items-center bg-[#171614] px-4 pb-20 pt-[120px] text-center text-white sm:px-8">
                <div className="mx-auto max-w-2xl">
                    <span className="font-minecraft text-[11px] font-bold uppercase tracking-[0.18em] text-[#d9b86e]">
                        Error 404
                    </span>
                    <h1 className="mt-5 font-minecraft text-4xl font-bold leading-tight sm:text-5xl">
                        This page does not exist.
                    </h1>
                    <p className="mx-auto mt-5 max-w-xl text-sm font-semibold leading-7 text-white/58 sm:text-base">
                        The address may be incorrect, or the page may have
                        moved.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="/"
                            className="group/button relative inline-flex min-h-11 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                        >
                            <ButtonWipe />
                            <span className="relative z-10">Back home</span>
                        </a>
                        <a
                            href="/news"
                            className="site-interactive group/button relative inline-flex min-h-11 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#211f1b] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white/72 transition-colors hover:text-white"
                        >
                            <ButtonWipe color="#d9b86e" />
                            <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#171614]">
                                Read the news
                            </span>
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
