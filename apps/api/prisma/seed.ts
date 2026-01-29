import { PrismaService } from '../src/common/prisma/prisma.service';
import {
  ADMIN_USER,
  CHECKLIST_CATEGORIES,
  GENERAL_CHECKLIST_ITEMS,
  MASTER_VENDORS,
  SPECIFIC_CHECKLIST_ITEMS,
  SYSTEM_CONFIGS,
  VENDOR_CATEGORIES,
} from './seeds/data';

const prisma = new PrismaService();

async function cleanDatabase() {
  console.log('Clearing existing data...');

  // 1. Delete operational/transactional data first
  await prisma.ops_checkin_response.deleteMany({});
  await prisma.ops_verification.deleteMany({});
  await prisma.ops_timelog.deleteMany({});
  await prisma.ops_queue_status.deleteMany({});
  await prisma.ops_checkin_entry.deleteMany({});

  // 2. Delete logs and configs
  await prisma.log_audit.deleteMany({});
  await prisma.log_report_export.deleteMany({});
  await prisma.cfg_system.deleteMany({});

  // 3. Delete master data
  await prisma.mst_checklist_item.deleteMany({});
  await prisma.mst_checklist_category.deleteMany({});
  await prisma.mst_vendor.deleteMany({});
  await prisma.mst_material_category.deleteMany({});
  await prisma.mst_user.deleteMany({});
}

async function seedVendorCategories() {
  console.log('Creating vendor categories...');
  await prisma.mst_material_category.createMany({
    data: VENDOR_CATEGORIES,
  });
}

async function seedChecklistCategories() {
  console.log('Creating checklist categories...');
  await prisma.mst_checklist_category.createMany({
    data: CHECKLIST_CATEGORIES,
  });
}

async function seedChecklistItems() {
  console.log('Fetching categories for mapping...');
  const cats = await prisma.mst_checklist_category.findMany();
  const materialCats = await prisma.mst_material_category.findMany();

  const catMap = Object.fromEntries(
    cats.map((c) => [c.category_code, c.checklist_category_id]),
  );

  const mcMap = Object.fromEntries(
    materialCats.map((m) => [m.category_code, m.material_category_id]),
  );

  console.log('Creating general checklist items...');
  const generalItems = GENERAL_CHECKLIST_ITEMS.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category_code, ...rest } = item;
    return {
      ...rest,
      checklist_category_id: catMap[item.category_code],
    };
  });

  await prisma.mst_checklist_item.createMany({
    data: generalItems,
  });

  console.log('Creating specific checklist items...');
  const specificItems = SPECIFIC_CHECKLIST_ITEMS.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category_code, material_category_code, ...rest } = item;
    return {
      ...rest,
      checklist_category_id: catMap[item.category_code],
      material_category_id: mcMap[item.material_category_code],
    };
  });

  await prisma.mst_checklist_item.createMany({
    data: specificItems,
  });
}

async function seedUsers() {
  console.log('Creating admin user...');
  await prisma.mst_user.upsert({
    where: { external_user_id: ADMIN_USER.external_user_id },
    update: ADMIN_USER,
    create: ADMIN_USER,
  });
}

async function seedSystemConfig() {
  console.log('Creating system config...');
  await prisma.cfg_system.createMany({
    data: SYSTEM_CONFIGS,
  });
}

async function seedVendors() {
  console.log('Creating master vendors...');

  await prisma.mst_vendor.createMany({
    data: MASTER_VENDORS,
  });
}

async function seedCheckIns() {
  console.log('Creating dummy check-in entries...');

  // Get necessary data for foreign keys
  const vendors = await prisma.mst_vendor.findMany({ take: 10 });
  const materialCategories = await prisma.mst_material_category.findMany();
  const checklistItems = await prisma.mst_checklist_item.findMany({
    include: { checklist_category: true },
  });
  const adminUser = await prisma.mst_user.findFirst();

  if (!adminUser) {
    console.log('No admin user found, skipping check-in seed');
    return;
  }

  const today = new Date();
  const statuses = ['MENUNGGU', 'DISETUJUI', 'DITOLAK', 'SELESAI'];
  const driverNames = [
    'Budi Santoso',
    'Ahmad Wijaya',
    'Siti Nurhaliza',
    'Joko Susilo',
    'Rina Kartika',
    'Dedi Kurniawan',
    'Lina Marlina',
    'Hendra Gunawan',
  ];

  let queueCounter = 1;

  // Create 15 check-in entries with various statuses
  for (let i = 0; i < 15; i++) {
    const vendor = vendors[i % vendors.length];
    const materialCategory = materialCategories[i % materialCategories.length];
    const status = statuses[i % statuses.length];
    const driverName = driverNames[i % driverNames.length];

    // Generate queue number in format YYYYMMDD-XXX
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const queueNumber = `${dateStr}-${String(queueCounter).padStart(3, '0')}`;
    queueCounter++;

    // Determine submission time (vary between today and yesterday)
    const submissionTime = new Date(today);
    if (i > 10) {
      // Some entries from yesterday
      submissionTime.setDate(submissionTime.getDate() - 1);
    }
    submissionTime.setHours(8 + (i % 8), i * 5, 0, 0);

    // Get relevant checklist items for this material category
    const relevantItems = checklistItems.filter(
      (item) =>
        item.item_type === 'UMUM' ||
        item.material_category_id === materialCategory.material_category_id,
    );

    // Randomly determine if entry has non-compliant items (30% chance)
    const hasNonCompliant = Math.random() < 0.3;
    const nonCompliantCount = hasNonCompliant
      ? Math.floor(Math.random() * 3) + 1
      : 0;

    // Create check-in entry
    const entry = await prisma.ops_checkin_entry.create({
      data: {
        queue_number: queueNumber,
        vendor_id: vendor.vendor_id,
        driver_name: driverName,
        material_category_id: materialCategory.material_category_id,
        snapshot_company_name: vendor.company_name,
        snapshot_category_name: materialCategory.category_name,
        submission_time: submissionTime,
        current_status: status,
        ip_address: `192.168.1.${100 + i}`,
        device_identifier: `DEVICE-${i + 1}`,
        has_non_compliant_items: hasNonCompliant,
        non_compliant_count: nonCompliantCount,
        created_at: submissionTime,
        updated_at: submissionTime,
      },
    });

    // Create checklist responses
    let nonCompliantCreated = 0;
    for (const item of relevantItems.slice(0, 10)) {
      // Take first 10 items
      const shouldBeNonCompliant =
        hasNonCompliant && nonCompliantCreated < nonCompliantCount;
      const responseValue = !shouldBeNonCompliant;

      await prisma.ops_checkin_response.create({
        data: {
          entry_id: entry.entry_id,
          checklist_item_id: item.checklist_item_id,
          checklist_category_id: item.checklist_category_id,
          item_text_snapshot: item.item_text,
          item_type: item.item_type,
          response_value: responseValue,
          is_compliant: responseValue,
          display_order: item.display_order,
        },
      });

      if (shouldBeNonCompliant) nonCompliantCreated++;
    }

    // Create queue status
    const statusTexts = {
      MENUNGGU: 'Menunggu Verifikasi',
      DISETUJUI: 'Sedang Diproses',
      DITOLAK: 'Ditolak',
      SELESAI: 'Selesai',
    };

    await prisma.ops_queue_status.create({
      data: {
        entry_id: entry.entry_id,
        queue_number: queueNumber,
        current_status: status,
        status_display_text: statusTexts[status as keyof typeof statusTexts],
        priority_order: queueCounter,
        estimated_wait_minutes: status === 'MENUNGGU' ? 30 : null,
        last_updated: submissionTime,
      },
    });

    // Create timelog
    const checkinTime = new Date(submissionTime);
    // checkin_time in service is same as submission_time, so we don't add 5 minutes

    const isCheckedOut = status === 'SELESAI';
    const checkoutTime = isCheckedOut
      ? new Date(checkinTime.getTime() + (20 + i * 5) * 60000)
      : null;
    const durationMinutes = isCheckedOut
      ? Math.round((checkoutTime!.getTime() - checkinTime.getTime()) / 60000)
      : null;

    await prisma.ops_timelog.create({
      data: {
        entry_id: entry.entry_id,
        checkin_time: checkinTime,
        checkout_time: checkoutTime,
        checkout_by_user_id: isCheckedOut ? adminUser.user_id : null,
        duration_minutes: durationMinutes,
        is_checked_out: isCheckedOut,
        created_at: checkinTime,
        updated_at: checkoutTime || checkinTime,
      },
    });

    // Create verification for non-MENUNGGU statuses
    if (status !== 'MENUNGGU') {
      const verificationTime = new Date(checkinTime);
      verificationTime.setMinutes(verificationTime.getMinutes() + 2);

      await prisma.ops_verification.create({
        data: {
          entry_id: entry.entry_id,
          verified_by_user_id: adminUser.user_id,
          verification_status: status,
          rejection_reason:
            status === 'DITOLAK'
              ? 'Dokumen tidak lengkap atau tidak sesuai standar'
              : null,
          verification_time: verificationTime,
          created_at: verificationTime,
        },
      });
    }
  }

  console.log(`Created ${queueCounter - 1} dummy check-in entries`);
}

async function main(): Promise<void> {
  console.log('Starting seed...');

  try {
    await cleanDatabase();
    await seedVendorCategories();
    await seedChecklistCategories();
    await seedUsers();
    await seedSystemConfig();

    // These depend on the categories above
    await seedChecklistItems();
    await seedVendors();

    // Seed dummy check-in data
    await seedCheckIns();

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed execution failed:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
