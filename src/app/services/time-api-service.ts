import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Leave } from '../dashboard/leave-manager/leave-manager';
// import { Observable } from 'rxjs/dist/types/internal/Observable';
// import { AuthenticationService } from '../../login/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
    providedIn: 'root'
})
export class TimeTableApiService {
  private http = inject(HttpClient);
  token:string;
  private timeapiUrl = 'https://api.ipgeolocation.io/ipgeo?apiKey=c44d4e73d2e44e0e9c57a3959f9683b6'; // API for IST time

    // apiURL = !window.location.origin.includes('localhost') ?
      // apiURL=  'https://big-basket-tracker.onrender.com/'
    //     :
    apiURL=  'http://localhost:5000/';

    public leaveManagerData= signal<Leave[]>([
      { id: 1, day:0.5, employee: 'John Doe', type: 'HPL', fromDate: '26-12-2025', toDate: '26-12-2025' , leaveId: "1262666"},
    ]);
    public upcomingLeave= signal<Leave[]>([
      { id: 1, employee: 'John Doe', type: 'HPL', fromDate: '26-12-2025', toDate: '26-12-2025' , leaveId: "1262666"},
    ]);

public department= 'FFT'
    private    getAllTimeTable='get-all-time-table'
       private  getAllleave='getAllLeaveData'
       private  addeave='addLeave'
       private  deleteLeave='deleteLeave'

    private addTimeTable='add-time-table'

    constructor(
      private toastr: ToastrService,
      private route: Router,
      private snackBar: MatSnackBar
    ) {
    this.token='';
    }

    // getU_id() {
    //     const userId: any = this.authentication.user.getValue();
    //     return userId.userId;   
    // }

    addTime(timeData: any) {
        return this.http.post(this.apiURL + this.addTimeTable, { timeData })
    }

    getAllLeave(){
      const data= { department: this.department };
        return this.http.post(this.apiURL + this.getAllleave, data)
    }
    addLeave(data: any){
     // const data= { department: 'FFT' };
        return this.http.post(this.apiURL + this.addeave, {...data, department: this.department})
    }
    deleteEmpLeave(data: any){
     // const data= { department: 'FFT' };
        return this.http.post(this.apiURL + this.deleteLeave, {...data, department: this.department})
    }
    


    loginURL='validateLogin';
  currentUser='';

  user=new BehaviorSubject<any>(null);
  username=null;
  getUerDetailsURL='get-user-details';


  login(loginData: any): Observable<any> {
    // Mock a successful call to an API server.
    this.username= loginData.username;
    //this.currentUser= getEmployeeName(loginData.username);
    return this.http.post(this.apiURL+this.loginURL,  loginData)
 
  }

  logout(): void {
    localStorage.removeItem("token");
    this.route.navigateByUrl(`/login`)
  }

  isUserLoggedIn(): boolean {
    if (this.token != null) {
      return true;
    }
    return false;
  }

  getUserDetails(token : any){
      console.log("in get userdetails", this.username )
    return this.http.post(this.apiURL+this.getUerDetailsURL, { token, username:this.username })
   }
  
    getCurrentTime(): any {
      return this.http.get(this.timeapiUrl);
    }


    getAlltime() {
      return this.http.get('assets/docs/time-table.json');
        return this.http.get(this.apiURL + this.getAllTimeTable)
    }
   
    // getAllDak() {
    //     return this.http.get(this.apiURL + this.getAllDakUrl, { params: { user_id: this.getU_id() } })
    // }
   










     warnToast(message: any, subtext='File Info') {
      this.snackBar.open(message, subtext, { 
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      }
     successToast(message: any, subtext='File Info') {
      this.snackBar.open(message, subtext, { 
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      }
     errorToast(message: any, subtext='File Info') {
      this.snackBar.open(message, subtext, { 
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      }









}