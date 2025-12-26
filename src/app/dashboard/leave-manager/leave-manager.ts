import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Leave {
  id: number;
  employee: string;
  type: 'SL' | 'CL' | 'AL';
  fromDate: string;
  toDate: string;
}

@Component({
  selector: 'app-leave-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf],
  templateUrl: './leave-manager.html',
  styleUrl: './leave-manager.scss',
})
export class LeaveManager {
  allLeaves = signal<Leave[]>([
    { id: 1, employee: 'John Doe', type: 'SL', fromDate: '26-12-2025', toDate: '26-12-2025' },
    { id: 2, employee: 'Jane Smith', type: 'CL', fromDate: '28-12-2025', toDate: '30-12-2025' },
    { id: 3, employee: 'Mike Wilson', type: 'AL', fromDate: '15-12-2025', toDate: '20-12-2025' },
    { id: 4, employee: 'Sarah Brown', type: 'SL', fromDate: '05-12-2025', toDate: '05-12-2025' },
    { id: 5, employee: 'David Lee', type: 'CL', fromDate: '31-12-2025', toDate: '31-12-2025' },
    { id: 6, employee: 'Priya Patel', type: 'AL', fromDate: '10-12-2025', toDate: '12-12-2025' },
    { id: 7, employee: 'Raj Kumar', type: 'SL', fromDate: '02-12-2025', toDate: '03-12-2025' },
    { id: 8, employee: 'Alice Johnson', type: 'SL', fromDate: '03-01-2026', toDate: '04-01-2026' },
    { id: 9, employee: 'Bob Chen', type: 'CL', fromDate: '10-01-2026', toDate: '12-01-2026' },
    { id: 10, employee: 'Emma Davis', type: 'AL', fromDate: '18-01-2026', toDate: '25-01-2026' },
    { id: 11, employee: 'Tom Wilson', type: 'SL', fromDate: '07-01-2026', toDate: '07-01-2026' },
    { id: 12, employee: 'Lisa Patel', type: 'CL', fromDate: '28-01-2026', toDate: '31-01-2026' },
    { id: 13, employee: 'Mark Lee', type: 'AL', fromDate: '15-01-2026', toDate: '15-01-2026' }
  ]);

  // Regular properties for ngModel
  employeeFilterValue = '';
  typeFilterValue = '';

  // Signals for reactive filtering
  employeeFilter = signal('');
  typeFilter = signal('');
  hoveredLeaveId = signal<number | null>(null);

  uniqueEmployees = computed(() => {
    return Array.from(new Set(this.allLeaves().map(l => l.employee))).sort();
  });

  filteredLeaves = computed(() => {
    const empFilter = this.employeeFilter();
    const typeFilter = this.typeFilter();
    
    return this.allLeaves().filter(leave => {
      const empMatch = !empFilter || leave.employee === empFilter;
      const typeMatch = !typeFilter || leave.type === typeFilter;
      return empMatch && typeMatch;
    });
  });

  constructor() {
    effect(() => {
      console.log('Filters:', this.employeeFilter(), this.typeFilter());
      console.log('Results:', this.filteredLeaves().length);
    });
  }

  updateEmployeeFilter(value: string) {
    this.employeeFilter.set(value);
  }

  updateTypeFilter(value: string) {
    this.typeFilter.set(value);
  }

  getEmployeeDisplayName(empName: string): string {
    return this.uniqueEmployees().includes(empName) ? empName : 'Employee';
  }

  clearEmployeeFilter() {
    this.employeeFilterValue = '';
    this.employeeFilter.set('');
  }

  clearTypeFilter() {
    this.typeFilterValue = '';
    this.typeFilter.set('');
  }

  resetFilters() {
    this.employeeFilterValue = '';
    this.typeFilterValue = '';
    this.employeeFilter.set('');
    this.typeFilter.set('');
  }

  getDays(fromDate: string, toDate: string): number {
    const [fromDay] = fromDate.split('-').map(Number);
    const [toDay] = toDate.split('-').map(Number);
    return toDay - fromDay + 1;
  }

  hoverLeave(id: number | null) {
    this.hoveredLeaveId.set(id);
  }

  deleteLeave(id: number) {
    const leave = this.allLeaves().find(l => l.id === id);
    if (leave && confirm(`Delete ${leave.employee}'s leave?`)) {
      this.allLeaves.update(leaves => leaves.filter(l => l.id !== id));
      if (this.hoveredLeaveId() === id) {
        this.hoveredLeaveId.set(null);
      }
    }
  }
}



