import {Component, OnInit, ViewChild} from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import {ApiService, EnvironmentalData} from "../../api-service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xAxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "environmental-graph",
  templateUrl: "./environmental-graph.component.html",
  imports: [
    ChartComponent,
  ],
  styleUrls: ["./environmental-graph.component.css"]
})
export class EnvironmentalGraphComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: ChartOptions;
  private temperatureHistory: EnvironmentalData[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getEnvironmentalHistory().subscribe(
        (data: EnvironmentalData[]) => {
          const temperatures = data.map((record: EnvironmentalData):number => record[1]/100);
          const timestamps = data.map((record: EnvironmentalData) => record[3]);
          console.debug("got data from fetch: " +data);
          console.debug("temperatures: " +temperatures);

          this.chartOptions = {
            series: [{ name: "Temperature (°C)", data: temperatures }],
            chart: { height: 350, type: "line", zoom: { enabled: false } },
            dataLabels: { enabled: false },
            stroke: { curve: "smooth" },
            title: { text: "Temperature Trends", align: "left" },
            grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
            xAxis: { categories: timestamps }
          };
          console.debug(this.chartOptions.series);
        },
        error => console.log(error)
    )
  }
}
