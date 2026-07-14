import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthorityDashboard from './AuthorityDashboard';
import { EmergencyProvider } from '../EmergencyContext';

describe('AuthorityDashboard Component', () => {
  const mockUser = {
    role: 'collector',
    email: 'collector@fifa.org',
    id: 'COLL-2026'
  };

  it('renders collector dashboards KPIs and switches roles correctly', () => {
    const handleLogout = vi.fn();
    render(
      <EmergencyProvider>
        <AuthorityDashboard user={mockUser} onLogout={handleLogout} />
      </EmergencyProvider>
    );

    expect(screen.getByText(/District Collector Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Overall Security Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Spectator Satisfaction/i)).toBeInTheDocument();

    // Switch role to Police
    const policeTab = screen.getByRole('button', { name: /POLICE/i });
    fireEvent.click(policeTab);

    expect(screen.getByText(/Police Command Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Sector 4 Outer Barrier/i)).toBeInTheDocument();
  });

  it('triggers emergency evacuation dispatch successfully', () => {
    const handleLogout = vi.fn();
    render(
      <EmergencyProvider>
        <AuthorityDashboard user={mockUser} onLogout={handleLogout} />
      </EmergencyProvider>
    );

    const dispatchBtn = screen.getByRole('button', { name: /DISPATCH EVACUATION/i });
    fireEvent.click(dispatchBtn);

    expect(screen.getByText(/EMERGENCY DISPATCHED/i)).toBeInTheDocument();
  });

  it('generates PDF and JSON reports successfully', async () => {
    const handleLogout = vi.fn();
    render(
      <EmergencyProvider>
        <AuthorityDashboard user={mockUser} onLogout={handleLogout} />
      </EmergencyProvider>
    );

    const pdfBtn = screen.getByRole('button', { name: /Download PDF Report/i });
    fireEvent.click(pdfBtn);

    expect(screen.getByText(/Generating PDF Report/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Saved: venumind_hq_report.pdf/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('interacts with AI Operations Assistant chatbot successfully', async () => {
    const handleLogout = vi.fn();
    render(
      <EmergencyProvider>
        <AuthorityDashboard user={mockUser} onLogout={handleLogout} />
      </EmergencyProvider>
    );

    expect(screen.getByText(/AI Operations Assistant/i)).toBeInTheDocument();

    const gateBtn = screen.getByRole('button', { name: /Where is Gate 5?/i });
    fireEvent.click(gateBtn);

    await waitFor(() => {
      expect(screen.getByText(/Gate 5 is at Sector 3 North/i)).toBeInTheDocument();
    });
  });

  it('connects to secure radio walkie talkie simulator successfully', async () => {
    const handleLogout = vi.fn();
    render(
      <EmergencyProvider>
        <AuthorityDashboard user={mockUser} onLogout={handleLogout} />
      </EmergencyProvider>
    );

    expect(screen.getByText(/Secure Live Radio Dispatch/i)).toBeInTheDocument();

    const connectBtn = screen.getByRole('button', { name: /Connect Operations Radio Channel/i });
    fireEvent.click(connectBtn);

    expect(screen.getByText(/TUNING FREQUENCY/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/RADIO ACTIVE/i)).toBeInTheDocument();
      expect(screen.getByText(/CONNECTION ESTABLISHED/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
