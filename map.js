// map.js

// Haritayı başlat
const map = L.map('map').setView([39.86554, 32.73387], 16);

// Harita katmanını ekle
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Bina konumunu 15 metrelik kırmızı daire ile işaretle
const baseCircle = L.circle([39.86554, 32.73387], {
  color: 'red',
  radius: 15
}).addTo(map);

// Başlangıç noktası için 1.5 km'lik çember
const startZone = L.circle([39.86554, 32.73387], {
  color: 'blue',
  radius: 1500,
  fillOpacity: 0.05
}).addTo(map);

// Saldırı başlangıç noktasını belirleme veya kaydedilmiş noktayı yükleme
let attackStartPoint;

function setAttackStartPoint() {
  // Eğer saldırı başlangıç noktası sessionStorage içinde varsa, doğrudan oradan yükle
  const savedAttackPoint = sessionStorage.getItem('attackStartPoint');

  if (savedAttackPoint) {
    attackStartPoint = JSON.parse(savedAttackPoint);
  } else {
    // Rastgele saldırı başlangıç noktasını belirle ve kaydet
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 1500; // 1.5 km içinde rastgele
    const latOffset = (distance / 111320) * Math.cos(angle);
    const lngOffset = (distance / (111320 * Math.cos(39.86554 * Math.PI / 180))) * Math.sin(angle);

    attackStartPoint = {
      lat: 39.86554 + latOffset,
      lng: 32.73387 + lngOffset
    };

    // Yeni saldırı başlangıç noktasını sessionStorage içinde sakla
    sessionStorage.setItem('attackStartPoint', JSON.stringify(attackStartPoint));
  }

  // Haritada saldırı başlangıç noktasını göster
  L.marker([attackStartPoint.lat, attackStartPoint.lng])
    .addTo(map)
    .bindPopup('Attack Start Point') // Popup içeriği
    .openPopup(); // Popup başlangıçta açık
}

// Oyunun başında bir kez çağırılır
setAttackStartPoint();

