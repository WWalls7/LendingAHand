import React, { useState, useEffect } from 'react';
import { IonLoading, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonText, IonButton, IonFab, IonFabButton, IonIcon, useIonViewWillEnter, useIonViewDidEnter } from '@ionic/react';
import { add } from 'ionicons/icons';
import { getAllLoans } from '../Storage';
import { toast } from '../components/toast';
import { Loan } from '../components/LoanType';


const Tab1: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>()
  const [busy, setBusy] = useState<boolean>(false)

  useEffect(() => {
    setLoans(getAllLoans())
  }, [])

  useIonViewWillEnter(() => {
    setBusy(true)
    console.log(getAllLoans())
    setLoans(getAllLoans())
    console.log(loans)
    setBusy(false)
  }, [])
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Select A Loan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Please wait.." duration={0} isOpen={busy} />
      <IonContent className="ion-padding">
        <IonHeader collapse="condense" color="primary">
          <IonToolbar>
            <IonTitle size="large">Select A Loan</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/newloan">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>


        <IonButton>boop</IonButton>
        
        <IonList>
          {loans && loans.map((loan) => <IonItem><IonText>name: {loan.name} principle: {loan.principle} interest: {loan.interest}</IonText></IonItem>)}
        </IonList>
     
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
