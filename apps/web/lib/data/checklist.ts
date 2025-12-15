
export const checklistData = [
  {
    category_name: 'Safety Delivery',
    display_order: 1,
    id: 'safety',
    icon: 'Shield',
    color: 'text-green-600',
    items: [
      {
        checklist_item_id: 1,
        item_text: 'Apakah anda menggunakan APD (helm, sepatu safety)?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 2,
        item_text: 'Apakah kendaraan dalam kondisi layak jalan?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 3,
        item_text: 'Apakah dokumen kendaraan lengkap (STNK, SIM)?',
        item_type: 'UMUM',
        is_required: true,
      },
      // Specific Items
      {
        checklist_item_id: 12,
        item_text: 'Apakah material kimia dikemas dengan benar dan berlabel?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Chemicals',
      },
      {
        checklist_item_id: 13,
        item_text: 'Apakah ada MSDS (Material Safety Data Sheet)?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Chemicals',
      },
      {
        checklist_item_id: 14,
        item_text: 'Apakah tangki BBM tersegel dengan baik?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'BBM',
      },
      {
        checklist_item_id: 15,
        item_text: 'Apakah ada alat pemadam kebakaran?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'BBM',
      },
    ],
  },
  {
    category_name: 'Quality',
    display_order: 2,
    id: 'quality',
    icon: 'Award',
    color: 'text-yellow-600',
    items: [
      {
        checklist_item_id: 4,
        item_text: 'Apakah material/barang sesuai dengan PO?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 5,
        item_text: 'Apakah kemasan dalam kondisi baik (tidak rusak)?',
        item_type: 'UMUM',
        is_required: true,
      },
      // Specific Items
      {
        checklist_item_id: 16,
        item_text: 'Apakah tanggal kadaluarsa masih valid?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Chemicals',
      },
      {
        checklist_item_id: 17,
        item_text: 'Apakah batch number tercantum dengan jelas?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Chemicals',
      },
      {
        checklist_item_id: 18,
        item_text: 'Apakah part tidak ada karat atau kerusakan?',
        item_type: 'KHUSUS',
        is_required: true,
        category_name: 'Spare Part & Tool mudah berkarat',
      },
    ],
  },
  {
    category_name: 'Productivity',
    display_order: 3,
    id: 'productivity',
    icon: 'TrendingUp',
    color: 'text-blue-600',
    items: [
      {
        checklist_item_id: 6,
        item_text: 'Apakah dokumen delivery (surat jalan) lengkap?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 7,
        item_text: 'Apakah driver sudah konfirmasi waktu kedatangan?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 8,
        item_text: 'Apakah material siap untuk unloading?',
        item_type: 'UMUM',
        is_required: true,
      },
    ],
  },
  {
    category_name: 'Environment',
    display_order: 4,
    id: 'environment',
    icon: 'Leaf',
    color: 'text-teal-600',
    items: [
      {
        checklist_item_id: 9,
        item_text: 'Apakah tidak ada tumpahan material di kendaraan?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 10,
        item_text: 'Apakah limbah kemasan dibawa kembali?',
        item_type: 'UMUM',
        is_required: true,
      },
      {
        checklist_item_id: 11,
        item_text: 'Apakah kendaraan memenuhi standar emisi?',
        item_type: 'UMUM',
        is_required: true,
      },
    ],
  },
];
