import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostPopularComponent } from './most-popular.component';

describe('MostPopularComponent', () => {
  let component: MostPopularComponent;
  let fixture: ComponentFixture<MostPopularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostPopularComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
