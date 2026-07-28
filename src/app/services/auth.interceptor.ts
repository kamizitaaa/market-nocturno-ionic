import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'auth_token';

// Interceptor funcional (standalone). Se registra en app.config.ts con withInterceptors([authInterceptor])
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // No pegar el token en endpoints públicos (evita mandar headers innecesarios)
  const rutasPublicas = ['/captcha', '/login', '/verificar-mfa', '/registro'];
  const esPublica = rutasPublicas.some(ruta => req.url.includes(ruta));

  if (esPublica) {
    return next(req);
  }

  return from(Preferences.get({ key: TOKEN_KEY })).pipe(
    switchMap(({ value: token }) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
      return next(authReq);
    })
  );
};
