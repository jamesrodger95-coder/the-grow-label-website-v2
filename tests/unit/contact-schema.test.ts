import { describe, expect, it } from 'vitest';
import { contactSchema, toFieldErrors } from '@/lib/contact-schema';

const valid = {
  name: 'Jordan Ellis',
  email: 'jordan@example.com',
  organisation: 'Northgate Veterinary Group',
  role: 'Operations Director',
  sector: 'veterinary',
  sites: '6-15',
  message: 'We think we are losing after-hours calls across four of our sites.',
  website: '',
  elapsed: 9000,
};

describe('contactSchema', () => {
  it('accepts a well-formed submission', () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('trims surrounding whitespace on text fields', () => {
    const result = contactSchema.safeParse({ ...valid, name: '  Jordan Ellis  ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe('Jordan Ellis');
  });

  it('rejects a name that is only whitespace', () => {
    const result = contactSchema.safeParse({ ...valid, name: '    ' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'jordan@' });
    expect(result.success).toBe(false);
    if (!result.success) expect(toFieldErrors(result.error).email).toBeTruthy();
  });

  it('rejects a message shorter than the minimum', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'too short' });
    expect(result.success).toBe(false);
    if (!result.success) expect(toFieldErrors(result.error).message).toBeTruthy();
  });

  it('rejects a message longer than the cap', () => {
    const result = contactSchema.safeParse({ ...valid, message: 'x'.repeat(2001) });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown sector or site band', () => {
    expect(contactSchema.safeParse({ ...valid, sector: 'aviation' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, sites: '900' }).success).toBe(false);
  });

  it('rejects a filled honeypot', () => {
    const result = contactSchema.safeParse({ ...valid, website: 'https://spam.example' });
    expect(result.success).toBe(false);
  });

  it('treats role as optional', () => {
    const { role: _role, ...withoutRole } = valid;
    expect(contactSchema.safeParse(withoutRole).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, role: '' }).success).toBe(true);
  });
});

describe('toFieldErrors', () => {
  it('maps each failing field to a human-readable message, first error only', () => {
    const result = contactSchema.safeParse({
      name: '',
      email: 'nope',
      organisation: '',
      sector: 'veterinary',
      sites: '1',
      message: 'short',
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    const errors = toFieldErrors(result.error);
    expect(errors.name).toContain('name');
    expect(errors.email).toContain('email');
    expect(errors.organisation).toContain('group or practice');
    expect(errors.message).toContain('recover');
  });
});
