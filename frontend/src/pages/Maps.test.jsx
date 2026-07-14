import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Maps from './Maps';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Maps Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders maps selector and key elements successfully', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Maps />
        </EmergencyProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/AI Seat Angle Preview/i)).toBeInTheDocument();
    expect(screen.getByText(/AI AGENT ACTIVE: OPTIMIZING CROWD FLOW/i)).toBeInTheDocument();
    expect(screen.getByText(/MATCH KICKOFF/i)).toBeInTheDocument();
  });

  it('calculates dynamic GenAI safest path routing advice successfully', async () => {
    const mockReply = 'Maps Navigation Safest Route Recommendation';
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ reply: mockReply }),
    });

    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Maps />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const navBtn = screen.getByText(/Ask AI Navigator for Safest Path/i);
    fireEvent.click(navBtn);

    await waitFor(() => {
      expect(screen.getByText(mockReply)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
