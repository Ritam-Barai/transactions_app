// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: user-lock;


// Load from Keychain
const SUPABASE_URL = Keychain.get("SUPABASE_GET_HANDLERS_URL");
const SUPABASE_KEY = Keychain.get("SUPABASE_GET_HANDLERS_KEY");



// Create widget
let widget = new ListWidget();
widget.backgroundColor = new Color("#FFFFFF",0.1);
widget.setPadding(5, 0, 0, 0);
widget.widgetURL = "scriptable:///run/Transaction UI Table";
let new_tran = false;

try {
  // Setup GET request with Authorization
  const req = new Request(`${SUPABASE_URL}/last-transaction`);
  req.headers = {
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  const data = await req.loadJSON();
//   console.log(data);
  // Extract date and time from timestamp
let maxTran = data.max_last_tran;
let lastOp = data.last_op;
let tranDate = "N/A";
let tranTime = "N/A";
// Load previously stored transaction timestamp
let fm = FileManager.local();
let dir = fm.documentsDirectory();
let file = fm.joinPath(dir, "last_tran.txt");
let prevTran = null;
let lastCard = null;

if (fm.fileExists(file)) {
   tranFile = fm.readString(file);
   tranData = JSON.parse(tranFile);
   prevTran = tranData.time;
   lastCard = tranData.prevCard;
  console.log(tranData);
}

console.log(`Last Operation: ${lastOp}`);
console.log(lastOp==="UPDATE");
if (maxTran ) {
  const dt = new Date(maxTran);
  tranDate = dt.toLocaleDateString(); // "7/7/2025" (or format based on locale)
  tranTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // "18:42"
let latest_txn ={
  total: data.sum_total ?? 0.00,
  netCredit: data.total_credit ?? 0.00,
  netDebit: data.total_debit ?? 0.00,
  prevCard: data.prev_card ?? lastCard,
  time: maxTran
};
if (maxTran > prevTran && (lastOp!=="UPDATE" || lastOp==="DELETE")) { // maxTran && || lastOp==="INSERT"
  let n = new Notification();
  n.title = "💸 New Transaction Added";
  n.body = `${data.prev_is_credit ? "Credit" : "Debit"}: ₹${data.prev_tran} on Card ${data.prev_card}`;
  n.sound = "default"; // optional: "default", "alert", "complete", etc.
  await n.schedule();
 new_tran = true;
  // Save new transaction timestamp
  fm.writeString(file, JSON.stringify(latest_txn));
  await sleep(500); 
  
} 
else if (maxTran < prevTran) { // || lastOp==="DELETE"
  let n = new Notification();
  n.title = `Transaction Restored `;
  n.body = `${data.prev_is_credit ? "Credit" : "Debit"}: ₹${data.prev_tran} on Card ${data.prev_card} at ${maxTran} `;
//   from ${prevTran}
  n.sound = "default"; // optional: "default", "alert", "complete", etc.
  await n.schedule();
  fm.writeString(file, JSON.stringify(latest_txn));
//   await sleep(500); 
new_tran = false;
}else if((tranData.total !== data.sum_total || tranData.netDebit !== data.total_debit || tranData.netCredit !== data.total_credit )){
  
  
  
//   new_tran = false;

// if((tranData.total !== data.sum_total || tranData.netDebit !== data.total_debit || tranData.netCredit !== data.total_credit )){ // lastOp==="UPDATE" || 
  let n = new Notification();
  n.title = `Net Spends Updated by Card ${data.prev_card}`;
  n.body = `Net Transaction of ${data.sum_total} with net Credit: ₹${data.total_credit} and net Debit: ₹${data.total_debit} Updated `;
//   from ${prevTran}
  n.sound = "default"; // optional: "default", "alert", "complete", etc.
  await n.schedule();
//   fm.writeString(file, JSON.stringify(latest_txn));
//   await new Promise(resolve => setTimeout(resolve, 200));
//   new_tran = false;
  
  fm.writeString(file, JSON.stringify(latest_txn));
//   sleep(200);
  new_tran = false;
}else{new_tran = false;}
console.log(`${data.prev_is_credit ? "Credit" : "Debit"}: ₹${data.prev_tran} on Card ${data.prev_card} at ${maxTran}`);

if((lastCard !== data.prev_card) && lastOp==="UPDATE"){ // lastOp==="UPDATE" || 
  let n = new Notification();
  n.title = `Card Number Updated `;
  n.body = `Card No. ${tranData.prevCard} with the latest spend of ₹${data.prev_tran} updated to ${data.prev_card}`;
//   from ${prevTran}
  n.sound = "default"; // optional: "default", "alert", "complete", etc.
  await n.schedule();
  fm.writeString(file, JSON.stringify(latest_txn));
  new_tran = false;
  }

}

  


  // Format numbers
  //const fmt = (n) => (typeof n === 'number' ? n.toFixed(2) : "0.00");
  // Optionally send a notification

// -----------Notification----------------
/*let n = new Notification();
n.title = "Widget data updated";
n.body = "Fetched latest data from Supabase";
await n.schedule();*/

// Get latest transaction timestamp
//let maxTran = data.max_last_tran;



// If new transaction found



// // // 
// // 
// // 
// // 
// // -------------------------------------------
/*
  // Title
  const title = widget.addText("Daily Spends");
  title.font = Font.boldSystemFont(10);
  title.textColor = Color.white();

  widget.addSpacer(4);

  // Transaction time
  const time = widget.addText(`🕒 ${data.max_last_tran ?? "N/A"}`);
  time.textColor = Color.gray();
  time.font = Font.mediumSystemFont(12);

  widget.addSpacer(4);

  // Totals
  widget.addText(`Total Credit: ₹ ${data.total_credit}`).textColor = Color.green();
  widget.addText(`Total Debit : ₹ ${data.total_debit}`).textColor = Color.red();
  widget.addText(`Net Balance : ₹ ${data.sum_total}`).textColor = Color.cyan();

  widget.addSpacer(6);

  // Last transaction
  const prevType = data.prev_is_credit ? "Credit" : "Debit";
  const prevColor = data.prev_is_credit ? Color.green() : Color.red();

  widget.addText(`💳 Card ${data.prev_card}`).textColor = Color.orange();
  const prev = widget.addText(`${prevType}: ₹ ${data.prev_tran}`);
  prev.textColor = prevColor;

  widget.addSpacer(6);

  // Footer
  const updated = widget.addText("↻ " + new Date().toLocaleTimeString());
  updated.font = Font.systemFont(10);
  updated.textColor = Color.gray();*/
// 
// let widget = new ListWidget();// 
// widget.setPadding(0, 0, 0, 0);
// // 
// widget.addSpacer(0); // Vertical spacing
// Row 1 – 1 column with larger font
let row1 = widget.addStack();
row1.addSpacer();
let row1Text=row1.addText(`${tranDate} Spending:`);
row1Text.font = Font.mediumMonospacedSystemFont(12); // 
row1Text.textColor = new Color("#ffffff",0.5);
//Larger, bold font
row1.addSpacer();
// // 
 widget.addSpacer(0); // Vertical spacing

// Row 2 – 1 column with italic font
let row2 = widget.addStack();
row2.addSpacer();
let row2Text = row2.addText(`₹${data.sum_total ?? '0.00'}`); 
row2Text.font = Font.boldSystemFont(22);
row2.addSpacer();

widget.addSpacer(12);


// 
// widget.addSpacer(3);

// Row 3 – 2 columns (centered)
let row3 = widget.addStack();
row3.addSpacer();
let r3content = row3.addStack();// 
// r3content.addSpacer();
r3content.layoutHorizontally();
r3content.addSpacer();
let r3c1Text = r3content.addText(`₹${data.total_debit ?? '0.00'}`);
r3c1Text.font = Font.mediumSystemFont(11);
r3c1Text.textColor = new Color("#ffffff",0.75);
//row3.addSpacer();
r3content.addSpacer();// 
// row3.addSpacer();// 
// row3.addSpacer();
r3content.addSpacer();
let r3c2Text = r3content.addText(`₹${data.total_credit ?? '0.00'}`);
r3c2Text.font = Font.mediumSystemFont(11);
r3c2Text.textColor = new Color("#ffffff",0.75);
r3content.addSpacer();
row3.addSpacer();

// Row 4 – 2 columns (centered)
let row4 = widget.addStack();
row4.addSpacer();
let r4content = row4.addStack();
r4content.addSpacer();
r4content.layoutHorizontally();// 
// r4content.addSpacer();
let r4c1Text = 
r4content.addText(`Debit`);
r4c1Text.font = Font.mediumMonospacedSystemFont(9);
r4c1Text.textColor = Color.green();
//row4.addSpacer();
r4content.addSpacer();// 
// row4.addSpacer();// 
// row4.addSpacer();
r4content.addSpacer();
let r4c2Text = r4content.addText("Credit");
r4c2Text.font = Font.mediumMonospacedSystemFont(9);
r4c2Text.textColor = Color.red();
//r4content.addSpacer();
r4content.addSpacer();
row4.addSpacer();


widget.addSpacer(12);

// Row 5 – 1 column (centered)
let row5 = widget.addStack();
row5.addSpacer();
let row5Text = row5.addText("Last Spend:");
row5Text.font = Font.mediumMonospacedSystemFont(10);
row5Text.textColor = new Color("#ffffff",0.50);
row5.addSpacer();

widget.addSpacer(0);
// Last transaction
  const prevType = data.prev_is_credit ? "Credit" : "Debit";
  const prevColor = data.prev_is_credit ? new Color("#00ff00") : new Color("#ff0000",0.75) ;

// Row 5 – 1 column (centered)
let row7 = widget.addStack();
row7.addSpacer();
let row7Text = row7.addText(`${prevType}: ₹${data.prev_tran}`);
row7Text.textColor = prevColor;
row7Text.font = Font.semiboldSystemFont(12);
row7.addSpacer();

widget.addSpacer(3);
// Row 4 – 2 columns (centered)
let row6 = widget.addStack();// 
 row6.addSpacer(20);
let r6content = row6.addStack();
r6content.layoutHorizontally();
let r6c1Text = 
r6content.addText(`💳 ${data.prev_card}`);
r6c1Text.font = Font.mediumMonospacedSystemFont(8);
r6content.addSpacer(30);
let r6c2Text = 
r6content.addText(`🕒 ${tranTime ?? 'N/A'}`);
r6c2Text.font = Font.mediumMonospacedSystemFont(8);
row6.addSpacer(15);

widget.addSpacer(6);

//Footer
let footer = widget.addStack();// 
 footer.addSpacer();
   updated = footer.addText("↻ " + new Date().toLocaleTimeString());
  updated.font = Font.systemFont(10);
  updated.textColor = Color.gray();
footer.addSpacer();
// Display the widget

} catch (e) {
  const err = widget.addText("❌ Error loading data");
  err.textColor = Color.red();
  err.font = Font.boldSystemFont(14);
}
if(!new_tran){ 
     Safari.open("scriptable:///run/Transaction UI Table");
}
widget.refreshAfterDate = new Date(Date.now() + 30*1000);

// Display the widget
if (config.runsInWidget) {
  Script.setWidget(widget);
} // // // 
// else {
//   
//  await widget.presentSmall(); // adjust to .presentSmall() or .presentLarge() as needed
   
// }

Script.complete();