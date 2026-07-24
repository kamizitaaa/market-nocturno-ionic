import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const roleGuard: CanActivateFn = () => {
  const router = inject(Router);
  const rol = localStorage.getItem('rol');

  if (rol === 'admin' || rol === 'superadmin') {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
