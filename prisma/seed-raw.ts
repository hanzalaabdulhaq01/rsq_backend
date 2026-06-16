import * as pg from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log('🌱 Seeding ResQLink database...\n');

  try {
    const SALT_ROUNDS = 10;

    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin@1234', SALT_ROUNDS);
    const userPassword = await bcrypt.hash('Patient@1234', SALT_ROUNDS);
    const driverPassword = await bcrypt.hash('Driver@1234', SALT_ROUNDS);
    const paramedicPassword = await bcrypt.hash('Paramedic@1234', SALT_ROUNDS);

    // Insert Admin
    await client.query(
      `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, verified, "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, true, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['Admin User', 'admin@resqlink.com', '+923001111111', adminPassword, 'ADMIN']
    );
    console.log('  ✅ Admin: admin@resqlink.com (Admin@1234)');

    // Insert Patients
    await client.query(
      `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, verified, "isActive", "locationLat", "locationLng", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, true, 24.8700, 67.0100, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['John Patient', 'patient@resqlink.com', '+923002222222', userPassword, 'USER']
    );
    console.log('  ✅ Patient 1: patient@resqlink.com (Patient@1234)');

    await client.query(
      `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, verified, "isActive", "locationLat", "locationLng", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, true, 24.8900, 67.0300, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['Sara Ahmed', 'sara@resqlink.com', '+923002222233', userPassword, 'USER']
    );
    console.log('  ✅ Patient 2: sara@resqlink.com (Patient@1234)');

    // Insert Drivers
    await client.query(
      `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, verified, "isActive", "locationLat", "locationLng", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, true, 24.8607, 67.0011, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['Ahmed Driver', 'driver@resqlink.com', '+923003333333', driverPassword, 'DRIVER']
    );
    console.log('  ✅ Driver 1: driver@resqlink.com (Driver@1234)');

    await client.query(
      `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, verified, "isActive", "locationLat", "locationLng", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, true, 24.9200, 67.0800, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['Hassan Ali', 'driver2@resqlink.com', '+923003333344', driverPassword, 'DRIVER']
    );
    console.log('  ✅ Driver 2: driver2@resqlink.com (Driver@1234)');

    // Insert Paramedics
    await client.query(
      `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, verified, "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, true, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['Dr. Fatima Khan', 'paramedic@resqlink.com', '+923004444444', paramedicPassword, 'PARAMEDIC']
    );
    console.log('  ✅ Paramedic 1: paramedic@resqlink.com (Paramedic@1234)');

    await client.query(
      `INSERT INTO "User" (id, name, email, phone, "passwordHash", role, verified, "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, true, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      ['Dr. Ali Raza', 'paramedic2@resqlink.com', '+923004444455', paramedicPassword, 'PARAMEDIC']
    );
    console.log('  ✅ Paramedic 2: paramedic2@resqlink.com (Paramedic@1234)');

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('── Login Credentials ──────────────────');
    console.log('  Admin:     admin@resqlink.com     / Admin@1234');
    console.log('  Patient:   patient@resqlink.com   / Patient@1234');
    console.log('  Driver:    driver@resqlink.com    / Driver@1234');
    console.log('  Paramedic: paramedic@resqlink.com / Paramedic@1234');
    console.log('───────────────────────────────────────\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
