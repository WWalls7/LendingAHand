import React, { useState } from 'react';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonText, useIonViewWillEnter } from '@ionic/react';
import { Loan } from '../components/Types';
import { getFinalDueDate, getAmountLeft } from '../services/Calculations';
import { createProgress } from '../services/HelperFunctions';

interface _Props {
    loans: Loan[];
}

const Progress: React.FC<_Props> = ({loans}) => {

  const [date, setDate] = useState('')
  const [amount, setAmount] = useState(0)
  // const []

  useIonViewWillEnter(() => {
    createProgress(loans)
    setDate(getFinalDueDate(loans))
    setAmount(getAmountLeft(loans))
  })


  return (
    <IonPage>
      <IonContent fullscreen>
        {loans && (
          <IonCard>
           <IonCardHeader>
             <IonCardTitle>Progress towards goals</IonCardTitle>
           </IonCardHeader>
           <IonCardContent>
             <IonItem>
                 <IonLabel color="grey">Last loan ends on</IonLabel>
                 <IonText>{date}</IonText>
             </IonItem>
             <IonItem>
                 <IonLabel color="grey">Total left to pay</IonLabel>
                 <IonText>{amount}</IonText>
             </IonItem>
           </IonCardContent>
         </IonCard>
        )}  
      </IonContent>
    </IonPage>
  );
};


export default Progress;
