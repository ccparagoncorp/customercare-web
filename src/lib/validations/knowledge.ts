import { z } from "zod"

// Knowledge validation schemas
export const createKnowledgeSchema = z.object({
  title: z.string().min(1, "Judul harus diisi").max(200, "Judul maksimal 200 karakter"),
  description: z.string().optional(),
})

export const updateKnowledgeSchema = createKnowledgeSchema.partial()

export type CreateKnowledgeInput = z.infer<typeof createKnowledgeSchema>
export type UpdateKnowledgeInput = z.infer<typeof updateKnowledgeSchema>

// DetailKnowledge validation schemas
export const createDetailKnowledgeSchema = z.object({
  name: z.string().min(1, "Nama detail harus diisi").max(100, "Nama detail maksimal 100 karakter"),
  value: z.string().min(1, "Nilai detail harus diisi"),
  knowledgeId: z.string().min(1, "Knowledge harus dipilih"),
})

export const updateDetailKnowledgeSchema = createDetailKnowledgeSchema.partial()

export type CreateDetailKnowledgeInput = z.infer<typeof createDetailKnowledgeSchema>
export type UpdateDetailKnowledgeInput = z.infer<typeof updateDetailKnowledgeSchema>
