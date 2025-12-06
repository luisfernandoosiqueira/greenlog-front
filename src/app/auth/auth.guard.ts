import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AlertService } from '../alert/alert.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const alert = inject(AlertService);

  if (auth.isAuthenticated()) {
    return true;
  }

  alert.warn('Acesso negado', 'Você precisa fazer login para acessar o sistema.');

  router.navigate(['/login'], {
    queryParams: {
      redirect: state.url,
      authError: true
    }
  });

  return false;
};
