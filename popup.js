const toggleButton = document.getElementById('toggle');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const buttonIcon = toggleButton.querySelector('.button-icon');
const buttonText = toggleButton.querySelector('.button-text');

// Durum kontrolü - hata kontrolü ile
function checkStatus() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!tabs[0]) return;
    
    chrome.tabs.sendMessage(tabs[0].id, {action: "getStatus"}, function(response) {
      // Hata kontrolü ekledik
      if (chrome.runtime.lastError) {
        console.log('Content script henüz yüklenmedi, varsayılan durum gösteriliyor');
        updateUI(false);
        return;
      }
      
      if (response && response.isDarkMode) {
        updateUI(true);
      } else {
        updateUI(false);
      }
    });
  });
}

// Toggle butonu
toggleButton.addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (!tabs[0]) return;
    
    chrome.tabs.sendMessage(tabs[0].id, {action: "toggle"}, function(response) {
      // Hata kontrolü
      if (chrome.runtime.lastError) {
        console.log('Content script bulunamadı');
        return;
      }
      
      if (response && response.status === "ok") {
        const isDarkMode = response.isDarkMode;
        updateUI(isDarkMode);
        
        // Animasyon efekti
        toggleButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
          toggleButton.style.transform = 'scale(1)';
        }, 100);
      }
    });
  });
});

// Kapat butonu
document.getElementById('closeButton').addEventListener('click', function() {
  window.close();
});

function updateUI(isDarkMode) {
  if (isDarkMode) {
    statusIndicator.classList.add('active');
    statusText.innerHTML = 'Dark mode is <strong>active</strong>';
    toggleButton.classList.add('active');
    buttonIcon.textContent = '☀️';
    buttonText.textContent = 'Disable Dark Mode';
  } else {
    statusIndicator.classList.remove('active');
    statusText.innerHTML = 'Dark mode is <strong>inactive</strong>';
    toggleButton.classList.remove('active');
    buttonIcon.textContent = '🌙';
    buttonText.textContent = 'Enable Dark Mode';
  }
}

// Sayfa yüklendiğinde durumu kontrol et
checkStatus();