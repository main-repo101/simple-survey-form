
import express from "express";
import cors from "cors";
import * as MySQL from "mysql2/promise";
import * as DotEnv from "dotenv";
import * as BCrypt from "bcryptjs";
import * as JWT from "jsonwebtoken";
import path from "path";
import {fileURLToPath} from "url";
import Path from "@learn/web/backend/simple_survey_form/constant/Path";
import fs from "fs";
import DateFormatter from "@learn/web/backend/simple_survey_form/util/DateFormatter";
import SurveyService from "@learn/web/backend/simple_survey_form/services/SurveyService";
import SurveyController from "@learn/web/backend/simple_survey_form/SurveyController";

DotEnv.config();

const APP = express();
const PORT = Number(process.env.LEARN_WEB_BACKEND_PORT) || 8009;

const MY_SQL_POOL = MySQL.createPool({
    host: process.env.LEARN_WEB_BACKEND_DB_HOST,
    port: Number(process.env.LEARN_WEB_BACKEND_DB_PORT),
    user: process.env.LEARN_WEB_BACKEND_DB_USERNAME,
    password: process.env.LEARN_WEB_BACKEND_DB_PASSWORD,
    database: process.env.LEARN_WEB_BACKEND_DB_NAME,
    multipleStatements: true,
    timezone: 'Z',
    dateStrings: true,
})

//REM: Other attributes for MySQL2 pooling
// waitForConnections: true,
// connectionLimit: 10,
// queueLimit: 0,

const surveyService = new SurveyService(MY_SQL_POOL);
let surveyController = new SurveyController(surveyService);

APP.use(cors());
APP.use(express.json());


APP.post("/api/submit", surveyController.submitSurvey.bind(surveyController));
APP.get("/api/stats", surveyController.getStats.bind(surveyController));
APP.get("/api/records", surveyController.getRecords.bind(surveyController));
APP.get("/api/header", surveyController.getHeader.bind(surveyController));

APP.get("/", (req, res) => {
    res.status(200).json([
        {
            "occupation": "student",
            "purpose": ["education", "project", "simple-backend"],
            "subject": "data-mining",
            "implementation-title": "simple-survey-form"
        }
    ])
});


const JWT_SECRET = process.env.LEARN_WEB_BACKEND_JWT_SECRET || "your_jwt_secret_key";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

APP.post("/api/login", async (req, res) => {
    const SCHEMA_PATH = await path.resolve(__dirname, Path.DIR_PRIVATE_RESOURCE + "/db/auth_schema.sql");

    try {
        const schema = await fs.readFileSync(SCHEMA_PATH, "utf-8");
        if (!schema) {
            throw new Error(
                `[${new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x")}] 'auth_schema.sql' Schema file is empty or invalid.`
            );
        }

        // Execute the schema initialization script securely
        await MY_SQL_POOL.query(schema);

        console.log(
            "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
            "] users Database table schema initialized successfully."
        );
    } catch (error) {
        console.error(
            "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
            "] Error initializing database schema:",
            error instanceof Error ? error.message : String(error)
        );
        res.status(500).send("Server error");
        return;
    }

    const { username, password } = req.body;

    try {
        const [results] = await MY_SQL_POOL.query<MySQL.RowDataPacket[]>(
            "SELECT * FROM users WHERE username = ?", [username]
        );

        if (results.length === 0) { 
            res.status(401).send("Invalid credentials")
            return;
        };

        const user = results[0];
        const isMatch = await BCrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            res.status(401).send("Invalid credentials");
            return;
        }

        const token = JWT.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

APP.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
