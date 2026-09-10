import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Chatbot from '../Chatbot';
import { __resetUsalatestaWidgetForTests } from '../../lib/usalatesta-widget';

vi.mock('../../lib/usalatesta-widget', async () => {
  const actual = await vi.importActual<typeof import('../../lib/usalatesta-widget')>(
    '../../lib/usalatesta-widget'
  );
  return {
    ...actual,
    getPartnerKey: () => 'test-partner-key',
    loadUsalatestaWidget: vi.fn().mockResolvedValue(undefined),
    unloadUsalatestaWidget: vi.fn(),
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
  afterEach(() => {
    localStorage.clear();
    __resetUsalatestaWidgetForTests();
  });

  it('asks for privacy consent before loading the widget', () => {
    renderChatbot();
    expect(screen.getByText('Privacy e consenso')).toBeInTheDocument();
    expect(document.getElementById('usalatesta-root')).toBeNull();
  });

  it('mounts #usalatesta-root after consent and does not use an iframe', () => {
    renderChatbot();
    fireEvent.click(screen.getByRole('button', { name: 'Acconsento' }));

    const root = document.getElementById('usalatesta-root');
    expect(root).toBeTruthy();
    expect(root?.closest('iframe')).toBeNull();
    expect(document.querySelector('#usalatesta-root iframe')).toBeNull();
  });
});
