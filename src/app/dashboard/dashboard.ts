import { Component, OnInit, signal } from '@angular/core';
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
import { LeaveManager, Leave } from './leave-manager/leave-manager';
import { TimeTableApiService } from '../services/time-api-service';
import { GenReport } from '../gen-report/gen-report';

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
    ShowLeave, Charts, Calendar,LeaveManager,GenReport,

 
 
],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  names=employeeListFFT;


  
  constructor(private modal: NgbModal , private api: TimeTableApiService) {}


  ngOnInit(){
   this.api.getAllLeave().subscribe((res: any) => {
    if (res && res.status) {
      this.api.successToast(res.message, 'fetching all Leaves');
      this.updatedLeaveManagertab(res.data)
      this.showUpcomingLeave()
    } else {
      this.api.warnToast(res.message, 'fetching all Leaves');
    }

    })
  }


  updatedLeaveManagertab(data: any){
    this.api.leaveManagerData.set(this.transformLeaveData(data))
  }
 

  showUpcomingLeave(){
    this.api.upcomingLeave.set( this.getUpcomingLeaves(this.api.leaveManagerData()))
  }

   getUpcomingLeaves(leaves: Leave[], days: number = 30): Leave[] {
    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setDate(today.getDate() + days); // 30 days from today
    
    // Filter leaves that start within the next 30 days (including today)
    return leaves.filter(leave => {
      const [dayF, monthF, yearF] = leave.fromDate.split('-').map(Number);
      const fromDate = new Date(yearF, monthF - 1, dayF);
      
      // Include if fromDate is today or in the future within 30 days
      return fromDate >= today && fromDate <= oneMonthLater;
    }).sort((a, b) => {
      // Sort by fromDate ascending
      const dateA = new Date(a.fromDate.split('-').map(Number).reverse().join('-'));
      const dateB = new Date(b.fromDate.split('-').map(Number).reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
  }

   transformLeaveData(data: any[]): Leave[] {
    const leaves: Leave[] = [];
  
    data.forEach(employee => {
      const employeeId = employee.id;
      const employeeName = employee.EmployeeName;
  
      // Leave types array
      const leaveTypes = ['VL', 'EL', 'HPL', 'UL', 'CL'];
  
      leaveTypes.forEach(type => {
        const leaveTypeData = employee[type] || [];
        
        leaveTypeData.forEach((leaveItem: any) => {
          leaves.push({
            id: employeeId,
            employee: employeeName,
            type: type as Leave['type'],
            fromDate: leaveItem.dateFrom,
            toDate: leaveItem.dateTo,
            day:leaveItem.day,
            leaveId: leaveItem.leaveId
          });
        });
      });
    });
  
    return leaves;
  }

}
