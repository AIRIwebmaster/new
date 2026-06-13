import { neon } from '@neondatabase/serverless';

function createSQL() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }
  return neon(DATABASE_URL);
}

export function sql {
  return createSQL();
}

export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      organization VARCHAR(255),
      enquiry_type VARCHAR(100) NOT NULL,
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS workshop_bookings (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      organization VARCHAR(255),
      role VARCHAR(255),
      workshop VARCHAR(255) NOT NULL,
      participants VARCHAR(100) NOT NULL,
      location VARCHAR(255),
      hear_about VARCHAR(255),
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS volunteer_applications (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      interest VARCHAR(100) NOT NULL,
      availability VARCHAR(100) NOT NULL,
      experience TEXT,
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS codeai_registrations (
      id SERIAL PRIMARY KEY,
      student_name VARCHAR(255) NOT NULL,
      student_age INTEGER NOT NULL,
      parent_name VARCHAR(255) NOT NULL,
      parent_email VARCHAR(255) NOT NULL,
      parent_phone VARCHAR(50) NOT NULL,
      experience_level VARCHAR(100) NOT NULL,
      how_heard VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS business_inquiries (
      id SERIAL PRIMARY KEY,
      organization_name VARCHAR(255) NOT NULL,
      your_name VARCHAR(255) NOT NULL,
      work_email VARCHAR(255) NOT NULL,
      what_to_improve TEXT NOT NULL,
      organization_type VARCHAR(100),
      biggest_challenge TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS community_inquiries (
      id SERIAL PRIMARY KEY,
      organization_name VARCHAR(255) NOT NULL,
      your_name VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      who_served VARCHAR(100) NOT NULL,
      looking_for VARCHAR(100) NOT NULL,
      participant_count VARCHAR(50) NOT NULL,
      preferred_timing VARCHAR(100) NOT NULL,
      additional_info TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS impact_stats (
      id SERIAL PRIMARY KEY,
      label VARCHAR(255) NOT NULL,
      value INTEGER NOT NULL,
      suffix VARCHAR(50) DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT FALSE,
      description TEXT DEFAULT '',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS insights (
      id SERIAL PRIMARY KEY,
      headline VARCHAR(500) NOT NULL,
      slug VARCHAR(500) NOT NULL,
      href VARCHAR(500) DEFAULT '',
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      published_date DATE NOT NULL,
      visible BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Migrations for existing tables
  await sql`ALTER TABLE impact_stats ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`;
  await sql`ALTER TABLE insights ADD COLUMN IF NOT EXISTS slug VARCHAR(500)`;
  await sql`ALTER TABLE insights ADD COLUMN IF NOT EXISTS excerpt TEXT DEFAULT ''`;
  await sql`ALTER TABLE insights ADD COLUMN IF NOT EXISTS content TEXT DEFAULT ''`;
  await sql`ALTER TABLE insights ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`;

  const existing = await sql`SELECT id FROM admin_users WHERE email = 'frank@airifoundation.org'`;
  const hash = '$2b$12$YzOkiPN9vIj4aJwdInVvuO55pGVwB7h.gUcTThJtWJExQUK9OKRUG';
  if (existing.length === 0) {
    await sql`
      INSERT INTO admin_users (email, password_hash, name)
      VALUES ('frank@airifoundation.org', ${hash}, 'Frank Onuh')
    `;
  } else {
    await sql`
      UPDATE admin_users SET password_hash = ${hash} WHERE email = 'frank@airifoundation.org'
    `;
  }
}
