const todayP = $('#today'); // This const is linked to the paragraph that displays today's date in the site's header.
const hoursContainer = $('#hoursCont'); // This const is linked with the container that holds all the rows by hour of the day.
let today = dayjs();

// This array holds all the values for each hour by task and checks in rows to store it in the local environment.
// The first value corresponds to the date of the last tasks saved.
let tasksList = [
  today.format('YYYY-MM-DD'), {
    hour: 9,
    task: "",
    checked: false
  }, {
    hour: 10,
    task: "",
    checked: false
  }, {
    hour: 11,
    task: "",
    checked: false
  }, {
    hour: 12,
    task: "",
    checked: false
  }, {
    hour: 13,
    task: "",
    checked: false
  }, {
    hour: 14,
    task: "",
    checked: false
  }, {
    hour: 15,
    task: "",
    checked: false
  }, {
    hour: 16,
    task: "",
    checked: false
  }, {
    hour: 17,
    task: "",
    checked: false
  },
];

//These two funcs are called by the getTasks func to create an initial string in the local storage or fetch an existing one.
const storeData = () => localStorage.setItem("tasksList", JSON.stringify(tasksList));
const getData = () => {
  tasksList = JSON.parse(localStorage.getItem("tasksList")); 
};

// The following lines set today's date and assign a suffix for the day number.
const todaysDate = () => {
  let suffix = '';
  let todaysDay = today.format('D');
  
  if (todaysDay == 1) {
    suffix = 'st'
  } else if (todaysDay == 2) {
    suffix = 'nd'
  } else if (todaysDay == 3) {
    suffix = 'rd'
  } else {
    suffix = 'th'
  }
  
  // Now the value displays in the html element.
  todayP.html(today.format(`dddd, MMMM D[${suffix}]`))
};

// This function calls for the storeData and getData funcs, depending on the situation:
// If the local storage is empty or the date differs from the actual date, it will reset the data. 
const getTasks = () => {
  if (localStorage.getItem("tasksList") === null || JSON.parse(localStorage.getItem("tasksList"))[0] != today.format('YYYY-MM-DD')) {
    storeData(); 
  } else { 
    getData(); 
  };
};

// This func checks all the rows to compare them with the actual real-time hour, to update the colors of each row.
const colorHoursFunc = () => {
  for (i = 9; i < 18; i++) {
    let hourRowEl = $(`#hour-${i}`);

    if (hourRowEl.data('hour') < today.format('H')) {
      hourRowEl.addClass('past');
      hourRowEl.removeClass('present');
      hourRowEl.removeClass('future');

    } else if (hourRowEl.data('hour') == today.format('H')) {
      hourRowEl.addClass('present');
      hourRowEl.removeClass('past');
      hourRowEl.removeClass('future');

    } else {
      hourRowEl.addClass('future');
      hourRowEl.removeClass('past');
      hourRowEl.removeClass('present');

    };
  }

  console.log("Hi Rod")
};

// The following function calls for the colorHoursFunc every minute.
const colorHours = () => {

  colorHoursFunc();

  setInterval(() => {
    colorHoursFunc();

  }, 60000)

};

// This function will be called by a click event each time any row is saved. 
const saveTaskFunc = e => {
  let event = $(e.target);
  let dataHour = event.data("hour");
  let savedTask = $(`#task-${dataHour}`).val();

  tasksList[dataHour - 8].task = savedTask;
  storeData();
}

// This function will be called by a click event each time any task is checked.
const checkedFunc = e => {
  let event = $(e.target);
  let dataHour = event.data("hour"); // To link the data-hour from the click event target to make changes to the corresponding row.
  
  // In case the data-state is empty...
  if (event.data('state') == '') {
    $(`#task-${dataHour}`).addClass('checkedTask'); // Each row task has a unique id declared as soon as the page loads, to be referred to later.

    tasksList[dataHour - 8].checked = true; // To change the "checked" property value in the array.
    storeData(); // Updates the local storage.

    // The following changes the data-state for the buttons to be identified as checked.
    event.addClass('checkedBtn');
    event.children().addClass('checkedBtn');
    event.parent().addClass('checkedBtn');

    event.data('state', 'checked');
    event.children().data('state', 'checked');
    event.parent().data('state', 'checked');

  } else {
    $(`#task-${dataHour}`).removeClass('checkedTask');
    
    tasksList[dataHour - 8].checked = false // To change the "checked" property value in the array.
    storeData();
    
    // The following changes the data-state for the buttons to be identified as not checked.
    event.removeClass('checkedBtn');
    event.children().removeClass('checkedBtn');
    event.parent().removeClass('checkedBtn');

    event.data('state', '');
    event.children().data('state', '');
    event.parent().data('state', '');
  }
};

// The following will render the whole page when called.
let renderHrs = () => {

  for (i = 9; i < 18; i++) {
    let hr = ``;
    
    if (i > 12) {
      hr = `${i - 12}PM`
    } else if (i == 12) {
      hr = hr = `12PM`
    } else {
      hr = `${i}AM`
    }

    const hourRow = $(`
      <div id="hour-${i}" class="row time-block past flex-nowrap" data-hour="${i}">
        <div class="col-2 col-md-1 hour text-center py-3">${hr}</div>
        <textarea class="col-8 col-md-10 description" rows="3" id="task-${i}"></textarea>
        <button class="btn checkBtn col rounded-0" aria-label="check" id="checkBtn-${i}" data-hour="${i}" data-state="">
          <i class="fa-solid fa-square-check" data-hour="${i}" data-state=""></i>
        </button>
        <button class="btn saveBtn col" data-hour="${i}" aria-label="save">
          <i class="fas fa-save" aria-hidden="true" data-hour="${i}"></i>
        </button>
      </div>
    `)
    
    hoursContainer.append(hourRow);
    
    if (tasksList[i - 8].checked == true) {
      $(`#task-${i}`).addClass('checkedTask');

      $(`#checkBtn-${i}`).addClass('checkedBtn');
      $(`#checkBtn-${i}`).children().addClass('checkedBtn');

      $(`#checkBtn-${i}`).data('state', 'checked');
      $(`#checkBtn-${i}`).children().data('state', 'checked');
    }
    
    $(`#task-${i}`).html(tasksList[i - 8].task);

    hourRow.on('click', '.checkBtn', checkedFunc);
    hourRow.on('click', '.saveBtn', saveTaskFunc);
  };

}

// One last bit will call all the necessary funcs when the site is ready.
$(document).ready(function() {
  getTasks();
  todaysDate();
  renderHrs();
  colorHours();
});
