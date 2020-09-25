import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, useIonViewWillEnter, IonCard, IonCardHeader, IonCardTitle, IonLoading } from '@ionic/react';
import { Loan, Amortization } from '../components/Types';
import { getPastDue, getAmortization } from '../services/Calculations'
import ExploreContainer from '../components/ExploreContainer'

interface _Props {
    loan: Loan;
}

const Amortizations: React.FC<_Props> = ({loan}) => {

  const [amortizationValues, setAmortization] = useState(null as Amortization[] | null)
  const [pastDue, setPastDue] = useState<boolean>(true)
  const [predictedInterest, setPredictedInterest] = useState(0)
  const [predictedTotal, setPredictedTotal] = useState(0)
  const [showLoading, setShowLoading] = useState(false);

  useIonViewWillEnter(() => {
    const fetchData = () => {
      getAmortization(loan, Number(loan.requiredPayment)).then((response)=>{
        if(response.length > 0){
          setShowLoading(true)
          setAmortization(response)
        }
      }).finally(()=> {})
    }
    const fetchDue = () => {
      setPastDue(getPastDue(loan.startDate, loan.due, function() {
        fetchData()
      }))
    }
    fetchDue()
  })

  useEffect(() => {
    if(amortizationValues){
      var interest = 0
      var total = 0
      for(var i = 0; i<amortizationValues.length; i++){
        interest += amortizationValues[i].interest
        total += amortizationValues[i].interest + amortizationValues[i].principle
      }
      interest = +((interest).toFixed(2))
      total = +((total).toFixed(2))
      setPredictedInterest(interest)
      setPredictedTotal(total)
      setShowLoading(false)
    }
  },[amortizationValues])

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonLoading isOpen={showLoading} message={'Please wait...'} />
        {pastDue && (
            <ExploreContainer name="Loan overdue. Amortization unavailable" />
        )}
        {amortizationValues && !pastDue &&
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Payment amount: {amortizationValues[0].amount}</IonCardTitle>
              <IonCardTitle>Predicted interest accrued: {predictedInterest}</IonCardTitle>
              <IonCardTitle>Predicted total payments: {predictedTotal}</IonCardTitle>
            </IonCardHeader>
          </IonCard> 
        }
        {amortizationValues && !pastDue &&
          <IonGrid fixed={true}>
            <IonRow>
              <IonCol>Month</IonCol>
              <IonCol>Interest</IonCol>
              <IonCol>Principle</IonCol>
              <IonCol>Balance</IonCol>
            </IonRow>
            {amortizationValues.map(row => {
              return(
                <IonRow key={row.month}>
                  <IonCol>{row.month}</IonCol>
                  <IonCol>{row.interest}</IonCol>
                  <IonCol>{row.principle}</IonCol>
                  <IonCol>{row.balance}</IonCol>
                </IonRow>
              )
            })}
          </IonGrid>
        }
      </IonContent>
    </IonPage>
  );
};


export default Amortizations;
