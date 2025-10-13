"use server"

import { prisma } from "@/lib/db"
import { createBrandSchema, updateBrandSchema } from "@/lib/validations/produk"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createBrand(formData: FormData) {
  const validatedFields = createBrandSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description } = validatedFields.data

  try {
    const brand = await prisma.brand.create({
      data: {
        name,
        description: description || null,
      },
    })

    revalidatePath("/produk")
    return { success: true, data: brand }
  } catch (error) {
    console.error("Error creating brand:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat membuat brand"],
      },
    }
  }
}

export async function updateBrand(id: string, formData: FormData) {
  const validatedFields = updateBrandSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description } = validatedFields.data

  try {
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name,
        description: description || null,
      },
    })

    revalidatePath("/produk")
    return { success: true, data: brand }
  } catch (error) {
    console.error("Error updating brand:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat mengupdate brand"],
      },
    }
  }
}

export async function deleteBrand(id: string) {
  try {
    await prisma.brand.delete({
      where: { id },
    })

    revalidatePath("/produk")
    return { success: true }
  } catch (error) {
    console.error("Error deleting brand:", error)
    return {
      errors: {
        general: ["Terjadi kesalahan saat menghapus brand"],
      },
    }
  }
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    })
    return brands
  } catch (error) {
    console.error("Error fetching brands:", error)
    return []
  }
}

export async function getBrandById(id: string) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        kategoriProduks: true,
      },
    })
    return brand
  } catch (error) {
    console.error("Error fetching brand:", error)
    return null
  }
}
