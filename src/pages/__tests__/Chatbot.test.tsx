import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Chatbot from '../Chatbot';
import { __resetUsalatestaWidgetForTests } from '../../lib/usalatesta-widget';

const loadMock = vi.fn().mockResolvedValue(undefined);

vi.mock('../../lib/usalatesta-widget', async () => {
  const actual = await vi.importActual<typeof import('../../lib/usalatesta-widget')>(
    '../../lib/usalatesta-widget'
  );
  return {
    ...actual,
    getPartnerKey: () => 'test-partner-key',
    loadUsalatestaWidget: (...args: unknown[]) => loadMock(...args),
    syncUsalatestaViewportHeight: vi.fn(() => () => undefined),
  };
});

function renderChatbot() {
  return render(
    <MemoryRouter>
      <Chatbot />
    </MemoryRouter>
  );
}

describe('Chatbot page', () => {
  beforeEach(() => {
    localStorage.clear();
    __resetUsalatestaWidgetForTests();
    loadMock.mockClear();
  });

  afterEach(() => {
    __resetUsalatestaWidgetForTests();
  });

  it('asks for privacy consent before loading the widget', () => {
    renderChatbot();
    expect(screen.getByText('Privacy e consenso')).toBeInTheDocument();
    expect(document.getElementById('usalatesta-root')).toBeNull();
    expect(loadMock).not.toHaveBeenCalled();
  });

  it('attaches persistent #usalatesta-root after consent and does not use an iframe', () => {
    renderChatbot();
    fireEvent.click(screen.getByRole('button', { name: 'Acconsento' }));

    const root = document.getElementById('usalatesta-root');
    expect(root).toBeTruthy();
    expect(loadMock).toHaveBeenCalled();
    expect(root?.closest('iframe')).toBeNull();
    expect(document.querySelector('#usalatesta-root iframe')).toBeNull();
  });

  it('parks the root on unmount instead of destroying the widget DOM', () => {
    localStorage.setItem('usalatesta_chat_privacy_consent', 'true');
    const { unmount } = renderChatbot();

    const root = document.getElementById('usalatesta-root');
    expect(root).toBeTruthy();
    const marker = document.createElement('main');
    marker.className = 'ult-app';
    root!.appendChild(marker);

    unmount();

    const parked = document.getElementById('usalatesta-root');
    expect(parked).toBe(root);
    expect(parked!.parentElement).toBe(document.body);
    expect(parked!.getAttribute('data-usalatesta-parked')).toBe('true');
    expect(parked!.querySelector('.ult-app')).toBe(marker);
  });
});
