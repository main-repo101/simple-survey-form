import ISurveyStatisticProps from "./ISurveyStatisticProps";
import {ISurveyRecordProps} from "./ISurveyRecordProps";


import ChartType from "@learn/web/frontend/simple_survey_form/model/ChartType";
export interface ISurveyAppState {
    // data: { [key: string]: number };
    surveyStatisticProps?: Readonly<ISurveyStatisticProps>;
    surveyRecordProps?: ISurveyRecordProps;
    errorMessage: string | null;
    chartType: ChartType;
}

export default ISurveyAppState;