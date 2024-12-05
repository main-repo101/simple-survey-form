
export interface CheckboxSurveyProps {
    question: string;
    choices: string[];
    onSelectionChange: (selected: string[]) => void; // Callback to update parent form state
}