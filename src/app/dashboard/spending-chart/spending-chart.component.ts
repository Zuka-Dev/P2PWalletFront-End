import { Component, Input } from '@angular/core';
import { Transaction } from '../../../types';

@Component({
  selector: 'app-spending-chart',
  templateUrl: './spending-chart.component.html',
  styleUrls: ['./spending-chart.component.scss'],
})
export class SpendingChartComponent {
  @Input() data!: Transaction[];

  monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  get maxAmount(): number {
    return Math.max(...this.getTransactionAmountsByMonth());
  }

  getTransactionAmountsByMonth(): number[] {
    const monthlySpending = Array(12).fill(0);

    this.data.forEach((transaction) => {
      const date = new Date(transaction.transactionTime);
      const month = date.getMonth();
      monthlySpending[month] += transaction.amount;
    });

    return monthlySpending;
  }
}

