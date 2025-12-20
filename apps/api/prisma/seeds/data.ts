export const VENDOR_CATEGORIES = [
  {
    category_name: 'Chemical',
    category_code: 'CHEM',
    description: 'Material kimia berbahaya',
  },
  {
    category_name: 'Spesific Chemical (BBM)',
    category_code: 'SPBBM',
    description: 'Bahan bakar minyak',
  },
  {
    category_name: 'Sparepart & Tool',
    category_code: 'SPT',
    description: 'Suku cadang dan peralatan',
  },
  {
    category_name: 'General Supplier',
    category_code: 'GEN',
    description: 'Supplier umum untuk berbagai kebutuhan',
  },
];

export const CHECKLIST_CATEGORIES = [
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
];

export const GENERAL_CHECKLIST_ITEMS = [
  {
    category_code: 'SAFE',
    item_code: 'SAFE-GEN-001',
    item_text: 'Apakah kondisi fisik sehat dan siap bekerja?',
    item_type: 'UMUM',
    display_order: 1,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-GEN-002',
    item_text: 'Apakah sedang dalam kondisi segar dan tidak mengantuk?',
    item_type: 'UMUM',
    display_order: 2,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-GEN-003',
    item_text: 'Apakah menggunakan Helm/Topi sesuai standar keselamatan?',
    item_type: 'UMUM',
    display_order: 3,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-GEN-004',
    item_text: 'Apakah menggunakan Safety Vest yang terlihat jelas?',
    item_type: 'UMUM',
    display_order: 4,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-GEN-005',
    item_text:
      'Apakah menggunakan Safety Shoes yang layak dan terpasang dengan benar?',
    item_type: 'UMUM',
    display_order: 5,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-GEN-006',
    item_text: 'Apakah semua APD dalam kondisi baik dan tidak rusak?',
    item_type: 'UMUM',
    display_order: 6,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-GEN-001',
    item_text: 'Apakah barang dikemas dengan baik dan aman?',
    item_type: 'UMUM',
    display_order: 1,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-GEN-002',
    item_text: 'Apakah spesifikasi barang sesuai yang diminta?',
    item_type: 'UMUM',
    display_order: 2,
  },
  {
    category_code: 'PROD',
    item_code: 'PROD-GEN-001',
    item_text: 'Apakah dokumen pengiriman lengkap dan valid?',
    item_type: 'UMUM',
    display_order: 1,
  },
  {
    category_code: 'PROD',
    item_code: 'PROD-GEN-002',
    item_text: 'Apakah material tiba tepat waktu sesuai jadwal?',
    item_type: 'UMUM',
    display_order: 2,
  },
  {
    category_code: 'PROD',
    item_code: 'PROD-GEN-003',
    item_text: 'Apakah material siap untuk proses bongkar muat?',
    item_type: 'UMUM',
    display_order: 3,
  },
  {
    category_code: 'ENVI',
    item_code: 'ENVI-GEN-001',
    item_text: 'Apakah kendaraan tidak menghasilkan asap berlebih?',
    item_type: 'UMUM',
    display_order: 1,
  },
  {
    category_code: 'ENVI',
    item_code: 'ENVI-GEN-002',
    item_text: 'Apakah kendaraan memiliki uji emisi yang masih berlaku?',
    item_type: 'UMUM',
    display_order: 2,
  },
  {
    category_code: 'ENVI',
    item_code: 'ENVI-GEN-003',
    item_text: 'Apakah kendaraan aman dari kebocoran oli atau bahan bakar?',
    item_type: 'UMUM',
    display_order: 3,
  },
];

export const SPECIFIC_CHECKLIST_ITEMS = [
  {
    category_code: 'SAFE',
    item_code: 'SAFE-CHEM-001',
    item_text: 'Apakah drum dalam kondisi tidak penyok atau bocor?',
    item_type: 'KHUSUS',
    vendor_category_code: 'CHEM',
    display_order: 1,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-CHEM-002',
    item_text: 'Apakah tersedia MSDS yang sesuai dan terbaru?',
    item_type: 'KHUSUS',
    vendor_category_code: 'CHEM',
    display_order: 2,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-CHEM-003',
    item_text: 'Apakah ada simbol B3 pada kemasan sesuai regulasi?',
    item_type: 'KHUSUS',
    vendor_category_code: 'CHEM',
    display_order: 3,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-CHEM-001',
    item_text: 'Apakah terdapat expired date pada kemasan sesuai standar?',
    item_type: 'KHUSUS',
    vendor_category_code: 'CHEM',
    display_order: 1,
  },
  {
    category_code: 'ENVI',
    item_code: 'ENVI-CHEM-001',
    item_text: 'Apakah kondisi aman dari indikasi tumpahan bahan kimia?',
    item_type: 'KHUSUS',
    vendor_category_code: 'CHEM',
    display_order: 1,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-BBM-001',
    item_text: 'Apakah segel tangki dalam kondisi utuh?',
    item_type: 'KHUSUS',
    // Note: In original file it was 'BBM' in map lookup `vcMap['BBM']`
    // but the category created was:
    // category_name: 'Spesific Chemical (BBM)',
    // category_code: 'SPBBM',
    // Wait, the original seed.ts had:
    // category_code: 'SPBBM'
    // But the lookup was `vcMap['BBM']`.
    // This implies `vcMap` keys come from `category_code`.
    // So there might be a bug in the original seed file if 'BBM' code doesn't exist?
    // Let's check original seed.ts lines 26-27: category_code: 'SPBBM'.
    // And lines 243: vendor_category_id: vcMap['BBM'].
    // If 'BBM' is not in vcMap (which is keyed by category_code), this would be undefined!
    // UNLESS the code in the DB is different or I missed something.
    // Line 83: `cats.map((c) => [c.category_code, c.checklist_category_id])`.
    // Line 26: `category_code: 'SPBBM'`.
    // So `vcMap` will have 'SPBBM', not 'BBM'.
    // So distinct possibility the original seed was broken or relying on 'BBM' being there.
    // However, I see line 243 in provided file content: `vendor_category_id: vcMap['BBM'],`
    // If I reproduce this exactly, I might propagate a bug.
    // But looking at line 26: `category_code: 'SPBBM'`.
    // So `vcMap['SPBBM']` would continue the ID. `vcMap['BBM']` would be undefined.
    // Typescript might complain if strict, or it sends undefined to DB which might fail if column is not nullable.
    // `vendor_category_id` usually foreign keys are nullable or not?
    // Let's assume the user meant 'SPBBM' because the category name is 'Spesific Chemical (BBM)'.
    // I will correct this to 'SPBBM' to match the category code defined above.
    vendor_category_code: 'SPBBM',
    display_order: 1,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-BBM-002',
    item_text: 'Apakah kendaraan membawa APAR dan SPILL KIT sesuai standar?',
    item_type: 'KHUSUS',
    vendor_category_code: 'SPBBM',
    display_order: 2,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-BBM-003',
    item_text: 'Apakah ada simbol B3 pada kendaraan sesuai regulasi?',
    item_type: 'KHUSUS',
    vendor_category_code: 'SPBBM',
    display_order: 3,
  },
  {
    category_code: 'ENVI',
    item_code: 'ENVI-BBM-001',
    item_text: 'Apakah kondisi aman dari indikasi kebocoran bahan bakar?',
    item_type: 'KHUSUS',
    vendor_category_code: 'SPBBM',
    display_order: 1,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-SPT-001',
    item_text: 'Apakah komponen tidak berkarat atau rusak?',
    item_type: 'KHUSUS',
    vendor_category_code: 'SPT',
    display_order: 1,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-SPT-002',
    item_text: 'Apakah kelengkapan part sesuai dengan spesifikasi?',
    item_type: 'KHUSUS',
    vendor_category_code: 'SPT',
    display_order: 2,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-SPT-003',
    item_text: 'Apakah barang sudah di wrapping?',
    item_type: 'KHUSUS',
    vendor_category_code: 'SPT',
    display_order: 3,
  },
];

export const SYSTEM_CONFIGS = [
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
];

export const ADMIN_USER = {
  external_user_id: '7637',
  username: 'admin',
  full_name: 'Administrator System',
  role: 'Super Admin',
  is_active: true,
};

export const MASTER_VENDORS = [
  {
    vendor_code: '250849',
    company_name: 'SADIKUN NIAGAMAS RAYA',
    // This relied on ID 2. In seeding we should probably lookup by category code or something.
    // Original: vendor_category_id: 2
    // Category 2 in the list above (index 1) is 'Spesific Chemical (BBM)' -> 'SPBBM'.
    // Let's use the code here too for better safety.
    vendor_category_code: 'SPBBM',
  },
];
