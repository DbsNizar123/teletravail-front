// show-requests.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowRequestsComponent } from './show-requests.component';
import { TeletravailRequestService } from '../services/teletravail-request.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShowRequestsComponent', () => {
  let component: ShowRequestsComponent;
  let fixture: ComponentFixture<ShowRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShowRequestsComponent],
      providers: [TeletravailRequestService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add this test
  it('should translate status correctly', () => {
    expect(component.translateStatus('pending')).toBe('En attente');
    expect(component.translateStatus('approved')).toBe('Approuvé');
    expect(component.translateStatus('rejected')).toBe('Rejeté');
    expect(component.translateStatus('unknown')).toBe('unknown');
  });
});