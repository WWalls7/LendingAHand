import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Loan } from './components/LoanType';

// https://github.com/alex-steinberg/ionic-react-sqlite-example/blob/master/src/pages/Home.tsx

export const addLoanToDB = (name: string, principle: number, interest: number): void => {
  try {
    SQLite.create({
      name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
        try {
          const create = await db.executeSql("create table if not exists loans(name VARCHAR(32) NOT NULL, principle REAL NOT NULL, interest REAL NOT NULL)", [])
          const query = 'insert into loans (name, principle, interest) values (?, ?, ?)'
          console.log("attempt")
          const insert = await db.executeSql(query, [name, principle, interest])
          console.log('Inserted: '+ JSON.stringify(insert))
        } catch (e) {
          console.log('SQL add error: '+ JSON.stringify(e))
        }
    })
  } catch(e) {
    console.log('database add error '+ e)
  }

}

export const getAllLoans = (): Loan[] => {
  const loans: Loan[] = []
  try {
    SQLite.create({
      name: 'loan.db', location: 'default'
    }).then(async (db: SQLiteObject) => {
      console.log("enter1")
        try {
          console.log("enter2")
          const create = await db.executeSql("create table if not exists loans(name VARCHAR(32) NOT NULL, principle REAL NOT NULL, interest REAL NOT NULL)", [])
          console.log('Table created/exists. Msg: '+ create)
          const query = "SELECT * FROM loans"
          const get = db.executeSql(query, []).then(data => {
            // console.log(data)
            for(let i=0; i < data.rows.length; i++){
              console.log(data.rows.item(i))
              loans.push({
                name: data.rows.item(i).name,
                principle: data.rows.item(i).principle,
                interest: data.rows.item(i).interest
              })
            }
            console.log(loans)
            return loans;
          });
          //console.log('found: '+ loans);
          return loans
        } catch (e) {
          console.log('SQL get error: ', e);
          return loans
        }
    })
  } catch(e) {
    console.log('database get error ', e)
    return loans
  }
  return loans
}

 
  // deleteDeveloper(id) {
  //   return this.database.executeSql('DELETE FROM developer WHERE id = ?', [id]).then(_ => {
  //     this.loadDevelopers();
  //     this.loadProducts();
  //   });
  // }
 
  // updateDeveloper(dev: Dev) {
  //   let data = [dev.name, JSON.stringify(dev.skills), dev.img];
  //   return this.database.executeSql(`UPDATE developer SET name = ?, skills = ?, img = ? WHERE id = ${dev.id}`, data).then(data => {
  //     this.loadDevelopers();
  //   })
  // }
