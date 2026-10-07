import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders hero section correctly', () => {
  render(<App />);
  const heroTitle = screen.getByText(/From Resume to/i);
  expect(heroTitle).toBeInTheDocument();
});

test('generate portfolio button is initially disabled without a file', () => {
  render(<App />);
  const generateButton = screen.getByText(/Generate My Portfolio/i).closest('button');
  expect(generateButton).toBeDisabled();
});

test('can select different themes and AI models', () => {
  render(<App />);
  
  // Test theme selection
  const spaceTheme = screen.getByText(/Space/i).closest('button');
  fireEvent.click(spaceTheme);
  expect(spaceTheme).toHaveClass('active');

  // Test AI model selection
  const dualEngineBtn = screen.getByText(/Dual Engine/i).closest('button');
  fireEvent.click(dualEngineBtn);
  expect(dualEngineBtn).toHaveClass('active');
});
