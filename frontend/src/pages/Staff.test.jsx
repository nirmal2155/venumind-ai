import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Staff from './Staff';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Staff Component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ reply: 'Security briefing loaded successfully.' })
      })
    ));
  });

  it('renders briefing roles and initiates dispatcher briefing loading with timer', async () => {
    vi.useFakeTimers();
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Staff />
        </EmergencyProvider>
      </BrowserRouter>
    );

    // Verify key titles exist
    expect(screen.getByText(/FIFA WORLD CUP 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Select your role to receive AI-generated task briefing/i)).toBeInTheDocument();

    // Select security role
    const securityBtn = screen.getByText('Security');
    expect(securityBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(securityBtn);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Check if fetch was triggered
    expect(global.fetch).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
