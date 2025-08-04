document.addEventListener('DOMContentLoaded', () => {
  // ======= Menu Mobile =======
  const menuBtn = document.querySelector('.menu-mobile');
  const navUl = document.querySelector('nav ul');

  if (menuBtn && navUl) {
    menuBtn.addEventListener('click', () => {
      navUl.classList.toggle('active');
      menuBtn.innerHTML = navUl.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        navUl.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // ======= Dark Mode =======
  const darkModeToggle = document.getElementById('toggle-dark');
  if (darkModeToggle) {
    const setDarkMode = (enabled) => {
      document.body.classList.toggle('dark', enabled);
      const iconClass = enabled ? 'fa-sun' : 'fa-moon';
      darkModeToggle.innerHTML = `<i class="fas ${iconClass}"></i>`;
      darkModeToggle.setAttribute('aria-label', enabled ? 'Desativar modo escuro' : 'Ativar modo escuro');
      localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
    };

    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = saved === 'enabled' || (!saved && prefersDark);
    setDarkMode(initialDark);

    darkModeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark');
      setDarkMode(!isDark);
    });
  }

  // ======= Scroll suave =======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ======= Efeito de digitação =======
  const typeWriter = (element, text, speed) => {
    let i = 0;
    element.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    element.appendChild(cursor);

    const type = () => {
      if (i < text.length) {
        element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
        i++;
        setTimeout(type, speed);
      } else {
        element.removeChild(cursor);
      }
    };
    type();
  };

  const nomeEl = document.querySelector('.hero h1 span.destaque');
  if (nomeEl) {
    typeWriter(nomeEl, nomeEl.textContent, 100);
  }

  // ======= Animações ao rolar com IntersectionObserver =======
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.projeto, .servico-card, .depoimento').forEach(el => observer.observe(el));

  // ======= Formulário de contato =======
  const contactForm = document.querySelector('.contato-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Mensagem enviada!';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
      }, 1500);
    });
  }

  // ======= Cursor personalizado (desktop) =======
  if (!('ontouchstart' in window)) {
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
      document.body.style.cursor = 'none';

      document.addEventListener('mousemove', e => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });

      document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
      });
      document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    }
  }
});
// Controle do Formulário Melhorado
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contato-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const feedback = form.querySelector('.form-feedback');

      // Desabilita o botão durante o envio
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Enviando...';

      // Simulação de envio (substitua por AJAX real)
      setTimeout(() => {
        // Feedback de sucesso
        feedback.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
        feedback.classList.add('success');
        feedback.style.display = 'block';

        // Reset do formulário
        form.reset();

        // Restaura o botão
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = 'Enviar mensagem';

          // Esconde o feedback após 5 segundos
          setTimeout(() => {
            feedback.style.display = 'none';
            feedback.classList.remove('success');
          }, 5000);
        }, 1000);
      }, 1500);
    });

    // Validação em tempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function () {
        if (this.value.trim() !== '') {
          this.classList.add('has-value');
        } else {
          this.classList.remove('has-value');
        }
      });
    });
  }
});