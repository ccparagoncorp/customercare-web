"use server"

import { prisma } from "@/lib/db"
import { createSOPSchema, updateSOPSchema } from "@/lib/validations/sop"
import { revalidatePath } from "next/cache"

export async function createSOP(formData: FormData) {
  const validatedFields = createSOPSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    kategoriSOPId: formData.get("kategoriSOPId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, kategoriSOPId } = validatedFields.data

  try {
    const sop = await prisma.sOP.create({
      data: {
        name,
        description: description || null,
        kategoriSOPId,
      },
      include: {
        kategoriSOP: true,
        jenisSOPs: true,
      },
    })

    revalidatePath("/sop")
    return { success: true, data: sop }
  } catch (error) {
    console.error("Error creating SOP:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat membuat SOP"],
      },
    }
  }
}

export async function updateSOP(id: string, formData: FormData) {
  const validatedFields = updateSOPSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    kategoriSOPId: formData.get("kategoriSOPId"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, kategoriSOPId } = validatedFields.data

  try {
    const sop = await prisma.sOP.update({
      where: { id },
      data: {
        name,
        description: description || null,
        kategoriSOPId,
      },
      include: {
        kategoriSOP: true,
        jenisSOPs: true,
      },
    })

    revalidatePath("/sop")
    return { success: true, data: sop }
  } catch (error) {
    console.error("Error updating SOP:", error)
    return {
      errors: {
        name: ["Terjadi kesalahan saat mengupdate SOP"],
      },
    }
  }
}

export async function deleteSOP(id: string) {
  try {
    await prisma.sOP.delete({
      where: { id },
    })

    revalidatePath("/sop")
    return { success: true }
  } catch (error) {
    console.error("Error deleting SOP:", error)
    return {
      errors: {
        general: ["Terjadi kesalahan saat menghapus SOP"],
      },
    }
  }
}

export async function getSOPs() {
  try {
    const sops = await prisma.sOP.findMany({
      include: {
        kategoriSOP: true,
        jenisSOPs: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return sops
  } catch (error) {
    console.error("Error fetching SOPs:", error)
    return []
  }
}

export async function getSOPById(id: string) {
  try {
    const sop = await prisma.sOP.findUnique({
      where: { id },
      include: {
        kategoriSOP: true,
        jenisSOPs: {
          include: {
            detailSOPs: true,
          },
        },
      },
    })
    return sop
  } catch (error) {
    console.error("Error fetching SOP:", error)
    return null
  }
}

export async function getSOPsByKategori(kategoriSOPId: string) {
  try {
    const sops = await prisma.sOP.findMany({
      where: { kategoriSOPId },
      include: {
        kategoriSOP: true,
        jenisSOPs: true,
      },
      orderBy: { name: "asc" },
    })
    return sops
  } catch (error) {
    console.error("Error fetching SOPs by kategori:", error)
    return []
  }
}
