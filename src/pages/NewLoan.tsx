import React, { useState } from 'react';
import { IonLoading, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonInput, IonLabel, IonButton } from '@ionic/react';
import { addLoanToDB } from '../Storage';
import { toast } from '../components/toast';


const NewLoan: React.FC = () => {

  const [busy, setBusy] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [principle, setPrinciple] = useState<number>(0)
  const [interest, setInterest] = useState<number>(0)

  async function addLoan() {
    setBusy(true)

    addLoanToDB(name, principle, interest)

    setBusy(false)
  }

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Enter Loan Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait.." duration={0} isOpen={busy} />
      <IonContent className="ion-padding">
        <IonHeader collapse="condense" color="primary">
          <IonToolbar>
            <IonTitle size="large">Enter Loan Information</IonTitle>
          </IonToolbar>
        </IonHeader>
      
        <IonItem>
            <IonLabel position="stacked">Loan Name</IonLabel>
            <IonInput onIonChange={(e: any) => setName (e.target.value)}></IonInput>
        </IonItem>

        <IonItem>
            <IonLabel position="stacked">Principle</IonLabel>
            <IonInput onIonChange={(e: any) => setPrinciple (e.target.value)}></IonInput>
        </IonItem>

        <IonItem>
            <IonLabel position="stacked">Interest</IonLabel>
            <IonInput onIonChange={(e: any) => setInterest (e.target.value)}></IonInput>
        </IonItem>
        
        <IonButton routerLink="/tab1" onClick={addLoan}>Submit</IonButton>
        
      </IonContent>
    </IonPage>
  );
};

export default NewLoan;
