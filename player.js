let gisCoin = 1000;
let playerUnits = [];
let unitMarkers = [];
let squadRoutes = [];
let activeSquadIndex = null;
let plannedRoute = null;

const unitPrices = {
  infantry: { cost: 100, quantity: 10 },
  cavalry: { cost: 350, quantity: 5 },
  tank: { cost: 500, quantity: 1 },
  airplane: { cost: 600, quantity: 1 }
};
const MIN_DISTANCE = 0.0001;

const unitSpeeds = {
  infantry: { stepSize: 10, interval: 150 },
  cavalry: { stepSize: 15, interval: 120 },
  tank: { stepSize: 8, interval: 200 },
  airplane: { stepSize: 50, interval: 60 }
};

const unitStats = {
  infantry: { attack: 10, health: 100, range: 70, speed: 100, energy: 100 },
  cavalry: { attack: 15, health: 120, range: 70, speed: 80, energy: 120 },
  tank: { attack: 30, health: 200, range: 200, speed: 60, energy: 150 },
  airplane: { attack: 40, health: 150, range: 250, speed: 120, energy: 200 }
};

// Enerji tüketimi hesaplama
const energyPerDistance = 0.05;

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function saveGameStateAndGoToIntro() {
  sessionStorage.setItem('gisCoin', gisCoin);
  sessionStorage.setItem('playerUnits', JSON.stringify(playerUnits));
  window.location.href = "intro.html";
}

function loadGameState() {
  const savedCoin = sessionStorage.getItem('gisCoin');
  const savedUnits = sessionStorage.getItem('playerUnits');
  const savedAttackPoint = sessionStorage.getItem('attackStartPoint');

  if (savedCoin) {
    gisCoin = parseInt(savedCoin, 10);
    document.getElementById("coin-amount").textContent = gisCoin;
  }

  if (savedUnits) {
    playerUnits = JSON.parse(savedUnits);
    playerUnits.forEach((squad, index) => placeSquadMarker(squad, index));
  }

  if (savedAttackPoint) {
    attackStartPoint = JSON.parse(savedAttackPoint);
  }
}

function buyUnit(type) {
  const unitCost = unitPrices[type].cost;
  const unitQuantity = unitPrices[type].quantity;

  if (gisCoin >= unitCost) {
    gisCoin -= unitCost;
    document.getElementById("coin-amount").textContent = gisCoin;
    addUnitsToSquad(type, unitQuantity);
  } else {
    alert("Not enough GIS Coin!");
  }
}

function addUnitsToSquad(type, quantity) {
  const newSquad = {
    type: type,
    count: quantity,
    id: playerUnits.length + 1,
    stats: {
      ...unitStats[type],
      currentHealth: unitStats[type].health * quantity,
      energy: unitStats[type].energy
    },
    position: {}
  };

  playerUnits.push(newSquad);
  placeSquadMarker(newSquad, playerUnits.length - 1);
}

function getUnitIcon(type) {
  let iconUrl;
  switch (type) {
    case "infantry": iconUrl = "images/soldier.svg"; break;
    case "cavalry": iconUrl = "images/cavalary.svg"; break;
    case "tank": iconUrl = "images/tank.svg"; break;
    case "airplane": iconUrl = "images/fighter_jet.svg"; break;
    default: iconUrl = "";
  }
  return L.icon({ iconUrl: iconUrl, iconSize: [30, 30] });
}

function placeSquadMarker(squad, index) {
  let newLat, newLng;
  let isPositionValid = false;

  while (!isPositionValid) {
    const latOffset = (Math.random() - 0.5) * 0.001;
    const lngOffset = (Math.random() - 0.5) * 0.001;
    newLat = attackStartPoint.lat + latOffset;
    newLng = attackStartPoint.lng + lngOffset;

    isPositionValid = unitMarkers.every(marker => {
      const distance = Math.sqrt(
        Math.pow(marker.getLatLng().lat - newLat, 2) +
        Math.pow(marker.getLatLng().lng - newLng, 2)
      );
      return distance >= MIN_DISTANCE;
    });
  }

  const unitIcon = getUnitIcon(squad.type);
  const unitMarker = L.marker([newLat, newLng], { icon: unitIcon })
    .addTo(map)
    .bindPopup(`${squad.count} ${squad.type} unit(s)`);

  unitMarker.on('click', () => {
    selectSquad(unitMarker, squad, index);
    alert(`You have selected ${squad.type.charAt(0).toUpperCase() + squad.type.slice(1)} Squad ${squad.id}.`);
  });

  unitMarkers.push(unitMarker);
  squad.position = { lat: newLat, lng: newLng };
}

function selectSquad(marker, squad, index) {
  activeSquadIndex = index;

  squadRoutes.forEach((route, idx) => {
    if (route.routeLayer) {
      route.routeLayer.setStyle({
        color: route.color,
        opacity: idx === index ? 1 : 0.3
      });
    }
  });
}

// Geçici rota planla (infantry veya cavalry için)
map.on('click', async function (e) {
  if (activeSquadIndex === null) return;

  const selectedUnit = playerUnits[activeSquadIndex];
  const selectedMarker = unitMarkers[activeSquadIndex];
  const routeColor = getRandomColor();

  if (plannedRoute) {
    map.removeControl(plannedRoute);
  }

  if (selectedUnit.type === 'infantry' || selectedUnit.type === 'cavalry') {
    plannedRoute = L.Routing.control({
      waypoints: [selectedMarker.getLatLng(), e.latlng],
      router: new L.Routing.OSRMv1({ serviceUrl: 'https://router.project-osrm.org/route/v1' }),
      routeWhileDragging: false,
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: routeColor, opacity: 1, weight: 5 }]
      }
    }).addTo(map);

    plannedRoute.on('routesfound', function (e) {
      const route = e.routes[0];
      const totalDistance = calculateRouteDistance(route.coordinates);
      applyEnergyCost(selectedUnit, totalDistance);
    });

  } else if (selectedUnit.type === 'tank' || selectedUnit.type === 'airplane') {
    plannedRoute = L.polyline([selectedMarker.getLatLng(), e.latlng], {
      color: routeColor,
      opacity: 1,
      weight: 5
    }).addTo(map);

    const routeCoordinates = plannedRoute.getLatLngs();
    const totalDistance = calculateRouteDistance(routeCoordinates);
    applyEnergyCost(selectedUnit, totalDistance);
  }
});

function applyEnergyCost(unit, distance) {
  const energyCost = distance * energyPerDistance;
  if (unit.stats.energy >= energyCost) {
    unit.stats.energy -= energyCost;
    updateBattleLog(`${unit.type} moved. Energy used: ${energyCost.toFixed(1)}. Remaining energy: ${unit.stats.energy}`);
  } else {
    updateBattleLog(`${unit.type} does not have enough energy to complete the route.`);
  }
}

function calculateRouteDistance(routeCoordinates) {
  let totalDistance = 0;
  for (let i = 0; i < routeCoordinates.length - 1; i++) {
    totalDistance += map.distance(routeCoordinates[i], routeCoordinates[i + 1]);
  }
  return totalDistance;
}

function confirmRoute() {
  if (activeSquadIndex === null || !plannedRoute) return;

  if (squadRoutes[activeSquadIndex]) {
    map.removeLayer(squadRoutes[activeSquadIndex].routeLayer);
  }

  squadRoutes[activeSquadIndex] = { routeLayer: plannedRoute, color: plannedRoute.options.lineOptions ? plannedRoute.options.lineOptions.styles[0].color : plannedRoute.options.color };
  plannedRoute = null;
}

function clearCompletedRoute(index) {
  if (squadRoutes[index]) {
    const routeLayer = squadRoutes[index].routeLayer;
    if (routeLayer.getRouter) {
      routeLayer.spliceWaypoints(0, routeLayer.getWaypoints().length);
      map.removeControl(routeLayer);
    } else {
      map.removeLayer(routeLayer);
    }
    delete squadRoutes[index];
  }
}

function mobilizeUnits() {
  playerUnits.forEach((squad, index) => {
    const marker = unitMarkers[index];
    if ((squad.type === 'infantry' || squad.type === 'cavalry') && squadRoutes[index]) {
      const routeLayer = squadRoutes[index].routeLayer;
      if (routeLayer.getRouter) {
        routeLayer.getRouter().route(routeLayer.getWaypoints(), (error, routes) => {
          if (!error && routes && routes.length > 0) {
            moveAlongRoute(marker, routes[0].coordinates, squad.type, index);
          }
        });
      }
    } else if ((squad.type === 'tank' || squad.type === 'airplane') && squadRoutes[index]) {
      const routeCoordinates = squadRoutes[index].routeLayer.getLatLngs();
      moveDirectlyToTarget(marker, routeCoordinates[routeCoordinates.length - 1], squad.type, index);
    }
  });
}

function moveAlongRoute(marker, routeCoordinates, unitType, index) {
  const { stepSize, interval } = unitSpeeds[unitType];
  let step = 0;

  const moveInterval = setInterval(() => {
    if (step < routeCoordinates.length) {
      const nextPosition = routeCoordinates[step];
      marker.setLatLng(nextPosition);
      playerUnits[index].position = { lat: nextPosition.lat, lng: nextPosition.lng };
      step += Math.ceil(stepSize / 5);
    } else {
      clearInterval(moveInterval);
      clearCompletedRoute(index);
    }
  }, interval);
}

function moveDirectlyToTarget(marker, targetPosition, unitType, index) {
  const startPos = marker.getLatLng();
  const { stepSize, interval } = unitSpeeds[unitType];
  const distance = startPos.distanceTo(targetPosition);
  const stepCount = Math.ceil(distance / stepSize);
  let step = 0;

  const moveInterval = setInterval(() => {
    if (step <= stepCount) {
      const lat = startPos.lat + (targetPosition.lat - startPos.lat) * (step / stepCount);
      const lng = startPos.lng + (targetPosition.lng - startPos.lng) * (step / stepCount);
      marker.setLatLng([lat, lng]);
      playerUnits[index].position = { lat, lng };
      step++;
    } else {
      clearInterval(moveInterval);
      clearCompletedRoute(index);
    }
  }, interval);
}

function updateBattleLog(message) {
  const log = document.getElementById("battle-log");
  const logEntry = document.createElement("p");
  logEntry.textContent = message;
  log.appendChild(logEntry);
  log.scrollTop = log.scrollHeight;
}

window.onload = loadGameState;
window.onbeforeunload = function() {
  sessionStorage.clear();
};
