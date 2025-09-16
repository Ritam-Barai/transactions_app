// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: dollar-sign;
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
  Safari.open("scriptable:///run/Transaction Log Widget"); // reload
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

  Safari.open("scriptable:///run/Transaction Log Widget"); // reload
}// /// 
// // insert caching for offline connectivity
// // 
// 
async function insertTransaction(tx){
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
};

//  === Build the UI table ===
async function buildTranTable(data,tranData) {
  let table = new UITable();
  table.showSeparators = true;
  
  const dt = new Date(tranData.time);
  tranDate = dt.toLocaleDateString();
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
async function buildupMenu(table,data,tranData){
  let padding = new UITableRow();
  padding.isHeader = true;
  padding.height = 15;
  table.addRow(padding);
  
  // Header row
  let header = new UITableRow();
  header.isHeader = true;
  header.addText("Amount");
  header.addText("Cr").centerAligned();;
  header.addText("Card");
  header.addText("Time").centerAligned();
//   header.addText("×").rightAligned();// 
// let trashSymbol = SFSymbol.named("trash.fill"); // SF Symbol// 
// let trashImg = trashSymbol.image; // UIImage// 
// header.addImage(trashImg).rightAligned();
let insertButton = header.addButton("📝");
insertButton.rightAligned();
insertButton.Font = Font.boldSystemFont(30);
insertButton.onTap = async () => {
  // Toggle the value
 await iniInsertForm();
//   }catch (error) {
//     console.log("Creating Insert Form failed:", error);
//     console.log("Error details:", error.message);
     };
  table.addRow(header);
  }
  buildupHeader(table,tranData);
  buildupMenu(table,data,tranData);
  buildupTable(table,data);
  
  
async function iniInsertForm() {
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
}

// Usage: Attach this to your button
// let addEntryButton = someRow.addButton("Add Entry");
// addEntryButton.onTap = iniInsertForm;


  async function buildupTable(table,data){
  // Data rows
  for (let i = data.length - 1; i >= 0; i--) {
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
      buildupHeader(table,tranData);
      buildupMenu(table,data,tranData);
      buildupTable(table,data);
      await table.reload();
      
};
    
    let amount = row.addText(`₹${tx.amount}`);
    amount.titleColor = tx.is_credit ? Color.green() : Color.red();
    amount.leftAligned();
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
      buildupHeader(table,tranData);
      buildupMenu(table,data,tranData);
      buildupTable(table,data);
      await table.reload();
      await updateTransaction(tx);
   }catch (error) {
    console.log("Toggle failed:", error);
    console.log("Error details:", error.message);
   }
  };

    row.addText(tx.card.toString());
    const dt = new Date(tx.datetime);
  tranDate = dt.toLocaleDateString(); // "7/7/2025" (or format based on locale)
  tranTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12: false }); // "18:42"
  row.addText(tranTime).centerAligned();
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
      buildupHeader(table,tranData);
      buildupMenu(table,data,tranData);
      buildupTable(table,data);
      await table.reload();
      // Call your Supabase delete function here
     await deleteTransaction(tx);
    }
  };
    
    table.addRow(row);
    
  } 
  
  };
  
  await table.present();
}
// === MAIN ===// 
// let data = await fetchTransactions();// 
// await buildTranTable(data);
try {
  // Setup GET request with Authorization
  
//   const req = new Request(`${SUPABASE_URL}/today-transactions`);
//   req.headers = {
//     " Authorization": `Bearer ${SUPABASE_KEY}`, // 🔹 safer convention
//     "Content-Type": "application/json"
//   };
  const last_tran = await fetchLastTransaction();
  const data = await fetchTransactions();

  // Pretty-print JSON so you can read it in Scriptable logs
  console.log("Pretty response:\n" + JSON.stringify(data)); 
//   , null, 2));
  
  console.log("Type of data:" + typeof data);
console.log("Is Array?" + Array.isArray(data));


  await buildTranTable(data,last_tran);
//   await table.reload();

  
} catch (e) {
  console.error("Fetch error:", e);
}
// 
 Script.complete();