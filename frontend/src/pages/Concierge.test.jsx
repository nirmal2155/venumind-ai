import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Concierge from './Concierge';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Concierge Component', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ reply: 'Hello from Gemini AI!' })
      })
    ));
  });

  it('renders chatbot container and sends message successfully', async () => {
    vi.useFakeTimers();
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Concierge />
        </EmergencyProvider>
      </BrowserRouter>
    );

    // Verify title and input box exist
    expect(screen.getByText(/AI Assistant Active/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/Ask VenueMind/i);
    expect(input).toBeInTheDocument();

    // Type a message
    act(() => {
      fireEvent.change(input, { target: { value: 'How is the crowd at Gate A?' } });
    });
    
    // Submit message via the last button
    const buttons = screen.getAllByRole('button');
    const sendBtn = buttons[buttons.length - 1];
    
    act(() => {
      fireEvent.click(sendBtn);
    });

    // Advance timer to trigger the setTimeout call of 200ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('/api/chat', expect.any(Object));
    vi.useRealTimers();
  });
});
