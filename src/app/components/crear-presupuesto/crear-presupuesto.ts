import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Presupuesto } from '../../services/presupuesto';

@Component({
  selector: 'app-crear-presupuesto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-presupuesto.html',
  styleUrl: './crear-presupuesto.css'
})
export class CrearPresupuesto {
  form: FormGroup;
  errorMsg = '';

  constructor(private fb: FormBuilder, private presService: Presupuesto, private router: Router) {
    this.form = this.fb.group({ cantidad: [null, [Validators.required]] });
  }

  onSubmit() {
    this.errorMsg = '';
    const val = Number(this.form.value.cantidad);
    if (!Number.isFinite(val) || val <= 0) { this.errorMsg = 'Debe ingresar un presupuesto mayor a cero'; return; }
    this.presService.setInitial(val);
    this.router.navigate(['/administrar']);
  }
}