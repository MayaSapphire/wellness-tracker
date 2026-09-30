let editMode = document.getElementById('editMode');
let viewMode = document.getElementById('viewMode');
let settingsMode = document.getElementById('settingsMode');
let currentMode = '';
let selectedDate = new Date();


const entryTypeUserFriendlyNames = {
  'shortText': 'Short Text',
  'longText': 'Long Text',
  'boolean': 'Yes/No',
  'integer': 'Integer',
  'decimal': 'Decimal'
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
  let selectedDateString = selectedDate.toDateString();
  dateDisplay.innerHTML = selectedDateString;
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

    const dateKey = selectedDate.toDateString();
    const savedEntries = JSON.parse(localStorage.getItem(dateKey) || "{}");

    if (entry.type === 'boolean') {
      inputElement.checked = savedEntries[entry.name] === true;
    } else if (entry.type === 'integer' || entry.type === 'decimal') {
      inputElement.value = savedEntries[entry.name] ?? "";
    } else {
      inputElement.value = savedEntries[entry.name] ?? "";
}

    inputElement.id = `entry-${entry.name}`;
    editMode.appendChild(inputElement);

    editMode.appendChild(document.createElement("br"));


    const saveBtn = document.createElement("button");
    saveBtn.innerHTML = "Save";
    saveBtn.onclick = function() {
      let value;
      if (entry.type === 'boolean') {
        value = inputElement.checked;
      } else {
        value = inputElement.value;
      }
      editEntry(selectedDateString, entry.name, value);
    }
    editMode.appendChild(saveBtn);

    editMode.appendChild(document.createElement("br"));
  }

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
