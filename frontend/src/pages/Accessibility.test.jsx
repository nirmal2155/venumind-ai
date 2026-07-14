import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccessibilityPage from './Accessibility';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('AccessibilityPage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders settings options and toggles theme properties', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <AccessibilityPage />
        </EmergencyProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/AI-powered accessibility services/i)).toBeInTheDocument();
    
    // Toggle High Contrast Mode
    const contrastBtn = screen.getByText(/High Contrast Mode/i);
    expect(contrastBtn).toBeInTheDocument();

    fireEvent.click(contrastBtn);
  });

  it('generates dynamic AI accessibility calming routing guide successfully', async () => {
    const mockReply = 'Neurodivergent sensory path and quiet room guide';
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ reply: mockReply }),
    });

    render(
      <BrowserRouter>
        <EmergencyProvider>
          <AccessibilityPage />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const accessBtn = screen.getByRole('button', { name: /AI Sensory Guide Coordinator/i });
    fireEvent.click(accessBtn);

    await waitFor(() => {
      expect(screen.getByText(mockReply)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('triggers AI Emergency SOS and loads detailed emergency parameters', async () => {
    vi.useFakeTimers();

    render(
      <BrowserRouter>
        <EmergencyProvider>
          <AccessibilityPage />
        </EmergencyProvider>
      </BrowserRouter>
    );

    const sosBtn = screen.getByRole('button', { name: /AI EMERGENCY HELP \/ SOS/i });
    expect(sosBtn).toBeInTheDocument();

    fireEvent.click(sosBtn);

    // Should enter loading state
    expect(screen.getByText(/AI Locating & Dispatching emergency systems/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Check if details are populated
    expect(screen.getByText(/EXACT LOCATION/i)).toBeInTheDocument();
    expect(screen.getByText(/Level 1, Section 104, Row K, Seat 12/i)).toBeInTheDocument();
    expect(screen.getByText(/Security Officer Marcus/i)).toBeInTheDocument();
    expect(screen.getByText(/Medical Unit 3/i)).toBeInTheDocument();

    // Cancel SOS
    const cancelBtn = screen.getByText(/Cancel Request \/ Reset SOS/i);
    fireEvent.click(cancelBtn);

    expect(screen.queryByText(/EXACT LOCATION/i)).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
