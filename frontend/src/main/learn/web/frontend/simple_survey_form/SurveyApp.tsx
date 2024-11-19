import * as React from "react";

// import SurveyForm from "@learn/web/frontend/simple_survey_form/component/view/SurveyForm";
import SurveyStatistic from "@learn/web/frontend/simple_survey_form/component/SurveyStatistic";
import SurveyForm from "@learn/web/frontend/simple_survey_form/component/SurveyForm";
import ISurveyAppState from "@learn/web/frontend/simple_survey_form/model/ISurveyAppState";
import ISurveyFormState from "@learn/web/frontend/simple_survey_form/model/ISurveyFormState";
import ErrorStat from "./model/error/ErrorStat";


class SurveyApp extends React.Component<{}, ISurveyAppState> {

    public static readonly API_HOST: string = import.meta.env.LEARN_WEB_FRONTEND_API_HOST ?? "localhost";
    public static readonly API_PORT: string = import.meta.env.LEARN_WEB_FRONTEND_API_PORT ?? "8009";

    public constructor(props: {}) {
        super(props);
        this.state = {
            surveyStatisticProps: { data: { "Love Web Programming": 0, "Like Web Programming": 0, "Neutral": 0 } },
            errorMessage: null,
        };
    }

    public componentDidMount(): void {
        this.fetchStatistics();
    }

    public handleSubmit = async (surveyFormState: ISurveyFormState) => {
        try {
            if (surveyFormState?.surveyFormProps?.messageCode !== ErrorStat.NONE.CODE)
                throw new Error(surveyFormState?.surveyFormProps?.message);

            const RESPONSE = await fetch(`http://${SurveyApp.API_HOST}:${SurveyApp.API_PORT}/api/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(surveyFormState.surveyFormProps?.formData ?? {}),
            });

            let result = await RESPONSE.json();
            if (RESPONSE.status === 400) {
                this.setState({ errorMessage: result.error });
                if (surveyFormState?.surveyFormProps)
                    surveyFormState.surveyFormProps.messageCode = ErrorStat.PUSH.CODE;
            } else {
                this.fetchStatistics();
                // this.setState((prevState) => { 
                //     return {
                //         errorMessage: null,
                //         surveyStatisticProps: { data: {
                //             ...prevState.surveyStatisticProps?.data,
                //             [surveyFormState.surveyFormProps?.formData?.answer??"unknown"]: ( prevState.surveyStatisticProps?.data![surveyFormState.surveyFormProps?.formData?.answer??"unknown"]?? 0 ) + 1,
                //         } },
                //     }; 
                // });
            }
        } catch (error) {
            this.setState((prev) => ({
                errorMessage: (error instanceof Error) ? error.message : String(error),
                surveyStatisticProps: {
                    ...prev.surveyStatisticProps,
                    // message: this.state.errorMessage,
                    message: (error instanceof Error) ? error.message : String(error),
                    messageCode: surveyFormState.surveyFormProps?.messageCode
                }
            }));
            console.error("Error submitting survey:", error);
        }
    };

    private async fetchStatistics() {
        try {
            const RESPONSE = await fetch(`http://${SurveyApp.API_HOST}:${SurveyApp.API_PORT}/api/stats`);
            let result = await RESPONSE.json();

            if (RESPONSE.status === 200) {
                this.setState({
                    surveyStatisticProps: { data: result },
                    errorMessage: null,
                });
            } else {
                this.setState((prev) => ({
                    errorMessage: result.error,
                    surveyStatisticProps: {
                        ...prev.surveyStatisticProps,
                        messageCode: ErrorStat.PULL.CODE
                    }
                }));
            }
        } catch (error) {
            this.setState((prev) => ({
                errorMessage: (error instanceof Error) ? error.message : String(error),
                surveyStatisticProps: {
                    ...prev.surveyStatisticProps,
                    // message: this.state.errorMessage,
                    message: (error instanceof Error) ? error.message : String(error),
                    messageCode: ErrorStat.PULL.CODE
                }
            }));
            console.error("Error fetching statistics:", error);
        }
    }

    public render() {

        return (<>
            {this.state.errorMessage
                ? <div className={`text-[2rem] p-6 bg-red-500 text-white font-semibold`}>Connection Lost</div>
                : <div className={`bg-lime-400 h-6`}></div>
            }
            <div className="min-h-screen flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-4">
                    <SurveyForm onSubmit={e => this.handleSubmit(e)} message={this.state.errorMessage || undefined} messageCode={this.state.surveyStatisticProps?.messageCode ?? 0} />
                </div>
                <div className="lg:w-1/2 p-4">
                    <SurveyStatistic data={this.state.surveyStatisticProps?.data ?? {}} />
                </div>
            </div>
        </>);
    }
}

export default SurveyApp;
