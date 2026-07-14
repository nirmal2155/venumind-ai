import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Ops from './Ops';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Ops Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders control panel and triggers general safety alarm', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Ops />
        </EmergencyProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/LIVE HEATMAP/i)).toBeInTheDocument();
    expect(screen.getByText(/ECO INTELLIGENCE & SUSTAINABILITY/i)).toBeInTheDocument();

    const alarmBtn = screen.getByText(/TRIGGER EMERGENCY EVACUATION/i);
    expect(alarmBtn).toBeInTheDocument();
    fireEvent.click(alarmBtn);
  });

  it('runs energy optimization grid advisory successfully', async () => {
    const mockReply = 'Eco Smart energy grid optimizations';
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ reply: mockReply }),
    });

    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Ops />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const ecoBtn = screen.getByText(/Run GenAI Eco Grid Optimization/i);
    fireEvent.click(ecoBtn);

    await waitFor(() => {
      expect(screen.getByText(mockReply)).toBeInTheDocument();
    });
  });

  it('formulates breach containment tactical directives successfully', async () => {
    const mockReply = 'Breach containment drone and steward vectors';
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ reply: mockReply }),
    });

    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Ops />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const breachBtn = screen.getByText(/Generate AI Breach Containment Plan/i);
    fireEvent.click(breachBtn);

    await waitFor(() => {
      expect(screen.getByText(mockReply)).toBeInTheDocument();
    });
  });
});
