import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Budget, Expense } from '../../../services/budget';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css'
})
export class ExpenseList implements OnInit {
  expenses: Expense[] = [];
  initial = 0;
  remaining = 0;

  constructor(public budget: Budget) {}

  ngOnInit(): void {
    this.budget.expensesObs.subscribe(e => this.expenses = e);
    this.budget.initialObs.subscribe(v => this.initial = v);
    this.budget.remainingObs.subscribe(v => this.remaining = v);
  }

  remove(id: number) { this.budget.removeExpense(id); }

  remainingPercentage(): number {
    if (!this.initial) return 0;
    return Math.max(0, Math.round((this.remaining / this.initial) * 100));
  }

  progressBarClass(): string {
    const pct = this.remainingPercentage();
    if (pct <= 33) return 'bg-danger';
    if (pct <= 66) return 'bg-warning';
    return 'bg-success';
  }
}
