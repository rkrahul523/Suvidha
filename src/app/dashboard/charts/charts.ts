import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';
import Chart from 'chart.js/auto';

type ChartOptions = ChartConfiguration['options'];

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [
    provideCharts(withDefaultRegisterables())
  ],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
})
export class Charts {
  pieChartType: ChartType = 'pie';
  barChartType: ChartType = 'bar';

  pieChartData: ChartConfiguration['data'] = {
    labels: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity'],
    datasets: [{ 
      data: [45, 30, 20, 5], 
      backgroundColor: ['#e74c3c', '#f39c12', '#27ae60', '#3498db'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  barChartData: ChartConfiguration['data'] = {
    labels: ['Dec 1', 'Dec 8', 'Dec 15', 'Dec 22', 'Dec 26', 'Dec 29'],
    datasets: [{ 
      data: [8, 12, 5, 15, 5, 10], 
      label: 'Leaves',
      backgroundColor: 'rgba(52, 152, 219, 0.8)',
      borderColor: '#3498db',
      borderRadius: 12,
      borderSkipped: false
    }]
  };

  pieChartOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { padding: 20 } } }
  };
  barChartOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } } }
  };
}
