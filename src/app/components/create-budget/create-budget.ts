import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Budget } from '../../services/budget';

@Component({
  selector: 'app-create-budget',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-budget.html',
  styleUrl: './create-budget.css'
})
export class CreateBudget {
  form: FormGroup;
  errorMsg = '';

  constructor(private fb: FormBuilder, private budgetService: Budget, private router: Router) {
    this.form = this.fb.group({ amount: [null, [Validators.required]] });
  }

  onSubmit() {
    this.errorMsg = '';
    const val = Number(this.form.value.amount);
    if (!Number.isFinite(val) || val <= 0) { 
      this.errorMsg = 'You must enter a budget greater than zero'; 
      return; 
    }
    this.budgetService.setInitial(val);
    this.router.navigate(['/manage']);
  }
}