import * as z from 'zod';

export const VendorIdentitySchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap wajib diisi'),
  company: z.object({
    value: z.string().min(1, 'Perusahaan wajib diisi'),
    category: z.string().min(1, 'Kategori wajib diisi'),
    vendorCode: z.string().min(1, 'Kode vendor wajib diisi'),
  }),
});
