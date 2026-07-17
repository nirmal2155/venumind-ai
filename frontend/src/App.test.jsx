import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mocking child components to isolate App testing
vi.mock('./pages/Dashboard', () => ({ default: () => <div data-testid="mock-dashboard">Dashboard</div> }));
vi.mock('./pages/Maps', () => ({ default: () => <div>Maps</div> }));

describe('App Component Structure', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing and includes main layout wrappers after splash and login', async () => {
    vi.useFakeTimers();

    // Mock logged in fan to bypass login redirect
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'venumind_user') return JSON.stringify({ role: 'fan', email: 'fan@fifa.org' });
      return null;
    });

    await act(async () => {
      render(<App />);
    });

    // Fast-forward boot splash screen timers
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    // Check if the bottom nav is rendered (indicates layout loaded)
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();

    // The "Hub" nav item should exist
    expect(screen.getAllByText('Hub')[0]).toBeInTheDocument();

    vi.useRealTimers();
  });
});
