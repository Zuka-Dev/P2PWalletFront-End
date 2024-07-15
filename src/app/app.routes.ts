import { Routes } from '@angular/router';
import { SignInComponent } from './auth/pages/sign-in/sign-in.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];
