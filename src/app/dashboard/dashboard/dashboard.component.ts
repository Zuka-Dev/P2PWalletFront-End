import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserService } from '../../core/services/user.service';
import {
  Account,
  BaseResponseDTO,
  Transaction,
  UserDetails,
} from '../../../types';
import { Router } from '@angular/router';
import { TransactionService } from '../../core/services/transaction.service';

@Component({
  selector: 'app-dashboard',

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
}) 
export class DashboardComponent {
  isLoading: boolean = false;
  userDetails!: UserDetails;
  latestTransaction!: Transaction;
  type!: 'credit' | 'debit';
  recentTransactions!: Transaction[];
  recentDeposits!: any[];
  showToast: boolean = false;
  toastMessage: string = '';
  toastType!: 'success' | 'info' | 'error';

  constructor(
    private userService: UserService,
    private router: Router,
    private transactionService: TransactionService
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.getUserDetails();
    this.getDeposits();
    this.getTransactions();
    this.isLoading = false;
  }
  getUserDetails(): void {
    this.isLoading = true;
    this.userService.getUserDetails().subscribe(
      (res: BaseResponseDTO | any) => {
        console.log(res);
        if (!res.status) {
          this.showToastMessage(res.statusMessage, 'error');
          this.isLoading = false;
          this.router.navigateByUrl('/auth/sign-in');
        }
        this.userService.setUserDetails(res.data);
        this.userDetails = res.data as UserDetails;
        console.log(this.userDetails.accounts)
        if (this.userDetails.hasPin === false) {
          this.showToastMessage(
            'User must create pin before making transfers',
            'info'
          );
        }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('error: ', error.error.statusMessage);
        this.showToastMessage(error.error.statusMessage, 'error');
        this.router.navigateByUrl('/auth/sign-in');
      }
    );
  }
  getTransactions(): void {
    this.isLoading = true;
    this.transactionService.getAllTransactions().subscribe(
      (res: BaseResponseDTO) => {
        console.log(res);
        if (!res.status) {
          this.showToastMessage(res.statusMessage, 'error');
          this.isLoading = false;
          this.router.navigateByUrl('/auth/sign-in');
        }
        this.recentTransactions = res.data as Transaction[];
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('error: ', error.error.statusMessage);
        this.showToastMessage(error.error.statusMessage, 'error');
        this.router.navigateByUrl('/auth/sign-in');
      }
    );
  }
  getDeposits(): void {
    this.transactionService.getAllDeposits().subscribe(
      (dep) => {
        console.log(dep);
        this.recentDeposits = dep.data;
      },
      (error) => {
        console.error('error: ', error.error.statusMessage);
        this.showToastMessage(error.error.statusMessage, 'error');
        // this.router.navigateByUrl('/auth/sign-in');
      }
    );
  }

  showToastMessage(message: string, type: 'success' | 'info' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }
  getLastTransaction(): { amount: number; timeDifference: string } {
    if (!this.recentTransactions || this.recentTransactions.length === 0) {
      return { amount: 0, timeDifference: 'N/A' };
    }

    // Sort transactions by date in descending order
    const sortedTransactions = this.recentTransactions.sort(
      (a, b) =>
        new Date(b.transactionTime).getTime() -
        new Date(a.transactionTime).getTime()
    );

    const lastTransaction = sortedTransactions[0];
    this.latestTransaction = lastTransaction;
    const now = new Date();
    const transactionTime = new Date(lastTransaction.transactionTime);
    const timeDifference = this.getTimeDifference(now, transactionTime);

    return {
      amount: lastTransaction.amount,
      timeDifference: timeDifference,
    };
  }

  private getTimeDifference(now: Date, transactionTime: Date): string {
    const diffInSeconds = Math.floor(
      (now.getTime() - transactionTime.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }

  getTotalBalance(): number {
    return this.userDetails.accounts.reduce(
      (acc, account) => acc + account.balance,
      0
    );
  }
  getType(transaction: Transaction, account: Account): any {
    return transaction.beneficiaryId === account.accountNumber
      ? 'credit'
      : 'debit';
  }
}
