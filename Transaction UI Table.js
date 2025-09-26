// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: dollar-sign;
// share-sheet-inputs: file-url, plain-text, url;
//ormatting may be inconsistent from source
// 📌 Daily Transactions Viewer - Scriptable

// === CONFIG ===
const SUPABASE_URL = Keychain.get("SUPABASE_GET_HANDLERS_URL");
const SUPABASE_KEY = Keychain.get("SUPABASE_GET_HANDLERS_KEY");// safe only for public reads
const TABLE_NAME = "trans_today";

const SUPABASE_INSERT_URL = Keychain.get("SUPABASE_INSERT_URL");
const SUPABASE_INSERT_KEY = Keychain.get("SUPABASE_INSERT_KEY");



// === Fetch today's data from Supabase ===
async function fetchTransactions() {
//   const today = new Date().toISOString().split("T")[0];in // YYYY-MM-DD
  const url = `${SUPABASE_URL}/today-transactions`;

  let req = new Request(url);
  req.method = "GET";
  req.headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  return await req.loadJSON();
}

async function fetchSortedTransactions(isAsc = true, isTimeSort = true, filterType = "all") {
  // build query string with defaults

  /*const params = new URLSearchParams({
    isAsc: isAsc.toString(),
    isTimeSort: isTimeSort.toString()
  });
  console.log(params)

  const url = `${SUPABASE_URL}/today-transactions?${params.toString()}`;*/
filterType = (filterType === ("Cr | Db" || "all"))?"all": filterType;
console.log(filterType)
let queryString = `isAsc=${isAsc ? "true" : "false"}&isTimeSort=${isTimeSort ? "true" : "false"}&filterType=${filterType}`;

// Full URL
const url = `${SUPABASE_URL}/today-transactions?${queryString}`;
 console.log(url);
  let req = new Request(url);
  req.method = "GET";
  req.headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  return await req.loadJSON();
}


async function fetchLastTransaction() {
//   const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
let fm = FileManager.local();
let dir = fm.documentsDirectory();
let file = fm.joinPath(dir, "last_tran.txt");
let tranData = null;

if (fm.fileExists(file)) {
  console.log("Cache Found");
   tranFile = fm.readString(file);
   tranData = JSON.parse(tranFile);
//    prevTran = tranData.total;
 }
 return tranData;
}

//async function createInsertion(table){}

// === Edit a transaction ===
async function editTransaction(tx) {
  try {
    console.log("Opening edit dialog for transaction:", tx);
    
    let alert = new Alert();
    alert.title = "Edit Transaction";
    alert.message = `Edit the values below:\nCard: ${tx.card}\nAmount: ${tx.amount}`;
    
    // Convert to string to avoid issues
    let card_field = alert.addTextField(`Card : Old value(${tx.card})`,tx.card.toString());
    
    alert.addTextField(`Amount : Old value(${tx.amount})`, tx.amount.toString());
    
    alert.addAction("Save");
    alert.addCancelAction("Cancel");
    
    console.log("About to present alert...");
    let choice = await alert.presentAlert();
    console.log("Alert choice:", choice);
    
    if (choice === 0) { // Save
      let newCard = alert.textFieldValue(0);
      newCard = String(newCard).padStart(4, "0");
 
      let newAmount = alert.textFieldValue(1);
     if(newCard == tx.card && newAmount == tx.amount){
      let alert = new Alert();
    alert.title = "Error";
    alert.message = "Duplicate values passed"
   alert.addAction("OK");
  
   let response = await alert.present(); // wait for user tap

if (response === 0) {
  // OK pressed, handle if needed
  console.log("User pressed OK");
   return null;
  }
}
      console.log(`New values - Card: ${newCard}, Amount: ${newAmount}`);
      
      // Create updated transaction object
/*
      let updatedTx = {
        ...tx,  // Keep all original properties
        card: newCard,
        amount: newAmount || tx.amount  // Parse as number, fallback to original
      };
      */
      tx.card = newCard;
      tx.amount = newAmount;
      console.log(`Returning updated transaction - Card: ${tx.card}, Amount: ${tx.amount}`);
      return tx;
      
    } else { // Cancel
      console.log("Edit cancelled by user");
//       await table.reload();
       return null;  // Return null instead of original tx
    }
  } catch (error) {
    console.error("Error in editTransaction:", error);
    return null;
  }
}

// === Update transaction in Supabase ===
async function updateTransaction(tx) {
  let url = `${SUPABASE_URL}/update-transaction`;
  let req = new Request(url);
  req.method = "PATCH";
  req.headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
  };
  req.body = JSON.stringify(tx);

  let response = await req.load();
  console.log("Server response:", response);
  Safari.open("scriptable:///run/Transaction Log Widget"); // reload// 
// Script.complete();
}

// === Delete transaction ===
async function deleteTransaction(tx) {
  let url = `${SUPABASE_URL}/del-transaction`;
  let req = new Request(url);
  req.method = "DELETE";
  req.headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

   // Attach JSON body with tx.id
  req.body = JSON.stringify({ id: tx.id });

  let response = await req.load();
  console.log("Server response:", response);

  Safari.open("scriptable:///run/Transaction Log Widget"); // reload// 
// Script.complete();
}// /// 
// // insert caching for offline connectivity
// // 
// 
/*
async function insertTransaction(tx){
  const SUPABASE_INSERT_URL = Keychain.get("SUPABASE_INSERT_URL");
const SUPABASE_INSERT_KEY = Keychain.get("SUPABASE_INSERT_KEY");
  let url = `${SUPABASE_INSERT_URL}`;
  let req = new Request(url);
  req.method = "POST";
  req.headers = {
    "apikey": SUPABASE_INSERT_KEY,
    "Authorization": `Bearer ${SUPABASE_INSERT_KEY}`,
    "Content-Type": "application/json"
  };

   // Attach JSON body with tx.id
  req.body = JSON.stringify(tx);

  let response = await req.load();
  if (response.status !== 200) throw new Error("Upload failed");
  console.log("Server response:", response);

// Check if any entry matches
const tran_data = await fetchTransactions();
let exists = tran_data.some(entry => entry.id === response.id)

if (exists) {
  console.log(`Found entry with id = ${response.id}. Entry has been verified!`)
} else {
  console.log(`No entry found with id = ${response.id}. Entry not yet stored!`)
}

  Safari.open("scriptable:///run/Transaction Log Widget"); 
};*/
let insertIcon = "📝";
//  === Build the UI table ===
async function buildTranTable(data,tranData,newTran,newEntry) {
  let table = new UITable();
  table.showSeparators = true;
  
  const dt = new Date(tranData.time);
  tranDate = dt.toLocaleDateString();
  let isFormVisible = false;
  let justForm = false;
  let sortAsc = true;
  let isTimeSort = true;
  let timeSortIcon = isTimeSort ? (!sortAsc ? "⬆️" : "⬇️") : "⏯️";
let amtSortIcon = isTimeSort ? "⏯️" : (sortAsc ? "⬆️" : "⬇️");
let actionStates = [ "Cr | Db","Cr", "Db"]
let stateIndex = 0   // start at Cr
const uniqueCards = [...new Set(data.map(item => item.card))].map(c => 
  String(c).padStart(4, "0")
);

console.log(uniqueCards); // ["1234", "5678", "9999"]

//   let iconSymbol = SFSymbol.named("square.and.pencil"); // SF Symbol
//     let icon = iconSymbol.image;
   
//   icon.toBase64String;
//   "📝";
  async function buildupHeader(table,tranData){
  // Header row
  let date = new UITableRow();
  date.isHeader = true;
  let dateRow = date.addText(`${tranDate}`);
  dateRow.centerAligned();
  //dateRow.titleFont = Font.systemFont(30);
  table.addRow(date);

  // Header row
  let total = new UITableRow();
  total.isHeader = true;
  total.height = 40;
  let totalRow = total.addText(`₹${tranData.total}`);
  totalRow.centerAligned();
  totalRow.titleFont = Font.boldSystemFont(30);
  totalRow.titleColor = (tranData.total < 0.00) ? Color.green() : Color.red();
  table.addRow(total);
  
  let subtotal = new UITableRow();
  subtotal.isHeader = true;
  subtotal.height = 40;
  subtotal.addText("Debit: ");
  let netDebit = subtotal.addText(`₹${tranData.netDebit}`);
//   totalRow.centerAligned();
//   totalRow.titleFont = Font.boldSystemFont(30);
  netDebit.titleColor = Color.red() ;
  subtotal.addText("Credit: ");
  let netCredit = subtotal.addText(`₹${tranData.netCredit}`);
//   totalRow.centerAligned();
//   totalRow.titleFont = Font.boldSystemFont(30);
  netCredit.titleColor = Color.green() ;
  table.addRow(subtotal);
  
  };
async function buildupMenu(table,data,tranData,insertIcon){
  if(insertIcon === "🔼"){
    isFormVisible = true;
  }
  else if(insertIcon === "📝"){
    isFormVisible = false;
  }
  let padding = new UITableRow();
  padding.isHeader = true;
  padding.height = 15;
  table.addRow(padding);
  
  // Header row
  let header = new UITableRow();
//   header.rowSpacing = 0;
  header.isHeader = true;
  
  header.addText("Amount").leftAligned();
  
//  amtVal.widthWeight = 0.1;
//  amtVal.cellSpacing = 1;
  
 let tranType = header.addText(actionStates[stateIndex]).centerAligned();// 
//  header.addText("").centerAligned();
  header.addText("Card").centerAligned();// 
// header.addText("").rightAligned();
  header.addText("Time ").rightAligned();
  
  
  
  // Helper to refresh button labels/icons
async function refreshButtons() {
  timeSortIcon = isTimeSort ? (!sortAsc ? "⬆️" : "⬇️") : "⏸️";
  amtSortIcon = !isTimeSort ? (sortAsc ? "⬆️" : "⬇️") : "⏸️";

  timeSort.title = timeSortIcon;
  amtSort.title = amtSortIcon;
//   console.log(sortAsc + isTimeSort)
  try{
  const sortData = await fetchSortedTransactions(sortAsc, isTimeSort,actionStates[stateIndex]);
  console.log(sortData);
  
  table.removeAllRows();
      await buildupHeader(table,tranData);
      
      await buildupMenu(table,sortData,tranData,insertIcon);
      await buildupTable(table,sortData);
      if(!justForm){
    await buildupLastTran(table,tranData);
  }
  await table.reload(); // refresh UI
 }catch(e){
  console.error("Fetch error:", e);
};
}
//   header.addText("×").rightAligned();// 
// let trashSymbol = SFSymbol.named("trash.fill"); // SF Symbol// 
// let trashImg = trashSymbol.image; // UIImage// 
// header.addImage(trashImg).rightAligned();
let insertButton = header.addButton(insertIcon);
insertButton.rightAligned();
insertButton.Font = Font.boldSystemFont(30);
insertButton.onTap = async () => {
  justForm = false;
  console.log(`Form visible: ${isFormVisible}`);
//   isFormVisible = true;// 
//  insertIcon = "🔼";
//  await iniInsertForm();

  if (!isFormVisible) {
  // Toggle the value
isFormVisible = true;
insertIcon = "🔼";
 await iniInsertForm();

  } else {
    // Hide form (collapse)
isFormVisible = false;
insertIcon = "📝";
table.removeAllRows();
      await buildupHeader(table,tranData);
      
      await buildupMenu(table,data,tranData,insertIcon);
      await buildupTable(table,data);
      if(!justForm){
    await buildupLastTran(table,tranData);
  }
      await table.reload();
}
//   }catch (error) {
//     console.log("Creating Insert Form failed:", error);
//     console.log("Error details:", error.message);
     };
  table.addRow(header);
  
  let ctlPnl = new UITableRow();
//   header.rowSpacing = 0;
  ctlPnl.isHeader = true;
  ctlPnl.height = 30;
  let amtSort = ctlPnl.addButton(amtSortIcon);
  amtSort.centerAligned();
//   let c1= header.addCell(amtSort);
//   amtSort.widthWeight = 0;
  amtSort.onTap = async () => {
    if (!isTimeSort) {
    // Already active → just toggle up/down
    sortAsc = !sortAsc;
  } else {
    // Switch from time → make other sort active
    isTimeSort = false;
    sortAsc = true; // reset to default "up" when activated
  }
  await refreshButtons();
  };
  
  let tglAction = ctlPnl.addButton("🔃");
  tglAction.centerAligned();
//   tglAction.widthWeight = 0;
  tglAction.font = Font.systemFont(8);
  tglAction.onTap = async () => {
 stateIndex = (stateIndex + 1) % actionStates.length;
console.log(actionStates[stateIndex])
//   tranType.title = actionStates[stateIndex];
  try{
  const sortData = await fetchSortedTransactions(sortAsc, isTimeSort,actionStates[stateIndex]);
  console.log(sortData);
  
  table.removeAllRows();
      await buildupHeader(table,tranData);
      
      await buildupMenu(table,sortData,tranData,insertIcon);
      await buildupTable(table,sortData);
      if(!justForm){
    await buildupLastTran(table,tranData);
  }
  await table.reload(); // refresh UI
 }catch(e){
  console.error("Fetch error:", e);
}
      
  };
    let cardFilter = ctlPnl.addButton("📂");
  cardFilter.centerAligned(); //
//   tglAction.widthWeight = 0;
  cardFilter.font = Font.systemFont(8);
  cardFilter.onTap = async () => {
//     if (isTimeSort) {
console.log(`Unique Cards: ${uniqueCards}`);
  let vUtils = importModule('Views_utils');
  const selObj = await vUtils.makeDropDown(uniqueCards);
  console.log(`Selected items: ${selObj.selection}`);
  console.log(`Ascending?: ${selObj.isAsc}`);
      
    }
//     ctlPnl.addText(" ").rightAligned();
  
  let timeSort = ctlPnl.addButton(timeSortIcon);
  timeSort.rightAligned();
  timeSort.widthWeight = 0;
  timeSort.font = Font.systemFont(8);
  timeSort.onTap = async () => {
    if (isTimeSort) {
    // Already active → just toggle up/down
    sortAsc = !sortAsc;
  } else {
    // Switch from other → make time sort active
    isTimeSort = true;
    sortAsc = true; // reset to default "up" when activated
  }
  await refreshButtons();
};
ctlPnl.addText("").rightAligned();
table.addRow(ctlPnl);
let ctlpadding = new UITableRow();
  ctlpadding.isHeader = true;
  ctlpadding.height = 15;
  table.addRow(ctlpadding);
 }
async function buildupLastTran(table,tranData){
  
  let padding = new UITableRow();
  padding.isHeader = true;
  padding.height = 20;
  table.addRow(padding);
  
// Create a new table row for "Last Spend:"
let row5 = new UITableRow();
row5.isHeader = true;
row5.height = 30; // adjust height as needed
let row5Cell = row5.addText("Last Spend:");
row5Cell.titleColor = Color.gray();
row5Cell.titleFont = Font.mediumMonospacedSystemFont(12);
row5Cell.centerAligned();
table.addRow(row5);


// Last transaction: type and amount
const prevType = (tranData.prevIsCredit ==="true") ? "Credit" : "Debit";
const prevColor = (tranData.prevIsCredit ==="true") ? Color.green() : Color.red();
const dt = new Date(tranData.time);
  let tranDate = dt.toLocaleDateString()??'N/A'; // "7/7/2025" (or format based on locale)
  let tranTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })??'N/A'; // "18:42"


let row7 = new UITableRow();
row7.height = 30;
let cardCell = row7.addText(`💳${tranData.prevCard}`);
cardCell.titleFont = Font.mediumMonospacedSystemFont(13);
cardCell.leftAligned(); // align left// 
// let row7Cell1 = row7.addText(`${prevType}    :       `);
let row7Cell1 = row7.addText(`${prevType}:`);
row7Cell1.titleFont = Font.semiboldSystemFont(13);
row7Cell1.rightAligned();// 
// let row7pad =row7.addText(``);// 
// row7pad.centerAligned();
let row7Cell2 = row7.addText(`₹${tranData.prevAmt}`);
row7Cell2.titleFont = Font.boldSystemFont(13);
row7Cell2.titleColor = prevColor;
row7Cell2.leftAligned();

let timeCell = row7.addText(`🕒${tranTime ?? 'N/A'}`);
timeCell.titleFont = Font.mediumMonospacedSystemFont(13);
timeCell.rightAligned(); // align right// 
// table.addRow(row6);

table.addRow(row7);

let bpadding = new UITableRow();
  bpadding.isHeader = true;
  bpadding.height = 20;
  table.addRow(bpadding);
/*
// Card number and transaction time row
let row6 = new UITableRow();
row6.height = 30;

// Add Card cell
let cardCell = row6.addText(`💳 ${tranData.prevCard}`);
cardCell.titleFont = Font.mediumMonospacedSystemFont(15);
cardCell.centerAligned(); // align left

// Add spacer between card and time// 
// row6.addSpacer(1);

// Add Time cell
let timeCell = row6.addText(`🕒 ${tranTime ?? 'N/A'}`);
timeCell.titleFont = Font.mediumMonospacedSystemFont(15);
timeCell.centerAligned(); // align right
table.addRow(row6);*/
  
}
  
  await buildupHeader(table,tranData);
  await buildupMenu(table,data,tranData,insertIcon);
  await buildupTable(table,data);
  if(!justForm){
    await buildupLastTran(table,tranData);
  }
  
  async function iniInsertForm() {
  let utils = importModule('Insert_form');
  let currDate = await utils.iniCurrTime();

  let insertEntry = {
    card: "0000",
    amount: "0.00",
    action: "debited",
    date: ""
  };
//   console.log(`Form Initial: ${insertEntry}`);
  
/* let resultEntry = null;

while (true) {
  resultEntry = await utils.insertTableEntry(
    table,
    buildupHeader,
    buildupMenu,
    buildupTable,
    data,
    tranData,
    insertEntry,
    currDate
  );

  if (resultEntry) {
    console.log(`result Entry: ${resultEntry}`);
    break; // ✅ exit loop once found
  }

  console.log("No Entry yet, retrying...");
  // prevent infinite CPU spin
  await new Promise(resolve => setTimeout(resolve, 500));
}*/

await utils.insertTableEntry(
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
  console.log(`Form Returned: ${isFormVisible}`);
//   Safari.open("scriptable:///run/Transaction Log Widget"); 

}

/*async function iniInsertForm() {
  try {
    console.log("Starting iniInsertForm...");
    
    // Check if the module can be imported
    let utils;
    try {
      utils = importModule('Insert_form'); // Make sure this matches your exact filename
      console.log("Module imported successfully");
    } catch (moduleError) {
      console.error("Failed to import module 'Insert form':", moduleError);
      throw new Error("Module import failed: " + moduleError.message);
    }
    
    // Check if iniCurrTime exists and works
    let currDate;
    try {
      currDate = await utils.iniCurrTime();
      console.log("Current date retrieved:", currDate);
    } catch (timeError) {
      console.error("Failed to get current time:", timeError);
      throw new Error("Time retrieval failed: " + timeError.message);
    }
    
    let insertEntry = {
      card: "0000",
      amount: "0.00",
      action: "debited",
      date: ""
    };
    console.log("Initial insertEntry:", insertEntry);
    
    // Check if all required parameters exist
    console.log("Checking parameters...");
    console.log("table exists:", typeof table !== 'undefined');
    console.log("buildupHeader exists:", typeof buildupHeader !== 'undefined');
    console.log("buildupMenu exists:", typeof buildupMenu !== 'undefined');
    console.log("buildupTable exists:", typeof buildupTable !== 'undefined');
    console.log("data exists:", typeof data !== 'undefined');
    console.log("tranData exists:", typeof tranData !== 'undefined');
    
    // Call the insert form with error handling
    let resultEntry;
    try {
      console.log("Calling insertTableEntry...");
      resultEntry = await utils.insertTableEntry(
        table,
        buildupHeader,
        buildupMenu,
        buildupTable,
        data,
        tranData,
        insertEntry,
        currDate
      );
      console.log("insertTableEntry completed, result:", resultEntry);
    } catch (insertError) {
      console.error("Error in insertTableEntry:", insertError);
      throw new Error("Insert table entry failed: " + insertError.message);
    }
    
    // Handle the result
    if (resultEntry) {
      console.log(`New Entry: ${JSON.stringify(resultEntry)}`);
      
      // Check if insertTransaction function exists
      if (typeof insertTransaction === 'function') {
        await insertTransaction(resultEntry);
        console.log("Transaction inserted successfully");
      } else {
        console.warn("insertTransaction function not found");
      }
    } else {
      console.log("Operation was cancelled or invalid");
    }
    
  } catch (error) {
    console.error("Error in iniInsertForm:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    
    // Show user-friendly error
    let alert = new Alert();
    alert.title = "Error";
    alert.message = `Failed to open insert form: ${error.message}`;
    alert.addAction("OK");
    await alert.present();
  }
}*/

// Usage: Attach this to your button
// let addEntryButton = someRow.addButton("Add Entry");
// addEntryButton.onTap = iniInsertForm;


  async function buildupTable(table,data){
  // Data rows
  for (let i = data.length - 1; i >= 0; i--) {
    data[i].card = String(data[i].card).padStart(4, "0");
//     data[i].amount
 
    let tx = data[i];
    // your code here


    let row = new UITableRow();
      row.dismissOnSelect = false;
     let row_updated = false;
    row.onSelect = async () => {  // Remove parameter - onSelect doesn't pass any
  try {
    console.log("Row selected, starting edit...");
    
    let prevTx = {...tx};
    tx = await editTransaction(tx);
    
    if (tx) {  // Check if edit was successful
      // Update the data array
      data[i].card = tx.card;
      data[i].amount = tx.amount;
      
      console.log(`Transaction updated successfully: ${data[i].card} from ${prevTx.card}`);
      if(prevTx.card != tx.card){
        let n = new Notification();
  n.title = `Updated Card Number `;
  n.body = `Card No. ${prevTx.card} with spend of ₹${prevTx.amount} updated to ${tx.card}`;
//   from ${prevTran}
  n.sound = "default"; // optional: "default", "alert", "complete", etc.
  await n.schedule();
      }
      if(prevTx.amount != tx.amount){
        let n = new Notification();
  n.title = `Updated Card Spend `;
  n.body = ` Spending of ₹${prevTx.amount} on Card No. ${prevTx.card} updated to ₹${tx.amount}`;
//   from ${prevTran}
  n.sound = "default"; // optional: "default", "alert", "complete", etc.
  await n.schedule();
      }
      await updateTransaction(tx);
      // Optional: Rebuild table to show changes
      // rebuildTranTable();
    } else {
      console.log("Edit was cancelled");
    }
  } catch (error) {
    console.log("Alert box failed:", error);
    console.log("Error details:", error.message);
  }
  table.removeAllRows();
      await buildupHeader(table,tranData);
//       if(!justForm){
//     await buildupLastTran(table,tranData);
//   }
      await buildupMenu(table,data,tranData,insertIcon);
      await buildupTable(table,data);
      if(!justForm){
    await buildupLastTran(table,tranData);
  }
      await table.reload();
      
};
    
    let amount = row.addText(`₹${Number(tx.amount).toFixed(2)}`);
    amount.titleColor = tx.is_credit ? Color.green() : Color.red();
    amount.centerAligned();
//     let isCredit = tx.is_credit;
    let button = row.addButton(tx.is_credit ? "●" : "○");
button.centerAligned();

// Handle the button tap
button.onTap = async () => {
  // Toggle the value
  try{
    tx.is_credit = !tx.is_credit;

  // Update the UI
  button.title = tx.is_credit ? "●" : "○";

  // Update your data object
//   tx.is_credit = isCredit;
  data[i].is_credit = tx.is_credit;
  console.log(`Credit toggled from ${!data[i].is_credit} to  ${data[i].is_credit}`);
  let n = new Notification();
  n.title = `Transaction Type Updated`;
  n.body = `Spend Type Toggled from ${!data[i].is_credit ? "Credit" : "Debit"} to ${data[i].is_credit ? "Credit" : "Debit"}`;

//   from ${prevTran}
  n.sound = "default"; // optional: "default", "alert", "complete", etc.
  await n.schedule();
  row_updated = true;
      table.removeAllRows();
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData,insertIcon);
      await buildupTable(table,data);
      if(!justForm){
    await buildupLastTran(table,tranData);
  }
      await table.reload();
      await updateTransaction(tx);
   }catch (error) {
    console.log("Toggle failed:", error);
    console.log("Error details:", error.message);
   }
  };

    row.addText(tx.card.toString()).centerAligned();
    const dt = new Date(tx.datetime);
  tranDate = dt.toLocaleDateString(); // "7/7/2025" (or format based on locale)
  tranTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: false }); // "18:42"
  row.addText(tranTime).rightAligned();
//   row.addText("").rightAligned(); 
  let cell = row.addButton("✖️");
  cell.rightAligned();
  cell.titleColor = Color.red();
    // Swipe right to delete
  cell.onTap = async () => {
    let alert = new Alert();
    alert.title = "Transaction Options";
    alert.message = `Amount: ${tx.amount}\nCard: ${tx.card}`;
    alert.addDestructiveAction("Delete");
    alert.addCancelAction("Cancel");
    
    let choice = await alert.presentSheet();
    if (choice === 0) {
//       table.removeAllRows(); // Remove from table
      data = data.slice(0, i).concat(data.slice(i + 1));
//       data = newdata;
      console.log(JSON.stringify(data));
      console.log(`Deleted transaction: ${tx.amount} on card ${tx.card}`);
      
      
      table.removeAllRows();
      await buildupHeader(table,tranData);
      await buildupMenu(table,data,tranData,insertIcon);
      await buildupTable(table,data);
      if(!justForm){
    await buildupLastTran(table,tranData);
  }
  
      await table.reload();
      // Call your Supabase delete function here
     await deleteTransaction(tx);
    }
  };
    
    table.addRow(row);
    
  } 
  
  };
  if(newTran){
    justForm = true;
    await iniInsertForm();
  }
   else if(newEntry){
      let utils = importModule('Insert_form');
  let currDate = await utils.iniCurrTime();
    await utils.insertNewEntry(
    table,
    buildupHeader,
    buildupMenu,
    buildupTable,
    buildupLastTran,
    data,
    tranData,
    newEntry,
    currDate,
    insertIcon,
  justForm
  );
    
  }
  
  await table.present();
}
// === MAIN ===// 
// let data = await fetchTransactions();// 
// await buildTranTable(data);
// 
// module.exports = {fetchLastTransaction,fetchTransactions};// // 


try {
  // Setup GET request with Authorization
  
//   const req = new Request(`${SUPABASE_URL}/today-transactions`);
//   req.headers = {
//     " Authorization": `Bearer ${SUPABASE_KEY}`, // 🔹 safer convention
//     "Content-Type": "application/json"
//   };
// Access query parameters// 
 let newTranReq = args.queryParameters.newTran;// 
 let newEntry = args.shortcutParameter;
console.log(`Parameter: ${newTranReq} & ${newEntry}`)
// Convert back to boolean
let newTran = newTranReq === "true";
if(newTran){// 
// console.log("Received newTran:", newTran)
let n = new Notification();
n.title = ` Transaction UI Table`;
//   n.title = `Parameter: ${newTranReq} & ${newEntry}`;
  n.body = `Opening Table with Insert Form `;
//   n.body = `${JSON.stringify(newTranStr)} `;
//   from ${prevTran}
  n.sound = "default"; // optional: "default", "alert", "complete", etc.
  await n.schedule();
  console.log(`Widget parameter (boolean):" ${newTran}`)
}
else if(newEntry){
  let n = new Notification();
n.title = ` New External Transaction Registry`;// 
// n.title = `Parameter: ${newTranReq} & ${newEntry}`;
//   n.body = `Opening Table with Insert Form `;
//   n.body = `${JSON.stringify(newTranStr)} `;
n.body = `Card ${newEntry.card} ${newEntry.action} with ₹${newEntry.amount} on ${newEntry.date}`;
//   from ${prevTran}
  n.sound = "default"; // optional: "default", "alert", "complete", etc.
  await n.schedule();
//   console.log(`Widget parameter (boolean):" ${newTran}`)
}
  
  const last_tran = await fetchLastTransaction();
  const data = await fetchTransactions();

  // Pretty-print JSON so you can read it in Scriptable logs
  console.log("Pretty response:\n" + JSON.stringify(data)); 
//   , null, 2));
  
  console.log("Type of data:" + typeof data);
console.log("Is Array?" + Array.isArray(data));


   await buildTranTable(data,last_tran,newTran,newEntry);
//   await table.reload();

  
} catch (e) {// 
console.error("Fetch error:", e);
}
 Script.complete();