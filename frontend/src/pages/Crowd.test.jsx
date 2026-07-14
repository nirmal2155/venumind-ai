import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Crowd from './Crowd';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('Crowd Component', () => {
  it('renders crowd gates information successfully', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <Crowd />
        </EmergencyProvider>
      </BrowserRouter>
    );

    // Verify key titles exist
    expect(screen.getByText(/Live Crowd/i)).toBeInTheDocument();
    expect(screen.getByText(/Analytics/i)).toBeInTheDocument();
  });
});
