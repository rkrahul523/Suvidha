import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import Chart, { ChartConfiguration, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './charts.html',
  styleUrl: './charts.scss',
})
export class Charts implements AfterViewInit, OnDestroy {
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;

  private pieChart!: Chart;
  private barChart!: Chart;
  private isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.createCharts();
    }
  }

  createCharts() {
    // Pie Chart
    this.pieChart = new Chart(this.pieChartCanvas.nativeElement, {
      type: 'pie' as ChartType,
      data: {
        labels: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity'],
        datasets: [
          {
            data: [45, 30, 20, 5],
            backgroundColor: ['#e74c3c', '#f39c12', '#27ae60', '#3498db'],
            hoverBackgroundColor: ['#c0392b', '#e67e22', '#229954', '#2980b9'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom' as const,
            labels: {
              padding: 25,
              usePointStyle: true,
              font: { size: 13 },
            },
          },
        },
      },
    } as ChartConfiguration<'pie'>);

    // Bar Chart
    this.barChart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar' as ChartType,
      data: {
        labels: ['Dec 1', 'Dec 8', 'Dec 15', 'Dec 22', 'Dec 26', 'Dec 29'],
        datasets: [
          {
            label: 'Leaves Taken',
            data: [8, 12, 5, 15, 5, 10],
            backgroundColor: 'rgba(52, 152, 219, 0.85)',
            borderColor: '#3498db',
            borderWidth: 2,
            borderRadius: 12,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 12 } },
          },
        },
      },
    } as ChartConfiguration<'bar'>);
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      this.pieChart?.destroy();
      this.barChart?.destroy();
    }
  }
}
