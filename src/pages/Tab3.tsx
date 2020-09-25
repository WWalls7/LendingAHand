import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, useIonViewWillEnter,
  IonMenuButton, IonButtons, IonTabs, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet } from '@ionic/react';
import { add } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';
import { Loan, Payment } from '../components/Types';
import { getLoans, getAllPayments } from '../services/Storage';
import { trendingUp, cashOutline } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import PaymentHistory from '../pages/PaymentHistory';
import Progress from '../pages/Progress';
import { IonReactRouter } from '@ionic/react-router';


const Tab3: React.FC = () => {
  const [loans, setLoans] = useState(null as Loan[] | null)
  const [payments, setPayments] = useState(null as Payment[] | null)

  useIonViewWillEnter(() => {
    const fetchData = () => {
      getLoans().then((response)=>{
        if(response.length > 0){
          setLoans(response)
        }
      }).finally(()=> {})
      getAllPayments().then((response)=>{
        if(response.length > 0){
          setPayments(response)
        }
      }).finally(()=> {})
    } 
    fetchData()
  })


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="end">
            <IonMenuButton autoHide={false}></IonMenuButton>
          </IonButtons>
          <IonTitle>Log Payments</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense" color="primary">
          <IonToolbar>
            <IonTitle size="large">Log Payments</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/logpayment">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {!loans && (
          <ExploreContainer name="No loans saved. Please enter a loan to begin" />
        )}
        {loans && loans.length === 0 && (
          <ExploreContainer name="No loans saved. Please enter a loan to begin" />
        )}
        {!payments && (
          <ExploreContainer name="No payments saved. Please enter a payment to begin" />
        )}
        {payments && payments.length === 0 && (
          <ExploreContainer name="No payments saved. Please enter a payment to begin" />
        )}
        {payments && loans && ( 
          <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
                <Route path="/tab3/:tab(paymenthistory)" render={() => <PaymentHistory payments={payments} />} />
                <Route path="/tab3/:tab(progress)" render={() => <Progress loans={loans}  />}  />
                <Redirect from="/tab3" to="/tab3/paymenthistory" />
            </IonRouterOutlet>
            <IonTabBar slot="top">
            <IonTabButton tab="paymenthistory" href="/tab3/paymenthistory">
                <IonIcon icon={cashOutline} />
                <IonLabel>Payment History</IonLabel>
            </IonTabButton>
            <IonTabButton tab="progress" href="/tab3/progress">
                <IonIcon icon={trendingUp} />
                <IonLabel>Progress</IonLabel>
            </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
            
        )}  

      </IonContent>
    </IonPage>
  );
};

export default Tab3;
