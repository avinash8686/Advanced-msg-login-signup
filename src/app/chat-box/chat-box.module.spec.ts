import { ChatBoxModule } from './chat-box.module';

describe('ChatBoxModule', () => {
  let chatBoxModule: ChatBoxModule;

  beforeEach(() => {
    chatBoxModule = new ChatBoxModule();
  });

  it('should create an instance', () => {
    expect(chatBoxModule).toBeTruthy();
  });
});
