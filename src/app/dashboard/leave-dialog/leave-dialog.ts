import { Component, signal, computed, inject, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

interface LeaveData {
  employeeName: string;
  nature: 'CL' | 'EL';
  dates: { dateFrom: Date | null; dateTo: Date | null }[];
  totalDays: number;
}

@Component({
  selector: 'app-leave-dialog',
  // standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './leave-dialog.html',
  styleUrl: './leave-dialog.scss',
})
export class LeaveDialog {
    private fb = inject(FormBuilder);
    private dialogRef = inject(MatDialogRef<LeaveDialog>);
  
    leaveForm = signal<FormGroup>(this.createForm());
    dates = computed(() => this.leaveForm().get('dates') as FormArray);
    totalDays = computed(() => this.calculateTotalDays());
  
    private createForm(): FormGroup {
      const form = this.fb.group({
        employeeName: ['', Validators.required],
        nature: ['', Validators.required],
        dates: this.fb.array([this.createDateGroup()])
      });
  
      // Angular 20 reactive form signals
      effect(() => {
        this.calculateTotalDays();
      });
  
      return form;
    }
  
    private createDateGroup() {
      return this.fb.group({
        dateFrom: ['', Validators.required],
        dateTo: ['', Validators.required]
      });
    }
  
    addDateRange() {
      this.dates().push(this.createDateGroup());
    }
  
    removeDateRange(index: number) {
      if (this.dates().length > 1) {
        this.dates().removeAt(index);
      }
    }
  
    private calculateTotalDays(): number {
      const datesArray = this.dates().controls;
      let total = 0;
      
      datesArray.forEach(group => {
        const from = group.get('dateFrom')?.value;
        const to = group.get('dateTo')?.value;
        if (from && to) {
          const diffTime = Math.abs((to as Date).getTime() - (from as Date).getTime());
          total += Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        }
      });
      
      return total;
    }
  
    submitData(): LeaveData {
      const formValue = this.leaveForm().value;
      return {
        ...formValue,
        totalDays: this.totalDays(),
        dates: formValue.dates.filter((d: any) => d.dateFrom && d.dateTo)
      };
    }
  }






