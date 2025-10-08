import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Budget } from '../../../services/budget';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css'
})

export class AddExpense {
  form: FormGroup;
  errorMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private budget: Budget) {
    this.form = this.fb.group({ name: [''], amount: [null] });
  }

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';
    const name = this.form.value.name?.trim();
    const amount = Number(this.form.value.amount);

    if (!name) { this.errorMsg = 'Expense name cannot be empty'; return; }
    if (!amount || amount <= 0) { this.errorMsg = 'Expense amount must be greater than 0'; return; }

    const result = this.budget.addExpense(name, amount);
    if (!result.ok) { this.errorMsg = result.message ?? 'Error adding expense'; return; }

    this.successMsg = 'Expense added successfully';
    this.form.reset();
    setTimeout(() => this.successMsg = '', 1600);
  }
}