import * as React from "react";
import * as ChartJs from "chart.js/auto";

import ChartType from "@learn/web/frontend/simple_survey_form/model/ChartType";
import ISurveyStatisticProps from "@learn/web/frontend/simple_survey_form/model/ISurveyStatisticProps";
import ChartDataLabels from "chartjs-plugin-datalabels";


ChartJs.Chart.register(ChartDataLabels);

class SurveyStatistic extends React.Component<ISurveyStatisticProps, {}> {

  private chartInstance: globalThis.Readonly<ChartJs.Chart<ChartType, number[], string>> | null
    = null;
  private chartRef: globalThis.Readonly<React.RefObject<HTMLCanvasElement>>
    = React.createRef<HTMLCanvasElement>();

  private countParticipant: number;
  public constructor(
    props: { indexAxis: 'x', isLegendDisplay: true, isPercentage: false, chartType?: "pie", data?: undefined }
  ) {
    super(props);
    this.countParticipant = 0;
  }

  public componentDidMount() {
    this.init();
  }

  private init(): void {
    const CTX: CanvasRenderingContext2D | null | undefined
      = this.chartRef.current?.getContext("2d");

    this.chartInstance = this.createChart(
      CTX, this.props.chartType, this.props.data
    );
  }

  public componentWillUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }


  public componentDidUpdate(prevProps: globalThis.Readonly<ISurveyStatisticProps>) {
    // const { data } = this.props;

    if (prevProps.data !== this.props.data && this.chartInstance) {
      // this.chartInstance.data.labels = Object.keys(data);
      // this.chartInstance.data.datasets[0].data = Object.values(data);
      // this.chartInstance.update();
      this.updateChart();
    }
  }


  private createChart(
    ctx: CanvasRenderingContext2D | ChartJs.ChartItem | null | undefined,
    chartType: ChartType | null | undefined = "pie",
    data: globalThis.Readonly<Record<string, number> | null | undefined>
  ): ChartJs.Chart<ChartType, number[], string> | null {

    if (this.chartInstance)
      this.chartInstance.destroy();

    if (!ctx || !chartType) return null;


    // let countParticipant: number = 0;
    // for (const key in data) {
    //   if (Object.prototype.hasOwnProperty.call(data, key)) {
    //     const value: number = data[key];
    //     countParticipant += value;
    //     console.log(countParticipant);
    //   }
    // }

    // const d = data??{};
    // Object.entries(d).forEach(([key, value]) => {
    //   console.log(`${key}: ${value}`);
    //   countParticipant += value as number;
    // });

    const config: ChartJs.ChartConfiguration<ChartType, number[], string> = {
      type: chartType,
      data: {
        labels: Object.keys(data ?? []),
        datasets: [
          {
            indexAxis: this.props.indexAxis ?? 'x',
            data: Object.values(data ?? ""),
            backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
          },
        ],

      },
      options: {
        responsive: true, //REM: Makes the chart resize with its container
        maintainAspectRatio: false, //REM: Allows the chart to stretch to fit its container
        layout: {
          padding: 5, //REM: Adds padding around the chart
        },
        plugins: {
          tooltip: {
            enabled: true, //REM: Show tooltips on hover
            backgroundColor: 'rgba(0,0,0,1)', //REM: Tooltip background color
            titleColor: '#ffffff', //REM: Tooltip title color
            bodyColor: '#cccccc', //REM: Tooltip body text color
            callbacks: {
              label: (tooltipItem) => `Value: ${tooltipItem.raw}`, //REM: Custom label format
            },
          },
          legend: {
            display: this.props.isLegendDisplay, //REM: Show/hide legend
            position: 'top', //REM: Position: 'top', 'left', 'right', 'bottom'
            labels: {
              color: '#000000', //REM: Text color
              font: {
                size: 14, //REM: Font size
              },
            },
            title: {
              display: true,
              text: "DX - Dev Exp",
            },
          },
          datalabels: {
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: 8, //REM: Rounded corners for the label background
            padding: {
              top: 5,
              bottom: 5,
              left: 8,
              right: 8,
            },
            font: {
              size: 25,
              weight: 'bold',
            },
            color: '#000', //REM: Set label color
            formatter: (value: number) => this.props.isPercentage ? (((value / this.countParticipant) * 100).toFixed(2) + "%") : value,
            anchor: 'end',
            align: 'start',
            offset: 25,
          },

        },
      }
    };

    return new ChartJs.Chart(ctx, config);
  }

  public updateChart() {
    if (this.chartInstance) {
      
      const d = this.props.data ?? {};
      this.countParticipant = 0;
      Object.entries(d).forEach(([key, value]) => {
        this.countParticipant += value as number;
      });
      
      this.chartInstance.data.labels = Object.keys(this.props.data ?? []);
      this.chartInstance.data.datasets[0].data = Object.values(this.props.data ?? []);
      this.chartInstance.update();
    }
  }

  public render(): React.ReactElement {
    return <>
      <canvas ref={this.chartRef} />
      {/* <div id={`pnl-population`}>
          <h1>Participants: <span>{this.countParticipant}</span></h1>
        </div> */}
    </>;
  }
}

export default SurveyStatistic;
