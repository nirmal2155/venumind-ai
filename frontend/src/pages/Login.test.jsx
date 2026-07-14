import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from './Login';

describe('Login Component', () => {
  it('renders login tab switches and general portal options', () => {
    const handleSuccess = vi.fn();
    render(<Login onLoginSuccess={handleSuccess} />);

    expect(screen.getByText(/General Fan Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Authority Control/i)).toBeInTheDocument();

    const fanLoginBtn = screen.getByRole('button', { name: /Enter Stadium Portal/i });
    fireEvent.click(fanLoginBtn);

    expect(handleSuccess).toHaveBeenCalledWith({ role: 'fan', email: 'fan@fifaworldcup.com' });
  });

  it('validates authority credentials successfully', async () => {
    const handleSuccess = vi.fn();
    render(<Login onLoginSuccess={handleSuccess} />);

    const authTab = screen.getByText(/Authority Control/i);
    fireEvent.click(authTab);

    // Click submit without entering values to trigger error
    const authLoginBtn = screen.getByRole('button', { name: /Login Authority Portal/i });
    fireEvent.click(authLoginBtn);

    expect(screen.getByText(/All credentials are required/i)).toBeInTheDocument();

    // Enter correct values for collector
    const idInput = screen.getByPlaceholderText(/e.g. COLL-2026/i);
    const emailInput = screen.getByPlaceholderText(/authority@stadium.org/i);
    const passInput = screen.getByPlaceholderText(/••••••••/i);

    fireEvent.change(idInput, { target: { value: 'COLL-2026' } });
    fireEvent.change(emailInput, { target: { value: 'collector@fifa.org' } });
    fireEvent.change(passInput, { target: { value: 'securepassword123' } });

    fireEvent.click(authLoginBtn);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledWith({
        role: 'collector',
        email: 'collector@fifa.org',
        id: 'COLL-2026'
      });
    }, { timeout: 2000 });
  });
});
