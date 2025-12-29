import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { report } from 'process';
import { GenReport } from './gen-report/gen-report';

export const routes: Routes = [
    {
        path:"**", redirectTo:'login'
    },
        { path: 'login', component: Login },
        { path: 'dashboard', component: Dashboard },
        { path: 'report', component: GenReport },


        // {
        //     path: 'protected',
        //     loadComponent: () => import('./protected.component').then(m => m.ProtectedComponent),
        //     canActivate: [AuthenticationGuard.canActivate],
        //     canActivateChild: [AuthenticationGuard.canActivateChild],
        //     canLoad: [AuthenticationGuard.canLoad]
        //   },
        // src/app/login
        //   { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
          { path: '', redirectTo: '/login', pathMatch: 'full' }
        


];
