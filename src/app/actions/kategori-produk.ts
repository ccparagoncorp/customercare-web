"use server"

import { prisma } from "@/lib/db"
import { createKategoriProdukSchema, updateKategoriProdukSchema } from "@/lib/validations/produk"
import { revalidatePath } from "next/cache"

export async function createKategoriProduk(formData: FormData) {
  const validatedFields = createKategoriProdukSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    brandId: formData.get("brandId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, brandId } = validatedFields.data

  try {
    const kategoriProduk = await prisma.kategoriProduk.create({
      data: {
        name,
        description: description || null,
        brandId,
      },
      include: {
        brand: true,
        subkategoriProduks: true,
      },
    })

    revalidatePath("/produk")
    return { success: true, data: kategoriProduk }
  } catch (error) {
    console.error("Error creating kategori produk:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat membuat kategori produk"],
      },
    }
  }
}

export async function updateKategoriProduk(id: string, formData: FormData) {
  const validatedFields = updateKategoriProdukSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    brandId: formData.get("brandId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, brandId } = validatedFields.data

  try {
    const kategoriProduk = await prisma.kategoriProduk.update({
      where: { id },
      data: {
        name,
        description: description || null,
        brandId,
      },
      include: {
        brand: true,
        subkategoriProduks: true,
      },
    })

    revalidatePath("/produk")
    return { success: true, data: kategoriProduk }
  } catch (error) {
    console.error("Error updating kategori produk:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat mengupdate kategori produk"],
      },
    }
  }
}

export async function deleteKategoriProduk(id: string) {
  try {
    await prisma.kategoriProduk.delete({
      where: { id },
    })

    revalidatePath("/produk")
    return { success: true }
  } catch (error) {
    console.error("Error deleting kategori produk:", error)
    return {
      errors: {
        general: ["Terjadi kesalahan saat menghapus kategori produk"],
      },
    }
  }
}

export async function getKategoriProduks() {
  try {
    const kategoriProduks = await prisma.kategoriProduk.findMany({
      include: {
        brand: true,
        subkategoriProduks: true,
      },
      orderBy: { name: "asc" },
    })
    return kategoriProduks
  } catch (error) {
    console.error("Error fetching kategori produks:", error)
    return []
  }
}

export async function getKategoriProdukById(id: string) {
  try {
    const kategoriProduk = await prisma.kategoriProduk.findUnique({
      where: { id },
      include: {
        brand: true,
        subkategoriProduks: {
          include: {
            produks: true,
          },
        },
      },
    })
    return kategoriProduk
  } catch (error) {
    console.error("Error fetching kategori produk:", error)
    return null
  }
}

export async function getKategoriProduksByBrand(brandId: string) {
  try {
    const kategoriProduks = await prisma.kategoriProduk.findMany({
      where: { brandId },
      include: {
        brand: true,
        subkategoriProduks: true,
      },
      orderBy: { name: "asc" },
    })
    return kategoriProduks
  } catch (error) {
    console.error("Error fetching kategori produks by brand:", error)
    return []
  }
}
