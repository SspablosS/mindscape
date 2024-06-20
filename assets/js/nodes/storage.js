const saveNoteContent = (tabIndex) => {
  const noteContent = document.querySelector(
    `#tab${tabIndex}Content textarea`
  ).value;
  localStorage.setItem('note' + tabIndex, noteContent);
};

const loadNotes = () => {
  const tabsContainer = document.querySelector('.sidebar ul');
  const contentContainer = document.querySelector('.content');

  for (let i = 0; localStorage.getItem('note' + i) !== null; i++) {
    const savedNoteTitle = localStorage.getItem('noteTitle' + i) || 'Untitled';
    const savedNoteContent = localStorage.getItem('note' + i);

    const newNoteTab = document.createElement('li');
    newNoteTab.textContent = savedNoteTitle;
    newNoteTab.setAttribute('onclick', `changeTab(${i})`);
    newNoteTab.id = 'tab' + i;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.classList.add('delete-note-button');
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation(); 
      deleteNote(i);
    });
    newNoteTab.appendChild(deleteButton);

    tabsContainer.appendChild(newNoteTab);

    const newNoteContent = document.createElement('div');
    newNoteContent.classList.add('tab-content');
    newNoteContent.classList.add('note');
    newNoteContent.id = 'tab' + i + 'Content';

    const textarea = document.createElement('textarea');
    textarea.value = savedNoteContent;
    textarea.addEventListener('input', () => {
      saveNoteContent(i);
    });

    newNoteContent.appendChild(textarea);
    contentContainer.appendChild(newNoteContent);
  }
};
