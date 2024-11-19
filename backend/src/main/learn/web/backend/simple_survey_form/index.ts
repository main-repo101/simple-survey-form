
import express from "express";
import cors from "cors";
import * as MySQL from "mysql2/promise";
import * as DotEnv from "dotenv";
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

APP.get("/", (req, res) => {
    res.status(200).json([
        { 
            "occupation": "student",
            "purpose": ["education", "project", "simple-backend"],
            "subject": "data-mining",
            "implementation-title": "simple-survey-form"
        }
    ])
} );

APP.listen( PORT, ()=> {
    console.log(`Server running at http://localhost:${PORT}`);
});
