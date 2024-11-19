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
}