import { useEffect, useState } from 'react';

export default function App() {
  const [state, setState] = useState({
    status: 'loading',
    message: 'Loading backend response...',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadMessage() {
      try {
        const response = await fetch('/api/hello');

        if (!response.ok) {
          throw new Error(`Backend returned HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.message) {
          throw new Error('Backend response did not include a message');
        }

        if (!cancelled) {
          setState({ status: 'success', message: data.message });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: `Failed to load backend response: ${error.message}`,
          });
        }
      }
    }

    loadMessage();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main
      style={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        margin: 0,
        padding: '24px',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: '#f7f9fc',
        color: '#1f2933',
      }}
    >
      <section
        aria-live="polite"
        style={{
          width: 'min(100%, 520px)',
          border: '1px solid #d9e2ec',
          borderRadius: '8px',
          background: '#ffffff',
          padding: '28px',
          boxShadow: '0 14px 38px rgb(15 23 42 / 0.08)',
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            color: state.status === 'error' ? '#b42318' : '#2563eb',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {state.status}
        </p>
        <h1 style={{ margin: 0, fontSize: '2rem', lineHeight: 1.15 }}>
          Full-stack preview fixture
        </h1>
        <p style={{ margin: '16px 0 0', fontSize: '1.1rem', lineHeight: 1.6 }}>
          {state.message}
        </p>
      </section>
    </main>
  );
}
