# ImmichStat

> [!WARNING]
> ### BREAKING CHANGES IN 1.0.0
>
> - **`.env` Formatting**: Do not use double quotes (`""`) for values in your `.env` file.
> - **`IMMICH_URL` Update**: The URL must now include the `/api` suffix.
>   - **Previous**: `IMMICH_URL=http://192.168.178.2:2283`
>   - **Current**: `IMMICH_URL=http://192.168.178.2:2283/api`
>   - *Note: This applies to both HTTP and HTTPS connections.*

> [!IMPORTANT]
> DO NOT EXPOSE THIS INSTANCE TO THE INTERNET.

> [!NOTE]
> ### NEW FEATURES
> - **Mobile Phone Model Tracking**: Track of phones used for your photos. Feel free to open an issue if yours isn't listed.
> - **Heatmap Activity**: Photography activity heatmap to visualize your upload patterns over the last 12 months.
> - **Little Extra**: More miscellaneous info .


## Table of Contents
- [ImmichStat](#immichstat)
  - [Table of Contents](#table-of-contents)
  - [What is ImmichStat?](#what-is-immichstat)
  - [Installation](#installation)
    - [Docker](#docker)
    - [Local](#local)
  - [Contributing](#contributing)
    - [Windows](#windows)
    - [Linux](#linux)

## What is ImmichStat?
ImmichStat is a way to track detailed statistics about your self-hosted [Immich][immich-github-url] server.

**Preview of first page**
![Screenshot1.png](screenshot.png)
![Screenshot2.png](screenshot2.png)
![Screenshot3.png](screenshot3.png)

------

## Installation

### Docker

```bash 

docker run -d -p 3000:3000 \
-e IMMICH_API_KEY=your_key \
-e IMMICH_URL=your_url \
-e DATABASE_URL=DATABASE_URL=postgres://user:password@host:port/database \
friendlyfriend/immichstat:latest

```
------


### Local 
```bash
# Ubuntu 24.04 LTSC

# prerequisites
# nodejs
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
# environment variables
export IMMICH_URL=your_url 
export IMMICH_API_KEY=your_key
export DATABASE_URL=DATABASE_URL=postgres://user:password@host:port/database
export NODE_ENV=production
pnpm build
node build
# access webui from http://localhost:3000
```
Building with dockerfile
```bash
git clone https://github.com/friendlyFriend4000/ImmichStat
cd ImmichStat
# fill out .env.example and rename to .env
 docker build -t immichstat .
 docker run -p 3000:3000 --env-file .env immichstat 
```
## Contributing


### Windows
```bash 
## prerequisites
# Node-js 22.xx

# add IMMICH_URL, IMMICH_API_KEY and DATABASE_URL to your user's 
#environment variables found in windows settings

git clone https://github.com/friendlyFriend4000/ImmichStat
cd ImmichStat
pnpm -i 
pnpm dev run
```

### Linux
```bash
# prerequisites
# nodejs
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
# environment variables
export IMMICH_URL=your_url 
export IMMICH_API_KEY=your_key
export DATABASE_URL=postgres://user:password@host:port/database

```
```bash
git clone https://github.com/friendlyFriend4000/ImmichStat
cd ImmichStat
pnpm -i 
pnpm dev run
```

Please explain your pull-request as much as you can.



<!-- LINKS & IMAGES -->
[immich-github-url]: https://github.com/immich-app/immich
