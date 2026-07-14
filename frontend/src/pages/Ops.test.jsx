import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Ops from './Ops';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Ops Component', () => {
  it('renders control panel and triggers general safety alarm', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Ops />
        </EmergencyProvider>
      </BrowserRouter>
    );

    // Verify key titles and controls
    expect(screen.getByText(/LIVE HEATMAP/i)).toBeInTheDocument();
    expect(screen.getByText(/ECO INTELLIGENCE & SUSTAINABILITY/i)).toBeInTheDocument();

    // Verify trigger emergency evacuation button
    const alarmBtn = screen.getByText(/TRIGGER EMERGENCY EVACUATION/i);
    expect(alarmBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(alarmBtn);
    });
  });
});
