"use server";

import { generateText, Output } from "ai";
import { appointmentSchema, type AppointmentDetails } from "./schemas";

export const extractAppointment = async (
    input: string,
): Promise<AppointmentDetails> => {
    console.log(`Extracting from: "${input}"`);

    const { output: appointmentDetails } = await generateText({
        model: "openai/gpt-5-mini",
        prompt: `Extract the appointment details from the following natural language input:\n\n"${input}"`,
        output: Output.object({
            schema: appointmentSchema,
        }),
    });

    console.log("Extracted details:", appointmentDetails);
    return appointmentDetails;
};