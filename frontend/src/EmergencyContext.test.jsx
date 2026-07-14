import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmergencyProvider, useEmergency } from './EmergencyContext';

// Helper component to consume context
const TestComponent = () => {
  const { isEmergency, setEmergency } = useEmergency();
  return (
    <div>
      <span data-testid="status">{isEmergency ? 'EMERGENCY' : 'NORMAL'}</span>
      <button onClick={() => setEmergency(true)}>Trigger</button>
      <button onClick={() => setEmergency(false)}>Reset</button>
    </div>
  );
};

describe('EmergencyContext', () => {
  it('provides default isEmergency state as false', () => {
    render(
      <EmergencyProvider>
        <TestComponent />
      </EmergencyProvider>
    );
    expect(screen.getByTestId('status').textContent).toBe('NORMAL');
  });

  it('toggles isEmergency to true on trigger', () => {
    render(
      <EmergencyProvider>
        <TestComponent />
      </EmergencyProvider>
    );
    const triggerBtn = screen.getByText('Trigger');
    act(() => {
      triggerBtn.click();
    });
    expect(screen.getByTestId('status').textContent).toBe('EMERGENCY');
  });

  it('resets isEmergency to false on reset', () => {
    render(
      <EmergencyProvider>
        <TestComponent />
      </EmergencyProvider>
    );
    const triggerBtn = screen.getByText('Trigger');
    const resetBtn = screen.getByText('Reset');
    act(() => {
      triggerBtn.click();
    });
    expect(screen.getByTestId('status').textContent).toBe('EMERGENCY');
    act(() => {
      resetBtn.click();
    });
    expect(screen.getByTestId('status').textContent).toBe('NORMAL');
  });
});
