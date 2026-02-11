import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'friendlyfriend/immichstat';

function run(command) {
    console.log(`> ${command}`);
    try {
        return execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Command failed: ${command}`);
        process.exit(1);
    }
}

function getVersion() {
    const pkgPath = join(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    return pkg.version;
}

const type = process.argv[2];
if (!['patch', 'minor'].includes(type)) {
    console.error('Usage: node release.js <patch|minor>');
    process.exit(1);
}

console.log(`🚀 Starting ${type} release...`);

// 1. Increment version
run(`pnpm version ${type} --no-git-tag-version`);

const version = getVersion();
const imageTag = `${REPO}:${version}`;
const latestTag = `${REPO}:latest`;

console.log(`📦 Building Docker image for version ${version}...`);

// 2. Build image
run(`docker build -t ${imageTag} .`);

// 3. Tag as latest
run(`docker tag ${imageTag} ${latestTag}`);

// 4. Push tags
console.log(`⬆️ Pushing images to registry...`);
run(`docker push ${imageTag}`);
run(`docker push ${latestTag}`);

console.log(`✅ Successfully released ${imageTag} and ${latestTag}`);
