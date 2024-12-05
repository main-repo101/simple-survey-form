
import ISurveyFormState from "./ISurveyFormState";


export interface ISurveyFormProps {
    formData?: { email: string, answer: string, remarks: string, likedProgrammingLanguage: string[] };
    onSubmit?: ( surveyFormState: &ISurveyFormState ) => void;
    message?: string;
    messageCode?: number;
}

export default ISurveyFormProps;