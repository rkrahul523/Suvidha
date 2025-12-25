import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-leave-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './leave-dialog.html',
  styleUrl: './leave-dialog.scss',
})

export class LeaveDialog {

  leaveForm: FormGroup;
  totalDays = signal(0); 

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.leaveForm = this.fb.group({
      employeeName: ['', Validators.required],
      leaveType: ['', Validators.required],
      dates: this.fb.array([this.createRow()])
    });
    this.dates.valueChanges.subscribe(() => {
      this.calculateDays();
    });
  }

  get dates(): FormArray {
    return this.leaveForm.get('dates') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      fromDate: [null, Validators.required], // NgbDateStruct
      toDate: [null, Validators.required]
    });
  }

  addRow() {
    this.dates.push(this.createRow());
  }

  removeRow(i: number) {
    this.dates.removeAt(i);
    this.calculateDays();
  }

  // Calculate total days for all ranges
  calculateDays() {
    let days = 0;
    this.dates.value.forEach((d: any) => {
      if (d.fromDate && d.toDate) {
        const from = new Date(d.fromDate.year, d.fromDate.month - 1, d.fromDate.day);
        const to = new Date(d.toDate.year, d.toDate.month - 1, d.toDate.day);
        const diff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        days += diff > 0 ? diff : 0;
      }
    });
    this.totalDays.set(days)
  }

  
  submit() {
    if (this.leaveForm.invalid) return;
    this.calculateDays();
    console.log({ ...this.leaveForm.value, totalDays: this.totalDays });
    this.activeModal.close();
  }
}
