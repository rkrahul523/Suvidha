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

  // 20 DUMMY RECORDS with MIXED leave types for pie chart distribution
  public leaveManagerData = signal<Leave[]>([
    // CL Records (for bar chart)
    // {"id": 2, "employee": "Dr. K.K. Singh", "type": "CL", "fromDate": "04-12-2025", "toDate": "04-12-2025", "day": 0.5, "leaveId": "CL001"},
    // {"id": 2, "employee": "Dr. K.K. Singh", "type": "CL", "fromDate": "20-01-2026", "toDate": "20-01-2026", "day": 0.5, "leaveId": "CL002"},
    // {"id": 3, "employee": "Dr. A. Patel", "type": "CL", "fromDate": "05-12-2025", "toDate": "05-12-2025", "day": 1, "leaveId": "CL003"},
    // {"id": 4, "employee": "Dr. B. Sharma", "type": "CL", "fromDate": "06-12-2025", "toDate": "06-12-2025", "day": 2, "leaveId": "CL004"},
    // {"id": 5, "employee": "Dr. C. Gupta", "type": "CL", "fromDate": "07-12-2025", "toDate": "07-12-2025", "day": 0.5, "leaveId": "CL005"},
    
    // // EL Records (for pie chart)
    // {"id": 6, "employee": "Dr. D. Kumar", "type": "EL", "fromDate": "08-12-2025", "toDate": "10-12-2025", "day": 3, "leaveId": "EL001"},
    // {"id": 7, "employee": "Dr. E. Jain", "type": "EL", "fromDate": "09-12-2025", "toDate": "11-12-2025", "day": 3, "leaveId": "EL002"},
    // {"id": 8, "employee": "Dr. F. Reddy", "type": "EL", "fromDate": "12-12-2025", "toDate": "14-12-2025", "day": 3, "leaveId": "EL003"},
    // {"id": 9, "employee": "Dr. G. Joshi", "type": "EL", "fromDate": "15-12-2025", "toDate": "17-12-2025", "day": 3, "leaveId": "EL004"},
    
    // UL Records (for pie chart)
    // {"id": 10, "employee": "Dr. H. Khan", "type": "UL", "fromDate": "18-12-2025", "toDate": "25-12-2025", "day": 8, "leaveId": "UL001"},
    // {"id": 11, "employee": "Dr. I. Verma", "type": "UL", "fromDate": "26-12-2025", "toDate": "02-01-2026", "day": 8, "leaveId": "UL002"},
    
    // // More CL for bar chart (16 total CL records)
    // {"id": 12, "employee": "Dr. J. Nair", "type": "CL", "fromDate": "19-12-2025", "toDate": "19-12-2025", "day": 1.5, "leaveId": "CL006"},
    // {"id": 13, "employee": "Dr. K. Das", "type": "CL", "fromDate": "20-12-2025", "toDate": "20-12-2025", "day": 2, "leaveId": "CL007"},
    // {"id": 14, "employee": "Dr. L. Rao", "type": "CL", "fromDate": "21-12-2025", "toDate": "21-12-2025", "day": 0.5, "leaveId": "CL008"},
    // {"id": 15, "employee": "Dr. M. Yadav", "type": "CL", "fromDate": "22-12-2025", "toDate": "22-12-2025", "day": 1, "leaveId": "CL009"},
    // {"id": 16, "employee": "Dr. N. Bose", "type": "CL", "fromDate": "23-12-2025", "toDate": "23-12-2025", "day": 2.5, "leaveId": "CL010"},
    // {"id": 17, "employee": "Dr. O. Sethi", "type": "CL", "fromDate": "24-12-2025", "toDate": "24-12-2025", "day": 1, "leaveId": "CL011"},
    // {"id": 18, "employee": "Dr. P. Malhotra", "type": "CL", "fromDate": "25-12-2025", "toDate": "25-12-2025", "day": 1.5, "leaveId": "CL012"},
    // {"id": 19, "employee": "Dr. Q. Mishra", "type": "CL", "fromDate": "27-12-2025", "toDate": "27-12-2025", "day": 2, "leaveId": "CL013"},
    // {"id": 20, "employee": "Dr. R. Agarwal", "type": "CL", "fromDate": "28-12-2025", "toDate": "28-12-2025", "day": 0.5, "leaveId": "CL014"},
    // {"id": 21, "employee": "Dr. S. Kapoor", "type": "CL", "fromDate": "29-12-2025", "toDate": "29-12-2025", "day": 3, "leaveId": "CL015"}
  ]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: TimeTableApiService) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    effect(() => {
      const apiData: any  = this.api.leaveManagerData();
      if (apiData && apiData.length > 0) {
        this.leaveManagerData.set(apiData);
        if (this.isBrowser) {
          this.createCharts();
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.createCharts();
    }
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

  // CL by employee for BAR CHART (unchanged)
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
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${percentage}%`;
              }
            }
          }
        },
      },
    } as ChartConfiguration<'pie'>);

    // BAR CHART: CL by Employee (vertical labels - unchanged)
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
