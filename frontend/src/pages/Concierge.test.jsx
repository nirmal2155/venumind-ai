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

  it('interacts with the Gemini Live Audio Bridge panel', () => {
    vi.useFakeTimers();
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Concierge />
        </EmergencyProvider>
      </BrowserRouter>
    );

    // Verify initial text
    expect(screen.getByText(/Select language to begin Live Audio Translation/i)).toBeInTheDocument();
    
    // Find and click start button
    const startBtn = screen.getByText(/START AUDIO/i);
    act(() => {
      fireEvent.click(startBtn);
    });

    // Verify loading text
    expect(screen.getByText(/Establishing Gemini Live WebSocket Bridge/i)).toBeInTheDocument();

    // Advance time
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // Verify active translation text
    expect(screen.getByText(/Translation active: Translating English Commentary into English/i)).toBeInTheDocument();
    expect(screen.getByText(/DISCONNECT/i)).toBeInTheDocument();

    // Disconnect
    act(() => {
      fireEvent.click(screen.getByText(/DISCONNECT/i));
    });
    expect(screen.getByText(/Audio translation stream disconnected/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
