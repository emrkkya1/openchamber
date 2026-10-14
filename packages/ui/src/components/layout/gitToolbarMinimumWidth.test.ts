import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';

import { measureGitToolbarMinimumWidth } from './gitToolbarMinimumWidth';

test('measures the compact toolbar including its end padding without changing the live header', async () => {
  const dom = new Window();
  const originals = new Map<string, PropertyDescriptor | undefined>();
  for (const [name, value] of Object.entries({
    document: dom.document,
    HTMLElement: dom.HTMLElement,
    getComputedStyle: dom.getComputedStyle.bind(dom),
  })) {
    originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  }
  Object.defineProperty(dom.HTMLElement.prototype, 'scrollWidth', { configurable: true, get: () => 263 });
  const header = document.createElement('header');
  const slot = document.createElement('div');
  const toolbar = document.createElement('div');
  const row = document.createElement('div');
  row.style.paddingInlineEnd = '4px';
  toolbar.append(row);
  slot.append(toolbar);
  header.append(slot);
  document.body.append(header);
  const before = header.outerHTML;

  try {
    expect(measureGitToolbarMinimumWidth(toolbar)).toBe(267);
    expect(header.outerHTML).toBe(before);
    expect(header.children.length).toBe(1);
    expect(measureGitToolbarMinimumWidth(document.createElement('div'))).toBe(0);
  } finally {
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
    await dom.happyDOM.close();
  }
});
