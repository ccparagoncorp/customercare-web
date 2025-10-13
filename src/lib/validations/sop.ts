import { z } from "zod"

// KategoriSOP validation schemas
export const createKategoriSOPSchema = z.object({
  name: z.string().min(1, "Nama kategori SOP harus diisi").max(100, "Nama kategori SOP maksimal 100 karakter"),
  description: z.string().optional(),
})

export const updateKategoriSOPSchema = createKategoriSOPSchema.partial()

export type CreateKategoriSOPInput = z.infer<typeof createKategoriSOPSchema>
export type UpdateKategoriSOPInput = z.infer<typeof updateKategoriSOPSchema>

// SOP validation schemas
export const createSOPSchema = z.object({
  name: z.string().min(1, "Nama SOP harus diisi").max(200, "Nama SOP maksimal 200 karakter"),
  description: z.string().optional(),
  kategoriSOPId: z.string().min(1, "Kategori SOP harus dipilih"),
})

export const updateSOPSchema = createSOPSchema.partial()

export type CreateSOPInput = z.infer<typeof createSOPSchema>
export type UpdateSOPInput = z.infer<typeof updateSOPSchema>

// JenisSOP validation schemas
export const createJenisSOPSchema = z.object({
  name: z.string().min(1, "Nama jenis SOP harus diisi").max(200, "Nama jenis SOP maksimal 200 karakter"),
  content: z.string().optional(),
  sopId: z.string().min(1, "SOP harus dipilih"),
})

export const updateJenisSOPSchema = createJenisSOPSchema.partial()

export type CreateJenisSOPInput = z.infer<typeof createJenisSOPSchema>
export type UpdateJenisSOPInput = z.infer<typeof updateJenisSOPSchema>

// DetailSOP validation schemas
export const createDetailSOPSchema = z.object({
  name: z.string().min(1, "Nama detail harus diisi").max(100, "Nama detail maksimal 100 karakter"),
  value: z.string().min(1, "Nilai detail harus diisi"),
  jenisSOPId: z.string().min(1, "Jenis SOP harus dipilih"),
})

export const updateDetailSOPSchema = createDetailSOPSchema.partial()

export type CreateDetailSOPInput = z.infer<typeof createDetailSOPSchema>
export type UpdateDetailSOPInput = z.infer<typeof updateDetailSOPSchema>
