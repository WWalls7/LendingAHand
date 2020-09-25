import React from 'react';
import {IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { Loan } from './Types';
import Dropdown from '../components/Dropdown'

interface _Props {
    closeAction: Function;
    loans: Loan[];
}

class BudgetCalculator extends React.Component<_Props> {
  state = {
    show: false,
    paymentAmount: 0
  };

  render() {
    return <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Loan Overview</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => this.props.closeAction()}>
                <IonIcon name="close" slot="icon-only"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {this.props.loans &&
          this.props.loans.map((loan) =>
            <Dropdown loan={loan}/>
          )
        }
      </IonContent>
    </>
  };

}

export default ({closeAction, loans}: { closeAction: Function, loans: Loan[] }) => (
  <BudgetCalculator closeAction={closeAction} loans={loans}>
  </BudgetCalculator>
)