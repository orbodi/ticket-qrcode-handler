import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'generate',
    loadChildren: () => import('./features/generate/generate.module').then(m => m.GenerateModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./features/scan/scan.module').then(m => m.ScanModule)
  },
  {
    path: 'tickets',
    loadChildren: () => import('./features/tickets/tickets.module').then(m => m.TicketsModule)
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
