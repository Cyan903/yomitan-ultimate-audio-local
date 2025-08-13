import { StatusError } from 'itty-router';
import { get, set } from "../local/files";

export async function fetchAudioDB(source: string, file: string): Promise<Blob> {
    const audio = await get(`${source}_files/${file}`);

    if (!audio || audio == 404) {
        throw new StatusError(404, 'File not found');
    }

    return new Blob([audio], { type: "audio/mpeg" });
}

export async function fetchAudioTTS(tts_identifier: string, env: Env): Promise<Blob | null> {
    const key = `tts_files/${tts_identifier}.mp3`;
    const object = await env.yomitan_audio_r2_bucket.get(key);

    if (!object) {
        return null;
    }

    const mp3file = await object.blob();

    return mp3file;
}

export async function saveAudioTTS(tts_identifier: string, mp3: Blob, env: Env): Promise<boolean> {
    const key = `tts_files/${tts_identifier}.mp3`;
    await env.yomitan_audio_r2_bucket.put(key, mp3);
    return true;
}
