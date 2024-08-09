import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'info' | 'error' = 'success';
  isVisible: boolean = false;

  ngOnInit(): void {
    this.show();
  }
  show(): void {
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 5000);
  }
}
