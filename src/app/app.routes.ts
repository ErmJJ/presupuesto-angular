import { Routes } from '@angular/router';
import { CrearPresupuesto } from './components/crear-presupuesto/crear-presupuesto';
import { AdministrarPresupuesto } from './components/administrar-presupuesto/administrar-presupuesto';

export const routes: Routes = [
  { path: '', redirectTo: 'crear', pathMatch: 'full' },
  { path: 'crear', component: CrearPresupuesto },
  { path: 'administrar', component: AdministrarPresupuesto },
  { path: '**', redirectTo: 'crear' }
];
