import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

async function checkAdmin() {
    try {
        console.log('🔍 Checking database connection and admin account...');
        await prisma.$connect();
        console.log('✅ Connected to database.');

        const admin = await prisma.user.findFirst({
            where: {
                role: 'admin'
            }
        });

        if (admin) {
            console.log(`✅ Admin found: ${admin.email}`);
        } else {
            console.log('❌ No admin account found in the database.');
        }

        const bookCount = await prisma.book.count();
        console.log(`📚 Found ${bookCount} books in database.`);

    } catch (error) {
        console.error('❌ Database error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
