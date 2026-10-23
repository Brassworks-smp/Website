import { ArrowLeft, Check, LockKeyhole } from "lucide-react";
import { ButtonWipe } from "../general/ButtonWipe";
import { Footer } from "../general/Footer";
import { Header } from "../general/Header";
import { ApplicationForm } from "./ApplicationForm";
import {
    APPLICATION_DURATION,
    DISCORD_URL,
    type JoinPosition,
    REVIEW_TIME,
} from "./join-config";

function DetailList({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <h2 className="font-minecraft text-[10px] font-bold uppercase tracking-[0.14em] text-[#d9b86e]">
                {title}
            </h2>
            <ul className="mt-3 grid gap-2.5">
                {items.map((item) => (
                    <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm font-semibold leading-6 text-white/68"
                    >
                        <Check
                            className="mt-1 h-4 w-4 shrink-0 text-[#d9b86e]"
                            strokeWidth={2.4}
                        />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function ApplicationPage({ position }: { position: JoinPosition }) {
    const Icon = position.icon;
    const open = position.status === "open";

    return (
        <>
            <Header />
            <main className="min-h-screen bg-[#171614] px-4 pb-20 pt-[88px] text-white sm:px-8 sm:pb-24 sm:pt-[94px] lg:px-[60px]">
                <div className="mx-auto max-w-[1600px]">
                    <a
                        href="/join"
                        className="inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-white/65 transition-colors hover:text-[#d9b86e]"
                    >
                        <ArrowLeft size={16} /> All positions
                    </a>

                    <header className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-start gap-5">
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#211f1b] text-[#d9b86e]">
                                <Icon size={26} strokeWidth={2} />
                            </span>
                            <div className="flex min-h-14 min-w-0 flex-col justify-between">
                                <span className="font-minecraft text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[#d9b86e] [text-box:trim-both_cap_alphabetic]">
                                    Application · {position.rank}
                                </span>
                                <h1 className="font-minecraft text-[28px] font-bold leading-none [text-box:trim-both_cap_alphabetic] sm:text-[34px]">
                                    {position.title}
                                </h1>
                            </div>
                        </div>
                        <span
                            className={`w-fit rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
                                open
                                    ? "bg-[#c7a35a] text-[#171614]"
                                    : "bg-white/6 text-white/45"
                            }`}
                        >
                            {open ? "Accepting applications" : "Closed"}
                        </span>
                    </header>

                    <div className="mt-10 grid gap-4 xl:grid-cols-[400px_minmax(0,1fr)] xl:items-start">
                        <aside className="grid gap-8 rounded-xl bg-[#1d1b18] p-6 sm:p-8 xl:sticky xl:top-[84px]">
                            <p className="text-sm font-semibold leading-7 text-white/72 sm:text-base">
                                {position.description}
                            </p>
                            <DetailList
                                title="What you will do"
                                items={position.tasks}
                            />
                            <DetailList
                                title="What you need"
                                items={position.requirements}
                            />
                            <DetailList
                                title="Nice to have"
                                items={position.optional}
                            />
                            <dl className="grid grid-cols-2 gap-4 border-t border-white/8 pt-6">
                                <div className="col-span-2">
                                    <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/38">
                                        Responsible
                                    </dt>
                                    <dd className="mt-1 text-sm font-bold text-white/85">
                                        {position.responsible}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/38">
                                        Form
                                    </dt>
                                    <dd className="mt-1 font-minecraft text-base font-bold">
                                        {APPLICATION_DURATION}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/38">
                                        Review
                                    </dt>
                                    <dd className="mt-1 font-minecraft text-base font-bold">
                                        {REVIEW_TIME}
                                    </dd>
                                </div>
                            </dl>
                            <p className="rounded-lg bg-[#171614] px-4 py-4 text-xs font-semibold leading-6 text-white/55">
                                All positions at Brassworks are voluntary and
                                unpaid. We do not require fixed shifts or daily
                                activity. What matters is reliable communication
                                and keeping agreed commitments.
                            </p>
                        </aside>

                        {open ? (
                            <ApplicationForm position={position} />
                        ) : (
                            <section className="flex flex-col items-start rounded-xl bg-[#211f1b] p-6 sm:p-9">
                                <LockKeyhole
                                    className="h-10 w-10 text-white/40"
                                    strokeWidth={1.6}
                                />
                                <h2 className="mt-6 font-minecraft text-2xl font-bold">
                                    Applications are currently closed
                                </h2>
                                <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-white/58">
                                    We are not looking for new members in this
                                    area right now. Keep an eye on Discord for
                                    updates.
                                </p>
                                <a
                                    href={DISCORD_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/button relative mt-8 inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg bg-[#c7a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614]"
                                >
                                    <ButtonWipe />
                                    <span className="relative z-10">
                                        Join our Discord
                                    </span>
                                </a>
                            </section>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
