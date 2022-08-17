const savebtn = document.querySelector(".savebtn");
const inputtxt = document.querySelector("#inputtxt");
const delbtn = document.querySelector(".delbtn");
const tabbtn = document.querySelector(".tabbtn");
const leadlist = document.querySelector(".leadlist");
const errormessage = document.querySelector("#errormessage");
let leads = "";
let editFlag = false;
let editItem;
let editid;

// ====================================================
// LOAD CONTENT OF LOCAL SORAGE AND DISPLAY ON THE Web
// =====================================================

(function () {
  let itemfromlocalstorage = getdata();

  render(itemfromlocalstorage);
})()



// ==============================================

// ==============================================
// --------------- EVENT LISTENER --------------
// ==============================================

leadlist.addEventListener("click", action);

savebtn.addEventListener("click", saveItem);

// ==============================================

// ==============================================
// --------------- LOCAL STORAGE --------------
// ==============================================

function getdata() {
  return localStorage.getItem("my leads")
    ? JSON.parse(localStorage.getItem("my leads"))
    : [];
}

function deleteFromLocalStorage(id) {
  const myleads = getdata();
  const result = myleads.filter(function (lead) {
    if (lead.id !== id) {
      return item;
    }
  });

  localStorage.setItem("my leads", JSON.stringify(result));
}

function editItemInLocalStorge(id, value) {
  const storedData = getdata();
  const item = storedData.map(function (items) {
    if (items.id === id) {
      items.value = value;
    }
    return items;
  });


  localStorage.setItem("my leads", JSON.stringify(item));
}

// ==============================================
// ==============================================
// ----------- split edit text ----------
// ==============================================


function spliText(text) {
  return text.substring(2)
}


// ==============================================
// ==============================================
// -------------- SAVE AND EDIT FN ------------
// ==============================================

function saveItem() {
  if (inputtxt.value && !editFlag) {
    // get exiting leads
    let myLeads = getdata();
    // generate the new lead id 
    const id = new Date().getTime().toString();
    const item = { id: id, value: inputtxt.value };
    let valuearray=myLeads.map(function (lead) {
      return lead.value
    })
  //  check if lead already exit
    if (!valuearray.includes(item.value)) {
      myLeads.push(item);
      render(myLeads, id);
  
      // ##### STORE IN LOCAL STORAGE #####
      localStorage.setItem("my leads", JSON.stringify(myLeads));
  
      // editbtn.addEventListener('click', editfn)
  
      inputtxt.value = "";
  
    } else {
      let index=valuearray.indexOf(inputtxt.value)+1
      renderErrorMessage(`The input already exist at number ${index}`,'error')
    }
  } else if (inputtxt.value && editFlag) {
    let value = inputtxt.value;
    editItemInLocalStorge(editid, inputtxt.value);
    let leads=getdata()
    render(leads)
    backtodefault();
  } else if (!inputtxt.value && editFlag) {
    renderErrorMessage("input field is empty", "error");
  } else {
    renderErrorMessage("input field is empty", "error");
  }
}

// ==============================================
// ==============================================
// --------------- DELETE AND EDIT --------------
// ==============================================

function action(e) {
  const target = e.target;

  if (target.classList.contains("delete-btn")) {
    const element = target.parentElement.parentElement;
    const id = element.dataset.id;
    leadlist.removeChild(element);
    renderErrorMessage("item removed", "sucess");
    deleteFromLocalStorage(id);
    backtodefault();
  } else if (target.classList.contains("fa-trash")) {
    const element = target.parentElement.parentElement.parentElement;
    const id = element.dataset.id;
    deleteFromLocalStorage(id);

    leadlist.removeChild(element);
    renderErrorMessage("item removed", "sucess");
    backtodefault();
  } else if (target.classList.contains("edit-btn")) {
    editItem = target.parentElement.previousElementSibling;
    inputtxt.value = spliText(editItem.textContent);
    editFlag = true;
    editid = editItem.parentElement.dataset.id;
    savebtn.textContent = "SAVE EDIT";
  } else if (target.classList.contains("fa-edit")) {
    editItem = target.parentElement.parentElement.previousElementSibling;
    inputtxt.value = spliText(editItem.textContent);
    editFlag = true;
    editid = editItem.parentElement.dataset.id;
    savebtn.textContent = "SAVE EDIT";
  }
}

// ==============================================

// ==============================================
// --------- RENDER ON BROWSER --------
// ==============================================

function render(argument) {
  let leadListItems = "";
  let id;
  for (let i = 0; i < argument.length; i++) {
    leads = argument[i].value;
    id = argument[i].id;
    let num = i + 1;
    
    leadListItems += `<li data-id="${id}">
    <a target='_blank' href='${leads}'>${num}.${leads}</a> 
     <div class="btncn">
    <button class="edit-btn"><i class="fas fa-edit"></i></button>
    <button class="delete-btn"><i class="fas fa-trash"></i></button>
  </div>
    </li>`;
  }
  leadlist.innerHTML = leadListItems;
}

function renderErrorMessage(txt, clas) {
  errormessage.textContent = txt;
  errormessage.classList.add(clas);
  setTimeout(() => {
    errormessage.classList.remove(clas);
  }, 2000);
}

// ==============================================

// ==============================================
// --------------- DELETE ALL FN --------------
// ==============================================

delbtn.addEventListener("dblclick", function () {
  localStorage.clear();
  leads = [];
  render(leads);
  backtodefault()
});

// ==============================================

// ==============================================
//  GETTING THE ACTIVE TABS FROM CHROME
// =============================================
tabbtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let activeTab = tabs[0].url;
    let myLeads = getdata();
    const id = new Date().getTime().toString();
    const item = { id: id, value: activeTab };
    let valuearray=myLeads.map(function (values) {
      return values.value
    })
    if (!valuearray.includes(item.value)) {
      myLeads.push(item);
    render(myLeads, id);
    localStorage.setItem("my leads", JSON.stringify(myLeads));
    backtodefault()
  
    } else {
      let index=valuearray.indexOf(activeTab)+1
      renderErrorMessage(`The tab already exist at number ${index}`,'error')
    
  }});
});

// ==============================================

// ==============================================
// --------------- BACK TO DEFAULT --------------
// ==============================================

function backtodefault() {
  editFlag = false;
  editid = "";
  savebtn.textContent = "SAVE INPUT";
  inputtxt.value = "";
}

// ==============================================
