import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { SignInComponent } from './auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from './auth/pages/sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { AccountsComponent } from './account/account/account.component';
import { VerifyEmailComponent } from './auth/pages/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './auth/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/pages/reset-password/reset-password.component';

// Import the main components from each module

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    children: [
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'verify-email', component: VerifyEmailComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      // Add other auth routes as needed
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [AuthGuard],
  },
];
