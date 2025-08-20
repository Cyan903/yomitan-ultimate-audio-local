# yomitan-ultimate-audio-local

This is a fork of [yomitan-ultimate-audio](https://github.com/friedrich-de/yomitan-ultimate-audio) designed to run on self-hosted setups. All credit goes to the original creator. This repo does not include the assets found in `/data`. You'll have to download them from the original source.

<br />

> [!WARNING]
> Yomitan requires **HTTPS** on domains that are not **localhost**. If you're planning on hosting this using a custom domain, make sure to setup HTTPS. [Here is a simple way to do so](https://www.youtube.com/watch?v=qlcVx-k-02E).

## Prerequisites

You'll need to download the audio, then create the SQLite database. If you've cloned the audio into `/data`, there is a script to do so (`script/create_db`). You can also create the DB manually with:

```sh
sqlite3 data/data.db < data/entry_and_pitch_db.sql # data/data.db is the SQLite database
```

Once finished, make sure `data.db` is in the same location as the audio files. It should look something like:

```text
data
├── daijisen_files/
├── forvo_ext2_files/
├── forvo_ext_files/
├── forvo_files/
├── jpod_files/
├── nhk16_files/
├── ozk5_files/
├── shinmeikai8_files/
├── taas_files/
├── tts_files/
└──data.db
```

## Setup

Bare-metal install:

```sh
cp .env.example .env
vi .env # See configuration

pnpm run build
pnpm start
```

With **Docker**, ensure the volume for `/data` is linked to the audio files. If you're using [Portainer](https://www.portainer.io/), see `docker-compose-portainer.yml`.

```sh
vi docker-compose.yml # Fix volumes
docker compose up -d
```

A Docker image is also available at [Cyan903/yomitan-ultimate-audio-local](https://hub.docker.com/r/cyan903/yomitan-ultimate-audio-local).

## Configuration

The main difference between this fork and the original source is the introduction of `HOST_URL`, `HOST`, and `PORT`.

`HOST` and `PORT` define where the server runs. `HOST_URL` doesn't affect server behavior, it sets the URL returned by the API. For instance, if the server runs on `0.0.0.0` behind a reverse proxy, you'd want `HOST_URL` to reflect the public-facing domain, not `0.0.0.0`.

With `HOST_URL` as `http://localhost:8000`:

```json
{
    "name": "nhk16: ヨ＼ム [1] (Expression+Reading)",
    "url": "http://localhost:8000/audio/get/nhk16/audio/20180221161451.mp3?apiKey=380c4598f457"
}
```

With `HOST_URL` as `https://example.com`:

```json
{
    "name": "nhk16: ヨ＼ム [1] (Expression+Reading)",
    "url": "https://example.com/audio/get/nhk16/audio/20180221161451.mp3?apiKey=380c4598f457"
},
```
