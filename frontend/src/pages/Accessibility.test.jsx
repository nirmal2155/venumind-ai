import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AccessibilityPage from './Accessibility';
import { EmergencyProvider } from '../EmergencyContext';
import { BrowserRouter } from 'react-router-dom';

describe('AccessibilityPage Component', () => {
  it('renders settings options and toggles theme properties', () => {
    render(
      <BrowserRouter>
        <EmergencyProvider>
          <AccessibilityPage />
        </EmergencyProvider>
      </BrowserRouter>
    );

    // Verify key titles exist
    expect(screen.getByText(/AI-powered accessibility services/i)).toBeInTheDocument();
    
    // Toggle High Contrast Mode
    const contrastBtn = screen.getByText(/High Contrast Mode/i);
    expect(contrastBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(contrastBtn);
    });
  });
});
