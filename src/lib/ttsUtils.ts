import { IRequest, StatusError } from "itty-router";
import { YomitanAudioSource } from "./yomitanResponse";
import { AudioSource } from "./queryUtils";
import { log } from "./logger";
import { generatePronunciationVariants } from "./utils";

export interface PitchDBEntry {
    id: string;
    expression: string;
    reading: string;
    pitch: string;
    count: string;
}

export async function queryPitchDB(term: string, reading: string, env: Env): Promise<PitchDBEntry[]> {
    let baseCondition = "WHERE expression = ?";
    const params: any[] = [term];

    if (reading && reading.trim() !== "") {
        baseCondition = `WHERE (expression = ? AND reading = ?)`;
        params.push(reading);
    }

    const query = `SELECT id, expression, reading, pitch, count FROM pitch_accents ${baseCondition}`;

    try {
        // Build statement
        const res = await env.DB.prepare(query);
        await res.bind([...params]);

        // Sort pitch entries
        const pitch_entries = (await res.all()) as PitchDBEntry[];
        pitch_entries.sort((a, b) => parseInt(b.count) - parseInt(a.count));

        return pitch_entries;
    } catch (e: any) {
        log("error", "query_pitch_db_failed", `Failed to query pitch database for term: ${term}${reading ? ", reading: " + reading : ""}`, {
            term: term,
            reading: reading,
            d1_result: String(e),
        });

        throw new StatusError(500, "Database query failed.");
    }
}

export function createPitchEntryNoDB(term: string, reading: string): PitchDBEntry {
    return {
        id: "Default - No DB",
        expression: term,
        reading: reading,
        pitch: "",
        count: "0",
    } as PitchDBEntry;
}

export async function createAllPossiblePronunciations(term: string, reading: string): Promise<PitchDBEntry[]> {
    const possiblePitches = await generatePronunciationVariants(reading);

    return possiblePitches.map((pitch) => {
        return {
            id: "Forced",
            expression: term,
            reading: reading,
            pitch: pitch,
            count: "0",
        };
    });
}
export async function createTTSEntries(term: string, reading: string, sources: AudioSource[], env: Env, request: IRequest): Promise<YomitanAudioSource[]> {
    if (!env.AWS_POLLY_ENABLED) {
        return [];
    }

    if (sources.includes("all") || sources.includes("tts")) {
        const pitchDBEntries = await queryPitchDB(term, reading, env);
        const existingPitches = new Set(pitchDBEntries.map((entry) => entry.pitch));

        if (pitchDBEntries.length === 0) {
            pitchDBEntries.push(createPitchEntryNoDB(term, reading));
        }

        const allTtsPronunciations = await createAllPossiblePronunciations(term, reading);
        const uniqueTtsPronunciations = allTtsPronunciations.filter((entry) => !existingPitches.has(entry.pitch));
        const finalTtsCollection = [...pitchDBEntries, ...uniqueTtsPronunciations];

        const ttsEntries: YomitanAudioSource[] = finalTtsCollection.map((entry) => {
            const audioUrl = new URL("/audio/tts", env.HOST_URL);

            audioUrl.searchParams.set("term", entry.expression);
            audioUrl.searchParams.set("reading", entry.reading);
            audioUrl.searchParams.set("pitch", entry.pitch);

            if (env.AUTHENTICATION_ENABLED) {
                audioUrl.searchParams.set("apiKey", request.apiKey);
            }

            let name = "TTS";

            if (!isNaN(parseInt(entry.id))) {
                name += ` (${entry.pitch} Pitch DB)`;
            } else if (entry.pitch) {
                name += ` (${entry.pitch} ${entry.id})`;
            } else {
                name += ` (${entry.id})`;
            }

            return {
                name: name,
                url: audioUrl.toString(),
            };
        });

        return ttsEntries;
    } else {
        return [];
    }
}
