// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
// let options = ["Credit", "Debit", "Net"];

async function makeDropDown(options) {
  let isAsc = null;
  let selectedFlags = Array(options.length).fill(false);
  let allSelected = false;

  let done = false;
  let selectObj = { selection: [], isAsc: null };

  while (!done) {
    let alert = new Alert();
    alert.title = "Select Options";
    let selectedItems = options.filter((_, i) => selectedFlags[i]);
    selectObj.selection = selectedItems;
    selectObj.isAsc = isAsc;

    // Update allSelected
    allSelected = selectedItems.length === options.length;

    // Add option buttons
    for (let [i, opt] of options.entries()) {
      alert.addAction(`${selectedFlags[i] ? "●" : "○"} ${opt}`);
    }

    // Select/Deselect All button
    alert.addAction(allSelected ? "Deselect All" : "Select All");

    // Asc/Desc toggle button (only if more than 1 selected)
    if (selectedItems.length > 1) {
      isAsc = isAsc === null ? true : isAsc;
      alert.addAction(isAsc ? "<Ascending>" : "<Descending>");
    } else {
      isAsc = null;
    }

    // Cancel & Done
    alert.addCancelAction("Cancel");
    alert.addAction("Done");

    // Message
    alert.message = `${selectedItems.length > 0 ? `Selected: ${selectedItems.join(", ")}` : "Pick an option"}\n${selectedItems.length > 1 ? (isAsc ? "Ascending" : "Descending") : " "}`;

    let choice = await alert.presentAlert();
//     console.log(choice)
    if (choice < options.length && choice !==-1) {
      // Toggle selection of option
      selectedFlags[choice] = !selectedFlags[choice];
    } else if (choice === options.length) {
      // Select/Deselect All
      allSelected = !allSelected;
      selectedFlags = Array(options.length).fill(allSelected);
    } else if( choice === options.length + 1) {
      // Asc/Desc toggle
if (selectedItems.length > 1) {
  
      isAsc = (isAsc === null)? true : !isAsc;
      } else{
        selectObj.selection = selectedItems;
    selectObj.isAsc = isAsc;
        done = true
      }
    } else if (choice === options.length + 2) {
      // Done
     if (selectedItems.length > 1) {
      selectObj.selection = selectedItems;
    selectObj.isAsc = isAsc;
      done = true;
      }else{
        selectedFlags = Array(options.length).fill(false);
      done = true;
      selectObj.selection = [];
      selectObj.isAsc = null;
      }
    } else if( choice === options.length + 3 || choice === -1) {
      // Cancel
      selectedFlags = Array(options.length).fill(false);
      done = true;
      selectObj.selection = [];
      selectObj.isAsc = null;
    }
  }

  return selectObj;
}
/*
try {
  const selObj = await makeDropDown(options);
  console.log(`Selected items: ${selObj.selection}`);
  console.log(`Ascending?: ${selObj.isAsc}`);
} catch (e) {
  console.error(e);
}*/
// 
 module.exports = {makeDropDown};
// 
// Script.complete();
