let editMode = document.getElementById('editMode');
let viewMode = document.getElementById('viewMode');
let settingsMode = document.getElementById('settingsMode');
let currentMode = '';
switchToEditMode()

function switchToEditMode() {
  if (currentMode === 'edit') {
    // cancel switch
    return
  }
  currentMode = 'edit';

  // clear viewMode and settingsMode
  viewMode.replaceChildren();
  settingsMode.replaceChildren();

  // show edit mode 
  // show current date
  let dateDisplay = document.createElement("h2");
  let selectedDate = new Date;
  let selectedDateString = selectedDate.toDateString();
  dateDisplay.innerHTML = selectedDateString;
  editMode.appendChild(dateDisplay)

  // show forward+back buttons
  let previousDayBtn = document.createElement("button");

}

function switchToViewMode() {
  if (currentMode === 'view') {
    // cancel switch
    return
  }
  currentMode = 'view';

  // clear editMode and settingsMode
  editMode.replaceChildren();
  settingsMode.replaceChildren();

  // show view mode

}

function switchToSettingsMode() {
  if (currentMode === 'settings') {
    // cancel switch
    return
  }
  currentMode = 'settings';

  // clear editMode and viewMode
  editMode.replaceChildren();
  viewMode.replaceChildren();

  // show settings mode

}

function switchToSettingsMode() {
  if (currentMode === 'settings') {
    // cancel switch
    return
  }
  currentMode = 'settings';

  // clear editMode and viewMode
  editMode.replaceChildren();
  viewMode.replaceChildren();

  // show settings mode

}

function showAboutModal() {
  const modal = document.getElementById('aboutModal');
  const closeBtn = document.getElementById('closeModalBtn');

  // Open the modal
  modal.showModal(); 


  // Close the modal
  closeBtn.addEventListener('click', () => {
    modal.close();
  });

}

function closeAboutModal() {
  const modal = document.getElementById('aboutModal');
  modal.close()
}
