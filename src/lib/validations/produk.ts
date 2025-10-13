import { z } from "zod"

// Brand validation schemas
export const createBrandSchema = z.object({
  name: z.string().min(1, "Nama brand harus diisi").max(100, "Nama brand maksimal 100 karakter"),
  description: z.string().optional(),
})

export const updateBrandSchema = createBrandSchema.partial()

export type CreateBrandInput = z.infer<typeof createBrandSchema>
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>

// KategoriProduk validation schemas
export const createKategoriProdukSchema = z.object({
  name: z.string().min(1, "Nama kategori harus diisi").max(100, "Nama kategori maksimal 100 karakter"),
  description: z.string().optional(),
  brandId: z.string().min(1, "Brand harus dipilih"),
})

export const updateKategoriProdukSchema = createKategoriProdukSchema.partial()

export type CreateKategoriProdukInput = z.infer<typeof createKategoriProdukSchema>
export type UpdateKategoriProdukInput = z.infer<typeof updateKategoriProdukSchema>

// SubkategoriProduk validation schemas
export const createSubkategoriProdukSchema = z.object({
  name: z.string().min(1, "Nama subkategori harus diisi").max(100, "Nama subkategori maksimal 100 karakter"),
  description: z.string().optional(),
  kategoriProdukId: z.string().min(1, "Kategori produk harus dipilih"),
})

export const updateSubkategoriProdukSchema = createSubkategoriProdukSchema.partial()

export type CreateSubkategoriProdukInput = z.infer<typeof createSubkategoriProdukSchema>
export type UpdateSubkategoriProdukInput = z.infer<typeof updateSubkategoriProdukSchema>

// Produk validation schemas
export const createProdukSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi").max(200, "Nama produk maksimal 200 karakter"),
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.coerce.number().positive("Harga harus lebih dari 0").optional(),
  stock: z.coerce.number().int("Stok harus berupa angka bulat").min(0, "Stok tidak boleh negatif").optional(),
  subkategoriProdukId: z.string().min(1, "Subkategori produk harus dipilih"),
})

export const updateProdukSchema = createProdukSchema.partial()

export type CreateProdukInput = z.infer<typeof createProdukSchema>
export type UpdateProdukInput = z.infer<typeof updateProdukSchema>

// DetailProduk validation schemas
export const createDetailProdukSchema = z.object({
  name: z.string().min(1, "Nama detail harus diisi").max(100, "Nama detail maksimal 100 karakter"),
  value: z.string().min(1, "Nilai detail harus diisi"),
  produkId: z.string().min(1, "Produk harus dipilih"),
})

export const updateDetailProdukSchema = createDetailProdukSchema.partial()

export type CreateDetailProdukInput = z.infer<typeof createDetailProdukSchema>
export type UpdateDetailProdukInput = z.infer<typeof updateDetailProdukSchema>
