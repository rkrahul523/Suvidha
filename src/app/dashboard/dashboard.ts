import { Component, OnInit } from '@angular/core';
import { LeaveDialog } from './leave-dialog/leave-dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule, NgSelectComponent } from '@ng-select/ng-select';
import { employeeListFFT } from '../model/employee-list';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { ShowLeave } from './show-leave/show-leave';
import { Charts } from './charts/charts';
import { Calendar } from './calendar/calendar';
import { CommonModule } from '@angular/common';
import { LeaveManager } from './leave-manager/leave-manager';
import { TimeTableApiService } from '../services/time-api-service';

//import { LeaveDialogComponent } from './leave-dialog.component';
@Component({
  selector: 'app-dashboard',
  imports: [
  //  ReactiveFormsModule,
  CommonModule,
    LeaveDialog,
    MatIconModule,
    MatButtonModule,
    NgSelectModule,
    NgSelectComponent,
    Header, Footer,
    ShowLeave, Charts, Calendar,LeaveManager,
 
 
],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  names=employeeListFFT;
  constructor(private modal: NgbModal , private api: TimeTableApiService) {}


  ngOnInit(){
//    this.api.getAllLeave().subscribe((res: any) => {
     
// console.log(res)
  

//     })
  }
  openLeave() {
    this.modal.open(LeaveDialog, {
      size: 'lg',
      backdrop: false,
      centered: true
    });
  }



}
