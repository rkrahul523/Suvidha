import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { report } from 'process';
import { GenReport } from './gen-report/gen-report';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
        { path: 'login', component: Login },
        { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard) },
         { path: 'report', component: GenReport },

         {
            path:"**", redirectTo:'login'
        },
        // {
        //     path: 'protected',
        //     loadComponent: () => import('./protected.component').then(m => m.ProtectedComponent),
        //     canActivate: [AuthenticationGuard.canActivate],
        //     canActivateChild: [AuthenticationGuard.canActivateChild],
        //     canLoad: [AuthenticationGuard.canLoad]
        //   },
        // src/app/login
        //   { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
         


];
