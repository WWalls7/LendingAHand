import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonText, IonInput, IonLabel, IonButton, IonFab, IonFabButton, IonIcon, IonLoading } from '@ionic/react';
import { add } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import './Tab1.css';
import { toast } from '../components/toast';
import { registerUser } from './Firebase'

const Register: React.FC = () => {

    const [busy, setBusy] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [cPassword, setCPassword] = useState<string>('')
  
    async function register() {
      if(username.trim() === "") {
        return toast("Username required")
      }
      if(password.trim() === "") {
        return toast("Password required")
      }
      if(password !== cPassword) {
        return toast("Passwords do not match")
      }
      setBusy(true)
      const res = await registerUser(username, password)
      setBusy(false)

    }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait.." duration={0} isOpen={busy} />
      <IonContent className="ion-padding">
        <IonHeader collapse="condense" color="primary">
          <IonToolbar>
            <IonTitle size="large">Register</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonItem>
            <IonLabel position="stacked">Username</IonLabel>
            <IonInput onIonChange={(e: any) => setUsername (e.target.value)}></IonInput>
        </IonItem>

        <IonItem>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput type="password" onIonChange={(e: any) => setPassword (e.target.value)}></IonInput>
        </IonItem>

        <IonItem>
            <IonLabel position="stacked">Confirm Password</IonLabel>
            <IonInput type="password" onIonChange={(e: any) => setCPassword (e.target.value)}></IonInput>
        </IonItem>
        
        <IonButton onClick={register}>Register</IonButton>

        <p>Already have an account? Click <Link to="/login">Here</Link></p>
     
      </IonContent>
    </IonPage>
  );
};

export default Register;
