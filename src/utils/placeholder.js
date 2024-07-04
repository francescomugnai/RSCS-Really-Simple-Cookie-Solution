// src/utils/placeholders.js

export const createPlaceholder = (element, type) => {
  const placeholder = document.createElement('div');
  placeholder.className = 'cookie-placeholder';
  placeholder.style.width = element.offsetWidth + 'px';
  placeholder.style.height = element.offsetHeight + 'px';
  placeholder.innerHTML = `
    <div class="placeholder-content">
      <i class="fa fa-lock"></i>
      <p>${type} contenuto bloccato</p>
      <p>Accetta i cookie per visualizzare</p>
    </div>
  `;
  element.parentNode.insertBefore(placeholder, element);
  element.style.display = 'none';
};

export const removePlaceholder = (element) => {
  const placeholder = element.previousSibling;
  if (placeholder && placeholder.className === 'cookie-placeholder') {
    placeholder.remove();
  }
  element.style.display = '';
};