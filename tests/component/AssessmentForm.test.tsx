import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentForm } from '@/components/contact/AssessmentForm';

const NOTICE = 'Do not include client, patient or clinical information.';

function renderForm(configured = true) {
  return render(<AssessmentForm configured={configured} dataNotice={NOTICE} />);
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^name/i), 'Jordan Ellis');
  await user.type(screen.getByLabelText(/work email/i), 'jordan@example.com');
  await user.type(screen.getByLabelText(/organisation/i), 'Northgate Veterinary Group');
  await user.type(
    screen.getByLabelText(/what are you trying to recover/i),
    'We believe we are losing after-hours calls across four sites.'
  );
}

beforeEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AssessmentForm — unconfigured', () => {
  it('does not render a form at all, and says why', () => {
    renderForm(false);
    expect(screen.getByText(/form unavailable/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /work email/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /send request/i })).not.toBeInTheDocument();
  });
});

describe('AssessmentForm — configured', () => {
  it('renders every required field with an accessible name', () => {
    renderForm();
    expect(screen.getByLabelText(/^name/i)).toBeRequired();
    expect(screen.getByLabelText(/work email/i)).toBeRequired();
    expect(screen.getByLabelText(/organisation/i)).toBeRequired();
    expect(screen.getByLabelText(/^role$/i)).not.toBeRequired();
    expect(screen.getByLabelText(/sector/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sites/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what are you trying to recover/i)).toBeRequired();
  });

  it('shows the data-handling notice against the message field', () => {
    renderForm();
    const message = screen.getByLabelText(/what are you trying to recover/i);
    expect(message).toHaveAccessibleDescription(expect.stringContaining('clinical'));
  });

  it('includes a honeypot that is hidden from assistive technology', () => {
    const { container } = renderForm();
    const honeypot = container.querySelector('input[name="website"]');
    expect(honeypot).toBeTruthy();
    expect(honeypot?.closest('[aria-hidden="true"]')).toBeTruthy();
    expect(honeypot).toHaveAttribute('tabindex', '-1');
  });

  it('posts the collected values and shows the reference on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ status: 'success', reference: 'GL-260830-AB12X' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send request/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/contact');
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      name: 'Jordan Ellis',
      email: 'jordan@example.com',
      organisation: 'Northgate Veterinary Group',
      sector: 'veterinary',
    });
    expect(typeof body.elapsed).toBe('number');

    expect(await screen.findByText('GL-260830-AB12X')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /send request/i })).not.toBeInTheDocument();
  });

  it('surfaces server field errors against the right inputs', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          status: 'error',
          message: 'Some details need correcting before this can be sent.',
          fieldErrors: { email: 'Enter a valid work email address.' },
        }),
      })
    );

    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send request/i }));

    const email = await screen.findByLabelText(/work email/i);
    await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'));
    expect(email).toHaveAccessibleDescription(expect.stringContaining('valid work email'));
    expect(screen.getByRole('alert')).toHaveTextContent(/need correcting/i);
  });

  it('never claims success when no provider is configured server-side', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: async () => ({
          status: 'unconfigured',
          message: 'This site has no delivery provider configured, so nothing was sent.',
        }),
      })
    );

    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send request/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/nothing was sent/i);
    expect(screen.queryByText(/request received/i)).not.toBeInTheDocument();
    // The form is still there so the message is not lost.
    expect(screen.getByRole('button', { name: /send request/i })).toBeInTheDocument();
  });

  it('reports a network failure rather than silently succeeding', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));

    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send request/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not be sent/i);
  });
});
