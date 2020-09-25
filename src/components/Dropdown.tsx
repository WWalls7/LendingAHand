import React, { useState, useEffect } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLabel, IonIcon, IonButton, IonItem, IonInput, IonText } from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { Loan, Amortization } from './Types';
import { getPastDue, getAmortization } from '../services/Calculations'
import { toast } from '../components/toast'

interface ContainerProps {
  loan: Loan;
}

const Dropdown: React.FC<ContainerProps> = ({ loan }) => {
  const [toggle, setToggle] = useState<boolean>(false)
  const [icon, setIcon] = useState(chevronDown)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [interest, setInterest] = useState<number>(0)
  const [predictedTotal, setPredictedTotal] = useState(0)
  const [amortizationValues, setAmortization] = useState(null as Amortization[] | null)

  
  function toggleInfo() {
    setToggle(!toggle)
    if(icon === chevronDown){setIcon(chevronUp)}
    else{setIcon(chevronDown)}
  }

  function getValues() {
    if(paymentAmount > (Number(loan.currentInterest) + Number(loan.currentPrinciple))){
        toast("Amount must be less than loan balance", "danger")
        return
    }
    if(paymentAmount <= 0){
        toast("Amount must be greater than 0", "danger")
        return
    }
    getAmortization(loan, Number(paymentAmount)).then((response)=>{
        if(response.length > 0){
          setAmortization(response)
        }
    }).finally(()=> {})
  }

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
      setInterest(interest)
      setPredictedTotal(total)
    }
  },[amortizationValues])


  return (
    <div key={loan.id}>
        <IonItem color="grey" button onClick={() => {toggleInfo()}}>
            <IonLabel>{loan.name}</IonLabel>
            <IonIcon icon={icon}/>
        </IonItem>
        <div style={{ display: toggle ? "" : "none" }}>
            <IonCard>
            <IonCardHeader>
                <IonCardTitle>Explore different budgets</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {getPastDue(loan.startDate, loan.due, function() {console.log("complete")}) && (
                    <IonText>Loan overdue. Unable to explore budgets</IonText>
                )}
                {!getPastDue(loan.startDate, loan.due, function() {console.log("complete")}) && (
                    <div>
                        <IonItem>
                            <IonInput name="budget" placeholder="Monthly payment" type="number" onIonChange={(e: any) => setPaymentAmount (e.target.value as number)}></IonInput>
                            <IonButton fill="outline" slot="end" onClick={() => getValues()}>Calculate</IonButton>
                        </IonItem>
                        <IonItem>
                            <IonText>Predicted interest: {interest}</IonText>
                            <IonText>Predicted total paid: {predictedTotal}</IonText>
                        </IonItem>
                    </div>
                )}
            </IonCardContent>
            </IonCard>
        </div>
    </div>
  );
};

export default Dropdown;
