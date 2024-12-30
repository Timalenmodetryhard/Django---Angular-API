import { Component, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-graph',
    imports: [CommonModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnChanges {
  @Input() stationId: string | null = null;
  public waterValues: any = null;
  private chart: Chart | null = null;

  constructor(private http: HttpClient) {}

  ngOnChanges(): void {
    if (this.stationId) {
      this.loadGraphData();
    }
  }

  private loadGraphData(): void {
    this.http.get<any>(`https://hubeau.eaufrance.fr/api/v2/hydrometrie/obs_elab?code_entite=${this.stationId}`)
      .subscribe(data => {
        console.log(data)
        const labels = data.data.map((obs: any) => obs.date_obs_elab);
        const values = data.data.map((obs: any) => obs.resultat_obs_elab);
        this.waterValue(values)

        if (this.chart) {
          this.chart.destroy();
        }
        
        this.chart = new Chart('stationGraph', {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Water Level',
              data: values,
              borderColor: 'blue',
              fill: false
            }]
          }
        });
      });
  }
  public waterValue(values: any): void {
    this.waterValues = values;
  }
}
