import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormStyle, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeTableApiService } from '../services/time-api-service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule,MatSnackBarModule ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  activeTab = signal<'timetable' | 'login'>('login');
  username = '';
  password = '';
  loaderFlag = signal<boolean>(false);
  setTab(tab: 'timetable' | 'login') {
    this.activeTab.set(tab);
  }

  constructor(private api: TimeTableApiService,private router: Router, private snackBar: MatSnackBar){
    // this.loaderFlag.set(false);
  }

  viewTimetable() {
    // Navigate to timetable or open modal
    console.log('Navigate to timetable');
  }

test(){
  
     
}

  onLogin() {
    //this.router.navigateByUrl('dashboard')
        
    this.loaderFlag.set(true);
    if (this.username && this.password) {
      console.log('Login:', { username: this.username, password: this.password });


      
      // if (this.loginForm.invalid) {
      //   this.toastr.error('Please fill Correct Details', 'Login Error', {
      //     timeOut: 3000,
      //   });
      //   this.loaderFlag = false;
      //   return;
      // }
  
  
      this.api.login({username : this.username , password: this.password }).subscribe((res: any) => {
        this.loaderFlag.set(false);
        if (res && res.status) {
         // localStorage.setItem("token", res.token)
          this.api.token= res.token;
          this.api.user.next(res.data);
          this.api.department= res.data.department;
         
          this.api.successToast(res.message, 'Login success')
          setTimeout(()=>{
            this.router.navigateByUrl('/dashboard');  })
        
        } else {
          this.snackBar.open(res.message, 'Error Login', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loaderFlag.set(false);
        }
  
  
  
  
  
      },
      (err: any)=>{
         this.loaderFlag.set(false);
      });
      // Call your auth service
    }else{
       this.loaderFlag.set(false);
    }


  }


}
