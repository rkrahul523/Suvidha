import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { finalize, tap } from 'rxjs/operators';
import { inject } from '@angular/core';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const bypassedURL = ['validate-user-details'];

  if (!bypassedURL.some(url => req.url.includes(url))) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
