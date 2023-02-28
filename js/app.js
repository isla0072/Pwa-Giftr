import CACHE from "./cache.js";

const APP = {
   isOnline: "onLine" in navigator && navigator.onLine,
   currentPage: "home",
   selectedPerson: 0,
   selectedGift: 0,
   people: [],
   
   init() {
      APP.registerWorker();
      APP.addListeners();
      CACHE.init();
      APP.showPeople();
   },

   addListeners() {
    const offlineTitle  = document.getElementById('offline');

    if (!APP.isOnline) {
      offlineTitle.innerHTML = 'OFFLINE';
    }
    window.addEventListener('online', (ev) => {
      offlineTitle.innerHTML = '';
    });
    window.addEventListener('offline', (ev) => {
      offlineTitle.innerHTML = 'OFFLINE';
    });

    
    document.getElementById("back-button").addEventListener('click', APP.backButton);
    document.getElementById("add-button").addEventListener("click", APP.addButton);

    document.getElementById("add-edit-person").addEventListener("submit", (ev) => {
    ev.preventDefault();
    APP.savePerson();
    });

    document.getElementById("delete-person").addEventListener("click", () => {
    if (APP.selectedPerson) {
        if (confirm("Are you sure you want to delete this person?")) {
        CACHE.deletePerson(APP.selectedPerson.id);
        APP.showPeople();
        APP.navigate("home");
        }
    }
    });

    document.getElementById("cancel-person").addEventListener("click", () => {
    APP.selectedPerson = null;
    APP.navigate("home");
    });

    document.getElementById("add-gift").addEventListener("submit", (ev) => {
    ev.preventDefault();
    APP.addGift();
    });

    document.getElementById("delete-gift").addEventListener("click", () => {
    if (APP.selectedPerson) {
        if (confirm("Are you sure you want to delete this gift?")) {
        APP.showGifts();
        }
    }
    });

    document.getElementById("cancel-gift").addEventListener("click", () => {
    APP.navigate("gift-list");
    });

  },

  registerWorker() {
    if ("serviceWorker" in navigator) {
          navigator.serviceWorker.register("/sw.js");
    }
 },

  backButton(){
    switch (APP.currentPage) {
      case "add-edit-person":
        APP.navigate("home");
        break;
      case "add-gift":
        APP.navigate("gift-list");
        break;
      case "gift-list":
        APP.navigate("home");
        break;
    }
  },

  addButton(ev){
    switch (APP.currentPage) {
      case "home":
        APP.selectedPerson = null;
        document.getElementById('person-name').value = "";
        document.getElementById('person-dob').value = "";
        APP.navigate("add-edit-person");
        break;
    case "add-edit-person":
        APP.navigate("home");
        break;
    }
  },

  navigate(page) {
    document.body.className = page;
    APP.currentPage = page;
    switch (page) {
      case "home":
        document.getElementById("home").style.display = "block";
        document.getElementById("add-edit-person").style.display = "none";
        document.getElementById("gift-list").style.display = "none";
        document.getElementById("add-gift").style.display = "none";
        break;
      case "add-edit-person":
        document.getElementById("home").style.display = "none";
        document.getElementById("add-edit-person").style.display = "block";
        document.getElementById("gift-list").style.display = "none";
        document.getElementById("add-gift").style.display = "none";
        break;
      case "gift-list":
        document.getElementById("home").style.display = "none";
        document.getElementById("add-edit-person").style.display = "none";
        document.getElementById("gift-list").style.display = "block";
        document.getElementById("add-gift").style.display = "none";
        break;
      case "add-gift":
        document.getElementById("home").style.display = "none";
        document.getElementById("add-edit-person").style.display = "none";
        document.getElementById("gift-list").style.display = "none";
        document.getElementById("add-gift").style.display = "block";
        break;
    }
  },
  savePerson() {
    const personName = document.getElementById('person-name').value;
    const birthDate = document.getElementById('person-dob').value;
  
    if (!personName || !birthDate) {
      alert('Please enter a name and a date of birth.');
      return;
    }
  
    const name = personName.trim();
    const dob = new Date(birthDate);
  
    const newPerson = {
      id: Date.now(),
      name: name,
      dob: dob
    };
  
    
    CACHE.put(newPerson.id.toString(), new Response(JSON.stringify(newPerson)).toString())
    .then(() => {
        const list = document.getElementById('person-list');
        const message = list.querySelector('p');
    if (message) {
      message.remove();
    }
        const newListItem = document.createElement('li');
        newListItem.innerHTML = `
          <div class="person-info">
        <p class="person-name"><span class="namedob">${newPerson.name} - ${newPerson.dob.toLocaleString('default', { month: 'short', day: 'numeric' })}</span></p>
        <div class="person-actions">
            <button class="add-edit-person" data-id="${newPerson.id}">Edit</button>
            <button class="delete-person" data-id="${newPerson.id}">Delete</button>
            <button class="add-gift" data-id="${newPerson.id}">Add Gift</button>
        </div>
        </div>
        `;
        list.appendChild(newListItem);
        APP.showPeople();
        APP.navigate('home');
    })
    .catch(console.error);
  },  
  showPeople() {
    CACHE.getFileNames().then((fileNames) => {
      const peoplePromises = fileNames.map((fileName) => {
        return CACHE.match(fileName).then((response) => response.json());
      });
      Promise.all(peoplePromises).then((people) => {
        const list = document.getElementById('person-list').querySelector('ul');
        list.innerHTML = ` `;
      });
    });
  },  
   cancelPerson() {
      APP.selectedPerson = null;
      APP.navigate('home');
   },

   deletePerson(id) {
      if (APP.selectedPerson) {
         const id = APP.selectedPerson.id;
         CACHE.deletePerson(id);
         caches.open(CACHE.cacheName).then((cache) => {
            cache.delete(id.toString());
         });
         APP.showPeople();
      }
   },


};

document.addEventListener('DOMContentLoaded', APP.init);

