const locationSpan = document.getElementById('location');
const netTypeSpan = document.getElementById('netType');
const speedSpan = document.getElementById('speed');

function updateConnectionInfo() {
  if (navigator.connection && navigator.connection.effectiveType) {
    netTypeSpan.textContent = navigator.connection.effectiveType.toUpperCase();
  } else {
    netTypeSpan.textContent = 'Not supported.';
  }
}

function updateLocationLive() {
  if (navigator.geolocation) {
    locationSpan.textContent = 'Tracking...';
    navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        locationSpan.textContent = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}, Acc: ±${accuracy}m`;
      },
      () => {
        locationSpan.textContent = 'Location error.';
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );
  } else {
    locationSpan.textContent = 'Not supported.';
  }
}

async function testDownloadSpeed() {
  const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg';
  const fileSize = 1572864; // 1.5MB

  const startTime = performance.now();
  try {
    const response = await fetch(imageUrl, { cache: 'no-cache' });
    await response.blob();
    const endTime = performance.now();

    const duration = (endTime - startTime) / 1000;
    const bitsLoaded = fileSize * 8;
    const speedBps = bitsLoaded / duration;
    const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

    animateSpeed(speedMbps);
  } catch {
    speedSpan.textContent = 'Error';
  }
}

function animateSpeed(target) {
  let current = 0;
  const duration = 1500;
  const interval = 30;
  const steps = duration / interval;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    speedSpan.textContent = `${current.toFixed(2)} Mbps`;
  }, interval);
}

document.getElementById('startBtn').addEventListener('click', () => {
  updateConnectionInfo();
  updateLocationLive();
  testDownloadSpeed();
  setInterval(() => {
    updateConnectionInfo();
    testDownloadSpeed();
  }, 30000); // repeat every 30 sec
});
