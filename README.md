
## Track your Immich server stats 
### open for suggestions! What do you want to see being tracked?
### Early Release
### Roadmap
- daily/monthly/yearly growth of media
- detailed overview of each user
- color themes


![preview.png](preview.png)

## How to run
Easiest way to run with docker. as a prequestite we need to change add our env vars

1. fill out the .env file with your information. It should look something like this:

    `IMMICH_URL="https://immich.example.com"`

    `IMMICH_API_KEY="SAG32tq21gGSG36GDXwasgdxz@#"`

    `...`


2. run docker and attach your env file with `--env-file`:

    `docker run -d -p 8675:3000 --env-file .env friendlyfriend/immichstat:latest`

