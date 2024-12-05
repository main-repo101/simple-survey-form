import { Request, Response } from "express";
import SurveyService from "@learn/web/backend/simple_survey_form/services/SurveyService";

export default class SurveyController {
    private service: SurveyService;

    public constructor(service: SurveyService) {
        this.service = service;
    }

    public async submitSurvey(req: Request, res: Response) {
        let { email, answer, remarks } = req.body;
        try {
            await this.service.createResponse(email, answer, remarks);
            res.status(200).json({ message: "Survey submitted successfully!" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public async getStats(req: Request, res: Response) {
        try {
            const STATS = await this.service.getStatistics();
            res.status(200).json(STATS);
        } catch (error) {
            res.status(500).json({ error: "Internal server error." });
        }
    }

    public async getHeader(req: Request, res: Response) {
        try {
            const STATS = await this.service.getHeader('survey_responses');
            res.status(200).json(STATS);
        } catch (error) {
            res.status(500).json({ error: "Internal server error." });
        }
    }

    public async getRecords(req: Request, res: Response) {
        try {
            const STATS = await this.service.getRecords('survey_responses');
            res.status(200).json(STATS);
        } catch (error) {
            res.status(500).json({ error: "Internal server error." });
        }
    }
    
    public async getStatsVII(req: Request, res: Response) {
        try {
            const STATS = await this.service.getStatisticsVII('survey_responses_vii');
            res.status(200).json(STATS);
        } catch (error) {
            res.status(500).json({ error: "Internal server error." });
        }
    }
    
    public async getHeaderVII(req: Request, res: Response) {
        try {
            const STATS = await this.service.getHeader('survey_responses_vii');
            res.status(200).json(STATS);
        } catch (error) {
            res.status(500).json({ error: "Internal server error." });
        }
    }

    public async getRecordsVII(req: Request, res: Response) {
        try {
            const STATS = await this.service.getRecords('survey_responses_vii');
            res.status(200).json(STATS);
        } catch (error) {
            res.status(500).json({ error: "Internal server error." });
        }
    }
}