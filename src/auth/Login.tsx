import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonText, IonInput, IonLabel, IonButton, IonFab, IonFabButton, IonIcon, IonLoading } from '@ionic/react';
import { Link } from 'react-router-dom';
import { loginUser } from './Firebase';
import { toast } from '../components/toast';

const Login: React.FC = () => {

  const [busy, setBusy] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  async function login() {
    setBusy(true)
    const res = await loginUser(username, password)
    if (!res) {
      toast("Incorrect username or password")
    }
    setBusy(false)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait.." duration={0} isOpen={busy} />
      <IonContent className="ion-padding">
        <IonHeader collapse="condense" color="primary">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
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
        
        <IonButton onClick={login}>Login</IonButton>

        <p>Don't have an account? Click <Link to="/register">Here</Link></p>
     
      </IonContent>
    </IonPage>
  );
};

export default Login;
