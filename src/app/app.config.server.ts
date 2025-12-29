import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr, ToastrService } from 'ngx-toastr';
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),

    importProvidersFrom(
      MatDialogModule,
      MatNativeDateModule
    ),
   
    // provideNgb()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
