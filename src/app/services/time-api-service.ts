import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Observable } from 'rxjs/dist/types/internal/Observable';
// import { AuthenticationService } from '../../login/services/authentication.service';
// import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class TimeTableApiService {
  private http = inject(HttpClient);
  private timeapiUrl = 'https://api.ipgeolocation.io/ipgeo?apiKey=c44d4e73d2e44e0e9c57a3959f9683b6'; // API for IST time

    // apiURL = !window.location.origin.includes('localhost') ?
      apiURL=  'https://big-basket-tracker.onrender.com/'
    //     :
    //apiURL=  'http://localhost:5000/';


    private    getAllTimeTable='get-all-time-table'
       private  getAllleave='getAllLeaveData'

    private addTimeTable='add-time-table'

    constructor(
      
    ) {

    }

    // getU_id() {
    //     const userId: any = this.authentication.user.getValue();
    //     return userId.userId;   
    // }

    addTime(timeData: any) {
        return this.http.post(this.apiURL + this.addTimeTable, { timeData })
    }

    getAllLeave(){
      const data= { department: 'FFT' };
        return this.http.post(this.apiURL + this.getAllleave, data)
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
   


    //  warnToast(message: any, subtext='File Info') {
    //     this.toastr.info(message, subtext, {
    //       timeOut: 3000,
    //     });
    //   }
    //  successToast(message: any, subtext='File Info') {
    //     this.toastr.success(message, subtext, {
    //       timeOut: 3000,
    //     });
    //   }
    //  errorToast(message: any, subtext='File Info') {
    //     this.toastr.error(message, subtext, {
    //       timeOut: 3000,
    //     });
    //   }









}