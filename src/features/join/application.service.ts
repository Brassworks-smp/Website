import type { ApplicationAnswers } from "../../components/join/application-forms";

export type ApplicationPayload = {
    positionId: string;
    formVersion: number;
    answers: ApplicationAnswers;
};

export type ApplicationResult = {
    applicationId: string;
};

export async function submitApplication(
    payload: ApplicationPayload,
): Promise<ApplicationResult> {
    if (!import.meta.env.DEV) {
        throw new Error("Applications cannot be submitted yet.");
    }

    console.info("Application preview", payload);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const number = String(Math.floor(Math.random() * 10_000)).padStart(4, "0");

    return {
        applicationId: `BW-${new Date().getFullYear()}-${number}`,
    };
}
