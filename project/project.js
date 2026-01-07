// נתונים התחלתיים
const initialRecipes = [
    { id: 1, title: "עוגת שוקולד", ingredients: "קמח, סוכר, שוקולד", steps: ["לחמם תנור", "לערבב הכל", "לאפות 30 דקות"] },
    { id: 2, title: "מרק ירקות", ingredients: "גזר, תפוח אדמה, מים", steps: ["לחתוך ירקות", "להרתיח מים", "לבשל שעה"] }
];

// אתחול Local Storage
if (!localStorage.getItem('recipes')) {
    localStorage.setItem('recipes', JSON.stringify(initialRecipes));
    localStorage.setItem('users', JSON.stringify([{user: "admin", pass: "1234"}]));
    localStorage.setItem('settings', JSON.stringify({pause: 2, theme: 'dark'}));
}

let synth = window.speechSynthesis;
let isSpeaking = false;

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function login() {
    // לוגיקה פשוטה לצורך הדגמה
    document.getElementById('bgMusic').play();
    showScreen('listScreen');
    renderRecipes();
}

function renderRecipes() {
    const list = JSON.parse(localStorage.getItem('recipes'));
    const container = document.getElementById('recipeList');
    const search = document.getElementById('searchBar').value.toLowerCase();
    
    container.innerHTML = '';
    list.filter(r => r.title.includes(search)).forEach(r => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        div.style.borderColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        div.innerHTML = `<h3>${r.title}</h3>`;
        div.onclick = () => openRecipe(r);
        container.appendChild(div);
    });
}

function openRecipe(recipe) {
    const content = document.getElementById('recipeContent');
    content.innerHTML = `<h2>${recipe.title}</h2><p>${recipe.ingredients}</p><ul>${recipe.steps.map(s => `<li>${s}</li>`).join('')}</ul>`;
    window.currentRecipeSteps = recipe.steps;
    showScreen('recipeDetailScreen');
}

function toggleSpeech() {
    if (synth.speaking && !synth.paused) {
        synth.pause();
        return;
    } else if (synth.paused) {
        synth.resume();
        return;
    }

    const settings = JSON.parse(localStorage.getItem('settings'));
    const recipeContainer = document.getElementById('recipeContent');
    const ingredientsText = recipeContainer.querySelector('p').innerText; // שואב את טקסט המצרכים
    const stepsElements = document.querySelectorAll('#recipeContent li');
    
    // יצירת רשימה אחת מאוחדת של כל מה שצריך להקריא
    const thingsToRead = [ingredientsText, ...window.currentRecipeSteps];
    let i = 0;

    const speakStep = () => {
        if (i < thingsToRead.length) {
            // ניקוי הדגשות קודמות
            stepsElements.forEach(el => el.classList.remove('highlight-step'));
            
            // אם אנחנו בשלב של המצרכים (אינדקס 0), נדגיש את פסקת המצרכים
            if (i === 0) {
                recipeContainer.querySelector('p').classList.add('highlight-step');
            } else {
                // אם אנחנו בשלבים, נוריד הדגשה מהמצרכים ונדגיש את השלב הרלוונטי
                recipeContainer.querySelector('p').classList.remove('highlight-step');
                const stepIndex = i - 1;
                stepsElements[stepIndex].classList.add('highlight-step');
                stepsElements[stepIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            let utter = new SpeechSynthesisUtterance(thingsToRead[i]);
            utter.lang = 'he-IL';
            
            utter.onend = () => {
                setTimeout(() => {
                    if (synth.speaking || i < thingsToRead.length) {
                        i++;
                        speakStep();
                    }
                }, settings.pause * 1000);
            };

            synth.speak(utter);
        } else {
            // סיום - ניקוי כל ההדגשות
            recipeContainer.querySelector('p').classList.remove('highlight-step');
            stepsElements.forEach(el => el.classList.remove('highlight-step'));
        }
    };

    speakStep();
}

// עדכון פונקציית העצירה שתנקה גם את ההדגשות
function stopSpeech() {
    synth.cancel();
    document.querySelectorAll('#recipeContent li').forEach(el => el.classList.remove('highlight-step'));
}

function stopSpeech() {
    synth.cancel();
}

function toggleTheme() {
    const theme = document.getElementById('themeSelect').value;
    document.body.className = theme === 'dark' ? 'dark-mode' : 'light-mode';
    let settings = JSON.parse(localStorage.getItem('settings'));
    settings.theme = theme;
    localStorage.setItem('settings', JSON.stringify(settings));
}
function addNewRecipe() {
    // פתיחת חלונות לקבלת פרטים מהמשתמש
    const title = prompt("הכניסי את שם המתכון:");
    if (!title) return; // אם המשתמש ביטל

    const ingredients = prompt("הכניסי את המצרכים (מופרדים בפסיק):");
    const stepsInput = prompt("הכניסי את שלבי ההכנה (הפרידי בין שלב לשלב בנקודה .):");
    
    if (ingredients && stepsInput) {
        // הפיכת טקסט השלבים למערך (כדי שההקראה תדע לעצור בין שלב לשלב)
        const stepsArray = stepsInput.split('.').map(s => s.trim()).filter(s => s !== "");

        // שליפת הרשימה הקיימת מה-Local Storage
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

        // יצירת המתכון החדש
        const newRecipe = {
            id: Date.now(), // מזהה ייחודי לפי זמן
            title: title,
            ingredients: ingredients,
            steps: stepsArray
        };

        // הוספה לרשימה ושמירה מחדש
        recipes.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));

        // רענון התצוגה כדי שנראה את המתכון החדש מיד
        renderRecipes();
        alert("המתכון נוסף בהצלחה!");
    } else {
        alert("חובה למלא את כל הפרטים כדי לשמור מתכון.");
    }
}
// פונקציית שליטה במוזיקה
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const btn = document.getElementById('musicToggle');
    if (music.paused) {
        music.play();
        btn.innerText = "🔇 השתק מוזיקה";
    } else {
        music.pause();
        btn.innerText = "🔊 הפעל מוזיקה";
    }
}

// עדכון פונקציית הוספת מתכון שתכלול תמונה
function addNewRecipe() {
    const title = prompt("הכניסי את שם המתכון:");
    if (!title) return;

    const imgUrl = prompt("הכניסי קישור לתמונה (או השאירי ריק לברירת מחדל):", "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500");
    const ingredients = prompt("הכניסי את המצרכים:");
    const stepsInput = prompt("הכניסי את שלבי ההכנה (הפרידי בנקודה .):");
    
    if (ingredients && stepsInput) {
        const stepsArray = stepsInput.split('.').map(s => s.trim()).filter(s => s !== "");
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

        const newRecipe = {
            id: Date.now(),
            title: title,
            image: imgUrl,
            ingredients: ingredients,
            steps: stepsArray
        };

        recipes.push(newRecipe);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        renderRecipes();
    }
}

// עדכון הצגת הרשימה עם תמונות
function renderRecipes() {
    const list = JSON.parse(localStorage.getItem('recipes'));
    const container = document.getElementById('recipeList');
    const search = document.getElementById('searchBar').value.toLowerCase();
    
    container.innerHTML = '';
    list.filter(r => r.title.includes(search)).forEach(r => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        div.innerHTML = `
            <img src="${r.image || 'https://via.placeholder.com/150'}" alt="${r.title}">
            <h3>${r.title}</h3>
        `;
        div.onclick = () => openRecipe(r);
        container.appendChild(div);
    });
}

// עדכון מסך פרטי המתכון שיציג תמונה גדולה
function openRecipe(recipe) {
    const content = document.getElementById('recipeContent');
    content.innerHTML = `
        <img src="${recipe.image || ''}" class="recipe-img">
        <h2>${recipe.title}</h2>
        <p><strong>מצרכים:</strong> ${recipe.ingredients}</p>
        <hr>
        <div style="text-align: right;">
            <strong>שלבי הכנה:</strong>
            <ol>${recipe.steps.map(s => `<li>${s}</li>`).join('')}</ol>
        </div>
    `;
    window.currentRecipeSteps = recipe.steps;
    showScreen('recipeDetailScreen');
}