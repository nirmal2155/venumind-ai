import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMatchTimer } from './useMatchTimer';

describe('useMatchTimer Custom Hook', () => {
  it('initializes with default remaining time', () => {
    const { result } = renderHook(() => useMatchTimer());
    expect(result.current.timeLeft).toBe(10088); 
  });

  it('formats timer values correctly', () => {
    const { result } = renderHook(() => useMatchTimer());
    expect(result.current.timerValues.hrs).toBe('02');
    expect(result.current.timerValues.mins).toBe('48');
  });

  it('should decrease timeLeft over time (mocked)', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMatchTimer());
    
    act(() => {
      vi.advanceTimersByTime(1000); 
    });

    expect(result.current.timeLeft).toBe(10087);
    
    vi.useRealTimers();
  });
});
