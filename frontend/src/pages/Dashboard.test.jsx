import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from './Dashboard';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Dashboard Component', () => {
  it('renders stats grid and main dashboard cards', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Dashboard />
        </EmergencyProvider>
      </BrowserRouter>
    );

    // Verify key metrics and titles exist
    expect(screen.getByText(/LUSAIL STADIUM/i)).toBeInTheDocument();
    expect(screen.getByText(/GATE B CAPACITY INDEX/i)).toBeInTheDocument();
    expect(screen.getByText(/KICKOFF COUNTDOWN/i)).toBeInTheDocument();
    expect(screen.getByText(/AI AGENT: MONIT_FLOW_ACTIVE/i)).toBeInTheDocument();
  });
});
