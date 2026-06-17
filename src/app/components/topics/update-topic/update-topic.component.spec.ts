import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTopicComponent } from './update-topic.component';

describe('UpdateTopicComponent', () => {
  let component: UpdateTopicComponent;
  let fixture: ComponentFixture<UpdateTopicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTopicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
