let bananas = 0;

const upgrades = {
  peeler:     { count: 0, cost: 10, rate: 1 },
  tree:       { count: 0, cost: 100, rate: 5 },
  farm:       { count: 0, cost: 1000, rate: 20 },
  factory:    { count: 0, cost: 10000, rate: 100 },
  god:        { count: 0, cost: 100000, rate: 1000 },
};

const defaultUpgrades = JSON.parse(JSON.stringify(upgrades));
const bananaCountElem = document.getElementById('bananaCount');
const bananaElem = document.getElementById('banana');
const resetSaveBtn = document.getElementById('resetSave');


// Load saved data from localStorage
function loadGame() {
  const saved = JSON.parse(localStorage.getItem('bananaClickerSave'));
  if (saved) {
    bananas = saved.bananas ?? 0;
    for (const key in upgrades) {
      if (saved.upgrades?.[key]) {
        upgrades[key].count = saved.upgrades[key].count ?? 0;
        upgrades[key].cost = saved.upgrades[key].cost ?? upgrades[key].cost;
      }
    }
    updateDisplay();
    updateProgressBar();  // Make sure to update progress bar after loading
  }
}

// Save game data to localStorage
function saveGame() {
  const saveData = {
    bananas,
    upgrades,
  };
  localStorage.setItem('bananaClickerSave', JSON.stringify(saveData));
}

// Update the UI display
function updateDisplay() {
  bananaCountElem.textContent = `${bananas}`;
  for (const key in upgrades) {
    const up = upgrades[key];
    document.getElementById(`${key}Count`).textContent = up.count;
    document.getElementById(`${key}Cost`).textContent = up.cost;
  }
  updateProgressBar(); // Make sure progress bar updates with the new bananas
}

// Pop animation when banana is clicked
function popBanana() {
  bananaElem.classList.add('banana-pop');
  setTimeout(() => bananaElem.classList.remove('banana-pop'), 100);
}

function spawnConfetti(x, y) {
    const container = document.getElementById('confettiContainer');
  
    for (let i = 0; i < 12; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${x + (Math.random() * 40 - 20)}px`;
      confetti.style.top = `${y + (Math.random() * 20 - 10)}px`;
      confetti.style.setProperty('--hue', Math.floor(Math.random() * 360));
      container.appendChild(confetti);
  
      setTimeout(() => confetti.remove(), 1000);
    }
  }
  

// Floating text when clicking banana
function showFloatingText(x, y) {
  const floating = document.createElement('div');
  floating.textContent = '+1';
  floating.className = 'floating-text';
  floating.style.left = `${x}px`;
  floating.style.top = `${y - 20}px`;
  document.body.appendChild(floating);
  setTimeout(() => floating.remove(), 800);
}

// Auto income generation every second based on upgrades
setInterval(() => {
  let income = 0;
  for (const key in upgrades) {
    income += upgrades[key].count * upgrades[key].rate;
  }
  bananas += income;
  updateDisplay();
}, 1000);

// Add event listener to banana click
bananaElem.addEventListener('click', (event) => {
  bananas++;
  updateDisplay();
  popBanana();
  showFloatingText(event.clientX, event.clientY);

  checkForNewAchievements(bananas, upgrades);
});

// Reset save functionality
resetSaveBtn.addEventListener('click', () => {
    if (confirm("Reset all progress?")) {
      const overlay = document.getElementById('resetOverlay');
      overlay.classList.add('show');
  
      setTimeout(() => {
        localStorage.removeItem('bananaClickerSave');
        localStorage.removeItem("achievements_s");
        resetAchievements();
  
        // Reset game state
        bananas = 0;
        for (const key in upgrades) {
          upgrades[key].count = 0;
          upgrades[key].cost = defaultUpgrades[key].cost;
        }
  
        saveGame();
        updateDisplay();
  
        overlay.classList.remove('show');
      }, 1000); // 1 second reset delay
    }
  });
  

// Upgrade purchase functionality
for (const key in upgrades) {
  const buyBtn = document.getElementById(`buy${capitalize(key)}`);
  buyBtn.addEventListener('click', () => {
    const up = upgrades[key];
    if (bananas >= up.cost) {
      bananas -= up.cost;
      up.count++;
      up.cost = Math.floor(up.cost * 1.15);
      updateDisplay();
      spawnConfetti(buyBtn.offsetLeft + 40, buyBtn.offsetTop + 20);

      checkForNewAchievements(bananas, upgrades);
    }
  });
}

// Capitalize the first letter of a string (for upgrade buttons)
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Save the game every 10 seconds and before unloading the page
setInterval(saveGame, 10000);
window.addEventListener('beforeunload', saveGame);

// Load saved game on start
loadGame();

// Theme logic
const themeBtn = document.getElementById('toggleTheme');

themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('bananaTheme', isDark ? 'dark' : 'light');
  themeBtn.textContent = isDark ? '☀️ Theme' : '🌙 Theme'; // Change icon based on theme
});

function loadTheme() {
  const theme = localStorage.getItem('bananaTheme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️ Theme'; // Set to light icon if dark theme
  }
}

loadTheme();

// ProgressBar
function updateProgressBar() {
    let nextUpgradeCost = Infinity;
  
    // Find the cheapest upgrade that you can't afford yet
    for (const key in upgrades) {
      const up = upgrades[key];
      if (up.cost > bananas && up.cost < nextUpgradeCost) {
        nextUpgradeCost = up.cost;
      }
    }
  
    // If all upgrades are affordable, set the cost to the lowest upgrade (just for reference)
    if (nextUpgradeCost === Infinity) {
      nextUpgradeCost = upgrades[Object.keys(upgrades)[0]].cost;
    }
  
    // Calculate the progress based on bananas
    const progressPercent = Math.min((bananas / nextUpgradeCost) * 100, 100);
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = `${progressPercent}%`;
  
    // Update the tooltip
    const tooltip = document.getElementById('progressTooltip');
    if (tooltip) {
      tooltip.textContent = `Next Upgrade: ${nextUpgradeCost - bananas} Bananas`; // Update the tooltip text
    }
}