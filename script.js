let editMode = document.getElementById('editMode');
let viewMode = document.getElementById('viewMode');
let settingsMode = document.getElementById('settingsMode');
let currentMode = '';
let selectedDate = new Date();

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const entryTypeUserFriendlyNames = {
  'shortText': 'Short Text',
  'longText': 'Long Text',
  'boolean': 'Yes/No',
  'integer': 'Integer',
  'decimal': 'Decimal'
}

function formatCellValue(entryName, rawValue) {
  const latestEntries = JSON.parse(localStorage.getItem("latestEntries")) || [];
  const entry = latestEntries.find(item => item.name === entryName);

  if (!entry) {
    return rawValue ?? "";
  }

  if (entry.type === "boolean") {
    if (rawValue === "" || rawValue === null || rawValue === undefined) {
      return "";
    }
    return rawValue === true ? "Yes" : "No";
  }

  if (entry.type === "decimal") {
    if (rawValue === "" || rawValue === null || rawValue === undefined) {
      return "";
    }
    return `${Number(rawValue)}%`;
  }

  return rawValue ?? "";
}

class Day {
  constructor(date, entries) {
    this.date = date;
    this.entries = entries;
  }
}

class Entry {
  constructor(name, type, value) {
    this.name = name;
    this.type = type;
    this.value = value;

    const validTypes = ['shortText', 'longText', 'boolean', 'integer', 'decimal']
    if (!this.type in validTypes) {
      // raise an error
      alert("An error has occurred. This is likely the result of a bug.\nInvalid type in Entry constructor: " + this.type)
    } 
  }
}

function switchToEditMode() {
  if (currentMode === 'edit') {
    // cancel switch
    return
  }
  currentMode = 'edit';

  // clear view
  editMode.replaceChildren();
  viewMode.replaceChildren();
  settingsMode.replaceChildren();

  // show edit mode 
  // show current date
  let dateDisplay = document.createElement("h2");
  let selectedDateString = formatDateKey(selectedDate);
  dateDisplay.innerHTML = selectedDate.toDateString();
  editMode.appendChild(dateDisplay)

  // show forward+back buttons
  let previousDayBtn = document.createElement("button");
  previousDayBtn.innerHTML = "Previous Day";
  previousDayBtn.onclick = selectPreviousDate;
  editMode.appendChild(previousDayBtn);

  let nextDayBtn = document.createElement("button");
  nextDayBtn.innerHTML = "Next Day"
  nextDayBtn.onclick = selectNextDate;
  editMode.appendChild(nextDayBtn);
  
  editMode.appendChild(document.createElement("br"));

  const latestEntries = JSON.parse(localStorage.getItem('latestEntries')) || [];
  const savedEntries = JSON.parse(localStorage.getItem(formatDateKey(selectedDate)) || "{}");
  const inputsByEntryName = {};

  if (latestEntries.length === 0) {
    const noEntriesMessage = document.createElement("p");
    noEntriesMessage.innerHTML = "No entries have been created yet. Please use Settings Mode to create entries.";
    editMode.appendChild(noEntriesMessage);
    return;
  }

  for (let i=0; i<latestEntries.length; i++) {
    editMode.appendChild(document.createElement("br"));
    const entry = latestEntries[i];
    const entryLabel = document.createElement("label");
    entryLabel.innerHTML = `${entry.name}: `;
    editMode.appendChild(entryLabel);

    let inputElement;
    switch (entry.type) {
      case 'shortText':
        inputElement = document.createElement("input");
        inputElement.type = "text";
        break;
      case 'longText':
        inputElement = document.createElement("textarea");
        break;
      case 'boolean':
        inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        break;
      case 'integer':
        inputElement = document.createElement("input");
        inputElement.type = "number";
        inputElement.step = "1";
        inputElement.width = "50";
        break;
      case 'decimal':
        inputElement = document.createElement("input");
        inputElement.type = "range";
        inputElement.min = "0";
        inputElement.max = "100";
        inputElement.step = "1";
        break;
      default:
        alert("An error has occurred. This is likely the result of a bug.\nInvalid type in switch statement: " + entry.type)
    }

    if (entry.type === 'boolean') {
      inputElement.checked = savedEntries[entry.name] === true;
    } else {
      inputElement.value = savedEntries[entry.name] ?? "";
    }

    inputElement.id = `entry-${entry.name}`;
    inputsByEntryName[entry.name] = inputElement;
    editMode.appendChild(inputElement);

    editMode.appendChild(document.createElement("br"));
  }

  const saveBtn = document.createElement("button");
  saveBtn.innerHTML = "Save";
  saveBtn.onclick = function() {
    const dayEntries = {};

    for (const [entryName, inputElement] of Object.entries(inputsByEntryName)) {
      const entry = latestEntries.find(item => item.name === entryName);
      if (!entry) continue;

      if (entry.type === 'boolean') {
        dayEntries[entryName] = inputElement.checked;
      } else {
        dayEntries[entryName] = inputElement.value;
      }
    }

    localStorage.setItem(formatDateKey(selectedDate), JSON.stringify(dayEntries));
  }
  editMode.appendChild(saveBtn);

}

function selectPreviousDate() {
  selectedDate.setDate(selectedDate.getDate() - 1);
  currentMode = 'clear';
  switchToEditMode();
}

function selectNextDate() {
  selectedDate.setDate(selectedDate.getDate() + 1);
  currentMode = 'clear';
  switchToEditMode();
}

function switchToViewMode() {
  if (currentMode === 'view') {
    // cancel switch
    return
  }
  currentMode = 'view';

  // clear view
  editMode.replaceChildren();
  settingsMode.replaceChildren();
  viewMode.replaceChildren();

  // show view mode

  const startDateLabel = document.createElement("h3");
  startDateLabel.innerHTML = "Start Date: ";
  viewMode.appendChild(startDateLabel);

  const startDateInput = document.createElement("input");
  startDateInput.type = "date";
  viewMode.appendChild(startDateInput);

  const endDateLabel = document.createElement("h3");
  endDateLabel.innerHTML = "End Date: ";
  viewMode.appendChild(endDateLabel);

  const endDateInput = document.createElement("input");
  endDateInput.type = "date";
  viewMode.appendChild(endDateInput);

  viewMode.appendChild(document.createElement("br"));

  const showEntriesBtn = document.createElement("button");
  showEntriesBtn.innerHTML = "Show Entries";
  showEntriesBtn.onclick = function() {
    const startDateValue = startDateInput.value;
    const endDateValue = endDateInput.value;

    if (!startDateValue || !endDateValue) {
      alert("Please select both start and end dates.");
      return;
    }

    const startDateObj = parseDateKey(startDateValue);
    const endDateObj = parseDateKey(endDateValue);

    if (startDateObj > endDateObj) {
      alert("Start date cannot be after end date.");
      return;
    }

    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.replaceChildren();

    const latestEntries = JSON.parse(localStorage.getItem("latestEntries")) || [];
    const columnNames = latestEntries.map(entry => entry.name);

    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.marginTop = "16px";

    const headerRow = document.createElement("tr");

    const dateHeader = document.createElement("th");
    dateHeader.textContent = "Date";
    dateHeader.style.border = "1px solid #ccc";
    dateHeader.style.padding = "8px";
    headerRow.appendChild(dateHeader);

    columnNames.forEach(name => {
      const headerCell = document.createElement("th");
      headerCell.textContent = name;
      headerCell.style.border = "1px solid #ccc";
      headerCell.style.padding = "8px";
      headerRow.appendChild(headerCell);
    });

    table.appendChild(headerRow);

    let currentDate = new Date(startDateObj);
    while (currentDate <= endDateObj) {
      const currentDateString = formatDateKey(currentDate);
      const entriesForCurrentDate = JSON.parse(localStorage.getItem(currentDateString)) || {};
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = currentDate.toDateString();
      dateCell.style.border = "1px solid #ccc";
      dateCell.style.padding = "8px";
      row.appendChild(dateCell);

      columnNames.forEach(name => {
        const cell = document.createElement("td");
        cell.textContent = formatCellValue(name, entriesForCurrentDate[name]);
        cell.style.border = "1px solid #ccc";
        cell.style.padding = "8px";
        row.appendChild(cell);
      });

      table.appendChild(row);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    resultsContainer.appendChild(table);
  }
  viewMode.appendChild(showEntriesBtn);

  const resultsContainer = document.createElement("div");
  resultsContainer.id = "resultsContainer";
  viewMode.appendChild(resultsContainer);

}


function switchToSettingsMode() {
  if (currentMode === 'settings') {
    // cancel switch
    return
  }
  currentMode = 'settings';

  // clear view
  editMode.replaceChildren();
  viewMode.replaceChildren();
  settingsMode.replaceChildren();

  // show currently existing entries
  const latestEntries = JSON.parse(localStorage.getItem('latestEntries')) || [];
  for (let i = 0; i < latestEntries.length; i++) {
    const entry = latestEntries[i];
    const entryElement = document.createElement("p");
    entryElement.innerHTML = `${entry.name}: ${entryTypeUserFriendlyNames[entry.type]}`;
    settingsMode.appendChild(entryElement);
    const moveUpBtn = document.createElement("button");
    moveUpBtn.innerHTML = "Move Up";
    moveUpBtn.onclick = function() {
      if (i > 0) {
        const temp = latestEntries[i - 1];
        latestEntries[i - 1] = latestEntries[i];
        latestEntries[i] = temp;
        localStorage.setItem('latestEntries', JSON.stringify(latestEntries));
        currentMode = '';
        switchToSettingsMode();
      }
    }
    settingsMode.appendChild(moveUpBtn);

    const moveDownBtn = document.createElement("button");
    moveDownBtn.innerHTML = "Move Down";
    moveDownBtn.onclick = function() {
      if (i < latestEntries.length - 1) {
        const temp = latestEntries[i + 1];
        latestEntries[i + 1] = latestEntries[i];
        latestEntries[i] = temp;
        localStorage.setItem('latestEntries', JSON.stringify(latestEntries));
        currentMode = '';
        switchToSettingsMode();
      }
    }
    settingsMode.appendChild(moveDownBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.onclick = function() {
      latestEntries.splice(i, 1);
      localStorage.setItem('latestEntries', JSON.stringify(latestEntries));
      currentMode = '';
      switchToSettingsMode();
    }
    settingsMode.appendChild(deleteBtn);

    settingsMode.appendChild(document.createElement("br"));
  }

  // create add new entry name entry
  const addNewEntryLabel = document.createElement("h3");
  addNewEntryLabel.innerHTML = "Create New Entry";
  settingsMode.appendChild(addNewEntryLabel);

  const nameLabel = document.createElement("label");
  nameLabel.innerHTML = "Entry Name: ";
  settingsMode.appendChild(nameLabel);
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Entry Name";
  settingsMode.appendChild(nameInput);

  const br = document.createElement("br");
  settingsMode.appendChild(br);

  // create add new entry list
  const label = document.createElement("label");
  label.innerHTML = "Entry Type: ";
  settingsMode.appendChild(label);

  const dropdownMenu = document.createElement("select");
  
  const yesNoOption = document.createElement("option");
  yesNoOption.value = "boolean";
  yesNoOption.text = "Yes/No";
  dropdownMenu.appendChild(yesNoOption);

  const numberOption = document.createElement("option");
  numberOption.value = "integer";
  numberOption.text = "Number";
  dropdownMenu.appendChild(numberOption);

  const longTextOption = document.createElement("option");
  longTextOption.value = "longText";
  longTextOption.text = "Long Text";
  dropdownMenu.appendChild(longTextOption);

  const shortTextOption = document.createElement("option");
  shortTextOption.value = "shortText";
  shortTextOption.text = "Short Text";
  dropdownMenu.appendChild(shortTextOption);

  const slidingScaleOption = document.createElement("option");
  slidingScaleOption.value = "decimal";
  slidingScaleOption.text = "Sliding Scale";
  dropdownMenu.appendChild(slidingScaleOption);

  settingsMode.appendChild(dropdownMenu);

  settingsMode.appendChild(document.createElement("br"));

  const addEntryBtn = document.createElement("button");
  addEntryBtn.innerHTML = "Add Entry";
  addEntryBtn.onclick = function() {
    const entryName = nameInput.value;
    const entryType = dropdownMenu.value;

    if (entryName.trim() === "") {
      alert("Entry name cannot be empty.");
      return;
    }

    // create a new Entry object
    makeNewEntry(entryName, entryType);

    // clear the input fields after adding the entry
    nameInput.value = "";
    currentMode = '';
    switchToSettingsMode();
  }
  settingsMode.appendChild(addEntryBtn);

}

function makeNewEntry(name, type) {
  // create a new Entry object
  const newEntry = new Entry(name, type, null);

  // save the new entry to localStorage
  let entries = JSON.parse(localStorage.getItem('latestEntries')) || [];
  entries.push(newEntry);
  localStorage.setItem('latestEntries', JSON.stringify(entries));
}

function editEntry(date, entry, value) {
  const savedEntries = JSON.parse(localStorage.getItem(date)) || {};
  savedEntries[entry] = value;
  localStorage.setItem(date, JSON.stringify(savedEntries));
}

function getEntries(date) {
  return JSON.parse(localStorage.getItem(date)) || {};
}

function showAboutModal() {
  const modal = document.getElementById('aboutModal');
  const closeBtn = document.getElementById('closeModalBtn');

  // Open the modal
  modal.showModal(); 
}

function closeAboutModal() {
  const modal = document.getElementById('aboutModal');
  modal.close()
}


switchToEditMode()
