import { ArrowUpRight, LockKeyhole, Megaphone } from "lucide-react";
import { ButtonWipe } from "../general/ButtonWipe";
import { Footer } from "../general/Footer";
import { Header } from "../general/Header";
import {
    APPLICATION_DURATION,
    DISCORD_URL,
    joinGroups,
    type JoinPosition,
    joinPositions,
    REVIEW_TIME,
} from "./join-config";

const steps = [
    {
        title: "Pick a position",
        description:
            "Read what the role is about and check that it fits the time you can offer.",
    },
    {
        title: "Fill in the form",
        description: `No account or login needed. It takes about ${APPLICATION_DURATION}, and your draft is saved on this device.`,
    },
    {
        title: "Review",
        description: `We usually review applications within ${REVIEW_TIME}. Questions and our answer reach you through Discord.`,
    },
    {
        title: "Trial phase",
        description:
            "If we accept you, you start with limited access and a contact person who helps you settle in.",
    },
];

function PositionCard({ position }: { position: JoinPosition }) {
    const Icon = position.icon;
    const open = position.status === "open";
    const content = (
        <>
            <span className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#171614] text-[#d9b86e]">
                    <Icon size={20} strokeWidth={2} />
                </span>
                <span
                    className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                        open
                            ? "bg-[#c7a35a] text-[#171614]"
                            : "bg-white/6 text-white/45"
                    }`}
                >
                    {open ? "Open" : "Closed"}
                </span>
            </span>

            <span className="mt-6 block font-minecraft text-xl font-bold text-white">
                {position.title}
            </span>
            <span className="mt-3 block text-sm font-semibold leading-6 text-white/58">
                {position.summary}
            </span>

            <span className="mt-auto flex items-end justify-between gap-4 pt-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/38">
                    {position.rank} · {position.area}
                </span>
                {open ? (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c7a35a] text-[#171614] transition-colors duration-500 group-hover:bg-[#dec17c] group-focus-visible:bg-[#dec17c]">
                        <ArrowUpRight size={19} strokeWidth={2.2} />
                    </span>
                ) : (
                    <LockKeyhole
                        className="h-5 w-5 shrink-0 text-white/30"
                        strokeWidth={1.8}
                    />
                )}
            </span>
        </>
    );

    if (!open) {
        return (
            <article className="flex min-h-[280px] flex-col rounded-xl bg-[#1d1b18] p-6 opacity-70 sm:p-7">
                {content}
            </article>
        );
    }

    return (
        <a
            href={`/join/${position.id}`}
            className="group flex min-h-[280px] flex-col rounded-xl border-2 border-transparent bg-[#211f1b] p-6 outline-none transition-[border-color,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#d9b86e] hover:bg-[#27231d] focus-visible:border-[#d9b86e] sm:p-7"
        >
            {content}
        </a>
    );
}

export function JoinPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#171614] pt-[88px] text-white sm:pt-[94px]">
                <section className="px-4 pb-16 sm:px-8 sm:pb-20 lg:px-[60px]">
                    <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
                        <header className="max-w-4xl">
                            <span className="font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9b86e]">
                                Join Brassworks
                            </span>
                            <h1 className="mt-5 max-w-3xl font-minecraft text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
                                Help us build what comes next.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/64 sm:text-lg">
                                From mods and websites to moderation, media, and
                                builds - pick the area you enjoy and apply in a
                                few minutes, without an account.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <a
                                    href="#positions"
                                    className="group/button relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                                >
                                    <ButtonWipe />
                                    <span className="relative z-10">
                                        View Positions
                                    </span>
                                </a>
                                <a
                                    href={DISCORD_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/button relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#211f1b] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
                                >
                                    <ButtonWipe tone="secondary" />
                                    <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#171614]">
                                        Ask on Discord
                                    </span>
                                    <ArrowUpRight className="relative z-10 h-4 w-4 transition-colors duration-300 group-hover/button:text-[#171614]" />
                                </a>
                            </div>
                        </header>

                        <aside className="rounded-xl bg-[#211f1b] p-6 sm:p-7">
                            <span className="font-minecraft text-[10px] font-bold uppercase tracking-[0.14em] text-[#d9b86e]">
                                Good to know
                            </span>
                            <p className="mt-4 text-sm font-semibold leading-7 text-white/72">
                                All positions at Brassworks are voluntary and
                                unpaid. We do not require fixed shifts or daily
                                activity. What matters is reliable communication
                                and keeping agreed commitments.
                            </p>
                            <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-white/8 pt-5">
                                <div>
                                    <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/38">
                                        Form
                                    </dt>
                                    <dd className="mt-1 font-minecraft text-lg font-bold">
                                        {APPLICATION_DURATION}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/38">
                                        Review
                                    </dt>
                                    <dd className="mt-1 font-minecraft text-lg font-bold">
                                        {REVIEW_TIME}
                                    </dd>
                                </div>
                            </dl>
                        </aside>
                    </div>
                </section>

                <section
                    id="positions"
                    className="px-4 pb-16 sm:px-8 sm:pb-20 lg:px-[60px]"
                >
                    <div className="mx-auto grid max-w-[1600px] gap-12">
                        {joinGroups.map((group) => {
                            const GroupIcon = group.icon;
                            const positions = joinPositions.filter(
                                (position) => position.group === group.id,
                            );

                            return (
                                <div key={group.id}>
                                    <header className="mb-6 flex items-center gap-4">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#211f1b] text-[#d9b86e]">
                                            <GroupIcon
                                                size={20}
                                                strokeWidth={2}
                                            />
                                        </span>
                                        <span>
                                            <h2 className="font-minecraft text-2xl font-bold leading-tight sm:text-3xl">
                                                {group.title}
                                            </h2>
                                            <p className="mt-1 text-sm font-semibold text-white/50">
                                                {group.description}
                                            </p>
                                        </span>
                                    </header>
                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                        {positions.map((position) => (
                                            <PositionCard
                                                key={position.id}
                                                position={position}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="px-4 pb-16 sm:px-8 sm:pb-20 lg:px-[60px]">
                    <div className="mx-auto max-w-[1600px] rounded-xl bg-[#0d0c0b] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
                        <header className="max-w-2xl">
                            <span className="font-minecraft text-[11px] font-bold uppercase tracking-[0.16em] text-[#d9b86e]">
                                How it works
                            </span>
                            <h2 className="mt-4 font-minecraft text-3xl font-bold leading-tight sm:text-4xl">
                                Short, simple, and through Discord.
                            </h2>
                        </header>

                        <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {steps.map((step, index) => (
                                <li
                                    key={step.title}
                                    className="rounded-xl bg-[#1d1b18] p-6"
                                >
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c7a35a] font-minecraft text-sm font-bold text-[#171614]">
                                        {index + 1}
                                    </span>
                                    <h3 className="mt-5 font-minecraft text-lg font-bold">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
                                        {step.description}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className="px-4 pb-20 sm:px-8 sm:pb-24 lg:px-[60px]">
                    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 rounded-xl bg-[#211f1b] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                        <div className="flex items-start gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#171614] text-[#d9b86e]">
                                <Megaphone size={20} strokeWidth={2} />
                            </span>
                            <div>
                                <h2 className="font-minecraft text-lg font-bold">
                                    Looking for support instead?
                                </h2>
                                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/55">
                                    Team members and Administration are not
                                    responsible for regular player support. For
                                    help, reports, and questions, please contact
                                    Moderation on Discord.
                                </p>
                            </div>
                        </div>
                        <a
                            href={DISCORD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/button relative inline-flex min-h-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                        >
                            <ButtonWipe />
                            <span className="relative z-10">Get Support</span>
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
