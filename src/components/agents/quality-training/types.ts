export interface QualityTraining {
  id: string
  title: string
  description?: string
  logos: string[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
  updateNotes?: string
  jenisQualityTrainings: JenisQualityTraining[]
}

export interface JenisQualityTraining {
  id: string
  name: string
  description?: string
  logos: string[]
  createdAt: string
  updatedAt: string
  updatedBy?: string
  updateNotes?: string
  qualityTrainingId: string
  detailQualityTrainings: DetailQualityTraining[]
}

export interface DetailQualityTraining {
  id: string
  name: string
  description?: string
  linkslide?: string
  logos: string[]
  createdAt: string
  updatedAt: string
  updatedBy?: string
  updateNotes?: string
  jenisQualityTrainingId: string
  subdetailQualityTrainings: SubdetailQualityTraining[]
}

export interface SubdetailQualityTraining {
  id: string
  name: string
  description?: string
  logos: string[]
  createdAt: string
  updatedAt: string
  updatedBy?: string
  updateNotes?: string
  detailQualityTrainingId: string
}

export interface DesignConfig {
  type: string
  layout: string
  showIcons: boolean
}

