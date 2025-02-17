import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { isPlatformBrowser } from '@angular/common';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';

@Component({
  selector: 'homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [ArticleComponent, BreadcrumbsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomepageComponent implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private chartInstance: Chart | null = null;
  private d3Data: { budget: number; title: string }[] = [];

  constructor(private dataService: DataService) {}

  public dataSource = {
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19',
          '#4bc0c0', '#e74c3c', '#9b59b6'
        ],
      }
    ],
    labels: [] as string[]
  };

  ngOnInit(): void {
    this.getBudgetData();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.createChartJS(), 500);
    }
  }

  getBudgetData(): void {
    this.dataService.getBudgetData().subscribe({
      next: (res) => {
        if (res?.myBudget) {
          this.dataSource.datasets[0].data = res.myBudget.map((item: any) => item.budget);
          this.dataSource.labels = res.myBudget.map((item: any) => item.title);
          this.d3Data = res.myBudget;

          if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
              this.createChartJS();
              this.createD3Chart();
            }, 100);
          }
        }
      },
      error: (error) => console.error('Error fetching budget data:', error)
    });
  }

  createChartJS() {
    if (!isPlatformBrowser(this.platformId)) return;

    const canvas = document.getElementById("chartjsChart") as HTMLCanvasElement;
    if (!canvas) {
      console.error("Canvas for Chart.js not found!");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context for Chart.js");
      return;
    }


    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, {
      type: 'pie',
      data: this.dataSource,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    console.log("Chart.js initialized successfully!");
  }

  createD3Chart() {
    if (!isPlatformBrowser(this.platformId)) return;

    const width = 300, height = 300, radius = Math.min(width, height) / 2;

    d3.select("#d3Chart").select("svg").remove();

    const svg = d3.select("#d3Chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(this.d3Data.map(d => d.title))
      .range([
        '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19',
        '#4bc0c0', '#e74c3c', '#9b59b6', '#2ecc71'
      ]);

      const pie = d3.pie<{ budget: number; title: string }>().value(d => d.budget);
    const arc = d3.arc<d3.PieArcDatum<{ budget: number; title: string }>>()
      .innerRadius(0)
      .outerRadius(radius);

    svg.selectAll("path")
      .data(pie(this.d3Data))
      .enter()
      .append("path")
      .attr("d", arc as any)
      .attr("fill", d => color(d.data.title) as string);

      svg.selectAll("text")
      .data(pie(this.d3Data))
      .enter()
      .append("text")
      .text(d => d.data.title)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px");
  }
}
