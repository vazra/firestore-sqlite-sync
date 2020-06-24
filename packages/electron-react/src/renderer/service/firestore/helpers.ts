export const dataFromSnapshot = <T>(
  snapshot: firebase.firestore.DocumentData
): Map<string, any> => {
  if (!snapshot.exists) {
    console.log(`404! : dataFromSnapshot(${snapshot.id}) : NOT FOUND!`);
    return new Map();
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
