import { prisma } from '../lib/prisma';

async function main(): Promise<void> {
  console.log('Starting seed...');

  console.log('Clearing existing data...');
  await prisma.cfg_system.deleteMany({});
  await prisma.mst_checklist_item.deleteMany({});
  await prisma.mst_checklist_category.deleteMany({});
  await prisma.mst_vendor_category.deleteMany({});
  await prisma.mst_user.deleteMany({});

  console.log('Creating vendor categories...');
  await prisma.mst_vendor_category.createMany({
    data: [
      {
        category_name: 'Chemical',
        category_code: 'CHEM',
        description: 'Material kimia berbahaya',
      },
      {
        category_name: 'BBM',
        category_code: 'BBM',
        description: 'Bahan bakar minyak',
      },
      {
        category_name: 'Sparepart & Tool',
        category_code: 'SPT',
        description: 'Suku cadang dan peralatan',
      },
    ],
  });

  console.log('Creating checklist categories...');
  await prisma.mst_checklist_category.createMany({
    data: [
      {
        category_name: 'Safety Delivery',
        category_code: 'SAFE',
        display_order: 1,
        icon_name: 'shield-alert',
        color_code: 'text-red-500',
      },
      {
        category_name: 'Quality',
        category_code: 'QUAL',
        display_order: 2,
        icon_name: 'badge-check',
        color_code: 'text-blue-500',
      },
      {
        category_name: 'Productivity',
        category_code: 'PROD',
        display_order: 3,
        icon_name: 'activity',
        color_code: 'text-green-500',
      },
      {
        category_name: 'Environment',
        category_code: 'ENVI',
        display_order: 4,
        icon_name: 'tree-deciduous',
        color_code: 'text-emerald-500',
      },
    ],
  });

  console.log('Fetching categories...');
  const cats = await prisma.mst_checklist_category.findMany();
  console.log('Checklist categories found:', cats.length);

  const catMap: Record<string, number> = Object.fromEntries(
    cats.map((c) => [c.category_code, c.checklist_category_id]),
  );

  const vendorCat = await prisma.mst_vendor_category.findMany();
  console.log('Vendor categories found:', vendorCat.length);

  const vcMap: Record<string, number> = Object.fromEntries(
    vendorCat.map((v) => [v.category_code, v.vendor_category_id]),
  );

  console.log('Creating general checklist items...');
  await prisma.mst_checklist_item.createMany({
    data: [
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-GEN-001',
        item_text: 'Apakah kondisi fisik sehat dan siap bekerja?',
        item_type: 'UMUM',
        display_order: 1,
      },
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-GEN-002',
        item_text: 'Apakah sedang dalam kondisi segar dan tidak mengantuk?',
        item_type: 'UMUM',
        display_order: 2,
      },
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-GEN-003',
        item_text: 'Apakah menggunakan Helm/Topi sesuai standar keselamatan?',
        item_type: 'UMUM',
        display_order: 3,
      },
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-GEN-004',
        item_text: 'Apakah menggunakan Safety Vest yang terlihat jelas?',
        item_type: 'UMUM',
        display_order: 4,
      },
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-GEN-005',
        item_text:
          'Apakah menggunakan Safety Shoes yang layak dan terpasang dengan benar?',
        item_type: 'UMUM',
        display_order: 5,
      },
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-GEN-006',
        item_text: 'Apakah semua APD dalam kondisi baik dan tidak rusak?',
        item_type: 'UMUM',
        display_order: 6,
      },

      {
        checklist_category_id: catMap['QUAL'],
        item_code: 'QUAL-GEN-001',
        item_text: 'Apakah barang dikemas dengan baik dan aman?',
        item_type: 'UMUM',
        display_order: 1,
      },
      {
        checklist_category_id: catMap['QUAL'],
        item_code: 'QUAL-GEN-002',
        item_text: 'Apakah spesifikasi barang sesuai yang diminta?',
        item_type: 'UMUM',
        display_order: 2,
      },

      {
        checklist_category_id: catMap['PROD'],
        item_code: 'PROD-GEN-001',
        item_text: 'Apakah dokumen pengiriman lengkap dan valid?',
        item_type: 'UMUM',
        display_order: 1,
      },
      {
        checklist_category_id: catMap['PROD'],
        item_code: 'PROD-GEN-002',
        item_text: 'Apakah material tiba tepat waktu sesuai jadwal?',
        item_type: 'UMUM',
        display_order: 2,
      },
      {
        checklist_category_id: catMap['PROD'],
        item_code: 'PROD-GEN-003',
        item_text: 'Apakah material siap untuk proses bongkar muat?',
        item_type: 'UMUM',
        display_order: 3,
      },

      {
        checklist_category_id: catMap['ENVI'],
        item_code: 'ENVI-GEN-001',
        item_text: 'Apakah kendaraan tidak menghasilkan asap berlebih?',
        item_type: 'UMUM',
        display_order: 1,
      },
      {
        checklist_category_id: catMap['ENVI'],
        item_code: 'ENVI-GEN-002',
        item_text: 'Apakah kendaraan memiliki uji emisi yang masih berlaku?',
        item_type: 'UMUM',
        display_order: 2,
      },
      {
        checklist_category_id: catMap['ENVI'],
        item_code: 'ENVI-GEN-003',
        item_text: 'Apakah kendaraan aman dari kebocoran oli atau bahan bakar?',
        item_type: 'UMUM',
        display_order: 3,
      },
    ],
  });

  console.log('Creating specific checklist items...');
  await prisma.mst_checklist_item.createMany({
    data: [
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-CHEM-001',
        item_text: 'Apakah drum dalam kondisi tidak penyok atau bocor?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['CHEM'],
        display_order: 1,
      },
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-CHEM-002',
        item_text: 'Apakah tersedia MSDS yang sesuai dan terbaru?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['CHEM'],
        display_order: 2,
      },
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-CHEM-003',
        item_text: 'Apakah ada simbol B3 pada kemasan sesuai regulasi?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['CHEM'],
        display_order: 3,
      },
      {
        checklist_category_id: catMap['QUAL'],
        item_code: 'QUAL-CHEM-001',
        item_text: 'Apakah terdapat expired date pada kemasan sesuai standar?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['CHEM'],
        display_order: 1,
      },
      {
        checklist_category_id: catMap['ENVI'],
        item_code: 'ENVI-CHEM-001',
        item_text: 'Apakah kondisi aman dari indikasi tumpahan bahan kimia?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['CHEM'],
        display_order: 1,
      },

      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-BBM-001',
        item_text: 'Apakah segel tangki dalam kondisi utuh?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['BBM'],
        display_order: 1,
      },
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-BBM-002',
        item_text:
          'Apakah kendaraan membawa APAR dan SPILL KIT sesuai standar?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['BBM'],
        display_order: 2,
      },
      {
        checklist_category_id: catMap['SAFE'],
        item_code: 'SAFE-BBM-003',
        item_text: 'Apakah ada simbol B3 pada kendaraan sesuai regulasi?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['BBM'],
        display_order: 3,
      },
      {
        checklist_category_id: catMap['ENVI'],
        item_code: 'ENVI-BBM-001',
        item_text: 'Apakah kondisi aman dari indikasi kebocoran bahan bakar?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['BBM'],
        display_order: 1,
      },

      {
        checklist_category_id: catMap['QUAL'],
        item_code: 'QUAL-SPT-001',
        item_text: 'Apakah komponen tidak berkarat atau rusak?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['SPT'],
        display_order: 1,
      },
      {
        checklist_category_id: catMap['QUAL'],
        item_code: 'QUAL-SPT-002',
        item_text: 'Apakah kelengkapan part sesuai dengan spesifikasi?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['SPT'],
        display_order: 2,
      },
      {
        checklist_category_id: catMap['QUAL'],
        item_code: 'QUAL-SPT-003',
        item_text: 'Apakah barang sudah di wrapping?',
        item_type: 'KHUSUS',
        vendor_category_id: vcMap['SPT'],
        display_order: 3,
      },
    ],
  });

  console.log('Creating admin user...');
  await prisma.mst_user.upsert({
    where: { external_user_id: '7637' },
    update: {
      username: 'admin',
      full_name: 'Administrator System',
      role: 'Super Admin',
      is_active: true,
    },
    create: {
      external_user_id: '7637',
      username: 'admin',
      full_name: 'Administrator System',
      role: 'Super Admin',
      is_active: true,
    },
  });

  console.log('Creating system config...');
  await prisma.cfg_system.createMany({
    data: [
      {
        config_key: 'REFRESH_INTERVAL_MS',
        config_value: '5000',
        config_type: 'INT',
        description: 'Interval auto refresh dashboard dalam milidetik',
      },
      {
        config_key: 'QUEUE_FORMAT',
        config_value: 'YYYYMMDD-###',
        config_type: 'STRING',
        description: 'Format nomor antrian',
      },
      {
        config_key: 'MAX_EXPORT_RECORD_LIMIT',
        config_value: '50000',
        config_type: 'INT',
        description: 'Batas maksimal record untuk export',
      },
      {
        config_key: 'DISPLAY_PRIORITY_MODE',
        config_value: 'STANDARD',
        config_type: 'STRING',
        description: 'Mode pengurutan di TV Display',
      },
    ],
  });

  console.log('Seed completed successfully!');
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
