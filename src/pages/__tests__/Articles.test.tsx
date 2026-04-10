import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Articles from '../Articles';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ARTICLES } from '../../data/articles';

// Mock matchMedia if not present
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Articles component skeleton loading and fallback', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders skeleton loaders initially', () => {
    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves to keep it loading

    renderWithRouter(<Articles />);

    // The skeletons have data-testid="article-skeleton"
    const skeletons = screen.getAllByTestId('article-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    expect(skeletons.length).toBe(4);
  });

  it('renders successful fetch data and removes skeleton', async () => {
    const mockPosts = [
      {
        id: 999,
        title: { rendered: 'Test WP Article' },
        excerpt: { rendered: 'Test WP Excerpt' },
        content: { rendered: 'Test Content' },
        _embedded: {}
      }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPosts
    });

    renderWithRouter(<Articles />);

    // Should initially show skeleton
    expect(screen.getAllByTestId('article-skeleton').length).toBe(4);

    // Wait for the mock post to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test WP Article')).toBeInTheDocument();
    });

    // Skeleton should be gone
    expect(screen.queryByTestId('article-skeleton')).not.toBeInTheDocument();
  });

  it('renders local fallback articles on fetch error', async () => {
    // Mock fetch to reject
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    renderWithRouter(<Articles />);

    // Skeletons initially
    expect(screen.getAllByTestId('article-skeleton').length).toBe(4);

    // Wait for the fallback to load. The first local article is "Il gioco non è un lavoro"
    await waitFor(() => {
      expect(screen.getByText(ARTICLES[0].title)).toBeInTheDocument();
    });

    // Skeleton should be gone
    expect(screen.queryByTestId('article-skeleton')).not.toBeInTheDocument();
  });
});
