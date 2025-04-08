// reward.js
const achievements = [
    { id: 'firstClick', name: 'First Click', condition: (bananas, upgrades) => bananas >= 1, rewarded: false },
    { id: 'hundredBananas', name: '100 Bananas', condition: (bananas) => bananas >= 100, rewarded: false },
    { id: 'thousandBananas', name: '1000 Bananas', condition: (bananas) => bananas >= 1000, rewarded: false },
    { id: 'peelerUpgrade', name: 'Peeler Upgrade', condition: (_, upgrades) => upgrades.peeler.count >= 1, rewarded: false },
    { id: 'treeUpgrade', name: 'Tree Upgrade', condition: (_, upgrades) => upgrades.tree.count >= 1, rewarded: false },
  ];
  
  function checkForNewAchievements(bananas, upgrades) {
    achievements.forEach((ach) => {
      if (!ach.rewarded && ach.condition(bananas, upgrades)) {
        ach.rewarded = true;
        unlockAchievement(ach);
      }
    });
    saveAchievements();
  }
  
  function unlockAchievement(ach) {
    alert(`🏆 Achievement Unlocked: ${ach.name}`);
  }
  
  function saveAchievements() {
    const unlocked = achievements
      .filter((a) => a.rewarded)
      .map((a) => a.id);
    localStorage.setItem('bananaAchievements', JSON.stringify(unlocked));
  }
  
  function loadAchievements() {
    const saved = JSON.parse(localStorage.getItem('bananaAchievements')) || [];
    achievements.forEach((a) => {
      if (saved.includes(a.id)) a.rewarded = true;
    });
  }
  
  function resetAchievements() {
    achievements.forEach((a) => (a.rewarded = false));
    localStorage.removeItem('bananaAchievements');
  }
  
  loadAchievements();
  
  window.checkForNewAchievements = checkForNewAchievements;
  window.resetAchievements = resetAchievements;