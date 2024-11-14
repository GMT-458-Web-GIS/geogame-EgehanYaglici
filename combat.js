let defenseUnits = [];
let currentRound = 1;
let isBattleOngoing = false;
let distanceLineLayer = null; // Mesafe çizgisini tutacak

// Savunma birimlerinin istatistikleri (sadece piyade ve atlı)
const defenseUnitStats = {
  infantry: { attack: 8, health: 80, range: 300, speed: 100 },
  cavalry: { attack: 12, health: 100, range: 500, speed: 80 }
};

// Savunma birimlerini haritada konumlandır
function placeDefenseUnits() {
  const defenseTypes = ["infantry", "cavalry"];
  const defensePositions = [
    { lat: 39.86554 + 0.0003, lng: 32.73387 + 0.0003 },
    { lat: 39.86554 - 0.0003, lng: 32.73387 - 0.0003 },
    { lat: 39.86554 + 0.0004, lng: 32.73387 - 0.0004 },
    { lat: 39.86554 - 0.0004, lng: 32.73387 + 0.0004 },
  ];

  defensePositions.forEach((position, index) => {
    const type = defenseTypes[index % defenseTypes.length];
    const defenseUnit = {
      type,
      health: defenseUnitStats[type].health,
      attack: defenseUnitStats[type].attack,
      range: defenseUnitStats[type].range,
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
  document.getElementById("battle-round-info").textContent = `Round: ${currentRound}`;
  updateBattleLog("Battle started!");

  const battleInterval = setInterval(() => {
    if (!isBattleOngoing || defenseUnits.length === 0 || playerUnits.length === 0) {
      clearInterval(battleInterval);
      isBattleOngoing = false;
      const resultMessage = defenseUnits.length === 0 ? "Victory!" : "Defeat!";
      updateBattleLog(resultMessage);
      return;
    }

    resolveCombatRound();
    currentRound++;
    document.getElementById("battle-round-info").textContent = `Round: ${currentRound}`;
  }, 1000);
}

// İki konum arasındaki mesafeyi hesapla (harita üzerinden metre cinsinden)
function calculateDistance(position1, position2) {
  return map.distance(position1, position2);
}

// Savaş turunu çözümle
function resolveCombatRound() {
  // Mesafe çizgisi varsa kaldır
  if (distanceLineLayer) {
    map.removeLayer(distanceLineLayer);
  }

  playerUnits.forEach((playerUnit, index) => {
    if (!playerUnit.position) {
      console.error(`Error: Player unit ${playerUnit.type} is missing position data!`);
      return;
    }

    const target = defenseUnits[Math.floor(Math.random() * defenseUnits.length)];
    if (!target) return;

    // Oyuncu birimi ile hedef arasındaki mesafeyi hesapla
    const distance = calculateDistance(playerUnit.position, target.position);

    // Mesafeyi battle log'a yazdır
    updateBattleLog(`Distance between ${playerUnit.type} and ${target.type}: ${distance.toFixed(2)} meters`);

    // Menzil kontrolü: Eğer mesafe, saldırgan birimin menzilinden büyükse saldırı yapılamaz
    if (distance > playerUnit.stats.range) {
      updateBattleLog(`${playerUnit.type} is out of range to attack ${target.type}.`);

      // Mesafeyi gösteren çizgi ekle
      distanceLineLayer = L.polyline([playerUnit.position, target.position], {
        color: 'red',
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(map);
      return; // Bu turda saldırı yok
    }

    // Oyuncu birimi saldırır
    target.health -= playerUnit.stats.attack;
    updateBattleLog(`${playerUnit.type} attacked ${target.type} - ${target.health} HP left`);

    // Savunma birimi karşı saldırıya geçer (menzili kontrol edilir)
    if (distance <= target.range) {
      playerUnit.stats.currentHealth -= target.attack;
      updateBattleLog(`${target.type} counterattacked ${playerUnit.type} - ${playerUnit.stats.currentHealth} HP left`);
    } else {
      updateBattleLog(`${target.type} is out of range to counterattack ${playerUnit.type}.`);
    }

    // Sağlık durumu kontrolü
    if (target.health <= 0) {
      updateBattleLog(`${target.type} Defense Unit destroyed!`);
      removeDefenseUnit(target);
    }

    if (playerUnit.stats.currentHealth <= 0) {
      updateBattleLog(`${playerUnit.type} Squad lost all units!`);
      removePlayerUnit(playerUnit);
    }

    // Saldırı gerçekleştiğinde mesafeyi gösteren çizgiyi ekle
    distanceLineLayer = L.polyline([playerUnit.position, target.position], {
      color: 'green',
      opacity: 0.7,
      dashArray: '5, 10'
    }).addTo(map);
  });
}

// Savunma birimini kaldır ve haritadan sil
function removeDefenseUnit(unit) {
  const index = defenseUnits.indexOf(unit);
  if (index > -1) {
    defenseUnits.splice(index, 1);
    unit.marker.remove(); // Haritadaki marker'ı kaldır
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

// Savaş logunu güncelle
function updateBattleLog(message) {
  const log = document.getElementById("battle-log");
  const logEntry = document.createElement("p");
  logEntry.textContent = message;
  log.appendChild(logEntry);
  log.scrollTop = log.scrollHeight;
}

// "Savaşı Başlat" butonuna işlev ekleme
document.getElementById("startBattleButton").addEventListener("click", startBattle);
