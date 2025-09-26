// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
 const SUPABASE_INSERT_URL = Keychain.get("SUPABASE_INSERT_URL");
const SUPABASE_INSERT_KEY = Keychain.get("SUPABASE_INSERT_KEY");


async function insertTransaction(tx){
  
  let url = `${SUPABASE_INSERT_URL}`;
  console.log(tx);
  let req = new Request(url);
  req.method = "POST";
  req.headers = {
//     "apikey": SUPABASE_INSERT_KEY,
    "Authorization": `Bearer ${SUPABASE_INSERT_KEY}`,
    "Content-Type": "application/json"
  };

   // Attach JSON body with tx.id
  req.body = JSON.stringify(tx);
//   await sleep(5000);

    // Use loadJSON() to get parsed object
  let response;
  try {
    response = await req.loadJSON();  
    
  } catch (err) {
    console.error("Request failed:", err);
    throw new Error("Upload failed");
  }
  serverRes = JSON.stringify(response);
  console.log(response.id);

// Check if any entry matches
/*
const tran_data = await utils.fetchTransactions();
console.log(tran_data);
let exists = tran_data.some(entry => parseInt(entry.id) === response.id)

if (exists) {
  console.log(`Found entry with id = ${serverRes.id}. Entry has been verified!`)
} else {
  console.log(`No entry found with id = ${serverRes.id}. Entry not yet stored!`)
}
*/// // 
 Safari.open("scriptable:///run/Transaction Log Widget");// // 
// await sleep(2000);// 
// Safari.open("scriptable:///run/Transaction UI Table");
};

async function pickTime(initialHour = 12, initialMin = 0) {
  let selectedHour = initialHour;
  let selectedMin = initialMin;

  while (true) {
    let mainAlert = new Alert();
    mainAlert.title = "Select Time";
    mainAlert.message = `Hour: ${selectedHour.toString().padStart(2,"0")}   Minute: ${selectedMin.toString().padStart(2,"0")}`;

    mainAlert.addAction("Set Hour");
    mainAlert.addAction("Set Minute");
    mainAlert.addAction("OK");
    mainAlert.addCancelAction("Cancel");

    let choice = await mainAlert.presentAlert();

    if (choice === 0) {
      // Set Hour
      let hourAlert = new Alert();
      hourAlert.title = "Select Hour";
      for (let h = 0; h < 24; h++) hourAlert.addAction(h.toString().padStart(2,"0"));
      let hourIdx = await hourAlert.presentAlert();
      selectedHour = hourIdx;
    } else if (choice === 1) {
      // Set Minute
      let minAlert = new Alert();
      minAlert.title = "Select Minute";
      for (let m = 0; m < 60; m++) minAlert.addAction(m.toString().padStart(2,"0"));
      let minIdx = await minAlert.presentAlert();
      selectedMin = minIdx ;
    } else if (choice === 2) {
      // OK pressed, return time
      return { hour: selectedHour, minute: selectedMin };
    } else {
      // Cancel pressed
      return null;
    }
  }
}

// Pick a date with alerts (last 20 years for year selection)
async function pickDate(initialYear, initialMonth, initialDay) {
  let now = new Date();

  let selectedYear = initialYear || now.getFullYear();
  let selectedMonth = initialMonth || (now.getMonth() + 1); // 1-12
  let selectedDay = initialDay || now.getDate();

  while (true) {
    let mainAlert = new Alert();
    mainAlert.title = "Select Date";
    mainAlert.message =
      `Year: ${selectedYear}   ` +
      `Month: ${selectedMonth.toString().padStart(2,"0")}   ` +
      `Day: ${selectedDay.toString().padStart(2,"0")}`;

    mainAlert.addAction("Set Year");
    mainAlert.addAction("Set Month");
    mainAlert.addAction("Set Day");
    mainAlert.addAction("OK");
    mainAlert.addCancelAction("Cancel");

    let choice = await mainAlert.presentAlert();

    if (choice === 0) {
      // Year selection (last 20 years)
      let yearAlert = new Alert();
      yearAlert.title = "Select Year";
      let currentYear = now.getFullYear();
      for (let y = currentYear; y >= currentYear - 20; y--) {
        yearAlert.addAction(y.toString());
      }
      let yearIdx = await yearAlert.presentAlert();
      selectedYear = currentYear - yearIdx;
    } else if (choice === 1) {
      // Month selection (1-12)
      let monthAlert = new Alert();
      monthAlert.title = "Select Month";
      for (let m = 1; m <= 12; m++) {
        monthAlert.addAction(m.toString().padStart(2,"0"));
      }
      let monthIdx = await monthAlert.presentAlert();
      selectedMonth = monthIdx + 1;
    } else if (choice === 2) {
      // Day selection (adjust days per month/year)
      let daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      let dayAlert = new Alert();
      dayAlert.title = "Select Day";
      for (let d = 1; d <= daysInMonth; d++) {
        dayAlert.addAction(d.toString().padStart(2,"0"));
      }
      let dayIdx = await dayAlert.presentAlert();
      selectedDay = dayIdx + 1;
    } else if (choice === 3) {
      // OK
      return { year: selectedYear, month: selectedMonth, day: selectedDay };
    } else {
      // Cancel
      return null;
    }
  }
};

 async function iniCurrTime(){
// Usage
let now = new Date();
let year = now.getFullYear();
let month = now.getMonth() +1; // months are 0-based
let day = now.getDate();
let hour = now.getHours();
let minute = now.getMinutes();// 
let second = now.getSeconds();
date = {
  year:year,
  month:month,
  day:day,
  hour:hour,
  minute:minute
}

console.log(`Current local time: ${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}:${second.toString().padStart(2,'0')}`);
return date;
}


  // === Main UI ===
function convertToUTC(currDate){
   let utcTimestamp = new Date(
    currDate.year,
    currDate.month-1,
    currDate.day,
    currDate.hour,
    currDate.minute,
    0,
    0
  );
  const utcTime =new Date(utcTimestamp.getTime()).toISOString();
  console.log(utcTime);
  return utcTime;
};


 async function insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  ){

  insertEntry.date = convertToUTC(currDate);
  let isCredit = insertEntry.action === "credited" ? true : false;
  console.log(JSON.stringify(insertEntry));// 
// let utils = importModule('Transaction UI Table');
//    let insertIcon;
  insertIcon = "🔼";
   table.removeAllRows();
   
  
  if(!justForm){
    await buildTable(table,justForm);
    await buildupHeader(table,tranData);
    await buildupMenu(table,data,tranData,insertIcon);
    await buildupTable(table,data);
    
    }else{
      await buildupHeader(table,tranData);
      await buildTable(table,justForm);
    }
    await buildupLastTran(table,tranData);
  await table.reload();

  async function buildTable(table,justForm){
    if(justForm){
    let tpadding = new UITableRow();
  tpadding.isHeader = true;
  tpadding.height = 30;
  table.addRow(tpadding);
  }
    let header = new UITableRow();
    header.isHeader = true;
    
    
    let insertTitle = header.addText("Insert New Entry");
    insertTitle.centerAligned();
    insertTitle.titleFont = Font.boldSystemFont(25);
    table.addRow(header);

    // Row 0: Card, Amount and Credit Headers
    let row0 = new UITableRow();
    row0.height = 35;
    cardH = row0.addText("Card");
    cardH.centerAligned();
    cardH.titleFont = Font.mediumMonospacedSystemFont(15);
    amtH = row0.addText("Amount");
    amtH.centerAligned();
    amtH.titleFont = Font.mediumMonospacedSystemFont(15);
    crH = row0.addText("Cr");
    crH.centerAligned();
    crH.titleFont = Font.mediumMonospacedSystemFont(15);
    table.addRow(row0);

    let row1 = new UITableRow();
    row1.height = 35;
    row1.dismissOnSelect = false;

// Display combined card + amount info in row// 
// let displayText = `${insertEntry.card == "0000" ? "----" : insertEntry.card} | ₹${insertEntry.amount}`;// 
// let cell = row1.addText(displayText);// 
// cell.centerAligned();


    
    
    let cardCell = row1.addButton(insertEntry.card == "0000"? "----": insertEntry.card);
    cardCell.centerAligned();

    cardCell.onTap = async () => {
      let alert = new Alert();
      alert.title = "Enter Last 4 Digits";
      alert.message = "Card number must be exactly 4 digits.";
      alert.addTextField(`Previous Card: ${insertEntry.card=="0000"?tranData.prevCard:insertEntry.card}`);
      alert.addAction("Save");
      alert.addCancelAction("Cancel");

      let choice = await alert.presentAlert();
      if (choice === 0) {
        let value = alert.textFieldValue(0).trim();
        if (/^\d{4}$/.test(value)) {
          cardCell.title = `${value}`;
          insertEntry.card = `${value}`;
        } else {
          let error = new Alert();
          error.title = "Invalid Input";
          error.message = "Please enter exactly 4 digits.";
          error.addAction("OK");
          await error.present();
        }
      }
/*
      table.removeAllRows();
      await buildTable(table);
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData);
      await buildupTable(table,data);
      await table.reload();
      console.log(insertEntry);
*/
await insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  );
    };
  
    let amountCell = row1.addButton(insertEntry.amount == "0.00"? "0.00": insertEntry.amount);
    amountCell.centerAligned();

    amountCell.onTap = async () => {
      let alert = new Alert();
      alert.title = "Enter Amount";
      alert.message = "Enter a number (integer or decimal). It will always be stored with 2 decimal places.";
      alert.addTextField(`Previous Amount: ${insertEntry.amount=="0.00"?tranData.prevAmt:insertEntry.amount}`);
      alert.addAction("Save");
      alert.addCancelAction("Cancel");

      let choice = await alert.presentAlert();
      if (choice === 0) {
        let value = alert.textFieldValue(0).trim();
        if (!isNaN(value) && value !== "") {
          let formatted = `${parseFloat(value).toFixed(2)}`;
          amountCell.title = formatted;
          insertEntry.amount = formatted;
        } else {
          let error = new Alert();
          error.title = "Invalid Input";
          error.message = "Please enter a valid number (e.g., 10 or 10.50).";
          error.addAction("OK");
          await error.present();
        }
      }

      /*
      table.removeAllRows();
      await buildTable(table);
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData);
      await buildupTable(table,data);
      await table.reload();
      console.log(insertEntry);
*/
await insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  );
    };

    let crButton = row1.addButton(isCredit ? " ● " : " ◯ ");
    crButton.centerAligned();

    crButton.onTap = async () => {
      try{
        isCredit = !isCredit;
        crButton.title = isCredit ? " ● " : " ◯ ";
        insertEntry.action = isCredit? "credited":"debited";
        /*
      table.removeAllRows();
      await buildTable(table);
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData);
      await buildupTable(table,data);
      await table.reload();
      console.log(insertEntry);
*/
await insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  );
      }catch(e){};
    };
    // Make the entire row tappable
row1.onSelect = async () => {
  while(true){
    let alert = new Alert();
  alert.title = "Enter Transaction Details";
 console.log(tranData.prev_card)
  // Card text field
  alert.addTextField(
    `Previous Card: ${insertEntry.card=="0000"?tranData.prevCard:insertEntry.card}`, insertEntry.card == "0000" ? "" : insertEntry.card
  );

  // Amount text field
  alert.addTextField(
    `Previous Amount: ${insertEntry.amount=="0.00"?tranData.prevAmt:insertEntry.amount}`, insertEntry.amount == "0.00" ? "" : insertEntry.amount
  );
  alert.addAction(isCredit? "< Credit >": "< Debit >")
  alert.addAction("Save");
  alert.addCancelAction("Cancel");

  let choice = await alert.presentAlert();
  console.log(choice);
  if (choice === -1) {
    break;
  }else{
    let cardVal = alert.textFieldValue(0).trim();
    let amountVal = alert.textFieldValue(1).trim();

    let validCard = true;
    let validAmt = true;

    // Validate card digits
    if (!/^\d{4}$/.test(cardVal) && cardVal !=="") {
      let error = new Alert();
      error.title = "Invalid Card";
      error.message = "Card number must be exactly 4 digits.";
      error.addAction("OK");
      await error.present();
      validCard = false;
    }

    // Validate amount
    let formattedAmt = "0.00"; // default if blank

if (amountVal === "") {
  // If blank, assign default 0.00
  formattedAmt = "0.00";
} else if (isNaN(amountVal)) {
  // Invalid number
  let error = new Alert();
  error.title = "Invalid Amount";
  error.message = "Please enter a valid number (e.g., 10 or 10.50).";
  error.addAction("OK");
  await error.present();
  validAmt = false;
} else {
  // Valid number, format with 2 decimals
  formattedAmt = parseFloat(amountVal).toFixed(2);
}

    if (validCard && validAmt) {
      // Save validated values
      insertEntry.card = (cardVal ==="")?"0000":cardVal;
//       insertEntry.amount = amountVal? amountVal:0.00;
      insertEntry.amount = formattedAmt;
     
      // Update row display
//       cell.title = `${insertEntry.card} | ₹${insertEntry.amount}`;
      }
    if (choice === 0) {
    isCredit =!isCredit;
    insertEntry.action = isCredit? "credited":"debited";
    continue;
    }else if(choice === 1){
     insertEntry.action = isCredit? "credited":"debited";
      break;
       }
    }
  }
      // Rebuild table
      await insertTableEntry(
        table,
        buildupHeader,
        buildupMenu,
        buildupTable,
        buildupLastTran,
        data,
        tranData,
        insertEntry,
        currDate,
        insertIcon,
  justForm
      );
   
};

    table.addRow(row1);

    // Row 2: Date + Time
    let row2 = new UITableRow();

    let dateCell = row2.addButton(` ${currDate.year}-${currDate.month.toString().padStart(2,"0")}-${currDate.day.toString().padStart(2,"0")}`);
    dateCell.widthWeight = 3;
    dateCell.centerAligned();
    dateCell.onTap = async () => {
      console.log("Date Cell Interacted");
      let alert = new Alert();
      alert.title = "Enter Date (YYYY-MM-DD)";
      alert.addTextField("", `${currDate.year}-${currDate.month.toString().padStart(2,"0")}-${currDate.day.toString().padStart(2,"0")}`);
      alert.addAction("OK");
      alert.addCancelAction("Cancel");
      let res = await alert.presentAlert();
      if (res === 0) {
        let parts = alert.textFieldValue(0).split("-");
        if (parts.length === 3) {
          currDate.year = parseInt(parts[0]) || currDate.year;
          currDate.month = parseInt(parts[1]) || currDate.month;
          currDate.day = parseInt(parts[2]) || currDate.day;
        }
      }
      let UTC=convertToUTC(currDate);
      insertEntry.date = `${UTC}`;
      /*
      table.removeAllRows();
      await buildTable(table);
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData);
      await builduptTable(table,data);
      await table.reload();
      console.log(insertEntry);
*/
await insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  );
    };

    let dateUpdate = row2.addButton("📅");
    dateUpdate.leftAligned();
    dateUpdate.widthWeight = 1;
    dateUpdate.onTap = async () => {
      let picked = await pickDate(currDate.year, currDate.month, currDate.day);
      if (picked) {currDate = {
          ...currDate,
          year: picked.year,
          month: picked.month,
          day: picked.day
          }
        }
      let UTC=convertToUTC(currDate);
      insertEntry.date = `${UTC}`;
      /*
      table.removeAllRows();
      await buildTable(table);
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData);
      await buildupTable(table,data);
      await table.reload();
      console.log(insertEntry);
*/
await insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  );
    };

    let timeCell = row2.addButton(`Time: ${currDate.hour.toString().padStart(2,"0")}:${currDate.minute.toString().padStart(2,"0")} IST`);
    timeCell.centerAligned();
    timeCell.widthWeight = 3;
    timeCell.onTap = async () => {
      let alert = new Alert();
      alert.title = "Enter Time (HH:MM)";
      alert.addTextField("", `${currDate.hour.toString().padStart(2,"0")}:${currDate.minute.toString().padStart(2,"0")}`);
      alert.addAction("OK");
      alert.addCancelAction("Cancel");
      let res = await alert.presentAlert();
      if (res === 0) {
        let parts = alert.textFieldValue(0).split(":");
        if (parts.length >= 2) {
          currDate.hour = isNaN(parseInt(parts[0], 10)) ? currDate.hour : parseInt(parts[0], 10);

          currDate.minute = isNaN(parseInt(parts[1], 10)) ? currDate.minute : parseInt(parts[1], 10);

        }
      }
      let UTC=convertToUTC(currDate);
      insertEntry.date = `${UTC}`;
      /*
      table.removeAllRows();
      await buildTable(table);
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData);
      await buildupTable(table,data);
      await table.reload();
      console.log(insertEntry);
*/
await insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  );
    };

    let timeUpdate = row2.addButton("🕒");
    timeUpdate.centerAligned();
    timeUpdate.widthWeight = 1;
    timeUpdate.onTap = async () => {
      let picked = await pickTime(currDate.hour, currDate.minute);
      if (picked) {currDate = {
          ...currDate,
          hour: picked.hour,
          minute: picked.minute,
          }
        }
      let UTC=convertToUTC(currDate);
      insertEntry.date = `${UTC}`;
      /*
      table.removeAllRows();
      await buildTable(table);
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData);
      await buildupTable(table,data);
      await table.reload();
      console.log(insertEntry);
*/
await insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  );
    };

    table.addRow(row2);
    let padding = new UITableRow();
    padding.height = 15;
    table.addRow(padding);

    // Row 3: Cancel + Insert
    let row3 = new UITableRow();
    let cancelBtn = row3.addButton("Cancel");
    cancelBtn.centerAligned();
    cancelBtn.onTap = async () => {
      try{
      console.log("Cancelled");   
//       isFormVisible = false;
      
      
      table.removeAllRows();
      insertIcon = "📝";
      justForm = false;
       await buildupHeader(table,tranData);
       await buildupMenu(table,data,tranData,insertIcon);
       await buildupTable(table,data);
      if(!justForm){
    await buildupLastTran(table,tranData);
  }
      await table.reload();
      return true;
//        return null;
      } catch (error) {
        console.error("Cancel button error:", error);
//         reject(error);
      }
    };

    let insertBtn = row3.addButton("Insert");
    insertBtn.centerAligned();
    
    insertBtn.onTap = async () => {
      
      try {
        console.log(`The date ${insertEntry.date.toString()}`);
        console.log(JSON.stringify(insertEntry));
        
        // Validate future date
        if(new Date(insertEntry.date) > new Date()){
          let alert = new Alert()
          alert.title = "Future Date"
          alert.message = `The date ${insertEntry.date.toString()} is after the current time.`
          alert.addAction("OK")
          await alert.present();
//           resolve(null); // Return null for cancelled operation
//           return;
/*
      table.removeAllRows();
      await buildTable(table);
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData);
      await buildupTable(table,data);
      await table.reload();
      console.log(insertEntry);
*/
await insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  );
        }
        
        // Validate incomplete entry
        else if(insertEntry.card == "0000" || insertEntry.amount == "0.00" ){
          console.error("Invalid/Incomplete Entry!");
          let alert = new Alert()
          alert.title = "Invalid/Incomplete Entry"
          alert.message = `The data entered is either invalid or incomplete. check again!`
          alert.addAction("OK")
          await alert.present();
          
          // Rebuild table
          /*
      table.removeAllRows();
      await buildTable(table);
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData);
      await buildupTable(table,data);
      await table.reload();
      console.log(insertEntry);
*/
await insertTableEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
  insertIcon,
  justForm
  );
          
//           resolve(null); // Return null for invalid entry
//           return;
        }else{
        
        // Success case - show notification
        let n = new Notification();
        n.title = `New Data Entry Received `;
        n.body = `Card ${insertEntry.card} ${insertEntry.action} with ₹${insertEntry.amount} on ${insertEntry.date}`;
        n.sound = "default";
        await n.schedule();
        
        // Rebuild table
//        return insertEntry;
      /*
        table.removeAllRows();
        await buildupHeader(table,tranData);
        await buildupMenu(table,data,tranData);
        await buildupTable(table,data);
        await table.reload();
*/
//         isFormVisible = false;
        // Return the successful entry to the first function
//         resolve(insertEntry);
//         return insertBtn;
  insertIcon = "📝";
   await insertNewEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
//   utils,
  insertIcon,
  justForm
  );

}
      } catch (error) {
        console.error("Insert button error:", error);
//         reject(error);
      }
    };
    
    table.addRow(row3);
    
    padding = new UITableRow();
    padding.height = 15;
    table.addRow(padding);
    
    // Return the Promise that resolves when insert button is tapped
//     return insertBtn;

  }
  
//   // 
// 
// 


/*
   insertIcon = "🔼";
   table.removeAllRows();
  await buildTable(table);
   await buildupHeader(table,tranData,insertIcon);
   await buildupMenu(table,data,tranData);
   await buildupTable(table,data);
  await table.reload();
  
  */
  
  
  
  
  
//   if(typeof tableStatus === "undefined"){// // 
// if( tableStatus){
//     return insertEntry;
//   }
  
  // Build the table and get the insert button// 
// table.removeAllRows();// 
// await buildTable(table);// 
// console.log(`Header Status: ${btnClick}`);
//   if(!isFormVisible){
//     return isFormVisible;
//   }
  
//   await buildupHeader(table,tranData);
//   await buildupMenu(table,data,tranData);
//   await buildupTable(table,data);

//   await table.reload();
  
  // Return Promise that resolves when insert button is tapped
/*
  return new Promise((resolve, reject) => {
    insertBtn.onTap = async () => {
      try {
        console.log("Final:", currDate);
        console.log(insertEntry);
        
        // Validate future date
        if(new Date(insertEntry.date) > new Date()){
          let alert = new Alert()
          alert.title = "Future Date"
          alert.message = `The date ${insertEntry.date.toString()} is after the current time.`
          alert.addAction("OK")
          await alert.present();
          resolve(null); // Return null for cancelled operation
          return;
        }
        
        // Validate incomplete entry
        if(insertEntry.card == "0000" || insertEntry.amount == "0.00" ){
          console.error("Invalid/Incomplete Entry!");
          let alert = new Alert()
          alert.title = "Invalid/Incomplete Entry"
          alert.message = `The data entered is either invalid or incomplete. check again!`
          alert.addAction("OK")
          await alert.present();
          
          // Rebuild table
          table.removeAllRows();
          await buildTable(table);
          await buildupHeader(table,tranData);
          await buildupMenu(table,data,tranData);
          await buildupTable(table,data);
          await table.reload();
          
          resolve(null); // Return null for invalid entry
          return;
        }
        
        // Success case - show notification
        let n = new Notification();
        n.title = `New Data Entry Received `;
        n.body = `Card ${insertEntry.card} ${insertEntry.action} with ₹${insertEntry.amount} on ${insertEntry.date}`;
        n.sound = "default";
        await n.schedule();
        
        // Rebuild table
        table.removeAllRows();
        await buildupHeader(table,tranData,isFormVisible,insertIcon);
        await buildupMenu(table,data,tranData);
        await buildupTable(table,data);
        await table.reload();
        
        // Return the successful entry to the first function
        resolve(insertEntry);
        return insertEntry;
      } catch (error) {
        console.error("Insert button error:", error);
        reject(error);
      }
    };
  });*/
}

async function insertNewEntry(table,
  buildupHeader,
  buildupMenu,
  buildupTable,
  buildupLastTran,
  data,
  tranData,
  insertEntry,
  currDate,
//   utils,
  insertIcon,
  justForm
  ){
    console.log(`New Data Entry Received: ${JSON.stringify(insertEntry)} `);
    let updatedData = data;
    console.log("Last Tran:\n" + JSON.stringify(tranData));
    let untimedEntry ={
        amount: parseFloat(insertEntry.amount),   // number instead of string
  card: insertEntry.card,
  action: insertEntry.action ,
  date: insertEntry.date
      };
    if(justForm){
      let insertResponse = await insertTransaction(untimedEntry);
    }
  
  let localTimestamp = new Date(
  currDate.year,
  currDate.month - 1,
  currDate.day,
  currDate.hour,
  currDate.minute,
  0,
  0
);

console.log(localTimestamp);

// Format to YYYY-MM-DD HH:mm:ss in local time
let formattedTime = localTimestamp.getFullYear() + "-" +
  String(localTimestamp.getMonth() + 1).padStart(2, "0") + "-" +
  String(localTimestamp.getDate()).padStart(2, "0") + " " +
  String(localTimestamp.getHours()).padStart(2, "0") + ":" +
  String(localTimestamp.getMinutes()).padStart(2, "0") + ":" +
  String(localTimestamp.getSeconds()).padStart(2, "0");

console.log(formattedTime);

let formattedLocalTime = localTimestamp.getFullYear() + "-" +
  String(localTimestamp.getMonth() + 1).padStart(2, "0") + "-" +
  String(localTimestamp.getDate()).padStart(2, "0") + "T" +
  String(localTimestamp.getHours()).padStart(2, "0") + ":" +
  String(localTimestamp.getMinutes()).padStart(2, "0") + ":" +
  String(localTimestamp.getSeconds()).padStart(2, "0") ;

console.log(formattedLocalTime);
  let newEntry = {
  amount: parseFloat(insertEntry.amount),   // number instead of string
  id: 0,                         // unique id (you can replace with db id)
  card: parseInt(insertEntry.card),
  is_credit: insertEntry.action === "credited",
  datetime: formattedLocalTime
};
//   updatedData.push(newEntry);
  // Find index where new entry should be inserted
updatedData = updatedData.filter(entry => !(entry.id === -1));

  let index = updatedData.findIndex(entry => new Date(entry.datetime) > new Date(formattedLocalTime));

  if (index === -1) {
    // If no larger datetime found, push at the end
    updatedData.push(newEntry);
  } else {
    // Insert at the found index
    updatedData.splice(index, 0, newEntry);
  }
  
let total = parseFloat(tranData.total);
let netCredit = parseFloat(tranData.netCredit);
let netDebit = parseFloat(tranData.netDebit);
let amount = parseFloat(newEntry.amount);

// Update based on action
if (newEntry.is_credit) {
  total -= amount;
  netCredit += amount;
} else {
  total += amount;
  netDebit += amount;
}

// Update summary
summary = {
  ...tranData,
  total: total.toFixed(2),
  netCredit: netCredit.toFixed(2),
  netDebit: netDebit.toFixed(2),
  prevCard: parseInt(newEntry.card),
  time: formattedTime
//   time: new Date(localTimestamp.getTime())
};
// 
// console.log(summary);


  
  console.log("Updated response:\n" + JSON.stringify(updatedData)); 
  console.log("Updated Last Tran:\n" + JSON.stringify(summary)); 
  
  table.removeAllRows();
       await buildupHeader(table,summary);
       await buildupMenu(table,updatedData,summary,"📝");
       await buildupTable(table,updatedData);
      if(!justForm){
    await buildupLastTran(table,tranData);
  }
      await table.reload();
      
//       let { date, ...untimedEntry } = insertEntry;
      console.log("Timeless entry:\n" + JSON.stringify(untimedEntry)); 
         if(!justForm){
           let insertResponse = await insertTransaction(untimedEntry);
        justForm = false;
        }
//       await sleep(500);
//        Safari.open("scriptable:///run/Transaction Log Widget");
}

module.exports = {insertTableEntry, iniCurrTime,insertNewEntry,insertTransaction};