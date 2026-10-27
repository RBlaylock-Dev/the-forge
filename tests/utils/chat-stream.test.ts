import { createChatStreamParser, parseActions } from '@/utils/chat-stream';
import { ZONE_DEFS } from '@/data/zones';

describe('createChatStreamParser', () => {
  it('parses complete text events', () => {
    const parser = createChatStreamParser();
    const events = parser.push('data: {"text":"Hello"}\n\ndata: {"text":" world"}\n\n');
    expect(events).toEqual([
      { type: 'text', text: 'Hello' },
      { type: 'text', text: ' world' },
    ]);
  });

  it('buffers a data line split across chunks', () => {
    const parser = createChatStreamParser();
    expect(parser.push('data: {"te')).toEqual([]);
    expect(parser.push('xt":"spark"}\n\n')).toEqual([{ type: 'text', text: 'spark' }]);
  });

  it('surfaces error events', () => {
    const parser = createChatStreamParser();
    expect(parser.push('data: {"error":"lost its spark"}\n\n')).toEqual([
      { type: 'error', error: 'lost its spark' },
    ]);
  });

  it('recognises the done marker', () => {
    const parser = createChatStreamParser();
    expect(parser.push('data: [DONE]\n\n')).toEqual([{ type: 'done' }]);
  });

  it('ignores malformed payloads and non-data lines', () => {
    const parser = createChatStreamParser();
    expect(parser.push(': keep-alive\ndata: {not json}\n\n')).toEqual([]);
  });

  it('flushes a trailing line without a newline', () => {
    const parser = createChatStreamParser();
    parser.push('data: {"text":"tail"}');
    expect(parser.flush()).toEqual([{ type: 'text', text: 'tail' }]);
    expect(parser.flush()).toEqual([]);
  });
});

describe('parseActions', () => {
  const [zoneId, zone] = Object.entries(ZONE_DEFS)[0];

  it('replaces zone tokens with the zone name and collects the action', () => {
    const { cleanText, actions } = parseActions(`Visit the [[zone:${zoneId}]] next.`);
    expect(cleanText).toBe(`Visit the ${zone.name} next.`);
    expect(actions).toEqual([{ type: 'zone', value: zoneId }]);
  });

  it('collects contact and resume actions', () => {
    const { cleanText, actions } = parseActions(
      'Reach out [[action:contact]] or read [[action:resume]]',
    );
    expect(cleanText).toBe('Reach out  or read ');
    expect(actions).toEqual([
      { type: 'contact', value: 'contact' },
      { type: 'resume', value: 'resume' },
    ]);
  });

  it('drops unknown zones and actions', () => {
    const { cleanText, actions } = parseActions('[[zone:moon]][[action:delete-everything]]ok');
    expect(cleanText).toBe('ok');
    expect(actions).toEqual([]);
  });

  it('leaves plain text untouched', () => {
    expect(parseActions('Just text.')).toEqual({ cleanText: 'Just text.', actions: [] });
  });
});
