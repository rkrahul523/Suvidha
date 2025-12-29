import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './services/loading.inceptor';
import { apiInterceptor } from './services/api.interceptor';
import { errorCatchingInterceptor } from './services/error-catching.interceptor';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
   // provideHttpClient(withInterceptors([ ])),
    provideHttpClient(withInterceptors([loaderInterceptor,apiInterceptor, errorCatchingInterceptor ])),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: true,
      progressBar: true
    }),
    ToastrService,
  //  provideAnimationsAsync(), 
   provideAnimations(),



   {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' }
  }
  ]
};
