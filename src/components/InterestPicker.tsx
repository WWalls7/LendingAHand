import React from "react";
import { PickerColumn } from "@ionic/core";
import { IonPicker } from "@ionic/react";

interface _Props {
  isOpen : boolean
  onSave : Function
  onCancel : Function
}

interface Option {
    text : string
    value : string
}

const InterestPicker: React.FC<_Props> = ({onSave, onCancel, isOpen}) => {

    const first: Option[] = []
    const third: Option[] = [{text:"00", value: "00"}, {text:"01", value: "01"}, {text:"02", value: "02"}, 
                            {text:"03", value: "03"}, {text:"04", value: "04"}, {text:"05", value: "05"},
                            {text:"06", value: "06"}, {text:"07", value: "07"}, {text:"08", value: "08"}, {text:"09", value: "09"}]
    for(var i =0; i<50; i++){
        first.push({text: i.toString(), value: i.toString()})
    }
    for(var i =10; i<99; i++){
        third.push({text: i.toString(), value: i.toString()})
    }


    const FirstColumn = {
        name: "first",
        options: first
    } as PickerColumn;

    const SecondColumn = {
        name: "second",
        options: [{text:".", value: "."}]
    } as PickerColumn;

    const ThirdColumn = {
        name: "third",
        options: third
    } as PickerColumn;

    return (
        <div>
            <IonPicker
                isOpen={isOpen}
                columns={[FirstColumn, SecondColumn, ThirdColumn]}
                buttons={[
                    {
                    text: "Cancel",
                    role: "cancel",
                    handler: value => {
                        onCancel()
                    }
                    },
                    {
                    text: "Confirm",
                    handler: value => {
                        onSave(value)
                    }
                    }
                ]}
            ></IonPicker>
        </div>
    );
};

export default InterestPicker;