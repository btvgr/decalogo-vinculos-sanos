document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('#start-tour');
  const route = document.querySelector('#recorrido');

  startButton.addEventListener('click', () => route.scrollIntoView({ behavior: 'smooth', block: 'start' }));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
});
