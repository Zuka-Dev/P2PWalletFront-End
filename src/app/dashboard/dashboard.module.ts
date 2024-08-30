import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BaseChartDirective, NG_CHARTS_CONFIGURATION } from 'ng2-charts';
import { SpendingChartComponent } from './spending-chart/spending-chart.component';

@NgModule({
  declarations: [DashboardComponent,SpendingChartComponent],
  imports: [CommonModule, DashboardRoutingModule, SharedModule , BaseChartDirective],
})
export class DashboardModule {}
