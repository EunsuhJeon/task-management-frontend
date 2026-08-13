import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Taskflow auth entry', async () => {
  render(<App />);
  expect(await screen.findByText(/Taskflow/i)).toBeInTheDocument();
});
