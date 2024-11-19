import ISurveyStatisticProps from "./ISurveyStatisticProps";

export interface ISurveyAppState {
    // data: { [key: string]: number };
    surveyStatisticProps?: Readonly<ISurveyStatisticProps>;
    errorMessage: string | null;
}

export default ISurveyAppState;