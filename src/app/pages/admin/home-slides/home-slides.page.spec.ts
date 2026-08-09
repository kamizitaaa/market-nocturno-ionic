import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeSlidesPage } from './home-slides.page';

describe('HomeSlidesPage', () => {
  let component: HomeSlidesPage;
  let fixture: ComponentFixture<HomeSlidesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSlidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
