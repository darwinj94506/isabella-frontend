import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaMecComponent } from './respuesta-mec.component';

describe('RespuestaMecComponent', () => {
  let component: RespuestaMecComponent;
  let fixture: ComponentFixture<RespuestaMecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespuestaMecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaMecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
