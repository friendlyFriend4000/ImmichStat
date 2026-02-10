# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

<<<<<<< HEAD
If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:
=======
> [!IMPORTANT]
> DO NOT EXPOSE THIS PROJECT TO THE INTERNET.

> [!WARNING]
> This project is currently in alpha.



## Table of Contents
- [What is ImmichStat?](#what-is-immichstat)
    - [Key features](#key-features)
- [Installation](#installation)
- [FAQ](#faq)
- [Contributing](#contributing)

## What is ImmichStat?
ImmichStat is a way to track detailed statistics about your self-hosted [Immich][immich-github-url] server.

## Key features
- Simple installation and updates via Docker.
- In-depth overview of your photo collection
- extensive breakdown of each user's library [TODO]
- color themes [TODO]


![Screenshot 2025-01-10 034338.png](Screenshot%202025-01-10%20034338.png)
**Screenshot**


------

## Installation

### Docker

```bash 

docker run -d -p 8675:3000 \
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
## FAQ

---
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
export DATABASE_URL=DATABASE_URL=postgres://user:password@host:port/database
>>>>>>> parent of 951e53c (Merge pull request #9 from friendlyFriend4000/main)

```sh
# recreate this project
pnpm dlx sv create --template minimal --types ts --add prettier eslint drizzle="database:postgresql+postgresql:postgres.js+docker:no" tailwindcss="plugins:typography" --install pnpm ImmichStat2
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

<<<<<<< HEAD
# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
=======
<!-- LINKS & IMAGES -->
[immich-github-url]: https://github.com/immich-app/immich
>>>>>>> parent of 951e53c (Merge pull request #9 from friendlyFriend4000/main)
