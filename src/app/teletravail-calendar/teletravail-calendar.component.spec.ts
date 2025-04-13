import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeletravailCalendarComponent } from './teletravail-calendar.component';

describe('TeletravailCalendarComponent', () => {
  let component: TeletravailCalendarComponent;
  let fixture: ComponentFixture<TeletravailCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeletravailCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeletravailCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
