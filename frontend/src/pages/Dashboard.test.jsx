import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders stats grid and main dashboard cards', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Dashboard />
        </EmergencyProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/LUSAIL STADIUM/i)).toBeInTheDocument();
    expect(screen.getByText(/GATE B CAPACITY INDEX/i)).toBeInTheDocument();
    expect(screen.getByText(/KICKOFF COUNTDOWN/i)).toBeInTheDocument();
    expect(screen.getByText(/AI AGENT: MONIT_FLOW_ACTIVE/i)).toBeInTheDocument();
  });

  it('applies simulation presets correctly', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Dashboard />
        </EmergencyProvider>
      </BrowserRouter>
    );

    // Standard preset click
    const standardBtn = screen.getByText(/Standard Mode/i);
    fireEvent.click(standardBtn);
    expect(screen.getByText(/एआई सोलर ग्रिड/i)).toBeInTheDocument();

    // Crowd Surge preset click
    const surgeBtn = screen.getByText(/Crowd Surge Mode/i);
    fireEvent.click(surgeBtn);
    expect(screen.getByText(/EMERGENCY ACTIVE/i)).toBeInTheDocument();

    // Eco Match preset click
    const ecoBtn = screen.getByText(/Eco Match Mode/i);
    fireEvent.click(ecoBtn);
    expect(screen.getByText(/ECO PRESET ACTIVE/i)).toBeInTheDocument();
  });

  it('queries Transit Advisor AI successfully', async () => {
    const mockReply = 'Transit Option Recommendation';
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ reply: mockReply }),
    });

    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Dashboard />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const advisorBtn = screen.getByText(/Consult GenAI Transit Advisor/i);
    fireEvent.click(advisorBtn);

    await waitFor(() => {
      expect(screen.getByText(mockReply)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
