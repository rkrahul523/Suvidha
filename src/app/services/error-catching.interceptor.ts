import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TimeTableApiService } from './time-api-service';

export const errorCatchingInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const authentication = inject(TimeTableApiService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.log('Unauthorized User logging out');
        authentication.logout();
      }
      
      let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        console.log('This is client side error');
        errorMsg = `Error: ${error.error.message}`;
      } else {
        console.log('This is server side error');
        errorMsg = `Error Code: ${error.status}, Message: ${error.message}`;
      }
      
      toastr.error('Please try Again', 'Something went wrong!!!', { timeOut: 3000 });
      return throwError(() => errorMsg);
    })
  );
};
