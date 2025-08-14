import { StatusError } from "itty-router";
import { get, put } from "../local/files";

export async function fetchAudioDB(source: string, file: string): Promise<Blob> {
    const audio = await get(`${source}_files/${file}`);

    if (!audio || audio == 404) {
        throw new StatusError(404, "File not found");
    }

    return new Blob([audio], { type: "audio/mpeg" });
}

export async function fetchAudioTTS(tts_identifier: string): Promise<Blob | null> {
    const audio = await get(`tts_files/${tts_identifier}.mp3`);

    if (!audio || audio == 404) {
        return null;
    }

    return new Blob([audio], { type: "audio/mpeg" });
}

export async function saveAudioTTS(tts_identifier: string, mp3: Blob): Promise<boolean> {
    return put(`tts_files/${tts_identifier}.mp3`, mp3);
}
