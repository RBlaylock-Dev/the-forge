import { useChatStore } from '@/store/useChatStore';

beforeEach(() => {
  useChatStore.setState({ messages: [], isOpen: false, isLoading: false, error: null });
});

describe('useChatStore', () => {
  it('opens and closes the panel', () => {
    useChatStore.getState().openChat();
    expect(useChatStore.getState().isOpen).toBe(true);
    useChatStore.getState().closeChat();
    expect(useChatStore.getState().isOpen).toBe(false);
  });

  it('adds messages and clears any error', () => {
    useChatStore.getState().setError('boom');
    useChatStore.getState().addMessage('user', 'Hi');
    const { messages, error } = useChatStore.getState();
    expect(messages).toHaveLength(1);
    expect(messages[0]).toMatchObject({ role: 'user', content: 'Hi' });
    expect(error).toBeNull();
  });

  it('prunes history to the 50 most recent messages', () => {
    for (let i = 0; i < 55; i++) useChatStore.getState().addMessage('user', `m${i}`);
    const { messages } = useChatStore.getState();
    expect(messages).toHaveLength(50);
    expect(messages[0].content).toBe('m5');
    expect(messages[49].content).toBe('m54');
  });

  it('streams into the last assistant message', () => {
    const s = useChatStore.getState();
    s.addMessage('user', 'Q');
    s.addMessage('assistant', '');
    s.updateLastAssistant('Partial');
    s.updateLastAssistant('Partial answer');
    const { messages } = useChatStore.getState();
    expect(messages[1].content).toBe('Partial answer');
    expect(messages[0].content).toBe('Q');
  });

  it('clears messages', () => {
    useChatStore.getState().addMessage('user', 'Hi');
    useChatStore.getState().clearMessages();
    expect(useChatStore.getState().messages).toEqual([]);
  });
});
