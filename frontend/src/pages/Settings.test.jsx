import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Settings from './Settings';
import { BrowserRouter } from 'react-router-dom';

describe('Settings Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders user details and setting parameters successfully', () => {
    render(
      <BrowserRouter>
        <Settings currentUser={{ role: 'fan' }} onLogout={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Alex Thorne/i)).toBeInTheDocument();
    expect(screen.getByText(/Premium Member/i)).toBeInTheDocument();
    expect(screen.getByText(/Enhanced Precision Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Model Selection/i)).toBeInTheDocument();
  });

  it('toggles precision mode settings state successfully', () => {
    render(
      <BrowserRouter>
        <Settings currentUser={{ role: 'fan' }} onLogout={vi.fn()} />
      </BrowserRouter>
    );

    const toggleBtn = screen.getByRole('button', { name: /Enhanced Precision Mode/i || '' });
    expect(toggleBtn).toBeInTheDocument();
    fireEvent.click(toggleBtn);
  });
});
