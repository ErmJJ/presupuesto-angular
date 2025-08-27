import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Presupuesto } from './app/services/presupuesto';

/* Filtrar posibles redeclaraciones del servicio en appConfig.providers */
function filterOutPresupuestoService(providers?: any): any[] {
  if (!providers || !Array.isArray(providers)) return [];
  return providers.filter((p: any) => {
    if (p === Presupuesto) return false;
    if (p && typeof p === 'object' && ('provide' in p)) {
      try { if ((p as any).provide === Presupuesto) return false; } catch {}
    }
    return true;
  });
}

const rawAppProviders = (appConfig && (appConfig as any).providers) ? (appConfig as any).providers : [];
const safeAppProviders: any[] = filterOutPresupuestoService(rawAppProviders);

const finalProviders: any[] = [
  ...safeAppProviders,
  importProvidersFrom(BrowserModule, ReactiveFormsModule, FormsModule),
  provideRouter(routes)
];

bootstrapApplication(App, {
  ...appConfig,
  providers: finalProviders
}).catch(err => console.error('Bootstrap error:', err));
