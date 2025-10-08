import { Routes } from '@angular/router';
import { CreateBudget } from './components/create-budget/create-budget';
import { ManageBudget } from './components/manage-budget/manage-budget';

export const routes: Routes = [
  { path: '', redirectTo: 'create', pathMatch: 'full' },
  { path: 'create', component: CreateBudget },
  { path: 'manage', component: ManageBudget },
  { path: '**', redirectTo: 'create' }
];
