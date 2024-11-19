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

  public constructor(
    props: { chartType?: "pie", data?: undefined }
  ) {
    super(props);
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

    const config: ChartJs.ChartConfiguration<ChartType, number[], string> = {
      type: chartType,
      data: {
        labels: Object.keys(data ?? []),
        datasets: [
          {
            data: Object.values(data ?? ""),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
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
            display: true, //REM: Show/hide legend
            position: 'top', //REM: Position: 'top', 'left', 'right', 'bottom'
            labels: {
              color: '#000000', //REM: Text color
              font: {
                size: 14, //REM: Font size
              },
            },
          },
          datalabels: {
            backgroundColor: 'rgba(255,255,255,0.7)', //REM: Label background
            borderRadius: 8, // Rounded corners for the label background
            padding: {
              top: 5,
              bottom: 5,
              left: 8,
              right: 8,
            },
            font: {
              size: 25, //REM: Font size
              weight: 'bold', //REM: Font weight
            },
            color: '#000', //REM: Set label color
            formatter: (value: number) => value, //REM: Format value (e.g., show numbers)
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
      this.chartInstance.data.labels = Object.keys(this.props.data ?? []);
      this.chartInstance.data.datasets[0].data = Object.values(this.props.data ?? "");
      this.chartInstance.update();
    }
  }

  public render(): React.ReactElement {
    return <canvas ref={this.chartRef} />;
  }
}

export default SurveyStatistic;
