import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pin-entry-modal',
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>Enter PIN</h2>
        <form [formGroup]="pinForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="pin">PIN</label>
            <input
              type="password"
              id="pin"
              formControlName="pin"
              placeholder="Enter your PIN"
            />
          </div>
          <div class="form-actions">
            <button type="submit" [disabled]="pinForm.invalid">Confirm</button>
            <button type="button" (click)="cancel.emit()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./pin-entry-modal.component.scss'],
})
export class PinEntryModalComponent {
  @Output() submitPin = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  pinForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.pinForm = this.fb.group({
      pin: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(6)],
      ],
    });
  }

  onSubmit() {
    if (this.pinForm.valid) {
      this.submitPin.emit(this.pinForm.get('pin')?.value);
    }
  }
}
