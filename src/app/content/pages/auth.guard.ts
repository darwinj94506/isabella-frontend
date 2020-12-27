import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    private rol=null;
    constructor(private router: Router) {
        this.rol =JSON.parse(localStorage.getItem('identity'));

    }
    canActivate() {
        if (localStorage.getItem('token') && localStorage.getItem('identity')) {
            if(JSON.parse(localStorage.getItem('identity')).rol ==1 || JSON.parse(localStorage.getItem('identity')).rol ==2){
                return true;

            }else{
                alert("Ingreso no autorizado");
                this.router.navigate(['/login']);
                return false;

            }
        }

        this.router.navigate(['/login']);
        return false;
    }
}
