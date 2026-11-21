/* Firebase é o serviço real de autenticação. Nenhuma senha é armazenada no site. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js';
import {
  getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile,
  signInWithEmailAndPassword, signInWithPopup, signInWithRedirect,
  getRedirectResult, sendPasswordResetEmail, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js';
import {getFirestore,doc,setDoc,getDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js';

const VERSION='2026-11-21';
export function createAuthService(config,onAuthChange){
  const app=initializeApp(config);
  const auth=getAuth(app);
  auth.languageCode='pt-BR';
  const db=getFirestore(app);
  const googleProvider=new GoogleAuthProvider();
  googleProvider.setCustomParameters({prompt:'select_account'});
  onAuthStateChanged(auth,onAuthChange,()=>onAuthChange(null));
  // Limpa um possível retorno de login por redirecionamento, sem ocultar erros.
  const redirectResult=getRedirectResult(auth).catch(error=>{console.warn('Não foi possível concluir a autenticação por redirecionamento:',error.code||'erro');});
  return {
    redirectResult,
    async register(name,email,password){
      const credential=await createUserWithEmailAndPassword(auth,email,password);
      try{await updateProfile(credential.user,{displayName:name});}
      finally{await signOut(auth);} // exige novo login mesmo se o perfil falhar
      return credential.user.uid;
    },
    async login(email,password){return (await signInWithEmailAndPassword(auth,email,password)).user;},
    async googleLogin(){
      try {return (await signInWithPopup(auth,googleProvider)).user;}
      catch(error){
        if(['auth/popup-blocked','auth/operation-not-supported-in-this-environment'].includes(error.code)) {
          await signInWithRedirect(auth,googleProvider);
          return null;
        }
        throw error;
      }
    },
    resetPassword(email){return sendPasswordResetEmail(auth,email);},
    logout(){return signOut(auth);},
    get currentUser(){return auth.currentUser;},
    async readConsent(uid){
      const snap=await getDoc(doc(db,'user_consents',uid));
      const data=snap.exists()?snap.data():null;
      return !!(data?.privacyVersion===VERSION&&data?.termsVersion===VERSION&&data?.acceptedAt);
    },
    async acceptConsent(uid){
      await setDoc(doc(db,'user_consents',uid),{
        privacyVersion:VERSION,termsVersion:VERSION,acceptedAt:serverTimestamp()
      },{merge:true});
    }
  };
}
