/** Measures the Git toolbar with its picker labels fully collapsed. */
export function measureGitToolbarMinimumWidth(toolbar: HTMLElement): number {
  const parent = toolbar.parentElement?.parentElement;
  if (!parent) return 0;

  const probe = toolbar.cloneNode(true);
  if (!(probe instanceof HTMLElement)) return 0;
  probe.inert = true;
  probe.setAttribute('aria-hidden', 'true');
  Object.assign(probe.style, {
    position: 'absolute',
    visibility: 'hidden',
    pointerEvents: 'none',
    width: '0px',
    flex: 'none',
    transition: 'none',
  });
  // Outside the slot observed by ContextPanel, so the probe cannot retrigger it.
  parent.append(probe);
  try {
    const row = probe.firstElementChild;
    const endPadding = row instanceof HTMLElement
      ? Number.parseFloat(getComputedStyle(row).paddingInlineEnd) || 0
      : 0;
    return Math.ceil(probe.scrollWidth + endPadding);
  } finally {
    probe.remove();
  }
}
