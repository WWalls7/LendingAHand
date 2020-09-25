import { getLoans, addProgress, getProgress, getLoan, updateProgress, deleteProgress } from '../services/Storage';
import { Loan, ProgressBar } from '../components/Types';
import { calcInterest, calcMinPayment } from './Calculations';


export async function updateInterest(_callback: Function){
    var loans: Loan[] = []
    getLoans().then((response)=>{
        if(response.length > 0){
            for(var i = 0; i < response.length; i++){
                loans.push(response[i])
                calcInterest(response[i].id, response[i].currentPrinciple, response[i].interestRate, response[i].startDate,
                    Number(response[i].interestStart), response[i].currentInterest, response[i].interestType, response[i].due)
            }
        }
    }).finally(()=> {
        for(var i = 0; i < loans.length; i++){
            calcMinPayment(loans[i].id, loans[i].currentPrinciple, loans[i].startDate, Number(loans[i].due), loans[i].currentInterest, loans[i].type, loans[i].interestRate, 
            function() {
                _callback()
            })
        }
    })
}

export function getSelected(loans: Loan[] | null, loan: string) : Loan{
    if(loans !== null){
        for(var i = 0; i<loans.length; i++){
            if(loans[i].id === Number(loan)){
                return loans[i]
            }
        }
    }
    return {id: 0,
      name: "",
      currentPrinciple: "",
      startingPrinciple: "",
      interestRate: "",
      startDate: "",
      type: "",
      interestType: "",
      due: "",
      interestStart: "",
      currentInterest: "",
      startingInterest: "",
      requiredPayment: "",
      recommendedPayment: ""
    }
}

export function createProgress(loans: Loan[]){
    var resp = []
    var bars: number[] = []
    getProgress().then((response)=>{
        console.log("progress", response)
        if(response.length > 0){
          resp = response
        }
      }).finally(()=> {
        if(resp.length === 0){
            var total = 0
            var add = 0
            for(var i = 1; i< loans.length; i++){
            add = Number(loans[i].currentInterest) + Number(loans[i].currentPrinciple)
            total += add
            }
            bars = [+((total*.05).toFixed(2)), +((total*.1).toFixed(2)), +((total*.2).toFixed(2)), +((total*.3).toFixed(2)),+((total*.35).toFixed(2))]
            for(var i =0; i<bars.length; i++){
                addProgress(bars[i], 0)
            }
        }
    })
    return bars
}

export function addLoanToProgress(){
    var progress: ProgressBar[] = []
    getProgress().then((response)=>{
        if(response.length > 0){
            progress = response
        }
      }).finally(()=> {
        var loan: Loan
        getLoans().then((response)=>{
            if(response.length > 0){
                loan = response[response.length-1]
                calcInterest(loan.id, loan.currentPrinciple, loan.interestRate, loan.startDate, Number(loan.interestStart), loan.currentInterest, 
                loan.interestType, loan.due)
            }
        }).finally(()=> {
            getLoan(loan.id).then((resp)=>{
                if(resp.length > 0){
                    var newLoanBalance = Number(resp[0].currentInterest)+Number(resp[0].currentPrinciple)
                    if(newLoanBalance > progress[progress.length-1].initialBalance){
                        var percent = 0
                        while(newLoanBalance > progress[progress.length-1].initialBalance){
                            percent = newLoanBalance*.4
                            addProgress(+((percent).toFixed(2)), 0)
                            newLoanBalance = newLoanBalance*.6
                            if(newLoanBalance <= progress[progress.length-1].initialBalance){
                                addProgress(+((newLoanBalance).toFixed(2)), 0)
                            }
                        }
                    }
                    else{
                        addProgress(+((newLoanBalance).toFixed(2)), 0)
                    }
                }
            }).finally(()=> {})
        })
      })
}

export function addPaymentToProgress(amount: number, loans: Loan[]){
    var progress: ProgressBar[] = []
    getProgress().then((response)=>{
        if(response.length > 0){
            progress = response
        }
        else{
            var bars = createProgress(loans)
            var current = bars[0]
            var id = 0
            var removed = amount
            while(removed > current){
                if(removed >= current){
                    deleteProgress(id)
                    removed = removed - current
                    bars = bars.filter(item => item !== current)
                    current = bars[0]
                    id += 1
                }
                else{
                    updateProgress(+((removed).toFixed(2)), id)
                }
            }
        }
    }).finally(()=> {
        if(progress){
            var current = progress[0]
            for(var i = 1; i<progress.length; i++){
                if(progress[i].currentBalance > current.currentBalance){
                    current = progress[i]
                    break
                }
            }
            var removed = current.currentBalance + amount
            while(removed > 0){
                if(removed >= current.initialBalance){
                    deleteProgress(current.id)
                    removed = removed - current.initialBalance
                    progress = progress.filter(item => item.id !== current.id)
                    current = progress[0]
                }
                else{
                    updateProgress(+((removed).toFixed(2)), current.id)
                }
            }
        }
    })
}