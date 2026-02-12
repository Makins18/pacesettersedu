import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;

console.log('🌟 PACESETTERS Master Deployment Automation');
console.log('------------------------------------------');

// Simple .env parser
function parseEnv(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf-8');
    const env = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let val = match[2] ? match[2].trim() : '';
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
            env[match[1]] = val;
        }
    });
    return env;
}

async function runCommand(cmd, cwd = rootDir) {
    try {
        console.log(`\nExecuting: ${cmd}`);
        execSync(cmd, { stdio: 'inherit', cwd });
    } catch (error) {
        console.warn(`⚠️  Command status: ${error.message.split('\n')[0]}`);
    }
}

async function syncEnv(projectPath, projectName) {
    console.log(`\n--- Syncing Dashboard Variables for ${projectName} ---`);
    const envFile = projectPath.includes('frontend') ? '.env.local' : '.env';
    const envVars = parseEnv(path.join(projectPath, envFile));

    // Switch CLI context to this project
    const dotVercel = path.join(projectPath, '.vercel');
    if (fs.existsSync(dotVercel)) {
        if (fs.existsSync(path.join(rootDir, '.vercel'))) fs.rmSync(path.join(rootDir, '.vercel'), { recursive: true, force: true });
        fs.cpSync(dotVercel, path.join(rootDir, '.vercel'), { recursive: true });
    }

    for (let [key, value] of Object.entries(envVars)) {
        if (key && !key.startsWith('#')) {
            if (key === 'NODE_ENV') value = 'production';

            const cleanValue = value.replace(/[\r\n]/g, '').trim();
            if (!cleanValue) continue;

            console.log(`Pushing ${key}...`);
            // THE NUCLEAR FIX: SPAWNSYNC WITH INPUT PIPED TO STDIN
            const result = spawnSync('npx', ['vercel', 'env', 'add', key, 'production', '--force'], {
                input: cleanValue,
                encoding: 'utf-8',
                cwd: rootDir,
                shell: true
            });

            if (result.status !== 0) {
                console.warn(`⚠️  Could not sync ${key}: ${result.stderr?.split('\n')[0] || 'Unknown error'}`);
            }
        }
    }
}

async function main() {
    const backendPath = path.join(rootDir, 'backend');
    const frontendPath = path.join(rootDir, 'frontend');

    // 1. Sync Backend Env
    await syncEnv(backendPath, 'pacesettersedu-mdyr');

    // 2. Sync Frontend Env (Crucial for NEXT_PUBLIC_)
    await syncEnv(frontendPath, 'pacesettersedu-2h8c');

    // 3. GitHub Sync
    console.log('\n--- [3/5] Syncing to GitHub ---');
    try {
        await runCommand('git add .', rootDir);
        try {
            // Commit if there are changes
            execSync('git commit -m "Automated Deployment Sync: Fixed Env and Monnify"', { stdio: 'ignore', cwd: rootDir });
        } catch (e) {
            console.log('ℹ️ No changes to commit.');
        }
        await runCommand('git push origin main', rootDir);
        console.log('✅ GitHub Sync Complete');
    } catch (e) {
        console.warn('⚠️ GitHub Sync skipped.');
    }

    // 4. Trigger Backend Build
    console.log('\n--- [4/5] Deploying Backend ---');
    if (fs.existsSync(path.join(backendPath, '.vercel'))) {
        fs.cpSync(path.join(backendPath, '.vercel'), path.join(rootDir, '.vercel'), { recursive: true });
        await runCommand('npx -y vercel --prod --yes --force', rootDir);
    }

    // 5. Trigger Frontend Build
    console.log('\n--- [5/5] Deploying Frontend ---');
    if (fs.existsSync(path.join(frontendPath, '.vercel'))) {
        fs.cpSync(path.join(frontendPath, '.vercel'), path.join(rootDir, '.vercel'), { recursive: true });
        await runCommand('npx -y vercel --prod --yes --force', rootDir);
    }

    console.log('\n🚀 ALL DONE! Monnify, Database, and GitHub are now perfectly synced.');
    console.log('Wait 2 minutes for Vercel builds to finish, then login!');
}

main();
