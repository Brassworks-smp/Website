import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { submitApplication } from "../../features/join/application.service";
import { ButtonWipe } from "../general/ButtonWipe";
import {
    type ApplicationAnswers,
    type ApplicationField,
    type ApplicationForm as ApplicationFormDefinition,
    fieldKey,
    getApplicationForm,
    isFieldVisible,
} from "./application-forms";
import { type JoinPosition, REVIEW_TIME } from "./join-config";

const DRAFT_PREFIX = "brassworks-application-draft:";
const DRAFT_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const CONFIRM_KEY = "confirmContact";

type ApplicationDraft = {
    positionId: string;
    formVersion: number;
    answers: ApplicationAnswers;
    updatedAt: string;
};

function isExpired(draft: ApplicationDraft) {
    const updatedAt = new Date(draft.updatedAt).getTime();

    return Number.isNaN(updatedAt) || Date.now() - updatedAt > DRAFT_MAX_AGE;
}

function removeOutdatedDrafts() {
    try {
        for (let index = localStorage.length - 1; index >= 0; index -= 1) {
            const key = localStorage.key(index);

            if (!key?.startsWith(DRAFT_PREFIX)) continue;

            const draft = JSON.parse(
                localStorage.getItem(key) ?? "null",
            ) as ApplicationDraft | null;

            if (!draft || isExpired(draft)) localStorage.removeItem(key);
        }
    } catch {}
}

function readDraft(positionId: string, formVersion: number) {
    try {
        const draft = JSON.parse(
            localStorage.getItem(DRAFT_PREFIX + positionId) ?? "null",
        ) as ApplicationDraft | null;

        if (!draft) return null;

        if (draft.formVersion !== formVersion || isExpired(draft)) {
            localStorage.removeItem(DRAFT_PREFIX + positionId);
            return null;
        }

        return draft;
    } catch {
        return null;
    }
}

function writeDraft(draft: ApplicationDraft) {
    try {
        localStorage.setItem(
            DRAFT_PREFIX + draft.positionId,
            JSON.stringify(draft),
        );
        return true;
    } catch {
        return false;
    }
}

function removeDraft(positionId: string) {
    try {
        localStorage.removeItem(DRAFT_PREFIX + positionId);
    } catch {}
}

function isEmpty(value: ApplicationAnswers[string] | undefined) {
    return Array.isArray(value) ? value.length === 0 : !value?.trim();
}

function validate(
    form: ApplicationFormDefinition,
    answers: ApplicationAnswers,
    confirmed: boolean,
) {
    const errors: Record<string, string> = {};

    for (const section of form.sections) {
        for (const field of section.fields) {
            if (!isFieldVisible(field, answers)) continue;

            const key = fieldKey(section, field);
            const value = answers[key];

            if (isEmpty(value)) {
                if (field.required) {
                    errors[key] =
                        field.type === "choices"
                            ? "Choose at least one option."
                            : field.type === "select" || field.type === "radio"
                              ? "Choose an option."
                              : "This field is required.";
                }
                continue;
            }

            if (typeof value !== "string") continue;

            if ("maxLength" in field && value.length > field.maxLength) {
                errors[key] =
                    `Please keep this under ${field.maxLength} characters.`;
            } else if (
                field.type === "text" &&
                field.pattern &&
                !field.pattern.test(value.trim())
            ) {
                errors[key] =
                    field.patternMessage ?? "Please check this field.";
            }
        }
    }

    if (!confirmed) {
        errors[CONFIRM_KEY] = "Please confirm your Discord details.";
    }

    return errors;
}

function collectAnswers(
    form: ApplicationFormDefinition,
    answers: ApplicationAnswers,
) {
    const result: ApplicationAnswers = {};

    for (const section of form.sections) {
        for (const field of section.fields) {
            if (!isFieldVisible(field, answers)) continue;

            const key = fieldKey(section, field);
            const value = answers[key];

            if (isEmpty(value)) continue;

            result[key] = Array.isArray(value) ? value : (value?.trim() ?? "");
        }
    }

    return result;
}

function inputId(key: string) {
    return `application-${key.replace(".", "-")}`;
}

function formatTime(value: Date) {
    return new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(value);
}

function FieldControl({
    field,
    id,
    value,
    error,
    timezones,
    onChange,
}: {
    field: ApplicationField;
    id: string;
    value: ApplicationAnswers[string] | undefined;
    error: string | undefined;
    timezones: string[];
    onChange: (value: ApplicationAnswers[string]) => void;
}) {
    const inputClass = `w-full rounded-lg border-2 bg-[#171614] text-sm font-medium text-white outline-none transition-colors duration-300 placeholder:text-white/28 focus:bg-[#1d1b18] ${
        error
            ? "border-[#d8735f]"
            : "border-transparent focus:border-[#d9b86e]/60"
    }`;
    const describedBy = [
        field.hint ? `${id}-hint` : null,
        error ? `${id}-error` : null,
    ]
        .filter(Boolean)
        .join(" ");

    if (field.type === "textarea") {
        const text = typeof value === "string" ? value : "";

        return (
            <>
                <textarea
                    id={id}
                    value={text}
                    rows={field.rows ?? 4}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy || undefined}
                    onChange={(event) => onChange(event.target.value)}
                    className={`${inputClass} resize-y px-4 py-3 leading-6`}
                />
                <span className="mt-1.5 block text-right text-[11px] font-semibold text-white/30">
                    {text.length} / {field.maxLength}
                </span>
            </>
        );
    }

    if (field.type === "select") {
        return (
            <span className="relative block">
                <select
                    id={id}
                    value={typeof value === "string" ? value : ""}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy || undefined}
                    onChange={(event) => onChange(event.target.value)}
                    className={`${inputClass} h-11 appearance-none pl-4 pr-10`}
                >
                    <option value="" disabled>
                        Select an option
                    </option>
                    {field.options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                    strokeWidth={2}
                />
            </span>
        );
    }

    if (field.type === "radio" || field.type === "choices") {
        const selected = Array.isArray(value)
            ? value
            : typeof value === "string" && value
              ? [value]
              : [];

        return (
            <span
                id={id}
                role={field.type === "radio" ? "radiogroup" : "group"}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy || undefined}
                tabIndex={-1}
                className="flex flex-wrap gap-2 outline-none"
            >
                {field.options.map((option) => {
                    const active = selected.includes(option);

                    return (
                        <label
                            key={option}
                            className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#d9b86e] ${
                                active
                                    ? "bg-[#c7a35a] text-[#171614]"
                                    : "bg-[#171614] text-white/62 hover:text-white"
                            }`}
                        >
                            <input
                                type={
                                    field.type === "radio"
                                        ? "radio"
                                        : "checkbox"
                                }
                                name={id}
                                value={option}
                                checked={active}
                                onChange={() => {
                                    if (field.type === "radio") {
                                        onChange(option);
                                        return;
                                    }

                                    onChange(
                                        active
                                            ? selected.filter(
                                                  (item) => item !== option,
                                              )
                                            : [...selected, option],
                                    );
                                }}
                                className="sr-only"
                            />
                            {active ? (
                                <Check
                                    className="h-3.5 w-3.5"
                                    strokeWidth={3}
                                />
                            ) : null}
                            {option}
                        </label>
                    );
                })}
            </span>
        );
    }

    return (
        <>
            <input
                id={id}
                type="text"
                value={typeof value === "string" ? value : ""}
                maxLength={field.type === "text" ? field.maxLength : 64}
                placeholder={
                    field.type === "text" ? field.placeholder : "Europe/Berlin"
                }
                autoComplete={
                    field.type === "text" ? field.autoComplete : "off"
                }
                inputMode={field.type === "text" ? field.inputMode : undefined}
                list={field.type === "timezone" ? `${id}-options` : undefined}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy || undefined}
                onChange={(event) => onChange(event.target.value)}
                className={`${inputClass} h-11 px-4`}
            />
            {field.type === "timezone" ? (
                <datalist id={`${id}-options`}>
                    {timezones.map((timezone) => (
                        <option key={timezone} value={timezone} />
                    ))}
                </datalist>
            ) : null}
        </>
    );
}

function ApplicationConfirmation({ applicationId }: { applicationId: string }) {
    return (
        <section className="rounded-xl bg-[#211f1b] p-6 sm:p-9">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#c7a35a] text-[#171614]">
                <Check className="h-6 w-6" strokeWidth={2.6} />
            </span>
            <h2 className="mt-6 font-minecraft text-2xl font-bold sm:text-3xl">
                Your application has been submitted
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/65 sm:text-base">
                Thank you for your interest in Brassworks. Applications are
                usually reviewed within {REVIEW_TIME.replace("-", " to ")}.
            </p>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/65 sm:text-base">
                Any questions and our final response will be sent through
                Discord. Please make sure your Discord username and user ID are
                correct and that we are able to contact you.
            </p>
            <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-lg bg-[#171614] px-5 py-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40">
                    Application ID
                </span>
                <code className="font-minecraft text-base font-bold text-[#d9b86e]">
                    {applicationId}
                </code>
            </div>
            <p className="mt-6 text-xs font-semibold leading-6 text-white/45">
                Please avoid asking for updates before the stated review period
                has passed.
            </p>
            <a
                href="/join"
                className="group/button relative mt-8 inline-flex min-h-11 items-center justify-center overflow-hidden rounded-lg bg-[#171614] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
            >
                <ButtonWipe tone="secondary" />
                <span className="relative z-10 transition-colors duration-300 group-hover/button:text-[#171614]">
                    Back to all positions
                </span>
            </a>
        </section>
    );
}

export function ApplicationForm({ position }: { position: JoinPosition }) {
    const form = useMemo(() => getApplicationForm(position.id), [position.id]);
    const [answers, setAnswers] = useState<ApplicationAnswers>({});
    const [confirmed, setConfirmed] = useState(false);
    const [attempted, setAttempted] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [savedAt, setSavedAt] = useState<Date | null>(null);
    const [timezones, setTimezones] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [applicationId, setApplicationId] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);
    const errors = attempted ? validate(form, answers, confirmed) : {};

    useEffect(() => {
        removeOutdatedDrafts();

        const draft = readDraft(position.id, form.version);
        const nextAnswers = draft ? draft.answers : {};

        if (!nextAnswers["about.timezone"]) {
            nextAnswers["about.timezone"] =
                Intl.DateTimeFormat().resolvedOptions().timeZone;
        }

        setAnswers(nextAnswers);
        setSavedAt(draft ? new Date(draft.updatedAt) : null);
        setTimezones(
            typeof Intl.supportedValuesOf === "function"
                ? Intl.supportedValuesOf("timeZone")
                : [],
        );
        setLoaded(true);
    }, [form.version, position.id]);

    useEffect(() => {
        if (!loaded || applicationId) return;

        const timer = setTimeout(() => {
            const updatedAt = new Date();
            const saved = writeDraft({
                positionId: position.id,
                formVersion: form.version,
                answers,
                updatedAt: updatedAt.toISOString(),
            });

            if (saved) setSavedAt(updatedAt);
        }, 400);

        return () => clearTimeout(timer);
    }, [answers, applicationId, form.version, loaded, position.id]);

    const updateAnswer = (key: string, value: ApplicationAnswers[string]) => {
        setAnswers((current) => ({ ...current, [key]: value }));
    };

    const clearDraft = () => {
        removeDraft(position.id);
        setAnswers({
            "about.timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        setConfirmed(false);
        setAttempted(false);
        setSavedAt(null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAttempted(true);
        setSubmitError(null);

        const nextErrors = validate(form, answers, confirmed);
        const firstError = Object.keys(nextErrors)[0];

        if (firstError) {
            const element = document.getElementById(inputId(firstError));

            element?.scrollIntoView({ behavior: "smooth", block: "center" });
            element?.focus({ preventScroll: true });
            return;
        }

        setSubmitting(true);

        try {
            const result = await submitApplication({
                positionId: position.id,
                formVersion: form.version,
                answers: collectAnswers(form, answers),
            });

            removeDraft(position.id);
            setApplicationId(result.applicationId);
            formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Your application could not be submitted. Please try again later.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (applicationId) {
        return <ApplicationConfirmation applicationId={applicationId} />;
    }

    return (
        <form
            ref={formRef}
            noValidate
            onSubmit={(event) => void handleSubmit(event)}
            className="grid gap-4"
        >
            {form.sections.map((section) => (
                <section
                    key={section.id}
                    className="rounded-xl bg-[#211f1b] p-6 sm:p-8"
                >
                    <h2 className="font-minecraft text-xl font-bold sm:text-2xl">
                        {section.title}
                    </h2>
                    {section.description ? (
                        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/55">
                            {section.description}
                        </p>
                    ) : null}

                    <div className="mt-6 grid gap-6">
                        {section.fields.map((field) => {
                            if (!isFieldVisible(field, answers)) return null;

                            const key = fieldKey(section, field);
                            const id = inputId(key);
                            const error = errors[key];
                            const grouped =
                                field.type === "radio" ||
                                field.type === "choices";

                            return (
                                <div key={key}>
                                    {grouped ? (
                                        <span className="block text-sm font-semibold leading-6 text-white/85">
                                            {field.label}
                                            {field.required ? (
                                                <span className="text-[#d9b86e]">
                                                    {" "}
                                                    *
                                                </span>
                                            ) : null}
                                        </span>
                                    ) : (
                                        <label
                                            htmlFor={id}
                                            className="block text-sm font-semibold leading-6 text-white/85"
                                        >
                                            {field.label}
                                            {field.required ? (
                                                <span className="text-[#d9b86e]">
                                                    {" "}
                                                    *
                                                </span>
                                            ) : null}
                                        </label>
                                    )}
                                    {field.hint ? (
                                        <span
                                            id={`${id}-hint`}
                                            className="mt-0.5 block text-xs font-medium leading-5 text-white/42"
                                        >
                                            {field.hint}
                                        </span>
                                    ) : null}
                                    <div className="mt-2.5">
                                        <FieldControl
                                            field={field}
                                            id={id}
                                            value={answers[key]}
                                            error={error}
                                            timezones={timezones}
                                            onChange={(value) =>
                                                updateAnswer(key, value)
                                            }
                                        />
                                    </div>
                                    {error ? (
                                        <span
                                            id={`${id}-error`}
                                            className="mt-2 block text-xs font-semibold text-[#e8917d]"
                                        >
                                            {error}
                                        </span>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </section>
            ))}

            <section className="rounded-xl bg-[#0d0c0b] p-6 sm:p-8">
                <label
                    htmlFor={inputId(CONFIRM_KEY)}
                    className="flex cursor-pointer items-start gap-3"
                >
                    <input
                        id={inputId(CONFIRM_KEY)}
                        type="checkbox"
                        checked={confirmed}
                        onChange={(event) => setConfirmed(event.target.checked)}
                        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#c7a35a]"
                    />
                    <span className="text-sm font-semibold leading-6 text-white/75">
                        I have checked my Discord username and user ID. I
                        understand that all positions at Brassworks are
                        voluntary and unpaid.
                    </span>
                </label>
                {errors[CONFIRM_KEY] ? (
                    <span className="mt-2 block pl-8 text-xs font-semibold text-[#e8917d]">
                        {errors[CONFIRM_KEY]}
                    </span>
                ) : null}

                {submitError ? (
                    <p className="mt-6 rounded-lg bg-[#d8735f]/12 px-4 py-3 text-sm font-semibold text-[#e8917d]">
                        {submitError}
                    </p>
                ) : null}

                <div className="mt-6 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-semibold leading-5 text-white/42">
                        {savedAt
                            ? `Draft saved on this device at ${formatTime(savedAt)}.`
                            : "Your draft is saved on this device only."}{" "}
                        <button
                            type="button"
                            onClick={clearDraft}
                            className="font-bold text-white/62 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white"
                        >
                            Clear draft
                        </button>
                    </span>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="group/button relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#c7a35a] px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#171614] disabled:opacity-70"
                    >
                        <ButtonWipe />
                        {submitting ? (
                            <LoaderCircle className="relative z-10 h-4 w-4 animate-spin" />
                        ) : null}
                        <span className="relative z-10">
                            {submitting ? "Submitting" : "Submit Application"}
                        </span>
                    </button>
                </div>
            </section>
        </form>
    );
}
