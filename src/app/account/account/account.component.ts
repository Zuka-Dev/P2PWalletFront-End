import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { StatementRequestDTO, UserDetails } from '../../../types';
import { TransferService } from '../../core/services/transfer.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForeignWalletService } from '../../core/services/foreign-wallet.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountsComponent {
  userDetails: any;
  accountBalance: number = 0;
  showFundAccountModal: boolean = false;
  showTransferMoneyModal: boolean = false;
  statementForm!: FormGroup;
  generateForeignWalletForm!: FormGroup;
  isLoading: boolean = false;
  showToast: boolean = false;
  toastType!: 'success' | 'info' | 'error';
  toastMessage: string = '';

  constructor(
    private userService: UserService,
    private transferService: TransferService,
    private router: Router,
    private fb: FormBuilder,
    private foreignWalletService: ForeignWalletService
  ) {}

  ngOnInit(): void {
    this.loadAccountData();
    this.statementForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      format: ['pdf', Validators.required],
    });
    this.generateForeignWalletForm = this.fb.group({
      currency: ['', Validators.required],
    });
  }
  loadAccountData() {
    this.isLoading = true;
    this.userService.getUserDetails().subscribe(
      (data) => {
        console.log(data.data);

        this.userDetails = data.data;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.log(error);
        this.showToastMessage('Failed to load account data', 'error');
        this.router.navigateByUrl('/dashboard');
      }
    );
    this.transferService.getAccounts().subscribe(
      (data) => {
        console.log('accounts', data.data);
        this.accountBalance = data.data[0].balance;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        this.showToastMessage('Failed to load account data', 'error');
      }
    );
  }
  generateForeignWallet() {
    this.isLoading = true;
    console.log(this.generateForeignWalletForm.value);
    this.foreignWalletService
      .createForeignWallet(this.generateForeignWalletForm.value)
      .subscribe((response) => {
        this.isLoading = false;
        console.log(response);
        if (!response.status) {
          this.showToastMessage(response.statusMessage, 'error');
        }
        this.showToastMessage(response.statusMessage, 'success');
      });
  }
  openFundAccountModal() {
    this.showFundAccountModal = true;
  }

  closeFundAccountModal() {
    this.showFundAccountModal = false;
  }

  openTransferMoneyModal() {
    if (this.userDetails.hasPin == false) {
      this.showToastMessage(
        'User must create pin before making transfers',
        'info'
      );
      return;
    }
    this.showTransferMoneyModal = true;
  }

  closeTransferMoneyModal() {
    this.showTransferMoneyModal = false;
  }

  onFundAccount(fund: number) {
    this.isLoading = true;
    const data = { fund: fund };
    console.log(data);
    this.transferService.fundAccounts(data).subscribe(
      (response) => {
        this.isLoading = false;
        console.log(response);
        if (response.authorization_url) {
          console.log('Authorization URL:', response.authorization_url);
          // Open the URL in a new tab/window
          window.location.href = response.authorization_url;
        } else {
          this.showToastMessage('Failed to get authorization URL', 'error');
        }
        this.loadAccountData();
        this.closeFundAccountModal();
        this.showToastMessage('Account funding initiated', 'success');
      },
      (error) => {
        console.log(error);
        this.showToastMessage('Failed to fund account', 'error');
        this.isLoading = false;
      }
    );
  }

  onTransferMoney(transferData: {
    pin: string;
    beneficiaryId: string;
    amount: number;
  }) {
    this.isLoading = true;
    console.log(transferData);
    this.transferService.transferFunds(transferData).subscribe(
      (response) => {
        this.isLoading = false;
        console.log(response);
        this.showToastMessage(response.statusMessage, 'success');
        this.loadAccountData();
        this.closeTransferMoneyModal();
      },
      (error) => {
        console.log(error);
        this.showToastMessage('Failed to transfer money', 'error');
        this.isLoading = false;
      }
    );
  }
  generateStatement(): void {
    if (!this.statementForm.valid) {
      this.showToastMessage('Invalid Form', 'error');
      return;
    }
    this.isLoading = true;
    const data: StatementRequestDTO = this.statementForm.value;
    this.transferService.generateStatement(data).subscribe(
      (response: Blob) => {
        this.isLoading = false;
        const fileName = `Statement_${data.startDate}_${data.endDate}.${
          data.format === 'pdf' ? 'pdf' : 'xlsx'
        }`;
        const contentType =
          data.format.toLowerCase() === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        const blob = new Blob([response], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
        console.log(error);
        this.isLoading = false;
        this.showToastMessage('Failed to generate statement', 'error');
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
}
