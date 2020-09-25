import React from "react";
import { withRouter } from "react-router-dom";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonMenuToggle,
  IonLabel
} from "@ionic/react";

const Menu = () => {
  return (
    <IonMenu  side="end" content-id="main">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="outer-content">
        <IonList>
          <IonMenuToggle key="pg1" auto-hide="false">
            <IonItem button routerLink="/profile">
              <IonLabel>Profile</IonLabel>
            </IonItem>
          </IonMenuToggle>
          {/* <IonMenuToggle auto-hide="false">
            <IonItem button onClick={() => console.log("2")}>
              <IonLabel>PAGE TWO</IonLabel>
            </IonItem>
          </IonMenuToggle> */}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default withRouter(Menu);
