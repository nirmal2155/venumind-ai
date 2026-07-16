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

    expect(screen.getByText(/Lusail Stadium/i)).toBeInTheDocument();
    expect(screen.getByText(/Gate B Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Kickoff Countdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Operations Dashboard/i)).toBeInTheDocument();
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

  it('interacts with the Command Terminal Console successfully', async () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Dashboard />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Enter console command/i);
    fireEvent.change(input, { target: { value: '/help' } });
    fireEvent.submit(input);

    expect(screen.getByText(/\$ \/help/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/PROTOCOLS: \/status/i)).toBeInTheDocument();
    });
  });

  it('toggles the 5G AR HUD overlay showing real-time player stats', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Dashboard />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const toggleBtn = screen.getByText(/5G AR HUD: OFF/i);
    expect(screen.queryByText(/5G AR HUD OVERLAY/i)).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText(/5G AR HUD OVERLAY/i)).toBeInTheDocument();
    expect(screen.getByText(/Mbappé/i)).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.queryByText(/5G AR HUD OVERLAY/i)).not.toBeInTheDocument();
  });
});
