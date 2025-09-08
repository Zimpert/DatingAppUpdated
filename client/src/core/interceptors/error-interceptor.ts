import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);


  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modalStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modalStateErrors.push(error.error.errors[key]);
                }
              }
              throw modalStateErrors.flat();
            } else {
              toast.error(error.error);
            }
            break;
          case 401:
            toast.error('Unauthorized');
            router.navigate(['/login']);
            break;
          case 404:
            toast.error('Not Found');
            router.navigate(['/not-found']);
            break;
          case 500:
            const navigationExtra: NavigationExtras = {state: {error: error.error}};
            router.navigate(['/server-error'], navigationExtra);
            break;
            default:
              toast.error('Something unexpected went wrong');
              break;
        }
      }
      throw error;
    })
  );
};
