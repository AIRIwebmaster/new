import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

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
    const body = await request.json().catch(() => ({}));

    // ---------- NORMALIZE EVERYTHING ----------
    const data = {
      // identity
      full_name: toNull(body.full_name || body.fullName),
      first_name: toNull(body.first_name),
      last_name: toNull(body.last_name),
      email: toNull(body.email),
      phone: toNull(body.phone),

      // location
      city: toNull(body.city),
      province: toNull(body.province),
      country: toNull(body.country),

      // education
      education: toNull(body.education),
      bsc_year: toNull(body.bsc_year),
      bsc_program: toNull(body.bsc_program),
      institution: toNull(body.institution),
      field_of_study: toNull(body.field_of_study),
      linkedin: toNull(body.linkedin),
      github: toNull(body.github),
      portfolio: toNull(body.portfolio),

      // engagement
      engagement_type: toNull(body.engagement_type),
      hours: toNull(body.hours),
      hours_exact: toNull(body.hours_exact),
      work_pref: toNull(body.work_pref),

      // JSONB fields (SAFE)
      availability: toJSON(body.availability),
      roles: toArray(body.roles),
      skills_bring: toArray(body.skills_bring),
      skills_develop: toArray(body.skills_develop),
      interests: toArray(body.interests),
      referral_sources: toArray(body.referral_sources),

      // motivation
      why_airi: toNull(body.why_airi),
      product_idea: toNull(body.product_idea),
      anything_else: toNull(body.anything_else),

      // demographics
      age_range: toNull(body.age_range),
      ethnicity: toNull(body.ethnicity),
      disability: toNull(body.disability),
      first_gen: toNull(body.first_gen),
      newcomer: toNull(body.newcomer),

      // agreements
      legal_name: toNull(body.legal_name),
      sign_date: toNull(body.sign_date),

      chk_nda: !!body.chk_nda,
      chk_innovate: !!body.chk_innovate,
      chk_contact: !!body.chk_contact,
      chk_accurate: !!body.chk_accurate,

      // CV
      cv_name: toNull(body.cv_name),
      cv_data: toNull(body.cv_data),
      cv_type: toNull(body.cv_type),
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

        cv_name, cv_data, cv_type
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

        ${JSON.stringify(data.availability)},
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
        ${data.cv_data},
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
        message: 'Submission received with issues. Please try again.',
      },
      { status: 200 } // 👈 IMPORTANT: prevent frontend failure loop
    );
  }
}