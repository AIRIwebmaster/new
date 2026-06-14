import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { verifyTurnstile } from '@/lib/turnstile';
import { sanitizeObject } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';

// const volunteerSchema = z.object({
//   fullName: z.string().min(2, 'Name must be at least 2 characters').max(200),
//   email: z.string().email('Please enter a valid email address').max(255),
//   phone: z.string().max(50).optional().or(z.literal('')),
//   interest: z.string().min(1, 'Please select an area of interest').max(100),
//   availability: z.string().min(1, 'Please select your availability').max(100),
//   experience: z.string().max(1000).optional().or(z.literal('')),
//   message: z.string().max(1000).optional().or(z.literal('')),
//   // turnstileToken: z.string().min(1, 'Please complete the verification'),
//   turnstileToken: z.string().optional(),
// });

const volunteerSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email().max(255),

  phone: z.string().max(50).optional().or(z.literal('')),
  // interest: z.string().optional().or(z.literal('')),
  // availability: z.string().optional().or(z.literal('')),
  availability: z.any().optional(),
  experience: z.string().max(1000).optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),

  // NEW FULL FORM FIELDS
  roles: z.array(z.string()).optional(),
  skillsBring: z.array(z.string()).optional(),
  skillsDevelop: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),

  engagementType: z.string().optional().or(z.literal('')),
  hours: z.string().optional().or(z.literal('')),
  workPref: z.string().optional().or(z.literal('')),

  referralSources: z.array(z.string()).optional(),
  referralDetail: z.string().optional().or(z.literal('')),

  education: z.string().optional().or(z.literal('')),
  linkedin: z.string().optional().or(z.literal('')),
  github: z.string().optional().or(z.literal('')),
  portfolio: z.string().optional().or(z.literal('')),

  city: z.string().optional().or(z.literal('')),
  province: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),

  whyAiri: z.string().optional().or(z.literal('')),
  productIdea: z.string().optional().or(z.literal('')),
  anythingElse: z.string().optional().or(z.literal('')),

  ageRange: z.string().optional().or(z.literal('')),
  ethnicity: z.string().optional().or(z.literal('')),
  disability: z.string().optional().or(z.literal('')),
  firstGen: z.string().optional().or(z.literal('')),
  newcomer: z.string().optional().or(z.literal('')),

  legalName: z.string().optional().or(z.literal('')),
  signDate: z.string().optional().or(z.literal('')),

  chkNda: z.boolean().optional(),
  chkInnovate: z.boolean().optional(),
  chkContact: z.boolean().optional(),
  chkAccurate: z.boolean().optional(),

  cvName: z.string().optional().or(z.literal('')),
  cvData: z.string().optional().or(z.literal('')),

  turnstileToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');

    if (
      origin &&
      !origin.endsWith('airifoundation.org') &&
      !origin.includes('localhost')
    ) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please wait.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { turnstileToken, ...raw } = volunteerSchema.parse(body);

    // Turnstile
    if (turnstileToken) {
      const verified = await verifyTurnstile(turnstileToken);

      if (!verified) {
        return NextResponse.json(
          { success: false, message: 'Verification failed' },
          { status: 403 }
        );
      }
    }

    const clean = sanitizeObject(raw);

    // 🔥 NORMALIZATION (VERY IMPORTANT FIX)
    const insertData = {
      full_name: clean.fullName,
      email: clean.email,
      phone: clean.phone || null,

      roles: (clean.roles || []).join(', '),
skills_bring: (clean.skillsBring || []).join(', '),
skills_develop: (clean.skillsDevelop || []).join(', '),
      interests: (clean.interests || []).join(', '),
      engagement_type: clean.engagementType || null,
      hours: clean.hours || null,
      work_pref: clean.workPref || null,

      // referral_sources: Array.isArray(clean.referralSources)
      //   ? clean.referralSources
      //   : clean.referralSources || null,

  //     referral_sources: Array.isArray(clean.referralSources)
  // ? clean.referralSources.join(', ')
  // : clean.referralSources || null,

      // referral_sources: (clean.referralSources || []).join(', '),
      referral_sources: clean.referralSources?.length
  ? clean.referralSources.join(', ')
  : null,

      referral_detail: clean.referralDetail || null,

      education: clean.education || null,
      linkedin: clean.linkedin || null,
      github: clean.github || null,
      portfolio: clean.portfolio || null,

      city: clean.city || null,
      province: clean.province || null,
      country: clean.country || null,

      why_airi: clean.whyAiri || null,
      product_idea: clean.productIdea || null,
      anything_else: clean.anythingElse || null,

  //     availability: clean.availability
  // ? JSON.stringify(clean.availability)
  // : null,

      availability: clean.availability
  ? JSON.stringify(clean.availability)
  : null,

      age_range: clean.ageRange || null,
      ethnicity: clean.ethnicity || null,
      disability: clean.disability || null,
      first_gen: clean.firstGen || null,
      newcomer: clean.newcomer || null,

      legal_name: clean.legalName || null,
      sign_date: clean.signDate || null,

      chk_nda: !!clean.chkNda,
      chk_innovate: !!clean.chkInnovate,
      chk_contact: !!clean.chkContact,
      chk_accurate: !!clean.chkAccurate,

      cv_name: clean.cvName || null,
      cv_data:
  typeof clean.cvData === "string"
    ? clean.cvData.substring(0, 200000)
    : null,
    };
    

    await sql`
      INSERT INTO volunteer_applications (
        full_name, email, phone,
        roles, skills_bring, skills_develop, interests,
        engagement_type, hours, work_pref,
        referral_sources, referral_detail,
        education, linkedin, github, portfolio,
        city, province, country,
        why_airi, product_idea, anything_else,
        availability,
        age_range, ethnicity, disability, first_gen, newcomer,
        legal_name, sign_date,
        chk_nda, chk_innovate, chk_contact, chk_accurate,
        cv_name, cv_data
      )
      VALUES (
        ${insertData.full_name}, ${insertData.email}, ${insertData.phone},
        ${insertData.roles}, ${insertData.skills_bring}, ${insertData.skills_develop}, ${insertData.interests},
        ${insertData.engagement_type}, ${insertData.hours}, ${insertData.work_pref},
        ${insertData.referral_sources}, ${insertData.referral_detail},
        ${insertData.education}, ${insertData.linkedin}, ${insertData.github}, ${insertData.portfolio},
        ${insertData.city}, ${insertData.province}, ${insertData.country},
        ${insertData.why_airi}, ${insertData.product_idea}, ${insertData.anything_else},
        ${insertData.availability},
        ${insertData.age_range}, ${insertData.ethnicity}, ${insertData.disability}, ${insertData.first_gen}, ${insertData.newcomer},
        ${insertData.legal_name}, ${insertData.sign_date},
        ${insertData.chk_nda}, ${insertData.chk_innovate}, ${insertData.chk_contact}, ${insertData.chk_accurate},
        ${insertData.cv_name}, ${insertData.cv_data}
      )
    `;

    // OPTIONAL: send emails here
    // await sendEmails(insertData);

    return NextResponse.json({
      success: true,
      message: 'Application received successfully',
    });
  } catch (error) {
  console.error("FULL ERROR:", error);

  return NextResponse.json(
    {
      success: false,
      message: "Server error",
      debug: error instanceof Error ? error.message : error
    },
    { status: 500 }
  );


}
}
    

    

// export async function POST(request: NextRequest) {
//   try {
//     const origin = request.headers.get('origin');
//     if (origin && !origin.endsWith('airifoundation.org') && !origin.includes('localhost')) {
//       return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
//     }

//     const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
//     if (!rateLimit(ip)) {
//       return NextResponse.json({ success: false, message: 'Too many requests. Please wait a moment.' }, { status: 429 });
//     }

//     const body = await request.json();
//     const { turnstileToken, ...data } = volunteerSchema.parse(body);

//     if (turnstileToken) {
//   const verified = await verifyTurnstile(turnstileToken);

//   if (!verified) {
//     return NextResponse.json(
//       { success: false, message: 'Verification failed. Please try again.' },
//       { status: 403 }
//     );
//   }
// }

//     const clean = sanitizeObject(data);


//     await sql`
// INSERT INTO volunteer_applications (
//   full_name, email, phone,
//   roles, skills_bring, skills_develop,
//   engagement_type, hours, work_pref,
//   referral_sources, referral_detail,
//   education, linkedin, github, portfolio,
//   city, province, country,
//   why_airi, product_idea, anything_else,
//   availability,
//   cv_name, cv_data
// )
// VALUES (
//   ${clean.full_name}, ${clean.email}, ${clean.phone},
//   ${clean.roles}, ${clean.skills_bring}, ${clean.skills_develop},
//   ${clean.engagement_type}, ${clean.hours}, ${clean.work_pref},
//   ${clean.referral_sources}, ${clean.referral_detail},
//   ${clean.education}, ${clean.linkedin}, ${clean.github}, ${clean.portfolio},
//   ${clean.city}, ${clean.province}, ${clean.country},
//   ${clean.why_airi}, ${clean.product_idea}, ${clean.anything_else},
//   ${clean.availability},
//   ${clean.cv_name}, ${clean.cv_data}
// )
// `;

//     // await sql`
//     //   INSERT INTO volunteer_applications (full_name, email, phone, interest, availability, experience, message)
//     //   VALUES (${clean.fullName}, ${clean.email}, ${clean.phone || null}, ${clean.interest}, ${clean.availability}, ${clean.experience || null}, ${clean.message || null})
//     // `;

//     return NextResponse.json({
//       success: true,
//       message: 'Your application has been received. We will be in touch soon.',
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { success: false, message: error.errors[0].message },
//         { status: 400 }
//       );
//     }
//     console.error('Volunteer form error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Something went wrong. Please try again.' },
//       { status: 500 }
//     );
//   }
// }
