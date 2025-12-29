import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loaderInterceptor } from './services/loading.inceptor';
import { apiInterceptor } from './services/api.interceptor';
import { errorCatchingInterceptor } from './services/error-catching.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([loaderInterceptor,apiInterceptor, errorCatchingInterceptor ])),
  
  ]
};
