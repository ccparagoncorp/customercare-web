"use server"

import { prisma } from "@/lib/db"
import { createSubkategoriProdukSchema, updateSubkategoriProdukSchema } from "@/lib/validations/produk"
import { revalidatePath } from "next/cache"

export async function createSubkategoriProduk(formData: FormData) {
  const validatedFields = createSubkategoriProdukSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    kategoriProdukId: formData.get("kategoriProdukId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, kategoriProdukId } = validatedFields.data

  try {
    const subkategoriProduk = await prisma.subkategoriProduk.create({
      data: {
        name,
        description: description || null,
        kategoriProdukId,
      },
      include: {
        kategoriProduk: {
          include: {
            brand: true,
          },
        },
        produks: true,
      },
    })

    revalidatePath("/produk")
    return { success: true, data: subkategoriProduk }
  } catch (error) {
    console.error("Error creating subkategori produk:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat membuat subkategori produk"],
      },
    }
  }
}

export async function updateSubkategoriProduk(id: string, formData: FormData) {
  const validatedFields = updateSubkategoriProdukSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    kategoriProdukId: formData.get("kategoriProdukId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, kategoriProdukId } = validatedFields.data

  try {
    const subkategoriProduk = await prisma.subkategoriProduk.update({
      where: { id },
      data: {
        name,
        description: description || null,
        kategoriProdukId,
      },
      include: {
        kategoriProduk: {
          include: {
            brand: true,
          },
        },
        produks: true,
      },
    })

    revalidatePath("/produk")
    return { success: true, data: subkategoriProduk }
  } catch (error) {
    console.error("Error updating subkategori produk:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat mengupdate subkategori produk"],
      },
    }
  }
}

export async function deleteSubkategoriProduk(id: string) {
  try {
    await prisma.subkategoriProduk.delete({
      where: { id },
    })

    revalidatePath("/produk")
    return { success: true }
  } catch (error) {
    console.error("Error deleting subkategori produk:", error)
    return {
      errors: {
        general: ["Terjadi kesalahan saat menghapus subkategori produk"],
      },
    }
  }
}

export async function getSubkategoriProduks() {
  try {
    const subkategoriProduks = await prisma.subkategoriProduk.findMany({
      include: {
        kategoriProduk: {
          include: {
            brand: true,
          },
        },
        produks: true,
      },
      orderBy: { name: "asc" },
    })
    return subkategoriProduks
  } catch (error) {
    console.error("Error fetching subkategori produks:", error)
    return []
  }
}

export async function getSubkategoriProdukById(id: string) {
  try {
    const subkategoriProduk = await prisma.subkategoriProduk.findUnique({
      where: { id },
      include: {
        kategoriProduk: {
          include: {
            brand: true,
          },
        },
        produks: {
          include: {
            detailProduks: true,
          },
        },
      },
    })
    return subkategoriProduk
  } catch (error) {
    console.error("Error fetching subkategori produk:", error)
    return null
  }
}

export async function getSubkategoriProduksByKategori(kategoriProdukId: string) {
  try {
    const subkategoriProduks = await prisma.subkategoriProduk.findMany({
      where: { kategoriProdukId },
      include: {
        kategoriProduk: {
          include: {
            brand: true,
          },
        },
        produks: true,
      },
      orderBy: { name: "asc" },
    })
    return subkategoriProduks
  } catch (error) {
    console.error("Error fetching subkategori produks by kategori:", error)
    return []
  }
}
