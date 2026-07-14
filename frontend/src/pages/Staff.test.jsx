import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Staff from './Staff';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Staff Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders briefing roles and initiates dispatcher briefing loading with timer', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ reply: 'Security briefing loaded successfully.' })
      })
    );

    vi.useFakeTimers();
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Staff />
        </EmergencyProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/FIFA WORLD CUP 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Select your role to receive AI-generated task briefing/i)).toBeInTheDocument();

    const securityBtn = screen.getByText('Security');
    expect(securityBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(securityBtn);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('calculates volunteer and security resource allocation advice successfully', async () => {
    const mockReply = 'Staff resource allocation recommendations for critical surge';
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ reply: mockReply }),
    });

    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Staff />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const allocationBtn = screen.getByText(/Run GenAI Staff Resource Allocator/i);
    fireEvent.click(allocationBtn);

    await waitFor(() => {
      expect(screen.getByText(mockReply)).toBeInTheDocument();
      // Assertions for detailed AI resource allocations
      expect(screen.getByText(/SECURITY STEWARDS/i)).toBeInTheDocument();
      expect(screen.getByText(/140 Required/i)).toBeInTheDocument();
      expect(screen.getByText(/VOLUNTEERS/i)).toBeInTheDocument();
      expect(screen.getByText(/280 Required/i)).toBeInTheDocument();
      expect(screen.getByText(/AMBULANCES/i)).toBeInTheDocument();
      expect(screen.getByText(/6 Units/i)).toBeInTheDocument();
      expect(screen.getByText(/HIGH-FLOW TOILETS/i)).toBeInTheDocument();
      expect(screen.getByText(/45 Stalls/i)).toBeInTheDocument();
      expect(screen.getByText(/15,000 Liters/i)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
