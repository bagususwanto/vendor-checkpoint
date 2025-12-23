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
  // Delete in correct order to avoid foreign key constraints
  await prisma.mst_checklist_item.deleteMany({});
  await prisma.mst_checklist_category.deleteMany({});
  await prisma.mst_vendor.deleteMany({}); // Vendors depend on vendor categories
  await prisma.mst_vendor_category.deleteMany({});
  await prisma.mst_user.deleteMany({});
  await prisma.cfg_system.deleteMany({});
}

async function seedVendorCategories() {
  console.log('Creating vendor categories...');
  await prisma.mst_vendor_category.createMany({
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
  const vendorCats = await prisma.mst_vendor_category.findMany();

  const catMap = Object.fromEntries(
    cats.map((c) => [c.category_code, c.checklist_category_id]),
  );

  const vcMap = Object.fromEntries(
    vendorCats.map((v) => [v.category_code, v.vendor_category_id]),
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
    const { category_code, vendor_category_code, ...rest } = item;
    return {
      ...rest,
      checklist_category_id: catMap[item.category_code],
      vendor_category_id: vcMap[item.vendor_category_code],
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
  // We need to fetch vendor categories to map the codes
  const vendorCats = await prisma.mst_vendor_category.findMany();
  const vcMap = Object.fromEntries(
    vendorCats.map((v) => [v.category_code, v.vendor_category_id]),
  );

  const vendors = MASTER_VENDORS.map((vendor) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { vendor_category_code, ...rest } = vendor;
    return {
      ...rest,
      vendor_category_id: vcMap[vendor.vendor_category_code],
    };
  });

  await prisma.mst_vendor.createMany({
    data: vendors,
  });
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
