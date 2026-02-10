import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import prisma from "../config/db.js";

dotenv.config();

const booksData = [
    {
        title: "PDIE Book 1 — Foundations",
        description: "Introduction to Phonics and Diction-In-English foundations.",
        price: 3500,
        stock: 50,
        category: "Early Years BK1",
        imageUrl: "https://res.cloudinary.com/dy9nvim74/image/upload/v1/pacesetters/books/book1.jpg"
    },
    {
        title: "PDIE Book 2 — Phonemes",
        description: "Mastering phonemes and vowel sounds.",
        price: 3500,
        stock: 50,
        category: "Early Years BK2",
        imageUrl: "https://res.cloudinary.com/dy9nvim74/image/upload/v1/pacesetters/books/book2.jpg"
    },
    {
        title: "PDIE Book 3 — Blends & Digraphs",
        description: "Focusing on consonant blends and digraphs.",
        price: 3500,
        stock: 50,
        category: "Early Years BK3",
        imageUrl: "https://res.cloudinary.com/dy9nvim74/image/upload/v1/pacesetters/books/book3.jpg"
    },
    {
        title: "PDIE Book 4 — Diction Drills",
        description: "Advanced diction drills and pronunciation practice.",
        price: 4000,
        stock: 50,
        category: "Early Years BK4",
        imageUrl: "https://res.cloudinary.com/dy9nvim74/image/upload/v1/pacesetters/books/book4.jpg"
    }
];

const seedData = async () => {
    try {
        await prisma.$connect();

        // Seed Admin
        const existingAdmin = await prisma.user.findUnique({
            where: { email: "pacesetterspdieweb@gmail.com" }
        });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("paceWebsetters.Edu16", 12);
            await prisma.user.create({
                data: {
                    name: "Pacesetters Admin",
                    email: "pacesetterspdieweb@gmail.com",
                    password: hashedPassword,
                    role: "admin"
                }
            });
            console.log("✓ Admin user created!");
        }

        // Seed Books
        const count = await prisma.book.count();
        if (count === 0) {
            await prisma.book.createMany({
                data: booksData
            });
            console.log("✓ Books seeded!");
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedData();
