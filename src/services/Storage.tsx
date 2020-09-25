import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Loan, User, Payment, Interest, ProgressBar } from '../components/Types';

// Loans
export const addLoanToDB = (name: string, principle: string, interest: string, date: string, type: string, due: number, interestStart: number, currentInterest: string, interestType: string): Promise<boolean> => {
  return new Promise((resolve, reject)=>{
    try {
      SQLite.create({
        name: 'loan.db', location: 'default'
      }).then(async (db: SQLiteObject) => {
          try {
            const createTable = "create table if not exists loans(id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR NOT NULL, currentPrinciple VARCHAR NOT NULL, startingPrinciple VARCHAR NOT NULL, interestRate VARCHAR NOT NULL, startDate VARCHAR NOT NULL, type VARCHAR NOT NULL, interestType VARCHAR, due VARCHAR, interestStart VARCHAR, currentInterest VARCHAR, startingInterest VARCHAR, requiredPayment VARCHAR, recommendedPayment VARCHAR)"
            const create = await db.executeSql(createTable, [])
            const query = 'insert into loans (name, currentPrinciple, startingPrinciple, interestRate, startDate, type, interestType, due, interestStart, currentInterest, startingInterest) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            const insert = await db.executeSql(query, [name, principle, principle, interest, date, type, interestType, due, interestStart, currentInterest, currentInterest])
            console.log('Inserted: '+ insert)
            resolve(true)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
      })
    } catch(e) {
      console.log('database add error '+ e)
    }
})
  

}

export function getLoans() : Promise<Loan[]>{
  const loans: Loan[] = []
  return new Promise((resolve, reject)=>{
      try {
          SQLite.create({
            name: 'loan.db', location: 'default'
          }).then(async (db: SQLiteObject) => {
              try {
                const createTable = "create table if not exists loans(id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR NOT NULL, currentPrinciple VARCHAR NOT NULL, startingPrinciple VARCHAR NOT NULL, interestRate VARCHAR NOT NULL, startDate VARCHAR NOT NULL, type VARCHAR NOT NULL, interestType VARCHAR, due VARCHAR, interestStart VARCHAR, currentInterest VARCHAR, startingInterest VARCHAR, requiredPayment VARCHAR, recommendedPayment VARCHAR)"
                const create = await db.executeSql(createTable, [])
                const query = "SELECT * FROM loans"
                const get = db.executeSql(query, []).then(data => {
                  for(let i=0; i < data.rows.length; i++){
                    loans.push({
                      id: data.rows.item(i).id,
                      name: data.rows.item(i).name,
                      currentPrinciple: data.rows.item(i).currentPrinciple,
                      startingPrinciple: data.rows.item(i).startingPrinciple,
                      interestRate: data.rows.item(i).interestRate,
                      startDate: data.rows.item(i).startDate,
                      type: data.rows.item(i).type,
                      interestType: data.rows.item(i).interestType,
                      due: data.rows.item(i).due,
                      interestStart: data.rows.item(i).interestStart,
                      currentInterest: data.rows.item(i).currentInterest,
                      startingInterest: data.rows.item(i).startingInterest,
                      requiredPayment: data.rows.item(i).requiredPayment,
                      recommendedPayment: data.rows.item(i).recommendedPayment
                    })
                  }
                  resolve(loans)
                });
              } catch (e) {
                console.log('SQL get error: ', e);
              }
          })
        } catch(e) {
          console.log('database get error ', e)
        }
  })
}

export function getLoan(id: number) : Promise<Loan[]>{
  const loans: Loan[] = []
  return new Promise((resolve, reject)=>{
      try {
          SQLite.create({
            name: 'loan.db', location: 'default'
          }).then(async (db: SQLiteObject) => {
              try {
                const createTable = "create table if not exists loans(id INTEGER PRIMARY KEY AUTOINCREMENT,name VARCHAR NOT NULL, currentPrinciple VARCHAR NOT NULL, startingPrinciple VARCHAR NOT NULL, interestRate VARCHAR NOT NULL, startDate VARCHAR NOT NULL, type VARCHAR NOT NULL, interestType VARCHAR, due VARCHAR, interestStart VARCHAR, currentInterest VARCHAR, startingInterest VARCHAR, requiredPayment VARCHAR, recommendedPayment VARCHAR)"
                const create = await db.executeSql(createTable, [])
                const query = "SELECT * FROM loans id = (?) "
                const get = db.executeSql(query, [id]).then(data => {
                  for(let i=0; i < data.rows.length; i++){
                    loans.push({
                      id: data.rows.item(i).id,
                      name: data.rows.item(i).name,
                      currentPrinciple: data.rows.item(i).currentPrinciple,
                      startingPrinciple: data.rows.item(i).startingPrinciple,
                      interestRate: data.rows.item(i).interestRate,
                      startDate: data.rows.item(i).startDate,
                      type: data.rows.item(i).type,
                      interestType: data.rows.item(i).interestType,
                      due: data.rows.item(i).due,
                      interestStart: data.rows.item(i).interestStart,
                      currentInterest: data.rows.item(i).currentInterest,
                      startingInterest: data.rows.item(i).startingInterest,
                      requiredPayment: data.rows.item(i).requiredPayment,
                      recommendedPayment: data.rows.item(i).recommendedPayment
                    })
                  }
                  resolve(loans)
                });
              } catch (e) {
                console.log('SQL get error: ', e);
              }
          })
        } catch(e) {
          console.log('database get error ', e)
        }
  })
}

export function deleteLoan(id:number){
  try {
      SQLite.create({
          name: 'loan.db', location: 'default'
      }).then(async (db: SQLiteObject) => {
          try {
              db.executeSql("PRAGMA foreign_keys=ON")
              db.executeSql("DELETE FROM loans WHERE id = ?", [id])
          } catch (e) {
              console.log('SQL delete error: ', e);
          }
      })
      } catch(e) {
      console.log('database delete error ', e)
      }
}
 
export const updateLoan = (id: number, item: string, itemType: string ): void => {
  console.log(id, item, itemType)
  try {
    SQLite.create({
      name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        if(itemType === "name"){
          try {
            const query = 'UPDATE loans SET (name) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "currentPrinciple"){
          try {
            const query = 'UPDATE loans SET (currentPrinciple) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "startingPrinciple"){
          try {
            const query = 'UPDATE loans SET (startingPrinciple) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "interestRate"){
          try {
            const query = 'UPDATE loans SET (interestRate) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "startDate"){
          try {
            const query = 'UPDATE loans SET (startDate) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "type"){
          try {
            const query = 'UPDATE loans SET (type) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "interestType"){
          try {
            const query = 'UPDATE loans SET (interestType) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "due"){
          try {
            const query = 'UPDATE loans SET (due) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "interestStart"){
          try {
            const query = 'UPDATE loans SET (interestStart) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "currentInterest"){
          try {
            const query = 'UPDATE loans SET (currentInterest) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "startingInterest"){
          try {
            const query = 'UPDATE loans SET (startingInterest) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "requiredPayment"){
          try {
            const query = 'UPDATE loans SET (requiredPayment) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "recommendedPayment"){
          try {
            const query = 'UPDATE loans SET (recommendedPayment) = (?) where id = ? ;"'
            const insert = await db.executeSql(query, [item, id])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }

    })
  } catch(e) {
    console.log('database add error '+ e)
  }
}


// User
export const addProfileInfo = (budget: string, currency: string): void => {
  try {
    SQLite.create({
      name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        try {
          const createTable = "create table if not exists user(budget VARCHAR, currency VARCHAR)"
          const create = await db.executeSql(createTable, [])
          const query = 'insert into user (budget, currency) values (?, ?)'
          const insert = await db.executeSql(query, [budget, currency])
          console.log('Inserted: '+ insert)
        } catch (e) {
          console.log('SQL add error: '+ JSON.stringify(e))
        }
    })
  } catch(e) {
    console.log('database add error '+ e)
  }

}

export function getProfileInfo() : Promise<User>{
  let user: User = {budget: "", currency: ""}
  return new Promise((resolve, reject)=>{
      try {
          SQLite.create({
            name: 'loan.db', location: 'default'
          }).then(async (db: SQLiteObject) => {
              try {
                const createTable = "create table if not exists user(budget VARCHAR, currency VARCHAR)"
                const create = await db.executeSql(createTable, [])
                const query = "SELECT * FROM user"
                const get = db.executeSql(query, []).then(data => {
                  if(data.rows.length !== 0){
                    user = { budget: data.rows.item(0).budget,
                      currency: data.rows.item(0).currency}
                  }
                  resolve(user)
                });
              } catch (e) {
                console.log('SQL get error: ', e);
              }
          })
        } catch(e) {
          console.log('database get error ', e)
        }
  })
}

export const updateProfileInfo = (item: string, itemType: string ): void => {
  try {
    SQLite.create({
      name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        if(itemType === "budget"){
          try {
            const query = 'UPDATE user SET (budget) = (?);"'
            const insert = await db.executeSql(query, [item])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
        if(itemType === "currency"){
          try {
            const query = 'UPDATE user SET (currency) = (?);"'
            const insert = await db.executeSql(query, [item])
            console.log('Inserted: '+ insert)
          } catch (e) {
            console.log('SQL add error: '+ JSON.stringify(e))
          }
        }
    })
  } catch(e) {
    console.log('database add error '+ e)
  }
}


// Payment History
export const addPayment = (loanId: string, amount: string, date: string): void => {
  try {
    SQLite.create({
      name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        try {
          const createTable = "create table if not exists paymentHistory(loanId INTEGER NOT NULL, amount VARCHAR, date VARCHAR, FOREIGN KEY(loanId) REFERENCES loans(id) ON DELETE CASCADE)"
          const create = await db.executeSql(createTable, [])
          const query = 'insert into paymentHistory (loanId, amount, date) values (?, ?, ?)'
          const insert = await db.executeSql(query, [loanId, amount, date])
          console.log('Inserted: '+ insert)
        } catch (e) {
          console.log('SQL add error: '+ JSON.stringify(e))
        }
    })
  } catch(e) {
    console.log('database add error '+ e)
  }

}

export function getPaymentHistory(id: string) : Promise<Payment[]>{
  const payments: Payment[] = []
  return new Promise((resolve, reject)=>{
      try {
          SQLite.create({
            name: 'loan.db', location: 'default'
          }).then(async (db: SQLiteObject) => {
              try {
                const createTable = "create table if not exists paymentHistory(loanId INTEGER NOT NULL, amount VARCHAR, date VARCHAR, FOREIGN KEY(loanId) REFERENCES loans(id) ON DELETE CASCADE)"
                const create = await db.executeSql(createTable, [])
                const query = "SELECT * FROM paymentHistory WHERE loanId = (?) ORDER BY datetime(date) ASC"
                const get = db.executeSql(query, [id]).then(data => {
                  for(let i=0; i < data.rows.length; i++){
                    payments.push({
                      loanId: data.rows.item(i).loanId,
                      amount: data.rows.item(i).amount,
                      date: data.rows.item(i).date
                    })
                  }
                  resolve(payments)
                });
              } catch (e) {
                console.log('SQL get error: ', e);
              }
          })
        } catch(e) {
          console.log('database get error ', e)
        }
  })
}

export function getAllPayments() : Promise<Payment[]>{
  const payments: Payment[] = []
  return new Promise((resolve, reject)=>{
      try {
          SQLite.create({
            name: 'loan.db', location: 'default'
          }).then(async (db: SQLiteObject) => {
              try {
                //const go = await db.executeSql("drop table paymentHistory", []) 
                const createTable = "create table if not exists paymentHistory(loanId INTEGER NOT NULL, amount VARCHAR, date VARCHAR, FOREIGN KEY(loanId) REFERENCES loans(id) ON DELETE CASCADE)"
                const create = await db.executeSql(createTable, [])
                const query = "SELECT * FROM paymentHistory ORDER BY datetime(date) ASC"
                const get = db.executeSql(query, []).then(data => {
                  for(let i=0; i < data.rows.length; i++){
                    payments.push({
                      loanId: data.rows.item(i).loanId,
                      amount: data.rows.item(i).amount,
                      date: data.rows.item(i).date
                    })
                  }
                  resolve(payments)
                });
              } catch (e) {
                console.log('SQL get error: ', e);
              }
          })
        } catch(e) {
          console.log('database get error ', e)
        }
  })
}


// Interest History
export const addInterest = (loanId: number, initialInterest: number, newInterest: number, date: string): void => {
  try {
    SQLite.create({
      name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        try {
          const createTable = "create table if not exists interestHistory(loanId INTEGER NOT NULL, initialInterest VARCHAR, newInterest VARCHAR, date VARCHAR, FOREIGN KEY(loanId) REFERENCES loans(id) ON DELETE CASCADE)"
          const create = await db.executeSql(createTable, [])
          const query = 'insert into interestHistory (loanId, initialInterest, newInterest, date) values (?, ?, ?, ?)'
          const insert = await db.executeSql(query, [loanId, initialInterest.toString(), newInterest.toString(), date])
          console.log('Inserted: '+  insert)
        } catch (e) {
          console.log('SQL add error: '+ JSON.stringify(e))
        }
    })
  } catch(e) {
    console.log('database add error '+ e)
  }

}

export function getInterestHistory(id: number) : Promise<Interest[]>{
  const interests: Interest[] = []
  return new Promise((resolve, reject)=>{
      try {
          SQLite.create({
            name: 'loan.db', location: 'default'
          }).then(async (db: SQLiteObject) => {
              try {
                //const go = await db.executeSql("drop table interestHistory", []) 
                const createTable = "create table if not exists interestHistory(loanId INTEGER NOT NULL, initialInterest VARCHAR, newInterest VARCHAR, date VARCHAR, FOREIGN KEY(loanId) REFERENCES loans(id) ON DELETE CASCADE)"
                const create = await db.executeSql(createTable, [])
                const query = "SELECT * FROM interestHistory WHERE loanId = (?) ORDER BY datetime(date) ASC" 
                const get = db.executeSql(query, [id]).then(data => {
                  for(let i=0; i < data.rows.length; i++){
                    interests.push({
                      loanId: data.rows.item(i).loanId,
                      initialInterest: data.rows.item(i).initialInterest,
                      newInterest: data.rows.item(i).newInterest,
                      date: data.rows.item(i).date
                    })
                  }
                  resolve(interests)
                });
              } catch (e) {
                console.log('SQL get error: ', e);
              }
          })
        } catch(e) {
          console.log('database get error ', e)
        }
  })
}

export function getAllInterests() : Promise<Interest[]>{
  const interests: Interest[] = []
  return new Promise((resolve, reject)=>{
      try {
          SQLite.create({
            name: 'loan.db', location: 'default'
          }).then(async (db: SQLiteObject) => {
              try {
                //const go = await db.executeSql("drop table paymentHistory", []) 
                const createTable = "create table if not exists interestHistory(loanId INTEGER NOT NULL, initialInterest VARCHAR, newInterest VARCHAR, date VARCHAR, FOREIGN KEY(loanId) REFERENCES loans(id) ON DELETE CASCADE)"
                const create = await db.executeSql(createTable, [])
                const query = "SELECT * FROM interestHistory ORDER BY datetime(date) ASC"
                const get = db.executeSql(query, []).then(data => {
                  for(let i=0; i < data.rows.length; i++){
                    interests.push({
                      loanId: data.rows.item(i).loanId,
                      initialInterest: data.rows.item(i).initialInterest,
                      newInterest: data.rows.item(i).newInterest,
                      date: data.rows.item(i).date
                    })
                  }
                  resolve(interests)
                });
              } catch (e) {
                console.log('SQL get error: ', e);
              }
          })
        } catch(e) {
          console.log('database get error ', e)
        }
  })
}


// Progress History
export const addProgress = (initialBalance: number, currentBalance: number): void => {
  try {
    SQLite.create({
      name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        try {
          const createTable = "create table if not exists progressHistory(id INTEGER PRIMARY KEY AUTOINCREMENT, initialBalance INTEGER, currentBalance INTEGER)"
          const create = await db.executeSql(createTable, [])
          const query = 'insert into progressHistory (initialBalance, currentBalance) values (?, ?)'
          const insert = await db.executeSql(query, [initialBalance, currentBalance])
          console.log('Inserted: '+  insert)
        } catch (e) {
          console.log('SQL add error: '+ JSON.stringify(e))
        }
    })
  } catch(e) {
    console.log('database add error '+ e)
  }

}

export function getProgress() : Promise<ProgressBar[]>{
  const progress: ProgressBar[] = []
  return new Promise((resolve, reject)=>{
      try {
          SQLite.create({
            name: 'loan.db', location: 'default'
          }).then(async (db: SQLiteObject) => {
              try {
                //const go = await db.executeSql("drop table progressHistory", []) 
                const createTable = "create table if not exists progressHistory(id INTEGER PRIMARY KEY AUTOINCREMENT, initialBalance INTEGER, currentBalance INTEGER)"
                const create = await db.executeSql(createTable, [])
                const query = "SELECT * FROM progressHistory ORDER BY initialBalance ASC"
                const get = db.executeSql(query, []).then(data => {
                  for(let i=0; i < data.rows.length; i++){
                    progress.push({
                      id: data.rows.item(i).id,
                      initialBalance: data.rows.item(i).initialBalance,
                      currentBalance: data.rows.item(i).currentBalance
                    })
                  }
                  resolve(progress)
                });
              } catch (e) {
                console.log('SQL get error: ', e);
              }
          })
        } catch(e) {
          console.log('database get error ', e)
        }
  })
}

export const updateProgress = (item: number, id: number): void => {
  try {
    SQLite.create({
      name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        try {
          const query = 'UPDATE progressHistory SET (currentBalance) = (?) WHERE id = ?;;"'
          const insert = await db.executeSql(query, [item, id])
          console.log('Inserted: '+ insert)
        } catch (e) {
          console.log('SQL add error: '+ JSON.stringify(e))
        }
    })
  } catch(e) {
    console.log('database add error '+ e)
  }
}

export function deleteProgress(id: number){
  try {
    SQLite.create({
        name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        try {
            db.executeSql("DELETE FROM progressHistory WHERE id = ?", [id])
        } catch (e) {
            console.log('SQL delete error: ', e);
        }
    })
    } catch(e) {
    console.log('database delete error ', e)
    }
}





export function deletePayment(payment: Payment){
  try {
    SQLite.create({
        name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        try {
            db.executeSql("DELETE FROM paymentHistory WHERE date = ? AND loanId = ?", [payment.date, payment.loanId])
        } catch (e) {
            console.log('SQL delete error: ', e);
        }
    })
    } catch(e) {
    console.log('database delete error ', e)
    }
}