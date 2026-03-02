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
  @ViewChild('rhChartCanvas') rhChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('clChartCanvas') clChartCanvas!: ElementRef<HTMLCanvasElement>;

  private rhChart!: Chart;
  private clChart!: Chart;
  private isBrowser = false;
  private chartsInitialized = false;

  public leaveManagerData = signal<Leave[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: TimeTableApiService) {
    this.isBrowser = isPlatformBrowser(this.platformId);

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
      setTimeout(() => {
        this.createCharts();
      }, 0);
    }
  }

  private createCharts() {
    this.destroyCharts();

    // ✅ RH LEAVES BY EMPLOYEE (Count of leaves)
    const rhEmployeeData = this.getLeavesByEmployee('RH');
    
    if (this.rhChartCanvas?.nativeElement) {
      this.rhChart = new Chart(this.rhChartCanvas.nativeElement, {
        type: 'bar' as ChartType,
        data: {
          labels: rhEmployeeData.map(item => item.employee),
          datasets: [{
            label: 'RH Leaves Taken',
            data: rhEmployeeData.map(item => item.leaveCount),
            backgroundColor: 'rgba(155, 89, 182, 0.85)', // Purple for RH
            borderColor: '#9b59b6',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y', // Horizontal bars
          plugins: {
            legend: {
              display: true,
              position: 'top' as const,
              labels: {
                padding: 20,
                usePointStyle: true,
                font: { size: 12, weight: 'bold' },
                boxWidth: 12,
                boxHeight: 12
              }
            },
            title: {
              display: true,
              text: 'Restricted Holiday Leaves by Employee',
              font: { size: 14, weight: 'bold' },
              padding: { bottom: 20 }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 10,
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

    // ✅ CL LEAVES BY EMPLOYEE (Count of leaves)
    const clEmployeeData = this.getLeavesByEmployee('CL');
    
    if (this.clChartCanvas?.nativeElement) {
      this.clChart = new Chart(this.clChartCanvas.nativeElement, {
        type: 'bar' as ChartType,
        data: {
          labels: clEmployeeData.map(item => item.employee),
          datasets: [{
            label: 'CL Leaves Taken',
            data: clEmployeeData.map(item => item.leaveCount),
            backgroundColor: 'rgba(243, 156, 18, 0.85)', // Orange for CL
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
            legend: {
              display: true,
              position: 'top' as const,
              labels: {
                padding: 20,
                usePointStyle: true,
                font: { size: 12, weight: 'bold' },
                boxWidth: 12,
                boxHeight: 12
              }
            },
            title: {
              display: true,
              text: 'Casual Leaves by Employee',
              font: { size: 14, weight: 'bold' },
              padding: { bottom: 20 }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 10,
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

    // Update RH Chart
    if (this.rhChart && this.rhChartCanvas?.nativeElement) {
      const rhEmployeeData = this.getLeavesByEmployee('RH');
      this.rhChart.data.labels = rhEmployeeData.map(item => item.employee);
      this.rhChart.data.datasets[0].data = rhEmployeeData.map(item => item.leaveCount);
      this.rhChart.update('none');
    }

    // Update CL Chart
    if (this.clChart && this.clChartCanvas?.nativeElement) {
      const clEmployeeData = this.getLeavesByEmployee('CL');
      this.clChart.data.labels = clEmployeeData.map(item => item.employee);
      this.clChart.data.datasets[0].data = clEmployeeData.map(item => item.leaveCount);
      this.clChart.update('none');
    }
  }

  // ✅ NEW: Get leave COUNT by employee for specific type
  private getLeavesByEmployee(leaveType: string): { employee: string; leaveCount: number }[] {
    //const filteredLeaves = this.leaveManagerData().filter(leave => leave.type === leaveType);
    const filteredLeaves = this.leaveManagerData().filter(leave => {
      if (leave.type !== 'CL') return false;
      
      const [day, month, year] = leave.fromDate.split('-').map(Number);
      const fromDate = new Date(year, month - 1, day);
      const toDate = leave.toDate ? 
        (() => {
          const [d, m, y] = leave.toDate.split('-').map(Number);
          return new Date(y, m - 1, d);
        })() : fromDate;
      
      const start2026 = new Date(2026, 0, 1);
      const end2026 = new Date(2026, 11, 31);
      
      return fromDate >= start2026 && toDate <= end2026;
    });
    
    
    const employeeMap = new Map<string, number>();
    filteredLeaves.forEach(leave => {
      employeeMap.set(leave.employee, (employeeMap.get(leave.employee) || 0) + 1); // Count leaves
    });

    return Array.from(employeeMap.entries())
      .map(([employee, leaveCount]) => ({ employee, leaveCount }))
      .sort((a, b) => b.leaveCount - a.leaveCount)
      .slice(0, 10); // Top 10 employees
  }

  private destroyCharts() {
    if (this.rhChart) {
      this.rhChart.destroy();
      this.rhChart = {} as Chart;
    }
    if (this.clChart) {
      this.clChart.destroy();
      this.clChart = {} as Chart;
    }
  }

  ngOnDestroy() {
    this.destroyCharts();
  }
}
