import { Component } from '@angular/core';
import { LeaveDialog } from './leave-dialog/leave-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { LeaveDialogComponent } from './leave-dialog.component';
@Component({
  selector: 'app-dashboard',
  imports: [
    ReactiveFormsModule,
    LeaveDialog,
    MatIconModule,
   MatButtonModule,
   CommonModule,
   
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor(private dialog: MatDialog) {}
  openLeaveModal() {
    this.dialog.open(LeaveDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'leave-dialog'
    });
  }

}
