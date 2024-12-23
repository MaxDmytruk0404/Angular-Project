import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFilterComponent } from './home-filter.component';

describe('HomeFilterComponent', () => {
  let component: HomeFilterComponent;
  let fixture: ComponentFixture<HomeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
