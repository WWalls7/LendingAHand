import { addInterest, getInterestHistory, updateLoan, addPayment } from './Storage';
import { Interest, Payment, Amortization, Loan } from '../components/Types';

// Functions for loan values
export const calcMinPayment = (id: number, currentPrinciple: string, date: string, due: number, currentInterest: string, loanType: string, interestRate: string, _callback: Function) => {
  var balance = +((Number(currentPrinciple) + Number(currentInterest)).toFixed(2))
  const rate = (Number(interestRate)/12)/100
  var paymentsLeft = Number(due) - monthDiff(new Date(date), new Date())
  var paymentAmount = minPayment(balance, rate, paymentsLeft, loanType)
  if(paymentsLeft < 0){
    updateLoan(id, "0", "requiredPayment")
  }
  else{
    updateLoan(id, paymentAmount.toString(), "requiredPayment")
  }
  _callback()
}

export const calcRecPayment = (minPayment: number, type: string, budget: string): number => {
    if(type === "IO"){
        return minPayment
    }
    else{
        return minPayment + Number(budget)
    }
}

function add(interestType: string, interestStartDate: Date, dueDate: Date, currentPrinciple: string, currentInterest: string, interestRate: string, id: number) {
  const rate = (Number(interestRate)/12)/100
  var initialInterest = Number(currentInterest)
  var interestAmount
  var newInterest = 0
  if(interestType === "simple"){
    while(interestStartDate <= new Date() && dueDate >= new Date()){
      interestAmount = +((Number(currentPrinciple) * rate).toFixed(2));
      newInterest = +((initialInterest + interestAmount).toFixed(2))
      addInterest(id, initialInterest, newInterest, formatGivenDate(interestStartDate))
      console.log(id, initialInterest, newInterest, formatGivenDate(interestStartDate))
      interestStartDate = addMonths(interestStartDate, 1)
      initialInterest = newInterest
    }
    updateLoan(id, newInterest.toString(), "currentInterest")
  }
  else{// type = compound
    while(interestStartDate <= new Date() && dueDate >= new Date()){
      interestAmount = +(((Number(currentPrinciple)+Number(initialInterest)) * rate).toFixed(2));
      newInterest = +((initialInterest + interestAmount).toFixed(2))
      addInterest(id, initialInterest, newInterest, formatGivenDate(interestStartDate))
      console.log(id, initialInterest, newInterest, formatGivenDate(interestStartDate))
      interestStartDate = addMonths(interestStartDate, 1)
      initialInterest = newInterest
    }
    updateLoan(id, newInterest.toString(), "currentInterest")
  }
}

function addOverDue(interestType: string, interestStartDate: Date, dueDate: Date, currentPrinciple: string, currentInterest: string, interestRate: string, id: number) {
  var initialInterest = Number(currentInterest)
  const rate = (Number(interestRate)/12)/100
  var interestAmount
  var newInterest = 0
  if(interestType === "simple"){
    while(interestStartDate <= dueDate){
      interestAmount = +((Number(currentPrinciple) * rate).toFixed(2));
      newInterest = +((initialInterest + interestAmount).toFixed(2))
      addInterest(id, initialInterest, newInterest, formatGivenDate(interestStartDate))
      console.log(id, initialInterest, newInterest, formatGivenDate(interestStartDate))
      interestStartDate = addMonths(interestStartDate, 1)
      initialInterest = newInterest
    }
    updateLoan(id, newInterest.toString(), "currentInterest")
  }
  else{// type = compound
    while(interestStartDate <= dueDate){
      interestAmount = +(((Number(currentPrinciple)+Number(initialInterest)) * rate).toFixed(2));
      newInterest = +((initialInterest + interestAmount).toFixed(2))
      addInterest(id, initialInterest, newInterest, formatGivenDate(interestStartDate))
      console.log(id, initialInterest, newInterest, formatGivenDate(interestStartDate))
      interestStartDate = addMonths(interestStartDate, 1)
      initialInterest = newInterest
    }
    updateLoan(id, newInterest.toString(), "currentInterest")
  }
}

export const calcInterest = (id: number, currentPrinciple: string, interestRate: string, date: string, interestStart: number, currentInterest: string, interestType: string, due: string) => {
  var interestStartDate = addMonths(new Date(date), interestStart)
  const dueDate = addMonths(new Date(date), Number(due))
  
  getInterestHistory(id).then((response)=>{
    console.log(response)
    if(response.length > 0){ //if interest historys
      var interestLastAccrued = new Date(response[response.length-1].date)
      if(addMonths(interestLastAccrued, 1) > new Date() || dueDate <= new Date()){ //if interest doesnt start yet or loan overdue
        return 
      }
      else{ //interest supposed to accrue
        interestStartDate = addMonths(interestLastAccrued, 1)
        add(interestType, interestStartDate, dueDate, currentPrinciple, currentInterest, interestRate, id)
        return 
      }
    }
    else{ //interest history not exists
      if(interestStartDate > new Date() || addMonths(new Date(date), 1) > new Date()) { //interest doesnt start yet
        return 
      }
      else if(dueDate <= new Date()){ //loan overDue
        interestStartDate = addMonths(interestStartDate, 1)
        addOverDue(interestType, interestStartDate, dueDate, currentPrinciple, currentInterest, interestRate, id)
        return 
      }
      else{
        interestStartDate = addMonths(interestStartDate, 1)
        add(interestType, interestStartDate, dueDate, currentPrinciple, currentInterest, interestRate, id)
        return 
      }
    }
  }).finally(()=> {})
}

export function addPaymentUpdateBalance(loan: string, currentPrinciple: number, currentInterest: number, amount: string, date: string) {
  addPayment(loan, amount, date)
  var removed = +((currentInterest - Number(amount)).toFixed(2)) 
  console.log(removed)
  if(removed <= 0){ //all interest paid 
    currentPrinciple = +((currentPrinciple + removed).toFixed(2))
    currentInterest = 0
    updateLoan(Number(loan), currentPrinciple.toString(), "currentPrinciple")
  }
  else{// not all interest paid 
    currentInterest = removed
  }
  updateLoan(Number(loan), currentInterest.toString(), "currentInterest")
}


// Functions for dates
export function addMonths(date: Date, months: number) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + months);
  if (date.getDate() !== d) {
    date.setDate(0);
  }
  return date;
}

export function monthDiff(d1: Date, d2: Date) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export function formatDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

export function formatGivenDate(d: Date) {
var month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

if (month.length < 2) 
    month = '0' + month;
if (day.length < 2) 
    day = '0' + day;

return [year, month, day].join('-');
}


// Functions for graphs
export function getXAxis(current: boolean, start: string) {
  var d = addMonths(new Date(), 1)
  var startDate = new Date(start)
  var months = []
  if(!current){ //for predicted 
    for(var i = 0; i<12; i++){
      months.push(d.toDateString().substring(4, 7)+" "+d.getFullYear().toString().substring(2, 4))
      d = addMonths(d, 1)
    }
  }
  else{ // for current
      var theMonths = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
      var now = new Date()
      for (var i = 0; i > -12; i--) {
        var past = new Date(now.getFullYear(), now.getMonth() + i, 1);
        if (startDate > past){
          continue
        }
        var month = theMonths[past.getMonth()];
        var year = past.getFullYear();
        months.push(month + " " + year);
      }
      return months.reverse()
  }
  return months
}

function getPayments(payments: Payment[], dates: Date[]) {
  var paymentAmounts: number[] = []
  var stoppedAt = 0
  for(var i = 0; i<dates.length-1; i++){
    paymentAmounts[i] = 0
    for(var j = stoppedAt; j<payments.length; j++){
      if(new Date(payments[j].date) < dates[0]){
        paymentAmounts[0] += Number(payments[j].amount)
      }
      else if(new Date(payments[j].date) >= dates[i] && new Date(payments[j].date) < dates[i+1]){
        paymentAmounts[i] += Number(payments[j].amount)
        stoppedAt = j
      }
      else if(new Date(payments[j].date) >= dates[i+1]){
        stoppedAt = j
        break
      }
    }
  }
  paymentAmounts[dates.length-1] = 0
  for(var j = stoppedAt; j<payments.length; j++){
    if(new Date(payments[j].date) >= dates[dates.length-1]){
      paymentAmounts[dates.length-1] += Number(payments[j].amount)
    }
  }
  return paymentAmounts
}

function getInterests(interests: Interest[], dates: Date[]) {
  var interestAmounts: number[] = []
  var stoppedAt = 0
  for(var i = 0; i<dates.length-1; i++){
    interestAmounts[i] = 0
    for(var j = stoppedAt; j<interests.length; j++){
      if(new Date(interests[j].date) < dates[0]){
        interestAmounts[0] += +((Number(interests[j].newInterest) - Number(interests[j].initialInterest)).toFixed(2))
      }
      else if(new Date(interests[j].date) >= dates[i] && new Date(interests[j].date) < dates[i+1]){
        interestAmounts[i] += +((Number(interests[j].newInterest) - Number(interests[j].initialInterest)).toFixed(2))
        stoppedAt = j
      }
      else if(new Date(interests[j].date) >= dates[i+1] ){
        stoppedAt = j
        break
      }
    }
  }
  interestAmounts[dates.length-1] = 0
  for(var j = stoppedAt; j<interests.length; j++){
    if(new Date(interests[j].date) >= dates[dates.length-1]){
      interestAmounts[dates.length-1] += +((Number(interests[j].newInterest) - Number(interests[j].initialInterest)).toFixed(2))
    }
  }
  return interestAmounts
}

export function getBalance(payments: Payment[], startingPrinciple: string, interests: Interest[], start: string, startingInterest: string) {
  var now = new Date()
  var startDate = new Date(start)
  var dates: Date[] = []
  for (var i = 0; i > -12; i--) {
    var past = new Date(now.getFullYear(), now.getMonth() + i, 1);
    if (startDate > past){
      continue
    }
    dates.push(past);
  }
  dates = dates.reverse()

  var interestAmounts = getInterests(interests, dates)
  var paymentAmounts = getPayments(payments, dates)
  console.log(startingInterest)
  interestAmounts[0] += Number(startingInterest)
  var balances: number[] = [+(((Number(startingPrinciple) + interestAmounts[0]) - paymentAmounts[0]).toFixed(2))]
  for(var i = 1; i<dates.length; i++){
    balances[i] = +(((balances[i-1] + interestAmounts[i]) - paymentAmounts[i]).toFixed(2))
  }
  return balances
}

export function getPredicted(payment: number, currentPrinciple: string, interestStart: number, interestRate: string, date: string, currentInterest: string, interestType: string, due: string, type: string) {
  const dueDate = addMonths(new Date(date), Number(due))
  var balances: number[] = []
  if(interestType === "simple"){
    balances.push(+((Number(currentPrinciple)).toFixed(2)))
  }
  else{
    balances.push(+((Number(currentPrinciple) + Number(currentInterest)).toFixed(2)))
  }

  if(dueDate <= new Date()){ //if loan overdue
    for(var i = 1; i<12; i++){
      if((balances[i-1] - payment) > 0){
        balances[i] = +((balances[i-1] - payment).toFixed(2))
      }
      else{
        balances[i] = 0
      }
    }
  }
  else{
    predictBalance(interestType, currentPrinciple, interestRate, balances, payment, interestStart, dueDate, 12, type) 
  }
  return balances
}

function predictBalance(interestType: string, currentPrinciple: string, interestRate: string, balances: number[], payment: number, interestStart: number, dueDate: Date, months: number, type: string) {
  const rate = (Number(interestRate)/12)/100
  var date = formatDate()
  const interestStartDate = addMonths(new Date(date), interestStart+1)
  var interestAccrues = new Date()
  var interestAmount

  if(interestType === "simple"){
    var principle = Number(currentPrinciple)
    if(type === "IO"){
      for(var i=1; i<months; i++){
        if(interestAccrues < interestStartDate || interestAccrues >= dueDate){
          interestAccrues = addMonths(interestAccrues, 1)
          balances[i] = balances[i-1]
        }
        else{
          interestAmount = +((principle * rate).toFixed(2))
          interestAccrues = addMonths(interestAccrues, 1)
          if((interestAmount - payment) < 0){
            balances[i] = balances[i-1]
          } 
          else{
            balances[i] = +((balances[i-1] + (interestAmount - payment)).toFixed(2))
          }
        }
      }
    }
    else{// amortized
      for(var i=1; i<months; i++){
        if(interestAccrues < interestStartDate || interestAccrues >= dueDate){
          interestAccrues = addMonths(interestAccrues, 1)
          if((balances[i-1] - payment) > 0){
            balances[i] = +((balances[i-1] - payment).toFixed(2))
          }
          else{
            balances[i] = 0
          }
        }
        else{
          interestAmount = +((principle * rate).toFixed(2))
          interestAccrues = addMonths(interestAccrues, 1)
          principle += (interestAmount - payment)
          if((balances[i-1] - (payment - interestAmount)) > 0){
            balances[i] = +((balances[i-1] - (payment - interestAmount)).toFixed(2))
          }
          else{
            balances[i] = 0
          }
        }
      }
    }
  }
  else{ // compound interest
    if(type === "IO"){
      for(var i=1; i<months; i++){
        if(interestAccrues < interestStartDate || interestAccrues >= dueDate){
          interestAccrues = addMonths(interestAccrues, 1)
          balances[i] = balances[i-1]
        }
        else{
          interestAmount = +((balances[i-1] * rate).toFixed(2))
          interestAccrues = addMonths(interestAccrues, 1)
          if((interestAmount - payment) < 0){
            balances[i] = balances[i-1]
          } 
          else{
            balances[i] = +((balances[i-1] + (interestAmount - payment)).toFixed(2))
          }
        }
      }
    }
    else{// amortized
      for(var i=1; i<months; i++){
        if(interestAccrues < interestStartDate || interestAccrues >= dueDate){
          interestAccrues = addMonths(interestAccrues, 1)
          if((balances[i-1] - payment) > 0){
            balances[i] = +((balances[i-1] - payment).toFixed(2))
          }
          else{
            balances[i] = 0
          }
        }
        else{
          interestAmount = +((balances[i-1] * rate).toFixed(2))
          interestAccrues = addMonths(interestAccrues, 1)
          if((balances[i-1] - (payment - interestAmount)) > 0){
            balances[i] = +((balances[i-1] - (payment - interestAmount)).toFixed(2))
          }
          else{
            balances[i] = 0
          }
        }
      }
    }
  }
  return balances[1]
}

export function getPastDue(startDate: string, due: string, _callback: Function): boolean{
  const dueDate = addMonths(new Date(startDate), Number(due))
  if(dueDate <= new Date()){ //if loan overdue
    return true
  }
  else{
    _callback()
    return false
  }
}


// Functions for amortizations
export function getAmortization(loan: Loan, paymentAmount: number) : Promise<Amortization[]>{
  var balance = 0
  if(loan.interestType === "simple"){
    balance = +((Number(loan.currentPrinciple)).toFixed(2))
  }
  else{
    balance = +((Number(loan.currentPrinciple) + Number(loan.currentInterest)).toFixed(2))
  }
  const rate = (Number(loan.interestRate)/12)/100
  var interest = 0
  var principle = 0
  var date = formatDate()
  const dueDate = addMonths(new Date(loan.startDate), Number(loan.due))
  var amortizations: Amortization[] = [{month: date, amount: paymentAmount, interest: interest, principle: principle, balance: balance}]
  return new Promise((resolve, reject)=>{
    var interestDate = new Date()
    if(loan.type === "IO"){
      while(interestDate < dueDate){
        date = formatGivenDate(addMonths(new Date(date), 1))
        interestDate = addMonths(interestDate, 1)
        interest = +((balance * rate).toFixed(2))
        if(balance < 0){
          balance = 0
        }
        amortizations.push({month: date, amount: paymentAmount, interest: interest, principle: principle, balance: balance})
      }
    }
    else{
      while(balance > 0){
        date = formatGivenDate(addMonths(new Date(date), 1))
        interest = +((balance * rate).toFixed(2))
        principle = +((paymentAmount - interest).toFixed(2))
        balance = +((balance - principle).toFixed(2))
        if(balance < 0){
          balance = 0
        }
        amortizations.push({month: date, amount: paymentAmount, interest: interest, principle: principle, balance: balance})
      }
    }
    resolve(amortizations)
  })
}

export function minPayment(balance: number, rate: number, payments: number, loanType: string) {
  if(loanType === "amortized"){
    var exp = Math.pow((1+rate), payments)
    var num = rate*exp
    var den = exp - 1
    var div = num/den
    return +((balance*div).toFixed(2))
  }
  else{// interest only
    return +((balance*(rate/payments)).toFixed(2))
  }
}

export function getFinalDueDate(loans: Loan[]): string{
  var dueDate = addMonths(new Date(loans[0].startDate), Number(loans[0].due))
  for(var i = 1; i< loans.length; i++){
    if(addMonths(new Date(loans[i].startDate), Number(loans[i].due)) > dueDate){
      dueDate = addMonths(new Date(loans[i].startDate), Number(loans[i].due))
    }
  }
  return formatGivenDate(dueDate)
}

export function getAmountLeft(loans: Loan[]): number{
  var total = 0
  var add = 0
  for(var i = 1; i< loans.length; i++){
    add = Number(loans[i].currentInterest) + Number(loans[i].currentPrinciple)
    total += add
  }
  return +((total).toFixed(2))
}

// export function getFinalDueDate(loans: Loan[]): string{
//   function compare(a: Payment, b: Payment) {
//     if (a.loanId > b.loanId) {
//       return 1;
//     } else if (a.loanId < b.loanId) {
//       return -1;
//     }
//     return 0;
//   }
//   payments.sort(compare)
//   var total
//   var saved = 0
//   var i = 0
//   var lastMonth = addMonths(new Date(), -1)
//   while(i<payments.length-1 && new Date(payments[i].date) >= lastMonth){
//     total = Number(payments[i].amount)
//     if(payments[i].loanId === payments[i+1].loanId){
//       total += Number(payments[i].amount)
//       continue
//     }
//     else if(i === payments.length-2){
//       total = Number(payments[payments.length-1].amount)
//     }
//     saved = 
//     i++
//   }
// }
