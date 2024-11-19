

import ChartType from "@learn/web/frontend/simple_survey_form/model/ChartType";

export interface ISurveyStatisticProps {
    // data: Readonly<{ [key: string]: number }>;
    data?: Record<string, number> | null | undefined;
    chartType?: ChartType | null | undefined;
    messageCode?: number;
}


export default ISurveyStatisticProps;