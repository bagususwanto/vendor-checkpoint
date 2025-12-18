import * as z from 'zod';

export const VendorIdentitySchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap wajib diisi'),
  company: z.object({
    value: z.string().min(1, 'Perusahaan wajib diisi'),
    label: z.string().min(1, 'Perusahaan wajib diisi'),
    category_name: z.string().min(1, 'Kategori wajib diisi'),
    category_id: z.number().min(1, 'Kategori wajib diisi'),
    vendorCode: z.string().min(1, 'Kode vendor wajib diisi'),
  }),
});
