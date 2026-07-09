import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { EmergencyProvider } from './EmergencyContext';

// Mocking child components to isolate App testing
vi.mock('./pages/Dashboard', () => ({ default: () => <div data-testid="mock-dashboard">Dashboard</div> }));
vi.mock('./pages/Maps', () => ({ default: () => <div>Maps</div> }));

describe('App Component Structure', () => {
  it('renders without crashing and includes main layout wrappers', () => {
    render(<App />);
    
    // Check if the bottom nav is rendered (indicates layout loaded)
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
    
    // The "Hub" nav item should exist
    expect(screen.getByText('Hub')).toBeInTheDocument();
  });
});
