import { IDoc } from '..'

export const dataFromSnapshot = (snapshot: firebase.firestore.DocumentData): IDoc | undefined => {
  if (!snapshot.exists) {
    console.log(`404! : dataFromSnapshot(${snapshot.id}) : NOT FOUND!`)
    return undefined
  }
  const data = snapshot.data() as any

  return {
    ...data,
    id: snapshot.id,
  }
}
