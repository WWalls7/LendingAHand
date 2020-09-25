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

const Picker: React.FC<_Props> = ({onSave, onCancel, isOpen}) => {

    const years: Option[] = []
    const months: Option[] = []
    for(var i =0; i<99; i++){
        years.push({text: i.toString(), value: i.toString()})
    }
    for(var i =0; i<11; i++){
        months.push({text: i.toString(), value: i.toString()})
    }


    const YearColumn = {
        name: "years",
        prefix: "Years",
        options: years
    } as PickerColumn;

    const MonthColumn = {
        name: "months",
        prefix: "Months",
        options: months
    } as PickerColumn;

    return (
        <div>
            <IonPicker
                isOpen={isOpen}
                columns={[YearColumn, MonthColumn]}
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

export default Picker;