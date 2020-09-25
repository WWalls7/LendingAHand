import React, { useState } from 'react';
import { IonFab, IonList, IonRadioGroup, IonRadio, IonItemDivider, IonIcon, IonFabButton, IonContent, IonItem, IonInput, IonLabel, IonButton } from '@ionic/react';
import { updateLoan } from '../services/Storage';
import { calcMinPayment } from '../services/Calculations';
import { checkmark } from 'ionicons/icons';
import Picker from "../components/Picker";
import InterestPicker from "../components/InterestPicker";
import { Loan } from '../components/Types';
import { toast } from '../components/toast';

interface _Props {
    loan: Loan;
}

const EditLoan: React.FC<_Props> = ({loan}) => {

  const [name, setName] = useState<string>(loan.name)
  const [interestPickerOpen, setInterestPickerOpen] = useState(false)
  const [interest, setInterest] = useState<string>(loan.interestRate)
  const [type, setType] = useState<string>(loan.type)
  const [interestType, setInterestType] = useState<string>(loan.interestType)
  const [duePickerOpen, setDuePickerOpen] = useState(false)
  const [due, setDue] = useState<number>(Number(loan.due))
  

  function update() {
    calcMinPayment(loan.id, loan.currentPrinciple, loan.startDate, due, loan.currentInterest, loan.type, loan.interestRate, function() {
      console.log("done")
    })

    updateLoan(loan.id, name, "name")
    updateLoan(loan.id, interest, "interestRate")
    updateLoan(loan.id, type, "type")
    updateLoan(loan.id, interestType, "interestType")
    updateLoan(loan.id, due.toString(), "due")
    toast("Loan successfully updated", "success")
  }


  return (
    <IonContent>
        <IonItem>
            <IonInput name="name" placeholder={name} onIonChange={(e: any) => setName (e.target.value)}></IonInput>
        </IonItem>

        <IonItem>
            <IonInput name="interest" placeholder={interest} type="number" onIonChange={(e: any) => setInterest (e.target.value)}></IonInput>
        </IonItem>
        <IonItem>
            <IonLabel>Interest</IonLabel>
            <IonButton onClick={() => setInterestPickerOpen(true)}>Select interest</IonButton>
        </IonItem>

        <IonItem>
            <IonLabel>Repayment term</IonLabel>
            <IonButton onClick={() => setDuePickerOpen(true)}>Select term</IonButton>
        </IonItem>

        <IonList>
            <IonRadioGroup value={type} onIonChange={e => setType(e.detail.value)}>
                <IonLabel className="radio-label">Loan type</IonLabel>
                <IonItem>
                  <IonLabel>Amortized</IonLabel>
                  <IonRadio slot="start" value="amortized" />
                </IonItem>

                <IonItem>
                  <IonLabel>Interest only (lump sum due at end)</IonLabel>
                  <IonRadio slot="start" value="IO" />
                </IonItem>
            </IonRadioGroup>
          <IonItemDivider></IonItemDivider>
        </IonList>

        <IonList>
            <IonRadioGroup value={interestType} onIonChange={e => setInterestType(e.detail.value)}>
                <IonLabel className="radio-label">Interest type</IonLabel>
                <IonItem>
                  <IonLabel>Simple</IonLabel>
                  <IonRadio slot="start" value="simple" />
                </IonItem>

                <IonItem>
                  <IonLabel>Compound</IonLabel>
                  <IonRadio slot="start" value="compound" />
                </IonItem>

            </IonRadioGroup>
          <IonItemDivider></IonItemDivider>
          </IonList>
      
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => update()} >
          <IonIcon icon={checkmark}/>
        </IonFabButton>
      </IonFab>


      <Picker
        isOpen={duePickerOpen}
        onCancel={() => {
          setDuePickerOpen(false);
        }}
        onSave={(e: any) => {
          const term = Number(e.years.value)*12 + Number(e.months.value)
          setDue(term);
          setDuePickerOpen(false);
        }}
      />

      <InterestPicker
        isOpen={interestPickerOpen}
        onCancel={() => {
          setInterestPickerOpen(false);
        }}
        onSave={(e: any) => {
          const percent = e.first.value + e.second.value + e.third.value
          console.log(percent)
          setInterest(percent);
          setInterestPickerOpen(false);
        }}
      />
    </IonContent>
  );
};

export default EditLoan;
