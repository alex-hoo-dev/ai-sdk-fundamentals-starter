import { z } from "zod";

export const appointmentSchema = z.object({
    title: z.string().describe(
        'The title of the event. Should be the main purpose, concise, without names. Capitalize properly.'
    ),
    startTime: z
        .string()
        .nullable()
        .describe('Appointment start time in HH:MM format (e.g., 14:00 for 2pm).'),
    endTime: z.string().nullable().describe(
        'Appointment end time in HH:MM format. If not specified, assume a 1-hour duration after startTime.'
    ),
    attendees: z.array(z.string()).nullable().describe(
        'List of attendee names. Extract first and last names if available.'
    ),
    location: z.string().nullable(),
    date: z.string().describe(
        `The date of the appointment. Today's date is ${new Date().toISOString().split('T')[0]}. Use YYYY-MM-DD format.`
    ),
});

export type AppointmentDetails = z.infer<typeof appointmentSchema>;