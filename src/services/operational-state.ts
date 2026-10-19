import { firestoreDb } from '../lib/firestore';

export async function updateOperationalState(storeId: string, stateData: any) {
  const docRef = firestoreDb.collection('operational_states').doc(storeId);
  await docRef.set({
    ...stateData,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  return { status: 'success', storeId };
}