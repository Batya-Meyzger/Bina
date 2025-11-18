const board = document.getElementById('board');

// יוצרים 20 כרטיסים (10 זוגות)
const values = [];
for (let i = 1; i <= 10; i++) {
  values.push(i, i);
}

// מערבבים את הכרטיסים
values.sort(() => Math.random() - 0.5);

let firstCard = null;
let matchedPairs = 0;

values.forEach(value => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.textContent = ''; // מתחיל ריק
  card.dataset.value = value;

  card.addEventListener('click', () => {
    if (card.classList.contains('revealed')) return;

    card.classList.add('revealed');
    card.textContent = value;

    if (!firstCard) {
      firstCard = card;
    } else {
      if (firstCard.dataset.value !== card.dataset.value) {
        setTimeout(() => {
          firstCard.classList.remove('revealed');
          firstCard.textContent = '';
          card.classList.remove('revealed');
          card.textContent = '';
          firstCard = null;
        }, 1000);
      } else {
        matchedPairs++;
        firstCard = null;

        if (matchedPairs === 10) {
          setTimeout(() => {
            alert("כל הזוגות נמצאו! כל הכבוד!");
          }, 300);
        }
      }
    }
  });

  board.appendChild(card);
});
