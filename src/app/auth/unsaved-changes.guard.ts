import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AlertService } from '../alert/alert.service';

export interface CanComponentDeactivate {
  podeSair: () => boolean | Promise<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = async (component) => {
  const alert = inject(AlertService);

  if (!component || typeof component.podeSair !== 'function') {
    return true;
  }

  const result = component.podeSair();

  if (result instanceof Promise) {
    return result;
  }

  if (result === false) {
    const confirm = await alert.confirm(
      'Alterações não salvas',
      'Existem alterações não salvas. Deseja sair mesmo assim?'
    );
    return confirm.isConfirmed;
  }

  return result;
};
