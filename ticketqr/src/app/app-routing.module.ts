import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/generate', pathMatch: 'full' },
  {
    path: 'generate',
    loadChildren: () => import('./features/generate/generate.module').then(m => m.GenerateModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./features/scan/scan.module').then(m => m.ScanModule)
  },
  { path: '**', redirectTo: '/generate' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
