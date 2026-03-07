import { adminDb } from './admin'
import { FieldValue } from 'firebase-admin/firestore'
import type { Generation, GenerationResult, Asset, CreditTransaction, CreditBalance } from '@/types'

// Generation CRUD
export async function createGeneration(data: Omit<Generation, 'id'>): Promise<string> {
  const ref = adminDb.collection('generations').doc()
  await ref.set({ ...data, id: ref.id })
  return ref.id
}

export async function getGeneration(id: string): Promise<Generation | null> {
  const snap = await adminDb.collection('generations').doc(id).get()
  return snap.exists ? (snap.data() as Generation) : null
}

export async function updateGeneration(id: string, data: Partial<Generation>): Promise<void> {
  await adminDb.collection('generations').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

export async function updateGenerationResult(
  generationId: string,
  resultId: string,
  data: Partial<GenerationResult>
): Promise<void> {
  const gen = await getGeneration(generationId)
  if (!gen) return
  const results = gen.results.map(r => r.id === resultId ? { ...r, ...data } : r)
  await updateGeneration(generationId, { results })
}

// Assets
export async function createAsset(data: Omit<Asset, 'id'>): Promise<string> {
  const ref = adminDb.collection('assets').doc()
  await ref.set({ ...data, id: ref.id })
  return ref.id
}

export async function getAssets(orgId: string, opts?: {
  type?: 'image' | 'video'
  limit?: number
  offset?: number
  favoriteOnly?: boolean
}): Promise<Asset[]> {
  let query = adminDb.collection('assets').where('orgId', '==', orgId).orderBy('createdAt', 'desc')
  if (opts?.type) query = query.where('type', '==', opts.type)
  if (opts?.favoriteOnly) query = query.where('isFavorite', '==', true)
  if (opts?.limit) query = query.limit(opts.limit)
  const snap = await query.get()
  return snap.docs.map(d => d.data() as Asset)
}

export async function toggleFavorite(assetId: string): Promise<boolean> {
  const ref = adminDb.collection('assets').doc(assetId)
  const snap = await ref.get()
  if (!snap.exists) return false
  const current = snap.data()!.isFavorite || false
  await ref.update({ isFavorite: !current })
  return !current
}

// Credits
export async function getCredits(orgId: string): Promise<CreditBalance> {
  const snap = await adminDb.collection('credits').doc(orgId).get()
  if (!snap.exists) {
    // Init with default credits
    const initial: CreditBalance = { balance: 2500, totalPurchased: 2500, totalConsumed: 0 }
    await adminDb.collection('credits').doc(orgId).set(initial)
    return initial
  }
  return snap.data() as CreditBalance
}

export async function deductCredits(orgId: string, amount: number, reason: string, generationId?: string): Promise<boolean> {
  const credits = await getCredits(orgId)
  if (credits.balance < amount) return false

  await adminDb.collection('credits').doc(orgId).update({
    balance: FieldValue.increment(-amount),
    totalConsumed: FieldValue.increment(amount),
  })

  await adminDb.collection('credits').doc(orgId).collection('transactions').add({
    orgId,
    amount: -amount,
    type: 'deduct',
    reason,
    generationId,
    createdAt: new Date().toISOString(),
  } satisfies Omit<CreditTransaction, 'id'>)

  return true
}

export async function refundCredits(orgId: string, amount: number, reason: string, generationId?: string): Promise<void> {
  await adminDb.collection('credits').doc(orgId).update({
    balance: FieldValue.increment(amount),
    totalConsumed: FieldValue.increment(-amount),
  })

  await adminDb.collection('credits').doc(orgId).collection('transactions').add({
    orgId,
    amount,
    type: 'refund',
    reason,
    generationId,
    createdAt: new Date().toISOString(),
  } satisfies Omit<CreditTransaction, 'id'>)
}

// Generations History
export async function getGenerations(orgId: string, opts?: {
  type?: 'image' | 'video'
  limit?: number
}): Promise<Generation[]> {
  let query = adminDb.collection('generations').where('orgId', '==', orgId).orderBy('createdAt', 'desc')
  if (opts?.type) query = query.where('type', '==', opts.type)
  if (opts?.limit) query = query.limit(opts.limit)
  const snap = await query.get()
  return snap.docs.map(d => d.data() as Generation)
}
