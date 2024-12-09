import * as React from "react";

// import SurveyForm from "@learn/web/frontend/simple_survey_form/component/view/SurveyForm";
import SurveyStatistic from "@learn/web/frontend/simple_survey_form/component/SurveyStatistic";
// import SurveyStatisticII from "@learn/web/frontend/simple_survey_form/component/SurveyStatisticII";
import SurveyForm from "@learn/web/frontend/simple_survey_form/component/SurveyForm";
import ISurveyAppState from "@learn/web/frontend/simple_survey_form/model/ISurveyAppState";
import ISurveyFormState from "@learn/web/frontend/simple_survey_form/model/ISurveyFormState";
import ErrorStat from "./model/error/ErrorStat";
import SurveyRecord from "./component/SurveyRecord";


class SurveyApp extends React.Component<{}, ISurveyAppState> {

    public static readonly API_HOST: string = import.meta.env.LEARN_WEB_FRONTEND_API_HOST ?? "localhost";
    public static readonly API_PORT: string = import.meta.env.LEARN_WEB_FRONTEND_API_PORT ?? "8009";
    private intervalId: NodeJS.Timeout | null = null;

    public constructor(props: {}) {
        super(props);
        this.state = {
            surveyStatisticProps: { data: { "Love Web Programming": 0, "Like Web Programming": 0, "Neutral": 0 } },
            errorMessage: null,
            chartType: "pie"
        };
    }

    public componentDidMount(): void {
        this.fetchStatistics();
        this.startPolling();
    }

    private startPolling(): void {
        //REM: Poll every 3 seconds 3000ms), adjust as needed
        //REM: [TODO, NOT_GOOD_PRACTICE] .|. Fix later...
        this.intervalId = setInterval(() => {
            this.fetchStatistics();
        }, 5500);
    }

    public componentWillUnmount(): void {
        //REM: Clear the polling interval when the component unmounts
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    public componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<ISurveyAppState>, snapshot?: any): void {
        // if( prevState.chartType !== this.state.chartType ) {
        //     this.
        // }
        if (prevState.surveyStatisticProps?.data !== this.state.surveyStatisticProps?.data) {
            this.fetchRecord();
        }
    }

    public fetchRecord = async () => {
        try {
            const RESPONSE = await fetch(`http://${SurveyApp.API_HOST}:${SurveyApp.API_PORT}/api/records`);
            let result = await RESPONSE.json();

            
            const HEADER = await fetch(`http://${SurveyApp.API_HOST}:${SurveyApp.API_PORT}/api/header`);
            let headerResult = await HEADER.json();

            if (RESPONSE.status === 200) {
                this.setState((prev)=>({
                    errorMessage: result.error,
                    surveyStatisticProps: {
                        ...prev.surveyStatisticProps,
                        messageCode: ErrorStat.PULL.CODE
                    },
                    surveyRecordProps: { headers: headerResult, records: result },
                }));
            } else {
                this.setState((prev) => ({
                    errorMessage: result.error,
                    surveyStatisticProps: {
                        ...prev.surveyStatisticProps,
                        messageCode: ErrorStat.PULL.CODE
                    },
                    surveyRecordProps: prev.surveyRecordProps
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
                },
                surveyRecordProps: prev.surveyRecordProps
            }));
            console.error("Error fetching statistics:", error);
        }
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

    // public handleChart( event: React.MouseEvent ) {
    //     event.defaultPrevented;

    //     console.log("<><><<>1", this.state.chartType)
    //     this.setState((prev)=>({
    //         ...prev,
    //         chartType: "bar",
    //     }));

    //     console.log("<><><<>1", this.state.chartType)
    // }

    public render() {
        const COUNT_PARTICIPANT: number = Object.values(this.state.surveyStatisticProps?.data ?? []).reduce((sum, val) => sum + (val as number), 0);
        return (<>
            <div className=" flex flex-col">
                {this.state.errorMessage
                    ? <div className={`text-[2rem] p-6 bg-red-500 text-white font-semibold`}>Connection Lost</div>
                    : <div className={`bg-lime-400 h-6`}></div>
                }
                <div className="h-3/4 flex flex-col gap-10 lg:gap-0 lg:flex-row">
                    {/* <button className="" onClick={e=>this.handleChart(e)}>
                        click me to become a BAR
                    </button> */}
                    <div id="pnl-form" className={`flex flex-col lg:w-1/2 p-4`}>
                        <div className="title font-bold text-orange-500 text-[2rem]">
                            <h1>
                                Simple Survey Statistic ~ DX - Developer Experience, &nbsp;
                                <span id={`pnl-population`} className={`text-lime-500 text-outline`}>
                                    Participant(s): <span>{COUNT_PARTICIPANT}</span>
                                </span>
                            </h1>
                        </div>
                        <div className={`flex flex-col gap-10`}>
                            <div className="">
                                <SurveyForm onSubmit={e => this.handleSubmit(e)} message={this.state.errorMessage || undefined} messageCode={this.state.surveyStatisticProps?.messageCode ?? 0} />
                            </div>
                            <div className="">
                                <SurveyStatistic indexAxis={'y'} isLegendDisplay={false} chartType={"bar"} data={this.state.surveyStatisticProps?.data ?? {}} />
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 p-4 h-[45rem]">
                        <SurveyStatistic isPercentage={true} chartType={this.state.chartType} data={this.state.surveyStatisticProps?.data ?? {}} />
                    </div>
                </div>
                <SurveyRecord headers={this.state.surveyRecordProps?.headers??[]} records={this.state.surveyRecordProps?.records??[]}/>
            </div>
        </>);
    }
}

export default SurveyApp;
