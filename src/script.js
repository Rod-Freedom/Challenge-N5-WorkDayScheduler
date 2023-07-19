const todayP = $('#today');
const hoursContainer = $('#hoursCont');
let today = dayjs();
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

const storeData = () => localStorage.setItem("tasksList", JSON.stringify(tasksList));
const getData = () => {
  tasksList = JSON.parse(localStorage.getItem("tasksList")); 
};

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
  
  todayP.html(today.format(`dddd, MMMM D[${suffix}]`))
};

const getTasks = () => {
  if (localStorage.getItem("tasksList") === null || JSON.parse(localStorage.getItem("tasksList"))[0] != today.format('YYYY-MM-DD')) {
    storeData(); 
  } else { 
    getData(); 
  };
};

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

const colorHours = () => {

  colorHoursFunc();

  setInterval(() => {
    colorHoursFunc();

  }, 60000)

};

const saveTaskFunc = e => {
  let event = $(e.target);
  let dataHour = event.data("hour");
  let savedTask = $(`#task-${dataHour}`).val();

  tasksList[dataHour - 8].task = savedTask;
  console.log(tasksList)
  storeData();
}

const checkedFunc = e => {
  let event = $(e.target);
  let dataHour = event.data("hour");
  

  if (event.data('state') == '') {
    $(`#task-${dataHour}`).addClass('checkedTask');

    tasksList[dataHour - 8].checked = true
    storeData();

    event.addClass('checkedBtn');
    event.children().addClass('checkedBtn');
    event.parent().addClass('checkedBtn');

    event.data('state', 'checked');
    event.children().data('state', 'checked');
    event.parent().data('state', 'checked');

  } else {
    $(`#task-${dataHour}`).removeClass('checkedTask');

    tasksList[dataHour - 8].checked = false
    storeData();

    event.removeClass('checkedBtn');
    event.children().removeClass('checkedBtn');
    event.parent().removeClass('checkedBtn');

    event.data('state', '');
    event.children().data('state', '');
    event.parent().data('state', '');
  }
};

let renderHrs = () => {

  for (i = 9; i < 18; i++) {
    let hr = ``;
    
    if (i > 12) {
      hr = `${i - 12}PM`
    } else {
      hr = `${i}AM`
    }

    const hourRow = $(`
      <div id="hour-${i}" class="row time-block past flex-nowrap" data-hour="${i}">
        <div class="col-2 col-md-1 hour text-center py-3">${hr}</div>
        <textarea class="col-8 col-md-10 description" rows="3" id="task-${i}"></textarea>
        <button class="btn checkBtn col rounded-0" aria-label="check" data-hour="${i}" data-state="">
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
    }
    
    $(`#task-${i}`).html(tasksList[i - 8].task);

    hourRow.on('click', '.checkBtn', checkedFunc);
    hourRow.on('click', '.saveBtn', saveTaskFunc);
  };

}

$(document).ready(function() {
  getTasks();
  todaysDate();
  renderHrs();
  colorHours();
});
