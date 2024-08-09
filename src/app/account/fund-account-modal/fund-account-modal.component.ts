import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fund-account-modal',
  templateUrl: './fund-account-modal.component.html',
  styleUrls: ['./fund-account-modal.component.scss'],
})
export class FundAccountModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() fundAccount = new EventEmitter<number>();
  fundAccountForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.fundAccountForm = this.fb.group({
      fund: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  get amount() {
    return this.fundAccountForm.get('fund');
  }

  onSubmit() {
    if (this.fundAccountForm.valid) {
      this.fundAccount.emit(this.fundAccountForm.value.fund);
    }
  }
}
