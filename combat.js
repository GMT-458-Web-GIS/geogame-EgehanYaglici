let defenseUnits = [];
let currentRound = 1;
let isBattleOngoing = false;
let roundLog = []; // Log for each round

// Defense unit stats and strong-against list
const defenseUnitStats = {
  infantry: { attack: 100, health: 900, range: 100, speed: 100 },
  cavalry: { attack: 150, health: 1500, range: 100, speed: 80 },
  cannonball: { attack: 100, health: 2000, range: 200, speed: 50, strongAgainst: ["tank"] },
  machineGun: { attack: 110, health: 2000, range: 250, speed: 70, strongAgainst: ["airplane"] }
};

// Place defense units on the map
function placeDefenseUnits() {
  const defenseTypes = ["infantry", "cavalry", "cannonball", "machineGun"];
  const defensePositions = [
    { lat: 39.86554 + 0.0003, lng: 32.73387 + 0.0003 },
    { lat: 39.86554 - 0.0003, lng: 32.73387 - 0.0003 },
    { lat: 39.86554 + 0.0004, lng: 32.73387 - 0.0004 },
    { lat: 39.86554 - 0.0004, lng: 32.73387 + 0.0004 },
    { lat: 39.86554 + 0.0005, lng: 32.73387 + 0.0005 },
    { lat: 39.86554 - 0.0005, lng: 32.73387 - 0.0005 },
  ];

  defensePositions.forEach((position, index) => {
    const type = defenseTypes[index % defenseTypes.length];
    const defenseUnit = {
      type,
      health: defenseUnitStats[type].health,
      attack: defenseUnitStats[type].attack,
      range: defenseUnitStats[type].range,
      strongAgainst: defenseUnitStats[type].strongAgainst || [],
      position,
      id: index + 1,
      marker: L.marker(position, { icon: getUnitIcon(type) })
        .addTo(map)
        .bindPopup(`${type.charAt(0).toUpperCase() + type.slice(1)} Defense Unit ${index + 1}`)
    };

    defenseUnits.push(defenseUnit);
  });
}

// Initialize defense units at the start of the game
placeDefenseUnits();

// Start the battle
function startBattle() {
  if (isBattleOngoing) return;

  isBattleOngoing = true;
  document.getElementById("battle-status").style.display = "block";
  document.getElementById("battle-log").style.display = "block";
  updateBattleLog("Battle started!");

  executeRound();
}

// Execute rounds sequentially
async function executeRound() {
  if (!isBattleOngoing || defenseUnits.length === 0 || playerUnits.length === 0) {
    isBattleOngoing = false;
    const resultMessage = defenseUnits.length === 0 ? "Victory!" : "Defeat!";
    updateBattleLog(resultMessage);
    updateCurrentStatus(playerUnits, defenseUnits); // Final güncelleme
    return;
  }

  roundLog = []; // Clear log for the new round
  updateBattleLog(`Round ${currentRound} started.`);

  // Roll dice and apply effects
  startRoundWithDice(playerUnits, defenseUnits);
  await waitForDiceAnimation(); // Wait for dice animation to finish

  // Process attacks
  for (let playerUnit of playerUnits) {
    if (playerUnit.stats.currentHealth <= 0) continue; // Skip dead units

    for (let defenseUnit of defenseUnits) {
      if (defenseUnit.health <= 0) continue; // Skip dead defense units

      await processAttack(playerUnit, defenseUnit, true); // Player unit attacks
      if (defenseUnit.health <= 0) removeDefenseUnit(defenseUnit); // Remove dead defense units

      await processAttack(defenseUnit, playerUnit, false); // Defense unit counterattacks
      if (playerUnit.stats.currentHealth <= 0) removePlayerUnit(playerUnit); // Remove dead player units
    }
  }


  summarizeRound(); // Summarize the round
  currentRound++;
  document.getElementById("battle-round-info").textContent = `Round: ${currentRound}`;
  updateBattleLog(`Round ${currentRound - 1} ended.`);

  setTimeout(executeRound, 1000); // Move to the next round
}

// Update the current status tables
function updateCurrentStatus(playerUnits, defenseUnits) {
  const playerTableBody = document.querySelector("#player-status-table tbody");
  const defenseTableBody = document.querySelector("#defense-status-table tbody");

  // Temizle
  playerTableBody.innerHTML = "";
  defenseTableBody.innerHTML = "";

  // Saldırı birimleri (Player Units)
  playerUnits.forEach(unit => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${capitalize(unit.type)}</td>
      <td>${Math.round(unit.stats.attack)}</td>
      <td>${Math.round(unit.stats.currentHealth)}</td>
      <td>${Math.round(unit.stats.range)}</td>
    `;
    playerTableBody.appendChild(row);
  });

  // Savunma birimleri (Defense Units)
  defenseUnits.forEach(unit => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${capitalize(unit.type)}</td>
      <td>${Math.round(unit.attack)}</td>
      <td>${Math.round(unit.health)}</td>
      <td>${Math.round(unit.range)}</td>
    `;
    defenseTableBody.appendChild(row);
  });
}

async function processAttack(attacker, defender, isPlayerAttacking) {
  const distance = calculateDistance(attacker.position, defender.position);

  // Log saldırı detayları
  updateBattleLog(`Processing attack: ${capitalize(attacker.type)} -> ${capitalize(defender.type)}`);
  updateBattleLog(
    `Attacker Stats: Type: ${attacker.type}, Health: ${attacker.stats?.currentHealth || attacker.health}, Attack: ${attacker.stats?.attack || attacker.attack}`
  );
  updateBattleLog(
    `Defender Stats: Type: ${defender.type}, Health: ${defender.stats?.currentHealth || defender.health}, Attack: ${defender.stats?.attack || defender.attack}`
  );

  // Atak birimi menzil dışındaysa
  if (distance > attacker.range) {
    drawLine(attacker.position, defender.position, 'red', "Attacker out of range");
    roundLog.push(`${capitalize(attacker.type)} could not reach ${capitalize(defender.type)} (out of range).`);
    await wait(500);
    return; // Saldırı iptal edilir
  }

  // Savunma birimi menzil dışındaysa
  if (distance > defender.range) {
    drawLine(defender.position, attacker.position, 'red', "Defender out of range");
    roundLog.push(`${capitalize(defender.type)} could not reach ${capitalize(attacker.type)} (out of range).`);
    await wait(500);
    return; // Savunma saldırısı iptal edilir
  }

  // Eğer hem saldıran hem de savunan menzil içindeyse saldırı gerçekleşir
  drawLine(attacker.position, defender.position, 'green');

  let actualDamage = isPlayerAttacking ? attacker.stats.attack : attacker.attack;

  // Güçlü birime karşı saldırıda ekstra hasar
  if (!isPlayerAttacking && attacker.strongAgainst?.includes(defender.type)) {
    actualDamage *= 1.5; // %50 bonus hasar
  }

  // Hasarı savunma birimine uygula
  if (isPlayerAttacking) {
    defender.health = Math.max(0, defender.health - actualDamage);
    roundLog.push(
      `${capitalize(attacker.type)} attacked ${capitalize(defender.type)} for ${actualDamage} damage. ${defender.health} HP left.`
    );
    if (defender.health <= 0) {
      roundLog.push(`${capitalize(defender.type)} was destroyed!`);
      removeDefenseUnit(defender);
    }
  } else {
    defender.stats.currentHealth = Math.max(0, defender.stats.currentHealth - actualDamage);
    roundLog.push(
      `${capitalize(attacker.type)} attacked ${capitalize(defender.type)} for ${actualDamage} damage. ${defender.stats.currentHealth} HP left.`
    );
    if (defender.stats.currentHealth <= 0) {
      roundLog.push(`${capitalize(defender.type)} was eliminated!`);
      removePlayerUnit(defender);
    }
  }
  updateCurrentStatus(playerUnits, defenseUnits);
  await wait(500); // Saldırı sonrası bekleme
}


// Summarize the round in the battle log
function summarizeRound() {
  updateBattleLog(`Summary for Round ${currentRound}:`);
  roundLog.forEach(entry => updateBattleLog(entry));
}

// Remove a defense unit
function removeDefenseUnit(unit) {
  const index = defenseUnits.indexOf(unit);
  if (index > -1) {
    defenseUnits.splice(index, 1);
    unit.marker.remove();
  }
}

// Remove a player unit
function removePlayerUnit(unit) {
  const index = playerUnits.indexOf(unit);
  if (index > -1) {
    playerUnits.splice(index, 1);
    unitMarkers[index].remove();
    unitMarkers.splice(index, 1);
  }
}

// Calculate distance between two positions
function calculateDistance(position1, position2) {
  return map.distance(position1, position2);
}

// Draw a line on the map for attacks
function drawLine(position1, position2, color, tooltip = null) {
  const line = L.polyline([position1, position2], {
    color,
    opacity: 0.7,
    dashArray: '5, 10'
  }).addTo(map);

  if (tooltip) line.bindTooltip(tooltip).openTooltip();

  setTimeout(() => {
    map.removeLayer(line);
  }, 2000);
}

// Update the battle log
function updateBattleLog(message) {
  const log = document.getElementById("battle-log");
  const logEntry = document.createElement("p");
  logEntry.textContent = message;
  log.appendChild(logEntry);
  log.scrollTop = log.scrollHeight;
}

// Wait for a specified duration (in milliseconds)
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Capitalize the first letter of a string
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Add event listener for starting the battle
document.getElementById("startBattleButton").addEventListener("click", startBattle);
