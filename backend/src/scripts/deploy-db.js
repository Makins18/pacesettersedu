import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend root if it exists
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl || dbUrl.startsWith('file:')) {
    console.error('❌ Error: DATABASE_URL is missing or points to a local SQLite file.');
    console.log('Please ensure your .env file has the live Neon/PostgreSQL connection string.');
    process.exit(1);
}

console.log('🚀 Starting Database Deployment...');

try {
    console.log('📦 Pushing Prisma Schema to Remote DB...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    console.log('🌱 Seeding Admin Account...');
    execSync('npm run seed', { stdio: 'inherit' });

    console.log('✅ Database Deployment Successful!');
} catch (error) {
    console.error('❌ Deployment Failed:', error.message);
    process.exit(1);
}
