const startBtn = document.getElementById('startBtn');
const locationSpan = document.getElementById('location');
const netTypeSpan = document.getElementById('netType');
const speedSpan = document.getElementById('speed');

startBtn.addEventListener('click', () => {
  // Get location
  if (navigator.geolocation) {
    locationSpan.textContent = 'Getting location...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        locationSpan.textContent = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
      },
      () => {
        locationSpan.textContent = 'Location access denied or unavailable.';
      }
    );
  } else {
    locationSpan.textContent = 'Geolocation not supported.';
  }

  // Network type
  if (navigator.connection && navigator.connection.effectiveType) {
    netTypeSpan.textContent = navigator.connection.effectiveType;
  } else {
    netTypeSpan.textContent = 'Not supported.';
  }

  // Speed test
  testDownloadSpeed();
});

async function testDownloadSpeed() {
  const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg';
  const fileSizeInBytes = 1572864; // ~1.5MB

  speedSpan.textContent = 'Testing...';

  const startTime = performance.now();
  try {
    const response = await fetch(imageUrl, { cache: 'no-cache' });
    const blob = await response.blob();
    const endTime = performance.now();

    const durationSeconds = (endTime - startTime) / 1000;
    const bitsLoaded = fileSizeInBytes * 8;
    const speedBps = bitsLoaded / durationSeconds;
    const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

    animateSpeed(parseFloat(speedMbps));
  } catch {
    speedSpan.textContent = 'Error testing speed.';
  }
}

function animateSpeed(finalSpeed) {
  let current = 0;
  const duration = 1500;
  const stepTime = 30;
  const steps = duration / stepTime;
  const increment = finalSpeed / steps;

  speedSpan.textContent = '0.00 Mbps';

  let interval = setInterval(() => {
    current += increment;
    if (current >= finalSpeed) {
      current = finalSpeed;
      clearInterval(interval);
    }
    speedSpan.textContent = current.toFixed(2) + ' Mbps';
  }, stepTime);
}
