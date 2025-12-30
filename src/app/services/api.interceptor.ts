import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { TimeTableApiService } from './time-api-service';

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authentication = inject(TimeTableApiService);

  const token: any = localStorage.getItem('token') ? localStorage.getItem('token') : '';
  const currentUser = localStorage.getItem('userId');

  let authReq = req;

  if (currentUser) {
    authReq = req.clone({
      headers: new HttpHeaders({
        token,
        user: `${currentUser}`,
      }),
    });
  } else {
    authReq = req.clone({
      headers: new HttpHeaders({
        token,
      }),
    });
  }

  return next(authReq); // Direct call, no .handle()
};
