import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast/toast.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [ToastComponent, SidebarComponent],
  imports: [CommonModule],
  exports: [ToastComponent, SidebarComponent],
})
export class SharedModule {}
