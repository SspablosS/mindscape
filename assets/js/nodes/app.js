document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  removeHighlightOnTabClick();
});

const changeTab = (tabIndex) => {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach((tab, index) => {
    tab.classList.toggle('active', index === tabIndex);
  });

  const tabItems = document.querySelectorAll('.sidebar ul li');
  tabItems.forEach((tabItem, index) => {
    tabItem.classList.toggle('active', index === tabIndex);
    tabItem.classList.remove('highlight');
  });
};

const addNote = async () => {
  const tabsContainer = document.querySelector('.sidebar ul');
  const contentContainer = document.querySelector('.content');

  const { value: newNoteTabTitle } = await Swal.fire({
    title: 'Название',
    input: 'text',
    inputPlaceholder: 'Название заметки',
    showCancelButton: true,
    cancelButtonText: 'Отмена',
    inputValidator: (value) => {
      if (!value) {
        return 'Напишите что-нибудь!';
      }
    }
  });

  if (newNoteTabTitle) {
    const newTabIndex = document.querySelectorAll('.sidebar ul li').length;

    const newNoteTab = document.createElement('li');
    newNoteTab.textContent = newNoteTabTitle;
    newNoteTab.setAttribute('onclick', `changeTab(${newTabIndex})`);
    newNoteTab.id = 'tab' + newTabIndex;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.classList.add('delete-note-button');
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      deleteNote(newTabIndex);
    });
    newNoteTab.appendChild(deleteButton);

    tabsContainer.appendChild(newNoteTab);

    
    localStorage.setItem('noteTitle' + newTabIndex, newNoteTabTitle);

    const newNoteContent = document.createElement('div');
    newNoteContent.classList.add('tab-content');
    newNoteContent.classList.add('note');
    newNoteContent.id = 'tab' + newTabIndex + 'Content';

    const textarea = document.createElement('textarea');
    textarea.classList.add('notes-textarea');
    textarea.setAttribute('placeholder', 'Напишите что-нибудь');
    textarea.addEventListener('input', () => {
      saveNoteContent(newTabIndex);
    });

    newNoteContent.appendChild(textarea);
    contentContainer.appendChild(newNoteContent);

    
    changeTab(newTabIndex);
  }
};

const deleteNote = (tabIndex) => {
  Swal.fire({
    title: 'Вы уверены?',
    text: 'После удаления заметки её не получится вернуть!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Да, удалить!',
    cancelButtonText: 'Отмена'
  }).then((result) => {
    if (result.isConfirmed) {
      
      const tabToDelete = document.getElementById('tab' + tabIndex);
      const contentToDelete = document.getElementById('tab' + tabIndex + 'Content');
      tabToDelete.parentNode.removeChild(tabToDelete);
      contentToDelete.parentNode.removeChild(contentToDelete);

      
      localStorage.removeItem('noteTitle' + tabIndex);
      localStorage.removeItem('note' + tabIndex);

      
      const tabs = document.querySelectorAll('.sidebar ul li');
      tabs.forEach((tab, index) => {
        tab.id = 'tab' + index;
        tab.setAttribute('onclick', `changeTab(${index})`);
        localStorage.setItem('noteTitle' + index, tab.textContent.slice(0, -1)); 

        const content = document.getElementById('tab' + index + 'Content');
        content.id = 'tab' + index + 'Content';

        const textarea = content.querySelector('textarea');
        textarea.removeEventListener('input', () => {
          saveNoteContent(index);
        });
        textarea.addEventListener('input', () => {
          saveNoteContent(index);
        });

        localStorage.setItem('note' + index, textarea.value);
      });

      Swal.fire('Готово!', 'Заметка удалена.', 'success');
    }
  });
};

const searchNotes = () => {
  Swal.fire({
    title: 'Введите текст для поиска:',
    input: 'text',
    showCancelButton: true,
    confirmButtonText: 'Поиск',
    cancelButtonText: 'Отмена',
    preConfirm: (searchTerm) => {
      const notes = document.querySelectorAll('.tab-content');
      const tabItems = document.querySelectorAll('.sidebar ul li');
      let found = false;

      tabItems.forEach((tabItem, index) => {
        const note = notes[index];
        const textarea = note.querySelector('textarea');
        if (textarea.value.toLowerCase().includes(searchTerm)) {
          tabItem.classList.add('highlight');
          found = true;
        } else {
          tabItem.classList.remove('highlight');
        }
      });

      if (!found) {
        Swal.fire('Ничего не найдено');
      }
    }
  });
};

const removeHighlightOnTabClick = () => {
  const tabItems = document.querySelectorAll('.sidebar ul li');
  tabItems.forEach((tabItem) => {
    if (!tabItem.hasHighlightListener) {
      tabItem.addEventListener('click', () => {
        tabItem.classList.remove('highlight');
      });
      tabItem.hasHighlightListener = true;
    }
  });
};
