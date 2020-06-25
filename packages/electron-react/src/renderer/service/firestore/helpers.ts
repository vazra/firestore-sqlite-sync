import { IDoc } from "../sync/firesync";

export const dataFromSnapshot = <T>(
  snapshot: firebase.firestore.DocumentData
): IDoc | undefined => {
  if (!snapshot.exists) {
    console.log(`404! : dataFromSnapshot(${snapshot.id}) : NOT FOUND!`);
    return undefined;
  }
  const data = snapshot.data() as any;

  return {
    ...data,
    id: snapshot.id,
  };
};

// export const listFromQuerySnapshot = <T>(
//   snapshot: firebase.firestore.QuerySnapshot
// ): Map<string, any>[] => {
//   if(snapshot.empty) return []

//   snapshot.docs
//   const data = snapshot.data() as any;

//   return {
//     ...data,
//     id: snapshot.id,
//   };
