import React from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonTabs, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Loan } from './Types';
import { barChart, cashOutline, pencil } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import BasicInfo from '../pages/BasicInfo';
import { IonReactRouter } from '@ionic/react-router';
import EditLoan from '../pages/EditLoan';
import Amortizations from '../pages/Amortization';

interface _Props {
    closeAction: Function;
    loan: Loan;
}

class Overview extends React.Component<_Props> {
  state = {
    show: false
  };

  handleClick = () => {
    this.setState({
      show: true
    })
    console.log(this.props.loan)
  }

  render() {
    return <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Loan Overview</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={this.handleClick}><IonIcon icon={pencil} slot="icon-only"></IonIcon></IonButton>
            <IonButton onClick={() => this.props.closeAction()}>
                <IonIcon name="close" slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
                <Route path="/tab1/:tab(basicinfo)" render={() => <BasicInfo loan={this.props.loan}/>} />
                <Route path="/tab1/:tab(amortization)" render={() => <Amortizations loan={this.props.loan}/>}  />
                <Redirect from="/tab1" to="/tab1/basicinfo" />
            </IonRouterOutlet>
            <IonTabBar slot="top">
            <IonTabButton tab="basicinfo" href="/tab1/basicinfo">
                <IonIcon icon={barChart} />
                <IonLabel>Basic Information</IonLabel>
            </IonTabButton>
            <IonTabButton tab="amortization" href="/tab1/amortization">
                <IonIcon icon={cashOutline} />
                <IonLabel>Amortization</IonLabel>
            </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
        {this.state.show && <EditLoan loan={this.props.loan}/>}
      </IonContent>
    </>
  };

}

export default ({closeAction, loan}: { closeAction: Function, loan: Loan }) => (
  <Overview closeAction={closeAction} loan={loan}>
  </Overview>
)