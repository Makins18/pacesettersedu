console.log(">>> Backend process starting...");
import dotenv from "dotenv";
dotenv.config();

console.log(">>> Importing app and DB config...");
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

console.log(">>> Connecting to Database...");
connectDB().then(() => {
    console.log(">>> DB connection attempt finished.");
    app.listen(PORT, () =>
        console.log(`✓ Server running on port ${PORT}`)
    );
}).catch(err => {
    console.error(">>> Fatal startup error:", err);
});
