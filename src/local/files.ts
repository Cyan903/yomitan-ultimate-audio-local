import { promises as fs } from "fs";
import path from "path";

const PATH = "data";

export async function get(key: string) {
    try {
        const buffer = await fs.readFile(path.join(PATH, key));
        return new Uint8Array(buffer);
    } catch (e: any) {
        return e.code == "ENOENT" ? 404 : false;
    }
}

export async function put(key: string, mp3: Blob) {
    try {
        await fs.writeFile(path.join(PATH, key), Buffer.from(await mp3.arrayBuffer()));
        return true;
    } catch (e: any) {
        return false;
    }
}
