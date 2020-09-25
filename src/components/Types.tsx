export interface Loan {
  id: number;
  name: string;
  currentPrinciple: string;
  startingPrinciple: string;
  interestRate: string;
  startDate: string;
  type: string;
  interestType: string;
  due: string;
  interestStart: string;
  currentInterest: string;
  startingInterest: string;
  requiredPayment: string;
  recommendedPayment: string;
}

export interface User {
  budget: string;
  currency: string;
}

export interface Payment {
  loanId: number;
  amount: string;
  date: string;
}

export interface Interest {
  loanId: number;
  initialInterest: string;
  newInterest: string;
  date: string;
}

export interface Amortization {
  month: string,
  amount: number, 
  interest: number, 
  principle: number,
  balance: number
}

export interface LineData {
  labels: string[],
  datasets: LineDataSet[]
}

export interface LineDataSet {
  label: string,
  lineTension: number,
  backgroundColor: string,
  borderColor: string,
  borderJoinStyle: string,
  pointBorderColor: string,
  pointBackgroundColor: string,
  pointBorderWidth: number,
  pointHoverRadius: number,
  pointHoverBackgroundColor: string,
  pointHoverBorderColor: string,
  pointHoverBorderWidth: number,
  pointRadius: number,
  pointHitRadius: number,
  data: number[]
}

export interface DoughnutData {
  labels: string[],
  datasets: DoughnutDataSet[]
}

export interface DoughnutDataSet {
  backgroundColor: string[],
  data: number[]
}

export interface ProgressBar {
  id: number,
  initialBalance: number,
  currentBalance: number
}