import React, { useState, useEffect } from 'react';
import { IonFab, IonList, IonIcon, IonFabButton, IonContent, IonHeader, IonPage, IonTitle, IonButton,
IonToolbar, IonItem, IonInput, IonLabel, useIonViewWillEnter,IonDatetime, IonSelect, IonSelectOption, IonAlert } from '@ionic/react';
import { Redirect } from 'react-router-dom';
import { getLoans, getPaymentHistory, getInterestHistory } from '../services/Storage';
import { formatDate, addPaymentUpdateBalance, formatGivenDate } from '../services/Calculations';
import { getSelected, addPaymentToProgress } from '../services/HelperFunctions';
import { checkmark } from 'ionicons/icons';
import { toast } from '../components/toast';
import { Loan, Payment } from '../components/Types';

const LogPayment: React.FC = () => {

  const [loans, setLoans] = useState(null as Loan[] | null)
  const [payments, setPayments] = useState(null as Payment[] | null)
  const [lastInterest, setLastInterest] = useState("")
  const [loan, setLoan] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [payment, setPayment] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [selected, setSelected] = useState<Loan>()
  const [redirect, setRedirect] = useState<boolean>(false)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [showAlert1, setShowAlert1] = useState<boolean>(false)
  const maxDay = formatDate()

  useIonViewWillEnter(() => {
    const fetchData = () => {
      getLoans().then((response)=>{
        if(response.length > 0){
          setLoans(response)
        }
      }).finally(()=> {})
    } 
    fetchData();
    // setLoan('')
    // setAmount('')
    // setDate('')
    // setRedirect(false)
    // console.log(loan, amount, date, redirect)
  })

  useEffect(() => {
      const fetchData = () => {
        getPaymentHistory(loan).then((response)=>{
          if(response.length > 0){
            setPayments(response)
          }
        }).finally(()=> {
          setLastInterest(getSelected(loans, loan).startDate)
        })
        getInterestHistory(Number(loan)).then((response)=>{
          if(response.length > 0){
            setLastInterest(response[response.length-1].date)
          }
        }).finally(()=> {})
      } 
      fetchData()
      setSelected(getSelected(loans, loan))
  },[loan])

  useEffect(() => {
    if(selected){
      setPayment(selected.requiredPayment)
    }
  },[selected])

  function add() {
    if(selected){
      var balance =  Number(selected.currentInterest) + Number(selected.currentPrinciple)
      var dates = []
      if(payments !== null){
          for(var i = 0; i < payments.length; i++){
              dates.push(payments[i].date)
          }
      }

      if(loan === "" || amount === "" || date === ""){
          toast("You must fill out all fields", "danger")
          return
          }
      if(!amount.match("^[1-9]{1}[0-9]{0,6}([.][0-9]{2,2})?$")){
      toast("Amount paid must be greater than 0", "danger")
      return
      }
      if(Number(amount) > balance){
          toast("Amount paid can not be greater than loan balance", "danger")
          return
      }
      if(dates.includes(date)){
          toast("You have already logged a payment on the selected day", "danger")
          return
      }
      setShowAlert(true)
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Log Payment</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" color="primary">
          <IonToolbar>
            <IonTitle size="large">Log Payment</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonItem>
          <IonLabel>Loan *</IonLabel>
          <IonSelect onIonChange={e => setLoan(e.detail.value)}>
            {loans && (
              <IonList>
                {loans && loans.map((loan) => <IonSelectOption key={loan.id} value={loan.id}>{loan.name}</IonSelectOption>)}
              </IonList>
            )} 
          </IonSelect>
        </IonItem>
        {loan && selected &&
          <div>
            <IonItem>
              <IonLabel color="grey">Amount paid *</IonLabel>
              <IonInput name="amount" value={payment} type="number" onIonChange={(e: any) => setAmount (e.target.value)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel color="grey">Date payment was made *</IonLabel>
              <IonDatetime name="date" placeholder={date} min={lastInterest} max={maxDay} onIonChange={(e: any) => setDate (e.target.value.substring(0, 10))}></IonDatetime>
            </IonItem>
          </div>
        }

        <IonButton onClick={() => setShowAlert1(true)}>Quick log payments</IonButton>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => add()} >
            <IonIcon icon={checkmark}/>
          </IonFabButton>
        </IonFab>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass='my-custom-class'
          header={'Confirm payment'}
          message={'Payments cannot be deleted. Please ensure all fields are correct.'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Confirm',
              handler: () => {
                if(selected){
                  var currentPrinciple = Number(selected.currentPrinciple)
                  var currentInterest = Number(selected.currentInterest)
                  addPaymentUpdateBalance(loan, currentPrinciple, currentInterest, amount, date)
                  addPaymentToProgress(Number(amount), loans? loans:[])
                  setRedirect(true)
                }
              }
            }
          ]}
        />

        <IonAlert
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          cssClass='my-custom-class'
          header={'Confirm payment'}
          message={'This will log payments for all loans using the reccomended payment amount. Payments cannot be deleted. Are you sure you want to continue?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: 'Confirm',
              handler: () => {
                if(loans){
                  var currentPrinciple
                  var currentInterest 
                  var id
                  var amount
                  var date = formatGivenDate(new Date())
                  var totalAmount = 0
                  for(var i = 0; i<loans.length; i++){
                    currentPrinciple = Number(loans[i].currentPrinciple)
                    currentInterest = Number(loans[i].currentInterest)
                    id = loans[i].id.toString()
                    amount = loans[i].requiredPayment
                    totalAmount += Number(amount)
                    addPaymentUpdateBalance(id, currentPrinciple, currentInterest, amount, date)
                  }
                  addPaymentToProgress(totalAmount, loans)
                  setRedirect(true)
                }
              }
            }
          ]}
        />

        {redirect &&
        (<Redirect to='/tab3/progress' />)
        }

      </IonContent>
    </IonPage>
  );
};

export default LogPayment;
