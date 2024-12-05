import * as MySQL from "mysql2/promise";
import fs from "fs";
import path from "path";
import Path from "@learn/web/backend/simple_survey_form/constant/Path";
import DateFormatter from "../util/DateFormatter";

// import INIT_SCHEMA_DB from "@main/resource/db/init_schema.sql";

// import init_schema_sql from "@main/resource/dd/init-schema.sql"; //REM: [TODO, WE_NEED_BUNDLER]

export default class SurveyService {
    private pool: MySQL.Pool;
    private readonly ALLOWED_COLUMNS: Array<string> = ["anwswer", "program", "year"]; 
    private readonly ALLOWED_TABLES: Array<string> = ["survey_responses", "survey_responses_vii"];


    public constructor(pool: MySQL.Pool) {
        if (!pool) {
            throw new Error("Database pool is not initialized.");
        }
        this.pool = pool;
        this.initializeDatabase();
    }

    //REM: Initialize the database with the schema
    private async initializeDatabase() {
        const SCHEMA_PATH = path.resolve(__dirname, Path.DIR_PRIVATE_RESOURCE + "/db/init_schema_vii.sql");

        //REM: Validate file existence
        if (!fs.existsSync(SCHEMA_PATH)) {
            console.error(
                "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
                "] Schema file not found:",
                SCHEMA_PATH
            );
            return;
        }

        try {
            let schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
            if (!schema) {
                throw new Error(
                    "[" + new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x") + "] Schema file is empty or invalid."
                );
            }

            //REM: Execute the schema initialization script securely
            await this.pool.query(schema);

            console.log(
                "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
                "] Database table schema initialized successfully."
            );

        } catch (error) {
            console.error(
                "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
                "] Error initializing database schema:",
                (error instanceof Error) ? error.message : String(error)
            );
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
                console.log(
                    "[", new DateFormatter().format("YYYY:dd:MM, hh:mm:ss x"),
                    "] Warning: Responder already exist, response updated.",
                    "Email:", email
                );
                return;
            }

            //REM: Securely insert the survey response
            await this.pool.query(
                "INSERT INTO survey_responses (email, answer, remarks) VALUES (?, ?, ?)",
                [email, answer, remarks]
            );

            console.log(
                "[", new DateFormatter().format("YYYY:dd:MM, hh:mm:ss x"),
                "] Success creating new response.",
                "Email:", email
            );

        } catch (error) {
            console.error(
                "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
                "] Error creating or updating survey response:",
                (error instanceof Error) ? error.message : String(error)
            );
            throw new Error("Failed to submit your response. Please try again later.");
        }
    }


    public async getStatistics(): Promise<{ [key: string]: number }> {
        try {
            let [rows] = await this.pool.query<MySQL.RowDataPacket[]>(
                "SELECT answer, COUNT(*) as count FROM survey_responses GROUP BY answer"
            );
            let stats: { [key: string]: number } = {};

            (rows as { answer: string; count: number }[]).forEach((row) => {
                stats[row.answer] = row.count;
            });

            console.log(
                "[", new DateFormatter().format("YYYY:dd:MM, hh:mm:ss x"),
                "] Success fetching statistics.",
                stats
            );

            return stats;
        } catch (error) {
            console.error(
                "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
                "] Error fetching statistics:",
                (error instanceof Error) ? error.message : String(error)
            );
            throw new Error("Failed to retrieve statistics. Please try again later.");
        }
    }


    public async getStatisticsVII(columnName: string): Promise<{ [key: string]: number }> {
        if (!this.ALLOWED_COLUMNS.includes(columnName))
            throw new Error("Invalid column name.");

        try {
            const [rows] = await this.pool.query<MySQL.RowDataPacket[]>(
                `SELECT ??, COUNT(*) as count FROM survey_responses GROUP BY ??`,
                [columnName, columnName]
            );

            let stats: { [key: string]: number } = {};

            (rows as { [key: string]: any }[]).forEach((row) => {
                stats[row[columnName]] = row.count;
            });

            console.log(
                "[", new DateFormatter().format("YYYY:dd:MM, hh:mm:ss x"),
                "] Success fetching statistics.",
                stats
            );

            return stats;
        } catch (error) {
            console.error(
                "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
                "] Error fetching statistics:",
                (error instanceof Error) ? error.message : String(error)
            );
            throw new Error("Failed to retrieve statistics. Please try again later.");
        }
    }
    public async getHeader(tableName: string): Promise<string[]> {
    
        if (!this.ALLOWED_TABLES.includes(tableName))
            throw new Error("Invalid table name.");
    
        try {
            //REM: Query to fetch column names
            const [rows] = await this.pool.query<MySQL.RowDataPacket[]>(
                `SHOW COLUMNS FROM ??`,
                [tableName]
            );
    
            //REM: Extract column names
            const headers = rows.map((row) => row.Field);
    
            console.log(
                "[", new DateFormatter().format("YYYY:dd:MM, hh:mm:ss x"),
                "] Success fetching headers:",
                // headers
            );
    
            return headers;
        } catch (error) {
            console.error(
                "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
                "] Error fetching headers:",
                (error instanceof Error) ? error.message : String(error)
            );
            throw new Error("Failed to retrieve table headers. Please try again later.");
        }
    }

    public async getRecords(
        tableName: string,
        filters: { [key: string]: any } = {}
    ): Promise<{ [key: string]: any }[]> {
    
        if (!this.ALLOWED_TABLES.includes(tableName))
            throw new Error("Invalid table name.");
    
        try {
            //REM: Build the WHERE clause dynamically based on filters
            const whereClauses: string[] = [];
            const values: any[] = [];
    
            for (const [key, value] of Object.entries(filters)) {
                whereClauses.push(`?? = ?`);
                values.push(key, value);
            }
    
            //REM: Construct the query
            const query = `
                SELECT * FROM ??
                ${whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : ""}
            `;
    
            //REM: Execute the query
            const [rows] = await this.pool.query(query, [tableName, ...values]);
    
            console.log(
                "[", new DateFormatter().format("YYYY:dd:MM, hh:mm:ss x"),
                "] Success fetching records:",
                // rows
            );
    
            return rows as { [key: string]: any }[];
        } catch (error) {
            console.error(
                "[", new DateFormatter().format("YYYY-dd-MM, hh:mm:ss x"),
                "] Error fetching records:",
                (error instanceof Error) ? error.message : String(error)
            );
            throw new Error("Failed to retrieve records. Please try again later.");
        }
    }
    
}
