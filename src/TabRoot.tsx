import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { barChart, wallet, list } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import NewLoan from './pages/NewLoan';
import Profile from './pages/Profile';
import Menu from './components/Menu'
import LogPayment from './pages/LogPayment';


const TabRoot: React.FC = () => {
  
  return(
    <IonReactRouter>
      <Menu></Menu>
      <IonTabs>
        <IonRouterOutlet id="main">
          <Route path="/tab1" component={Tab1} />
          <Route path="/tab2" component={Tab2} />
          <Route path="/tab3" component={Tab3} />
          <Route path="/newloan" component={NewLoan} />
          <Route path="/profile" component={Profile} />
          <Route path="/logpayment" component={LogPayment} />
          <Route path="/" render={() => <Redirect to="/tab1" />} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon icon={list} />
            <IonLabel>Select</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon icon={barChart} />
            <IonLabel>Overview</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon icon={wallet} />
            <IonLabel>Payments</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  )

}

export default TabRoot;



