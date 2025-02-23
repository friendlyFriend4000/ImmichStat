# ImmichStat



> [!IMPORTANT]
> DO NOT EXPOSE THIS INSTNCE TO THE INTERNET.

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
- external libraries [TODO]


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
