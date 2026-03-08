import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeTableApiService } from '../../services/time-api-service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export interface Leave {
  id: number;
  day?: number;
  employee: string;
  type: 'EL' | 'CL' | 'UL' | 'HPL' | 'VL' | 'RH' | 'DL';
  fromDate: string;
  toDate: string;
  leaveId: string;
}

@Component({
  selector: 'app-leave-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf, MatSnackBarModule],
  templateUrl: './leave-manager.html',
  styleUrl: './leave-manager.scss',
})
export class LeaveManager implements OnInit {
  allLeaves = signal<Leave[]>([]);
  
  // ngModel properties
  employeeFilterValue = '';
  typeFilterValue = '';
  startDateFilterValue = '';
  endDateFilterValue = '';

  // Filter signals
  employeeFilter = signal<string>('');
  typeFilter = signal<string>('');
  startDateFilter = signal<string>('');
  endDateFilter = signal<string>('');
  hoveredLeaveId = signal<string | null>(null);

  uniqueEmployees = computed(() => {
    return Array.from(new Set(this.allLeaves().map(l => l.employee))).sort();
  });

  // ✅ FIXED: Universal date parser for DD-MM-YYYY and YYYY-MM-DD
  private dateToMs(dateStr: string): number {
    if (!dateStr) return 0;

    // Try DD-MM-YYYY first (your data format: "04-03-2026")
    const ddmmParts = dateStr.split('-');
    if (ddmmParts.length === 3) {
      const day = parseInt(ddmmParts[0], 10);
      const month = parseInt(ddmmParts[1], 10) - 1;
      const year = parseInt(ddmmParts[2], 10);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime()) && date.getDate() === day) {
        return date.getTime();
      }
    }

    // Try YYYY-MM-DD (HTML date input: "2026-02-02")
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }

    return 0;
  }

  filteredLeaves = computed(() => {
    let leaves = this.allLeaves();

    // 1. Employee filter
    if (this.employeeFilter()) {
      leaves = leaves.filter(l => l.employee === this.employeeFilter());
    }

    // 2. Type filter
    if (this.typeFilter()) {
      leaves = leaves.filter(l => l.type === this.typeFilter());
    }

    // 3. Date filter
    const startDate = this.startDateFilter();
    const endDate = this.endDateFilter();
    
    if (startDate || endDate) {
      const filterStartMs = this.dateToMs(startDate);
      const filterEndMs = this.dateToMs(endDate);
      
      leaves = leaves.filter(leave => {
        const leaveStartMs = this.dateToMs(leave.fromDate);
        const leaveEndMs = this.dateToMs(leave.toDate);
        
        // Overlap logic
        return leaveStartMs <= filterEndMs && leaveEndMs >= filterStartMs;
      });
    }

    return leaves;
  });

  ngOnInit() {
    // Default: Previous month 16th to current month 15th
    const now = new Date();
    const prevMonth16 = new Date(now.getFullYear(), now.getMonth() - 1, 17);
    const currentMonth15 = new Date(now.getFullYear(), now.getMonth(), 16);
    
    const startDate = prevMonth16.toISOString().split('T')[0]; // "2026-02-16"
    const endDate = currentMonth15.toISOString().split('T')[0]; // "2026-03-15"
    
    this.startDateFilterValue = startDate;
    this.endDateFilterValue = endDate;
    this.startDateFilter.set(startDate);
    this.endDateFilter.set(endDate);
  }

  constructor(private api: TimeTableApiService) {
    effect(() => {
      const apiData = this.api.leaveManagerData();
      if (apiData && apiData.length > 0) {
        console.log('✅ Loaded', apiData.length, 'leaves');
        console.log('📅 Sample:', apiData[0]);
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

  updateStartDateFilter(value: string) {
    this.startDateFilter.set(value);
  }

  updateEndDateFilter(value: string) {
    this.endDateFilter.set(value);
  }

  getEmployeeDisplayName(empName: string): string {
    return this.uniqueEmployees().includes(empName) ? empName : 'Employee';
  }

  // ✅ FIXED: Correctly displays both input dates and leave dates
  formatDate(dateStr: string): string {
    const ms = this.dateToMs(dateStr);
    if (ms === 0) return dateStr;
    
    const date = new Date(ms);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  clearEmployeeFilter() {
    this.employeeFilterValue = '';
    this.employeeFilter.set('');
  }

  clearTypeFilter() {
    this.typeFilterValue = '';
    this.typeFilter.set('');
  }

  clearStartDateFilter() {
    this.startDateFilterValue = '';
    this.startDateFilter.set('');
  }

  clearEndDateFilter() {
    this.endDateFilterValue = '';
    this.endDateFilter.set('');
  }

  resetFilters() {
    this.employeeFilterValue = '';
    this.typeFilterValue = '';
    this.startDateFilterValue = '';
    this.endDateFilterValue = '';
    this.employeeFilter.set('');
    this.typeFilter.set('');
    this.startDateFilter.set('');
    this.endDateFilter.set('');
  }

  getDays(fromDate: string, toDate: string): number {
    const [fromDay] = fromDate.split('-').map(Number);
    const [toDay] = toDate.split('-').map(Number);
    return toDay - fromDay + 1;
  }

  hoverLeave(leaveId: string | null) {
    this.hoveredLeaveId.set(leaveId);
  }

  deleteLeave(leaveId: string) {
    const leave = this.allLeaves().find(l => l.leaveId === leaveId);
    if (leave && confirm(`Delete ${leave.employee}'s ${leave.type} leave?\nLeave ID: ${leaveId}`)) {
      this.api.deleteEmpLeave(leave).subscribe((res: any) => {
        if (res && res.status) {
          this.api.successToast(res.message, 'Delete Leave');
          this.allLeaves.update(leaves => leaves.filter(l => l.leaveId !== leaveId));
          if (this.hoveredLeaveId() === leaveId) {
            this.hoveredLeaveId.set(null);
          }
        } else {
          this.api.errorToast(res.message || 'Delete failed', 'Error');
        }
      });
    }
  }
}
