"use server"

import { prisma } from "@/lib/db"
import { createKategoriSOPSchema, updateKategoriSOPSchema } from "@/lib/validations/sop"
import { revalidatePath } from "next/cache"

export async function createKategoriSOP(formData: FormData) {
  const validatedFields = createKategoriSOPSchema.safeParse({
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
    const kategoriSOP = await prisma.kategoriSOP.create({
      data: {
        name,
        description: description || null,
      },
      include: {
        sops: true,
      },
    })

    revalidatePath("/sop")
    return { success: true, data: kategoriSOP }
  } catch (error) {
    console.error("Error creating kategori SOP:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat membuat kategori SOP"],
      },
    }
  }
}

export async function updateKategoriSOP(id: string, formData: FormData) {
  const validatedFields = updateKategoriSOPSchema.safeParse({
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
    const kategoriSOP = await prisma.kategoriSOP.update({
      where: { id },
      data: {
        name,
        description: description || null,
      },
      include: {
        sops: true,
      },
    })

    revalidatePath("/sop")
    return { success: true, data: kategoriSOP }
  } catch (error) {
    console.error("Error updating kategori SOP:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat mengupdate kategori SOP"],
      },
    }
  }
}

export async function deleteKategoriSOP(id: string) {
  try {
    await prisma.kategoriSOP.delete({
      where: { id },
    })

    revalidatePath("/sop")
    return { success: true }
  } catch (error) {
    console.error("Error deleting kategori SOP:", error)
    return {
      errors: {
        general: ["Terjadi kesalahan saat menghapus kategori SOP"],
      },
    }
  }
}

export async function getKategoriSOPs() {
  try {
    const kategoriSOPs = await prisma.kategoriSOP.findMany({
      include: {
        sops: true,
      },
      orderBy: { name: "asc" },
    })
    return kategoriSOPs
  } catch (error) {
    console.error("Error fetching kategori SOPs:", error)
    return []
  }
}

export async function getKategoriSOPById(id: string) {
  try {
    const kategoriSOP = await prisma.kategoriSOP.findUnique({
      where: { id },
      include: {
        sops: {
          include: {
            jenisSOPs: true,
          },
        },
      },
    })
    return kategoriSOP
  } catch (error) {
    console.error("Error fetching kategori SOP:", error)
    return null
  }
}
