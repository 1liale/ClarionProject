import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CallReportsTable from './CallReportsTable';

describe('CallReportsTable', () => {
  it('shows empty state when no reports', () => {
    render(<CallReportsTable reports={[]} loading={false} />);
    expect(screen.getByText(/No call reports yet/i)).toBeInTheDocument();
  });
}); 