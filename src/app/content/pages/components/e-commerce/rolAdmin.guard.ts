import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class RolAdminGuard implements CanActivate {
    private rol=null;
    constructor(private router: Router) {
        this.rol =JSON.parse(localStorage.getItem('identity'));

    }
    canActivate() {
        if (localStorage.getItem('token') && localStorage.getItem('identity')) {
            if(JSON.parse(localStorage.getItem('identity')).rol ==1){ //rol 1 administrador
                return true;

            }else{
                alert("Solo administradores");
                this.router.navigateByUrl('customers');
                return false;

            }
        }

        this.router.navigateByUrl('customers');
        return false;
    }
}
