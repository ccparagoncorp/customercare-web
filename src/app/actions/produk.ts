"use server"

import { prisma } from "@/lib/db"
import { createProdukSchema, updateProdukSchema } from "@/lib/validations/produk"
import { revalidatePath } from "next/cache"

export async function createProduk(formData: FormData) {
  const validatedFields = createProdukSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    subkategoriProdukId: formData.get("subkategoriProdukId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, price, subkategoriProdukId } = validatedFields.data

  try {
    const produk = await prisma.produk.create({
      data: {
        name,
        description: description || null,
        harga: price ? Number(price) : null,
        images: [],
        subkategoriProdukId,
      },
      include: {
        subkategoriProduk: {
          include: {
            kategoriProduk: {
              include: {
                brand: true,
              },
            },
          },
        },
        detailProduks: true,
      },
    })

    revalidatePath("/produk")
    return { success: true, data: produk }
  } catch (error) {
    console.error("Error creating produk:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat membuat produk"],
      },
    }
  }
}

export async function updateProduk(id: string, formData: FormData) {
  const validatedFields = updateProdukSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    subkategoriProdukId: formData.get("subkategoriProdukId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, price, subkategoriProdukId } = validatedFields.data

  try {
    const produk = await prisma.produk.update({
      where: { id },
      data: {
        name,
        description: description || null,
        harga: price ? Number(price) : null,
        subkategoriProdukId,
      },
      include: {
        subkategoriProduk: {
          include: {
            kategoriProduk: {
              include: {
                brand: true,
              },
            },
          },
        },
        detailProduks: true,
      },
    })

    revalidatePath("/produk")
    return { success: true, data: produk }
  } catch (error) {
    console.error("Error updating produk:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat mengupdate produk"],
      },
    }
  }
}

export async function deleteProduk(id: string) {
  try {
    await prisma.produk.delete({
      where: { id },
    })

    revalidatePath("/produk")
    return { success: true }
  } catch (error) {
    console.error("Error deleting produk:", error)
    return {
      errors: {
        general: ["Terjadi kesalahan saat menghapus produk"],
      },
    }
  }
}

export async function getProduks() {
  try {
    const produks = await prisma.produk.findMany({
      include: {
        subkategoriProduk: {
          include: {
            kategoriProduk: {
              include: {
                brand: true,
              },
            },
          },
        },
        detailProduks: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return produks
  } catch (error) {
    console.error("Error fetching produks:", error)
    return []
  }
}

export async function getProdukById(id: string) {
  try {
    const produk = await prisma.produk.findUnique({
      where: { id },
      include: {
        subkategoriProduk: {
          include: {
            kategoriProduk: {
              include: {
                brand: true,
              },
            },
          },
        },
        detailProduks: true,
      },
    })
    return produk
  } catch (error) {
    console.error("Error fetching produk:", error)
    return null
  }
}
