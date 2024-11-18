// Zar sonuçlarını belirleme fonksiyonu
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Zar sonuçlarının etkilerini belirleme
function getDiceEffect(diceValue) {
  const effects = {
    1: { type: "Penalty", description: "Attack reduced by 20%" },
    2: { type: "Shield Block", description: "Defense increased by 25%" },
    3: { type: "Buff", description: "Attack increased by 15%" },
    4: { type: "Healing", description: "Health restored by 10%" },
    5: { type: "Critical Strike", description: "Next attack deals double damage" },
    6: { type: "Special Event", description: "Random unit receives a special bonus" }
  };
  return effects[diceValue];
}

// Zar sonuçlarını döndürme ve etkileri gösterme
function executeDiceRoll() {
  const attackDiceValue = rollDice();
  const defenseDiceValue = rollDice();

  const attackEffect = getDiceEffect(attackDiceValue);
  const defenseEffect = getDiceEffect(defenseDiceValue);

  // Zar sonuçlarını animasyonlu alanlara yazdır
  document.getElementById("attack-dice").textContent = `Attack Dice: 🎲 ${attackDiceValue} (${attackEffect.type})`;
  document.getElementById("defense-dice").textContent = `Defense Dice: 🎲 ${defenseDiceValue} (${defenseEffect.type})`;

  // Zar sonuçlarını battle log'a yazdır
  updateBattleLog(`Attack team rolled a ${attackDiceValue}: ${attackEffect.description}`);
  updateBattleLog(`Defense team rolled a ${defenseDiceValue}: ${defenseEffect.description}`);

  // Zar etkilerini döndür
  return { attackEffect, defenseEffect };
}

// Zar etkilerini uygulama
function applyDiceEffects(attackEffect, defenseEffect, playerUnits, defenseUnits) {
  // Attack team effects
  if (attackEffect.type === "Penalty") {
    playerUnits.forEach(unit => (unit.stats.attack *= 0.8));
  } else if (attackEffect.type === "Buff") {
    playerUnits.forEach(unit => (unit.stats.attack *= 1.15));
  } else if (attackEffect.type === "Healing") {
    playerUnits.forEach(unit => (unit.stats.currentHealth += unit.stats.health * 0.1));
  } else if (attackEffect.type === "Critical Strike") {
    playerUnits.forEach(unit => (unit.stats.attack *= 2));
  }

  // Defense team effects
  if (defenseEffect.type === "Shield Block") {
    defenseUnits.forEach(unit => (unit.health *= 1.25));
  } else if (defenseEffect.type === "Healing") {
    defenseUnits.forEach(unit => (unit.health += unit.health * 0.1));
  } else if (defenseEffect.type === "Special Event") {
    const randomUnit = defenseUnits[Math.floor(Math.random() * defenseUnits.length)];
    randomUnit.health *= 1.5;
    updateBattleLog(`Special Event: ${randomUnit.type} received 50% more health!`);
  }
}

// Zar mekaniklerini başlatma
function startRoundWithDice(playerUnits, defenseUnits) {
  const { attackEffect, defenseEffect } = executeDiceRoll();
  applyDiceEffects(attackEffect, defenseEffect, playerUnits, defenseUnits);
}

// Zar animasyonu için bir bekleme fonksiyonu
function waitForDiceAnimation() {
  return new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekleme
}
