import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { put } from '@vercel/blob';

// ---------- SAFE HELPERS ----------
const toNull = (v: any) =>
  v === undefined || v === '' ? null : v;

const toArray = (v: any) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') return v.split(',').map(s => s.trim());
  return [];
};

const toJSON = (v: any) => {
  try {
    if (!v) return {};
    if (typeof v === 'string') return JSON.parse(v);
    return v;
  } catch {
    return {};
  }
};

// ---------- MAIN HANDLER ----------
export async function POST(request: NextRequest) {
  try {
    // SECURITY (lightweight but safe)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests' },
        { status: 429 }
      );
    }

    // ---------- RAW INPUT (NO SCHEMA = BULLETPROOF) ----------
    // const body = await request.json().catch(() => ({}));
    const formData = await request.formData()

    const cv = formData.get('cv') as File | null;

let cvUrl: string | null = null;

if (cv) {
  const safeName = `${Date.now()}-${cv.name.replace(/\s/g, '-')}`;
  const blob = await put(safeName, cv, {
  access: 'public',
});

  cvUrl = blob.url;
}

const get = (key: string) =>
  formData.get(key)?.toString?.() ?? null;
    // ---------- NORMALIZE EVERYTHING ----------
    const data = {
  // identity
  full_name: toNull(get('full_name')),
  first_name: toNull(get('first_name')),
  last_name: toNull(get('last_name')),
  email: toNull(get('email')),
  phone: toNull(get('phone')),

  // location
  city: toNull(get('city')),
  province: toNull(get('province')),
  country: toNull(get('country')),

  // education
  education: toNull(get('education')),
  bsc_year: toNull(get('bsc_year')),
  bsc_program: toNull(get('bsc_program')),
  institution: toNull(get('institution')),
  field_of_study: toNull(get('field_of_study')),
  linkedin: toNull(get('linkedin')),
  github: toNull(get('github')),
  portfolio: toNull(get('portfolio')),

  // engagement
  engagement_type: toNull(get('engagement_type')),
  hours: toNull(get('hours')),
  hours_exact: toNull(get('hours_exact')),
  work_pref: toNull(get('work_pref')),

  // JSON fields
  availability: toJSON(get('availability')),
  roles: toArray(get('roles')),
  skills_bring: toArray(get('skills_bring')),
  skills_develop: toArray(get('skills_develop')),
  interests: toArray(get('interests')),
  referral_sources: toArray(get('referral_sources')),

  // motivation
  why_airi: toNull(get('why_airi')),
  product_idea: toNull(get('product_idea')),
  anything_else: toNull(get('anything_else')),

  // demographics
  age_range: toNull(get('age_range')),
  ethnicity: toNull(get('ethnicity')),
  disability: toNull(get('disability')),
  first_gen: toNull(get('first_gen')),
  newcomer: toNull(get('newcomer')),

  // agreements
  legal_name: toNull(get('legal_name')),
  sign_date: toNull(get('sign_date')),

  chk_nda: get('chk_nda') === 'true',
  chk_innovate: get('chk_innovate') === 'true',
  chk_contact: get('chk_contact') === 'true',
  chk_accurate: get('chk_accurate') === 'true',

  // CV
  cv_name: cv?.name || null,
  cv_url: cvUrl,
  cv_type: cv?.type || null,
};

    // ---------- DATABASE INSERT (SAFE JSONB HANDLING) ----------
    await sql`
      INSERT INTO volunteer_applications (
        full_name, first_name, last_name, email, phone,

        city, province, country,

        education, bsc_year, bsc_program,
        institution, field_of_study,
        linkedin, github, portfolio,

        engagement_type, hours, hours_exact, work_pref,

        availability,
        roles, skills_bring, skills_develop, interests,
        referral_sources,

        why_airi, product_idea, anything_else,

        age_range, ethnicity, disability, first_gen, newcomer,

        legal_name, sign_date,

        chk_nda, chk_innovate, chk_contact, chk_accurate,

        cv_name, cv_url, cv_type
      )
      VALUES (
        ${data.full_name},
        ${data.first_name},
        ${data.last_name},
        ${data.email},
        ${data.phone},

        ${data.city},
        ${data.province},
        ${data.country},

        ${data.education},
        ${data.bsc_year},
        ${data.bsc_program},

        ${data.institution},
        ${data.field_of_study},
        ${data.linkedin},
        ${data.github},
        ${data.portfolio},

        ${data.engagement_type},
        ${data.hours},
        ${data.hours_exact},
        ${data.work_pref},

        ${data.availability},
        ${JSON.stringify(data.roles)},
        ${JSON.stringify(data.skills_bring)},
        ${JSON.stringify(data.skills_develop)},
        ${JSON.stringify(data.interests)},
        ${JSON.stringify(data.referral_sources)},

        ${data.why_airi},
        ${data.product_idea},
        ${data.anything_else},

        ${data.age_range},
        ${data.ethnicity},
        ${data.disability},
        ${data.first_gen},
        ${data.newcomer},

        ${data.legal_name},
        ${data.sign_date},

        ${data.chk_nda},
        ${data.chk_innovate},
        ${data.chk_contact},
        ${data.chk_accurate},

        ${data.cv_name},
        ${data.cv_url},
        ${data.cv_type}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Application received successfully',
    });
  } catch (error) {
    console.error('VOLUNTEER API ERROR:', error);

    // NEVER BREAK FRONTEND
     return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    },
    { status: 500 }
  );
  }
}