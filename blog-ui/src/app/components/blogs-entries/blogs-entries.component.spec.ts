import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsEntriesComponent } from './blogs-entries.component';

describe('BlogsEntriesComponent', () => {
  let component: BlogsEntriesComponent;
  let fixture: ComponentFixture<BlogsEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogsEntriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogsEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
