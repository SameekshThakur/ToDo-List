
const itemList = document.getElementById('item-list');
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const clearBtn = document.getElementById('clear');
const itemFilter = document.querySelector('.filter');
let isEditMode = false;
const formBtn = itemForm.querySelector('button');

function displayItemsToDOM() {
    const itemsFromStorage = getItemFromLocalStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();
    const newItem = itemInput.value.trim();

    if(newItem === ''){
        alert("Please input item to add");
        return;
    }

    if(isEditMode) {
        const itemsFromStorage = getItemFromLocalStorage();
        if(itemsFromStorage.includes(itemInput.value)) {
            alert('Item already exists !');
            itemInput.value = '';
            return;
        } else {
            const itemToEdit = itemList.querySelector('.edit-mode');
            removeItemFromStorage(itemToEdit.textContent);
            itemToEdit.classList.remove('edit-mode');
            itemToEdit.remove();
            isEditMode = false;
        }
        
    }
    else{
        if(checkNewItemExists(newItem)){
            alert('Item already exists !');
            itemInput.value = '';
            return;
        }
    }

    addItemToDOM(newItem);

    addItemToLocalStorage(newItem);

    checkUI();

    itemInput.value = '';
    

}

function addItemToDOM(item) {
    const listItem = document.createElement('li');
    listItem.appendChild(document.createTextNode(item));
    listItem.classList.add('button-54');

    const buttonEle = createButton();
    buttonEle.className = 'button-29'
    listItem.appendChild(buttonEle);

    itemList.appendChild(listItem);
    
    
}

function addItemToLocalStorage(item) {
    const itemFromStorage = getItemFromLocalStorage();

    itemFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

function getItemFromLocalStorage() {
    let itemFromStorage;

    if(localStorage.getItem('items') === null) {
        itemFromStorage = [];
    }
    else {
        itemFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemFromStorage;
}


function createButton(buttonClass){
    const buttonEle = document.createElement('button');
    buttonEle.className = buttonClass;

    const iconEle = document.createElement('i');
    iconEle.innerHTML = '<img src="images/xIcon.svg" alt="" height=20>'
    buttonEle.appendChild(iconEle);
    return buttonEle;
}

function onClickItem(e){
    
    if(e.target.parentElement.parentElement.className === 'button-29'){
        removeItem(e.target.parentElement.parentElement.parentElement);
    }
    else{
        setEditMode(e.target);
    }
    
}

function removeItem(item) {
    if(confirm('Are you Sure you want to remove the item ?')){
        item.remove();
        removeItemFromStorage(item.textContent);
    }
    checkUI();
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromLocalStorage();
    itemsFromStorage = itemsFromStorage.filter((i) => i!== item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearAllItems(e) {
    

    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    localStorage.removeItem('items');

    checkUI();
}

function setEditMode(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((item) => item.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
    
}

function checkNewItemExists(item) {
    const itemFromStorage = getItemFromLocalStorage();
    return itemFromStorage.includes(item);
}


function checkUI(e) {
    // e.preventDefault();
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    if (items.length === 0 ) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else{
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = 'transparent';
    

    isEditMode = false;
}

function searchElement(e){
    e.preventDefault();
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach(item => {
        itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    })
}

itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearAllItems);
itemFilter.addEventListener('input', searchElement);
document.addEventListener('DOMContentLoaded', displayItemsToDOM);
checkUI();



