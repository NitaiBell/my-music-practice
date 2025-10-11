import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import practiceRoutes from "./routes/practiceRoutes.js";
import teacherStudentRoutes from "./routes/teacherStudentRoutes.js";
import courseProgressRoutes from "./routes/courseProgressRoutes.js";
import articleReadsRoutes from "./routes/articleReadsRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js"; // ✅ NEW

import { pool } from "./db.js";
import {
  createUsersTableIfNotExists,
  createPracticeLogTableIfNotExists,
  createTeacherStudentTableIfNotExists,
  createUserCourseProgressTable,
  createUserArticleReadsTable,
  createOneTimePasswordsTable, // ✅ NEW
} from "./initDb.js";


// 🧩 1. Load correct environment file dynamically
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

console.log(`✅ Loaded ${envFile}`);
console.log(`🌍 NODE_ENV = ${process.env.NODE_ENV}`);
console.log(`💾 DATABASE_URL = ${process.env.DATABASE_URL}`);
console.log(`🚀 PORT = ${process.env.PORT || 5000}`);


// 🧩 2. Initialize Express
const app = express();
const port = process.env.PORT || 5000;


// 🧩 3. Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));


// 🧩 4. Test route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "✅ Server is running!",
      time: result.rows[0],
      env: process.env.NODE_ENV,
    });
  } catch (err) {
    console.error("❌ Database test failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// 🧩 5. API Routes
app.use("/api/users", userRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/teacher-student", teacherStudentRoutes);
app.use("/api/course-progress", courseProgressRoutes);
app.use("/api/article-reads", articleReadsRoutes);
app.use("/api", passwordRoutes); // ✅ NEW route


// 🧩 6. Start server after ensuring DB tables exist (with correct order)
(async () => {
  try {
    console.log("🧱 Initializing database tables...");

    await createUsersTableIfNotExists();            // חייב ראשון
    await createPracticeLogTableIfNotExists();
    await createTeacherStudentTableIfNotExists();
    await createUserCourseProgressTable();          // תלוי ב-users
    await createUserArticleReadsTable();            // תלוי ב-users
    await createOneTimePasswordsTable();

    console.log("✅ All tables initialized successfully!");

    app.listen(port, () => {
      console.log(`✅ Server running on port ${port} (${process.env.NODE_ENV})`);
    });
  } catch (err) {
    console.error("❌ Failed to initialize tables:", err.message);
    process.exit(1);
  }
})();
