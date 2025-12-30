import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import Chart, { ChartConfiguration, ChartType } from 'chart.js/auto';
import { TimeTableApiService } from '../../services/time-api-service';

interface Leave {
  id: number;
  employee: string;
  type: string;
  fromDate: string;
  toDate: string;
  day: number;
  leaveId: string;
}

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

  public leaveManagerData = signal<Leave[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: TimeTableApiService) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // FIXED: Update charts when data changes
    effect(() => {
      const apiData: any = this.api.leaveManagerData();
      if (apiData && apiData.length > 0) {
        this.leaveManagerData.set(apiData);
        // Update charts after data change
        if (this.isBrowser) {
          this.updateCharts();
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Initial chart creation with empty data
      this.createCharts();
    }
  }

  // FIXED: Separate method to update existing charts
  private updateCharts() {
    if (!this.pieChart || !this.barChart) {
      this.createCharts();
      return;
    }

    // Update PIE CHART
    const leaveDistribution = this.getLeaveTypeDistribution();
    const totalDays = leaveDistribution.reduce((sum, item) => sum + item.days, 0);
    
    this.pieChart.data.labels = leaveDistribution.map(item => `${item.type} (${item.days.toFixed(1)}d)`);
    this.pieChart.data.datasets[0].data = leaveDistribution.map(item => item.days);
    this.pieChart.options = {
      ...this.pieChart.options,
      plugins: {
        ...this.pieChart.options.plugins,
        title: {
          ...this.pieChart.options.plugins!.title,
          text: `Leave Type Distribution (Total: ${totalDays.toFixed(1)} days)`
        }
      }
    };
    this.pieChart.update('none'); // 'none' prevents animation for smoother updates

    // Update BAR CHART
    const clByEmployee = this.getCLByEmployee();
    this.barChart.data.labels = clByEmployee.map(item => item.employee);
    this.barChart.data.datasets[0].data = clByEmployee.map(item => item.days);
    this.barChart.update('none');
  }

  // NEW: Get leave type distribution for PIE CHART
  private getLeaveTypeDistribution(): { type: string; days: number }[] {
    const leaveMap = new Map<string, number>();
    
    this.leaveManagerData().forEach(leave => {
      leaveMap.set(leave.type, (leaveMap.get(leave.type) || 0) + leave.day);
    });

    return Array.from(leaveMap.entries())
      .map(([type, days]) => ({ type, days }))
      .sort((a, b) => b.days - a.days);
  }

  // CL by employee for BAR CHART
  private getCLByEmployee(): { employee: string; days: number }[] {
    const clLeaves = this.leaveManagerData().filter(leave => leave.type === 'CL');
    const employeeMap = new Map<string, number>();

    clLeaves.forEach(leave => {
      employeeMap.set(leave.employee, (employeeMap.get(leave.employee) || 0) + leave.day);
    });

    return Array.from(employeeMap.entries())
      .map(([employee, days]) => ({ employee, days }))
      .sort((a, b) => b.days - a.days);
  }

  createCharts() {
    // Destroy existing charts first
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();

    // PIE CHART: Leave Type Distribution (CL, EL, UL)
    const leaveDistribution = this.getLeaveTypeDistribution();
    const totalDays = leaveDistribution.reduce((sum, item) => sum + item.days, 0);
    
    this.pieChart = new Chart(this.pieChartCanvas.nativeElement, {
      type: 'pie' as ChartType,
      data: {
        labels: leaveDistribution.map(item => `${item.type} (${item.days.toFixed(1)}d)`),
        datasets: [{
          data: leaveDistribution.map(item => item.days),
          backgroundColor: [
            '#f39c12', // CL - Orange
            '#e74c3c', // EL - Red
            '#3498db', // UL - Blue
          ],
          hoverBackgroundColor: [
            '#e67e22',
            '#c0392b', 
            '#2980b9'
          ],
          borderWidth: 2,
          borderColor: '#fff',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right' as const,
            labels: {
              padding: 20,
              usePointStyle: true,
              font: { size: 12 }
            }
          },
          title: {
            display: true,
            text: `Leave Type Distribution (Total: ${totalDays.toFixed(1)} days)`,
            font: { size: 14, weight: 'bold' }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${percentage}%`;
              }
            }
          }
        },
      },
    } as ChartConfiguration<'pie'>);

    // BAR CHART: CL by Employee
    const clByEmployee = this.getCLByEmployee();
    this.barChart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar' as ChartType,
      data: {
        labels: clByEmployee.map(item => item.employee),
        datasets: [{
          label: 'CL Days',
          data: clByEmployee.map(item => item.days),
          backgroundColor: 'rgba(243, 156, 18, 0.85)',
          borderColor: '#f39c12',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Horizontal bars = vertical labels
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Casual Leave Days by Employee (CL Only)',
            font: { size: 16 }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 4,
            grid: { color: 'rgba(0,0,0,0.1)' },
            ticks: { font: { size: 12 } }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          }
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
