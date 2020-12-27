import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

@Component({
  selector: 'm-respuesta-mec',
  templateUrl: './respuesta-mec.component.html',
  styleUrls: ['./respuesta-mec.component.scss']
})
export class RespuestaMecComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

}
