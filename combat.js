let defenseUnits = [];
let currentRound = 1;
let isBattleOngoing = false;
let roundLog = []; // Her round için log tutma

// Savunma birimlerinin istatistikleri ve güçlü oldukları birimler
const defenseUnitStats = {
  infantry: { attack: 100, health: 900, range: 70, speed: 100 },
  cavalry: { attack: 75, health: 450, range: 70, speed: 80 },
  cannonball: { attack: 50, health: 500, range: 250, speed: 50, strongAgainst: ["tank"] },
  machineGun: { attack: 40, health: 450, range: 350, speed: 70, strongAgainst: ["airplane"] }
};

// Savunma birimlerini haritaya yerleştir
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

// Oyunun başında savunma birimlerini yerleştir
placeDefenseUnits();

// Savaşı başlat
function startBattle() {
  if (isBattleOngoing) return;

  isBattleOngoing = true;
  document.getElementById("battle-status").style.display = "block";
  document.getElementById("battle-log").style.display = "block";
  updateBattleLog("Battle started!");

  executeRound();
}

// Roundları sıralı işlemek için
async function executeRound() {
  if (!isBattleOngoing || defenseUnits.length === 0 || playerUnits.length === 0) {
    isBattleOngoing = false;
    const resultMessage = defenseUnits.length === 0 ? "Victory!" : "Defeat!";
    updateBattleLog(resultMessage);
    return;
  }

  roundLog = []; // Yeni round için log temizle
  updateBattleLog(`Round ${currentRound} started.`);

  // Saldırı birimleri sırayla savunma birimlerine saldırır
  for (let playerUnit of playerUnits) {
    if (playerUnit.stats.currentHealth <= 0) continue; // Ölü birimleri atla

    for (let defenseUnit of defenseUnits) {
      if (defenseUnit.health <= 0) continue; // Ölü savunma birimlerini atla

      await processAttack(playerUnit, defenseUnit, true);
      await processAttack(defenseUnit, playerUnit, false);
    }
  }

  summarizeRound(); // Round özeti loglanır
  currentRound++;
  document.getElementById("battle-round-info").textContent = `Round: ${currentRound}`;
  updateBattleLog(`Round ${currentRound - 1} ended.`);

  setTimeout(executeRound, 1000); // Bir sonraki round'a geçiş
}

// Saldırı işlemlerini gerçekleştiren işlev
async function processAttack(attacker, defender, isPlayerAttacking) {
  const distance = calculateDistance(attacker.position, defender.position);

  // Loglama: Saldırı detayları
  updateBattleLog(`Processing attack: ${capitalize(attacker.type)} -> ${capitalize(defender.type)}`);
  updateBattleLog(
    `Attacker Stats: Type: ${attacker.type}, Health: ${attacker.stats?.currentHealth || attacker.health}, Attack: ${attacker.stats?.attack || attacker.attack}`
  );
  updateBattleLog(
    `Defender Stats: Type: ${defender.type}, Health: ${defender.stats?.currentHealth || defender.health}, Attack: ${defender.stats?.attack || defender.attack}`
  );

  // Menzil kontrolü
  if (distance > attacker.range) {
    drawLine(attacker.position, defender.position, 'red', "Out of range");
    roundLog.push(`${capitalize(attacker.type)} could not reach ${capitalize(defender.type)} (out of range).`);
    await wait(500);
    return;
  }

  // Başarılı saldırı
  drawLine(attacker.position, defender.position, 'green');
  let actualDamage = isPlayerAttacking ? attacker.stats.attack : attacker.attack;

  if (!isPlayerAttacking && attacker.strongAgainst?.includes(defender.type)) {
    actualDamage *= 1.5; // Güçlü birim avantajı
  }

  // Hasar uygulama
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

  await wait(500); // Saldırı sonrası bekleme
}

// Round özetini battle log'a ekle
function summarizeRound() {
  updateBattleLog(`Summary for Round ${currentRound}:`);
  roundLog.forEach(entry => updateBattleLog(entry));
}

// Savunma birimini kaldır
function removeDefenseUnit(unit) {
  const index = defenseUnits.indexOf(unit);
  if (index > -1) {
    defenseUnits.splice(index, 1);
    unit.marker.remove();
  }
}

// Oyuncu birimini kaldır
function removePlayerUnit(unit) {
  const index = playerUnits.indexOf(unit);
  if (index > -1) {
    playerUnits.splice(index, 1);
    unitMarkers[index].remove();
    unitMarkers.splice(index, 1);
  }
}

// İki konum arasındaki mesafeyi hesapla
function calculateDistance(position1, position2) {
  return map.distance(position1, position2);
}

// Haritada saldırı çizgisi çiz ve geçici olarak göster
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

// Savaş logunu güncelle
function updateBattleLog(message) {
  const log = document.getElementById("battle-log");
  const logEntry = document.createElement("p");
  logEntry.textContent = message;
  log.appendChild(logEntry);
  log.scrollTop = log.scrollHeight;
}

// Belirli bir süre bekle (milisaniye cinsinden)
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Metinlerin ilk harfini büyük yapar
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// "Savaşı Başlat" butonuna işlev ekleme
document.getElementById("startBattleButton").addEventListener("click", startBattle);
