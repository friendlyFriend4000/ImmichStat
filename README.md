# ImmichStat



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
-e DATABASE_URL=postgresql://DBusername:DBpassword@[IP]:[PORT]/DBdatabaseName \
friendlyfriend/immichstat:latest

```
------

## FAQ

---
## Contributing

```bash
git clone https://github.com/friendlyFriend4000/ImmichStat
cd ImmichStat
pnpm -i 
# add all necessary envs
pnpm dev run
```

Please explain your pull-request as much as you can.



<!-- LINKS & IMAGES -->
[immich-github-url]: https://github.com/immich-app/immich