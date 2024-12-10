import * as React from "react";

import ISurveyFormState from "@learn/web/frontend/simple_survey_form/model/ISurveyFormState";
import ISurveyFormProps from "@learn/web/frontend/simple_survey_form/model/ISurveyFormProps";
import ErrorStat from "@learn/web/frontend/simple_survey_form//model/error/ErrorStat";
import CheckboxSurvey from "./CheckboxSurvey";
import RadioboxSurvey from "./RadioboxSurvey";
// import CheckboxSurvey from "./CheckboxSurvey";

class SurveyForm extends React.Component<ISurveyFormProps, ISurveyFormState> {
    private validAnswers = ["Love Web Programming", "Like Web Programming", "Neutral"];
    public static defaultProps: ISurveyFormProps = {
        formData: { email: "", answer: "", remarks: "", likedProgrammingLanguage: [] },
        onSubmit: () => { },
        message: ErrorStat.NONE.DESCRIPTION,
        messageCode: ErrorStat.NONE.CODE
    }
    public constructor(props: ISurveyFormProps) {
        super(props);
        this.state = {
            surveyFormProps: props
        };
    }

    private handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // this.setState({ [name]: value } as Pick<SurveyFormState, keyof SurveyFormState>);
        this.setState((prevState) => {
            if (!prevState.surveyFormProps?.formData || !(name in prevState.surveyFormProps.formData)) {
                console.error("surveyFormProps or formData is undefined");
                return null;
            }
            return {
                surveyFormProps: {
                    ...prevState.surveyFormProps,
                    formData: {
                        ...prevState.surveyFormProps.formData,
                        [name]: value,
                    },
                    message: "hadling input.",
                    messageCode: ErrorStat.NONE.CODE
                },
            };
        });
    };

    public handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { email, answer } = this.state.surveyFormProps?.formData ?? {};

        if (!(email && email.length > 0)) {
            this.setState((prevState) => ({
                surveyFormProps: {
                    ...prevState.surveyFormProps,
                    message: "Invalid email. Unknown email address.",
                    messageCode: ErrorStat.EMAIL.CODE
                },
            }));
            return;
        }
        else if (
            !this.validAnswers.includes(answer ?? "")
        ) {
            this.setState((prevState) => ({
                surveyFormProps: {
                    ...prevState.surveyFormProps,
                    message: "Invalid response. Unknown Response/Answer.",
                    messageCode: ErrorStat.RESPONSE.CODE
                },
            }));
            return;
        }
        else {
            this.setState((prevState) => ({
                surveyFormProps: {
                    ...prevState.surveyFormProps,
                    message: "Success Form, waiting for pushing and pulling backend.",
                    messageCode: ErrorStat.NONE.CODE
                },
            }));
            this.props.onSubmit?.(this.state);
        }
        this.setState((prev) => ({
            surveyFormProps: {
                ...prev.surveyFormProps,
                formData: {
                    email: "", answer: "", remarks: "",
                    likedProgrammingLanguage: []
                }
            }
        }));
        // this.handleCheckboxSelection([""]);
    };


    handleCheckboxSelection = (selectedChoices: string[]) => {
        this.setState((prev) => ({
            ...prev,
            surveyFormProps: {
                ...prev.surveyFormProps,
                formData: {
                    email: prev.surveyFormProps?.formData?.email ?? "",
                    answer: prev.surveyFormProps?.formData?.answer ?? "",
                    remarks: prev.surveyFormProps?.formData?.remarks ?? "",
                    likedProgrammingLanguage: selectedChoices,
                }
            }
        }));
    };



    public render() {
        const { surveyFormProps } = this.state;
        const ERROR_CODE = this.props.messageCode ?? ErrorStat.NONE.CODE;
        // const { messageCode } = this.props;

        return (
            <form onSubmit={this.handleSubmit} className="p-4">
                <div className="mb-4">
                    <label className="block font-bold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={surveyFormProps?.formData?.email}
                        onChange={e => this.handleInputChange(e)}
                        className={`border-2 rounded-md w-full p-2 ${(surveyFormProps?.messageCode === ErrorStat.EMAIL.CODE) ? "border-orange-500" : "border-gray-300"}`}
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-2">How do you feel about web programming?</label>
                    <select
                        name="answer"
                        value={surveyFormProps?.formData?.answer}
                        onChange={this.handleInputChange}
                        className={`border-2 rounded-md w-full p-2 ${(surveyFormProps?.messageCode === ErrorStat.RESPONSE.CODE) ? "border-orange-500" : "border-gray-300"}`}
                    >
                        <option value="">Select an answer</option>
                        {this.validAnswers.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
                <CheckboxSurvey
                    question="Which of these programming languages do you like?"
                    choices={["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "Others"]}
                    onSelectionChange={this.handleCheckboxSelection}
                />
                <RadioboxSurvey
                    question="What is your most favorite programming naming convention?"
                    choices={["PascalCase", "camelCase", "snake_case", "Fr33_dOm"]}
                    onSelectionChange={this.handleCheckboxSelection}
                />
                <div className="mb-4">
                    <label className="block font-bold mb-2">Remarks [OPTIONAL]</label>
                    <textarea
                        name="remarks"
                        value={surveyFormProps?.formData?.remarks}
                        onChange={this.handleInputChange}
                        className="border-2 rounded-md w-full p-2"
                        placeholder="Write something to your future self"
                    ></textarea>
                </div>
                {(surveyFormProps?.messageCode != 0) && <div className="text-red-500 mb-4 font-semibold">{surveyFormProps?.message}</div>}
                {/* <button
                    type="submit"
                    className={`bg-blue-500 text-white py-2 px-4 rounded-md 
                     hover:bg-lime-600 hover:scale-105 
                    ${ERROR_CODE !== ErrorStat.NONE.CODE ? 'disabled:bg-gray-300 disabled:cursor-not-allowed' : ''}`}
                    disabled={ERROR_CODE !== ErrorStat.NONE.CODE}
                >
                    Submit
                </button> */}
                <button
                    type="submit"
                    className={`bg-blue-500 text-white py-2 px-4 rounded-md 
                     hover:bg-lime-600 hover:scale-105 
                    }`}
                >
                    Submit
                </button>
            </form>
        );
    }
}

export default SurveyForm;
