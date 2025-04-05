import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSettingsCalendarComponent } from './global-settings-calendar.component';

describe('GlobalSettingsCalendarComponent', () => {
  let component: GlobalSettingsCalendarComponent;
  let fixture: ComponentFixture<GlobalSettingsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalSettingsCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalSettingsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
