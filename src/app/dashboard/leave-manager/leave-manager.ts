import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeTableApiService } from '../../services/time-api-service';

export interface Leave {
  id: number;
  day?: number;
  employee: string;
  type: 'EL' | 'CL' | 'UL' | 'HPL' | 'VL';
  fromDate: string;
  toDate: string;
  leaveId: string;
}

@Component({
  selector: 'app-leave-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf],
  templateUrl: './leave-manager.html',
  styleUrl: './leave-manager.scss',
})
export class LeaveManager {
  allLeaves = signal<Leave[]>([]);

  // Regular properties for ngModel
  employeeFilterValue = '';
  typeFilterValue = '';

  // Signals for reactive filtering
  employeeFilter = signal('');
  typeFilter = signal('');
  hoveredLeaveId = signal<string | null>(null);  // Changed to string for leaveId

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

  constructor(private api: TimeTableApiService) {
    effect(() => {
      console.log('Filters:', this.employeeFilter(), this.typeFilter());
      console.log('Results:', this.filteredLeaves().length);
    });

    // Fix: Use .set() to assign API data to signal
    effect(() => {
      const apiData = this.api.leaveManagerData();
      if (apiData && apiData.length > 0) {
        this.allLeaves.set(apiData);
      }
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

  hoverLeave(leaveId: string | null) {
    this.hoveredLeaveId.set(leaveId);
  }

  /** Updated deleteLeave using unique leaveId (string) */
  deleteLeave(leaveId: string) {
    const leave = this.allLeaves().find(l => l.leaveId === leaveId);
    if (leave && confirm(`Delete ${leave.employee}'s ${leave.type} leave?\nLeave ID: ${leaveId}`)) {

      this.api.deleteEmpLeave(leave).subscribe((res: any) => {
        if (res && res.status) {
          this.allLeaves.update(leaves => leaves.filter(l => l.leaveId !== leaveId));
          if (this.hoveredLeaveId() === leaveId) {
            this.hoveredLeaveId.set(null);
          }
        }
      })

    }
  }
}
