import React, { useState } from 'react';
import { IonFab, IonList, IonRadioGroup, IonRadio, IonItemDivider, IonIcon, IonFabButton, IonContent, IonHeader, IonPage, IonTitle, 
IonToolbar, IonItem, IonInput, IonLabel, IonDatetime, IonButton } from '@ionic/react';
import { addLoanToDB, getProgress } from '../services/Storage';
import { formatDate } from '../services/Calculations';
import { checkmark } from 'ionicons/icons';
import { toast } from '../components/toast';
import { Redirect } from 'react-router-dom';
import Picker from "../components/Picker";
import InterestPicker from "../components/InterestPicker";
import { addLoanToProgress } from '../services/HelperFunctions';
import '../theme/NewLoan.css'

const NewLoan: React.FC = () => {

  const [name, setName] = useState<string>('')
  const [principle, setPrinciple] = useState<string>('')
  const [interestPickerOpen, setInterestPickerOpen] = useState(false)
  const [interest, setInterest] = useState<string>('')
  const [date, setDate] = useState<string>("")
  const [type, setType] = useState<string>("amortized")
  const [interestType, setInterestType] = useState<string>("simple")
  const [duePickerOpen, setDuePickerOpen] = useState(false)
  const [due, setDue] = useState<number>(0)
  const [interestStartPicker, setInterestStartPicker] = useState(false)
  const [interestStart, setInterestStart] = useState<number>(0)
  const [currentInterest, setCurrentInterest] = useState<string>('')
  const [redirect, setRedirect] = useState<boolean>(false)
  const maxDay = formatDate()
  

  function add() {
    if(name === "" || principle === "" || interest === "" || date === "" || type === "" || interestType === "" || due === 0){
      toast("You must enter all fields marked with *", "danger")
      return
    }
    if(!principle.match("^[1-9]{1}[0-9]{0,6}([.][0-9]{2,2})?$")){
      toast("Principle must be greater than 0", "danger")
      return
    }
    if(due === 0){
      toast("Due date must be greater than 0 months", "danger")
      return
    }
    if(interestStart > due){
      toast("Interest may not accrue after the loan is due", "danger")
      return
    }
    if(!currentInterest.match("^[0-9]{0,7}([.][0-9]{2,2})?$")){
      toast("Current interest must be between 0 and 9999999.99", "danger")
      return
    }
    // if ((currentInterest !== "" && interestStart !== 0) || (!currentInterest.match("^[0]{1}([.][0]{1,2})?$") && interestStart !== 0)){
    //   console.log(currentInterest, interestStart)
    //   toast("Your current interest cannot be greater than 0 if interest hasn't started accruing yet", "danger")
    //   return
    // }
    var added = false
    addLoanToDB(name, principle, interest, date, type, due, interestStart, currentInterest, interestType).then((response)=>{
      console.log("progress", response)
      if(response){
        added = true
      }
    }).finally(()=> {
      if(added){
        getProgress().then((response)=>{
          console.log("progress", response)
          if(response.length > 0){
            addLoanToProgress()
          }
        }).finally(()=> {})
      }
    })
    setRedirect(true)
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Enter Loan Information</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" color="primary">
          <IonToolbar>
            <IonTitle size="large">Enter Loan Information</IonTitle>
          </IonToolbar>
        </IonHeader>
          <IonItem>
              <IonInput name="name" placeholder="Loan name *" onIonChange={(e: any) => setName (e.target.value)}></IonInput>
          </IonItem>

          <IonItem>
              <IonInput name="principle" placeholder="Current principle amount *" type="number" onIonChange={(e: any) => setPrinciple (e.target.value)}></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Interest *</IonLabel>
            <IonButton onClick={() => setInterestPickerOpen(true)}>Select interest</IonButton>
          </IonItem>

          <IonItem>
              <IonLabel color="grey">Start Date *</IonLabel>
              <IonDatetime name="date" placeholder={date} max={maxDay} onIonChange={(e: any) => setDate (e.target.value.substring(0, 10))}></IonDatetime>
          </IonItem>

          <IonItem>
              <IonLabel >Repayment term *</IonLabel>
              <IonButton onClick={() => setDuePickerOpen(true)}>Select term</IonButton>
          </IonItem>

          <IonList>
              <IonRadioGroup value={type} onIonChange={e => setType(e.detail.value)}>
                  <IonLabel className="radio-label">Loan type *</IonLabel>
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
                  <IonLabel className="radio-label">Interest type *</IonLabel>
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
      
          <IonItem>
              <IonLabel>Interest accrual start</IonLabel>
              <IonButton onClick={() => setInterestStartPicker(true)}>Select term</IonButton>    
          </IonItem>

          <IonItem>
              <IonInput name="currentInterest" placeholder="Current interest amount" type="number" onIonChange={(e: any) => setCurrentInterest (e.target.value)}></IonInput>
          </IonItem>
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => add()} >
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

        <Picker
          isOpen={interestStartPicker}
          onCancel={() => {
            setInterestStartPicker(false);
          }}
          onSave={(e: any) => {
            const term = Number(e.years.value)*12 + Number(e.months.value)
            setInterestStart(term);
            setInterestStartPicker(false);
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

        {redirect &&
        (<Redirect to='/tab1' />)
        }
      </IonContent>
    </IonPage>
  );
};

export default NewLoan;
