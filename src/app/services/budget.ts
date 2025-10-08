import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Expense {
  id: number;
  name: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class Budget {
  private initialKey = 'budget_initial';
  private remainingKey = 'budget_remaining';
  private expensesKey = 'budget_expenses';

  private initial$ = new BehaviorSubject<number>(0);
  private remaining$ = new BehaviorSubject<number>(0);
  private expenses$ = new BehaviorSubject<Expense[]>([]);

  initialObs = this.initial$.asObservable();
  remainingObs = this.remaining$.asObservable();
  expensesObs = this.expenses$.asObservable();

  private inited = false;
  private isBrowser = typeof window !== 'undefined' && !!(window.localStorage);

  constructor() {
    this.safeInit();
  }

  private safeInit(): void {
    if (this.inited) return;
    if (!this.isBrowser) { this.inited = true; return; }

    try {
      const initRaw = localStorage.getItem(this.initialKey);
      const remRaw = localStorage.getItem(this.remainingKey);
      const expensesRaw = localStorage.getItem(this.expensesKey);

      const init = initRaw !== null ? Number(initRaw) : 0;
      const expenses = expensesRaw ? JSON.parse(expensesRaw) as Expense[] : [];

      this.initial$.next(Number.isFinite(init) ? init : 0);
      this.remaining$.next(remRaw !== null ? Number(remRaw) : (Number.isFinite(init) ? init : 0));
      this.expenses$.next(Array.isArray(expenses) ? expenses : []);
    } catch (e) {
      console.warn('BudgetService: failed reading localStorage', e);
      this.initial$.next(0);
      this.remaining$.next(0);
      this.expenses$.next([]);
    } finally {
      this.inited = true;
    }
  }

  private safePersist(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.initialKey, String(this.initial$.getValue()));
      localStorage.setItem(this.remainingKey, String(this.remaining$.getValue()));
      localStorage.setItem(this.expensesKey, JSON.stringify(this.expenses$.getValue()));
    } catch (e) {
      console.warn('BudgetService: failed writing localStorage', e);
    }
  }

  setInitial(amount: number) {
    this.safeInit();
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.initial$.next(amount);
    this.remaining$.next(amount);
    this.expenses$.next([]);
    this.safePersist();
  }

  addExpense(name: string, amount: number): { ok: boolean; message?: string } {
    this.safeInit();
    const remaining = this.remaining$.getValue();

    if (!name || !name.trim()) return { ok: false, message: 'The expense name cannot be empty' };
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, message: 'The expense amount must be greater than 0' };
    if (amount > remaining) return { ok: false, message: 'The expense exceeds the remaining budget' };

    const expenses = [...this.expenses$.getValue()];
    const id = expenses.length ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    const newExpense: Expense = { id, name: name.trim(), amount };
    expenses.push(newExpense);

    this.expenses$.next(expenses);
    this.remaining$.next(Number((remaining - amount).toFixed(2)));
    this.safePersist();

    return { ok: true };
  }

  removeExpense(id: number) {
    this.safeInit();
    const expenses = [...this.expenses$.getValue()];
    const idx = expenses.findIndex(e => e.id === id);
    if (idx === -1) return;
    const [removed] = expenses.splice(idx, 1);
    const newRemaining = Number((this.remaining$.getValue() + removed.amount).toFixed(2));
    this.expenses$.next(expenses);
    this.remaining$.next(newRemaining);
    this.safePersist();
  }

  resetAll() {
    this.safeInit();
    this.initial$.next(0);
    this.remaining$.next(0);
    this.expenses$.next([]);
    if (this.isBrowser) {
      try {
        localStorage.removeItem(this.initialKey);
        localStorage.removeItem(this.remainingKey);
        localStorage.removeItem(this.expensesKey);
      } catch (e) {
        console.warn('BudgetService: failed clearing localStorage', e);
      }
    }
  }
}
