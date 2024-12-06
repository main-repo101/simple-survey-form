import * as React from "react";
import { CheckboxSurveyProps } from "@learn/web/frontend/simple_survey_form/model/CheckboxSurveyProps";

const CheckboxSurvey: React.FC<CheckboxSurveyProps> = ({
    question,
    choices,
    onSelectionChange,
}) => {
    const [selectedChoices, setSelectedChoices] = React.useState<string[]>([]);

    const handleCheckboxChange = (choice: string) => {
        // const updatedChoices = selectedChoices.includes(choice)
        //     ? selectedChoices.filter((item) => item !== choice)
        //     : [...selectedChoices, choice];

        setSelectedChoices([choice]);
        onSelectionChange([choice]);
    };

    return (
        <div className="mb-4">
            <label className="block font-bold mb-2">{question}</label>
            <div className="flex flex-row flex-wrap">
                {choices.map((choice, index) => (
                    <div className={`pr-[2rem]`}>
                        <label key={index} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value={choice}
                                checked={selectedChoices.includes(choice)}
                                onChange={() => handleCheckboxChange(choice)}
                                className="w-5 h-5 text-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-gray-700">{choice}</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CheckboxSurvey;
