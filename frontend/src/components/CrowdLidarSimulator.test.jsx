import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CrowdLidarSimulator from './CrowdLidarSimulator';
import { EmergencyProvider } from '../EmergencyContext';

describe('CrowdLidarSimulator Component', () => {
  it('renders canvas element successfully', () => {
    const { container } = render(
      <EmergencyProvider>
        <CrowdLidarSimulator routeGate="GATE B" />
      </EmergencyProvider>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
