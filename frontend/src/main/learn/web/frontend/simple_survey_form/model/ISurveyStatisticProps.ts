

import ChartType from "@learn/web/frontend/simple_survey_form/model/ChartType";

export interface ISurveyStatisticProps {
    indexAxis?: 'y' | 'x',
    isLegendDisplay?: boolean,
    isPercentage?: boolean,
    // data: Readonly<{ [key: string]: number }>;
    data?: Record<string, number> | null | undefined;
    chartType?: ChartType | null | undefined;
    messageCode?: number;
}


export default ISurveyStatisticProps;