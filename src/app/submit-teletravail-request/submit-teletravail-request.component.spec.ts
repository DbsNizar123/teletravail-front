import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitTeletravailRequestComponent } from './submit-teletravail-request.component';

describe('SubmitTeletravailRequestComponent', () => {
  let component: SubmitTeletravailRequestComponent;
  let fixture: ComponentFixture<SubmitTeletravailRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitTeletravailRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmitTeletravailRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
