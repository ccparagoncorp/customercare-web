"use server"

import { prisma } from "@/lib/db"
import { createKnowledgeSchema, updateKnowledgeSchema } from "@/lib/validations/knowledge"
import { revalidatePath } from "next/cache"

export async function createKnowledge(formData: FormData) {
  const validatedFields = createKnowledgeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description } = validatedFields.data

  try {
    const knowledge = await prisma.knowledge.create({
      data: {
        title,
        description: description || null,
        logos: [],
      },
      include: {
        detailKnowledges: true,
      },
    })

    revalidatePath("/knowledge")
    return { success: true, data: knowledge }
  } catch (error) {
    console.error("Error creating knowledge:", error)
    return {
      errors: {
        title: ["Terjadi kesalahan saat membuat knowledge"],
      },
    }
  }
}

export async function updateKnowledge(id: string, formData: FormData) {
  const validatedFields = updateKnowledgeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, description } = validatedFields.data

  try {
    const knowledge = await prisma.knowledge.update({
      where: { id },
      data: {
        title,
        description: description || null,
      },
      include: {
        detailKnowledges: true,
      },
    })

    revalidatePath("/knowledge")
    return { success: true, data: knowledge }
  } catch (error) {
    console.error("Error updating knowledge:", error)
    return {
      errors: {
        title: ["Terjadi kesalahan saat mengupdate knowledge"],
      },
    }
  }
}

export async function deleteKnowledge(id: string) {
  try {
    await prisma.knowledge.delete({
      where: { id },
    })

    revalidatePath("/knowledge")
    return { success: true }
  } catch (error) {
    console.error("Error deleting knowledge:", error)
    return {
      errors: {
        general: ["Terjadi kesalahan saat menghapus knowledge"],
      },
    }
  }
}

export async function getKnowledges() {
  try {
    const knowledges = await prisma.knowledge.findMany({
      include: {
        detailKnowledges: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return knowledges
  } catch (error) {
    console.error("Error fetching knowledges:", error)
    return []
  }
}

export async function getKnowledgeById(id: string) {
  try {
    const knowledge = await prisma.knowledge.findUnique({
      where: { id },
      include: {
        detailKnowledges: true,
      },
    })
    return knowledge
  } catch (error) {
    console.error("Error fetching knowledge:", error)
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getKnowledgesByCategory(_category: string) {
  try {
    // Note: Knowledge model doesn't have a category field
    // This function is kept for backward compatibility but returns all knowledges
    const knowledges = await prisma.knowledge.findMany({
      include: {
        detailKnowledges: true,
      },
      orderBy: { title: "asc" },
    })
    return knowledges
  } catch (error) {
    console.error("Error fetching knowledges by category:", error)
    return []
  }
}
