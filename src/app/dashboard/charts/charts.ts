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
  private chartsInitialized = false;

  public leaveManagerData = signal<Leave[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: TimeTableApiService) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Watch for data changes and update charts
    effect(() => {
      const apiData: any = this.api.leaveManagerData();
      if (apiData && apiData.length > 0) {
        this.leaveManagerData.set(apiData);
        if (this.isBrowser && this.chartsInitialized) {
          this.updateCharts();
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Small delay to ensure DOM is fully ready
      setTimeout(() => {
        this.createCharts();
      }, 0);
    }
  }

  private createCharts() {
    // Destroy existing charts
    this.destroyCharts();

    // PIE CHART: Leave Type Distribution
    const leaveDistribution = this.getLeaveTypeDistribution();
    const totalDays = leaveDistribution.reduce((sum, item) => sum + item.days, 0);
    
    if (this.pieChartCanvas?.nativeElement) {
      this.pieChart = new Chart(this.pieChartCanvas.nativeElement, {
        type: 'pie' as ChartType,
        data: {
          labels: leaveDistribution.map(item => `${item.type} (${item.days.toFixed(1)}d)`),
          datasets: [{
            data: leaveDistribution.map(item => item.days),
            backgroundColor: ['#f39c12', '#e74c3c', '#3498db'],
            hoverBackgroundColor: ['#e67e22', '#c0392b', '#2980b9'],
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
          }
        },
      } as ChartConfiguration<'pie'>);
    }

    // BAR CHART: CL by Employee
    const clByEmployee = this.getCLByEmployee();
    
    if (this.barChartCanvas?.nativeElement) {
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
          indexAxis: 'y',
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

    this.chartsInitialized = true;
  }

  private updateCharts() {
    if (!this.chartsInitialized || !this.isBrowser) return;

    // Update PIE CHART
    if (this.pieChart && this.pieChartCanvas?.nativeElement) {
      const leaveDistribution = this.getLeaveTypeDistribution();
      const totalDays = leaveDistribution.reduce((sum, item) => sum + item.days, 0);
      
      this.pieChart.data.labels = leaveDistribution.map(item => `${item.type} (${item.days.toFixed(1)}d)`);
      this.pieChart.data.datasets[0].data = leaveDistribution.map(item => item.days);
      
      // Update title
      (this.pieChart.options.plugins!.title as any).text = `Leave Type Distribution (Total: ${totalDays.toFixed(1)} days)`;
      
      this.pieChart.update('none');
    }

    // Update BAR CHART
    if (this.barChart && this.barChartCanvas?.nativeElement) {
      const clByEmployee = this.getCLByEmployee();
      this.barChart.data.labels = clByEmployee.map(item => item.employee);
      this.barChart.data.datasets[0].data = clByEmployee.map(item => item.days);
      this.barChart.update('none');
    }
  }

  private getLeaveTypeDistribution(): { type: string; days: number }[] {
    const leaveMap = new Map<string, number>();
    this.leaveManagerData().forEach(leave => {
      leaveMap.set(leave.type, (leaveMap.get(leave.type) || 0) + leave.day);
    });
    return Array.from(leaveMap.entries())
      .map(([type, days]) => ({ type, days }))
      .sort((a, b) => b.days - a.days);
  }

  private getCLByEmployee(): { employee: string; days: number }[] {
    const clLeaves = this.leaveManagerData().filter(leave => {
      // Check type is CL
      if (leave.type !== 'CL') return false;
      
      // Parse DD-MM-YYYY format
      const [day, month, year] = leave.fromDate.split('-').map(Number);
      const fromDate = new Date(year, month - 1, day); // month is 0-indexed
      const toDate = leave.toDate ? 
        (() => {
          const [d, m, y] = leave.toDate.split('-').map(Number);
          return new Date(y, m - 1, d);
        })() : fromDate;
      
      // 2026 range check
      const start2026 = new Date(2026, 0, 1);  // Jan 1, 2026
      const end2026 = new Date(2026, 11, 31);  // Dec 31, 2026
      
      return fromDate >= start2026 && toDate <= end2026;
    });
    
    const employeeMap = new Map<string, number>();
    clLeaves.forEach(leave => {
      employeeMap.set(leave.employee, (employeeMap.get(leave.employee) || 0) + leave.day);
    });
    return Array.from(employeeMap.entries())
      .map(([employee, days]) => ({ employee, days }))
      .sort((a, b) => b.days - a.days);
  }

  private destroyCharts() {
    if (this.pieChart) {
      this.pieChart.destroy();
      this.pieChart = {} as Chart;
    }
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = {} as Chart;
    }
  }

  ngOnDestroy() {
    this.destroyCharts();
  }
}
