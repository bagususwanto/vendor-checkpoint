import * as z from 'zod';

export const VendorIdentitySchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap wajib diisi'),
  company: z.object({
    value: z.string().min(1, 'Perusahaan wajib diisi'),
    label: z.string().min(1, 'Perusahaan wajib diisi'),
  }),
  materialCategory: z.object({
    value: z.string().min(1, 'Kategori Material wajib dipilih'),
    label: z.string().min(1),
    description: z.string(),
  }),
});
