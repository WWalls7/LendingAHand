import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonText, IonButton, IonFab, IonFabButton, IonIcon,
useIonViewWillEnter, IonButtons, IonMenuButton, IonModal, IonItemSliding, IonItemOptions, IonItemOption, IonLoading } from '@ionic/react';
import { add, trash, informationCircle } from 'ionicons/icons';
import { getLoans, deleteLoan } from '../services/Storage';
import ExploreContainer from '../components/ExploreContainer'
import { Loan } from '../components/Types';
import Overview from '../components/Overview'
import { updateInterest } from '../services/HelperFunctions';
import '../theme/Tab1.css';

const Tab1: React.FC = () => {

  const [loans, setLoans] = useState(null as Loan[] | null)
  const [clickedLoan, setClicked] = useState<Loan>()
  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const fetchData = () => {
    getLoans().then((response)=>{
      console.log(response)
      if(response.length > 0){
        setLoans(response)
      }
    }).finally(()=> {setShowLoading(false)})
  }

  useIonViewWillEnter(() => {
    setShowLoading(true)
    updateInterest(function() {
      fetchData()
    })  
  })

  function remove(loan: Loan) {
    deleteLoan(loan.id)
    if(loans){
     setLoans(loans.filter(item => item.id !== loan.id))
    }
  }

  function openModal(loan: Loan) {
    setShowModal(true)
    setClicked(loan)
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
            <IonMenuButton autoHide={false}></IonMenuButton>
          </IonButtons>
          <IonTitle>Select A Loan</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonLoading isOpen={showLoading} message={'Please wait...'} />
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

        {!loans && (
            <ExploreContainer name="No Loans" />
        )}
        {loans && loans.length === 0 && (
            <ExploreContainer name="No Loans" />
        )}
        {loans && (
            <IonList>
                {loans.map((loan) =>
                <IonItemSliding key={loan.id} >
                  <IonItem key={loan.id} >
                    <IonText>id: {loan.id} Name: {loan.name} principle: {Number(loan.currentPrinciple)} min payment: {loan.requiredPayment} date: {loan.startDate}</IonText>
                    <IonButton fill="outline" slot="end" onClick={() => openModal(loan)}><IonIcon icon={informationCircle}/></IonButton>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption color="danger" onClick={() => remove(loan)}>Remove<IonIcon slot="end" icon={trash}/></IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
                )}
            </IonList>
        )}  
        {clickedLoan && 
          <IonModal isOpen={showModal}>
            <Overview closeAction={closeModal} loan={clickedLoan} />
          </IonModal>
        }
     
      </IonContent>
    </IonPage>
  );
};


export default Tab1;
