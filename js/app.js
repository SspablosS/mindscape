const changeTab = (tabIndex) => {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach((tab, index) => {
    tab.classList.toggle('active', index === tabIndex);
  });
};

const addNote = () => {
  const tabsContainer = document.querySelector('.sidebar ul');
  const contentContainer = document.querySelector('.content');

  const newTabIndex = document.querySelectorAll('.sidebar ul li').length;
  const newNoteTabTitle = prompt('Название', 'Untitled');

  const newNoteTab = document.createElement('li');
  newNoteTab.textContent = newNoteTabTitle;
  newNoteTab.setAttribute('onclick', `changeTab(${newTabIndex})`);
  newNoteTab.id = 'tab' + newTabIndex;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'x';
  deleteButton.classList.add('delete-note-button');
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation(); // предотвращает переключение вкладки при нажатии на кнопку удаления
    deleteNote(newTabIndex);
  });
  newNoteTab.appendChild(deleteButton);

  tabsContainer.appendChild(newNoteTab);

  // Сохраняем название заметки
  localStorage.setItem('noteTitle' + newTabIndex, newNoteTabTitle);

  const newNoteContent = document.createElement('div');
  newNoteContent.classList.add('tab-content');
  newNoteContent.classList.add('note');
  newNoteContent.id = 'tab' + newTabIndex + 'Content';

  const textarea = document.createElement('textarea');
  textarea.classList.add('notes-textarea');
  textarea.setAttribute('placeholder', 'Напишите что-нибудь'); // Установка значения по умолчанию
  textarea.addEventListener('input', () => {
    saveNoteContent(newTabIndex);
  });

  newNoteContent.appendChild(textarea);
  contentContainer.appendChild(newNoteContent);
};

const deleteNote = (tabIndex) => {
  // Удаляем заметку из DOM
  const tabToDelete = document.getElementById('tab' + tabIndex);
  const contentToDelete = document.getElementById('tab' + tabIndex + 'Content');
  tabToDelete.parentNode.removeChild(tabToDelete);
  contentToDelete.parentNode.removeChild(contentToDelete);

  // Удаляем заметку из localStorage
  localStorage.removeItem('noteTitle' + tabIndex);
  localStorage.removeItem('note' + tabIndex);

  // Обновляем индексы оставшихся заметок
  const tabs = document.querySelectorAll('.sidebar ul li');
  tabs.forEach((tab, index) => {
    tab.id = 'tab' + index;
    tab.setAttribute('onclick', `changeTab(${index})`);
    localStorage.setItem('noteTitle' + index, tab.textContent.slice(0, -1)); // удаляем последний символ, который является кнопкой удаления

    const content = document.getElementById('tab' + index + 'Content');
    content.id = 'tab' + index + 'Content';

    const textarea = content.querySelector('textarea');
    textarea.removeEventListener('input', () => {
      saveNoteContent(index + 1);
    });
    textarea.addEventListener('input', () => {
      saveNoteContent(index);
    });

    localStorage.setItem('note' + index, textarea.value);
  });
};

window.onload = loadNotes;
