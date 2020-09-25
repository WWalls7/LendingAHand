import React, { useState } from 'react';
import { IonContent, IonPage, IonList, IonItem, IonText, IonIcon, useIonViewWillEnter, IonLabel, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, } from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { Payment } from '../components/Types';
import { monthDiff } from '../services/Calculations'

interface _Props {
    payments: Payment[];
}

const PaymentHistory: React.FC<_Props> = ({payments}) => {

  const [recentPayments, setRecentPayments] = useState<Payment[]>(payments)
  const [otherPayments, setOtherPayments] = useState<Payment[]>([])
  const [total, setTotal] = useState<number>(0)
  const [timeSpent, setTimeSpent] = useState<number>(0)
  const [toggle, setToggle] = useState<boolean>(false)
  const [icon, setIcon] = useState(chevronDown)

  useIonViewWillEnter(() => {
    setRecentPayments(payments.slice(0, 5))
    setOtherPayments(payments.slice(5, payments.length))
    var newTotal =0
    for(var i = 0; i< payments.length; i++){
      newTotal += Number(payments[i].amount)
      setTotal(+(newTotal).toFixed(2))
    }
    var months = monthDiff(new Date(payments[payments.length-1].date), new Date())
    setTimeSpent(months === 0 ? 1:months)
  })
  
  function toggleInfo() {
    setToggle(!toggle)
    if(icon === chevronDown){setIcon(chevronUp)}
    else{setIcon(chevronDown)}
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {!recentPayments &&
          <IonItem>
            <IonText>You have no payments saved.</IonText>
          </IonItem>
        }
        {recentPayments && 
          <div>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Progress towards goals</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonItem>
                    <IonLabel color="grey">Total paid</IonLabel>
                    <IonText>{total} </IonText>
                </IonItem>
                <IonItem>
                    <IonLabel color="grey">Time spent paying loans</IonLabel>
                    <IonText>{timeSpent} month(s)</IonText>
                </IonItem>
              </IonCardContent>
            </IonCard>
            
            <IonList>
              {recentPayments.map((payment) => 
                <IonItem key={payment.loanId+payment.date}>
                  <IonText>{payment.loanId} {payment.amount} {payment.date}</IonText>
                </IonItem>
              )}
            </IonList>
          </div>
        }
        {otherPayments &&
          <div>
            <IonItem button onClick={() => {toggleInfo()}}>
              <IonLabel>View more payments</IonLabel>
              <IonIcon icon={icon}/>
            </IonItem>
            <div style={{ display: toggle ? "" : "none" }}>
              {otherPayments.map((payment) => 
                <IonItem key={payment.loanId+payment.date}>
                  <IonText>{payment.loanId} {payment.amount}{payment.date}</IonText>
                </IonItem>
              )}
            </div>
          </div>
        }
      </IonContent>
    </IonPage>
  );
};


export default PaymentHistory;
