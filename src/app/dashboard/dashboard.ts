import { Component } from '@angular/core';
import { LeaveDialog } from './leave-dialog/leave-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

//import { LeaveDialogComponent } from './leave-dialog.component';
@Component({
  selector: 'app-dashboard',
  imports: [
  //  ReactiveFormsModule,
    LeaveDialog,
    MatIconModule,
    MatButtonModule
],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  constructor(private modal: NgbModal) {}

  openLeave() {
    this.modal.open(LeaveDialog, {
      size: 'lg',
      backdrop: false,
      centered: true
    });
  }

}
