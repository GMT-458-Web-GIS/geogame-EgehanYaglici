// Zar sonuçlarını belirleme
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Zar sonuçlarının etkilerini belirleme
function getDiceEffect(diceValue) {
  const effects = {
    1: [
      { type: "Penalty", description: "Attack reduced by 20%" },
      { type: "Range Reduction", description: "Range reduced by 10%" },
      { type: "Minor Penalty", description: "Attack reduced by 10%" },
      { type: "Major Penalty", description: "Attack reduced by 30%" }
    ],
    2: [
      { type: "Shield Block", description: "Defense increased by 25%" },
      { type: "Health Boost", description: "Health increased by 10%" },
      { type: "Shield Wall", description: "Defense increased by 15%" },
      { type: "Minor Health Boost", description: "Health increased by 5%" }
    ],
    3: [
      { type: "Buff", description: "Attack increased by 15%" },
      { type: "Critical Strike", description: "Next attack deals double damage" },
      { type: "Minor Buff", description: "Attack increased by 10%" },
      { type: "Major Buff", description: "Attack increased by 25%" }
    ],
    4: [
      { type: "Healing", description: "Health restored by 20%" },
      { type: "Fortification", description: "Defense health increased by 20%" },
      { type: "Minor Healing", description: "Health restored by 10%" },
      { type: "Major Fortification", description: "Defense health increased by 30%" }
    ],
    5: [
      { type: "Critical Strike", description: "Next attack deals double damage" },
      { type: "Area Damage", description: "Nearby units take 15 damage" },
      { type: "Splash Damage", description: "Nearby units take 20 damage" },
      { type: "Focused Damage", description: "Single unit takes 25 damage" }
    ],
    6: [
      { type: "Special Event", description: "All units receive a special bonus" },
      { type: "Random Boost", description: "All units' attack increased by 50%" },
      { type: "Random Healing", description: "All units' health restored by 30%" },
      { type: "Power Surge", description: "All units' attack increased by 75%" },
      { type: "Range Boost", description: "All units' range increased by 20%" } // Yeni Etki
    ]
  };

  // Havuzdan rastgele bir etki seç
  const effectPool = effects[diceValue];
  return effectPool[Math.floor(Math.random() * effectPool.length)];
}

// Zar sonuçlarını döndür ve animasyonlu alanlara yaz
function executeDiceRoll() {
  const attackDiceValue = rollDice();
  const defenseDiceValue = rollDice();

  const attackEffect = getDiceEffect(attackDiceValue); // Saldırı zarının etkisini seç
  const defenseEffect = getDiceEffect(defenseDiceValue); // Savunma zarının etkisini seç

  // Zar animasyon sonuçlarını göster
  const attackDice = document.getElementById("attack-dice");
  const defenseDice = document.getElementById("defense-dice");

  attackDice.textContent = `🎲 ${attackDiceValue}`;
  defenseDice.textContent = `🎲 ${defenseDiceValue}`;

  // Zar etkilerini göster
  document.getElementById("attack-effect").textContent = `Attack Effect: ${attackEffect.description}`;
  document.getElementById("defense-effect").textContent = `Defense Effect: ${defenseEffect.description}`;

  // Battle log'a yaz
  updateBattleLog(`Attack Dice: ${attackDiceValue} - ${attackEffect.description}`);
  updateBattleLog(`Defense Dice: ${defenseDiceValue} - ${defenseEffect.description}`);

  return { attackEffect, defenseEffect };
}

// Zar etkilerini uygula
function applyDiceEffects(attackEffect, defenseEffect, playerUnits, defenseUnits) {
  // Saldırı zarının etkilerini uygula
  if (attackEffect.type === "Penalty") {
    playerUnits.forEach(unit => (unit.stats.attack *= 0.8));
  } else if (attackEffect.type === "Range Reduction") {
    playerUnits.forEach(unit => (unit.stats.range *= 0.9));
  } else if (attackEffect.type === "Minor Penalty") {
    playerUnits.forEach(unit => (unit.stats.attack *= 0.9));
  } else if (attackEffect.type === "Major Penalty") {
    playerUnits.forEach(unit => (unit.stats.attack *= 0.7));
  } else if (attackEffect.type === "Buff") {
    playerUnits.forEach(unit => (unit.stats.attack *= 1.15));
  } else if (attackEffect.type === "Critical Strike") {
    playerUnits.forEach(unit => (unit.stats.attack *= 2));
  } else if (attackEffect.type === "Healing") {
    playerUnits.forEach(unit => (unit.stats.currentHealth += unit.stats.health * 0.2));
  } else if (attackEffect.type === "Special Event") {
    playerUnits.forEach(unit => {
      unit.stats.attack += unit.stats.attack * 0.3; // %30 saldırı artışı
      unit.stats.currentHealth += unit.stats.health * 0.2; // %20 sağlık artışı
    });
    updateBattleLog("Special Event: All player units received attack and health boosts!");
  } else if (attackEffect.type === "Random Boost") {
    playerUnits.forEach(unit => {
      unit.stats.attack += unit.stats.attack * 0.5;
    });
    updateBattleLog("Random Boost: All player units' attack increased by 50%!");
  } else if (attackEffect.type === "Random Healing") {
    playerUnits.forEach(unit => {
      unit.stats.currentHealth += unit.stats.health * 0.3;
    });
    updateBattleLog("Random Healing: All player units' health restored by 30%!");
  } else if (attackEffect.type === "Power Surge") {
    playerUnits.forEach(unit => {
      unit.stats.attack += unit.stats.attack * 0.75;
    });
    updateBattleLog("Power Surge: All player units' attack increased by 75%!");
  } else if (attackEffect.type === "Range Boost") {
    playerUnits.forEach(unit => {
      unit.stats.range += unit.stats.range * 0.2;
    });
    updateBattleLog("Range Boost: All player units' range increased by 20%!");
  }

  // Savunma zarının etkilerini uygula
  if (defenseEffect.type === "Penalty") {
    defenseUnits.forEach(unit => (unit.attack *= 0.8));
  } else if (defenseEffect.type === "Range Reduction") {
    defenseUnits.forEach(unit => (unit.range *= 0.9));
  } else if (defenseEffect.type === "Minor Penalty") {
    defenseUnits.forEach(unit => (unit.attack *= 0.9));
  } else if (defenseEffect.type === "Major Penalty") {
    defenseUnits.forEach(unit => (unit.attack *= 0.7));
  } else if (defenseEffect.type === "Buff") {
    defenseUnits.forEach(unit => (unit.attack *= 1.15));
  } else if (defenseEffect.type === "Critical Strike") {
    defenseUnits.forEach(unit => (unit.attack *= 2));
  } else if (defenseEffect.type === "Healing") {
    defenseUnits.forEach(unit => (unit.health += unit.health * 0.2));
  } else if (defenseEffect.type === "Special Event") {
    defenseUnits.forEach(unit => {
      unit.attack += unit.attack * 0.3; // %30 saldırı artışı
      unit.health += unit.health * 0.2; // %20 sağlık artışı
    });
    updateBattleLog("Special Event: All defense units received attack and health boosts!");
  } else if (defenseEffect.type === "Random Boost") {
    defenseUnits.forEach(unit => {
      unit.attack += unit.attack * 0.5;
    });
    updateBattleLog("Random Boost: All defense units' attack increased by 50%!");
  } else if (defenseEffect.type === "Random Healing") {
    defenseUnits.forEach(unit => {
      unit.health += unit.health * 0.3;
    });
    updateBattleLog("Random Healing: All defense units' health restored by 30%!");
  } else if (defenseEffect.type === "Power Surge") {
    defenseUnits.forEach(unit => {
      unit.attack += unit.attack * 0.75;
    });
    updateBattleLog("Power Surge: All defense units' attack increased by 75%!");
  } else if (defenseEffect.type === "Range Boost") {
    defenseUnits.forEach(unit => {
      unit.range += unit.range * 0.2;
    });
    updateBattleLog("Range Boost: All defense units' range increased by 20%!");
  }
}

// Zar mekaniklerini başlat
function startRoundWithDice(playerUnits, defenseUnits) {
  const { attackEffect, defenseEffect } = executeDiceRoll();
  applyDiceEffects(attackEffect, defenseEffect, playerUnits, defenseUnits);
}

// Zar animasyonu için bir bekleme fonksiyonu
function waitForDiceAnimation() {
  return new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekleme
}
