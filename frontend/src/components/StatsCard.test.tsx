import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatsCard from './StatsCard';
import { Phone } from 'lucide-react';

describe('StatsCard', () => {
  it('renders title, value and trend information', () => {
    render(<StatsCard title="Total Calls" value="42" icon={Phone} trend="5%" trendUp />);

    expect(screen.getByText('Total Calls')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('5%')).toBeInTheDocument();
  });
}); 