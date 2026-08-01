import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const rol = await authService.getRol();

  if (rol === 'admin' || rol === 'superadmin') {
    return true;
  }

  router.navigate(['/home']);
  return false;
};