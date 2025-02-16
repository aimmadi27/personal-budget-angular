import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

@Component({
  selector: 'homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [ArticleComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomepageComponent implements OnInit {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  public dataSource: {
    datasets: { data: number[]; backgroundColor: string[] }[];
    labels: string[];
  } = {
    datasets: [
      {
        data: [], // ✅ Explicitly define as number[]
        backgroundColor: [
          '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19',
          '#4bc0c0', '#e74c3c', '#9b59b6'
        ],
      }
    ],
    labels: [] // ✅ Explicitly define as string[]
  };

  constructor() {}

  ngOnInit(): void {
    this.http.get<{ myBudget: { title: string; budget: number }[] }>('http://localhost:3000/budget')
      .subscribe({
        next: (res) => {
          if (res?.myBudget?.length) {
            this.dataSource.datasets[0].data = res.myBudget.map(item => item.budget);
            this.dataSource.labels = res.myBudget.map(item => item.title);


            if (isPlatformBrowser(this.platformId)) {
              setTimeout(() => this.createChart(), 100);
            }
          } else {
            console.warn('No budget data found in API response.');
          }
        },
        error: (error) => {
          console.error('Error fetching budget data:', error);
        }
      });
  }

  createChart() {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn("Skipping chart creation on server-side rendering.");
      return;
    }

    const canvas = document.getElementById("myChart") as HTMLCanvasElement;
    if (!canvas) {
      console.error("Canvas not found!");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context");
      return;
    }

    new Chart(ctx, {
      type: 'pie',
      data: this.dataSource
    });
  }
}
