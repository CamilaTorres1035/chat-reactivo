import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinChatForm } from './join-chat-form';

describe('JoinChatForm', () => {
  let component: JoinChatForm;
  let fixture: ComponentFixture<JoinChatForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinChatForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinChatForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
