import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonText, IonIcon, useIonViewWillEnter,
  IonRange, IonItemDivider, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonLoading, IonButton, IonModal } from '@ionic/react';
import { getLoans, getAllInterests, getAllPayments } from '../services/Storage';
import { chevronDown, chevronUp, add, remove, calculatorOutline } from 'ionicons/icons';
import { Loan, Payment, Interest, LineData, DoughnutData } from '../components/Types';
import { formatGivenDate, addMonths, getXAxis, getBalance, getPredicted } from '../services/Calculations';
import { Doughnut, Line} from 'react-chartjs-2';
import ExploreContainer from '../components/ExploreContainer'
import BudgetCalculator from '../components/BudgetCalculator'

const Tab2: React.FC = () => {
  const [payments, setPayments] = useState(null as Payment[] | null)
  const [interests, setInterests] = useState(null as Interest[] | null)
  const [loans, setLoans] = useState(null as Loan[] | null)
  const [showLoading, setShowLoading] = useState(false);
  const [toggle, setToggle] = useState<boolean>(false)
  const [icon, setIcon] = useState(chevronDown)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [loanTotals, setLoanTotals] = useState<Loan>()
  const [lineData1, setLineData1] = useState<LineData>()
  const [doughnutData, setDoughnutData] = useState<DoughnutData>({labels: [], datasets:[{
    backgroundColor: ["#808B96", "#DC7633", "#BB8FCE", "#EC7063", "#76D7C4", "#F7DC6F", "#16A085", "#229954", "#2471A3", "#943126"],
    data: []}]})
  const [showModal, setShowModal] = useState(false);

  const fetchData = () => {
    getLoans().then((response0)=>{
      if(response0.length > 0){
        setLoans(response0)
      }
      else{setShowLoading(false)}
    }).finally(()=> {
      getAllPayments().then((response1)=>{
        if(response1.length > 0){
          setPayments(response1)
        }
        else{setShowLoading(false)}
      }).finally(()=> {
        getAllInterests().then((response2)=>{
          if(response2.length > 0){
            setInterests(response2)
          }
          else{setShowLoading(false)}
        }).finally(()=> {})
      })
    })
  }

  useIonViewWillEnter(() => {
    setShowLoading(true)
    fetchData()  
  })

  useEffect(() => {
    if(loans){
      var currentPrinciple = 0
      var startingPrinciple = 0
      var startDate = new Date(loans[0].startDate)
      var dueDate = addMonths(startDate, Number(loans[0].due))
      var currentInterest = 0
      var startingInterest = 0
      var requiredPayment = 0
      var payments: number[] = []
      var names: string[] = []
      for(var i = 0; i<loans.length; i++){
        currentPrinciple += Number(loans[i].currentPrinciple)
        startingPrinciple += Number(loans[i].startingPrinciple)
        if(new Date(loans[i].startDate) < startDate){
          startDate = new Date(loans[i].startDate)
        }
        if(addMonths(new Date(loans[i].startDate), Number(loans[i].due)) > dueDate){
          dueDate = addMonths(new Date(loans[i].startDate), Number(loans[i].due)) 
        }
        currentInterest += Number(loans[i].currentInterest)
        startingInterest += Number(loans[i].startingInterest)
        if(Number(loans[i].requiredPayment)){
          requiredPayment += Number(loans[i].requiredPayment)
          payments.push(Number(loans[i].requiredPayment))
          names.push(loans[i].name)
        }
      }
      currentPrinciple = +((currentPrinciple).toFixed(2))
      startingPrinciple = +((startingPrinciple).toFixed(2))
      var startDateString = formatGivenDate(startDate)
      var dueDateString = formatGivenDate(dueDate)
      currentInterest = +((currentInterest).toFixed(2))
      startingInterest = +((startingInterest).toFixed(2))
      requiredPayment = +((requiredPayment).toFixed(2))

      setLoanTotals({id: -1, name: '', currentPrinciple: currentPrinciple.toString(), startingPrinciple: startingPrinciple.toString(), 
        interestRate: '', startDate: startDateString, type: '', interestType: '', due: dueDateString, interestStart: '', currentInterest: currentInterest.toString(), 
        startingInterest: startingInterest.toString(), requiredPayment: requiredPayment.toString(), recommendedPayment: ''})
      setDoughnutData({labels: names, datasets:[{
        backgroundColor: [...doughnutData.datasets[0].backgroundColor],
        data: payments
      }]})

      setShowLoading(false)
    }
  },[loans])

  useEffect(() => {
    if(interests && loanTotals){
      setLineData1({
        labels: getXAxis(true, loanTotals.startDate),
        datasets: [{
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
          data: getBalance(payments ? payments : [], loanTotals.startingPrinciple, interests, loanTotals.startDate, loanTotals.startingInterest)
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
          data: getBalance([], loanTotals.startingPrinciple, interests, loanTotals.startDate, loanTotals.startingInterest)
        }
      ]})
    }
    setShowLoading(false)
  },[interests])
  
  function getPredictedBalance() {
    if(loanTotals){
      return {
        labels: getXAxis(false, loanTotals.startDate),
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
            data: getPredicted(paymentAmount, loanTotals.currentPrinciple, Number(loanTotals.interestStart), loanTotals.interestRate, 
            loanTotals.startDate, loanTotals.currentInterest, loanTotals.interestType, loanTotals.due, loanTotals.type)
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
            data: getPredicted(0, loanTotals.currentPrinciple, Number(loanTotals.interestStart), loanTotals.interestRate, loanTotals.startDate, 
            loanTotals.currentInterest, loanTotals.interestType, loanTotals.due, loanTotals.type)
          }
        ]
      }
    }
  }

  function toggleInfo() {
    setToggle(!toggle)
    if(icon === chevronDown){setIcon(chevronUp)}
    else{setIcon(chevronDown)}
  }

  function openModal() {
    setShowModal(true)
  }

  async function closeModal() {
    await setShowModal(false);
    fetchData()
  }
  
  return (
    <IonPage>
       <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="end">
            <IonButton onClick={() => openModal()}><IonIcon icon={calculatorOutline} slot="icon-only"></IonIcon></IonButton>
            <IonMenuButton autoHide={false}></IonMenuButton>
          </IonButtons>
          <IonTitle>Complete loan overview</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={showLoading} message={'Please wait...'} />
        {!loans && (
          <ExploreContainer name="No Loans" />
        )}
        {loans && loans.length === 0 && (
          <ExploreContainer name="No Loans" />
        )}
        {loans && loanTotals && (
          <IonCard>
           <IonCardHeader>
             <IonCardTitle>Overview</IonCardTitle>
           </IonCardHeader>
           <IonCardContent>
             <IonItem>
                 <IonLabel color="grey">Total loans</IonLabel>
                 <IonText>{loans.length}</IonText>
             </IonItem>
             <IonItem>
                 <IonLabel color="grey">Current total principle</IonLabel>
                 <IonText>{loanTotals.currentPrinciple}</IonText>
             </IonItem>
             <IonItem>
                 <IonLabel color="grey">Current total interest</IonLabel>
                 <IonText>{loanTotals.currentInterest}</IonText>
             </IonItem>
             <IonItem color="grey" button onClick={() => {toggleInfo()}}>
               <IonLabel>additional details</IonLabel>
               <IonIcon icon={icon}/>
             </IonItem>
 
             <div style={{ display: toggle ? "" : "none" }}>
               <IonItem>
                   <IonLabel color="grey">Ealiest start date</IonLabel>
                   <IonText>{loanTotals.startDate}</IonText>
               </IonItem>
               <IonItem>
                   <IonLabel color="grey">Latest due date</IonLabel>
                   <IonText>{loanTotals.due}</IonText>
               </IonItem>
               <IonItem>
                   <IonLabel color="grey">Total starting principle</IonLabel>
                   <IonText>{loanTotals.startingPrinciple}</IonText>
               </IonItem>
               {loanTotals.startingInterest !== "" &&
                 <IonItem>
                     <IonLabel color="grey">Total starting interest</IonLabel>
                     <IonText>{loanTotals.startingInterest}</IonText>
                 </IonItem>
               }
               {loanTotals.startingInterest === "" &&
                 <IonItem>
                     <IonLabel color="grey">Total starting interest</IonLabel>
                     <IonText>0</IonText>
                 </IonItem>
               }
               <IonItem>
                     <IonLabel color="grey">Total required monthly payment</IonLabel>
                     <IonText>{loanTotals.requiredPayment}</IonText>
                 </IonItem>
             </div>
           </IonCardContent>
         </IonCard>
        )}  
        {loanTotals && (
          <Doughnut data={{
            labels: ["Total principle", "Total interest"],
            datasets: [
              {
                backgroundColor: ["#3e95cd", "#8e5ea2"],
                data: [Number(loanTotals.currentPrinciple), Number(loanTotals.currentInterest)]
              }
            ]
          }} options={{
            title: {
              display: true,
              text: 'Total principle vs interest'
            }
          }} />
        )} 
        {loanTotals && (
          <Doughnut data={doughnutData} options={{
            title: {
              display: true,
              text: 'Budget split'
            }
          }} />
        )} 
        {interests && loanTotals &&
          <div>
            <Line data={lineData1} 
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
        {interests && loanTotals &&
          <div>
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
          </div>
        }
        {!interests &&
          <p>You have no interest history</p>
        }
        {showModal && loans &&
          <IonModal isOpen={showModal}>
            <BudgetCalculator closeAction={closeModal} loans={loans} />
          </IonModal>
        }
      </IonContent>
    </IonPage>
  );
  
};


export default Tab2;
