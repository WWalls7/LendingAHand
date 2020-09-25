import React, { useState } from 'react';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonText, IonIcon, useIonViewWillEnter, IonRange, IonItemDivider } from '@ionic/react';
import { getPaymentHistory, getInterestHistory } from '../services/Storage';
import { chevronDown, chevronUp, remove, add } from 'ionicons/icons';
import { Loan, Payment, Interest } from '../components/Types';
import { formatGivenDate, addMonths, getXAxis, getBalance, getPredicted } from '../services/Calculations';
import { Doughnut, Line} from 'react-chartjs-2';

interface _Props {
    loan: Loan;
}

const BasicInfo: React.FC<_Props> = ({loan}) => {
  const [toggle, setToggle] = useState<boolean>(false)
  const [icon, setIcon] = useState(chevronDown)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [payments, setPayments] = useState(null as Payment[] | null)
  const [interests, setInterests] = useState(null as Interest[] | null)
  
  const balances = {
    labels: getXAxis(true, loan.startDate),
    datasets: [
      {
        label: 'After payment',
        lineTension: 0.1,
        backgroundColor: 'rgba(144,238,144,1)', // green
        borderColor: 'rgba(144,238,144,1)',
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(144,238,144,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(144,238,144,1)',
        pointHoverBorderColor: 'rgba(144,238,144,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        data: getBalance(payments ? payments : [], loan.startingPrinciple, interests ? interests : [], loan.startDate, "0")
      },
      {
        label: 'Before payment',
        lineTension: 0.1,
        backgroundColor: 'rgba(220,20,60,0.5)', // red
        borderColor: 'rgba(220,20,60,0.5)',
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(220,20,60,0.5)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(220,20,60,0.5)',
        pointHoverBorderColor: 'rgba(220,20,60,0.5)',
        pointHoverBorderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        data: getBalance([], loan.startingPrinciple, interests ? interests : [], loan.startDate, "0")
      }
    ]
  }

  function getPredictedBalance() {
    return {
      labels: getXAxis(false, loan.startDate),
      datasets: [
        {
          label: 'With payments',
          lineTension: 0.1,
          backgroundColor: 'rgba(144,238,144,1)', // green
          borderColor: 'rgba(144,238,144,1)',
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(144,238,144,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(144,238,144,1)',
          pointHoverBorderColor: 'rgba(144,238,144,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 0,
          pointHitRadius: 10,
          data: getPredicted(paymentAmount, loan.currentPrinciple, Number(loan.interestStart), loan.interestRate, loan.startDate, loan.currentInterest, loan.interestType, loan.due, loan.type)
        },
        {
          label: 'Without payments',
          lineTension: 0.1,
          backgroundColor: 'rgba(220,20,60,0.5)', // red
          borderColor: 'rgba(220,20,60,0.5)',
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(220,20,60,0.5)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(220,20,60,0.5)',
          pointHoverBorderColor: 'rgba(220,20,60,0.5)',
          pointHoverBorderWidth: 2,
          pointRadius: 0,
          pointHitRadius: 10,
          data: getPredicted(0, loan.currentPrinciple, Number(loan.interestStart), loan.interestRate, loan.startDate, loan.currentInterest, loan.interestType, loan.due, loan.type)
        }
      ]
    }
  }

  useIonViewWillEnter(() => {
    const fetchData = () => {
      getPaymentHistory(loan.id.toString()).then((response)=>{
        if(response.length > 0){
          setPayments(response)
        }
      }).finally(()=> {})
      getInterestHistory(loan.id).then((response)=>{
        if(response.length > 0){
          setInterests(response)
        }
      }).finally(()=> {})
    } 
    fetchData();
  })
  

  function toggleInfo() {
    setToggle(!toggle)
    if(icon === chevronDown){setIcon(chevronUp)}
    else{setIcon(chevronDown)}
  }
  
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Loan details</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
                <IonLabel color="grey">Name</IonLabel>
                <IonText>{loan.name}</IonText>
            </IonItem>
            <IonItem>
                <IonLabel color="grey">Current principle</IonLabel>
                <IonText>{loan.currentPrinciple}</IonText>
            </IonItem>
            <IonItem>
                <IonLabel color="grey">Current interest</IonLabel>
                <IonText>{loan.currentInterest}</IonText>
            </IonItem>
            <IonItem>
                <IonLabel color="grey">Interest rate</IonLabel>
                <IonText>{loan.interestRate}</IonText>
            </IonItem>
            <IonItem color="grey" button onClick={() => {toggleInfo()}}>
              <IonLabel>additional details</IonLabel>
              <IonIcon icon={icon}/>
            </IonItem>

            <div style={{ display: toggle ? "" : "none" }}>
              <IonItem>
                  <IonLabel color="grey">Start date</IonLabel>
                  <IonText>{loan.startDate}</IonText>
              </IonItem>
              <IonItem>
                  <IonLabel color="grey">Due date</IonLabel>
                  <IonText>{formatGivenDate(addMonths(new Date(loan.startDate), Number(loan.due)))}</IonText>
              </IonItem>
              <IonItem>
                  <IonLabel color="grey">Loan type</IonLabel>
                  <IonText>{loan.type}</IonText>
              </IonItem>
              <IonItem>
                  <IonLabel color="grey">Interest type</IonLabel>
                  <IonText>{loan.interestType}</IonText>
              </IonItem>
              <IonItem>
                  <IonLabel color="grey">Starting principle</IonLabel>
                  <IonText>{loan.startingPrinciple}</IonText>
              </IonItem>
              {loan.startingInterest !== "" &&
                <IonItem>
                    <IonLabel color="grey">Starting interest</IonLabel>
                    <IonText>{loan.startingInterest}</IonText>
                </IonItem>
              }
              {loan.startingInterest === "" &&
                <IonItem>
                    <IonLabel color="grey">Starting interest</IonLabel>
                    <IonText>0</IonText>
                </IonItem>
              }
              {loan.interestStart !== "0" &&
                <IonItem>
                    <IonLabel color="grey">Interest begins accruing on</IonLabel>
                    <IonText>{formatGivenDate(addMonths(new Date(loan.startDate), Number(loan.interestStart)))}</IonText>
                </IonItem>
              }
              {addMonths(new Date(loan.startDate), Number(loan.due)) > new Date() &&
                <IonItem>
                    <IonLabel color="grey">Required payment</IonLabel>
                    <IonText>{loan.requiredPayment}</IonText>
                </IonItem>
              }
              {addMonths(new Date(loan.startDate), Number(loan.due)) <= new Date() &&
                <IonItem>
                    <IonLabel color="grey">Required payment</IonLabel>
                    <IonText>Overdue</IonText>
                </IonItem>
              }
              {loan.recommendedPayment &&
                <IonItem>
                    <IonLabel color="grey">Recommended payment</IonLabel>
                    <IonText>{loan.recommendedPayment}</IonText>
                </IonItem>
              }
            </div>
          </IonCardContent>
        </IonCard>
        <Doughnut data={{
          labels: ["Principle", "Interest"],
          datasets: [
            {
              backgroundColor: ["#3e95cd", "#8e5ea2"],
              data: [Number(loan.currentPrinciple), Number(loan.currentInterest)]
            }
          ]
        }} options={{
          title: {
            display: true,
            text: 'Principle vs interest'
          }
        }} />
        {interests &&
          <div>
            <Line data={balances} 
            options={{
              scales: {
                  xAxes: [{
                      gridLines: {
                          display:false
                      }
                  }],
                  yAxes: [{
                      gridLines: {
                          display:false
                      }   
                  }]
              }, title: {
                display: true,
                text: 'Balance'
              }
            }}/>
          </div>
        }
        {!interests &&
          <p>You have no interest history</p>
        }

        <IonItemDivider></IonItemDivider>
        
        <IonLabel>Monthly Payment</IonLabel>
        <IonRange min={0} max={1000} pin={true} value={paymentAmount} onIonChange={e => setPaymentAmount(e.detail.value as number)}>
          <IonIcon slot="start" icon={remove}></IonIcon>
          <IonIcon slot="end" icon={add}></IonIcon>
        </IonRange>

        <Line data={getPredictedBalance()} 
          options={{
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display:false
                    }   
                }]
            }, title: {
              display: true,
              text: 'Predicted balance'
            }
        }}/>
        
      </IonContent>
    </IonPage>
  );
  
};


export default BasicInfo;
