import { Component, signal, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';
import {
  employeeListFFT,
  employeeListDASH,
  employeeListECE,
  employeeListMME,
} from '../../model/employee-list';
import { TimeTableApiService } from '../../services/time-api-service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService, ToastRef, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-leave-modal',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    MatSnackBarModule,
    ToastrModule
  ],
  templateUrl: './leave-dialog.html',
  styleUrl: './leave-dialog.scss',
})
export class LeaveDialog implements OnInit, OnDestroy {
  leaveForm!: FormGroup;
  totalDaysSignal = signal(0);
  names: any = [];
  private subscription?: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private api: TimeTableApiService,
    private snackBar: MatSnackBar,
    private toastr:ToastrService
  ) {
    effect(() => {
      const apiData = this.api.leaveManagerData();
      this.assignDepartment();
    });
  }

  ngOnInit() {
    this.assignDepartment();
    this.leaveForm = this.fb.group({
      employeeName: ['', Validators.required],
      leaveType: ['', Validators.required],
      dates: this.fb.array([this.createRow()]),
    });

    this.subscription = this.leaveForm.valueChanges.subscribe(() => {
      this.calculateDays();
    });
  }


  assignDepartment() {
    let department = localStorage.getItem('department');
    switch (department) {
      case 'FFT':
        this.names = employeeListFFT;
        break;
      case 'DASH':
        this.names = employeeListDASH;
        break;
      case 'ECE':
        this.names = employeeListECE;
        break;
      case 'MME':
        this.names = employeeListMME;
        break;
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get dates(): FormArray {
    return this.leaveForm.get('dates') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      isHalfDay: [false],
    });
  }

  addRow() {
    this.dates.push(this.createRow());
  }

  removeRow(i: number) {
    this.dates.removeAt(i);
  }

  isCasualLeave(): boolean {
    return this.leaveForm.get('leaveType')?.value === 'CL';
  }

  isSingleDay(index: number): boolean {
    const group = this.dates.at(index);
    const fromDate = group?.get('fromDate')?.value;
    const toDate = group?.get('toDate')?.value;

    if (!fromDate || !toDate) return false;

    const from = new Date(fromDate.year!, fromDate.month! - 1, fromDate.day!);
    const to = new Date(toDate.year!, toDate.month! - 1, toDate.day!);

    return from.getTime() === to.getTime();
  }

  calculateDays() {
    let days = 0;
    this.dates.controls.forEach((group) => {
      const d = group.value;
      if (d.fromDate && d.toDate) {
        const from = new Date(d.fromDate.year!, d.fromDate.month! - 1, d.fromDate.day!);
        const to = new Date(d.toDate.year!, d.toDate.month! - 1, d.toDate.day!);
        const timeDiff = to.getTime() - from.getTime();
        const diffDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays > 0) {
          if (diffDays === 1 && d.isHalfDay && this.isCasualLeave()) {
            days += 0.5;
          } else {
            days += diffDays;
          }
        }
      }
    });
    this.totalDaysSignal.set(days);
  }

  totalDays(): number {
    return this.totalDaysSignal();
  }

  submit() {
    if (this.leaveForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.calculateDays();
    const formValue = {
      ...this.leaveForm.value,
      totalDays: this.totalDays(),
    };

    // const from = new Date(formValue.fromDate.year, formValue.fromDate.month - 1, formValue.fromDate.day);
    // const to = new Date(formValue.toDate.year, formValue.toDate.month - 1, formValue.toDate.day);

    // if (from > to) {
    //   alert(`🚫 Date Range Error!`);
    //   return;
    // }

    console.log('Submitting:', formValue);
    // {
    //     EmployeeName:'',
    //     leaveType:'',
    //     id:'',
    //     dateFrom:'22/23/2025',
    //     dateTo:'',
    //     leaveId:'',
    //     day:0.5,
    //     isHalfDay: true,
    // }

    const data = this.convertLeaveData(formValue);
    this.api.addLeave(data).subscribe((res: any) => {
      if (res && res.status) {
        this.api.successToast(res.message, 'Add Leave');
       
        this.activeModal.close(formValue);
      } else {
        this.api.warnToast(res.message, 'Error');
      }
    });

    
  }

  convertLeaveData(input: any): any {
    const dateRange = input.dates[0];
    const fromDate = dateRange.fromDate;
    const toDate = dateRange.toDate;

    // Check if dates are same AND explicitly marked as half day
    const isSameDate =
      fromDate.day === toDate.day &&
      fromDate.month === toDate.month &&
      fromDate.year === toDate.year;

    const isHalfDay = isSameDate && dateRange.day === 0.5;

    return {
      EmployeeName: input.employeeName.name || '',
      leaveType: input.leaveType,
      id: input.employeeName.id,
      dateFrom: `${String(fromDate.day).padStart(2, '0')}-${String(fromDate.month).padStart(2, '0')}-${fromDate.year}`,
      dateTo: `${String(toDate.day).padStart(2, '0')}-${String(toDate.month).padStart(2, '0')}-${toDate.year}`,
      leaveId: Date.now().toString() + `${input.employeeName.id}`,
      day: input.totalDays,
      isHalfDay: isHalfDay,
    };
  }
}
