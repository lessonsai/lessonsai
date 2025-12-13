// ================================
// 1. Показ / скрытие промптов
// ================================

document.addEventListener("click", (e) => {
  // Клик по "Показать промпт"
  if (e.target.classList.contains("show-prompt")) {
    const card = e.target.closest(".prompt-card");
    if (!card) return;

    const text = card.querySelector(".prompt-text");
    if (!text) return;

    const isVisible = text.style.display === "block";

    // Скрываем все промпты в этой секции (не обязательно, но аккуратно)
    card.parentElement
      .querySelectorAll(".prompt-text")
      .forEach((el) => (el.style.display = "none"));

    // Переключаем текущий
    text.style.display = isVisible ? "none" : "block";
  }

  // Клик по кнопке "Копировать"
  if (e.target.classList.contains("copy-btn")) {
    let textElement;

    // если кнопка внутри prompt-card — ищем prompt-text
    const card = e.target.closest(".prompt-card");
    if (card) {
      textElement = card.querySelector(".prompt-text");
    } else {
      // иначе считаем, что перед кнопкой стоит <blockquote> или <pre>
      textElement = e.target.previousElementSibling;
    }

    if (!textElement) return;

    const textToCopy = textElement.innerText || textElement.textContent || "";

    copyToClipboard(textToCopy, e.target);
  }
});

// Функция копирования
function copyToClipboard(text, button) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => success(button))
      .catch(() => fallbackCopy(text, button));
  } else {
    fallbackCopy(text, button);
  }
}

// Фолбэк через textarea
function fallbackCopy(text, button) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.top = "-1000px";
  textarea.style.left = "-1000px";
  document.body.appendChild(textarea);

  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  success(button);
}

// Изменение текста кнопки при успешном копировании
function success(button) {
  const original = button.textContent;
  button.textContent = "Скопировано!";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
  }, 1500);
}

// ================================
// 2. Анимация появления (.fade-in)
// ================================

const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach((el) => appearOnScroll.observe(el));

// ================================
// 3. Мобильное меню (бургер)
// ================================

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks  = document.getElementById("navLinks");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // на всякий случай, чтобы клик не проваливался
    navToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Закрываем меню при клике на пункт
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
});