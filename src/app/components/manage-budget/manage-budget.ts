import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Expense, Budget } from '../../services/budget';
import { AddExpense } from './add-expense/add-expense';
import { ExpenseList } from './expense-list/expense-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-budget',
  standalone: true,
  imports: [CommonModule, AddExpense, ExpenseList],
  templateUrl: './manage-budget.html',
  styleUrl: './manage-budget.css'
})
export class ManageBudget implements OnInit, OnDestroy {
  initial = 0;
  remaining = 0;
  expenses: Expense[] = [];

  private subs: Subscription[] = [];

  constructor(private budget: Budget, private router: Router) {}

  ngOnInit(): void {
    this.subs.push(this.budget.initialObs.subscribe(v => this.initial = v));
    this.subs.push(this.budget.remainingObs.subscribe(v => this.remaining = v));
    this.subs.push(this.budget.expensesObs.subscribe(e => this.expenses = e));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  goBack(): void {
    try {
      window.history.length > 1 ? window.history.back() : this.router.navigate(['/create']);
    } catch {
      this.router.navigate(['/create']);
    }
  }

  // Remove only the expenses
  removeExpenses(): void {
    if (!this.expenses.length) return;
    const ok = window.confirm('Are you sure you want to delete all expenses?');
    if (!ok) return;
    const ids = this.expenses.map(e => e.id);
    ids.forEach(id => this.budget.removeExpense(id));
  }

  // Remove everything: budget + expenses
  removeBudget(): void {
    if (this.initial === 0) return;
    const ok = window.confirm('⚠️ This will delete the initial budget and all expenses. Do you want to continue?');
    if (!ok) return;
    this.budget.resetAll();
  }

  goToCreate(): void {
    this.router.navigate(['/create']);
  }
}