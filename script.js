const startBtn = document.getElementById('startBtn');
const locationSpan = document.getElementById('location');
const netTypeSpan = document.getElementById('netType');
const speedSpan = document.getElementById('speed');

startBtn.addEventListener('click', () => {
  // 1. Get Location
  if (navigator.geolocation) {
    locationSpan.textContent = 'Getting location...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        locationSpan.textContent = `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
      },
      (err) => {
        locationSpan.textContent = 'Location access denied or unavailable.';
      }
    );
  } else {
    locationSpan.textContent = 'Geolocation not supported by your browser.';
  }

  // 2. Get Network Type
  if (navigator.connection && navigator.connection.effectiveType) {
    netTypeSpan.textContent = navigator.connection.effectiveType;
  } else {
    netTypeSpan.textContent = 'Network Information API not supported.';
  }

  // 3. Test Download Speed
  testDownloadSpeed();
});

async function testDownloadSpeed() {
  const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg';
  const fileSizeInBytes = 1572864; // approx 1.5MB in bytes

  speedSpan.textContent = 'Testing download speed...';

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
  } catch (error) {
    speedSpan.textContent = 'Error testing speed.';
  }
}

function animateSpeed(finalSpeed) {
  let current = 0;
  const duration = 1500; // 1.5 seconds
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
