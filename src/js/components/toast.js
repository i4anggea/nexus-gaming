let timeout;

export function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(timeout);
  timeout = setTimeout(() => toast.classList.remove('visible'), 2800);
}
