// STORAGE CONTROLLER
const StorageCtrl = (function(){
  // public-methods
  return{
    storeItem: function(item){
      let items;

      // check-if-any-items-in-localstorage
      if(localStorage.getItem('items') === null){

        items = [];

        // push-new-item
        items.push(item);

        // set-local-storage
        localStorage.setItem('items', JSON.stringify(items));

      } else {
        // get-what-is-in-localstorage
        items = JSON.parse(localStorage.getItem('items'));

        // push-new-item
        items.push(item);

        // reset-localstorgae
        localStorage.setItem('items', JSON.stringify(items));

      }
    },

    getItemsFromStorgae: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }


})();

// ITEM CONTROLLER
const ItemCtrl = (function(){
  // item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // data structure
  const data = {
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Eggs', calories: 300},
    // ],
    items: StorageCtrl.getItemsFromStorgae(),
    currentItem: null,
    totalCalories: 0
  }

  // public-methods
  return{
    getItems: function(){
      return data.items;
    },

    addItem: function(name, calories){
      let ID;
      // create-id
      if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
      } else{
        ID = 0;
      }

      // calories-to-number
      calories = parseInt(calories);

      // create-new-item
      newItem = new Item(ID, name, calories);

      // add-to-items-array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function(id){
      let found = null;

      // loop-through-the-items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });

      return found;
    },

    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function(id){
      // get-ids
      ids = data.items.map(function(item){
        return item.id;
      });

      // get-index
      const index = ids.indexOf(id);

      // remove-item
      data.items.splice(index, 1)
    },

    clearAllItems: function(){
      data.items = [];
    },

    setCurrentItem: function(item){
      data.currentItem = item;
    },

    getCurrentItem: function(){
      return data.currentItem;
    },

    getTotalCalories: function(){
      let total = 0;

      // loop-through-items-and-add-calories
      data.items.forEach(function(item){
        total += item.calories;
      });

      // set-total-calories-in-data-structure
      data.totalCalories = total;

      // return-total
      return data.totalCalories;
    },

    logData: function(){
      return data;
    }
  }
})();





// UI CONTROLLER
const UICtrl = (function(){

  const UISelectors = {
    itemList: '.results',
    listItems: '.results li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    mealNameInput: '.meal',
    calorieNameInput: '.calories',
    totalCalories: '.total-calories',
    updateBtn: '.update-btn'
  }

  // public-methods
  return{
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `
        <li id="item-${item.id}">
          <div class="meal">
            <strong>${item.name}:</strong>
            <em>${item.calories} Calories </em>
          </div>
          <span><i class="edit-item fa-solid fa-pencil"></i></span>
        </li>

        `
      });

      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function(){
      return{
        name: document.querySelector(UISelectors.mealNameInput).value,
        calories: document.querySelector(UISelectors.calorieNameInput).value
      }
    },

    addListItem: function(item){
      // create-li-element
      const li = document.createElement('li');

      // add-id
      li.id = `item-${item.id}`;

      // add-html
      li.innerHTML = `
      
      <div class="meal">
        <strong>${item.name}:</strong>
        <em>${item.calories} Calories</em>
      </div>
      <span><i class="edit-item fa-solid fa-pencil"></i></span>
      
      `;

      // insert-item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },

    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = 
          `
          <div class="meal">
            <strong>${item.name}:</strong>
            <em>${item.calories} Calories</em>
          </div>
          <span><i class="edit-item fa-solid fa-pencil"></i></span>
          `;

        }
      });
    },

    deleteListItem: function(id){
      const itemID = `#item-${id}`;

      const item = document.querySelector(itemID);

      item.remove();
    },

    clearInput: function(){
      document.querySelector(UISelectors.mealNameInput).value ='';

      document.querySelector(UISelectors.calorieNameInput).value ='';
    },

    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    addItemToForm: function(){
      document.querySelector(UISelectors.mealNameInput).value = ItemCtrl.getCurrentItem().name;

      document.querySelector(UISelectors.calorieNameInput).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },

    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn-node-list-into-array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      })
    },

    clearEditState: function(){
      UICtrl.clearInput();

      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';

      document.querySelector(UISelectors.backBtn).style.display = 'none';

      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';

      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';

      document.querySelector(UISelectors.backBtn).style.display = 'inline';

      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function(){
      return UISelectors;
    }
  }

})();






// APP CONTROLLER
const App = (function(ItemCtrl, StorageCtrl, UICtrl){

  // load-event-listenrs
  const loadEventListeners = function(){
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // add-item-event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // disable-submit-on-enter
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // edit-icon-click-event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // update-item-event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // delete-item-event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // back-button-event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // clear-item-event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

  }

  // add-item-submit
  const itemAddSubmit = function(e){

    // get-form-input-from-UI-controller
    const input = UICtrl.getItemInput();

    // check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // add-item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // add-item-to-ui-list
      UICtrl.addListItem(newItem);

      // get-total-calorie
      const totalCalories = ItemCtrl.getTotalCalories();

      // add-total-calories-to-UI
      UICtrl.showTotalCalories(totalCalories);

      // store-in-local-storage
      StorageCtrl.storeItem(newItem);

      // clear-fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // click-edit-item
  const itemEditClick = function(e){

    if(e.target.classList.contains('edit-item')){
      // get-list-item-id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // break-into-an-array
      const listIdArray = listId.split('-');

      // get-actual-id
      const id = parseInt(listIdArray[1])

      // get-item
      const itemToEdit = ItemCtrl.getItemById(id);

      // set-current-item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add-item-to-form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // item-update-submit
  const itemUpdateSubmit = function(e){
    // get-item-input
    const input = UICtrl.getItemInput();

    // update-item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update-ui
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // update-local-storage
    StorageCtrl.updateItemStorage(updatedItem);

    // clear-edit-state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // item-delete-submit
  const itemDeleteSubmit = function(e){
    // get-current-item
    const currentItem = ItemCtrl.getCurrentItem();

    // delete-from-data-structure
    ItemCtrl.deleteItem(currentItem.id);

    // delete-from-ui
    UICtrl.deleteListItem(currentItem.id);
    
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // delete-from-local-storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    // clear-edit-state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  // clear-items-event
  const clearAllItemsClick = function(){
    // delete-all-items-from-data-structure
    ItemCtrl.clearAllItems();
    
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // remove-from-ui
    UICtrl.removeItems();

    // clear-from-local-storage
    StorageCtrl.clearItemsFromStorage();

}
  

// public-methods
  return {
    init: function(){
      // clear-edit-state
      UICtrl.clearEditState();

      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // populate list with items
      UICtrl.populateItemList(items);

      // get-total-calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // load-event-listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

// initialize app
App.init();
