import * as MySQL from "mysql2/promise";
import fs from "fs";
import path from "path";
import Path from "@learn/web/backend/simple_survey_form/constant/Path";

// import INIT_SCHEMA_DB from "@main/resource/db/init_schema.sql";

// import init_schema_sql from "@main/resource/dd/init-schema.sql"; //REM: [TODO, WE_NEED_BUNDLER]

export default class SurveyService {
    private pool: MySQL.Pool;

    public constructor(pool: MySQL.Pool) {
        if (!pool) {
            throw new Error("Database pool is not initialized.");
        }
        this.pool = pool;
        this.initializeDatabase();
    }

    //REM: Initialize the database with the schema
    private async initializeDatabase() {
        const SCHEMA_PATH = path.resolve(__dirname, Path.DIR_PRIVATE_RESOURCE + "/db/init_schema.sql");

        //REM: Validate file existence
        if (!fs.existsSync(SCHEMA_PATH)) {
            console.error("Schema file not found:", SCHEMA_PATH);
            return;
        }

        try {
            let schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
            if (!schema) {
                throw new Error("Schema file is empty or invalid.");
            }

            //REM: Execute the schema initialization script securely
            await this.pool.query(schema);

            console.log("Database schema initialized successfully.");
            
        } catch (error) {
            if( error instanceof Error )
                console.error("Error initializing database schema:", error.message);
            else
                console.error("An unknown Error occurred:", error);
        }
    }

    public async createResponse(email: string, answer: string, remarks: string) {
        try {
            //REM: Efficiently check if email already exists
            let [rows] = await this.pool.query<MySQL.RowDataPacket[]>(
                "SELECT COUNT(*) as count FROM survey_responses WHERE email = ?", 
                [email]
            );
            let count: number = (rows as { count: number }[])[0]?.count || 0;
    
            if (count > 0) {
                //REM: Update existing record
                await this.pool.query(
                    "UPDATE survey_responses SET answer = ?, remarks = ? WHERE email = ?", 
                    [answer, remarks, email]
                );
                return;
            }
    
            //REM: Securely insert the survey response
            await this.pool.query(
                "INSERT INTO survey_responses (email, answer, remarks) VALUES (?, ?, ?)", 
                [email, answer, remarks]
            );
            
            console.log("Success creating response.");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error creating or updating survey response:", error.message);
            }
            throw new Error("Failed to submit your response. Please try again later.");
        }
    }
    

    public async getStatistics() {
        try {
            let [rows] = await this.pool.query<MySQL.RowDataPacket[]>(
                "SELECT answer, COUNT(*) as count FROM survey_responses GROUP BY answer"
            );
            let stats: { [key: string]: number } = {};

            (rows as { answer: string; count: number }[] ).forEach((row) => {
                stats[row.answer] = row.count;
            });

            console.log("Success fetching statistics.");

            return stats;
        } catch (error) {
            if(error instanceof Error)
                console.error("Error fetching statistics:", error.message);
            throw new Error("Failed to retrieve statistics. Please try again later.");
        }
    }
}
