import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Maps from './Maps';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Maps Component', () => {
  it('renders maps selector and key elements successfully', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Maps />
        </EmergencyProvider>
      </BrowserRouter>
    );

    // Verify presence of mapping controls
    expect(screen.getByText(/AI Seat Angle Preview/i)).toBeInTheDocument();
    expect(screen.getByText(/AI AGENT ACTIVE: OPTIMIZING CROWD FLOW/i)).toBeInTheDocument();
    expect(screen.getByText(/MATCH KICKOFF/i)).toBeInTheDocument();
  });
});
