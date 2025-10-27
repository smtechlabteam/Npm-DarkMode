// Sayfa yüklendiğinde dark mode durumunu kontrol et
function initDarkMode() {
  if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
  }
}

// Dark mode'u aç/kapa
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDarkMode);
  
  // Tüm checkbox'ları güncelle (hem navbar hem dropdown)
  document.querySelectorAll('.theme-checkbox').forEach(checkbox => {
    checkbox.checked = isDarkMode;
  });
}

// Navbar'a switch ekle
function addNavbarSwitch() {
  const navbar = document.querySelector('.d-flex.align-items-center.order-lg-2.ml-auto');
  
  if (!navbar || document.getElementById('navbar-theme-switch')) {
    return;
  }

  // Switch container
  const switchContainer = document.createElement('div');
  switchContainer.id = 'navbar-theme-switch';
  switchContainer.style.cssText = 'display: flex; align-items: center; margin-right: 15px;';
  
  // Label
  const label = document.createElement('label');
  label.classList.add('theme-switch');
  label.style.margin = '0';
  
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.classList.add('theme-checkbox');
  input.checked = localStorage.getItem('dark-mode') === 'true';
  
  const slider = document.createElement('span');
  slider.classList.add('slider', 'round');
  
  label.appendChild(input);
  label.appendChild(slider);
  switchContainer.appendChild(label);
  
  // Dropdown'dan önce ekle
  const dropdown = navbar.querySelector('.dropdown');
  navbar.insertBefore(switchContainer, dropdown);
  
  // Event listener
  input.addEventListener('change', toggleDarkMode);
}

// Dropdown'a switch ekle (eski fonksiyon)
function addDropdownSwitch() {
  const logoutButton = document.querySelector('.logout');
  
  if (!logoutButton || document.getElementById('dropdown-theme-switch')) {
    return;
  }

  const divider = logoutButton.previousElementSibling;
  
  const toggleContainer = document.createElement('a');
  toggleContainer.id = 'dropdown-theme-switch';
  toggleContainer.classList.add('dropdown-item');
  toggleContainer.href = '#';
  toggleContainer.style.cssText = 'display: flex; align-items: center; justify-content: space-between; cursor: pointer;';
  
  const leftSide = document.createElement('span');
  leftSide.innerHTML = '<i class="dropdown-icon fe fe-moon"></i> Dark Mode';
  
  const toggleLabel = document.createElement('label');
  toggleLabel.classList.add('theme-switch');
  toggleLabel.style.margin = '0';
  
  const toggleInput = document.createElement('input');
  toggleInput.type = 'checkbox';
  toggleInput.classList.add('theme-checkbox');
  toggleInput.checked = localStorage.getItem('dark-mode') === 'true';
  
  const toggleSlider = document.createElement('span');
  toggleSlider.classList.add('slider', 'round');
  
  toggleLabel.appendChild(toggleInput);
  toggleLabel.appendChild(toggleSlider);
  
  toggleContainer.appendChild(leftSide);
  toggleContainer.appendChild(toggleLabel);
  
  if (divider && divider.classList.contains('dropdown-divider')) {
    divider.parentNode.insertBefore(toggleContainer, divider);
  } else {
    logoutButton.parentNode.insertBefore(toggleContainer, logoutButton);
  }
  
  toggleContainer.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleDarkMode();
  });
  
  toggleInput.addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

// Chrome mesajlarını dinle
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "toggle") {
    toggleDarkMode();
    sendResponse({
      status: "ok", 
      isDarkMode: document.body.classList.contains('dark-mode')
    });
  } else if (request.action === "getStatus") {
    sendResponse({
      isDarkMode: document.body.classList.contains('dark-mode')
    });
  }
  return true;
});

// Başlangıçta çalıştır
initDarkMode();

// DOM hazır olduğunda switch'leri ekle
function initSwitches() {
  addNavbarSwitch();
  addDropdownSwitch();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSwitches);
} else {
  // SPA olduğu için biraz bekle
  setTimeout(initSwitches, 500);
}

// MutationObserver ile dinamik içerik değişikliklerini izle
const observer = new MutationObserver(function(mutations) {
  if (!document.getElementById('navbar-theme-switch')) {
    addNavbarSwitch();
  }
  if (!document.getElementById('dropdown-theme-switch')) {
    addDropdownSwitch();
  }
});

// Header'ı izlemeye başla
setTimeout(() => {
  const headerElement = document.querySelector('#header');
  if (headerElement) {
    observer.observe(headerElement, {
      childList: true,
      subtree: true
    });
  }
}, 1000);