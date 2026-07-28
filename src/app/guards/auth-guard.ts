import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const autenticado = await authService.isAuthenticated();

  if (autenticado) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};