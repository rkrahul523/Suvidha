// gen-report.component.ts - FULL WORKING CODE
import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { TimeTableApiService } from '../services/time-api-service';
import { Leave } from '../dashboard/leave-manager/leave-manager';
import { employeeListFFT, employeeListDASH, employeeListECE, employeeListMME } from '../model/employee-list';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface Employee {
  name: string;
  designation: string;
  id: number;
}

@Component({
  selector: 'app-gen-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, DatePipe],
  templateUrl: './gen-report.html',
  styleUrl: './gen-report.scss'
})
export class GenReport  implements OnInit{

  /* =========================
     REACTIVE FORM
     ========================= */
  reportForm = new FormGroup({
    startDate: new FormControl<string | null>(null, Validators.required),
    endDate: new FormControl<string | null>(null, Validators.required)
  });

  /* =========================
     GENERATE TRIGGER
     ========================= */
  private generateSignal = signal(0);

  /* =========================
     STATIC DATA
     ========================= */
  leaveTypes = ['EL', 'CL', 'UL', 'HPL', 'VL'] as const;

  employeeListFFT: any = employeeListFFT;

  employeeLeaveData = signal<any[]>([
    {
      id: 1, employee: "Dr. N.K. Singh", type: "UL", fromDate: "11-12-2025",
      toDate: "18-12-2025", day: 8, leaveId: "17668436019491"
    },
    {
      id: 1, employee: "Dr. N.K. Singh", type: "UL", fromDate: "23-01-2026",
      toDate: "30-01-2026", day: 8, leaveId: "17669004769081"
    },
    {
      id: 1, employee: "Dr. N.K. Singh", type: "CL", fromDate: "20-12-2025",
      toDate: "25-12-2025", day: 6, leaveId: "17668440503531"
    },
    {
      id: 2, employee: "Dr. K.K. Singh", type: "EL", fromDate: "11-12-2025",
      toDate: "12-12-2025", day: 2, leaveId: "17668441112552"
    },
    {
      id: 2, employee: "Dr. K.K. Singh", type: "EL", fromDate: "08-01-2026",
      toDate: "16-01-2026", day: 9, leaveId: "17669004459082"
    },
    {
      id: 2, employee: "Dr. K.K. Singh", type: "UL", fromDate: "23-01-2026",
      toDate: "30-01-2026", day: 8, leaveId: "17669004682462"
    },
    {
      id: 2, employee: "Dr. K.K. Singh", type: "CL", fromDate: "04-12-2025",
      toDate: "04-12-2025", day: 0.5, leaveId: "17668440820022"
    },
    {
      id: 2, employee: "Dr. K.K. Singh", type: "CL", fromDate: "20-01-2026",
      toDate: "20-01-2026", day: 0.5, leaveId: "17669019233932"
    }
  ]);

constructor(private api:TimeTableApiService){
  // effect(() => {
  //   const apiData = this.api.leaveManagerData();
  //   if (apiData && apiData.length > 0) {
  //     this.employeeLeaveData.set(apiData);
  //   }
  // });
}

ngOnInit(){
  //this.assignDepartment();
}
  /* =========================
     UTILITIES
     ========================= */
  parseDate(date: string): Date {
    const [d, m, y] = date.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  inclusiveDays(start: Date, end: Date): number {
    return Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  }

  /* =========================
     GENERATE BUTTON HANDLER
     ========================= */
  generateReport(): void {
    if (this.reportForm.invalid) return;
    this.generateSignal.update(v => v + 1);
  }



  assignDepartment() {
    let department = this.api.department;
    switch (department) {
      case 'FFT': this.employeeListFFT = employeeListFFT;
        break;
      case 'DASH': this.employeeListFFT = employeeListDASH;
        break;
      case 'ECE': this.employeeListFFT = employeeListECE;
        break;
      case 'MME': this.employeeListFFT = employeeListMME;
        break;
    }
  }
  /* =========================
     REPORT COMPUTATION
     ========================= */
     reportData = computed(() => {
      this.generateSignal();
      const { startDate, endDate } = this.reportForm.value;
      if (!startDate || !endDate) return [];
    
      const selectedStart = new Date(startDate + 'T00:00:00');  // ✅ Midnight
      const selectedEnd = new Date(endDate + 'T00:00:00');      // ✅ Midnight
    
      return this.employeeListFFT.map((emp: any) => {
        const row: any = { employee: emp.name };
    
        this.leaveTypes.forEach(type => {
          let totalDays = 0;
          const tooltipData: string[] = [];
    
          this.employeeLeaveData().forEach(lv => {
            if (lv.id === emp.id && lv.type === type) {
              const leaveStart = this.parseDate(lv.fromDate);
              const leaveEnd = this.parseDate(lv.toDate);
    
              if (leaveStart <= selectedEnd && leaveEnd >= selectedStart) {
                let daysToAdd = 0;
    
                if (lv.day < 1) {
                  daysToAdd = lv.day;
                } else {
                  // ✅ FIXED: Set to midnight for accurate day count
                  const overlapStart = new Date(Math.max(
                    new Date(leaveStart.getFullYear(), leaveStart.getMonth(), leaveStart.getDate()).getTime(),
                    selectedStart.getTime()
                  ));
                  const overlapEnd = new Date(Math.min(
                    new Date(leaveEnd.getFullYear(), leaveEnd.getMonth(), leaveEnd.getDate()).getTime(),
                    selectedEnd.getTime()
                  ));
                  
                  daysToAdd = Math.floor((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                }
    
                totalDays += daysToAdd;
                tooltipData.push(`${lv.fromDate} → ${lv.toDate} (${daysToAdd} days)`);
              }
            }
          });
    
          row[type] = { value: totalDays, tooltip: tooltipData };
        });
    
        return row;
      });
    });
    
    
    
    

    
    

  /* =========================
     EXCEL EXPORT
     ========================= */
  exportToExcel(): void {
    const excelData = this.reportData().map((row: any) => {
      const obj: any = { Employee: row.employee };
      this.leaveTypes.forEach(t => obj[t] = row[t].value || 0);
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leave Report');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'Employee_Leave_Report.xlsx');
  }
}



