import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AutoLogoutService {
  private timer: any;
  private readonly timeoutPeriod: number = 1000 * 60 * 5; // 5 minutes
  constructor(private router: Router, private userService: UserService) {
    this.startTimer();
    this.setupActivityListeners();
  }
  startTimer(): void {
    this.timer = setTimeout(() => this.logout(), this.timeoutPeriod);
  }
  setupActivityListeners() {
    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keypress', () => this.resetTimer());
    window.addEventListener('click', () => this.resetTimer());
  }
  private resetTimer(): void {
    clearTimeout(this.timer);
    this.startTimer();
  }
  private logout(): void {
    // Call your logout method here, e.g., authService.logout()
    console.log('User is inactive for 5 minutes, logging out...');
    this.userService.logout();
  }
}
