import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Presupuesto } from '../../../services/presupuesto';

@Component({
  selector: 'app-agregar-gasto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agregar-gasto.html',
  styleUrl: './agregar-gasto.css'
})

export class AgregarGasto {
  form: FormGroup;
  errorMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private pres: Presupuesto) {
    this.form = this.fb.group({ nombre: [''], cantidad: [null] });
  }

  onSubmit() {
    this.errorMsg = '';
    this.successMsg = '';
    const nombre = this.form.value.nombre?.trim();
    const cantidad = Number(this.form.value.cantidad);

    if (!nombre) { this.errorMsg = 'El nombre del gasto no puede estar vacío'; return; }
    if (!cantidad || cantidad <= 0) { this.errorMsg = 'El monto del gasto debe ser mayor a 0'; return; }

    const result = this.pres.addGasto(nombre, cantidad);
    if (!result.ok) { this.errorMsg = result.message ?? 'Error al agregar gasto'; return; }

    this.successMsg = 'Gasto agregado correctamente';
    this.form.reset();
    setTimeout(() => this.successMsg = '', 1600);
  }
}