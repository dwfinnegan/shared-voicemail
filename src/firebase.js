import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

//--- Paste Firebaseconfig here ---//


//---------------------------------//

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }