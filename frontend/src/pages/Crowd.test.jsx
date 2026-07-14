import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Crowd from './Crowd';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Crowd Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders crowd gates information successfully', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Crowd />
        </EmergencyProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Live Crowd/i)).toBeInTheDocument();
    expect(screen.getByText(/Analytics/i)).toBeInTheDocument();
  });

  it('generates dynamic AI crowd dispersion strategy successfully', async () => {
    const mockReply = 'Crowd control tactical dispersion instructions';
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ reply: mockReply }),
    });

    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Crowd />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const crowdBtn = screen.getByText(/Generate AI Dispersion Plan/i);
    fireEvent.click(crowdBtn);

    await waitFor(() => {
      expect(screen.getByText(mockReply)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
