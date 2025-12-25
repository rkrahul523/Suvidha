import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path:"**", redirectTo:'dashboard'
    },
        { path: 'login', component: Login },
        { path: 'dashboard', component: Dashboard },

];
