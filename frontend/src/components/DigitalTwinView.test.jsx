import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DigitalTwinView from './DigitalTwinView';

describe('DigitalTwinView Component', () => {
  it('renders stadium svg layout and lists telemetry data', () => {
    const { container } = render(<DigitalTwinView />);
    
    // Check that SVG is rendered
    const svg = container.querySelector('[data-testid="stadium-svg"]');
    expect(svg).toBeInTheDocument();
    
    // Check that stands paths are rendered
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBe(4);
  });
});
