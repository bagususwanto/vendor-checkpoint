export const VENDOR_CATEGORIES = [
  {
    category_name: 'Chemical',
    category_code: 'CHEM',
    description: 'Material kimia berbahaya',
  },
  {
    category_name: 'Spesific Chemical (BBM)',
    category_code: 'SCBBM',
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
    description: 'Material umum untuk berbagai kebutuhan',
  },
];

export const CHECKLIST_CATEGORIES = [
  {
    category_name: 'Safety Delivery',
    category_code: 'SAFE',
    display_order: 1,
    icon_name: 'ShieldAlert',
    color_code: 'text-red-500',
  },
  {
    category_name: 'Quality',
    category_code: 'QUAL',
    display_order: 2,
    icon_name: 'BadgeCheck',
    color_code: 'text-blue-500',
  },
  {
    category_name: 'Productivity',
    category_code: 'PROD',
    display_order: 3,
    icon_name: 'Activity',
    color_code: 'text-green-500',
  },
  {
    category_name: 'Environment',
    category_code: 'ENVI',
    display_order: 4,
    icon_name: 'TreeDeciduous',
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
    material_category_code: 'CHEM',
    display_order: 1,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-CHEM-002',
    item_text: 'Apakah tersedia MSDS yang sesuai dan terbaru?',
    item_type: 'KHUSUS',
    material_category_code: 'CHEM',
    display_order: 2,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-CHEM-003',
    item_text: 'Apakah ada simbol B3 pada kemasan sesuai regulasi?',
    item_type: 'KHUSUS',
    material_category_code: 'CHEM',
    display_order: 3,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-CHEM-001',
    item_text: 'Apakah terdapat expired date pada kemasan sesuai standar?',
    item_type: 'KHUSUS',
    material_category_code: 'CHEM',
    display_order: 1,
  },
  {
    category_code: 'ENVI',
    item_code: 'ENVI-CHEM-001',
    item_text: 'Apakah kondisi aman dari indikasi tumpahan bahan kimia?',
    item_type: 'KHUSUS',
    material_category_code: 'CHEM',
    display_order: 1,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-BBM-001',
    item_text: 'Apakah segel tangki dalam kondisi utuh?',
    item_type: 'KHUSUS',
    material_category_code: 'SCBBM',
    display_order: 1,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-BBM-002',
    item_text: 'Apakah kendaraan membawa APAR dan SPILL KIT sesuai standar?',
    item_type: 'KHUSUS',
    material_category_code: 'SCBBM',
    display_order: 2,
  },
  {
    category_code: 'SAFE',
    item_code: 'SAFE-BBM-003',
    item_text: 'Apakah ada simbol B3 pada kendaraan sesuai regulasi?',
    item_type: 'KHUSUS',
    material_category_code: 'SCBBM',
    display_order: 3,
  },
  {
    category_code: 'ENVI',
    item_code: 'ENVI-BBM-001',
    item_text: 'Apakah kondisi aman dari indikasi kebocoran bahan bakar?',
    item_type: 'KHUSUS',
    material_category_code: 'SCBBM',
    display_order: 1,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-SPT-001',
    item_text: 'Apakah komponen tidak berkarat atau rusak?',
    item_type: 'KHUSUS',
    material_category_code: 'SPT',
    display_order: 1,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-SPT-002',
    item_text: 'Apakah kelengkapan part sesuai dengan spesifikasi?',
    item_type: 'KHUSUS',
    material_category_code: 'SPT',
    display_order: 2,
  },
  {
    category_code: 'QUAL',
    item_code: 'QUAL-SPT-003',
    item_text: 'Apakah barang sudah di wrapping?',
    item_type: 'KHUSUS',
    material_category_code: 'SPT',
    display_order: 3,
  },
];

export const SYSTEM_CONFIGS = [
  {
    config_key: 'REFRESH_INTERVAL_MS',
    config_value: '5000',
    config_type: 'INT',
    description: 'Interval auto refresh dashboard dalam milidetik',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    config_key: 'QUEUE_FORMAT',
    config_value: 'YYYYMMDD-###',
    config_type: 'STRING',
    description: 'Format nomor antrian',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    config_key: 'MAX_EXPORT_RECORD_LIMIT',
    config_value: '50000',
    config_type: 'INT',
    description: 'Batas maksimal record untuk export',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    config_key: 'DISPLAY_PRIORITY_MODE',
    config_value: 'STANDARD',
    config_type: 'STRING',
    description:
      'Mode pengurutan di TV Display. STANDARD: urutan berdasarkan waktu kedatangan (FIFO), PRIORITY: prioritaskan entry dengan non-compliant items',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    config_key: 'ESTIMATED_WAIT_MINUTES',
    config_value: '30',
    config_type: 'INT',
    description: 'Estimasi waktu tunggu dalam menit (default)',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    config_key: 'DEFAULT_STATUS_MENUNGGU_DISPLAY_TEXT',
    config_value: 'Menunggu Verifikasi',
    config_type: 'STRING',
    description: 'Status menunggu verifikasi di Display',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    config_key: 'DEFAULT_STATUS_DISETUJUI_DISPLAY_TEXT',
    config_value: 'Sedang Diproses',
    config_type: 'STRING',
    description: 'Status disetujui di Display',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    config_key: 'DEFAULT_STATUS_DITOLAK_DISPLAY_TEXT',
    config_value: 'Ditolak',
    config_type: 'STRING',
    description: 'Status ditolak di Display',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    config_key: 'DEFAULT_STATUS_SELESAI_DISPLAY_TEXT',
    config_value: 'Selesai',
    config_type: 'STRING',
    description: 'Status selesai di Display',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export const ADMIN_USER = {
  external_user_id: 7637,
  username: 'admin',
  full_name: 'Administrator System',
  role: 'Super Admin',
  is_active: true,
};

export const MASTER_VENDORS = [
  {
    vendor_code: '4000009386',
    company_name: 'PT. KAWAN LAMA SOLUSI',
  },
  {
    vendor_code: '4000009387',
    company_name: 'PT. KUADRAN SATU KOMUNIKA',
  },
  {
    vendor_code: '4000009354',
    company_name: 'PT PRO SIGMAKA MANDIRI',
  },
  {
    vendor_code: '4000009344',
    company_name: 'PT UTAMA KARYA NIAGA',
  },
  {
    vendor_code: '4000009345',
    company_name: 'SUCCESS MARINE SERVICE CO.',
  },
  {
    vendor_code: '4000009293',
    company_name: 'PT RSM INDONESIA KONSULTAN',
  },
  {
    vendor_code: '4000009294',
    company_name: 'PT TRANSCOSMOS INDONESIA',
  },
  {
    vendor_code: '4000009283',
    company_name: 'PT ARTHA KARYA MANUNGGAL JAYA',
  },
  {
    vendor_code: '4000009284',
    company_name: 'PT PUNINAR SARANARAYA',
  },
  {
    vendor_code: '4000009282',
    company_name: 'PT. HOWASKA MESIN INDONESIA',
  },
  {
    vendor_code: '4000009281',
    company_name: 'ARION INDONESIA TRANSPORT',
  },
  {
    vendor_code: '4000009263',
    company_name: 'PT. SINERGI CIPTA PEMIMPIN',
  },
  {
    vendor_code: '4000009264',
    company_name: 'PT. ITPRENEUR INDONESIA TECHNOLOGY',
  },
  {
    vendor_code: '4000009260',
    company_name: 'PT BUANA COMPONENTS INDUSTRIAL',
  },
  {
    vendor_code: '4000009249',
    company_name: 'PT ANUGRAH KAMA RATIH',
  },
  {
    vendor_code: '4000009242',
    company_name: 'PT ADMINISTRASI MEDIKA',
  },
  {
    vendor_code: '4000009243',
    company_name: 'PT BINTANG JAYA PRATAMA INDONESIA',
  },
  {
    vendor_code: '4000009244',
    company_name: 'PT MARKPLUS INDONESIA',
  },
  {
    vendor_code: '4000000925',
    company_name: 'DXC TECHNOLOGY SERVICES (THAILAND)',
  },
  {
    vendor_code: '4000009240',
    company_name: 'PT CONTAINER SUKSES LOGISTIK',
  },
  {
    vendor_code: '4000009200',
    company_name: 'PT BASTI ASASTA SEJAHTERA',
  },
  {
    vendor_code: '4000009201',
    company_name: 'PERSEKUTUAN PERDATA SOEWITO',
  },
  {
    vendor_code: '4000009184',
    company_name: 'PT. TSUCHIYOSHI HOSANA INDONESIA',
  },
  {
    vendor_code: '4000009156',
    company_name: 'PT. AMALIAH HUSADA JONGGOL',
  },
  {
    vendor_code: '4000009130',
    company_name: 'PT. KELUARGA MULYA',
  },
  {
    vendor_code: '4000009122',
    company_name: 'PT. TRIBUN DIGITAL ONLINE',
  },
  {
    vendor_code: '4000009091',
    company_name: 'PERUM LKBN ANTARA',
  },
  {
    vendor_code: '4000009092',
    company_name: 'PT BALAI LELANG SERASI',
  },
  {
    vendor_code: '4000009093',
    company_name: 'PT CARBAY SERVICES INDONESIA',
  },
  {
    vendor_code: '4000009094',
    company_name: 'PT DASINDO MEDIA',
  },
  {
    vendor_code: '4000009095',
    company_name: 'PT DYNAMO MEDIA NETWORK',
  },
  {
    vendor_code: '4000009077',
    company_name: 'PT.BINTANG LANGIT MULTIMEDIA',
  },
  {
    vendor_code: '4000009078',
    company_name: 'TZU CHI HOSPITAL',
  },
  {
    vendor_code: '4000009066',
    company_name: 'PT. ANAK MUDA INDONESIA',
  },
  {
    vendor_code: '4000009062',
    company_name: 'PT. TIMURRAYA KARUNIA MULTI',
  },
  {
    vendor_code: '4000009063',
    company_name: 'PT CEDAR KARYATAMA LESTARINDO',
  },
  {
    vendor_code: '4000009045',
    company_name: 'PERUSAHAAN UMUM DAERAH AIR MINUM',
  },
  {
    vendor_code: '4000009046',
    company_name: 'PT ELBARQ MULTIMEDIA NUSANTARA',
  },
  {
    vendor_code: '4000009047',
    company_name: 'PT MITRA BERKARYA SENTOSA',
  },
  {
    vendor_code: '4000009031',
    company_name: 'PT.DEPO PETIKEMAS EXPRESSINDO',
  },
  {
    vendor_code: '4000009032',
    company_name: 'PT GRAHA KARDIA INDONESIA',
  },
  {
    vendor_code: '4000009034',
    company_name: 'PT INDONESIA AUTO NETWORK',
  },
  {
    vendor_code: '4000009035',
    company_name: 'PT KARYA HUSADA BERSATU',
  },
  {
    vendor_code: '4000009036',
    company_name: 'PT KPMG SIDDHARTA ADVISORY',
  },
  {
    vendor_code: '4000009037',
    company_name: 'PT NAVIGATOR INFORMASI SIBERMEDIA',
  },
  {
    vendor_code: '4000009038',
    company_name: 'PT NNR RPX GLOBAL LOGISTICS',
  },
  {
    vendor_code: '4000009022',
    company_name: 'FUTARI MECCA UTAMA',
  },
  {
    vendor_code: '4000009024',
    company_name: 'PT OWARI SEIKI INDONESIA',
  },
  {
    vendor_code: '4000008808',
    company_name: 'PT LINK NET TBK',
  },
  {
    vendor_code: '4000008800',
    company_name: 'PT KAMPUH WELDING INDONESIA',
  },
  {
    vendor_code: '4000008801',
    company_name: 'PT GEMA MULIA SEMESTA',
  },
  {
    vendor_code: '4000008802',
    company_name: 'PT RAUDHATUSSYFAA SEHAT BERSAMA',
  },
  {
    vendor_code: '4000008779',
    company_name: 'PT. ADYAWINSA PLASTICS INDUSTRY',
  },
  {
    vendor_code: '4000008772',
    company_name: 'PT IMAM SUKSES MANDIRI',
  },
  {
    vendor_code: '4000008741',
    company_name: 'PT MATAHARI TEKNOLOGI JAYA',
  },
  {
    vendor_code: '4000008717',
    company_name: 'PT ARUNIKA LEBAH KOMUNIKASI',
  },
  {
    vendor_code: '4000008628',
    company_name: 'PT. TEMPO INTI MEDIA HARIAN',
  },
  {
    vendor_code: '4000008629',
    company_name: 'PT. WAHANA EKONOMI SEMESTA',
  },
  {
    vendor_code: '4000008511',
    company_name: 'PT DELOITTE KONSULTAN INDONESIA',
  },
  {
    vendor_code: '4000008582',
    company_name: 'PT TRANS DIGITAL MEDIA-DETIKCOM',
  },
  {
    vendor_code: '4000008583',
    company_name: 'PT TRANS NEWS CORPORA',
  },
  {
    vendor_code: '4000008584',
    company_name: 'PT KOMPAS CYBER MEDIA',
  },
  {
    vendor_code: '4000008613',
    company_name: 'PT. ASIA NET MANDIRI',
  },
  {
    vendor_code: '4000008616',
    company_name: 'PT. JAC CONSULTING INDONESIA',
  },
  {
    vendor_code: '4000008617',
    company_name: 'PT. MERAH PUTIH MEDIA',
  },
  {
    vendor_code: '40I4078000',
    company_name: 'PT. TOYOTA ASTRA FINANCIAL SERVICES',
  },
  {
    vendor_code: '4000008496',
    company_name: 'PT. KRAKATAU BAJA INDUSTRI',
  },
  {
    vendor_code: '4000008441',
    company_name: 'PT. WAHANA KENDALI MUTU',
  },
  {
    vendor_code: '4000008437',
    company_name: 'PT. AKSARA BUANA',
  },
  {
    vendor_code: '4000008431',
    company_name: 'YAYASAN KESEHATAN TELOGOREJO',
  },
  {
    vendor_code: '4000008430',
    company_name: 'PT. TARA BHASKARA AEVITAS',
  },
  {
    vendor_code: '4000008407',
    company_name: 'FAKULTAS EKONOMI DAN MANAJEMEN',
  },
  {
    vendor_code: '4000008408',
    company_name: 'PT. TAIYO KATECS INDONESIA',
  },
  {
    vendor_code: '4000008410',
    company_name: 'PT. MANDIRI CITIKOM INDONESIA',
  },
  {
    vendor_code: '4000008393',
    company_name: 'KPMG LLP',
  },
  {
    vendor_code: '4000008384',
    company_name: 'ARGAMANUNGGAL ABADI UTAMA PT',
  },
  {
    vendor_code: '4000008385',
    company_name: 'PT.CITRA MEDIANUSA PURNAMA',
  },
  {
    vendor_code: '4000003999',
    company_name: 'TOYOTA TSUSHO SYSTEMS (THAILAND)',
  },
  {
    vendor_code: '4000008337',
    company_name: 'PT. SETIA RACHMAT PARAMA',
  },
  {
    vendor_code: '4000008332',
    company_name: 'PT. ORENS KREASI INDONESIA',
  },
  {
    vendor_code: '4000008333',
    company_name: 'INTERNATIONAL CANCER SPECIALISTS',
  },
  {
    vendor_code: '4000008304',
    company_name: 'PT. PURANTARA MITRA ANGKASA DUA',
  },
  {
    vendor_code: '4000008266',
    company_name: 'PT DAIHATSU DRIVETRAIN MANUFAC',
  },
  {
    vendor_code: '4000008267',
    company_name: 'PT IVONESIA SOLUSI DATA',
  },
  {
    vendor_code: '4000002828',
    company_name: 'PT. AUTOACCINDO JAYA',
  },
  {
    vendor_code: '4000003926',
    company_name: 'TOYOTA PERSONNEL SUPPORT',
  },
  {
    vendor_code: '4000006022',
    company_name: 'JOHNNY DARMAWAN DANUSASMITA',
  },
  {
    vendor_code: '4000006362',
    company_name: 'NATIONAL UNIVERSITY OF SINGAPORE',
  },
  {
    vendor_code: '4000006458',
    company_name: 'PT.AUTRANS ASIA INDONESIA',
  },
  {
    vendor_code: '4000006484',
    company_name: 'TASI - ADM',
  },
  {
    vendor_code: '4000006485',
    company_name: 'TAMA - ADM',
  },
  {
    vendor_code: '4000006486',
    company_name: 'TDPM - ADM',
  },
  {
    vendor_code: '4000006487',
    company_name: 'TFTI - ADM',
  },
  {
    vendor_code: '4000006488',
    company_name: 'TIPI - ADM',
  },
  {
    vendor_code: '4000006489',
    company_name: 'TMAJ - ADM',
  },
  {
    vendor_code: '4000006490',
    company_name: 'TMES - ADM',
  },
  {
    vendor_code: '4000006491',
    company_name: 'TSTP - ADM',
  },
  {
    vendor_code: '4000006492',
    company_name: 'TTCH - ADM',
  },
  {
    vendor_code: '4000006493',
    company_name: 'TYPI - ADM',
  },
  {
    vendor_code: '4000006515',
    company_name: 'PT.AGUNG JASA LOGISTIK',
  },
  {
    vendor_code: '4000006577',
    company_name: 'ASSY & PAINTING KARAWANG 1',
  },
  {
    vendor_code: '4000006584',
    company_name: 'PT.ASTRA KOMPONEN INDONESIA',
  },
  {
    vendor_code: '4000006587',
    company_name: 'PT ARTIFA SUKSES PERSADA',
  },
  {
    vendor_code: '4000006658',
    company_name: 'BOB AZAM',
  },
  {
    vendor_code: '4000006659',
    company_name: 'PT.BOLTZ INDONESIA',
  },
  {
    vendor_code: '4000006677',
    company_name: 'PT. CABLE TECH',
  },
  {
    vendor_code: '4000006696',
    company_name: 'COMPONENT EXPORT VANNING',
  },
  {
    vendor_code: '4000006721',
    company_name: 'PT.CIPTA MANDIRI WIRASAKTI',
  },
  {
    vendor_code: '4000006723',
    company_name: 'CASTING PRODUCTION SUNTER 2',
  },
  {
    vendor_code: '4000006726',
    company_name: 'CORPORATE PLANNING OFFICE',
  },
  {
    vendor_code: '4000006730',
    company_name: 'CORPORATE SOCIAL RESPONSIBILITIES O',
  },
  {
    vendor_code: '4000006731',
    company_name: 'PT CONTINENTAL AUTOMOTIVE INDONESIA',
  },
  {
    vendor_code: '4000006753',
    company_name: 'PT. DEWA CIPTA UTAMA',
  },
  {
    vendor_code: '4000006774',
    company_name: 'PT DIMENSI INTERNASIONAL TAX',
  },
  {
    vendor_code: '4000006780',
    company_name: 'DATINDO IMAGE WERKS',
  },
  {
    vendor_code: '4000006782',
    company_name: 'DIES & JIG CREATIONS',
  },
  {
    vendor_code: '4000006807',
    company_name: 'EXTERNAL AFFAIRS',
  },
  {
    vendor_code: '4000006812',
    company_name: 'ENGINEERING MANAGEMENT',
  },
  {
    vendor_code: '4000006817',
    company_name: 'EDWARD OTTO K',
  },
  {
    vendor_code: '4000006818',
    company_name: 'PT. ESA GARDA PRATAMA',
  },
  {
    vendor_code: '4000006819',
    company_name: 'EXPORT IMPORT',
  },
  {
    vendor_code: '4000006820',
    company_name: 'PT. EDCON JAYA PURNAMA',
  },
  {
    vendor_code: '4000006837',
    company_name: 'ENGINE PRODUCTION KARAWANG 3',
  },
  {
    vendor_code: '4000006838',
    company_name: 'ENGINE PRODUCTION SUNTER 1',
  },
  {
    vendor_code: '4000006860',
    company_name: 'FINANCE',
  },
  {
    vendor_code: '4000006889',
    company_name: 'GASECURITY AND COMMUNITY DEVELOPME',
  },
  {
    vendor_code: '4000006890',
    company_name: 'GAADMINISTRATION',
  },
  {
    vendor_code: '4000006891',
    company_name: 'GAOFFICE & FACILITY ENGINEERING',
  },
  {
    vendor_code: '4000006900',
    company_name: 'PT. GAYA MOTOR',
  },
  {
    vendor_code: '4000006945',
    company_name: 'PT.GTEKT INDONESIA MANUFACTURING',
  },
  {
    vendor_code: '4000006964',
    company_name: 'HARTONO PRAYUDHIA & MARTOSRIWARDOYO',
  },
  {
    vendor_code: '4000007000',
    company_name: 'HUMAN RESOURCES',
  },
  {
    vendor_code: '4000007009',
    company_name: 'INTERNAL AUDIT',
  },
  {
    vendor_code: '4000007023',
    company_name: 'PT INTEGRAL DATA PRIMA (ORTAX)',
  },
  {
    vendor_code: '4000007024',
    company_name: 'PT.INTERGLOBAL ELECTRIC PARTS',
  },
  {
    vendor_code: '4000007030',
    company_name: 'CV.AL IHSANIAH',
  },
  {
    vendor_code: '4000007032',
    company_name: 'PT. ICHII INDUSTRIES INDONESIA',
  },
  {
    vendor_code: '4000007043',
    company_name: 'INTEGRATED LOGISTIC & AFTER SALES',
  },
  {
    vendor_code: '4000007086',
    company_name: 'PT.INDOSPRING',
  },
  {
    vendor_code: '4000007089',
    company_name: 'INFORMATION SYSTEM & TECHNOLOGY',
  },
  {
    vendor_code: '4000007093',
    company_name: 'PT. INDONESIA THAI SUMMIT PLASTECH',
  },
  {
    vendor_code: '4000007101',
    company_name: 'PT.JIDOSHA BUHIN INDONESIA',
  },
  {
    vendor_code: '4000007105',
    company_name: 'PT.JFD INDONESIA',
  },
  {
    vendor_code: '4000007110',
    company_name: 'PT. JALAPRIMA PERKASA',
  },
  {
    vendor_code: '4000007117',
    company_name: 'PT. GESIT SARANA PERKASA',
  },
  {
    vendor_code: '4000007138',
    company_name: 'CV. RARA KAORI JAPANESE BUSINESS SU',
  },
  {
    vendor_code: '4000007141',
    company_name: 'KAP PAUL HADIWINATA',
  },
  {
    vendor_code: '4000007150',
    company_name: 'KAS NEGARA',
  },
  {
    vendor_code: '4000007166',
    company_name: 'PT. KENDALI PARAMITA',
  },
  {
    vendor_code: '4000007174',
    company_name: 'PT.KINUGAWA INDONESIA',
  },
  {
    vendor_code: '4000007176',
    company_name: 'KJPP FIRMAN SURYANTORO SUGENG SUZY',
  },
  {
    vendor_code: '4000007188',
    company_name: 'PT. KOFUKU ABADI',
  },
  {
    vendor_code: '4000007227',
    company_name: 'LEGAL OFFICE',
  },
  {
    vendor_code: '4000007231',
    company_name: 'LOGISTIC PLANNING',
  },
  {
    vendor_code: '4000007234',
    company_name: 'I MADE DANA',
  },
  {
    vendor_code: '4000007245',
    company_name: 'PT.MUSASHI AUTO PARTS INDONESIA',
  },
  {
    vendor_code: '4000007261',
    company_name: 'PT. MITSUBOSHI BELTING SALES INDONE',
  },
  {
    vendor_code: '4000007294',
    company_name: 'PT. METROCOM JADDI TECHNOLOGY',
  },
  {
    vendor_code: '4000007323',
    company_name: 'PT. MULTIFILING MITRA INDONESIA TBK',
  },
  {
    vendor_code: '4000007364',
    company_name: 'NANDI JULIYANTO',
  },
  {
    vendor_code: '4000007404',
    company_name: 'PT. NTN BEARING INDONESIA',
  },
  {
    vendor_code: '4000007418',
    company_name: 'OPERATIONS MANAGEMENT DEVELOPMENT',
  },
  {
    vendor_code: '4000007419',
    company_name: 'PT OMEGA ELEKTRIK INDONESIA',
  },
  {
    vendor_code: '4000007426',
    company_name: 'PT OSCAR OSCAR',
  },
  {
    vendor_code: '4000007427',
    company_name: 'PT.OTSCON SAFETY INDONESIA',
  },
  {
    vendor_code: '4000007433',
    company_name: 'PLANT ADMINISTRATION KARAWANG 1',
  },
  {
    vendor_code: '4000007434',
    company_name: 'PLANT ADMINISTRATION KARAWANG 3',
  },
  {
    vendor_code: '4000007435',
    company_name: 'PLANT ADMINISTRATION SUNTER',
  },
  {
    vendor_code: '4000007448',
    company_name: 'PRODUCT BUSSINESS MANAGEMENT',
  },
  {
    vendor_code: '4000007449',
    company_name: 'PRODUCTION CONTROL',
  },
  {
    vendor_code: '4000007454',
    company_name: 'PRODUCTION ENGINEERING',
  },
  {
    vendor_code: '4000007455',
    company_name: 'PLANT ENGINEERING & ENVIRONTMENT',
  },
  {
    vendor_code: '4000007456',
    company_name: 'PLANT ENGINEERING & ENVIRONTMENT',
  },
  {
    vendor_code: '4000007464',
    company_name: 'PT PERSONEL ALIH DAYA',
  },
  {
    vendor_code: '4000007478',
    company_name: 'VECHICLE PRODUCTION KARAWANG 2',
  },
  {
    vendor_code: '4000007495',
    company_name: 'PROJECT PLANNING & MANAGEMENT',
  },
  {
    vendor_code: '4000007507',
    company_name: 'PT. PRIMA ADHITAMA INTERNATIONAL',
  },
  {
    vendor_code: '4000007508',
    company_name: 'PRIMAYA',
  },
  {
    vendor_code: '4000007512',
    company_name: 'PRESS & WELDING KARAWANG 1',
  },
  {
    vendor_code: '4000007521',
    company_name: 'PT. PROGRESS TOYO INDONESIA',
  },
  {
    vendor_code: '4000007523',
    company_name: 'PURCHASING',
  },
  {
    vendor_code: '4000007533',
    company_name: 'QUALITY ASSURANCE',
  },
  {
    vendor_code: '4000007534',
    company_name: 'QUALITY CONTROL',
  },
  {
    vendor_code: '4000007535',
    company_name: 'PT. QUANTUM INVENTIONS INDONESIA',
  },
  {
    vendor_code: '4000007540',
    company_name: 'BOGOR LAKESIDE GOLF CLUB',
  },
  {
    vendor_code: '4000007543',
    company_name: 'JAGORAWI',
  },
  {
    vendor_code: '4000007545',
    company_name: 'KARABHA DIGDAYA',
  },
  {
    vendor_code: '4000007547',
    company_name: 'MANYARAN INDAH',
  },
  {
    vendor_code: '4000007548',
    company_name: 'PALM HILL RESORT',
  },
  {
    vendor_code: '4000007549',
    company_name: 'PONDOK INDAH PADANG GOLF',
  },
  {
    vendor_code: '4000007632',
    company_name: 'PT SIMA GRAHA UTAMA',
  },
  {
    vendor_code: '4000007633',
    company_name: 'SAFETY & HEALTH DIVISION',
  },
  {
    vendor_code: '4000007649',
    company_name: 'PT. SUNCHIRIN INDUSTRIES INDONESIA',
  },
  {
    vendor_code: '4000007672',
    company_name: 'PT.SUMBER MAS AUTORINDO',
  },
  {
    vendor_code: '4000007681',
    company_name: 'PT.SANWA MANUFACTURING INDONESIA',
  },
  {
    vendor_code: '4000007708',
    company_name: 'PRESS PRODUCTION SUNTER 2',
  },
  {
    vendor_code: '4000007718',
    company_name: 'PT. SUMMIT SEOYON AUTOMOTIVE INDONE',
  },
  {
    vendor_code: '4000007727',
    company_name: 'PT. STAL TEKNIKA',
  },
  {
    vendor_code: '4000007762',
    company_name: 'MASAMICHI TANAKA',
  },
  {
    vendor_code: '4000007786',
    company_name: 'TECHNICAL GOVERNMENT AFFAIRS OFFICE',
  },
  {
    vendor_code: '4000007787',
    company_name: 'PT.TOYODA GOSEI INDONESIA',
  },
  {
    vendor_code: '4000007790',
    company_name: 'PT. TSUANG HINE INDUSTRIAL',
  },
  {
    vendor_code: '4000007791',
    company_name: 'PT. KREASI TAKTIK JITU',
  },
  {
    vendor_code: '4000007794',
    company_name: 'TOYOTA INSTITUTE INDONESIA',
  },
  {
    vendor_code: '4000007796',
    company_name: 'PT.CITRA VAN TITIPAN KILAT',
  },
  {
    vendor_code: '4000007815',
    company_name: 'PT TMMIN EXPATRIATE',
  },
  {
    vendor_code: '4000007821',
    company_name: 'PT TOYONAGA INDONESIA',
  },
  {
    vendor_code: '4000007855',
    company_name: 'PT.TRI SAUDARA SENTOSA INDUSTRI',
  },
  {
    vendor_code: '4000007870',
    company_name: 'PT TOYOTA TSUSHO SYSTEMS INDONESIA',
  },
  {
    vendor_code: '4000007874',
    company_name: 'TURMUDI S',
  },
  {
    vendor_code: '4000007878',
    company_name: 'UNIVERSITAS KRISTEN INDONESIA FK',
  },
  {
    vendor_code: '4000007900',
    company_name: 'WARIH A T',
  },
  {
    vendor_code: '4000007908',
    company_name: 'PT.WHETRON JAYA INDONESIA',
  },
  {
    vendor_code: '4000007916',
    company_name: 'PT.YOROZU AUTOMOTIVE INDONESIA',
  },
  {
    vendor_code: '4000007918',
    company_name: 'TAKESHI YAMAKAWA',
  },
  {
    vendor_code: '4000007923',
    company_name: 'PT.YOKOTEN CREATIVE INDONESIA',
  },
  {
    vendor_code: '4000007931',
    company_name: 'PT YUASA SHOJI INDONESIA',
  },
  {
    vendor_code: '4000007935',
    company_name: 'YUI HASTORO',
  },
  {
    vendor_code: '4000007941',
    company_name: 'PT. BISNIS INDONESIA GAGASKREASITAM',
  },
  {
    vendor_code: '4000007945',
    company_name: 'PT. DUA MENARA CAKRAWALA',
  },
  {
    vendor_code: '4000007946',
    company_name: 'PT ESA GADA PERKASA',
  },
  {
    vendor_code: '4000007947',
    company_name: 'AEUROPE CERTIFICATION PTE. LTD.',
  },
  {
    vendor_code: '4000007950',
    company_name: 'PT. JATI PIRANTI SOLUSINDO',
  },
  {
    vendor_code: '4000007951',
    company_name: 'PT. KARYA LINTAS KARSA',
  },
  {
    vendor_code: '4000007952',
    company_name: 'PT KARAWANG JABAR INDUSTRIAL',
  },
  {
    vendor_code: '4000007953',
    company_name: 'PT. KELUARGA SELARAS SEJAHTERA',
  },
  {
    vendor_code: '4000007954',
    company_name: 'PT. KARYA UTAMA GAMA',
  },
  {
    vendor_code: '4000007961',
    company_name: 'PT. PATIMBAN INTERNATIONAL CAR TERM',
  },
  {
    vendor_code: '4000007962',
    company_name: 'PT.PRADIPTA JATIS INDONESIA',
  },
  {
    vendor_code: '4000007964',
    company_name: 'PPM MANAJEMEN',
  },
  {
    vendor_code: '4000007966',
    company_name: 'PT SAYAP BIRU EKSPRES',
  },
  {
    vendor_code: '4000007967',
    company_name: 'PT. STECHOQ ROBOTIKA INDONESIA',
  },
  {
    vendor_code: '4000007969',
    company_name: 'PT. POHON GRAHA INDAH',
  },
  {
    vendor_code: '4000007979',
    company_name: 'HUMAN RESOURCES DIVISION',
  },
  {
    vendor_code: '4000007980',
    company_name: 'JOHANES F. FERRY YAN',
  },
  {
    vendor_code: '4000007981',
    company_name: 'PT. KG ISL INFO SYSTEM',
  },
  {
    vendor_code: '4000007983',
    company_name: 'TIPP - ADM',
  },
  {
    vendor_code: '4000007984',
    company_name: 'RS PERMATA KUNINGAN',
  },
  {
    vendor_code: '4000007985',
    company_name: 'I NYOMAN WINAYA ADNYANA',
  },
  {
    vendor_code: '4000007986',
    company_name: 'PT RAYA JAYA ASIA',
  },
  {
    vendor_code: '4000007988',
    company_name: 'TOKIO MARINE LIFE INSURANCE IND',
  },
  {
    vendor_code: '4000007989',
    company_name: 'TOP DIE COMPANY LIMITED',
  },
  {
    vendor_code: '4000007990',
    company_name: 'PT. MAINTTECH ENGINEERING',
  },
  {
    vendor_code: '4000007991',
    company_name: 'PT. LEGITT BOGA MANDIRI',
  },
  {
    vendor_code: '4000007993',
    company_name: 'JAPAN MOBILITY K K',
  },
  {
    vendor_code: '4000007994',
    company_name: 'ASOSIASI PENGUSAHA INDONESIA',
  },
  {
    vendor_code: '4000007995',
    company_name: 'DELOITTE TOUCHE SOLUTIONS',
  },
  {
    vendor_code: '4000007996',
    company_name: 'FIRMA STEVEN DAN MOURITS',
  },
  {
    vendor_code: '4000007997',
    company_name: 'INDONESIA AUTOMOTIVE INSTITUTE',
  },
  {
    vendor_code: '4000007998',
    company_name: 'KIMIA FARMA KARAWANG',
  },
  {
    vendor_code: '4000007999',
    company_name: 'KORPAMWIL',
  },
  {
    vendor_code: '4000008000',
    company_name: 'MARUSUN INC.',
  },
  {
    vendor_code: '4000008001',
    company_name: 'PT GRAHA TELEKOMUNIKASI INDONESIA',
  },
  {
    vendor_code: '4000008002',
    company_name: 'PT HITACHI ASIA INDONESIA',
  },
  {
    vendor_code: '4000008003',
    company_name: 'PT MITRA PAJAKKU',
  },
  {
    vendor_code: '4000008004',
    company_name: 'PT MITSUI SOKO INDONESIA',
  },
  {
    vendor_code: '4000008005',
    company_name: 'PT SINERGI WAHANA GEMILANG',
  },
  {
    vendor_code: '4000008006',
    company_name: 'PT. ASURANSI MSIG',
  },
  {
    vendor_code: '4000008007',
    company_name: 'PT. HAY GROUP',
  },
  {
    vendor_code: '4000008008',
    company_name: 'PT. IKON ASIA KOMUNIKASI',
  },
  {
    vendor_code: '4000008009',
    company_name: 'PT. INDONESIA APPLICAD',
  },
  {
    vendor_code: '4000008010',
    company_name: 'PT. MOUNT SCOPUS INDONESIA',
  },
  {
    vendor_code: '4000008011',
    company_name: 'PT. SENYUM UNTUK NEGERI',
  },
  {
    vendor_code: '4000008012',
    company_name: 'PT. SOLUSI INTI PERKASA',
  },
  {
    vendor_code: '4000008013',
    company_name: 'PT. TEKNO LOGIKA UTAMA',
  },
  {
    vendor_code: '4000008014',
    company_name: 'PT. TIKI JALUR NUGRAHA EKA KURIR',
  },
  {
    vendor_code: '4000008015',
    company_name: 'PT.AISI AIKEN INDONESIA',
  },
  {
    vendor_code: '4000008016',
    company_name: 'PT.BINOKULAR MEDIA UTAMA',
  },
  {
    vendor_code: '4000008018',
    company_name: 'PT.NTT INDONESIA TECHNOLOGY',
  },
  {
    vendor_code: '4000008019',
    company_name: 'SEA ELECTRIC PTY LTD',
  },
  {
    vendor_code: '4000008020',
    company_name: 'SHINKOH CO.',
  },
  {
    vendor_code: '4000008021',
    company_name: 'HITACHI ASTEMO BEKASI POWERTRAIN SY',
  },
  {
    vendor_code: '4000008022',
    company_name: 'HITACHI ASTEMO BEKASI MANUFACTURING',
  },
  {
    vendor_code: '4000008023',
    company_name: 'PT. ITA SHOP PELAGUS GLOBAL',
  },
  {
    vendor_code: '4000008024',
    company_name: 'PT. KARUNIA ANUGRAH LESTARI',
  },
  {
    vendor_code: '4000008025',
    company_name: 'PT WEHA TRANSPORTASI INDONESIA TBK',
  },
  {
    vendor_code: '4000008026',
    company_name: 'PT GAWS INTI SOLUSI',
  },
  {
    vendor_code: '4000008028',
    company_name: 'RS ABDUL RADJAK JAKARTA',
  },
  {
    vendor_code: '4000008029',
    company_name: 'AUTO CARRIER (THAILAND) CO.',
  },
  {
    vendor_code: '4000008030',
    company_name: 'PT. NISSHO SOLUTION INDONESIA',
  },
  {
    vendor_code: '4000008031',
    company_name: 'PT. JAC BUSINESS CENTER',
  },
  {
    vendor_code: '4000008032',
    company_name: 'PT. DAMCO INDONESIA',
  },
  {
    vendor_code: '4000008033',
    company_name: 'PT. BERKAH HAYAMA FAUZI',
  },
  {
    vendor_code: '4000008034',
    company_name: 'PT. WELLBE INDONESIA',
  },
  {
    vendor_code: '4000008035',
    company_name: 'ANUGRAH KARYA TRANS EXPRESS',
  },
  {
    vendor_code: '4000008036',
    company_name: 'GABUNGAN PERUSAHAAN EKSPOR INA',
  },
  {
    vendor_code: '4000008037',
    company_name: 'PT. PRECENA JAC STRATEGIC PARTNERS',
  },
  {
    vendor_code: '4000008038',
    company_name: 'RS TMC TASIKMALAYA',
  },
  {
    vendor_code: '4000008039',
    company_name: 'LEMBAGA TEKNOLOGI FTUI',
  },
  {
    vendor_code: '4000008040',
    company_name: 'PT. ARGA BANGUN BANGSA',
  },
  {
    vendor_code: '4000008041',
    company_name: 'THE JAKARTA JAPAN CLUB',
  },
  {
    vendor_code: '4000008042',
    company_name: 'PT. KATADATA INDONESIA',
  },
  {
    vendor_code: '4000008043',
    company_name: 'RS GRHA MM2100',
  },
  {
    vendor_code: '4000008044',
    company_name: 'RS PRIMAYA BEKASI UTARA',
  },
  {
    vendor_code: '4000008045',
    company_name: 'RS PRIMAYA BEKASI BARAT',
  },
  {
    vendor_code: '4000008046',
    company_name: 'RS MITRA KELUARGA JATIASIH',
  },
  {
    vendor_code: '4000008047',
    company_name: 'ANTARA ELEKTRONIK TRANSAKSI PRATAMA',
  },
  {
    vendor_code: '4000008048',
    company_name: 'PT.ANDHANA KIRANA YASA',
  },
  {
    vendor_code: '4000008049',
    company_name: 'PT.SANKO SOFLAN INDONESIA',
  },
  {
    vendor_code: '4000008050',
    company_name: 'INTERLINK K.K.',
  },
  {
    vendor_code: '4000008051',
    company_name: 'RS EKA HOSPITAL BEKASI',
  },
  {
    vendor_code: '4000008052',
    company_name: 'PT. HANTARI NARA LUHUR INTERNASIONA',
  },
  {
    vendor_code: '4000008053',
    company_name: 'PT AGORA GENERAL HOSPITAL',
  },
  {
    vendor_code: '4000008054',
    company_name: 'RS ABDUL RADJAK PURWAKARTA',
  },
  {
    vendor_code: '4000008055',
    company_name: 'RS PRIMAYA TANGERANG',
  },
  {
    vendor_code: '4000008056',
    company_name: 'RS PERMATA KARAWANG',
  },
  {
    vendor_code: '4000008057',
    company_name: 'PT. INDONESIA TEKNO KREATIFE',
  },
  {
    vendor_code: '4000008058',
    company_name: 'PT. ARTA BUANA KARYA',
  },
  {
    vendor_code: '4000008059',
    company_name: 'PT. DESSERT ISLAND AGENCY',
  },
  {
    vendor_code: '4000008060',
    company_name: 'PT. TOYOTA TSUSHO REAL ESTATE CIKAR',
  },
  {
    vendor_code: '4000008061',
    company_name: 'NORIAKI KUROKAWA',
  },
  {
    vendor_code: '4000008062',
    company_name: 'QUALITY DIVISION',
  },
  {
    vendor_code: '4000008063',
    company_name: 'GENERAL AFFAIRS DIVISION',
  },
  {
    vendor_code: '4000008064',
    company_name: 'PT.AGUNG PERTIWI NAULI',
  },
  {
    vendor_code: '4000008127',
    company_name: 'PT. MITSUBA AUTOMOTIVE PARTS',
  },
  {
    vendor_code: '4000008130',
    company_name: 'YAYASAN JABAT HATI INDONESIA JEPANG',
  },
  {
    vendor_code: '4000008131',
    company_name: 'PT. SARANA INDAH PERMAI RESIDEN',
  },
  {
    vendor_code: '4000008132',
    company_name: 'PT. SISKOM MEDIA BAHASA',
  },
  {
    vendor_code: '4000008133',
    company_name: 'PT. ALCOS GRAHA JAYA',
  },
  {
    vendor_code: '4000008134',
    company_name: 'PT. PISON MENGALIR ABADI',
  },
  {
    vendor_code: '4000008135',
    company_name: 'PT. MEDIKALOKA INTERNUSA',
  },
  {
    vendor_code: '4000008136',
    company_name: 'PT. PERDANA PERKASA MANDIRI',
  },
  {
    vendor_code: '4000008137',
    company_name: 'PT. REKSO SATYA ABADI',
  },
  {
    vendor_code: '4000008138',
    company_name: 'PT. ULTRAFILTER INDONESIA',
  },
  {
    vendor_code: '4000008139',
    company_name: 'PT. 3 CONSULTING SERVICES',
  },
  {
    vendor_code: '4000008140',
    company_name: 'KAP HELIANTONO & REKAN',
  },
  {
    vendor_code: '4000008141',
    company_name: 'PT. SISMADI MEDCORPINDO BOYOLALI',
  },
  {
    vendor_code: '4000008142',
    company_name: 'PT. ERA GEMILANG PERKASA',
  },
  {
    vendor_code: '4000008143',
    company_name: 'PT. SIMPLY DIMENSI INDONESIA',
  },
  {
    vendor_code: '4000008144',
    company_name: 'KOMPAS MEDIA NUSANTARA',
  },
  {
    vendor_code: '4000008145',
    company_name: 'PT. YCP SOLIDIANCE INDONESIA',
  },
  {
    vendor_code: '4000008146',
    company_name: 'RS PKU MUHAMMADIYAH GOMBONG',
  },
  {
    vendor_code: '4000008162',
    company_name: 'PT. KORAN MEDIA INVESTOR INDONESIA',
  },
  {
    vendor_code: '4000008163',
    company_name: 'PT. ARJUNA WIJAYA KARYA',
  },
  {
    vendor_code: '4000008164',
    company_name: 'PT. DAKAR ESHAN ABADI',
  },
  {
    vendor_code: '4000008165',
    company_name: 'PT. SAMUDERA PERKASA MACHINERY',
  },
  {
    vendor_code: '4000008166',
    company_name: 'PT. QUAD KONTENA LOGISTICS',
  },
  {
    vendor_code: '4000008167',
    company_name: 'PT. SERASI TRANSPORTASI NUSANTARA',
  },
  {
    vendor_code: '4000008168',
    company_name: 'ASTEK 2',
  },
  {
    vendor_code: '40I1052000',
    company_name: 'TOYOTA PRODUCTION ENGINEERING',
  },
  {
    vendor_code: '40I4056000',
    company_name: 'TOYOTA TSUSHO SYSTEMS',
  },
  {
    vendor_code: '40I6002000',
    company_name: 'TOYOTA DO BRASIL LTDA',
  },
  {
    vendor_code: 'TBNINID001',
    company_name: 'BNI TAPENAS SYARIAH',
  },
  {
    vendor_code: '253642',
    company_name: 'PT. HIDRO SEAL TECH INDONESIA',
  },
  {
    vendor_code: '253724',
    company_name: 'PT.KARTIKA STAR ENGINEERING',
  },
  {
    vendor_code: '253704',
    company_name: 'CV HARAPAN JAYA',
  },
  {
    vendor_code: '253675',
    company_name: 'PT. TUNAS KARYA NUSANTARA UTAMA',
  },
  {
    vendor_code: '253660',
    company_name: 'PT. SARANA ALLOY CASTING',
  },
  {
    vendor_code: '253652',
    company_name: 'PT AKBAR BUDI SAKTI',
  },
  {
    vendor_code: '253637',
    company_name: 'PT. DAIKI ALUMINIUM INDUSTRY INDONE',
  },
  {
    vendor_code: '253588',
    company_name: 'PT. REJEKI INTILOGAM JAYA',
  },
  {
    vendor_code: '253583',
    company_name: 'PT.CENTRAL PNEUMATIC INDONESIA',
  },
  {
    vendor_code: '253578',
    company_name: 'PT.AENINDO KARUNIA MANDIRI',
  },
  {
    vendor_code: '253564',
    company_name: 'PT.MEDIA WARNA CEMERLANG',
  },
  {
    vendor_code: '253577',
    company_name: 'PT.SEKISUI KASEI INDONESIA',
  },
  {
    vendor_code: '253563',
    company_name: 'MEGAH NUSANTARA PERKASA',
  },
  {
    vendor_code: '253576',
    company_name: 'SINJIWIRA JAYA ABADI PT.',
  },
  {
    vendor_code: '-',
    company_name: 'AKEBONO BRAKE ASTRA INDONESIA',
  },
  {
    vendor_code: '1',
    company_name: 'INTI GANDA PERDANA',
  },
  {
    vendor_code: '100001',
    company_name: 'INTI GANDA PERDANA',
  },
  {
    vendor_code: '100003',
    company_name: 'PT. SUGITY CREATIVES',
  },
  {
    vendor_code: '100004',
    company_name: 'GEMALA KEMPA DAYA',
  },
  {
    vendor_code: '100005',
    company_name: 'PT ASTRA DAIHATSU MOTOR',
  },
  {
    vendor_code: '100006',
    company_name: 'ASTRA OTOPARTS TBK',
  },
  {
    vendor_code: '100007',
    company_name: 'ASTRA OTOPARTS TBK',
  },
  {
    vendor_code: '100008',
    company_name: 'ASTRA OTOPARTS TBK',
  },
  {
    vendor_code: '100035',
    company_name: 'ASTRA INTERNATIONAL TBK',
  },
  {
    vendor_code: '100038',
    company_name: 'SCIENTEK COMPUTINDO',
  },
  {
    vendor_code: '100045',
    company_name: 'PT ASTRA DAIHATSU MOTOR',
  },
  {
    vendor_code: '100047',
    company_name: 'MEKAR ARMADA JAYA (TAMBUN)',
  },
  {
    vendor_code: '100048',
    company_name: 'PATEC PRESISI ENGINEERING',
  },
  {
    vendor_code: '100049',
    company_name: 'PATEC PRESISI ENGINEERING',
  },
  {
    vendor_code: '100050',
    company_name: 'T T METALS INDONESIA',
  },
  {
    vendor_code: '1050',
    company_name: 'T T METALS INDONESIA',
  },
  {
    vendor_code: '1056',
    company_name: 'PT. KRAKATAU STEEL (PERSERO) TBK.',
  },
  {
    vendor_code: '1153',
    company_name: 'STEEL CENTER INDONESIA',
  },
  {
    vendor_code: '1162',
    company_name: 'T T METALS INDONESIA',
  },
  {
    vendor_code: '1180',
    company_name: 'SUPER STEEL KARAWANG',
  },
  {
    vendor_code: '15',
    company_name: 'PT ASTRA DAIHATSU MOTOR',
  },
  {
    vendor_code: '150000',
    company_name: 'NUSA TOYOTETSU CORP.',
  },
  {
    vendor_code: '150001',
    company_name: 'PAMINDO TIGA T.',
  },
  {
    vendor_code: '150002',
    company_name: 'ASALTA MANDIRI AGUNG',
  },
  {
    vendor_code: '150003',
    company_name: 'METINDO ERA SAKTI',
  },
  {
    vendor_code: '150004',
    company_name: 'GUNA SENAPUTRA SEJAHTERA',
  },
  {
    vendor_code: '150005',
    company_name: 'AT INDONESIA',
  },
  {
    vendor_code: '150006',
    company_name: 'NUSAHADI CITRAHARMONIS',
  },
  {
    vendor_code: '150008',
    company_name: 'KOMPONEN FUTABA NUSAPERSADA',
  },
  {
    vendor_code: '150009',
    company_name: 'TOYOTA BOSHOKU INDONESIA',
  },
  {
    vendor_code: '150010',
    company_name: '3 M INDONESIA',
  },
  {
    vendor_code: '150011',
    company_name: 'AISIN INDONESIA',
  },
  {
    vendor_code: '150014',
    company_name: 'ARGAPURA TRADING COMPANY',
  },
  {
    vendor_code: '150015',
    company_name: 'ASAHIMAS FLAT GLASS',
  },
  {
    vendor_code: '150017',
    company_name: 'BANDO INDONESIA',
  },
  {
    vendor_code: '150018',
    company_name: 'BRIDGESTONE TIRE INDONESIA',
  },
  {
    vendor_code: '150019',
    company_name: 'CATURINDO AGUNGJAYA RUBBER',
  },
  {
    vendor_code: '150020',
    company_name: 'CHUHATSU INDONESIA',
  },
  {
    vendor_code: '150021',
    company_name: 'PT. DASA WINDU AGUNG',
  },
  {
    vendor_code: '150022',
    company_name: 'DENSO SALES INDONESIA',
  },
  {
    vendor_code: '150024',
    company_name: 'AUTOCOMP SYSTEMS INDONESIA',
  },
  {
    vendor_code: '150025',
    company_name: 'ENKEI INDONESIA',
  },
  {
    vendor_code: '150026',
    company_name: 'PT GS BATTERY',
  },
  {
    vendor_code: '150027',
    company_name: 'GAJAH TUNGGAL TBK',
  },
  {
    vendor_code: '150028',
    company_name: 'GARUDA METAL UTAMA',
  },
  {
    vendor_code: '150029',
    company_name: 'GARUDA METALINDO',
  },
  {
    vendor_code: '150032',
    company_name: 'HILEX INDONESIA',
  },
  {
    vendor_code: '150033',
    company_name: 'ICHIKOH INDONESIA',
  },
  {
    vendor_code: '150035',
    company_name: 'INDOKARLO PERKASA',
  },
  {
    vendor_code: '150036',
    company_name: 'DENSO SALES INDOPARTS UTAMA',
  },
  {
    vendor_code: '150037',
    company_name: 'INDOSAFETY SENTOSA INDUSTRY',
  },
  {
    vendor_code: '150038',
    company_name: 'P.T.AISAN NASMOCO INDUSTRI',
  },
  {
    vendor_code: '150039',
    company_name: 'PT. FTS AUTOMOTIVE INDONESIA',
  },
  {
    vendor_code: '150040',
    company_name: 'AUTOLIV INDONESIA',
  },
  {
    vendor_code: '150044',
    company_name: 'INKOASKU',
  },
  {
    vendor_code: '150048',
    company_name: 'KAYABA INDONESIA',
  },
  {
    vendor_code: '150055',
    company_name: 'PT. INDONESIA STANLEY ELECTRIC',
  },
  {
    vendor_code: '150056',
    company_name: 'PT. KRAKATAU STEEL (PERSERO) TBK.',
  },
  {
    vendor_code: '150057',
    company_name: 'MEGAH PITA INDONESIA',
  },
  {
    vendor_code: '150058',
    company_name: 'KYORAKU B.IND',
  },
  {
    vendor_code: '150059',
    company_name: 'NSK INDONESIA',
  },
  {
    vendor_code: '150060',
    company_name: 'NT PISTON RING INDONESIA',
  },
  {
    vendor_code: '150062',
    company_name: 'MENARA TERUS MAKMUR',
  },
  {
    vendor_code: '150064',
    company_name: 'MESHINDO ALLOY WHEEL',
  },
  {
    vendor_code: '150065',
    company_name: 'SANOH INDONESIA',
  },
  {
    vendor_code: '150067',
    company_name: 'TAIHO NUSANTARA',
  },
  {
    vendor_code: '150069',
    company_name: 'MUARATEWEH SPRING',
  },
  {
    vendor_code: '150074',
    company_name: 'NICHIAS SUNI JAYA',
  },
  {
    vendor_code: '150075',
    company_name: 'OTICS INDONESIA',
  },
  {
    vendor_code: '150076',
    company_name: 'PAKARTI RIKEN INDONESIA',
  },
  {
    vendor_code: '150077',
    company_name: 'PAKOAKUINA',
  },
  {
    vendor_code: '150079',
    company_name: 'PUTRA INDONESIA',
  },
  {
    vendor_code: '150082',
    company_name: 'SUMI INDO WIRING SYSTEMS',
  },
  {
    vendor_code: '150083',
    company_name: 'SUMI RUBBER INDONESIA',
  },
  {
    vendor_code: '150089',
    company_name: 'ASURANSI MITSUI SUMITOMO INDONESIA',
  },
  {
    vendor_code: '150092',
    company_name: 'SANTOSO TEKNINDO',
  },
  {
    vendor_code: '150136',
    company_name: 'PT.HINO MOTORS MANUFACTURING',
  },
  {
    vendor_code: '150137',
    company_name: 'PT. MULTI KARYA SINARDINAMIIKA',
  },
  {
    vendor_code: '150142',
    company_name: 'AICHI FORGING INDONESIA',
  },
  {
    vendor_code: '150143',
    company_name: 'CENTRAL MOTOR WHEEL INDONESIA',
  },
  {
    vendor_code: '150144',
    company_name: 'PT.MURAKAMI DELLOYD INDONESIA',
  },
  {
    vendor_code: '150145',
    company_name: 'FEDERAL NITTAN INDUSTRIES',
  },
  {
    vendor_code: '150146',
    company_name: 'GEMA SUARA ADHITAMA',
  },
  {
    vendor_code: '150147',
    company_name: 'TG INOAC INDONESIA',
  },
  {
    vendor_code: '150148',
    company_name: 'JAYA VICTORI CEMERLANG',
  },
  {
    vendor_code: '150150',
    company_name: 'NAMICOH INDONESIA COMPONENT',
  },
  {
    vendor_code: '150151',
    company_name: 'SAKURA JAVA INDONESIA',
  },
  {
    vendor_code: '150153',
    company_name: 'STEEL CENTER INDONESIA',
  },
  {
    vendor_code: '150154',
    company_name: 'TAKENAKA INDONESIA',
  },
  {
    vendor_code: '150155',
    company_name: 'TOYODA GOSEI SAFETY SYSTEMS IND',
  },
  {
    vendor_code: '150157',
    company_name: 'DAIDO METAL INDONESIA',
  },
  {
    vendor_code: '150158',
    company_name: 'NSK INDONESIA',
  },
  {
    vendor_code: '150159',
    company_name: 'ADVICS INDONESIA',
  },
  {
    vendor_code: '150160',
    company_name: 'AUTOCOMP SYSTEMS INDONESIA',
  },
  {
    vendor_code: '150162',
    company_name: 'T T METALS INDONESIA',
  },
  {
    vendor_code: '150163',
    company_name: 'DITJEN BEA DAN CUKAI',
  },
  {
    vendor_code: '150164',
    company_name: 'PUNINAR JAYA',
  },
  {
    vendor_code: '150165',
    company_name: 'DENSO SALES INDONESIA',
  },
  {
    vendor_code: '150168',
    company_name: 'PT. GEMILANG LAJU SEJAHTERA',
  },
  {
    vendor_code: '150169',
    company_name: 'PT. GEMILANG LAJU SEJAHTERA',
  },
  {
    vendor_code: '150170',
    company_name: 'HANINDO CITRA',
  },
  {
    vendor_code: '150171',
    company_name: 'NIPSEA PAINT AND CHEMICALS',
  },
  {
    vendor_code: '150172',
    company_name: 'KANSAI PAINT INDONESIA',
  },
  {
    vendor_code: '150173',
    company_name: 'PT PUNINAR EXPRESS INDONESIA',
  },
  {
    vendor_code: '150174',
    company_name: 'AUTOCAR INDUSTRI KOMPONEN',
  },
  {
    vendor_code: '150175',
    company_name: 'CHIYODA INTEGRE INDONESIA',
  },
  {
    vendor_code: '150179',
    company_name: 'AUTOCAR INDUSTRI KOMPONEN',
  },
  {
    vendor_code: '150180',
    company_name: 'SUPER STEEL KARAWANG',
  },
  {
    vendor_code: '150182',
    company_name: 'PT. ASTRA JUOKU INDONESIA',
  },
  {
    vendor_code: '200003',
    company_name: 'ASTRA INTERNATIONAL TBK',
  },
  {
    vendor_code: '200012',
    company_name: 'AII AUTO 2000 KARAWANG',
  },
  {
    vendor_code: '200019',
    company_name: 'ASTRA GRAPHIA TBK (FOR FOTOCOPY)',
  },
  {
    vendor_code: '200024',
    company_name: 'PT TOYOTA ASTRA MOTOR',
  },
  {
    vendor_code: '200025',
    company_name: 'SMART MILLENIUM ENTERPRISE',
  },
  {
    vendor_code: '200030',
    company_name: 'KIJANGMAS CIPTA',
  },
  {
    vendor_code: '200032',
    company_name: 'PT. ASTRA AVIVA LIFE',
  },
  {
    vendor_code: '200034',
    company_name: 'PT. ASTRA OTOPARTS TBK EDC',
  },
  {
    vendor_code: '24',
    company_name: 'PT TOYOTA ASTRA MOTOR',
  },
  {
    vendor_code: '250003',
    company_name: 'CV. GROW',
  },
  {
    vendor_code: '250008',
    company_name: 'AKAI PRECISION COMPONENTS',
  },
  {
    vendor_code: '250011',
    company_name: 'ALCORINDO SEJAHTERA',
  },
  {
    vendor_code: '250012',
    company_name: 'ALFA TAILOR',
  },
  {
    vendor_code: '250014',
    company_name: 'ALFA TEKNINDO PERDANA',
  },
  {
    vendor_code: '250015',
    company_name: 'ALLINDO COIN MAS ERA',
  },
  {
    vendor_code: '250017',
    company_name: 'ANDALAN FLUID SISTEM',
  },
  {
    vendor_code: '250020',
    company_name: 'ANEKA BINA CITRA',
  },
  {
    vendor_code: '250024',
    company_name: 'ANEKA INFOKOM TEKINDO',
  },
  {
    vendor_code: '250025',
    company_name: 'ANEKA SARI RESTAURANT',
  },
  {
    vendor_code: '250031',
    company_name: 'APORA AKINDO',
  },
  {
    vendor_code: '250033',
    company_name: 'ARIANTO DARMAWAN',
  },
  {
    vendor_code: '250034',
    company_name: 'ARICO SAINSINDO NUSANTARA',
  },
  {
    vendor_code: '250038',
    company_name: 'TODANO TEKNINDO NATAMA',
  },
  {
    vendor_code: '250040',
    company_name: 'ASTA SAMI MAKMUR ABADI',
  },
  {
    vendor_code: '250041',
    company_name: 'PT. ASTRA GRAPHIA INFORMATION TECHN',
  },
  {
    vendor_code: '250042',
    company_name: 'ATLAS COPCO INDONESIA',
  },
  {
    vendor_code: '250043',
    company_name: 'PT. ATLAS PETROCHEM INDO',
  },
  {
    vendor_code: '250044',
    company_name: 'AUTO JAYA ID TECH',
  },
  {
    vendor_code: '250046',
    company_name: 'BACHTERA LADJU',
  },
  {
    vendor_code: '250047',
    company_name: 'BADJA ABADI SENTOSA',
  },
  {
    vendor_code: '250049',
    company_name: 'BAJA SATYA PRATAMA',
  },
  {
    vendor_code: '250054',
    company_name: 'PT. BSG GASES',
  },
  {
    vendor_code: '250057',
    company_name: 'BERKAH',
  },
  {
    vendor_code: '250058',
    company_name: 'BERKAT AIRHIDUP ABADI',
  },
  {
    vendor_code: '250060',
    company_name: 'BERKAT NIAGA DUNIA',
  },
  {
    vendor_code: '250061',
    company_name: 'BERKAT SEMESTA CITRA',
  },
  {
    vendor_code: '250068',
    company_name: 'BINA CAHAYA PERDANA',
  },
  {
    vendor_code: '250071',
    company_name: 'BINTANG BARUTAMA',
  },
  {
    vendor_code: '250072',
    company_name: 'BINTANG MERPATI',
  },
  {
    vendor_code: '250074',
    company_name: 'BOROBUDUR AGUNG PERKASA',
  },
  {
    vendor_code: '250080',
    company_name: 'BUMIMAS NUSAPRIMA',
  },
  {
    vendor_code: '250084',
    company_name: 'CHEMACO LESTARI INDONESIA',
  },
  {
    vendor_code: '250087',
    company_name: 'PT. SELARAS KRAFT PRIMA',
  },
  {
    vendor_code: '250095',
    company_name: 'CITRA JAYA SEMESTA',
  },
  {
    vendor_code: '250097',
    company_name: 'CITRA SUKSES EKA PRATAMA',
  },
  {
    vendor_code: '250103',
    company_name: 'CONINDO KAWAN SEJATI',
  },
  {
    vendor_code: '250105',
    company_name: 'ASPERA AFWINTA',
  },
  {
    vendor_code: '250107',
    company_name: 'KURNIA JASA BOGA',
  },
  {
    vendor_code: '250108',
    company_name: 'LIBRA CATERING',
  },
  {
    vendor_code: '250109',
    company_name: 'RIA CATERING',
  },
  {
    vendor_code: '250110',
    company_name: 'DACAN LESTARI SEJAHTERA',
  },
  {
    vendor_code: '250115',
    company_name: 'PT.NTT INDONESIA SOLUTIONS',
  },
  {
    vendor_code: '250116',
    company_name: 'DATASCRIPT',
  },
  {
    vendor_code: '250120',
    company_name: 'ASTRA DAIDO STEEL INDONESIA',
  },
  {
    vendor_code: '250121',
    company_name: 'DITEK JAYA',
  },
  {
    vendor_code: '250122',
    company_name: 'DITOSA',
  },
  {
    vendor_code: '250125',
    company_name: 'DUNIA SAFTINDO',
  },
  {
    vendor_code: '250126',
    company_name: 'DUTA FUJI ELECTRIC',
  },
  {
    vendor_code: '250127',
    company_name: 'DUTA KALINGGA PRATAMA',
  },
  {
    vendor_code: '250128',
    company_name: 'DUTA POLYKEM INDO',
  },
  {
    vendor_code: '250132',
    company_name: 'PT.DYNAMI MAKMUR LESTARI',
  },
  {
    vendor_code: '250134',
    company_name: 'EKA MULYA',
  },
  {
    vendor_code: '250137',
    company_name: 'EKATAMA PUTRA PERKASA',
  },
  {
    vendor_code: '250140',
    company_name: 'ELSISCOM PRIMA KARYA',
  },
  {
    vendor_code: '250141',
    company_name: 'ENCEHA PACIFIC',
  },
  {
    vendor_code: '250143',
    company_name: 'FANUC INDONESIA',
  },
  {
    vendor_code: '250145',
    company_name: 'FERINDO TATA WAHANA',
  },
  {
    vendor_code: '250146',
    company_name: 'FESTO',
  },
  {
    vendor_code: '250148',
    company_name: 'FT UNIVERSITAS INDONESIA',
  },
  {
    vendor_code: '250149',
    company_name: 'FLEXINDOMAS',
  },
  {
    vendor_code: '250150',
    company_name: 'FORTALARESE',
  },
  {
    vendor_code: '250151',
    company_name: 'FRANSA RITIRTA',
  },
  {
    vendor_code: '250153',
    company_name: 'FUJI PRESISI TOOL INDONESIA',
  },
  {
    vendor_code: '250154',
    company_name: 'FUJI TECHNICA INDONESIA',
  },
  {
    vendor_code: '250158',
    company_name: 'PT. KANSAI PRAKARSA COATINGS',
  },
  {
    vendor_code: '250160',
    company_name: 'GARIS SUMBU BIRU UTAMA',
  },
  {
    vendor_code: '250161',
    company_name: 'PT.THREEBOND GARPAN SALES INDONESIA',
  },
  {
    vendor_code: '250162',
    company_name: 'GEMA PUTRA ABADI',
  },
  {
    vendor_code: '250166',
    company_name: 'GUNA PIRANTI BERJAYA',
  },
  {
    vendor_code: '250168',
    company_name: 'PT.GUNUNG PUTRI GRAHA MANDIRI',
  },
  {
    vendor_code: '250169',
    company_name: 'GUNA UNGGUL SARANA LAKSANA',
  },
  {
    vendor_code: '250175',
    company_name: 'HARYA PILAR UTAMA SUKSES',
  },
  {
    vendor_code: '250177',
    company_name: 'HENINDO TECHNOLOGIES',
  },
  {
    vendor_code: '250179',
    company_name: 'HEWLETTPACKARD BERCA SERVISINDO',
  },
  {
    vendor_code: '250181',
    company_name: 'HIMALAYA EVEREST JAYA',
  },
  {
    vendor_code: '250182',
    company_name: 'HIROMINDO PERKASA',
  },
  {
    vendor_code: '250186',
    company_name: 'IBM INDONESIA',
  },
  {
    vendor_code: '250187',
    company_name: 'IMCO JAYA LESTARI PT.',
  },
  {
    vendor_code: '250191',
    company_name: 'INDO KOMPRESIGMA',
  },
  {
    vendor_code: '250194',
    company_name: 'INDOSAT',
  },
  {
    vendor_code: '250199',
    company_name: 'AIR LIQUIDE INDONESIA',
  },
  {
    vendor_code: '250201',
    company_name: 'ANDALAN DUNIA SEMESTA',
  },
  {
    vendor_code: '250202',
    company_name: 'ANTIKA RAYA',
  },
  {
    vendor_code: '250207',
    company_name: 'ASIATEC CORPORATION INDONESIA',
  },
  {
    vendor_code: '250211',
    company_name: 'PT.BERCA CARRIER INDONESIA',
  },
  {
    vendor_code: '250217',
    company_name: 'CV. BARATEK MANDIRI',
  },
  {
    vendor_code: '250220',
    company_name: 'BRIDGESTONE TIRE INDONESIA',
  },
  {
    vendor_code: '250224',
    company_name: 'CAHAYA BAJA PRIMASEJATI',
  },
  {
    vendor_code: '250226',
    company_name: 'CHEVRON OIL PRODUCT INDONESIA',
  },
  {
    vendor_code: '250231',
    company_name: 'INDOSERAKO SEJAHTERA',
  },
  {
    vendor_code: '250237',
    company_name: 'INDUSTRIAL CHEMITOMO NUSANTARA',
  },
  {
    vendor_code: '250240',
    company_name: 'INTAMA CENTRAL CARGO',
  },
  {
    vendor_code: '250246',
    company_name: 'DHARMA PRECISION TOOLS',
  },
  {
    vendor_code: '250257',
    company_name: 'DAYA DIMENSI INDONESIA',
  },
  {
    vendor_code: '250258',
    company_name: 'INA NUSANTARA ABADI',
  },
  {
    vendor_code: '250260',
    company_name: 'IWATANI INDUSTRI GAS',
  },
  {
    vendor_code: '250264',
    company_name: 'PT. EMKL JAKARTA MAJU PUSAKA',
  },
  {
    vendor_code: '250268',
    company_name: 'JAPAN ENG. TECHNOLOGY',
  },
  {
    vendor_code: '250269',
    company_name: 'DITJEN BEA DAN CUKAI',
  },
  {
    vendor_code: '250270',
    company_name: 'PT.JASA MANDIRI TECHGRAHA',
  },
  {
    vendor_code: '250275',
    company_name: 'DUTA KALINGGA PRATAMA',
  },
  {
    vendor_code: '250276',
    company_name: 'JASUINDO TIGA PERKASA',
  },
  {
    vendor_code: '250277',
    company_name: 'DUTA KARYA REKATAMA',
  },
  {
    vendor_code: '250278',
    company_name: 'PT. JASUN MAS SAKTI',
  },
  {
    vendor_code: '250280',
    company_name: 'JAVA CASTRINDO',
  },
  {
    vendor_code: '250284',
    company_name: 'JAYA KENCANA',
  },
  {
    vendor_code: '250287',
    company_name: 'PT. K LINE MOBARU DIAMOND INDONES',
  },
  {
    vendor_code: '250289',
    company_name: 'PT. KAHAR DUTA SARANA',
  },
  {
    vendor_code: '250290',
    company_name: 'PT. JUARA TEKNIK',
  },
  {
    vendor_code: '250292',
    company_name: 'PT. EKAWIRA SARANA PERKASA',
  },
  {
    vendor_code: '250295',
    company_name: 'KANSAI PAINT INDONESIA',
  },
  {
    vendor_code: '250296',
    company_name: 'ELITE PERMAI METAL W.',
  },
  {
    vendor_code: '2503',
    company_name: 'KAWAN LAMA SEJAHTERA',
  },
  {
    vendor_code: '250300',
    company_name: 'ENERGI CANGGIH INDONESIA',
  },
  {
    vendor_code: '250304',
    company_name: 'KARYA PERDANA ENGINEERING',
  },
  {
    vendor_code: '250305',
    company_name: 'EXIS COLLECTION KERAJINAN',
  },
  {
    vendor_code: '250306',
    company_name: 'EZZER KEMINDO MULIA TAMA',
  },
  {
    vendor_code: '250309',
    company_name: 'KASTOR RODA INDONESIA',
  },
  {
    vendor_code: '250313',
    company_name: 'KAWAN LAMA SEJAHTERA',
  },
  {
    vendor_code: '250315',
    company_name: 'KAWAN LAMA SEJAHTERA',
  },
  {
    vendor_code: '250316',
    company_name: 'PT. SARIFIL INDONESIA',
  },
  {
    vendor_code: '250318',
    company_name: 'FOSECO INDONESIA',
  },
  {
    vendor_code: '250319',
    company_name: 'FUJITSU INDONESIA',
  },
  {
    vendor_code: '250322',
    company_name: 'GAMAKO MANDIRI',
  },
  {
    vendor_code: '250330',
    company_name: 'CV. GITA PERDANA',
  },
  {
    vendor_code: '250336',
    company_name: 'GULA TANI NIRMALA',
  },
  {
    vendor_code: '250338',
    company_name: 'HARAPAN DWIMITRA SUKSES',
  },
  {
    vendor_code: '250342',
    company_name: 'HEMA MEDHAJAYA',
  },
  {
    vendor_code: '250347',
    company_name: 'KEISI INDONESIA',
  },
  {
    vendor_code: '250350',
    company_name: 'HIBAINDO ARMADA MOTOR',
  },
  {
    vendor_code: '250358',
    company_name: 'HORIGUCHI ENGINEERING INDONESIA',
  },
  {
    vendor_code: '250361',
    company_name: 'KOPERASI KARYAWAN TOYOTA',
  },
  {
    vendor_code: '250365',
    company_name: 'KREATUMIN SAPTA MANUNGGAL',
  },
  {
    vendor_code: '250376',
    company_name: 'INIXINDO',
  },
  {
    vendor_code: '250377',
    company_name: 'NACO TEKNOLOGI',
  },
  {
    vendor_code: '250389',
    company_name: 'JAMRUD SILAU MANDIRI',
  },
  {
    vendor_code: '250392',
    company_name: 'JAYA TEKNIK',
  },
  {
    vendor_code: '250395',
    company_name: 'PT. KAHAR DUTA SARANA',
  },
  {
    vendor_code: '250397',
    company_name: 'KARSA MUDIKA ANDALAN UTAMA',
  },
  {
    vendor_code: '250401',
    company_name: 'KESKA LESTARI',
  },
  {
    vendor_code: '250405',
    company_name: 'KURITA INDONESIA',
  },
  {
    vendor_code: '250409',
    company_name: 'PT.CITRA SELARAS SEJAHTERA',
  },
  {
    vendor_code: '250420',
    company_name: 'MAKMUR SEJAHTERA',
  },
  {
    vendor_code: '250433',
    company_name: 'MEGAPRIMA PERSADA SAKTI',
  },
  {
    vendor_code: '250436',
    company_name: 'MEKAR ARMADA JAYA (TAMBUN)',
  },
  {
    vendor_code: '250438',
    company_name: 'MERAPRINT',
  },
  {
    vendor_code: '250439',
    company_name: 'MERIN DWITAMA SELARAS',
  },
  {
    vendor_code: '250441',
    company_name: 'METRO COMPUTER SYSTEM',
  },
  {
    vendor_code: '250448',
    company_name: 'MITRA INTEGRASI INFORMATIKA',
  },
  {
    vendor_code: '250450',
    company_name: 'MITRA TOYOTAKA INDONESIA',
  },
  {
    vendor_code: '250453',
    company_name: 'KURNIA MAHMUDA',
  },
  {
    vendor_code: '250457',
    company_name: 'MULTIPRIMA INDOSEJAHTERA',
  },
  {
    vendor_code: '250458',
    company_name: 'LANGGENG',
  },
  {
    vendor_code: '250462',
    company_name: 'LAUTAN KENCANA HIDUP',
  },
  {
    vendor_code: '250467',
    company_name: 'NET ARTIDAYA',
  },
  {
    vendor_code: '250469',
    company_name: 'NIHON CHEMICAL INDONESIA',
  },
  {
    vendor_code: '250470',
    company_name: 'LINTAS TOMINI MANDIRI PT',
  },
  {
    vendor_code: '250472',
    company_name: 'LOYALTECH GENSU UTAMA',
  },
  {
    vendor_code: '250475',
    company_name: 'PT. NX LEMO INDONESIA LOGISTIK',
  },
  {
    vendor_code: '250476',
    company_name: 'MAGNA PERKASA',
  },
  {
    vendor_code: '250477',
    company_name: 'MAHENA',
  },
  {
    vendor_code: '250478',
    company_name: 'C.V. MAHKOTA JAYA BOX',
  },
  {
    vendor_code: '250479',
    company_name: 'NUGERAHA TALENTA JAYA',
  },
  {
    vendor_code: '250486',
    company_name: 'MAKMUR META GRAHA DINAMIKA',
  },
  {
    vendor_code: '250488',
    company_name: 'MALINDO SISI INTI',
  },
  {
    vendor_code: '250490',
    company_name: 'PT.MANNEL MITRAJAYA',
  },
  {
    vendor_code: '250492',
    company_name: 'CV. MARGO JAYA',
  },
  {
    vendor_code: '250497',
    company_name: 'TUNAS KARYA NUSANTARA',
  },
  {
    vendor_code: '250498',
    company_name: 'MASA JAYA PERKASA',
  },
  {
    vendor_code: '250501',
    company_name: 'MEGA JAYA TEKNIK',
  },
  {
    vendor_code: '250505',
    company_name: 'MEGA KARYA SEMESTA',
  },
  {
    vendor_code: '250512',
    company_name: 'TRIMITRA TEKNIK MANDIRI',
  },
  {
    vendor_code: '250513',
    company_name: 'PRASETYA MULYA',
  },
  {
    vendor_code: '250515',
    company_name: 'PRATESIS',
  },
  {
    vendor_code: '250517',
    company_name: 'METALINDO MITRA SEJATI',
  },
  {
    vendor_code: '250522',
    company_name: 'PRINTCOM SOLUSI',
  },
  {
    vendor_code: '250523',
    company_name: 'MITRA ASMOCO UTAMA',
  },
  {
    vendor_code: '250525',
    company_name: 'MITRA USAHA',
  },
  {
    vendor_code: '250532',
    company_name: 'REMBULAN CATERING',
  },
  {
    vendor_code: '250537',
    company_name: 'SANDVIK INDONESIA',
  },
  {
    vendor_code: '250538',
    company_name: 'PT SARANA AIRCON UTAMA',
  },
  {
    vendor_code: '250541',
    company_name: 'SARANA SOLUSINDO INFORMATIKA',
  },
  {
    vendor_code: '250546',
    company_name: 'SERASI AUTO RAYA',
  },
  {
    vendor_code: '250552',
    company_name: 'SIGMA MAS',
  },
  {
    vendor_code: '250560',
    company_name: 'SONY INDONESIA',
  },
  {
    vendor_code: '250567',
    company_name: 'SUNLAKE HOTEL',
  },
  {
    vendor_code: '250570',
    company_name: 'PT. ADIBUANA SURYAPERKASA',
  },
  {
    vendor_code: '250575',
    company_name: 'SUMBER SARANA INSTRUMENT',
  },
  {
    vendor_code: '250577',
    company_name: 'TASAN MAJU BERSAMA',
  },
  {
    vendor_code: '250583',
    company_name: 'TOYOTA TSUSHO INDONESIA',
  },
  {
    vendor_code: '250592',
    company_name: 'UNI METRIKA UTAMA',
  },
  {
    vendor_code: '250595',
    company_name: 'USAHA BERSAMA',
  },
  {
    vendor_code: '250604',
    company_name: 'TOTALPRIMA SOLUTION INTEGRASINDO',
  },
  {
    vendor_code: '250606',
    company_name: 'AZBIL BERCA INDONESIA',
  },
  {
    vendor_code: '250608',
    company_name: 'PT. YOGYA PRESISI TEHNIKATAMA INDUS',
  },
  {
    vendor_code: '250609',
    company_name: 'YUANSA ABADI LESTARI',
  },
  {
    vendor_code: '250610',
    company_name: 'PUSAKA BAHARI MANDIRI',
  },
  {
    vendor_code: '250617',
    company_name: 'PT BHAKTI HUSADA',
  },
  {
    vendor_code: '250619',
    company_name: 'ADVENT',
  },
  {
    vendor_code: '250621',
    company_name: 'ANAK DAN BERSALIN HARAPAN KITA',
  },
  {
    vendor_code: '250622',
    company_name: 'ANANDA',
  },
  {
    vendor_code: '250628',
    company_name: 'AZRA',
  },
  {
    vendor_code: '250629',
    company_name: 'BAYUKARTA',
  },
  {
    vendor_code: '250632',
    company_name: 'BETHESDA',
  },
  {
    vendor_code: '250644',
    company_name: 'BUNDA JAKARTA',
  },
  {
    vendor_code: '250645',
    company_name: 'DEWI SRI',
  },
  {
    vendor_code: '250648',
    company_name: 'EVASARI',
  },
  {
    vendor_code: '250651',
    company_name: 'GATOT SOEBROTO HEMODIALISA',
  },
  {
    vendor_code: '250652',
    company_name: 'GATOT SOEBROTO PAV.ANAK',
  },
  {
    vendor_code: '250653',
    company_name: 'GATOT SOEBROTO PAV.DR. IMAN SUDJUDI',
  },
  {
    vendor_code: '250654',
    company_name: 'GATOT SOEBROTO PAV.KARTIKA',
  },
  {
    vendor_code: '250655',
    company_name: 'GATOT SUBROTO PAV. DARMAWAN',
  },
  {
    vendor_code: '250656',
    company_name: 'SILOAM HOSPITAL WEST RS. (GRAHA)',
  },
  {
    vendor_code: '250657',
    company_name: 'HAJI JAKARTA',
  },
  {
    vendor_code: '250659',
    company_name: 'PT HARAPAN BUNDA SEJAHTERA',
  },
  {
    vendor_code: '250664',
    company_name: 'HERMINA BEKASI',
  },
  {
    vendor_code: '250665',
    company_name: 'HERMINA DEPOK',
  },
  {
    vendor_code: '250666',
    company_name: 'HERMINA JATINEGARA',
  },
  {
    vendor_code: '250667',
    company_name: 'HERMINA PODOMORO',
  },
  {
    vendor_code: '250672',
    company_name: 'INTERNATIONAL BINTARO',
  },
  {
    vendor_code: '250673',
    company_name: 'ISLAM ASSYIFA',
  },
  {
    vendor_code: '250674',
    company_name: 'ISLAM JAKARTA TIMUR',
  },
  {
    vendor_code: '250675',
    company_name: 'RS. ISLAM JAKARTA UTARA',
  },
  {
    vendor_code: '250676',
    company_name: 'ISLAM JAKARTA',
  },
  {
    vendor_code: '250678',
    company_name: 'ISLAM KHUSUS KESEHATAN JIWA',
  },
  {
    vendor_code: '250683',
    company_name: 'JANTUNG HARAPAN KITA',
  },
  {
    vendor_code: '250685',
    company_name: 'KANKER DHARMAIS',
  },
  {
    vendor_code: '250698',
    company_name: 'MEDIKA GRIA',
  },
  {
    vendor_code: '250701',
    company_name: 'MEDIROS',
  },
  {
    vendor_code: '250702',
    company_name: 'MEDISTRA',
  },
  {
    vendor_code: '250705',
    company_name: 'MITRA KELUARGA BEKASI',
  },
  {
    vendor_code: '250706',
    company_name: 'MITRA INTERNASIONAL ',
  },
  {
    vendor_code: '250708',
    company_name: 'MITRA KEMAYORAN',
  },
  {
    vendor_code: '250709',
    company_name: 'MMC',
  },
  {
    vendor_code: '250711',
    company_name: 'MOHAMMAD HUSNI THAMRIN',
  },
  {
    vendor_code: '250713',
    company_name: 'ONGKOMULYO',
  },
  {
    vendor_code: '250720',
    company_name: 'PELABUHAN JAKARTA',
  },
  {
    vendor_code: '250721',
    company_name: 'PGI CIKINI',
  },
  {
    vendor_code: '250723',
    company_name: 'PMI BOGOR',
  },
  {
    vendor_code: '250725',
    company_name: 'PONDOK INDAH',
  },
  {
    vendor_code: '250729',
    company_name: 'PUSAT PERTAMINA',
  },
  {
    vendor_code: '250740',
    company_name: 'SENTRA MEDIKA',
  },
  {
    vendor_code: '250744',
    company_name: 'SILOAM HOSPITAL LIPPO KARAWACI',
  },
  {
    vendor_code: '250745',
    company_name: 'ST. CAROLUS',
  },
  {
    vendor_code: '250748',
    company_name: 'SUKMUL',
  },
  {
    vendor_code: '250750',
    company_name: 'SUMBER WARAS',
  },
  {
    vendor_code: '250777',
    company_name: 'MULTI BANGUN MANDIRI',
  },
  {
    vendor_code: '250779',
    company_name: 'MULTI SARANA SERVITIANUSA',
  },
  {
    vendor_code: '250781',
    company_name: 'MUSAMMA KARYA',
  },
  {
    vendor_code: '250783',
    company_name: 'MUTIARA TAYLOR',
  },
  {
    vendor_code: '250784',
    company_name: 'NYK LINE INDONESIA',
  },
  {
    vendor_code: '250787',
    company_name: 'NIPSEA PAINT AND CHEMICALS',
  },
  {
    vendor_code: '250790',
    company_name: 'NOER NERATAMA',
  },
  {
    vendor_code: '250792',
    company_name: 'NUSASEJAHTERA LOGAMPRATAMA',
  },
  {
    vendor_code: '250793',
    company_name: 'NUSANTARA SECOM INFOTECH',
  },
  {
    vendor_code: '250794',
    company_name: 'NUSATRINDO SEJATI',
  },
  {
    vendor_code: '250795',
    company_name: 'OCTO CORINDO SARANA',
  },
  {
    vendor_code: '250804',
    company_name: 'ETERNA KARYA SEJAHTERA',
  },
  {
    vendor_code: '250809',
    company_name: 'PERSADA KARYA LESTARI MANDIRI',
  },
  {
    vendor_code: '250810',
    company_name: 'INDRAGRAHA NUSAPLASINDO',
  },
  {
    vendor_code: '250812',
    company_name: 'PILIHAN PRIMA UTAMA',
  },
  {
    vendor_code: '250814',
    company_name: 'PIRAMID MAS PERDANA',
  },
  {
    vendor_code: '250815',
    company_name: 'POLYGON JAYA',
  },
  {
    vendor_code: '250819',
    company_name: 'PRESINDO CENTRAL',
  },
  {
    vendor_code: '250820',
    company_name: 'PRIMACIPTA MEGAH JAYA',
  },
  {
    vendor_code: '250823',
    company_name: 'PT.PRIMA TIGON GLOBAL',
  },
  {
    vendor_code: '250827',
    company_name: 'KENARI MAJU LEATHER SHOE FACTORY',
  },
  {
    vendor_code: '250828',
    company_name: 'PUNINAR JAYA',
  },
  {
    vendor_code: '250830',
    company_name: 'PT.YUSEN LOGISTICS INDONESIA',
  },
  {
    vendor_code: '250834',
    company_name: 'REKATAMA ALAM MANDIRI',
  },
  {
    vendor_code: '250837',
    company_name: 'REMCA PIONEER',
  },
  {
    vendor_code: '250838',
    company_name: 'REMCA PIONEER',
  },
  {
    vendor_code: '250839',
    company_name: 'RESTU BUANA',
  },
  {
    vendor_code: '250843',
    company_name: 'RODA HAMMERINDO JAYA',
  },
  {
    vendor_code: '250844',
    company_name: 'RODA NADA KARYA',
  },
  {
    vendor_code: '250846',
    company_name: 'ROVI',
  },
  {
    vendor_code: '250847',
    company_name: 'ROVI',
  },
  {
    vendor_code: '250849',
    company_name: 'SADIKUN NIAGAMAS RAYA',
  },
  {
    vendor_code: '250850',
    company_name: 'SAHABAT INDONESIA INTI MANDIRI',
  },
  {
    vendor_code: '250856',
    company_name: 'SINERGI PRIMA ENJINEERING PT',
  },
  {
    vendor_code: '250857',
    company_name: 'SANDI JAYA TEKNIK',
  },
  {
    vendor_code: '250860',
    company_name: 'SAP INDONESIA',
  },
  {
    vendor_code: '250862',
    company_name: 'SLS BEARINDO',
  },
  {
    vendor_code: '250868',
    company_name: 'SENTRAL MITRA INFORMATIKA',
  },
  {
    vendor_code: '250869',
    company_name: 'SERVITAMA ERA TOOLSINDO',
  },
  {
    vendor_code: '250871',
    company_name: 'SETIAWAN SEDJATI',
  },
  {
    vendor_code: '250873',
    company_name: 'SIKA INDONESIA',
  },
  {
    vendor_code: '250888',
    company_name: 'SINAR MUTIARA INDAH',
  },
  {
    vendor_code: '250891',
    company_name: 'SOLUSI PERIFERAL',
  },
  {
    vendor_code: '250892',
    company_name: 'SOMAGEDE INDONESIA',
  },
  {
    vendor_code: '250894',
    company_name: 'STEEL CENTER INDONESIA',
  },
  {
    vendor_code: '250895',
    company_name: 'STILMETINDO PRIMA',
  },
  {
    vendor_code: '250901',
    company_name: 'SUMBER INDOKEMJAYA',
  },
  {
    vendor_code: '250905',
    company_name: 'SUNTER AGUNG TEKNIK',
  },
  {
    vendor_code: '250906',
    company_name: 'PT. SUPRA ENGINEERING',
  },
  {
    vendor_code: '250913',
    company_name: 'SURYA MITRA MAJU PERKASA',
  },
  {
    vendor_code: '250916',
    company_name: 'TAKENAKA INDONESIA',
  },
  {
    vendor_code: '250917',
    company_name: 'MULIA SUKSES TEKNIK',
  },
  {
    vendor_code: '250924',
    company_name: 'PERSO INTI PALLETI',
  },
  {
    vendor_code: '250925',
    company_name: 'TELKOM',
  },
  {
    vendor_code: '250926',
    company_name: 'TELKOMSEL KANTOR REGIONAL JABOTABEK',
  },
  {
    vendor_code: '250929',
    company_name: 'TETHA ALPHINDO',
  },
  {
    vendor_code: '250932',
    company_name: 'TIRTAJAYA LUMASINDO',
  },
  {
    vendor_code: '250933',
    company_name: 'TITAN MAS SURYA',
  },
  {
    vendor_code: '250940',
    company_name: 'PT. PACKINDO SEAL',
  },
  {
    vendor_code: '250941',
    company_name: 'TOYOTA TSUSHO CORPORATION',
  },
  {
    vendor_code: '250942',
    company_name: 'PT. TRAKTOR NUSANTARA',
  },
  {
    vendor_code: '250944',
    company_name: 'TRI LOGAM INDOJAYA',
  },
  {
    vendor_code: '250945',
    company_name: 'TRI TUNGGAL CEMERLANG',
  },
  {
    vendor_code: '250950',
    company_name: 'TUFFINDO RAYA',
  },
  {
    vendor_code: '250957',
    company_name: 'UNGGUL SEMESTA',
  },
  {
    vendor_code: '250961',
    company_name: 'UNITED CONTROLS',
  },
  {
    vendor_code: '250966',
    company_name: 'USAHA LANTANG SEJAHTERA',
  },
  {
    vendor_code: '250967',
    company_name: 'VIFIERA MINOVA BERSAUDARA',
  },
  {
    vendor_code: '250968',
    company_name: 'VITA TAILOR',
  },
  {
    vendor_code: '250969',
    company_name: 'WAHANA DATARINDO S',
  },
  {
    vendor_code: '250971',
    company_name: 'WARNA PRIMA KIMIATAMA',
  },
  {
    vendor_code: '250972',
    company_name: 'WIALEN PURBATAMA AGUNG',
  },
  {
    vendor_code: '250973',
    company_name: 'WIRA DEREKINDO',
  },
  {
    vendor_code: '250977',
    company_name: 'YAMAHATO',
  },
  {
    vendor_code: '250979',
    company_name: 'YULIA SHINTA INDONESIA',
  },
  {
    vendor_code: '250982',
    company_name: 'ZOLATECH PERDANA',
  },
  {
    vendor_code: '250983',
    company_name: 'ZITECHASIA',
  },
  {
    vendor_code: '250990',
    company_name: 'KARAWANG SPORT CENTRE INDONESIA',
  },
  {
    vendor_code: '250991',
    company_name: 'DAMAI INDAH PADANG GOLF',
  },
  {
    vendor_code: '250992',
    company_name: 'GITA MAYA INTERBUANA GOLF AND COU',
  },
  {
    vendor_code: '250993',
    company_name: 'KARAWANG BUKIT GOLF ',
  },
  {
    vendor_code: '250996',
    company_name: 'DANA PENSIUN TOYOTAASTRA MOTOR',
  },
  {
    vendor_code: '251002',
    company_name: 'DITJEN PAJAK (PMA DAN BADORA)',
  },
  {
    vendor_code: '251006',
    company_name: 'RENTOKIL INDONESIA',
  },
  {
    vendor_code: '251007',
    company_name: 'CV IHSAN',
  },
  {
    vendor_code: '251008',
    company_name: 'ALTONINTI PURI PERKASA',
  },
  {
    vendor_code: '251016',
    company_name: 'GALANG KREASI USAHATAMA',
  },
  {
    vendor_code: '251020',
    company_name: 'PRATITA PRAMA NUGRAHA',
  },
  {
    vendor_code: '251021',
    company_name: 'TRIMITRA MARGANDA UNGGUL',
  },
  {
    vendor_code: '251024',
    company_name: 'PT. SURYA HARAPAN KENCANA MANDIRI',
  },
  {
    vendor_code: '251026',
    company_name: 'SUCOFINDO',
  },
  {
    vendor_code: '251027',
    company_name: 'LUX ETERNA CV',
  },
  {
    vendor_code: '251028',
    company_name: 'CHARISMA TATAMITRA ABADI',
  },
  {
    vendor_code: '251029',
    company_name: 'ARIYADI KARYA',
  },
  {
    vendor_code: '251032',
    company_name: 'DELTA GRAHA SYSTEMINDO',
  },
  {
    vendor_code: '251033',
    company_name: 'ABB SAKTI INDUSTRI',
  },
  {
    vendor_code: '251035',
    company_name: 'TOSEI INDONESIA',
  },
  {
    vendor_code: '251036',
    company_name: 'NAKANISHI METAL WORKS CO.',
  },
  {
    vendor_code: '251039',
    company_name: 'GRAHANINDO MECANITRON',
  },
  {
    vendor_code: '251040',
    company_name: 'HERAEUS MATERIALS INDONESIA',
  },
  {
    vendor_code: '251041',
    company_name: 'PITAMAS DATA SEMPURNA',
  },
  {
    vendor_code: '251043',
    company_name: 'TOCHU SILIKA INDONESIA',
  },
  {
    vendor_code: '251046',
    company_name: 'PT.SEJAHTERA VISITAMA',
  },
  {
    vendor_code: '251051',
    company_name: 'INFILTRACO MURNI',
  },
  {
    vendor_code: '251057',
    company_name: 'PT. SRIKANDI BINTANG PERSADA',
  },
  {
    vendor_code: '251061',
    company_name: 'HARAPAN ANANG BAKRI AND SONS',
  },
  {
    vendor_code: '251068',
    company_name: 'HENINDO TECHNOLOGIES',
  },
  {
    vendor_code: '251069',
    company_name: 'ATLAS COPCO INDONESIA',
  },
  {
    vendor_code: '251071',
    company_name: 'PANDU SIWI SENTOSA PT',
  },
  {
    vendor_code: '251079',
    company_name: 'PANCA ASTA UTAMA ICE CREAM',
  },
  {
    vendor_code: '251085',
    company_name: 'MEIDEN ENGINEERING INDONESIA',
  },
  {
    vendor_code: '251086',
    company_name: 'PT.IMAM SEJAHTERA',
  },
  {
    vendor_code: '251094',
    company_name: 'PT. DHARMESTA SWASTI MANDIRI',
  },
  {
    vendor_code: '251099',
    company_name: 'BIROTIKA SEMESTA',
  },
  {
    vendor_code: '251116',
    company_name: 'LARIS FOTOCOPY',
  },
  {
    vendor_code: '251119',
    company_name: 'RUMAH SAKIT ISLAM JAKARTA',
  },
  {
    vendor_code: '251129',
    company_name: 'CBC PRIMA',
  },
  {
    vendor_code: '251147',
    company_name: 'PLN CABANG KARAWANG',
  },
  {
    vendor_code: '251158',
    company_name: 'HOTEL SAHID JAYA JAKARTA',
  },
  {
    vendor_code: '251163',
    company_name: 'PT. PAM LYONNAISE JAYA',
  },
  {
    vendor_code: '251164',
    company_name: 'SPSI PT. TMMIN',
  },
  {
    vendor_code: '251165',
    company_name: 'SEJATI WISATAMA UTAMA',
  },
  {
    vendor_code: '251172',
    company_name: 'INTAN MOTOR CV.',
  },
  {
    vendor_code: '251176',
    company_name: 'PT.IMAM SEJAHTERA',
  },
  {
    vendor_code: '251191',
    company_name: 'PT. AETRA AIR JAKARTA',
  },
  {
    vendor_code: '251212',
    company_name: 'DYANDRA PROMOSINDO',
  },
  {
    vendor_code: '251230',
    company_name: 'HIKARI AGAPI',
  },
  {
    vendor_code: '251239',
    company_name: 'CALMIC INDONESIA',
  },
  {
    vendor_code: '251241',
    company_name: 'RODA ROLLEN INDONESIA PT.',
  },
  {
    vendor_code: '251243',
    company_name: 'METROPOLITAN BAYUTAMA PT.',
  },
  {
    vendor_code: '251248',
    company_name: 'TOYOTA TSUSHO MECHANICAL & ENG INDO',
  },
  {
    vendor_code: '251255',
    company_name: 'SRIBANGUN BUMINITIYA PT',
  },
  {
    vendor_code: '251258',
    company_name: 'AJA REGISTRARS PTE. LTD.',
  },
  {
    vendor_code: '251261',
    company_name: 'BAHTERA REJEKI SEJATI',
  },
  {
    vendor_code: '251264',
    company_name: 'BINA MAJU CEMERLANG',
  },
  {
    vendor_code: '251268',
    company_name: 'PRIMA DOWANDJU',
  },
  {
    vendor_code: '251269',
    company_name: 'INDRIA INTEREDINDO',
  },
  {
    vendor_code: '251271',
    company_name: 'SRIBANGUN BUMINITIYA PT',
  },
  {
    vendor_code: '251273',
    company_name: 'HADEKA PRIMANTARA',
  },
  {
    vendor_code: '251278',
    company_name: 'BADAN KOORDINASI MASJID TAM',
  },
  {
    vendor_code: '251285',
    company_name: 'JOPURI LESTARI MANDIRI',
  },
  {
    vendor_code: '251287',
    company_name: 'HARAPAN ANANG BAKRI AND SONS',
  },
  {
    vendor_code: '251288',
    company_name: 'PT.MALIGI PERMATA INDUSTRIAL ESTATE',
  },
  {
    vendor_code: '251289',
    company_name: 'GRAND MELIA HOTEL',
  },
  {
    vendor_code: '251300',
    company_name: 'KOBELINDO COMPRESSORS',
  },
  {
    vendor_code: '251305',
    company_name: 'CITIBANK CARD CENTER',
  },
  {
    vendor_code: '251331',
    company_name: 'TELKOM',
  },
  {
    vendor_code: '251334',
    company_name: 'NYSMART WAHANA MANDIRI',
  },
  {
    vendor_code: '251337',
    company_name: 'DAYAMANDIRI DHARMAKONSILINDO',
  },
  {
    vendor_code: '251338',
    company_name: 'MITRA SERVISINDO UTAMA PT.',
  },
  {
    vendor_code: '251347',
    company_name: 'IRAWATI',
  },
  {
    vendor_code: '251355',
    company_name: 'SOMIT MURNI MANDIRI',
  },
  {
    vendor_code: '251358',
    company_name: 'ESSA SATYAGRAP ABBID',
  },
  {
    vendor_code: '251359',
    company_name: 'PT.FRINA LESTARI NUSANTARA',
  },
  {
    vendor_code: '251360',
    company_name: 'GAIKINDO',
  },
  {
    vendor_code: '251365',
    company_name: 'NIPPON EXPRESS INDONESIA',
  },
  {
    vendor_code: '251372',
    company_name: 'FESTO',
  },
  {
    vendor_code: '251374',
    company_name: 'INTERCONTINENTAL MID PLAZA HOTEL',
  },
  {
    vendor_code: '251376',
    company_name: 'SELTECH UTAMA',
  },
  {
    vendor_code: '251377',
    company_name: 'TIMUR RAYA KURNIA MANUNGGAL',
  },
  {
    vendor_code: '251381',
    company_name: 'BALAI TERMODINAMIKA',
  },
  {
    vendor_code: '251388',
    company_name: 'DAYA DIMENSI INDONESIA',
  },
  {
    vendor_code: '251393',
    company_name: 'POLITEKNIK MANUFAKTUR BANDUNG',
  },
  {
    vendor_code: '251394',
    company_name: 'TEMPO INTI MEDIA',
  },
  {
    vendor_code: '251402',
    company_name: 'PT.MALIGI PERMATA INDUSTRIAL ESTATE',
  },
  {
    vendor_code: '251404',
    company_name: 'PARAMUDA UTAMA TEKNIK CV.',
  },
  {
    vendor_code: '251411',
    company_name: 'INTERWIRA LANCAR MANDIRI PT.',
  },
  {
    vendor_code: '251417',
    company_name: 'PRISMAS JAMINTARA',
  },
  {
    vendor_code: '251418',
    company_name: 'GAPA CITRAMANDIRI',
  },
  {
    vendor_code: '251423',
    company_name: 'TRIHASCO UTAMA',
  },
  {
    vendor_code: '251432',
    company_name: 'PT DENTSU INDONESIA',
  },
  {
    vendor_code: '251433',
    company_name: 'PROFIKLIN CEMERLANG PT.',
  },
  {
    vendor_code: '251438',
    company_name: 'SEDAYA MULTI INVESTAMA',
  },
  {
    vendor_code: '251440',
    company_name: 'SUKSES GEMILANG PROMOSINDO',
  },
  {
    vendor_code: '251443',
    company_name: 'PUJI LESTARI PURNAMA',
  },
  {
    vendor_code: '251447',
    company_name: 'NYSMART WAHANA MANDIRI',
  },
  {
    vendor_code: '251453',
    company_name: 'GRAMEDIA ASRI MEDIA PT',
  },
  {
    vendor_code: '251468',
    company_name: 'OBOR SARANA UTAMA',
  },
  {
    vendor_code: '251471',
    company_name: 'ALAMANDA CV',
  },
  {
    vendor_code: '251474',
    company_name: 'HALIM JAYA TEKNIK PT.',
  },
  {
    vendor_code: '251483',
    company_name: 'METALINDO MULTI PERKASA',
  },
  {
    vendor_code: '251493',
    company_name: 'BERUANG EMAS AGUNG',
  },
  {
    vendor_code: '251496',
    company_name: 'TOYOTA MOTOR CORPORATION',
  },
  {
    vendor_code: '251497',
    company_name: 'TOYOTA MOTOR CORPORATION',
  },
  {
    vendor_code: '251500',
    company_name: 'DITAJAYA MITRA PERKASA',
  },
  {
    vendor_code: '251501',
    company_name: 'SIGAP PRIMA ASTREA',
  },
  {
    vendor_code: '251509',
    company_name: 'BAKOORPAMWIL',
  },
  {
    vendor_code: '251511',
    company_name: 'TRAFOINDO PRIMA PERKASA',
  },
  {
    vendor_code: '251519',
    company_name: 'AKADEMI TEHNIK MESIN INDUSTRI',
  },
  {
    vendor_code: '251522',
    company_name: 'KAHAR DUTA SARANA DIV. CASIO PT.',
  },
  {
    vendor_code: '251523',
    company_name: 'JAYA WARINDO ABADI PT.',
  },
  {
    vendor_code: '251531',
    company_name: 'SYSTEM ENGINEERING INTEGRATOR IND.',
  },
  {
    vendor_code: '251532',
    company_name: 'ASTEK',
  },
  {
    vendor_code: '251537',
    company_name: 'KRANTZ THERMO TEKNOLOGI INT PT',
  },
  {
    vendor_code: '251544',
    company_name: 'LEMBAGA BAHASA HAYAMA',
  },
  {
    vendor_code: '251545',
    company_name: 'HADI MARTONO',
  },
  {
    vendor_code: '251556',
    company_name: 'SINAR ABADI CV',
  },
  {
    vendor_code: '251571',
    company_name: 'DATACOM SOLUSINDO',
  },
  {
    vendor_code: '251608',
    company_name: 'CATUR MITRA ANUGERAH LESTARI',
  },
  {
    vendor_code: '251611',
    company_name: 'MITRA CITRAJASA KONSTRUKSI PT',
  },
  {
    vendor_code: '251612',
    company_name: 'MITRA CITRAJASA KONSTRUKSI PT',
  },
  {
    vendor_code: '251619',
    company_name: 'HARTONO',
  },
  {
    vendor_code: '251639',
    company_name: 'SOFOCO PT',
  },
  {
    vendor_code: '251692',
    company_name: 'MEKAR ARMADA JAYA PT.',
  },
  {
    vendor_code: '251694',
    company_name: 'PENTASADA SURYA DINAMIKA',
  },
  {
    vendor_code: '251695',
    company_name: 'PERKAKAS REKADAYA NUSANTARA',
  },
  {
    vendor_code: '251711',
    company_name: 'SERASI AUTO RAYA',
  },
  {
    vendor_code: '251712',
    company_name: 'ALAMANDA CV',
  },
  {
    vendor_code: '251741',
    company_name: 'SINARMENTARI INDOPRIMA PT.',
  },
  {
    vendor_code: '251744',
    company_name: 'MAHARUPA GATRA PT.',
  },
  {
    vendor_code: '251749',
    company_name: 'TAIKISHA INDONESIA ENGINEERING',
  },
  {
    vendor_code: '251753',
    company_name: 'ASURANSI TOKIO MARINE INDONESIA',
  },
  {
    vendor_code: '251754',
    company_name: 'THE JAKARTA JAPAN CLUB FOUNDATION',
  },
  {
    vendor_code: '251758',
    company_name: 'DINAS KESEHATAN KARAWANG',
  },
  {
    vendor_code: '251771',
    company_name: 'TOYOTA MANUFACTURERS CLUB',
  },
  {
    vendor_code: '251779',
    company_name: 'SCHNEIDER INDONESIA',
  },
  {
    vendor_code: '251781',
    company_name: 'BHINEKA CIRIA ARTANA PT.',
  },
  {
    vendor_code: '251786',
    company_name: 'KONSUL ASRI UTAMA',
  },
  {
    vendor_code: '251793',
    company_name: 'OMRON ELECTRONICS PTE LTD',
  },
  {
    vendor_code: '251798',
    company_name: 'AUTOCOMP SYSTEMS INDONESIA',
  },
  {
    vendor_code: '251799',
    company_name: 'SINAR ABADI CV',
  },
  {
    vendor_code: '251813',
    company_name: 'BAHANA MITRA ABADI',
  },
  {
    vendor_code: '251825',
    company_name: 'PT. KONECRANES MATERIAL HANDLING',
  },
  {
    vendor_code: '251826',
    company_name: 'KOPERASI PENSIUNAN PEGAWAI PLN',
  },
  {
    vendor_code: '251831',
    company_name: 'PT. EVERGREEN SHIPPING AGENCY INDON',
  },
  {
    vendor_code: '251840',
    company_name: 'PT. ASTRAGRAPHIA XPRINS INDONESIA',
  },
  {
    vendor_code: '251854',
    company_name: 'WAHANA SAFETY INDONESIA PT',
  },
  {
    vendor_code: '251856',
    company_name: 'BESTONINDO CENTRAL LESTARI',
  },
  {
    vendor_code: '251883',
    company_name: 'JAYA ABADI PERKASA MULIA PT',
  },
  {
    vendor_code: '251920',
    company_name: 'CITRA DATA PURNA KHARISMA',
  },
  {
    vendor_code: '251922',
    company_name: 'KARYA KREATIF PRINCOMINDO PT',
  },
  {
    vendor_code: '251925',
    company_name: 'MEIWA MOLD INDONESIA',
  },
  {
    vendor_code: '251926',
    company_name: 'CITRA DATA PURNA KHARISMA',
  },
  {
    vendor_code: '251933',
    company_name: 'INDOLIMA PERKASA PT',
  },
  {
    vendor_code: '251934',
    company_name: 'SOLUSI REKATAMA MAKMUR',
  },
  {
    vendor_code: '251936',
    company_name: 'TT NETWORK INTEGRATION ASIA PTE.LTD',
  },
  {
    vendor_code: '251938',
    company_name: 'BHINNEKA MENTARI DIMENSI PT',
  },
  {
    vendor_code: '251940',
    company_name: 'TOYODA GOSEI SAFETY SYSTEMS IND',
  },
  {
    vendor_code: '251941',
    company_name: 'SINAR BUANA',
  },
  {
    vendor_code: '251943',
    company_name: 'ARISMA DATA SETIA',
  },
  {
    vendor_code: '251947',
    company_name: 'ALAMANDA CV',
  },
  {
    vendor_code: '251948',
    company_name: 'ASTRA GRAPHIA TBK (FOR FOTOCOPY)',
  },
  {
    vendor_code: '251970',
    company_name: 'BANTRUNK MURNI INDONESIA',
  },
  {
    vendor_code: '251973',
    company_name: 'HERMON PANCAKARSA LIBRATAMA',
  },
  {
    vendor_code: '251975',
    company_name: 'PARAMETRIK SOLUSI INTEGRASI',
  },
  {
    vendor_code: '251977',
    company_name: 'TELKOM',
  },
  {
    vendor_code: '251978',
    company_name: 'GLOBAL TOOLS INDONESIA',
  },
  {
    vendor_code: '251983',
    company_name: 'HERMINA BOGOR ',
  },
  {
    vendor_code: '251994',
    company_name: 'PESTINDO UTAMA CV',
  },
  {
    vendor_code: '251996',
    company_name: 'APOTIK WARAKAS',
  },
  {
    vendor_code: '251997',
    company_name: 'TAIKISHA INDONESIA ENGINEERING',
  },
  {
    vendor_code: '252002',
    company_name: 'ICHTIAR ELECTRINDO PT',
  },
  {
    vendor_code: '252003',
    company_name: 'BOSTINCO',
  },
  {
    vendor_code: '252005',
    company_name: 'NNA INDONESIA',
  },
  {
    vendor_code: '252013',
    company_name: 'MITRA SARANA TEKNIK CV',
  },
  {
    vendor_code: '252021',
    company_name: 'ELECTRONIC DATA INTERCHANGE IND',
  },
  {
    vendor_code: '252023',
    company_name: 'DAIFUKU INDONESIA',
  },
  {
    vendor_code: '252034',
    company_name: 'MITRA KELUARGA KELAPA GADING RS',
  },
  {
    vendor_code: '252036',
    company_name: 'ASTRA GRAPHIA TBK (FOR FOTOCOPY)',
  },
  {
    vendor_code: '252041',
    company_name: 'NETMARKS INDONESIA',
  },
  {
    vendor_code: '252042',
    company_name: 'GIKOKO KOGYO INDONESIA',
  },
  {
    vendor_code: '252043',
    company_name: 'INDOLIMA PERKASA PT',
  },
  {
    vendor_code: '252044',
    company_name: 'ASTRA GRAPHIA TBK (FOR FOTOCOPY)',
  },
  {
    vendor_code: '252045',
    company_name: 'PERS. PRASETIO',
  },
  {
    vendor_code: '252046',
    company_name: 'SWASEMBADA',
  },
  {
    vendor_code: '252060',
    company_name: 'BOROBUDUR HOTEL',
  },
  {
    vendor_code: '252062',
    company_name: 'CHANDRAKARYA DHARMAJAYA PT',
  },
  {
    vendor_code: '252067',
    company_name: 'TIA JAYA ENGINEERING CV',
  },
  {
    vendor_code: '252068',
    company_name: 'ANDHIKA INDAH',
  },
  {
    vendor_code: '252070',
    company_name: 'DINAR MAKMUR PT.',
  },
  {
    vendor_code: '252084',
    company_name: 'RUMAH SAKIT CITO KARAWANG',
  },
  {
    vendor_code: '252085',
    company_name: 'SANINDO PERKASA ABADI',
  },
  {
    vendor_code: '252087',
    company_name: 'CITRA BARU PERKASA',
  },
  {
    vendor_code: '252088',
    company_name: 'CITRA BARU PERKASA',
  },
  {
    vendor_code: '252090',
    company_name: 'INOV PERDANA TEKNOLOGI PT',
  },
  {
    vendor_code: '252097',
    company_name: 'SINAR BAHAGIA GAJAHMADA',
  },
  {
    vendor_code: '252104',
    company_name: 'BADJATAMA ABADI LESTARI PT',
  },
  {
    vendor_code: '252112',
    company_name: 'TATA EKSOTIK PT',
  },
  {
    vendor_code: '252123',
    company_name: 'SUGIMURA CHEMICAL INDONESIA PT.',
  },
  {
    vendor_code: '252124',
    company_name: 'BOSTINCO',
  },
  {
    vendor_code: '252129',
    company_name: 'LONTRACO SUKSES',
  },
  {
    vendor_code: '252131',
    company_name: 'ARMAS LOGISTIC SERVICE',
  },
  {
    vendor_code: '252134',
    company_name: 'INTEC INSTRUMENT',
  },
  {
    vendor_code: '252136',
    company_name: 'TAIYO SINAR RAYATEKNIK',
  },
  {
    vendor_code: '252148',
    company_name: 'NAKANISHI INDONESIA',
  },
  {
    vendor_code: '252161',
    company_name: 'POS INDONESIA',
  },
  {
    vendor_code: '252181',
    company_name: 'SINTOKOGIO LTD',
  },
  {
    vendor_code: '252184',
    company_name: 'LIANG CHI INDONESIA PT',
  },
  {
    vendor_code: '252185',
    company_name: 'PT. SURYA PIRANTI INDONESIA',
  },
  {
    vendor_code: '252187',
    company_name: 'PT. K LINE MOBARU DIAMOND INDONES',
  },
  {
    vendor_code: '252190',
    company_name: 'MEKTAN BABAKAN TUJUH KONSULTAN PT',
  },
  {
    vendor_code: '252193',
    company_name: 'MEDIA TALENTA UTAMA PT',
  },
  {
    vendor_code: '252195',
    company_name: 'SURYA GALAXY PRATAMA ENGINEERING',
  },
  {
    vendor_code: '252198',
    company_name: 'SMAILING TOUR',
  },
  {
    vendor_code: '252199',
    company_name: 'PT.PANORAMA JTB TOURS INDONESIA',
  },
  {
    vendor_code: '252201',
    company_name: 'GRAMEDIA ASRI MEDIA PT',
  },
  {
    vendor_code: '252216',
    company_name: 'PT. NINETY NINE TEKNIK INDONESIA',
  },
  {
    vendor_code: '252243',
    company_name: 'PT. DHARMESTA SWASTI MANDIRI',
  },
  {
    vendor_code: '252246',
    company_name: 'TECHNOSYS INTERNUSA',
  },
  {
    vendor_code: '252248',
    company_name: 'PT KINTETSU WORLD EXPRESS INDONESIA',
  },
  {
    vendor_code: '252252',
    company_name: 'BUANA JAYA EKAPERSADA PT',
  },
  {
    vendor_code: '252253',
    company_name: 'ERINDO MEGAH PRIMA',
  },
  {
    vendor_code: '252256',
    company_name: 'BRILYAN TRIMATRA UTAMA',
  },
  {
    vendor_code: '252259',
    company_name: 'WIRA GRIYA MUSTIKA',
  },
  {
    vendor_code: '252260',
    company_name: 'INDOLIMA PERKASA PT',
  },
  {
    vendor_code: '252264',
    company_name: 'NSK INDONESIA',
  },
  {
    vendor_code: '252265',
    company_name: 'SARANA SCIENTIFA SYSTEMINDO',
  },
  {
    vendor_code: '252267',
    company_name: 'NAMICOH INDONESIA COMPONENT',
  },
  {
    vendor_code: '252269',
    company_name: 'INDOLOK BAKTI UTAMA',
  },
  {
    vendor_code: '252270',
    company_name: 'INDOLOK BAKTI UTAMA',
  },
  {
    vendor_code: '252274',
    company_name: 'SILOAM GLENEAGLES LIPPO CIKARANG',
  },
  {
    vendor_code: '252277',
    company_name: 'CAIRNHILL SERVIECH INTI',
  },
  {
    vendor_code: '252280',
    company_name: 'HADICO PERSADA',
  },
  {
    vendor_code: '252281',
    company_name: 'PT. SUPRA PRIMATAMA NUSANTARA',
  },
  {
    vendor_code: '252284',
    company_name: 'SEMPURNA',
  },
  {
    vendor_code: '252288',
    company_name: 'ZOLATECH PERDANA',
  },
  {
    vendor_code: '252289',
    company_name: 'MENARA RAJAWALI INDO PRATAMA',
  },
  {
    vendor_code: '252290',
    company_name: 'FNC TRADING CO LTD',
  },
  {
    vendor_code: '252293',
    company_name: 'HERMINA RSIA DAAN MOGOT',
  },
  {
    vendor_code: '252300',
    company_name: 'P. SUTRISNO A. TAMPUBOLON',
  },
  {
    vendor_code: '252307',
    company_name: 'NIAGA MULTI INDO PT',
  },
  {
    vendor_code: '252312',
    company_name: 'TOYOFUJI LOGISTICS INDONESIA',
  },
  {
    vendor_code: '252322',
    company_name: 'ANEKA BINA CITRA',
  },
  {
    vendor_code: '252323',
    company_name: 'MONAKO MANUNGGAL',
  },
  {
    vendor_code: '252327',
    company_name: 'PT. KARLITA EMAS',
  },
  {
    vendor_code: '252334',
    company_name: 'IKIMURA INDOTOOLS CENTER',
  },
  {
    vendor_code: '252339',
    company_name: 'ANDALAN',
  },
  {
    vendor_code: '252340',
    company_name: 'KARTIKA STAR CEMERLANG CV',
  },
  {
    vendor_code: '252341',
    company_name: 'TRIDAYA KREASI SELARAS',
  },
  {
    vendor_code: '252344',
    company_name: 'PT.MURAKAMI DELLOYD INDONESIA',
  },
  {
    vendor_code: '252346',
    company_name: 'MITRA ARYATAMA SUKSES PT',
  },
  {
    vendor_code: '252348',
    company_name: 'MASA JAYA PERKASA',
  },
  {
    vendor_code: '252353',
    company_name: 'FEDERAL NITTAN INDUSTRIES',
  },
  {
    vendor_code: '252355',
    company_name: 'KURNIA MUSTIKA INDAH LESTARI',
  },
  {
    vendor_code: '252358',
    company_name: 'PERSO INTI PALLETI',
  },
  {
    vendor_code: '252359',
    company_name: 'PERSO INTI PALLETI',
  },
  {
    vendor_code: '252362',
    company_name: 'GIRINUSA CEMARA',
  },
  {
    vendor_code: '252363',
    company_name: 'CENTRAL MOTOR WHEEL INDONESIA',
  },
  {
    vendor_code: '252369',
    company_name: 'SURYA ALAM UD',
  },
  {
    vendor_code: '252374',
    company_name: 'ASABA COMPUTER CENTRE PT',
  },
  {
    vendor_code: '252380',
    company_name: 'SANDIMAS',
  },
  {
    vendor_code: '252382',
    company_name: 'SANDIMAS',
  },
  {
    vendor_code: '252384',
    company_name: 'TIA JAYA ENGINEERING CV',
  },
  {
    vendor_code: '252387',
    company_name: 'NILAM PERMATASARI',
  },
  {
    vendor_code: '252396',
    company_name: 'AICHI FORGING INDONESIA',
  },
  {
    vendor_code: '252403',
    company_name: 'ADVICS INDONESIA',
  },
  {
    vendor_code: '252405',
    company_name: 'INDONAGATOMI ELEKTROUTAMA PT',
  },
  {
    vendor_code: '252410',
    company_name: 'PURNAMA SIWI CV',
  },
  {
    vendor_code: '252413',
    company_name: 'JAVATEC TRIMITRA UTAMA',
  },
  {
    vendor_code: '252414',
    company_name: 'EPOXYNDO ART LESTARI',
  },
  {
    vendor_code: '252419',
    company_name: 'RODAMAS PT',
  },
  {
    vendor_code: '252420',
    company_name: 'PT. UNITECH ENGINEERING',
  },
  {
    vendor_code: '252421',
    company_name: 'INDONESIA POLYURETHANE INDUSTRY',
  },
  {
    vendor_code: '252422',
    company_name: 'PT. DINAMIKA NUSA MANDIRI',
  },
  {
    vendor_code: '252425',
    company_name: 'SARANA EXHIRINDO',
  },
  {
    vendor_code: '252432',
    company_name: 'GEMA AIR MASINDO',
  },
  {
    vendor_code: '252434',
    company_name: 'HEGYN HILL',
  },
  {
    vendor_code: '252435',
    company_name: 'SAKURA JAVA INDONESIA',
  },
  {
    vendor_code: '252436',
    company_name: 'INDONESIA COMNETS PLUS',
  },
  {
    vendor_code: '252437',
    company_name: 'TAKAGI SARI MULTI UTAMA',
  },
  {
    vendor_code: '252440',
    company_name: 'SAHID JAYA LIPPO CIKARANG.HOTEL',
  },
  {
    vendor_code: '252441',
    company_name: 'MULTI KARYA MANDIRI CV',
  },
  {
    vendor_code: '252444',
    company_name: 'TOTAL TANJUNG INDAH',
  },
  {
    vendor_code: '252445',
    company_name: 'OMRON ELECTRONICS',
  },
  {
    vendor_code: '252453',
    company_name: 'NIDHOGG INDONESIA',
  },
  {
    vendor_code: '252455',
    company_name: 'JAYA VICTORI CEMERLANG',
  },
  {
    vendor_code: '252465',
    company_name: 'SARANA NIAGA UPAYA PT',
  },
  {
    vendor_code: '252467',
    company_name: 'SARANA KONTRUKSI ABADI',
  },
  {
    vendor_code: '252473',
    company_name: 'PRIMATECH COMPUTAMA INFORMATINDO',
  },
  {
    vendor_code: '252485',
    company_name: 'LESTARI GAYA DINAMIKA',
  },
  {
    vendor_code: '252487',
    company_name: 'GATOT SOEBROTO PAV.DR. IMAN SUDJUDI',
  },
  {
    vendor_code: '252489',
    company_name: 'UPAYA MANDIRI SEJAHTERA',
  },
  {
    vendor_code: '252492',
    company_name: 'PT. AGUNG RAYA',
  },
  {
    vendor_code: '252493',
    company_name: 'PT TOYOTA TSUSHO NUSA TRANSPORT',
  },
  {
    vendor_code: '252495',
    company_name: 'SHUBA MITRA SOLUSI PT',
  },
  {
    vendor_code: '252496',
    company_name: 'BINA KOMUNIKA ASIATAMA PT',
  },
  {
    vendor_code: '252506',
    company_name: 'PT. SURYA SARANA DINAMIKA',
  },
  {
    vendor_code: '252507',
    company_name: 'PT. OKAYA INDONESIA',
  },
  {
    vendor_code: '252508',
    company_name: 'TRI KARYA PROSPEK',
  },
  {
    vendor_code: '252512',
    company_name: 'PAGAR GUNUNG CV',
  },
  {
    vendor_code: '252516',
    company_name: 'GEMA AIR MASINDO',
  },
  {
    vendor_code: '252518',
    company_name: 'TOYOTA TSUSHO INDONESIA',
  },
  {
    vendor_code: '252523',
    company_name: 'ATLAS COPCO INDONESIA',
  },
  {
    vendor_code: '252524',
    company_name: 'LANGGENG MULTI USAHA',
  },
  {
    vendor_code: '252525',
    company_name: 'NGT TRADING AND ENGINEERING INDONES',
  },
  {
    vendor_code: '252527',
    company_name: 'INDOPHERIN JAYA',
  },
  {
    vendor_code: '252528',
    company_name: 'SATYA NEGARA RS.',
  },
  {
    vendor_code: '252529',
    company_name: 'PERMATA CIBUBUR RSB.',
  },
  {
    vendor_code: '252531',
    company_name: 'MITRA KELUARGA BEKASI TIMUR',
  },
  {
    vendor_code: '252533',
    company_name: 'DAIKIN AIRCON',
  },
  {
    vendor_code: '252534',
    company_name: 'PT. PUNINAR YUSEN LOGISTICS INDONES',
  },
  {
    vendor_code: '252537',
    company_name: 'PERSADA SILVER',
  },
  {
    vendor_code: '252544',
    company_name: 'WARNA NUSANTARA MANDIRI',
  },
  {
    vendor_code: '252545',
    company_name: 'APL LOGISTICS',
  },
  {
    vendor_code: '252546',
    company_name: 'MITSUI O.S.K. LINES INDONESIA',
  },
  {
    vendor_code: '252549',
    company_name: 'NNA INDONESIA',
  },
  {
    vendor_code: '252550',
    company_name: 'RUKUN SEJAHTERA TEKNIK',
  },
  {
    vendor_code: '252552',
    company_name: 'RATU MANDIRI',
  },
  {
    vendor_code: '252553',
    company_name: 'BOGOR MEDICAL CENTER RS',
  },
  {
    vendor_code: '252562',
    company_name: 'WISMA KARAWANG PT. (DELONIX HOTEL)',
  },
  {
    vendor_code: '252564',
    company_name: 'HOLLAND BAKERY',
  },
  {
    vendor_code: '252567',
    company_name: 'PT. ERVAN PRIMA ABADI',
  },
  {
    vendor_code: '252568',
    company_name: 'NARDA TITA',
  },
  {
    vendor_code: '252571',
    company_name: 'TRUSTINDO MEKATRONICS MULYA',
  },
  {
    vendor_code: '252579',
    company_name: 'MARY CILEUNGSI HIJAU',
  },
  {
    vendor_code: '252580',
    company_name: 'DELIMA ASIH SISMA MEDIKA RS.',
  },
  {
    vendor_code: '252581',
    company_name: 'ARGAPURA TRADING COMPANY',
  },
  {
    vendor_code: '252582',
    company_name: '3 M INDONESIA',
  },
  {
    vendor_code: '252583',
    company_name: 'PERTAMINA JAYA RS.',
  },
  {
    vendor_code: '252584',
    company_name: 'WARNA NUSANTARA MANDIRI',
  },
  {
    vendor_code: '252585',
    company_name: 'AMANO INDONESIA',
  },
  {
    vendor_code: '252592',
    company_name: 'PT GADING PLUIT JASA MEDIKA',
  },
  {
    vendor_code: '252601',
    company_name: 'SIGMA SUKSESPRATAMA',
  },
  {
    vendor_code: '252604',
    company_name: 'REKAYASA PUTRA MANDIRI',
  },
  {
    vendor_code: '252605',
    company_name: 'INDOLOK BAKTI UTAMA',
  },
  {
    vendor_code: '252607',
    company_name: 'PT. MITRA PLUS SOLUSINDO',
  },
  {
    vendor_code: '252612',
    company_name: 'KLV INSTRUMENT INTERNATIONAL',
  },
  {
    vendor_code: '252618',
    company_name: 'KARLIN MASTRINDO',
  },
  {
    vendor_code: '252619',
    company_name: 'SOLEFOUND SAKTI',
  },
  {
    vendor_code: '252624',
    company_name: 'ARYA TEHNIK',
  },
  {
    vendor_code: '252625',
    company_name: 'KENCANA RINTAS ENGINEERING',
  },
  {
    vendor_code: '252626',
    company_name: 'TELKOM',
  },
  {
    vendor_code: '252627',
    company_name: 'KALTIM NUSA ETIKA',
  },
  {
    vendor_code: '252628',
    company_name: 'NITTO MATERIALS INDONESIA',
  },
  {
    vendor_code: '252629',
    company_name: 'ALS INDONESIA',
  },
  {
    vendor_code: '252631',
    company_name: 'METALINDO PRIMA SARANA',
  },
  {
    vendor_code: '252632',
    company_name: 'MITRATAMA PROSPEK SOLUSINDO',
  },
  {
    vendor_code: '252633',
    company_name: 'KOKUSAI CO.',
  },
  {
    vendor_code: '252637',
    company_name: 'AUTOCAR INDUSTRI KOMPONEN',
  },
  {
    vendor_code: '252638',
    company_name: 'CHIYODA INTEGRE INDONESIA',
  },
  {
    vendor_code: '252639',
    company_name: 'BARUMUN INTERNATIONAL PATENT',
  },
  {
    vendor_code: '252640',
    company_name: 'SUCOFINDO',
  },
  {
    vendor_code: '252644',
    company_name: 'PUSAKA KALI AGUNG',
  },
  {
    vendor_code: '252648',
    company_name: 'PT PUNINAR EXPRESS INDONESIA',
  },
  {
    vendor_code: '252649',
    company_name: 'KAP TANUDIREDJA',
  },
  {
    vendor_code: '252650',
    company_name: 'IDEMITSU LUBE INDONESIA',
  },
  {
    vendor_code: '252651',
    company_name: 'TUNAS KARYA NUSANTARA',
  },
  {
    vendor_code: '252654',
    company_name: 'PT.JAN MAKMUR INDONESIA',
  },
  {
    vendor_code: '252661',
    company_name: 'TELKOMSEL KANTOR REGIONAL JABOTABEK',
  },
  {
    vendor_code: '252663',
    company_name: 'ANUGERAH MITRA SENTOSA',
  },
  {
    vendor_code: '252664',
    company_name: 'TAURINA TRAVEL JAYA',
  },
  {
    vendor_code: '252666',
    company_name: 'HERMA MUDA',
  },
  {
    vendor_code: '252667',
    company_name: 'ATLAS COPCO INDONESIA',
  },
  {
    vendor_code: '252669',
    company_name: 'SINAR UTAMA PACKINDO',
  },
  {
    vendor_code: '252672',
    company_name: 'MEGA WULAN ELEKTRINDO',
  },
  {
    vendor_code: '252675',
    company_name: 'PT.PESONA SUBA ANINDYA',
  },
  {
    vendor_code: '252676',
    company_name: 'SURVEYOR INDONESIA',
  },
  {
    vendor_code: '252677',
    company_name: 'TECHNO CARBIDE',
  },
  {
    vendor_code: '252678',
    company_name: 'RYOSHIN UNGGUL INDONESIA',
  },
  {
    vendor_code: '252680',
    company_name: 'SUNICODATA COMININDO',
  },
  {
    vendor_code: '252684',
    company_name: 'TRIDAYA ARTAGUNA SANTARA',
  },
  {
    vendor_code: '252685',
    company_name: 'MATRON METROLOGI UTAMA',
  },
  {
    vendor_code: '252686',
    company_name: 'ARTHA INTILESTARI',
  },
  {
    vendor_code: '252688',
    company_name: 'MATRON METROLOGI UTAMA',
  },
  {
    vendor_code: '252689',
    company_name: 'MATRON METROLOGI UTAMA',
  },
  {
    vendor_code: '252692',
    company_name: 'SIWALI SWANTIKA',
  },
  {
    vendor_code: '252693',
    company_name: 'KALIAREN JAYA',
  },
  {
    vendor_code: '252694',
    company_name: 'MITUTOYO INDONESIA',
  },
  {
    vendor_code: '252696',
    company_name: 'TIRA AUSTENITE',
  },
  {
    vendor_code: '252699',
    company_name: 'PARANI ARTAMANDIRI',
  },
  {
    vendor_code: '252700',
    company_name: 'ADITYA OCTAVO LUMENCO',
  },
  {
    vendor_code: '252701',
    company_name: 'CHIYODA INTEGRE INDONESIA',
  },
  {
    vendor_code: '252705',
    company_name: 'KIJANGMAS CIPTA',
  },
  {
    vendor_code: '252708',
    company_name: 'ADJI KARTAAZIE',
  },
  {
    vendor_code: '252710',
    company_name: 'PT. MAERSK LINE',
  },
  {
    vendor_code: '252713',
    company_name: 'CHEVRON OIL PRODUCT INDONESIA',
  },
  {
    vendor_code: '252714',
    company_name: 'CITRA SATRIAWIDYA ANDHIKA',
  },
  {
    vendor_code: '252719',
    company_name: 'BANDAR KRIDA JASINDO',
  },
  {
    vendor_code: '252720',
    company_name: 'SRIBANGUN BUMINITIYA PT',
  },
  {
    vendor_code: '252722',
    company_name: 'AKSARA BERSAMA MANDIRI',
  },
  {
    vendor_code: '252723',
    company_name: 'RODA SEJAHTERA KENCANA ABADI',
  },
  {
    vendor_code: '252724',
    company_name: 'DARJO AGENCY',
  },
  {
    vendor_code: '252725',
    company_name: 'DARJO AGENCY',
  },
  {
    vendor_code: '252726',
    company_name: 'KARYA SETIA JAYA',
  },
  {
    vendor_code: '252727',
    company_name: 'GARUDA METALINDO',
  },
  {
    vendor_code: '252731',
    company_name: 'SMESSINDO LUBRITECH',
  },
  {
    vendor_code: '252734',
    company_name: 'PARBA NUSANTARA',
  },
  {
    vendor_code: '252735',
    company_name: 'UNGGUL GASINDO RAYA',
  },
  {
    vendor_code: '252738',
    company_name: 'SECUMINDO MULTIKARYA',
  },
  {
    vendor_code: '252742',
    company_name: 'TRIMITRA WISESA ABADI',
  },
  {
    vendor_code: '252743',
    company_name: 'CAHAYA TEKNIK ABADI',
  },
  {
    vendor_code: '252746',
    company_name: 'SHIMA KREASI MANDIRI',
  },
  {
    vendor_code: '252747',
    company_name: 'EMTRES INDONESIA',
  },
  {
    vendor_code: '252749',
    company_name: 'PT ENVIROMATE TECHNOLOGY INTERNA',
  },
  {
    vendor_code: '252750',
    company_name: 'PT.PRODATA SISTEM TEKNOLOGI',
  },
  {
    vendor_code: '252752',
    company_name: 'PLN CABANG KARAWANG',
  },
  {
    vendor_code: '252753',
    company_name: 'MILAND CIPTA USAHA',
  },
  {
    vendor_code: '252754',
    company_name: 'PLN CABANG KARAWANG',
  },
  {
    vendor_code: '252756',
    company_name: 'SINAR CIPTA BOGATAMA',
  },
  {
    vendor_code: '252757',
    company_name: 'DELTASINDO RAYA SEJAHTERA',
  },
  {
    vendor_code: '252758',
    company_name: 'INTIKOM BERLIAN MUSTIKA',
  },
  {
    vendor_code: '252759',
    company_name: 'USAHA PRIBUMI',
  },
  {
    vendor_code: '252760',
    company_name: 'CHEMINDO PRIMA ABADI',
  },
  {
    vendor_code: '252762',
    company_name: 'GLOBAL MEGA VISION',
  },
  {
    vendor_code: '252764',
    company_name: 'MAKMUR BERSAMA CV',
  },
  {
    vendor_code: '252765',
    company_name: 'PT. PRAMONO TRIPUTRA MANUNGGAL',
  },
  {
    vendor_code: '252766',
    company_name: 'PANORAMATRANSPORTASI PT.',
  },
  {
    vendor_code: '252768',
    company_name: 'ALAMANDA CV',
  },
  {
    vendor_code: '252769',
    company_name: 'MICROSOFT INDONESIA',
  },
  {
    vendor_code: '252771',
    company_name: 'YASKAWA ELECTRIC INDONESIA',
  },
  {
    vendor_code: '252773',
    company_name: 'SUKABUMI TAILOR',
  },
  {
    vendor_code: '252774',
    company_name: 'PT. FAJAR ESA MANDIRI',
  },
  {
    vendor_code: '252776',
    company_name: 'PT. SARANA UTAMA ADIMANDIRI',
  },
  {
    vendor_code: '252778',
    company_name: 'PT. JANINDO MULTI MANDIRI',
  },
  {
    vendor_code: '252779',
    company_name: 'KENARI MAJU LEATHER SHOE FACTORY',
  },
  {
    vendor_code: '252780',
    company_name: 'PERUSAHAAN GAS NEGARA (PERSERO) TBK',
  },
  {
    vendor_code: '252783',
    company_name: 'PT. FIRST MEDIA TBK',
  },
  {
    vendor_code: '252785',
    company_name: 'CITYNEON PRIMA MANDIRI',
  },
  {
    vendor_code: '252786',
    company_name: 'FUJI TROPHI',
  },
  {
    vendor_code: '252787',
    company_name: 'PT. GALVA TECHNOLOGIES',
  },
  {
    vendor_code: '252789',
    company_name: 'NITTO MATERIALS INDONESIA',
  },
  {
    vendor_code: '252790',
    company_name: 'PT. DAYA MITRA SERASI',
  },
  {
    vendor_code: '252791',
    company_name: 'CV. INFO MEGA SARANA',
  },
  {
    vendor_code: '252792',
    company_name: 'PT. CIPTA SATRIA INFORMATIKA',
  },
  {
    vendor_code: '252793',
    company_name: 'PT. ADFEXINDO MULTI SAKTI',
  },
  {
    vendor_code: '252794',
    company_name: 'CV. CIPTA MANDIRI JAYA',
  },
  {
    vendor_code: '252795',
    company_name: 'PT. NAGA MAS DUARIBU',
  },
  {
    vendor_code: '252796',
    company_name: 'PERUSAHAAN GAS NEGARA',
  },
  {
    vendor_code: '252798',
    company_name: 'WISMA KARAWANG PT. (DELONIX HOTEL)',
  },
  {
    vendor_code: '252801',
    company_name: 'PT. PANCA KARSA PUTERA JAYA',
  },
  {
    vendor_code: '252804',
    company_name: 'PT. BUSINESS NEWS',
  },
  {
    vendor_code: '252807',
    company_name: 'PT. BAJA PUTIH',
  },
  {
    vendor_code: '252808',
    company_name: 'CAKRAWALA AIRCON',
  },
  {
    vendor_code: '252810',
    company_name: 'DAIKIN AIRCON',
  },
  {
    vendor_code: '252811',
    company_name: 'PT. HARTANA KARYA BERLIMA',
  },
  {
    vendor_code: '252813',
    company_name: 'PT. MAKSIMEDIA SATYAMITRA',
  },
  {
    vendor_code: '252814',
    company_name: 'PT. KAWULA ANUGRAH MANDIRI',
  },
  {
    vendor_code: '252815',
    company_name: 'AJ BAKERY AND CAKE',
  },
  {
    vendor_code: '252817',
    company_name: 'CAHAYA INTI BERCA',
  },
  {
    vendor_code: '252819',
    company_name: 'JANE CHRISDIANTY',
  },
  {
    vendor_code: '252820',
    company_name: 'PT. ASIH EKA ABADI',
  },
  {
    vendor_code: '252821',
    company_name: 'MAYAPADA HOSPITAL RS',
  },
  {
    vendor_code: '252823',
    company_name: 'TRIGIE TUNNAS MURNI',
  },
  {
    vendor_code: '252828',
    company_name: 'STEVANIE JUNIAN DJAJA',
  },
  {
    vendor_code: '252832',
    company_name: 'PT. DELTA INDONESIA PRANENGGAR',
  },
  {
    vendor_code: '252835',
    company_name: 'PT. INDOCAL LABORATORI SISTEM',
  },
  {
    vendor_code: '252837',
    company_name: 'PT. ANDALAN NUSANTARA TEKNOLOGI',
  },
  {
    vendor_code: '252842',
    company_name: 'WULANSARI SUTITO',
  },
  {
    vendor_code: '252843',
    company_name: 'BANGUN PUTRA PERSADA',
  },
  {
    vendor_code: '252848',
    company_name: 'TOYOTA DAIHATSU ENGINEERING &',
  },
  {
    vendor_code: '252850',
    company_name: 'PT. ALFA SOLUSI',
  },
  {
    vendor_code: '252852',
    company_name: 'PT. LEGENDA SUKSESTAMA',
  },
  {
    vendor_code: '252853',
    company_name: 'PT. SYNETCOM LINTAS BUANA',
  },
  {
    vendor_code: '252854',
    company_name: 'EVERCONT UTAMA',
  },
  {
    vendor_code: '252855',
    company_name: 'PT. TUNAS DAYA MUSTIKA',
  },
  {
    vendor_code: '252857',
    company_name: 'KLINIK NAFILA MEDIKA',
  },
  {
    vendor_code: '252858',
    company_name: 'RS.CITRA HARAPAN',
  },
  {
    vendor_code: '252860',
    company_name: 'FALEH HELAL ESTABLISHMENT',
  },
  {
    vendor_code: '252862',
    company_name: 'APOTIK MITRA MANDIRI',
  },
  {
    vendor_code: '252863',
    company_name: 'G4S CASH SERVICES',
  },
  {
    vendor_code: '252865',
    company_name: 'CITRA SELARAS SEJATI PT.',
  },
  {
    vendor_code: '252866',
    company_name: 'UNIVERSITAS SINGAPERBANGSA KARAWANG',
  },
  {
    vendor_code: '252867',
    company_name: 'PT. ECOCARE INDO PASIFIK TBK',
  },
  {
    vendor_code: '252868',
    company_name: 'PT. SWANISH BOGA INDUSTRIA',
  },
  {
    vendor_code: '252874',
    company_name: 'BIO MEDIKA LABORATORIUM KLINIK',
  },
  {
    vendor_code: '252875',
    company_name: 'CITRA NUGERAH KARYA',
  },
  {
    vendor_code: '252880',
    company_name: 'PT. SINAR MUTIARA CEMERLANG',
  },
  {
    vendor_code: '252881',
    company_name: 'PT. MEGA PERSADA UTAMA',
  },
  {
    vendor_code: '252882',
    company_name: 'PT. ISS INDONESIA',
  },
  {
    vendor_code: '252886',
    company_name: 'PT. LEMBAH SERAYU',
  },
  {
    vendor_code: '252887',
    company_name: 'PT. SARAFINA SYAMI UTAMA',
  },
  {
    vendor_code: '252890',
    company_name: 'PT. GLOBAL MODEL TECHNOLOGY',
  },
  {
    vendor_code: '252891',
    company_name: 'PT. UNILAB PERDANA',
  },
  {
    vendor_code: '252893',
    company_name: 'PT. ELCO POWER SYSTEM',
  },
  {
    vendor_code: '252894',
    company_name: 'SUPER STEEL KARAWANG',
  },
  {
    vendor_code: '252895',
    company_name: 'T T METALS INDONESIA',
  },
  {
    vendor_code: '252896',
    company_name: 'PT. ADHIYAKSA DAYA SENTOSA',
  },
  {
    vendor_code: '252899',
    company_name: 'HOTEL SAHID JAYA JAKARTA',
  },
  {
    vendor_code: '252901',
    company_name: 'TOYOTA ARGENTINA S.A.',
  },
  {
    vendor_code: '252902',
    company_name: 'SIAM TOYOTA MANUFACTURING CO.',
  },
  {
    vendor_code: '252904',
    company_name: 'OMNI INTERNASIONAL HOSPITAL',
  },
  {
    vendor_code: '252905',
    company_name: 'BIO MEDIKA LABORATORIUM KLINIK',
  },
  {
    vendor_code: '252906',
    company_name: 'ADIH SUSANTO ( ELMOR BOUTIQUE )',
  },
  {
    vendor_code: '252907',
    company_name: 'PT. GRAFITAMA DELTAKREASI',
  },
  {
    vendor_code: '252908',
    company_name: 'PT. AUTOTEKNINDO SUMBER MAKMUR',
  },
  {
    vendor_code: '252911',
    company_name: 'PT. ASRI KENCANA JAYA',
  },
  {
    vendor_code: '252912',
    company_name: 'CV. AHFIS SAMIBAKTI',
  },
  {
    vendor_code: '252913',
    company_name: 'PT. PERMATA DRAWALINDO',
  },
  {
    vendor_code: '252914',
    company_name: 'PT. CITRA LANGGENG SENTOSA',
  },
  {
    vendor_code: '252915',
    company_name: 'PT. PERKOM INDAH MURNI',
  },
  {
    vendor_code: '252916',
    company_name: 'PT. CHEMINDONTIA',
  },
  {
    vendor_code: '252917',
    company_name: 'CV. ELOK MEKAR SARI',
  },
  {
    vendor_code: '252918',
    company_name: 'PT. DAIDO INDONESIA MANUFACTURING',
  },
  {
    vendor_code: '252920',
    company_name: 'PT. KOMATSU MARKETING AND SUPPORT',
  },
  {
    vendor_code: '252921',
    company_name: 'DIKDIK BURHANUDIN',
  },
  {
    vendor_code: '252922',
    company_name: 'PT. ARGO MANUNGGAL TEXTILE',
  },
  {
    vendor_code: '252924',
    company_name: 'PT. INTERNATIONAL MOVERS & STORAGE',
  },
  {
    vendor_code: '252926',
    company_name: 'PT. MESA PUBLISHING',
  },
  {
    vendor_code: '252927',
    company_name: 'PT. NECINDO ERACENDEKIA',
  },
  {
    vendor_code: '252928',
    company_name: 'NUSANTARA COMPNET INTEGRATOR',
  },
  {
    vendor_code: '252929',
    company_name: 'PT. CONSPEC PERTAMA INDONESIA',
  },
  {
    vendor_code: '252931',
    company_name: 'PT. SUMBER KITA INDAH',
  },
  {
    vendor_code: '252933',
    company_name: 'PT. ALPHAPRIMA PERSADA',
  },
  {
    vendor_code: '252934',
    company_name: 'PT. GLOBAL SMART SOLUSINDO',
  },
  {
    vendor_code: '252935',
    company_name: 'PT. HALTRACO SARANA MULIA',
  },
  {
    vendor_code: '252937',
    company_name: 'PT. K LINE MOBARU DIAMOND INDONES',
  },
  {
    vendor_code: '252938',
    company_name: 'PT. AMANJA MEGA PERSADA',
  },
  {
    vendor_code: '252940',
    company_name: 'TAKAGI SARI MULTI UTAMA',
  },
  {
    vendor_code: '252941',
    company_name: 'TOYO DENSO INDONESIA',
  },
  {
    vendor_code: '252942',
    company_name: 'PT. SANKO GOSEI TECHNOLOGY INDONESI',
  },
  {
    vendor_code: '252943',
    company_name: 'PT. FAJAR KENCANA MANDIRI',
  },
  {
    vendor_code: '252944',
    company_name: 'GABUNGAN INDUSTRI ALATALAT',
  },
  {
    vendor_code: '252945',
    company_name: 'HIMAWAN PUTRA',
  },
  {
    vendor_code: '252946',
    company_name: 'PT. PANCA CIPTA BERSAMA',
  },
  {
    vendor_code: '252950',
    company_name: 'PT. TECHNO TAIBA ARTEMIS',
  },
  {
    vendor_code: '252952',
    company_name: 'CROWN LINE',
  },
  {
    vendor_code: '252958',
    company_name: 'PT. KUDA PRIMA',
  },
  {
    vendor_code: '252960',
    company_name: 'PT. HYUNDAI MOBIL INDONESIA',
  },
  {
    vendor_code: '252961',
    company_name: 'FRANS WINARTA AND PARTNERS',
  },
  {
    vendor_code: '252962',
    company_name: 'INTERNATIONAL TEST CENTER',
  },
  {
    vendor_code: '252963',
    company_name: 'PT. GRIYA RESIK CEMERLANG',
  },
  {
    vendor_code: '252966',
    company_name: 'ADAPTIVE AUTOMATION SYSTEM',
  },
  {
    vendor_code: '252969',
    company_name: 'PT. TRANS DARPI INDONESIA',
  },
  {
    vendor_code: '252972',
    company_name: 'PT. DATACELL INFOMEDIA',
  },
  {
    vendor_code: '252973',
    company_name: 'PT. KARANG MULYA SEJAHTERA',
  },
  {
    vendor_code: '252975',
    company_name: 'PT. INDONESIA ACIDS INDUSTRY',
  },
  {
    vendor_code: '252976',
    company_name: 'PT. OOCL INDONESIA',
  },
  {
    vendor_code: '252977',
    company_name: 'PT. MITRA MUKIM MANDIRI',
  },
  {
    vendor_code: '252978',
    company_name: 'PT. SURYA SAPTA CAKRAWALA',
  },
  {
    vendor_code: '252980',
    company_name: 'PT. BINA PRIMA LESTARI',
  },
  {
    vendor_code: '252981',
    company_name: 'PT. GOLDEN NUSAJAYA TOURS & TRAVEL',
  },
  {
    vendor_code: '252982',
    company_name: 'PT. ANDALAN TEKNOLOGI INOVASI',
  },
  {
    vendor_code: '252983',
    company_name: 'PT. MEDIANTARA KREASINDO',
  },
  {
    vendor_code: '252984',
    company_name: 'PT. GLOBAL SINERGI TEKNIKINDO',
  },
  {
    vendor_code: '252986',
    company_name: 'PERMATA BEKASI RS',
  },
  {
    vendor_code: '252988',
    company_name: 'AWAL BROSS BEKASI RS',
  },
  {
    vendor_code: '252989',
    company_name: 'HERMINA GRAND WISATA RS',
  },
  {
    vendor_code: '252990',
    company_name: 'MITRA KELUARGA CIKARANG RS',
  },
  {
    vendor_code: '252991',
    company_name: 'MITRA KELUARGA DEPOK RS',
  },
  {
    vendor_code: '252992',
    company_name: 'PT. TOYOPACK PRIMA MANDIRI',
  },
  {
    vendor_code: '252993',
    company_name: 'PT. TOTAL INTI SOLUSI',
  },
  {
    vendor_code: '252994',
    company_name: 'HADI MARTONO',
  },
  {
    vendor_code: '252996',
    company_name: 'PT. TERMINAL TOUR & TRAVEL',
  },
  {
    vendor_code: '253001',
    company_name: 'PT. INDONESIA KOITO',
  },
  {
    vendor_code: '253002',
    company_name: 'PT. JTEKT INDONESIA',
  },
  {
    vendor_code: '253003',
    company_name: 'PT. JOYSON SAFETY SYSTEMS INDONESIA',
  },
  {
    vendor_code: '253004',
    company_name: 'PT. TOKAI RIKA INDONESIA',
  },
  {
    vendor_code: '253005',
    company_name: 'PT. TT NETWORK INTEGRATION INDONESI',
  },
  {
    vendor_code: '253006',
    company_name: 'PT. INGRESS MALINDO VENTURES',
  },
  {
    vendor_code: '253007',
    company_name: 'PT. SETIA GUNA SEJATI',
  },
  {
    vendor_code: '253008',
    company_name: 'PT. GS ELECTECH INDONESIA',
  },
  {
    vendor_code: '253009',
    company_name: 'PT. KOTOBUKIYA INDO CLASSIC INDUSTR',
  },
  {
    vendor_code: '253010',
    company_name: 'PT. WHITEOPEN TEKNOLOGI',
  },
  {
    vendor_code: '253011',
    company_name: 'PT. SHIROKI INDONESIA',
  },
  {
    vendor_code: '253012',
    company_name: 'PT. SODEXO MOTIVATION SOLUTIONS',
  },
  {
    vendor_code: '253013',
    company_name: 'PT. ESKANUSA PUTRACO',
  },
  {
    vendor_code: '253014',
    company_name: 'PT. SUMMARECON HOTELINDO (HARRIS)',
  },
  {
    vendor_code: '253015',
    company_name: 'PT. MOVEYOR INDOTECH MANDIRI',
  },
  {
    vendor_code: '253016',
    company_name: 'PT. LESTARI DINI TUNGGUL',
  },
  {
    vendor_code: '253020',
    company_name: 'PT. JAYA OBAYASHI',
  },
  {
    vendor_code: '253021',
    company_name: 'YOHZU INDONESIA',
  },
  {
    vendor_code: '253022',
    company_name: 'PT. TEMANLAMA DANA UTAMA',
  },
  {
    vendor_code: '253023',
    company_name: 'PT. GAVRA TRIJAYA MOTOR',
  },
  {
    vendor_code: '253025',
    company_name: 'PT. SANSHIRO HARAPAN MAKMUR',
  },
  {
    vendor_code: '253026',
    company_name: 'PT. YUDHANUSA EKSPRESINDO CARAKA',
  },
  {
    vendor_code: '253027',
    company_name: 'PERSEK RSA CONSULT',
  },
  {
    vendor_code: '253028',
    company_name: 'CV. GUNAVINDO MAKMUR ELEKTRIK',
  },
  {
    vendor_code: '253029',
    company_name: 'CV. TIKA UTAMA',
  },
  {
    vendor_code: '253030',
    company_name: 'PT. TRIJAYA EKA UTAMA',
  },
  {
    vendor_code: '253032',
    company_name: 'PT. YONAS TURBO UTAMA',
  },
  {
    vendor_code: '253036',
    company_name: 'PT. MITRA ADIKARYA SEJAHTERA',
  },
  {
    vendor_code: '253038',
    company_name: 'PT. BINAMAN UTAMA',
  },
  {
    vendor_code: '253039',
    company_name: 'PT. DELTA INDONESIA PRANENGGAR',
  },
  {
    vendor_code: '253042',
    company_name: 'PT. TEKNO KLINZ INDONESIA',
  },
  {
    vendor_code: '253043',
    company_name: 'RIPENART CO.',
  },
  {
    vendor_code: '253044',
    company_name: 'PT. INTAMA CENTRAL MAKMUR LESTARI',
  },
  {
    vendor_code: '253045',
    company_name: 'SONOKEMBANG CATERING',
  },
  {
    vendor_code: '253046',
    company_name: 'KAP TANUDIREDJA',
  },
  {
    vendor_code: '253057',
    company_name: 'PT. TSUCHIYA INDONESIA',
  },
  {
    vendor_code: '253058',
    company_name: 'PT. LA VIDA HERCULON',
  },
  {
    vendor_code: '253059',
    company_name: 'PT. TUFFINDO NITTOKU AUTONEUM',
  },
  {
    vendor_code: '253060',
    company_name: 'HOWA INDONESIA PT.',
  },
  {
    vendor_code: '253061',
    company_name: 'PT TCT AUTOMATION ENGINEERING',
  },
  {
    vendor_code: '253062',
    company_name: 'PT. JOYSON SAFETY SYSTEMS INDONESIA',
  },
  {
    vendor_code: '253063',
    company_name: 'CV. CITRA SEJATI',
  },
  {
    vendor_code: '253064',
    company_name: 'PT. DHARMA CONTROLCABLE INDONESIA',
  },
  {
    vendor_code: '253065',
    company_name: 'PT. TOKAI RUBBER INDONESIA',
  },
  {
    vendor_code: '253066',
    company_name: 'PT. TOKAI RUBBER AUTO HOSE INDONESI',
  },
  {
    vendor_code: '253067',
    company_name: 'PT. NIFCO INDONESIA',
  },
  {
    vendor_code: '253068',
    company_name: 'PT. MTAT INDONESIA',
  },
  {
    vendor_code: '253069',
    company_name: 'HOTEL HORISON BEKASI',
  },
  {
    vendor_code: '253070',
    company_name: 'PT. DASICA',
  },
  {
    vendor_code: '253072',
    company_name: 'COFORGE LTD.',
  },
  {
    vendor_code: '253073',
    company_name: 'PT.ARKAMAYA',
  },
  {
    vendor_code: '253074',
    company_name: 'PRIMA SARANA WIRAJAYA',
  },
  {
    vendor_code: '253075',
    company_name: 'PT. NACHI INDONESIA',
  },
  {
    vendor_code: '253076',
    company_name: 'PT. FUTABA INDUSTRIAL INDONESIA',
  },
  {
    vendor_code: '253077',
    company_name: 'PT. PARDINGOT RIA',
  },
  {
    vendor_code: '253081',
    company_name: 'JESSICA WIBOWO',
  },
  {
    vendor_code: '253083',
    company_name: 'PT.GLOBAL MEDIA INFORINDO',
  },
  {
    vendor_code: '253084',
    company_name: 'LPBJ AYUMI',
  },
  {
    vendor_code: '253085',
    company_name: 'PT.FOCUS QUANTUM SUCCES',
  },
  {
    vendor_code: '253086',
    company_name: 'PT.SHINTO KOGYO INDONESIA',
  },
  {
    vendor_code: '253087',
    company_name: 'PT. SOMIC INDONESIA',
  },
  {
    vendor_code: '253088',
    company_name: 'PT.LENTERA AGUNG KENCANA',
  },
  {
    vendor_code: '253089',
    company_name: 'VISUAL COMMUNICATION SOLUTION',
  },
  {
    vendor_code: '253090',
    company_name: 'PT.KLUEGE INTERNATIONAL',
  },
  {
    vendor_code: '253091',
    company_name: 'PT. MARSAT WINDU ANDIKA',
  },
  {
    vendor_code: '253092',
    company_name: 'PT.TIGA SAUDARA PUTRI',
  },
  {
    vendor_code: '253093',
    company_name: 'PT.MALIFAX INDONESIA',
  },
  {
    vendor_code: '253094',
    company_name: 'PT.SHARK CARCARE INDONESIA',
  },
  {
    vendor_code: '253096',
    company_name: 'PT. NIPPON INDOSARI CORPINDO TBK.',
  },
  {
    vendor_code: '253097',
    company_name: 'PT.SINAR JAYA LANGGENG UTAMA',
  },
  {
    vendor_code: '253098',
    company_name: 'PT.REKSO NATIONAL FOOD',
  },
  {
    vendor_code: '253102',
    company_name: 'PT. ESTIKA DAYA MANDIRI',
  },
  {
    vendor_code: '253104',
    company_name: 'PT. BINTANG METAL SEJAHTERA',
  },
  {
    vendor_code: '253105',
    company_name: 'PT. MINDA ASEAN AUTOMOTIVE',
  },
  {
    vendor_code: '253106',
    company_name: 'CV. MING ART',
  },
  {
    vendor_code: '253108',
    company_name: 'PT. AUTOMOTIVE FASTENERS AOYAMA',
  },
  {
    vendor_code: '253109',
    company_name: 'CV. RUBBER GEMILANG',
  },
  {
    vendor_code: '253110',
    company_name: 'CV. SARANA PESTA',
  },
  {
    vendor_code: '253111',
    company_name: 'PT. AYADI MUGNI MANDIRI',
  },
  {
    vendor_code: '253112',
    company_name: 'PT. SANTAKU SHINWA INDONESIA',
  },
  {
    vendor_code: '253114',
    company_name: 'CV. TOYOGA',
  },
  {
    vendor_code: '253115',
    company_name: 'PT. PUSAKA LOGISTIK',
  },
  {
    vendor_code: '253117',
    company_name: 'TPR SALES INDONESIA',
  },
  {
    vendor_code: '253118',
    company_name: 'PT.ACBOS INDONESIA',
  },
  {
    vendor_code: '253119',
    company_name: 'PT. BERKAH MIRZA INSANI',
  },
  {
    vendor_code: '253120',
    company_name: 'PT. IKON MANDIRI',
  },
  {
    vendor_code: '253121',
    company_name: 'PT. CAHAYA INTI PUTRA SEJAHTERA',
  },
  {
    vendor_code: '253123',
    company_name: 'PT. SUGITY CREATIVES',
  },
  {
    vendor_code: '253124',
    company_name: 'PT. INDOMATIC MANDIRI SENTOSA',
  },
  {
    vendor_code: '253125',
    company_name: 'PT. AGRICON PUTRA CITRA OPTIMA',
  },
  {
    vendor_code: '253126',
    company_name: 'PT.HPMT ARTODA INDONESIA',
  },
  {
    vendor_code: '253127',
    company_name: 'PT.SUGIURA INDONESIA',
  },
  {
    vendor_code: '253128',
    company_name: 'PT. MEIDOH INDONESIA',
  },
  {
    vendor_code: '253129',
    company_name: 'PT.ADI LUHUNG HTSM',
  },
  {
    vendor_code: '253131',
    company_name: 'PT.SINAR BARU LOGISTIK',
  },
  {
    vendor_code: '253133',
    company_name: 'HOWA INDONESIA PT.',
  },
  {
    vendor_code: '253135',
    company_name: 'DINAR MAKMUR PT.',
  },
  {
    vendor_code: '253136',
    company_name: 'KYOKUYO INDUSTRIAL INDONESIA',
  },
  {
    vendor_code: '253137',
    company_name: 'PRIMA SARANA WIRAJAYA',
  },
  {
    vendor_code: '253138',
    company_name: 'CV. TIRTA TIO',
  },
  {
    vendor_code: '253139',
    company_name: 'NIPPON OIL INDONESIA',
  },
  {
    vendor_code: '253140',
    company_name: 'CEMERLANG CV.',
  },
  {
    vendor_code: '253141',
    company_name: 'REMAJA AGENCY CV.',
  },
  {
    vendor_code: '253142',
    company_name: 'AXESS MEDIA',
  },
  {
    vendor_code: '253144',
    company_name: 'DANA PENSIUN ASTRA DUA',
  },
  {
    vendor_code: '253145',
    company_name: 'NISHIKAWA KARYA INDONESIA',
  },
  {
    vendor_code: '253146',
    company_name: 'INDONESIA THAI SUMMIT AUTO',
  },
  {
    vendor_code: '253148',
    company_name: 'KOJIMA AUTO TECHNOLOGY INDONESIA PT',
  },
  {
    vendor_code: '253151',
    company_name: 'GAGAS ENERGI INDONESIA PT.',
  },
  {
    vendor_code: '253152',
    company_name: 'ARTHAMAKMUR BERKAH SEJAHTERA PT.',
  },
  {
    vendor_code: '253153',
    company_name: 'PT.BANK NEGARA INDONESIA TBK',
  },
  {
    vendor_code: '253154',
    company_name: 'PT.VISI SALFA',
  },
  {
    vendor_code: '253155',
    company_name: 'PT.YASA KAYANA INDONESIA',
  },
  {
    vendor_code: '253156',
    company_name: 'HANKOOK TIRE INDONESIA',
  },
  {
    vendor_code: '253157',
    company_name: 'PT. EKAPRASARANA ARYAGUNASATYA',
  },
  {
    vendor_code: '253158',
    company_name: 'PT. CITRA MECHANICAL TEKNIK',
  },
  {
    vendor_code: '253159',
    company_name: 'PT. KARSA WIJAYA PRATAMA',
  },
  {
    vendor_code: '253160',
    company_name: 'PT. PABRIK MESIN TEHA',
  },
  {
    vendor_code: '253161',
    company_name: 'PT. DENAPELLA LESTARI',
  },
  {
    vendor_code: '253163',
    company_name: 'PT. ICHIKARA',
  },
  {
    vendor_code: '253164',
    company_name: 'GRAND ZURI HOTEL JABABEKA',
  },
  {
    vendor_code: '253165',
    company_name: 'PT. SYSLAB',
  },
  {
    vendor_code: '253166',
    company_name: 'LASONO',
  },
  {
    vendor_code: '253167',
    company_name: 'HARTONO',
  },
  {
    vendor_code: '253169',
    company_name: 'PT. PACKET SYSTEMS INDONESIA',
  },
  {
    vendor_code: '253170',
    company_name: 'PPG INDONESIA PT.',
  },
  {
    vendor_code: '253171',
    company_name: 'CV. DIANA RAHAYU',
  },
  {
    vendor_code: '253172',
    company_name: 'ENDANG SUHANDI',
  },
  {
    vendor_code: '253173',
    company_name: 'CV. TEHNIK DAYA TERMITE',
  },
  {
    vendor_code: '253175',
    company_name: 'PT. ASBABAL ENGINEERING INDONESIA',
  },
  {
    vendor_code: '253176',
    company_name: 'CV. KARYA ASRI',
  },
  {
    vendor_code: '253177',
    company_name: 'PT. MULTI SELARAS ABADI',
  },
  {
    vendor_code: '253178',
    company_name: 'PT. RAH CAKRA BERSAUDARA',
  },
  {
    vendor_code: '253179',
    company_name: 'CV. JASUN MAS SAKTI',
  },
  {
    vendor_code: '253180',
    company_name: 'PT. SUBARU TEHNIK',
  },
  {
    vendor_code: '253181',
    company_name: 'DWI LAKSONO SUBIAKTO',
  },
  {
    vendor_code: '253184',
    company_name: 'PT. TANOSHINDO BOGA KELOLA',
  },
  {
    vendor_code: '253185',
    company_name: 'PT. NIPPON INDOSARI CORPINDO TBK.',
  },
  {
    vendor_code: '253186',
    company_name: 'PT. MITSUBA INDONESIA PIPE PARTS',
  },
  {
    vendor_code: '253187',
    company_name: 'PT. HUTCHISON 3 INDONESIA',
  },
  {
    vendor_code: '253188',
    company_name: 'PT. PELAYARAN BINTANG PUTIH',
  },
  {
    vendor_code: '253190',
    company_name: 'PT. ASANO GEAR INDONESIA',
  },
  {
    vendor_code: '253192',
    company_name: 'PT. OASIS WATERS INTERNATIONAL',
  },
  {
    vendor_code: '253194',
    company_name: 'CITRA GRAND HOTEL KARAWANG',
  },
  {
    vendor_code: '253195',
    company_name: 'PT. DHARMA POLIMETAL',
  },
  {
    vendor_code: '253196',
    company_name: 'PT. ARAI RUBBER SEAL INDONESIA',
  },
  {
    vendor_code: '253197',
    company_name: 'PT. SELARAS MITRA INTEGRA',
  },
  {
    vendor_code: '253198',
    company_name: 'PT. PEMBANGUNAN PERUMAHAN',
  },
  {
    vendor_code: '253199',
    company_name: 'PT. ECOLAB INDONESIA',
  },
  {
    vendor_code: '253200',
    company_name: 'PT. TOKAI RIKA SAFETY INDONESIA',
  },
  {
    vendor_code: '253201',
    company_name: 'PT. SUMISHO GLOBAL LOGISTICS INDONE',
  },
  {
    vendor_code: '253202',
    company_name: 'PT. DITA UTAMA',
  },
  {
    vendor_code: '253203',
    company_name: 'PT. TCD ASIA PACIFIC INDONESIA',
  },
  {
    vendor_code: '253205',
    company_name: 'PT. INTI FAJAR SELARAS',
  },
  {
    vendor_code: '253206',
    company_name: 'CV. KALIBRA CONSULTING',
  },
  {
    vendor_code: '253207',
    company_name: 'CV. PRAMANTI',
  },
  {
    vendor_code: '253208',
    company_name: 'PT. MARS INDONESIA',
  },
  {
    vendor_code: '253209',
    company_name: 'PT. INDOPRIMA GEMILANG',
  },
  {
    vendor_code: '253210',
    company_name: 'PT. ECOLAB INDONESIA',
  },
  {
    vendor_code: '253211',
    company_name: 'PT.ROBERT BOSCH',
  },
  {
    vendor_code: '253213',
    company_name: 'CV. ELGA LANGGENG JAYA',
  },
  {
    vendor_code: '253214',
    company_name: 'PT. MISUMI INDONESIA',
  },
  {
    vendor_code: '253215',
    company_name: 'PT. MANDIRI INDOJAYA ABADI',
  },
  {
    vendor_code: '253216',
    company_name: 'MITSUBISHI ELECTRIC INDONESIA',
  },
  {
    vendor_code: '253217',
    company_name: 'PT.DENSO TEN AVE INDONESIA',
  },
  {
    vendor_code: '253218',
    company_name: 'PT.SEACON KREASI',
  },
  {
    vendor_code: '253219',
    company_name: 'PT.TRINITY ENGINEERING INDONESIA',
  },
  {
    vendor_code: '253220',
    company_name: 'PT.DAYA5 REKRUTMEN',
  },
  {
    vendor_code: '253223',
    company_name: 'PT.HIKARI EXPRESS LOGISTICS',
  },
  {
    vendor_code: '253226',
    company_name: 'PT.INSAN MEDIA NERACA',
  },
  {
    vendor_code: '253228',
    company_name: 'PT.FAHISA SUKSES MANDIRA',
  },
  {
    vendor_code: '253229',
    company_name: 'PT.BINTANG SATU CIPTA',
  },
  {
    vendor_code: '253233',
    company_name: 'PT. AMINTA PELANGI MAKSIMA',
  },
  {
    vendor_code: '253234',
    company_name: 'PT. ER MANDAR KREATIF',
  },
  {
    vendor_code: '253235',
    company_name: 'PT.UNITED AUTOMOBIL SEMBILANPULUH',
  },
  {
    vendor_code: '253236',
    company_name: 'PT.TITIAN NUSANTARA BOGA',
  },
  {
    vendor_code: '253237',
    company_name: 'PT.DENSO TEN AVE INDONESIA',
  },
  {
    vendor_code: '253238',
    company_name: 'PT.CULTUREROYALE INDONESIA',
  },
  {
    vendor_code: '253240',
    company_name: 'PT.KHARISMA ASA UTAMA',
  },
  {
    vendor_code: '253241',
    company_name: 'LANGGENG TEKNIK',
  },
  {
    vendor_code: '253242',
    company_name: 'ASSEGAF HAMZAH & PARTNERS',
  },
  {
    vendor_code: '253244',
    company_name: 'PT. JUSTIKA SIAR PUBLIKA',
  },
  {
    vendor_code: '253245',
    company_name: 'PT.SURYA SMARTEKINDO',
  },
  {
    vendor_code: '253247',
    company_name: 'PT.ITOKIN INDONESIA',
  },
  {
    vendor_code: '253248',
    company_name: 'PT.ART PISTON INDONESIA',
  },
  {
    vendor_code: '253249',
    company_name: 'PT.JAYAVIVADANADYAKSA INDONESIA',
  },
  {
    vendor_code: '253250',
    company_name: 'RS.HERMINA MEKARSARI',
  },
  {
    vendor_code: '253252',
    company_name: 'RS.ROYAL TARUMA',
  },
  {
    vendor_code: '253255',
    company_name: 'PT.PANCARAN LOGISTIK INDONESIA',
  },
  {
    vendor_code: '253257',
    company_name: 'PT.PUTRA SOPUTAN',
  },
  {
    vendor_code: '253258',
    company_name: 'PT.PARADOTAMA SENTRA TOOLSINDO',
  },
  {
    vendor_code: '253259',
    company_name: 'PT. CALADI LIMA SEMBILAN',
  },
  {
    vendor_code: '253260',
    company_name: 'KK GARMENT',
  },
  {
    vendor_code: '253261',
    company_name: 'PT.ELSI',
  },
  {
    vendor_code: '253262',
    company_name: 'PT.DC SOLUTIONS',
  },
  {
    vendor_code: '253263',
    company_name: 'PT.DIAMOND ELECTRIC INDONESIA',
  },
  {
    vendor_code: '253266',
    company_name: 'PT.IMPROVA DATAMEDIA',
  },
  {
    vendor_code: '253267',
    company_name: 'PT.VUTEQ INDONESIA',
  },
  {
    vendor_code: '253268',
    company_name: 'PT.ARKAMAYA',
  },
  {
    vendor_code: '253269',
    company_name: 'CV.TITILAS JAYA SOLUSINDO',
  },
  {
    vendor_code: '253270',
    company_name: 'PT.VITALITI MANDIRI',
  },
  {
    vendor_code: '253271',
    company_name: 'PT.IDE KREASI DJAYA ABADI',
  },
  {
    vendor_code: '253272',
    company_name: 'PT.MEDIA CAHAYA ABADI',
  },
  {
    vendor_code: '253274',
    company_name: 'PT.SUMIDEN SINTERED COMPONENT INDON',
  },
  {
    vendor_code: '253275',
    company_name: 'PT.KEYENCE INDONESIA',
  },
  {
    vendor_code: '253276',
    company_name: 'PT.GOKKO MIRAI INDONESIA',
  },
  {
    vendor_code: '253277',
    company_name: 'PT.EVIRA SINERGY UTAMA',
  },
  {
    vendor_code: '253278',
    company_name: 'PT.KYOWASYNCHRO TECHNOLOGY INDONESI',
  },
  {
    vendor_code: '253279',
    company_name: 'PT.SARANA ARTHA CIPTA',
  },
  {
    vendor_code: '253280',
    company_name: 'CV.DINASTY PRATAMA ENGINEERING',
  },
  {
    vendor_code: '253281',
    company_name: 'PT.MITSU SINAR TEKNIK',
  },
  {
    vendor_code: '253282',
    company_name: 'PT.RODA KAWAN SEJAHTERA',
  },
  {
    vendor_code: '253283',
    company_name: 'CV.SELARAS BERKAH ABADI',
  },
  {
    vendor_code: '253285',
    company_name: 'PT.SUMMIT ADYAWINSA INDONESIA',
  },
  {
    vendor_code: '253286',
    company_name: 'PT.UYEMURA INDONESIA',
  },
  {
    vendor_code: '253287',
    company_name: 'PT.CATALER INDONESIA',
  },
  {
    vendor_code: '253288',
    company_name: 'PT.CIPTA HYDROPOWER ABADI',
  },
  {
    vendor_code: '253289',
    company_name: 'PT.PRISMA TEKNOLOGI INFORMATIKA',
  },
  {
    vendor_code: '253290',
    company_name: 'PT.DUNIA EXPRESS TRANSINDO',
  },
  {
    vendor_code: '253292',
    company_name: 'PT.ALIRA MAJU BERSAMA',
  },
  {
    vendor_code: '253293',
    company_name: 'PT.EDCON PRATAMA',
  },
  {
    vendor_code: '253294',
    company_name: 'PT.OTTOPAINT COLOURS INDONESIA',
  },
  {
    vendor_code: '253295',
    company_name: 'BPJS KESEHATAN',
  },
  {
    vendor_code: '253296',
    company_name: 'MITRA FAMILY',
  },
  {
    vendor_code: '253297',
    company_name: 'MAYAPADA HOSPITAL',
  },
  {
    vendor_code: '253299',
    company_name: 'RS.TAMAN HARAPAN BARU',
  },
  {
    vendor_code: '2533',
    company_name: 'PT.MUROTECH INDONESIA',
  },
  {
    vendor_code: '253300',
    company_name: 'PT.HAMAREN TRANSPORT RAYA',
  },
  {
    vendor_code: '253301',
    company_name: 'PT.MAJU USAHA BERDIKARI',
  },
  {
    vendor_code: '253302',
    company_name: 'PT.SAM INDONESIA',
  },
  {
    vendor_code: '253303',
    company_name: 'PT.HANS MANUFAKTURING INDONESIA',
  },
  {
    vendor_code: '253304',
    company_name: 'PT.JAVA TENSAI INDONESIA',
  },
  {
    vendor_code: '253305',
    company_name: 'PT.EDELMAN INDONESIA',
  },
  {
    vendor_code: '253306',
    company_name: 'OBOR SARANA UTAMA',
  },
  {
    vendor_code: '253307',
    company_name: 'PT.ARTSANI CIPTA PROMOSINDO',
  },
  {
    vendor_code: '253308',
    company_name: 'PT.HONE KOGI PRIMA AUTO TEC.IND',
  },
  {
    vendor_code: '253309',
    company_name: 'DONGJIN FOUNDRY INDUSTRY CO.LTD',
  },
  {
    vendor_code: '253310',
    company_name: 'PT.MEITOKU WADAYAMA INDONESIA',
  },
  {
    vendor_code: '253311',
    company_name: 'CV.DARMACITRA RAHMAD SEJATI',
  },
  {
    vendor_code: '253312',
    company_name: 'CV.BINTANG JAYA',
  },
  {
    vendor_code: '253313',
    company_name: 'PT.GRAHA PATRIATAMA JAYA',
  },
  {
    vendor_code: '253314',
    company_name: 'PT.PELANGI MITRA INTIPERKASA',
  },
  {
    vendor_code: '253315',
    company_name: 'TOYOTA TSUSHO M&E (THAILAND)',
  },
  {
    vendor_code: '253316',
    company_name: 'PT.ADIPERKASA ANUGRAH PRATAMA',
  },
  {
    vendor_code: '253317',
    company_name: 'PT.PERSONA PRIMA UTAMA',
  },
  {
    vendor_code: '253318',
    company_name: 'PT.NUSAPLAZA INTERNATIONAL HOTEL',
  },
  {
    vendor_code: '253319',
    company_name: 'PT.FUJI KINZOKU INDONESIA',
  },
  {
    vendor_code: '253320',
    company_name: 'PT.KEIDHIKEI INDONESIA',
  },
  {
    vendor_code: '253321',
    company_name: 'SHINMEI INDUSTRY INDONESIA PT.',
  },
  {
    vendor_code: '253322',
    company_name: 'PT.WILISINDOMAS INDAHMAKMUR',
  },
  {
    vendor_code: '253323',
    company_name: 'PT.YKS INDONESIA',
  },
  {
    vendor_code: '253324',
    company_name: 'PT.NKS FILTER',
  },
  {
    vendor_code: '253325',
    company_name: 'PT.PRATAMA GRAHA SEMESTA',
  },
  {
    vendor_code: '253326',
    company_name: 'PT.ADHI JAYA PUTRA SEJAHTERA',
  },
  {
    vendor_code: '253327',
    company_name: 'PT.MINEZAWA TRADING INDONESIA',
  },
  {
    vendor_code: '253328',
    company_name: 'PT.TSUBAKI INDONESIA TRADING',
  },
  {
    vendor_code: '253329',
    company_name: 'PT.SWIF ASIA',
  },
  {
    vendor_code: '253330',
    company_name: 'PT.SETSUYO ASTEC',
  },
  {
    vendor_code: '253332',
    company_name: 'PT. SEKAWAN GLOBAL TEKNINDO',
  },
  {
    vendor_code: '253334',
    company_name: 'PT.ISK INDONESIA',
  },
  {
    vendor_code: '253335',
    company_name: 'PT.MUROTECH INDONESIA',
  },
  {
    vendor_code: '253336',
    company_name: 'PT.SERVO FIRE INDONESIA',
  },
  {
    vendor_code: '253337',
    company_name: 'PT.ATEJA KAWASHIMA AUTOTEX',
  },
  {
    vendor_code: '253338',
    company_name: 'PT.SINAR SUMINOE INDONESIA',
  },
  {
    vendor_code: '253339',
    company_name: 'PT.SUMINOE SURYA TECHNO',
  },
  {
    vendor_code: '253341',
    company_name: 'PT.NEUBORN MEDIA',
  },
  {
    vendor_code: '253342',
    company_name: 'ABP INDUCTION LIMITED',
  },
  {
    vendor_code: '253343',
    company_name: 'PT.BSI GROUP INDONESIA',
  },
  {
    vendor_code: '253344',
    company_name: 'BASNAKIR JAHRI',
  },
  {
    vendor_code: '253345',
    company_name: 'JHONY MUCHTAR',
  },
  {
    vendor_code: '253346',
    company_name: 'PT.CITRA MEGAH SELECOMINDO',
  },
  {
    vendor_code: '253347',
    company_name: 'PT.SENTRA SUKSESTAMA SENTOSA',
  },
  {
    vendor_code: '253350',
    company_name: 'HARRIS HOTEL & CONVENTIONS BEKASI',
  },
  {
    vendor_code: '253352',
    company_name: 'PT.FERRO SERVITA',
  },
  {
    vendor_code: '253353',
    company_name: 'PT.BEDIKHA SERVISTAMA PRAKARSA',
  },
  {
    vendor_code: '253354',
    company_name: 'PT.YAMATO INDONESIA',
  },
  {
    vendor_code: '253355',
    company_name: 'GITONOV PHOTOGRAPHY',
  },
  {
    vendor_code: '253356',
    company_name: 'PT.NUMEDIA SISTEM',
  },
  {
    vendor_code: '253357',
    company_name: 'PT.NEDERMAN INDONESIA',
  },
  {
    vendor_code: '253358',
    company_name: 'PT.YAMASOJI INDONESIA',
  },
  {
    vendor_code: '253361',
    company_name: 'GITONOV PHOTOGRAPHY',
  },
  {
    vendor_code: '253363',
    company_name: 'PT.INDOMOBIL PRIMA NIAGA',
  },
  {
    vendor_code: '253364',
    company_name: 'INDOONE CITRA ABADI.PT',
  },
  {
    vendor_code: '253365',
    company_name: 'PT.GAMA INTI WAHANA',
  },
  {
    vendor_code: '253366',
    company_name: 'PT.SYNCRUM LOGISTICS',
  },
  {
    vendor_code: '253368',
    company_name: 'RS.HERMINA GALAXY',
  },
  {
    vendor_code: '253369',
    company_name: 'MRCCC SILOAM HOSPITALS',
  },
  {
    vendor_code: '253371',
    company_name: 'SILOAM HOSPITAL PURWAKARTA',
  },
  {
    vendor_code: '253372',
    company_name: 'PT.GRIYA INTERINDO ABADI',
  },
  {
    vendor_code: '253373',
    company_name: 'RS.LIRA MEDIKA',
  },
  {
    vendor_code: '253375',
    company_name: 'PT.IMAJI PRAMITRA UTAMA',
  },
  {
    vendor_code: '253377',
    company_name: 'PT.TOYOTA ENTERPRISE INDONESIA',
  },
  {
    vendor_code: '253378',
    company_name: 'PT.INDOCATER',
  },
  {
    vendor_code: '253379',
    company_name: 'PT.SRIBOGA BAKERIES INTEGRA',
  },
  {
    vendor_code: '253382',
    company_name: 'PT.CYBERTREND INTRABUANA',
  },
  {
    vendor_code: '253383',
    company_name: 'PT.KUMARANG MITRA SELARAS',
  },
  {
    vendor_code: '253385',
    company_name: 'PT.AUTO SUKSES PERKASA',
  },
  {
    vendor_code: '253386',
    company_name: 'UMETOKU INDONESIA PT.',
  },
  {
    vendor_code: '253387',
    company_name: 'PT.TTL RESIDENCES',
  },
  {
    vendor_code: '253388',
    company_name: 'PT.MULIA INTANLESTARI (HOTEL MULIA)',
  },
  {
    vendor_code: '253389',
    company_name: 'RSU.BUNDA MARGONDA',
  },
  {
    vendor_code: '253391',
    company_name: 'RSIA HERMINA CIPUTAT',
  },
  {
    vendor_code: '253392',
    company_name: 'PT.TIRTA NIRMALA',
  },
  {
    vendor_code: '253393',
    company_name: 'CV.KEMBAR MANDIRI',
  },
  {
    vendor_code: '253394',
    company_name: 'TOKOTON MEIWA INDONESIA',
  },
  {
    vendor_code: '253395',
    company_name: 'TOYO PRESISI INDONESIA',
  },
  {
    vendor_code: '253396',
    company_name: 'METTAPLASTINDO',
  },
  {
    vendor_code: '253398',
    company_name: 'JATIMAS JEWELLERY',
  },
  {
    vendor_code: '253399',
    company_name: 'PT.EKATAMA CIPTANI PERSADA',
  },
  {
    vendor_code: '253401',
    company_name: 'NEXUS THERMAL TECHNOLOGY PT.',
  },
  {
    vendor_code: '253402',
    company_name: 'PT.IKITECH PRECISION GRINDING',
  },
  {
    vendor_code: '253403',
    company_name: 'SINAR GLOBAL TEHNIK PT.',
  },
  {
    vendor_code: '253404',
    company_name: 'SENTRA MEDIKA CIBINONG',
  },
  {
    vendor_code: '253405',
    company_name: 'RS.BUNDA ALIYAH',
  },
  {
    vendor_code: '253407',
    company_name: 'PT.JASA PATRA UTAMA',
  },
  {
    vendor_code: '253408',
    company_name: 'TSUBACO INDONESIA PT.',
  },
  {
    vendor_code: '253409',
    company_name: 'PT MSIG LIFE INSURANCE INDONESIA',
  },
  {
    vendor_code: '253410',
    company_name: 'PT.TOYOTA INSURANCE BROKER INDONESI',
  },
  {
    vendor_code: '253411',
    company_name: 'PT.ARIYA MITRA SELARAS',
  },
  {
    vendor_code: '253412',
    company_name: 'PT.BHINEKA CIPTABAHANA PURA',
  },
  {
    vendor_code: '253413',
    company_name: 'PT.CARDIG ANUGRAH SARANA CATERING',
  },
  {
    vendor_code: '253414',
    company_name: 'PT.WAHANA MANDIRI SYDRATAMA',
  },
  {
    vendor_code: '253415',
    company_name: 'JAKARTA KOKOKU INTECH',
  },
  {
    vendor_code: '253416',
    company_name: 'PT.BRIDGESTONE ASTRA INDONESIA',
  },
  {
    vendor_code: '253417',
    company_name: 'PT.360 TEKNOLOGI INDONESIA',
  },
  {
    vendor_code: '253418',
    company_name: 'PT. KONSULTAN UTAMA EKSPOR IMPOR IN',
  },
  {
    vendor_code: '253419',
    company_name: 'INDUCTOTHERM INDONESIA PT.',
  },
  {
    vendor_code: '253420',
    company_name: 'PT.FINE SINTER INDONESIA',
  },
  {
    vendor_code: '253421',
    company_name: 'BERKAH LOGAM MAKMUR PT.',
  },
  {
    vendor_code: '253422',
    company_name: 'PT.DGM INDONESIA',
  },
  {
    vendor_code: '253423',
    company_name: 'PT.DHL GLOBAL FORWARDING INDONESIA',
  },
  {
    vendor_code: '253425',
    company_name: 'PT.INDONESIA KENDARAAN TERMINAL',
  },
  {
    vendor_code: '253426',
    company_name: 'PT.YUTAKA ROBOT SYSTEMS INDONESIA',
  },
  {
    vendor_code: '253427',
    company_name: 'PT.LESTARI SENTOSA',
  },
  {
    vendor_code: '253428',
    company_name: 'EUREKA DESIGN INDONESIA PT.',
  },
  {
    vendor_code: '253430',
    company_name: 'PT.PERUSAHAAN GAS NEGARA PLANT 3',
  },
  {
    vendor_code: '253431',
    company_name: 'TELKOM ENTERPRISE BANDUNG',
  },
  {
    vendor_code: '253432',
    company_name: 'YAYASAN TOYOTA INDONESIA',
  },
  {
    vendor_code: '253433',
    company_name: 'PT.KANEMITSU SGS INDONESIA',
  },
  {
    vendor_code: '253434',
    company_name: 'ASOSIASI PERUSAHAAN JALUR PRIORITAS',
  },
  {
    vendor_code: '253435',
    company_name: 'PT.MODERN DATA SOLUSI',
  },
  {
    vendor_code: '253436',
    company_name: 'PT.IRON BIRD TRANSPORT',
  },
  {
    vendor_code: '253437',
    company_name: 'PT. INDONESIA PUTRA MAKMUR',
  },
  {
    vendor_code: '253438',
    company_name: 'PT.AKITA PRIMA MOBILINDO',
  },
  {
    vendor_code: '253439',
    company_name: 'PT.DYANDRA COMMUNICATION',
  },
  {
    vendor_code: '253440',
    company_name: 'DAIICHI MANDIRI AUTOMATION PT.',
  },
  {
    vendor_code: '253441',
    company_name: 'TELKOMSEL',
  },
  {
    vendor_code: '253442',
    company_name: 'ASTRA INTERNATIONAL TBK',
  },
  {
    vendor_code: '253443',
    company_name: 'PT.INABATA INDONESIA',
  },
  {
    vendor_code: '253444',
    company_name: 'SEKISUI PLASTICS INDONESIA PT.',
  },
  {
    vendor_code: '253445',
    company_name: 'AMASINDO BINTANG CEMERLANG PT.',
  },
  {
    vendor_code: '253446',
    company_name: 'CV.AKSEN KARYA NUSA',
  },
  {
    vendor_code: '253448',
    company_name: 'PT.BHUMI MAHARDIKA JAYA',
  },
  {
    vendor_code: '253449',
    company_name: 'PT.SEKISUI INDONESIA',
  },
  {
    vendor_code: '253450',
    company_name: 'TEIKURO ENGINEERING INDONESIA PT.',
  },
  {
    vendor_code: '253451',
    company_name: 'CAHAYA SUKSES MANDIRI PT.',
  },
  {
    vendor_code: '253452',
    company_name: 'PT.HARJO MUKTI KENCANA',
  },
  {
    vendor_code: '253453',
    company_name: 'PT.VELASTO INDONESIA',
  },
  {
    vendor_code: '253455',
    company_name: 'PT.SINAR KHARISMA MITRA AGUNG',
  },
  {
    vendor_code: '253456',
    company_name: 'PT.PANCA KARYA UTAMA INDONESIA',
  },
  {
    vendor_code: '253457',
    company_name: 'PT ASTRA DAIHATSU MOTOR',
  },
  {
    vendor_code: '253458',
    company_name: 'PT.SINAR MUTIARA CAKRABUANA',
  },
  {
    vendor_code: '253459',
    company_name: 'PT.LINDE INDONESIA',
  },
  {
    vendor_code: '253460',
    company_name: 'PT.DITA UTAMA CITA MANDIRI',
  },
  {
    vendor_code: '253461',
    company_name: 'CV. SABANJAYA',
  },
  {
    vendor_code: '253462',
    company_name: 'MERCURE HOTEL KARAWANG',
  },
  {
    vendor_code: '253463',
    company_name: 'PT. ACE HARDWARE INDONESIA TBK',
  },
  {
    vendor_code: '253464',
    company_name: 'PT. HOME CENTER INDONESIA',
  },
  {
    vendor_code: '253465',
    company_name: 'PT. ZEUS KIMIATAMA INDONESIA',
  },
  {
    vendor_code: '253466',
    company_name: 'PT. RADIANT JAYA BERSAMA',
  },
  {
    vendor_code: '253469',
    company_name: 'PT.TEMARU ENGINEERING INDONESIA',
  },
  {
    vendor_code: '253470',
    company_name: 'PT. SAMUDRA PERKASA MACHINERY',
  },
  {
    vendor_code: '253471',
    company_name: 'PT. INTERARTS GRAHA SELARAS',
  },
  {
    vendor_code: '253472',
    company_name: 'PT.GEO MANDIRI KREASI',
  },
  {
    vendor_code: '253473',
    company_name: 'PT.MULTI METALINDO MURNI',
  },
  {
    vendor_code: '253474',
    company_name: 'PT. UPAYA RIKSA PATRA',
  },
  {
    vendor_code: '253475',
    company_name: 'SMARZ TRANSLATION',
  },
  {
    vendor_code: '253477',
    company_name: 'PT.SECURINDO PACKATAMA INDONESIA',
  },
  {
    vendor_code: '253478',
    company_name: 'PT.UNITED AUTOMOBIL SEMBILANPULUH',
  },
  {
    vendor_code: '253480',
    company_name: 'PT. COMBI LOGISTIC INDONESIA',
  },
  {
    vendor_code: '253481',
    company_name: 'NIPPON EXPRESS INDONESIA',
  },
  {
    vendor_code: '253482',
    company_name: 'PT. DLM RESTO',
  },
  {
    vendor_code: '253483',
    company_name: 'PT. SINERGI SAHABAT BERDIKARI',
  },
  {
    vendor_code: '253484',
    company_name: 'PT.LYRA MEDIA PRODUCTIONS',
  },
  {
    vendor_code: '253485',
    company_name: 'PT.IZI GLOBAL SOLUSI',
  },
  {
    vendor_code: '253486',
    company_name: 'CV.KURNIA BOGA ABADI',
  },
  {
    vendor_code: '253487',
    company_name: 'PT.OCEAN NETWORK EXPRESS INDONESIA',
  },
  {
    vendor_code: '253489',
    company_name: 'PT. EMMIKA CAHAYA BAKTI PERTIWI',
  },
  {
    vendor_code: '253490',
    company_name: 'PT.DENSO TEN AVE INDONESIA',
  },
  {
    vendor_code: '253491',
    company_name: 'PT.ANEKA TAMBANG',
  },
  {
    vendor_code: '253493',
    company_name: 'PT. CAREFASTINDO',
  },
  {
    vendor_code: '253494',
    company_name: 'PT.RAISHA MUDA MANDIRI',
  },
  {
    vendor_code: '253495',
    company_name: 'PT.MUSTIKA CITRA RASA',
  },
  {
    vendor_code: '253496',
    company_name: 'PT.MUSTIKA CITRA RASA',
  },
  {
    vendor_code: '253497',
    company_name: 'PT. ASTRIDO JAYA MOBILINDO',
  },
  {
    vendor_code: '253498',
    company_name: 'PT.AUTOPLASTIK INDONESIA',
  },
  {
    vendor_code: '253499',
    company_name: 'PT. GRAB TEKNOLOGI INDONESIA',
  },
  {
    vendor_code: '253500',
    company_name: 'PT.PANORAMA JTB TOURS INDONESIA',
  },
  {
    vendor_code: '253501',
    company_name: 'PT. DWI DAYA WORLD WIDE',
  },
  {
    vendor_code: '253502',
    company_name: 'PT. ALUMINDO ALLOY ABADI',
  },
  {
    vendor_code: '253504',
    company_name: 'PT. ITOCHU INDONESIA',
  },
  {
    vendor_code: '253506',
    company_name: 'PT.MITSUI KINZOKU ACT INDONESIA',
  },
  {
    vendor_code: '253507',
    company_name: 'PT. DENAPELLA LESTARI',
  },
  {
    vendor_code: '253509',
    company_name: 'PT.MATRIX MITRA TELEKOMUNIKASI',
  },
  {
    vendor_code: '253510',
    company_name: 'PT. MIRA PUNCAK KEMUNING',
  },
  {
    vendor_code: '253511',
    company_name: 'PT. PERMATA PRIMA HUSADA',
  },
  {
    vendor_code: '253512',
    company_name: 'PT.MEDIA PRATAMA STIKER',
  },
  {
    vendor_code: '253513',
    company_name: 'PT. JOYSON SAFETY SYSTEMS INDONESIA',
  },
  {
    vendor_code: '253514',
    company_name: 'PT. TATA MANDIRI DAERAH LIPPO KARAW',
  },
  {
    vendor_code: '253515',
    company_name: 'SINAR PUTRA METALINDO PT.',
  },
  {
    vendor_code: '253516',
    company_name: 'TOYOTA EQUIPMENT & FACILITY CLUB',
  },
  {
    vendor_code: '253517',
    company_name: 'KOPERASI INDUSTRI BATUR JAYA',
  },
  {
    vendor_code: '253518',
    company_name: 'PT. SOLUSI KREATIF IDEAL',
  },
  {
    vendor_code: '253520',
    company_name: 'PT. CABININDO PUTRA',
  },
  {
    vendor_code: '253521',
    company_name: 'DAI SABISU INDONESIA PT.',
  },
  {
    vendor_code: '253522',
    company_name: 'PT. USUI INTERNATIONAL INDONESIA',
  },
  {
    vendor_code: '253524',
    company_name: 'PT. ANDALAN SOLUSI INOVASI',
  },
  {
    vendor_code: '253525',
    company_name: 'PPRS PERMATA KUNINGAN',
  },
  {
    vendor_code: '253526',
    company_name: 'PT.SECURINDO PACKATAMA INDONESIA',
  },
  {
    vendor_code: '253527',
    company_name: 'PT. K LINE MOBARU DIAMOND INDONES',
  },
  {
    vendor_code: '253528',
    company_name: 'PT TOYOTA LOGISTRA PINGLOKA INDONE',
  },
  {
    vendor_code: '253529',
    company_name: 'PARANI ARTAMANDIRI',
  },
  {
    vendor_code: '253530',
    company_name: 'PT. MARUGO RUBBER INDONESIA',
  },
  {
    vendor_code: '253532',
    company_name: 'PT. AGUNG RAYA',
  },
  {
    vendor_code: '253533',
    company_name: 'PT.DUA DARA MANDIRI',
  },
  {
    vendor_code: '253534',
    company_name: 'PT.ADIMAS NUSANTARA LOGISTIK',
  },
  {
    vendor_code: '253535',
    company_name: 'PT.TRANS PRIMA SOLUSINDO',
  },
  {
    vendor_code: '253536',
    company_name: 'PT.SIGAP GARDA PRATAMA',
  },
  {
    vendor_code: '253537',
    company_name: 'PT.KARYA KITA JAYA',
  },
  {
    vendor_code: '253538',
    company_name: 'PT. TRANS PUTRA EXIMINDO',
  },
  {
    vendor_code: '253539',
    company_name: 'PT.MENTARI JAYA RAYA',
  },
  {
    vendor_code: '253540',
    company_name: 'PT. GALUH INTI BAHARI',
  },
  {
    vendor_code: '253541',
    company_name: 'PT. MULTI ELEKTRIK SEJAHTRINDO',
  },
  {
    vendor_code: '253542',
    company_name: 'PT.ALYA MAHARANI CORPORA',
  },
  {
    vendor_code: '253543',
    company_name: 'ANTAM MEDIKA RS.',
  },
  {
    vendor_code: '253544',
    company_name: 'PT.HADI WIJAYA PERKASA',
  },
  {
    vendor_code: '253545',
    company_name: 'PT.NOK INDONESIA SALES',
  },
  {
    vendor_code: '253546',
    company_name: 'PT. INTERADIAN SISTEMA INDONESIA',
  },
  {
    vendor_code: '253547',
    company_name: 'PT. REKADAYA MANDIRI HUTAMA',
  },
  {
    vendor_code: '253549',
    company_name: 'PT.POLYTAMA SYNTHETICINDO',
  },
  {
    vendor_code: '253551',
    company_name: 'PT.AJI ROHMAN MANDIRI',
  },
  {
    vendor_code: '253552',
    company_name: 'PT.RYAN KATERING (KARAWANG)',
  },
  {
    vendor_code: '253553',
    company_name: 'PT.RYAN KATERING (JAKARTA)',
  },
  {
    vendor_code: '253561',
    company_name: 'PT.MURNI CAHAYA PRATAMA',
  },
  {
    vendor_code: '2536',
    company_name: 'PT.SERVO FIRE INDONESIA',
  },
  {
    vendor_code: '2537',
    company_name: 'PT.ATEJA KAWASHIMA AUTOTEX',
  },
  {
    vendor_code: '2538',
    company_name: 'PT.SINAR SUMINOE INDONESIA',
  },
  {
    vendor_code: '2539',
    company_name: 'PT.SUMINOE SURYA TECHNO',
  },
  {
    vendor_code: '2543',
    company_name: 'PT. DHARMESTA SWASTI MANDIRI',
  },
  {
    vendor_code: '2546',
    company_name: 'PT.METALART ASTRA INDONESIA',
  },
  {
    vendor_code: '2564',
    company_name: 'INDOONE CITRA ABADI.PT',
  },
  {
    vendor_code: '3',
    company_name: 'PT. SUGITY CREATIVES',
  },
  {
    vendor_code: '300000',
    company_name: 'KUOZUI MOTORS LTD.',
  },
  {
    vendor_code: '300001',
    company_name: 'TOYOTA MOTOR CORPORATION',
  },
  {
    vendor_code: '300002',
    company_name: 'UMW TOYOTA MOTOR SDN. BHD.',
  },
  {
    vendor_code: '300007',
    company_name: 'TOYOTA MOTOR ASIA PACIFIC PTE LTD',
  },
  {
    vendor_code: '300008',
    company_name: 'TOYOTA MOTOR CORPORATION AUSTRALIA',
  },
  {
    vendor_code: '300010',
    company_name: 'TOYOTA MOTOR THAILAND CO.',
  },
  {
    vendor_code: '300013',
    company_name: 'TOYOTA TSUSHO SHANGHAI CO LTD.',
  },
  {
    vendor_code: '300014',
    company_name: 'TOYOTA TSUSHO KOREA CORP.',
  },
  {
    vendor_code: '300015',
    company_name: 'TOYOTA MOTOR CORPORATION BAHRAIN',
  },
  {
    vendor_code: '300018',
    company_name: 'DAIHATSU MOTOR CO.',
  },
  {
    vendor_code: '300019',
    company_name: 'TOYOTA MOTOR VIETNAM CO.',
  },
  {
    vendor_code: '3007',
    company_name: 'TOYOTA MOTOR ASIA PACIFIC PTE LTD',
  },
  {
    vendor_code: '3013',
    company_name: 'TOYOTA TSUSHO SHANGHAI CO LTD.',
  },
  {
    vendor_code: '3015',
    company_name: 'SUMITOMO CORPORATION',
  },
  {
    vendor_code: '3017',
    company_name: 'TOYOTA TSUSHO CORPORATION',
  },
  {
    vendor_code: '3018',
    company_name: 'CHEN TAI FONG CO LTD.',
  },
  {
    vendor_code: '3019',
    company_name: 'TOYOTA TSUSHO KOREA CORP.',
  },
  {
    vendor_code: '3020',
    company_name: 'TOYOTA TSUSHO CORPORATION',
  },
  {
    vendor_code: '3040',
    company_name: 'TOYOTA TSUSHO (THAILAND) CO.',
  },
  {
    vendor_code: '350000',
    company_name: 'ASURANSI MITSUI SUMITOMO INDONESIA',
  },
  {
    vendor_code: '350006',
    company_name: 'TAKEUCHI',
  },
  {
    vendor_code: '350007',
    company_name: 'TOYOTA TSUSHO CORPORATION',
  },
  {
    vendor_code: '350009',
    company_name: 'DELCO AUTOPART PTE LTD',
  },
  {
    vendor_code: '350011',
    company_name: 'HORIBA',
  },
  {
    vendor_code: '350014',
    company_name: 'SHIN NIPPON KOKI CO LTD',
  },
  {
    vendor_code: '350019',
    company_name: 'TOYOTA TSUSHO KOREA CORP.',
  },
  {
    vendor_code: '350020',
    company_name: 'TOYOTA TSUSHO CORPORATION',
  },
  {
    vendor_code: '4',
    company_name: 'GEMALA KEMPA DAYA',
  },
  {
    vendor_code: '400000',
    company_name: 'TOYOTA ENTERPRISE INC',
  },
  {
    vendor_code: '45',
    company_name: 'PT ASTRA DAIHATSU MOTOR',
  },
  {
    vendor_code: '450003',
    company_name: 'IDAKA INDONESIA',
  },
  {
    vendor_code: '450007',
    company_name: 'TAKEUCHI',
  },
  {
    vendor_code: '450008',
    company_name: 'TOYOTA TSUSHO CORPORATION',
  },
  {
    vendor_code: '450010',
    company_name: 'HORIBA',
  },
  {
    vendor_code: '450014',
    company_name: 'GOLDEN RAMA',
  },
  {
    vendor_code: '450017',
    company_name: 'TOYOTA MOTOR CORPORATION AUSTRALIA',
  },
  {
    vendor_code: '450018',
    company_name: 'TECHNO MAEZAWA CO . LTD',
  },
  {
    vendor_code: '450024',
    company_name: 'SINTO INDONESIA',
  },
  {
    vendor_code: '450026',
    company_name: 'CHUBU KONETSU IND CO LTD',
  },
  {
    vendor_code: '450030',
    company_name: 'TOYOTA MOTOR CORPORATION',
  },
  {
    vendor_code: '450032',
    company_name: 'TOKYO BOEKI TECHNOSYSTEM LTD.',
  },
  {
    vendor_code: '450033',
    company_name: 'SHINWA INTEC CO.',
  },
  {
    vendor_code: '450034',
    company_name: 'SUGIMURA CHEMICAL INDONESIA PT.',
  },
  {
    vendor_code: '450040',
    company_name: 'TOYOTA TSUSHO (THAILAND) CO.',
  },
  {
    vendor_code: '450041',
    company_name: 'SHINWA CO. LTD',
  },
  {
    vendor_code: '450046',
    company_name: 'TAKATSU MFG (THAILAND) CO.',
  },
  {
    vendor_code: '450048',
    company_name: 'ASIATEC CORPORATION',
  },
  {
    vendor_code: '450050',
    company_name: 'KIMURA UNITY CO.',
  },
  {
    vendor_code: '450051',
    company_name: 'DAIFUKU CO.',
  },
  {
    vendor_code: '450053',
    company_name: 'PT. SOJITZ INDONESIA',
  },
  {
    vendor_code: '450054',
    company_name: 'TEIKURO (THAILAND) CO.',
  },
  {
    vendor_code: '450055',
    company_name: 'NGK INSULATORS',
  },
  {
    vendor_code: '450060',
    company_name: 'KUSANO CO',
  },
  {
    vendor_code: '450065',
    company_name: 'JTEKT CORPORATION',
  },
  {
    vendor_code: '450066',
    company_name: 'NIPPON METAL CO. LTD',
  },
  {
    vendor_code: '450067',
    company_name: 'YASKAWA ELECTRIC INDONESIA',
  },
  {
    vendor_code: '450069',
    company_name: 'PT. KUDA PRIMA',
  },
  {
    vendor_code: '450071',
    company_name: 'SOJITZ MACHINERY CORP.',
  },
  {
    vendor_code: '450072',
    company_name: 'TOYOTA AUTO BODY CO.',
  },
  {
    vendor_code: '46',
    company_name: 'NUSA KEIHIN INDONESIA',
  },
  {
    vendor_code: '47',
    company_name: 'MEKAR ARMADA JAYA (TAMBUN)',
  },
  {
    vendor_code: '48',
    company_name: 'PATEC PRESISI ENGINEERING',
  },
  {
    vendor_code: '5',
    company_name: 'PT ASTRA DAIHATSU MOTOR',
  },
  {
    vendor_code: '5000',
    company_name: 'NUSA TOYOTETSU CORP.',
  },
  {
    vendor_code: '5001',
    company_name: 'PAMINDO TIGA T.',
  },
  {
    vendor_code: '5002',
    company_name: 'ASALTA MANDIRI AGUNG',
  },
  {
    vendor_code: '5003',
    company_name: 'METINDO ERA SAKTI',
  },
  {
    vendor_code: '5004',
    company_name: 'GUNA SENAPUTRA SEJAHTERA',
  },
  {
    vendor_code: '5005',
    company_name: 'AT INDONESIA',
  },
  {
    vendor_code: '5006',
    company_name: 'NUSAHADI CITRAHARMONIS',
  },
  {
    vendor_code: '5007',
    company_name: 'SARI TAKAGI ELOK PRODUK',
  },
  {
    vendor_code: '5008',
    company_name: 'KOMPONEN FUTABA NUSAPERSADA',
  },
  {
    vendor_code: '5009',
    company_name: 'TOYOTA BOSHOKU INDONESIA',
  },
  {
    vendor_code: '5010',
    company_name: '3 M INDONESIA',
  },
  {
    vendor_code: '5011',
    company_name: 'AISIN INDONESIA',
  },
  {
    vendor_code: '5012',
    company_name: 'ANUGRAH VALOVA ELECTRINDO',
  },
  {
    vendor_code: '5014',
    company_name: 'ARGAPURA TRADING COMPANY',
  },
  {
    vendor_code: '5015',
    company_name: 'ASAHIMAS FLAT GLASS',
  },
  {
    vendor_code: '5017',
    company_name: 'BANDO INDONESIA',
  },
  {
    vendor_code: '5018',
    company_name: 'BRIDGESTONE TIRE INDONESIA',
  },
  {
    vendor_code: '5019',
    company_name: 'CATURINDO AGUNGJAYA RUBBER',
  },
  {
    vendor_code: '5020',
    company_name: 'CHUHATSU INDONESIA',
  },
  {
    vendor_code: '5021',
    company_name: 'PT. DASA WINDU AGUNG',
  },
  {
    vendor_code: '5022',
    company_name: 'DENSO SALES INDONESIA',
  },
  {
    vendor_code: '5024',
    company_name: 'AUTOCOMP SYSTEMS INDONESIA',
  },
  {
    vendor_code: '5025',
    company_name: 'ENKEI INDONESIA',
  },
  {
    vendor_code: '5026',
    company_name: 'PT GS BATTERY',
  },
  {
    vendor_code: '5027',
    company_name: 'GAJAH TUNGGAL TBK',
  },
  {
    vendor_code: '5028',
    company_name: 'GARUDA METAL UTAMA',
  },
  {
    vendor_code: '5029',
    company_name: 'GARUDA METALINDO',
  },
  {
    vendor_code: '5030',
    company_name: 'GEMA SUARA ADHITAMA',
  },
  {
    vendor_code: '5032',
    company_name: 'HILEX INDONESIA',
  },
  {
    vendor_code: '5033',
    company_name: 'ICHIKOH INDONESIA',
  },
  {
    vendor_code: '5034',
    company_name: 'INDOCIPTA HASTA PERKASA',
  },
  {
    vendor_code: '5035',
    company_name: 'INDOKARLO PERKASA',
  },
  {
    vendor_code: '5037',
    company_name: 'INDOSAFETY SENTOSA INDUSTRY',
  },
  {
    vendor_code: '5038',
    company_name: 'P.T.AISAN NASMOCO INDUSTRI',
  },
  {
    vendor_code: '5039',
    company_name: 'PT. FTS AUTOMOTIVE INDONESIA',
  },
  {
    vendor_code: '5040',
    company_name: 'AUTOLIV INDONESIA',
  },
  {
    vendor_code: '5044',
    company_name: 'INKOASKU',
  },
  {
    vendor_code: '5045',
    company_name: 'EXEDY MANUFACTURING INDONESIA',
  },
  {
    vendor_code: '5048',
    company_name: 'KAYABA INDONESIA',
  },
  {
    vendor_code: '5049',
    company_name: 'FUKOKU INDONESIA',
  },
  {
    vendor_code: '5054',
    company_name: 'IRC INOAC INDONESIA (RUBBER)',
  },
  {
    vendor_code: '5055',
    company_name: 'PT. INDONESIA STANLEY ELECTRIC',
  },
  {
    vendor_code: '5058',
    company_name: 'KYORAKU B.IND',
  },
  {
    vendor_code: '5059',
    company_name: 'NSK INDONESIA',
  },
  {
    vendor_code: '5060',
    company_name: 'NT PISTON RING INDONESIA',
  },
  {
    vendor_code: '5062',
    company_name: 'MENARA TERUS MAKMUR',
  },
  {
    vendor_code: '5064',
    company_name: 'MESHINDO ALLOY WHEEL',
  },
  {
    vendor_code: '5065',
    company_name: 'SANOH INDONESIA',
  },
  {
    vendor_code: '5066',
    company_name: 'SEIWA INDONESIA',
  },
  {
    vendor_code: '5067',
    company_name: 'TAIHO NUSANTARA',
  },
  {
    vendor_code: '5069',
    company_name: 'MUARATEWEH SPRING',
  },
  {
    vendor_code: '5073',
    company_name: 'ASTRA NIPPON GASKET INDONESIA',
  },
  {
    vendor_code: '5074',
    company_name: 'NICHIAS SUNI JAYA',
  },
  {
    vendor_code: '5075',
    company_name: 'OTICS INDONESIA',
  },
  {
    vendor_code: '5076',
    company_name: 'PAKARTI RIKEN INDONESIA',
  },
  {
    vendor_code: '5077',
    company_name: 'PAKOAKUINA',
  },
  {
    vendor_code: '5079',
    company_name: 'PUTRA INDONESIA',
  },
  {
    vendor_code: '5080',
    company_name: 'SEKISO INDUSTRIES IND.',
  },
  {
    vendor_code: '5082',
    company_name: 'SUMI INDO WIRING SYSTEMS',
  },
  {
    vendor_code: '5083',
    company_name: 'SUMI RUBBER INDONESIA',
  },
  {
    vendor_code: '5091',
    company_name: 'PT. INOAC POLYTECHNO INDONESIA',
  },
  {
    vendor_code: '5105',
    company_name: 'PT. MINDA ASEAN AUTOMOTIVE',
  },
  {
    vendor_code: '5108',
    company_name: 'PT. AUTOMOTIVE FASTENERS AOYAMA',
  },
  {
    vendor_code: '5112',
    company_name: 'PT.ROBERT BOSCH',
  },
  {
    vendor_code: '5120',
    company_name: 'ANDALAN DUNIA SEMESTA',
  },
  {
    vendor_code: '5136',
    company_name: 'PT.HINO MOTORS MANUFACTURING',
  },
  {
    vendor_code: '5137',
    company_name: 'PT. MULTI KARYA SINARDINAMIIKA',
  },
  {
    vendor_code: '5142',
    company_name: 'AICHI FORGING INDONESIA',
  },
  {
    vendor_code: '5143',
    company_name: 'CENTRAL MOTOR WHEEL INDONESIA',
  },
  {
    vendor_code: '5144',
    company_name: 'PT.MURAKAMI DELLOYD INDONESIA',
  },
  {
    vendor_code: '5145',
    company_name: 'FEDERAL NITTAN INDUSTRIES',
  },
  {
    vendor_code: '5147',
    company_name: 'TG INOAC INDONESIA',
  },
  {
    vendor_code: '5148',
    company_name: 'JAYA VICTORI CEMERLANG',
  },
  {
    vendor_code: '5150',
    company_name: 'NAMICOH INDONESIA COMPONENT',
  },
  {
    vendor_code: '5151',
    company_name: 'SAKURA JAVA INDONESIA',
  },
  {
    vendor_code: '5155',
    company_name: 'TOYODA GOSEI SAFETY SYSTEMS IND',
  },
  {
    vendor_code: '5156',
    company_name: 'YASUNAGA INDONESIA',
  },
  {
    vendor_code: '5157',
    company_name: 'DAIDO METAL INDONESIA',
  },
  {
    vendor_code: '5158',
    company_name: 'NSK INDONESIA',
  },
  {
    vendor_code: '5159',
    company_name: 'ADVICS INDONESIA',
  },
  {
    vendor_code: '5162',
    company_name: 'TOYOTA TSUSHO INDONESIA',
  },
  {
    vendor_code: '5165',
    company_name: 'DENSO SALES INDONESIA',
  },
  {
    vendor_code: '5166',
    company_name: 'JAYA VICTORI CEMERLANG',
  },
  {
    vendor_code: '5171',
    company_name: 'NIPSEA PAINT AND CHEMICALS',
  },
  {
    vendor_code: '5172',
    company_name: 'KANSAI PAINT INDONESIA',
  },
  {
    vendor_code: '5174',
    company_name: 'AUTOCAR INDUSTRI KOMPONEN',
  },
  {
    vendor_code: '5175',
    company_name: 'CHIYODA INTEGRE INDONESIA',
  },
  {
    vendor_code: '5178',
    company_name: 'OCHIAI MENARA INDONESIA',
  },
  {
    vendor_code: '5182',
    company_name: 'PT. ASTRA JUOKU INDONESIA',
  },
  {
    vendor_code: '5200',
    company_name: 'PT. APM ARMADA AUTOPARTS',
  },
  {
    vendor_code: '5207',
    company_name: 'ARMSTRONG INDUSTRI INDONESIA',
  },
  {
    vendor_code: '5211',
    company_name: 'PT.ROBERT BOSCH',
  },
  {
    vendor_code: '5212',
    company_name: 'PT. EXCEL METAL INDUSTRY',
  },
  {
    vendor_code: '5217',
    company_name: 'PT.DENSO TEN AVE INDONESIA',
  },
  {
    vendor_code: '5219',
    company_name: 'PT. KOTOBUKIYA INDO CLASSIC INDUSTR',
  },
  {
    vendor_code: '5224',
    company_name: 'PT. MULTI KARYA SINARDINAMIIKA',
  },
  {
    vendor_code: '5226',
    company_name: 'PT. SANKO GOSEI TECHNOLOGY INDONESI',
  },
  {
    vendor_code: '5237',
    company_name: 'PT.DENSO TEN AVE INDONESIA',
  },
  {
    vendor_code: '5238',
    company_name: 'TAKAGI SARI MULTI UTAMA',
  },
  {
    vendor_code: '5242',
    company_name: 'PT. DHARMA POLIMETAL',
  },
  {
    vendor_code: '5243',
    company_name: 'PT. INGRESS MALINDO VENTURES',
  },
  {
    vendor_code: '5246',
    company_name: 'PT. NOK INDONESIA',
  },
  {
    vendor_code: '5247',
    company_name: 'PT.ITOKIN INDONESIA',
  },
  {
    vendor_code: '5248',
    company_name: 'PT.ART PISTON INDONESIA',
  },
  {
    vendor_code: '5263',
    company_name: 'PT.DIAMOND ELECTRIC INDONESIA',
  },
  {
    vendor_code: '5267',
    company_name: 'PT.VUTEQ INDONESIA',
  },
  {
    vendor_code: '5274',
    company_name: 'PT.SUMIDEN SINTERED COMPONENT INDON',
  },
  {
    vendor_code: '5278',
    company_name: 'PT.KYOWASYNCHRO TECHNOLOGY INDONESI',
  },
  {
    vendor_code: '5286',
    company_name: 'PT.UYEMURA INDONESIA',
  },
  {
    vendor_code: '5287',
    company_name: 'PT.CATALER INDONESIA',
  },
  {
    vendor_code: '5290',
    company_name: 'PT. INDOPRIMA GEMILANG',
  },
  {
    vendor_code: '5300',
    company_name: 'PT. TOKAI RIKA SAFETY INDONESIA',
  },
  {
    vendor_code: '5301',
    company_name: 'PT. INDONESIA KOITO',
  },
  {
    vendor_code: '5302',
    company_name: 'PT. JTEKT INDONESIA',
  },
  {
    vendor_code: '5303',
    company_name: 'PT. JOYSON SAFETY SYSTEMS INDONESIA',
  },
  {
    vendor_code: '5304',
    company_name: 'PT. TOKAI RIKA INDONESIA',
  },
  {
    vendor_code: '5306',
    company_name: 'PT. INGRESS MALINDO VENTURES',
  },
  {
    vendor_code: '5307',
    company_name: 'PT. SETIA GUNA SEJATI',
  },
  {
    vendor_code: '5308',
    company_name: 'PT. GS ELECTECH INDONESIA',
  },
  {
    vendor_code: '5309',
    company_name: 'PT. KOTOBUKIYA INDO CLASSIC INDUSTR',
  },
  {
    vendor_code: '5311',
    company_name: 'PT. SHIROKI INDONESIA',
  },
  {
    vendor_code: '5313',
    company_name: 'PT. TCD ASIA PACIFIC INDONESIA',
  },
  {
    vendor_code: '5315',
    company_name: 'JAKARTA KOKOKU INTECH',
  },
  {
    vendor_code: '5316',
    company_name: 'PT.BRIDGESTONE ASTRA INDONESIA',
  },
  {
    vendor_code: '5317',
    company_name: 'TPR SALES INDONESIA',
  },
  {
    vendor_code: '5319',
    company_name: 'PT.FUJI KINZOKU INDONESIA',
  },
  {
    vendor_code: '5320',
    company_name: 'PT.FINE SINTER INDONESIA',
  },
  {
    vendor_code: '5321',
    company_name: 'YOHZU INDONESIA',
  },
  {
    vendor_code: '5323',
    company_name: 'PT. SUGITY CREATIVES',
  },
  {
    vendor_code: '5327',
    company_name: 'PT.SUGIURA INDONESIA',
  },
  {
    vendor_code: '5328',
    company_name: 'PT. MEIDOH INDONESIA',
  },
  {
    vendor_code: '5329',
    company_name: 'PT. UNICRAFT NAGURA INDONESIA',
  },
  {
    vendor_code: '5333',
    company_name: 'HOWA INDONESIA PT.',
  },
  {
    vendor_code: '5335',
    company_name: 'DINAR MAKMUR PT.',
  },
  {
    vendor_code: '5336',
    company_name: 'KYOKUYO INDUSTRIAL INDONESIA',
  },
  {
    vendor_code: '5337',
    company_name: 'PT.DENSO TEN AVE INDONESIA',
  },
  {
    vendor_code: '5339',
    company_name: 'NIPPON OIL INDONESIA',
  },
  {
    vendor_code: '5345',
    company_name: 'NISHIKAWA KARYA INDONESIA',
  },
  {
    vendor_code: '5346',
    company_name: 'INDONESIA THAI SUMMIT AUTO',
  },
  {
    vendor_code: '5347',
    company_name: 'PT.FURUKAWA AUTOMOTIVE SYSTEMS INDO',
  },
  {
    vendor_code: '5348',
    company_name: 'KOJIMA AUTO TECHNOLOGY INDONESIA PT',
  },
  {
    vendor_code: '5349',
    company_name: 'SAKAE RIKEN INDONESIA PT.',
  },
  {
    vendor_code: '5350',
    company_name: 'DAIKYONISHIKAWA TENMA INDONESIA PT.',
  },
  {
    vendor_code: '5356',
    company_name: 'HANKOOK TIRE INDONESIA',
  },
  {
    vendor_code: '5357',
    company_name: 'PT. TSUCHIYA INDONESIA',
  },
  {
    vendor_code: '5358',
    company_name: 'PT. LA VIDA HERCULON',
  },
  {
    vendor_code: '5359',
    company_name: 'PT. TUFFINDO NITTOKU AUTONEUM',
  },
  {
    vendor_code: '5360',
    company_name: 'HOWA INDONESIA PT.',
  },
  {
    vendor_code: '5362',
    company_name: 'PT. JOYSON SAFETY SYSTEMS INDONESIA',
  },
  {
    vendor_code: '5364',
    company_name: 'PT. DHARMA CONTROLCABLE INDONESIA',
  },
  {
    vendor_code: '5365',
    company_name: 'PT. TOKAI RUBBER INDONESIA',
  },
  {
    vendor_code: '5366',
    company_name: 'PT. TOKAI RUBBER AUTO HOSE INDONESI',
  },
  {
    vendor_code: '5367',
    company_name: 'PT. NIFCO INDONESIA',
  },
  {
    vendor_code: '5368',
    company_name: 'PT. MTAT INDONESIA',
  },
  {
    vendor_code: '5374',
    company_name: 'PT. NAGA ABADI MANDIRI',
  },
  {
    vendor_code: '5375',
    company_name: 'PT. NACHI INDONESIA',
  },
  {
    vendor_code: '5376',
    company_name: 'PT. FUTABA INDUSTRIAL INDONESIA',
  },
  {
    vendor_code: '5385',
    company_name: 'PT.SUMMIT ADYAWINSA INDONESIA',
  },
  {
    vendor_code: '5386',
    company_name: 'PT.SHINTO KOGYO INDONESIA',
  },
  {
    vendor_code: '5387',
    company_name: 'PT. SOMIC INDONESIA',
  },
  {
    vendor_code: '5388',
    company_name: 'PT. MITSUBA INDONESIA PIPE PARTS',
  },
  {
    vendor_code: '5390',
    company_name: 'PT. ASANO GEAR INDONESIA',
  },
  {
    vendor_code: '5395',
    company_name: 'PT. DHARMA POLIMETAL',
  },
  {
    vendor_code: '5396',
    company_name: 'PT. ARAI RUBBER SEAL INDONESIA',
  },
  {
    vendor_code: '5433',
    company_name: 'PT.KANEMITSU SGS INDONESIA',
  },
  {
    vendor_code: '5437',
    company_name: 'TAKAGI SARI MULTI UTAMA',
  },
  {
    vendor_code: '5446',
    company_name: 'CV.AKSEN KARYA NUSA',
  },
  {
    vendor_code: '5453',
    company_name: 'PT.VELASTO INDONESIA',
  },
  {
    vendor_code: '5469',
    company_name: 'NIHON CHEMICAL INDONESIA',
  },
  {
    vendor_code: '5490',
    company_name: 'PT.DENSO TEN AVE INDONESIA',
  },
  {
    vendor_code: '5491',
    company_name: 'TOYO DENSO INDONESIA',
  },
  {
    vendor_code: '5498',
    company_name: 'PT.AUTOPLASTIK INDONESIA',
  },
  {
    vendor_code: '5504',
    company_name: 'PT. ITOCHU INDONESIA',
  },
  {
    vendor_code: '5506',
    company_name: 'PT.MITSUI KINZOKU ACT INDONESIA',
  },
  {
    vendor_code: '5507',
    company_name: 'PT. DENAPELLA LESTARI',
  },
  {
    vendor_code: '5508',
    company_name: 'PT.RESONAC MATERIALS INDONESIA',
  },
  {
    vendor_code: '5513',
    company_name: 'PT. JOYSON SAFETY SYSTEMS INDONESIA',
  },
  {
    vendor_code: '5520',
    company_name: 'PT. CABININDO PUTRA',
  },
  {
    vendor_code: '5522',
    company_name: 'PT. USUI INTERNATIONAL INDONESIA',
  },
  {
    vendor_code: '5530',
    company_name: 'PT. MARUGO RUBBER INDONESIA',
  },
  {
    vendor_code: '5545',
    company_name: 'PT.NOK INDONESIA SALES',
  },
  {
    vendor_code: '5605',
    company_name: 'INDOLOK BAKTI UTAMA',
  },
  {
    vendor_code: '5650',
    company_name: 'IDEMITSU LUBE INDONESIA',
  },
  {
    vendor_code: '5713',
    company_name: 'CHEVRON OIL PRODUCT INDONESIA',
  },
  {
    vendor_code: '5789',
    company_name: 'NITTO MATERIALS INDONESIA',
  },
  {
    vendor_code: '5849',
    company_name: 'SADIKUN NIAGAMAS RAYA',
  },
  {
    vendor_code: '5875',
    company_name: 'CITRA NUGERAH KARYA',
  },
  {
    vendor_code: '5918',
    company_name: 'PT. DAIDO INDONESIA MANUFACTURING',
  },
  {
    vendor_code: '5940',
    company_name: 'TAKAGI SARI MULTI UTAMA',
  },
  {
    vendor_code: '5941',
    company_name: 'TOYO DENSO INDONESIA',
  },
  {
    vendor_code: '5942',
    company_name: 'PT. SANKO GOSEI TECHNOLOGY INDONESI',
  },
  {
    vendor_code: '7',
    company_name: 'ASTRA OTOPARTS TBK',
  },
  {
    vendor_code: '8',
    company_name: 'ASTRA OTOPARTS Tbk (METAL)',
  },
  {
    vendor_code: 'T001',
    company_name: 'AKEBONO BRAKE ASTRA INDONESIA',
  },
  {
    vendor_code: 'T002',
    company_name: 'AUTO ANTENNA MANUFACTURING',
  },
  {
    vendor_code: 'T003',
    company_name: 'APM ARMADA SUSPENSION',
  },
  {
    vendor_code: 'T004',
    company_name: 'ASAHI DENSO INDONESIA',
  },
  {
    vendor_code: 'T005',
    company_name: 'AFIXKOGYO INDONESIA',
  },
  {
    vendor_code: 'T006',
    company_name: 'ASIA HODA INDONESIA',
  },
  {
    vendor_code: 'T007',
    company_name: 'ADYAWINSA STAMPING INDUSTRIES',
  },
  {
    vendor_code: 'T008',
    company_name: 'ATSUMITEC INDONESIA',
  },
  {
    vendor_code: 'T009',
    company_name: 'AKASHI WAHANA INDONESIA',
  },
  {
    vendor_code: 'T010',
    company_name: 'PT. CABININDO PUTRA',
  },
  {
    vendor_code: 'T011',
    company_name: 'CATURINDO AGUNGJAYA RUBBER',
  },
  {
    vendor_code: 'T012',
    company_name: 'CENTURY BATTERIES INDONESIA',
  },
  {
    vendor_code: 'T013',
    company_name: 'CHEMCO',
  },
  {
    vendor_code: 'T014',
    company_name: 'PT. AUTOMOTIVE FASTENERS AOYAMA',
  },
  {
    vendor_code: 'T015',
    company_name: 'PT.DELA CEMARA INDAH',
  },
  {
    vendor_code: 'T016',
    company_name: 'DHARMA ELECTRINDO MANUFACTURING',
  },
  {
    vendor_code: 'T021',
    company_name: 'PT. EKAMITRA JAYATAMA',
  },
  {
    vendor_code: 'T022',
    company_name: 'FUJI SEAT INDONESIA',
  },
  {
    vendor_code: 'T023',
    company_name: 'FUJI TECHNICA INDONESIA',
  },
  {
    vendor_code: 'T024',
    company_name: 'GRAND SURYA TECHNO',
  },
  {
    vendor_code: 'T026',
    company_name: 'PT.INTI PANTJA PRESS INDUSTRI',
  },
  {
    vendor_code: 'T027',
    company_name: 'INDOSAFETY SENTOSA INDUSTRY',
  },
  {
    vendor_code: 'T029',
    company_name: 'KALIBARU',
  },
  {
    vendor_code: 'T030',
    company_name: 'KIRIU INDONESIA',
  },
  {
    vendor_code: 'T031',
    company_name: 'KARYA PUTRA SANGKURIANG',
  },
  {
    vendor_code: 'T032',
    company_name: 'KASAI TECK SEE INDONESIA',
  },
  {
    vendor_code: 'T033',
    company_name: 'KYODA MAS MULIA',
  },
  {
    vendor_code: 'T034',
    company_name: 'MEKAR ARMADA JAYA (TAMBUN)',
  },
  {
    vendor_code: 'T035',
    company_name: 'PT. MARUGO RUBBER INDONESIA',
  },
  {
    vendor_code: 'T037',
    company_name: 'MITSUBISHI ELECTRIC AUTOMOTIVE INDO',
  },
  {
    vendor_code: 'T038',
    company_name: 'PT.MITSUI KINZOKU ACT INDONESIA',
  },
  {
    vendor_code: 'T039',
    company_name: 'MEGAH NUSANTARA PERKASA',
  },
  {
    vendor_code: 'T040',
    company_name: 'MORNCO INDONESIA',
  },
  {
    vendor_code: 'T042',
    company_name: 'MANDIRI PANCA PRIMA',
  },
  {
    vendor_code: 'T043',
    company_name: 'PT.MAXFOS PRIMA',
  },
  {
    vendor_code: 'T044',
    company_name: 'MAH SING INDONESIA',
  },
  {
    vendor_code: 'T045',
    company_name: 'PT.MULIA INDUSTRINDO TBK',
  },
  {
    vendor_code: 'T046',
    company_name: 'NITTO ALAM',
  },
  {
    vendor_code: 'T048',
    company_name: 'NICHIRIN INDONESIA',
  },
  {
    vendor_code: 'T049',
    company_name: 'NISSEN CHEMITEC INDONESIA',
  },
  {
    vendor_code: 'T051',
    company_name: 'PIOLAX INDONESIA',
  },
  {
    vendor_code: 'T053',
    company_name: 'ADM ENGINE PLANT',
  },
  {
    vendor_code: 'T054',
    company_name: 'ADM KAP PRESS',
  },
  {
    vendor_code: 'T055',
    company_name: 'ADM KAP WELDING KARAWANG ASSY PLANT',
  },
  {
    vendor_code: 'T057',
    company_name: 'PT. REKADAYA MULTI ADIPRIMA',
  },
  {
    vendor_code: 'T058',
    company_name: 'ROKI INDONESIA',
  },
  {
    vendor_code: 'T059',
    company_name: 'SINAR BAJA ELECTRIC',
  },
  {
    vendor_code: 'T060',
    company_name: 'PT. SANKEI DHARMA INDONESIA',
  },
  {
    vendor_code: 'T061',
    company_name: 'SHOWA INDONESIA MANUFACTURING',
  },
  {
    vendor_code: 'T062',
    company_name: 'SHINKO KOGYO INDONESIA',
  },
  {
    vendor_code: 'T064',
    company_name: 'SAGA HIKARI TEKNINDO SEJATI',
  },
  {
    vendor_code: 'T065',
    company_name: 'SUNGWOO INDONESIA',
  },
  {
    vendor_code: 'T066',
    company_name: 'TATO',
  },
  {
    vendor_code: 'T067',
    company_name: 'PT.TRIMITRA CHITRAHASTA',
  },
  {
    vendor_code: 'T068',
    company_name: 'TECHNO INDONESIA',
  },
  {
    vendor_code: 'T069',
    company_name: 'TSUZUKI INDONESIA MANUFACTURING',
  },
  {
    vendor_code: 'T070',
    company_name: 'TIMUR MEGAH STEEL',
  },
  {
    vendor_code: 'T071',
    company_name: 'TOSAMA ABADI',
  },
  {
    vendor_code: 'T072',
    company_name: 'PT. T.RAD INDONESIA',
  },
  {
    vendor_code: 'T073',
    company_name: 'PT.TOYOTA AUTO BODYTOKAI EXTRUSION',
  },
  {
    vendor_code: 'T074',
    company_name: 'YOHZU INDONESIA',
  },
  {
    vendor_code: 'T075',
    company_name: 'PT.YOSKA PRIMA INTI',
  },
  {
    vendor_code: 'T076',
    company_name: 'PT. WELINDO MATHOTECH SUKSES',
  },
  {
    vendor_code: 'T077',
    company_name: 'ADM KAP IMPORT',
  },
  {
    vendor_code: 'T078',
    company_name: 'ADM SAP IMPORT',
  },
  {
    vendor_code: 'TMC1',
    company_name: 'TOYOTA MOTOR CORPORATION',
  },
];
