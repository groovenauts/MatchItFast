import React from 'react';
import { render, screen } from '@testing-library/react';
import Intro from './Intro';

test('renders learn react link', () => {
  render(<Intro />);
  const linkElement = screen.getByText(/MatchIt Fast/i);
  expect(linkElement).toBeInTheDocument();
});
