import React, { useState } from 'react';
import { IonFab, IonList, IonRadioGroup, IonRadio, IonItemDivider, IonIcon, IonFabButton, IonContent, IonHeader, IonPage, IonTitle, 
IonToolbar, IonItem, IonInput, IonLabel, useIonViewWillEnter } from '@ionic/react';
import { addProfileInfo, getProfileInfo } from '../services/Storage';
import { checkmark } from 'ionicons/icons';
import { toast } from '../components/toast';
import { User } from '../components/Types';

const Profile: React.FC = () => {

  const [budget, setBudget] = useState<string>('')
  const [currency, setCurrency] = useState<string>("GBP")

  // const [user, setUser] = useState(null as User | null)

  // useIonViewWillEnter(() => {
  //   const fetchData = () => {
  //       getProfileInfo().then((response)=>{
  //       if(response !== null){
  //           setUser(response)
  //       }
  //     }).finally(()=> {})
  //   } 
  //   fetchData();
  // })

  function add() {
    if(!budget.match("^[1-9]{1}[0-9]{0,6}([.][0-9]{2,2})?$")){
      toast("Budget must be greater than 0", "danger")
      return
    }

    addProfileInfo(budget, currency)
    toast("Profile information saved", "success")
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" color="primary">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
            <IonInput name="budget" placeholder="Monthly budget" type="number" onIonChange={(e: any) => setBudget (e.target.value)}></IonInput>
        </IonItem>

        <IonList>
            <IonRadioGroup value={currency} onIonChange={e => setCurrency(e.detail.value)}>
                <IonLabel>Preffered currency</IonLabel>
                <IonItem>
                    <IonLabel>GBP</IonLabel>
                    <IonRadio slot="start" value="GBP" />
                </IonItem>

                <IonItem>
                    <IonLabel>USD</IonLabel>
                    <IonRadio slot="start" value="USD" />
                </IonItem>
            </IonRadioGroup>
            <IonItemDivider></IonItemDivider>
        </IonList>
        
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => add()} >
            <IonIcon icon={checkmark}/>
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Profile;
