import * as z from 'zod';

export const VendorIdentitySchema = z.object({
  fullName: z.string().min(2, 'Nama lengkap wajib diisi'),
  company: z.object({
    value: z.string().min(1, 'Perusahaan wajib diisi'),
    label: z.string(),
  }),
  vendorCategory: z.object({
    value: z.string().min(1, 'Kategori Vendor wajib dipilih'),
    label: z.string(),
    description: z.string(),
  }),
  dnNumber: z.string().optional(),
  poNumber: z.string().optional(),
});
