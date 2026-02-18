import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

function clickCell(n) {
  fireEvent.click(screen.getByRole('gridcell', { name: new RegExp(`Square ${n},`, 'i') }));
}

test('renders header and initial status', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByText(/Retro Arcade Edition/i)).toBeInTheDocument();
  expect(screen.getByText(/Player X's turn/i)).toBeInTheDocument();
});

test('alternates turns between X and O', () => {
  render(<App />);

  clickCell(1);
  expect(screen.getByText(/Player O's turn/i)).toBeInTheDocument();

  clickCell(2);
  expect(screen.getByText(/Player X's turn/i)).toBeInTheDocument();
});

test('detects a win and disables further moves', () => {
  render(<App />);

  // X: 1, O: 4, X: 2, O: 5, X: 3 => X wins (top row)
  clickCell(1);
  clickCell(4);
  clickCell(2);
  clickCell(5);
  clickCell(3);

  expect(screen.getByText(/Player X wins!/i)).toBeInTheDocument();

  // Attempt another click should do nothing because game over
  const cell6 = screen.getByRole('gridcell', { name: /Square 6, empty/i });
  expect(cell6).toBeDisabled();
});

test('restart clears the board and resets to X turn', () => {
  render(<App />);

  clickCell(1);
  expect(screen.getByText(/Player O's turn/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /Restart/i }));
  expect(screen.getByText(/Player X's turn/i)).toBeInTheDocument();

  // Ensure the previously clicked cell is empty again (enabled)
  expect(screen.getByRole('gridcell', { name: /Square 1, empty/i })).toBeEnabled();
});

test('detects a draw', () => {
  render(<App />);

  /**
   * Draw sequence (no winning line):
   * X:1 O:2 X:3 O:5 X:4 O:6 X:8 O:7 X:9
   */
  clickCell(1); // X
  clickCell(2); // O
  clickCell(3); // X
  clickCell(5); // O
  clickCell(4); // X
  clickCell(6); // O
  clickCell(8); // X
  clickCell(7); // O
  clickCell(9); // X

  expect(screen.getByText(/It's a draw!/i)).toBeInTheDocument();
});
