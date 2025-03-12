import { Routes } from '@angular/router';
import { CalculoDiluicaoComponent } from './pages/calculo-diluicao/calculo-diluicao.component';

export const routes: Routes = [
  {
    path: 'calculo-diluicao',
    component: CalculoDiluicaoComponent,
  },
	{
		path: '**',
		redirectTo: 'calculo-diluicao'
	}
];
