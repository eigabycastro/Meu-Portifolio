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
        // Diferentes animações para diferentes seções
        if (entry.target.classList.contains('hero-inner')) {
          entry.target.classList.add('fade-in-up');
        } else if (entry.target.classList.contains('sobre-inner')) {
          entry.target.classList.add('slide-in-left');
        } else if (entry.target.classList.contains('projetos')) {
          entry.target.classList.add('scale-in');
        } else if (entry.target.classList.contains('servicos')) {
          entry.target.classList.add('fade-in');
        } else if (entry.target.classList.contains('depoimentos')) {
          entry.target.classList.add('slide-in-right');
        } else if (entry.target.classList.contains('contato-inner')) {
          entry.target.classList.add('fade-in-up');
        } else if (entry.target.classList.contains('projeto') || 
                   entry.target.classList.contains('servico-card') || 
                   entry.target.classList.contains('depoimento')) {
          entry.target.classList.add('fade-in-up');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // Observar seções principais e elementos individuais
  document.querySelectorAll('.hero-inner, .sobre-inner, .projetos, .servicos, .depoimentos, .contato-inner, .projeto, .servico-card, .depoimento').forEach(el => observer.observe(el));

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

// Controle do Formulário 
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.contato-form');
    if (form) {
        const formGroups = form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.add('floating');
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const feedback = form.querySelector('.form-feedback');
            const formData = new FormData(form);

            // Validação simples
            let isValid = true;
            form.querySelectorAll('[required]').forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (!isValid) {
                feedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
                feedback.classList.add('error');
                feedback.style.display = 'block';
                
                setTimeout(() => {
                    feedback.style.display = 'none';
                    feedback.classList.remove('error');
                }, 5000);
                return;
            }

            // Desabilita o botão durante o envio
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Enviando...';

            // Simulação de envio (substitua por AJAX real)
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Feedback de sucesso
                    feedback.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
                    feedback.classList.add('success');
                    feedback.style.display = 'block';
                    form.reset();
                    
                    // Remove o estado "preenchido" dos campos
                    form.querySelectorAll('.form-group.floating input, .form-group.floating textarea').forEach(input => {
                        input.classList.remove('has-value');
                    });
                } else {
                    throw new Error('Erro no envio');
                }
            })
            .catch(error => {
                feedback.textContent = 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente mais tarde.';
                feedback.classList.add('error');
                feedback.style.display = 'block';
            })
            .finally(() => {
                // Restaura o botão
                submitBtn.disabled = false;
                submitBtn.querySelector('.btn-text').textContent = 'Enviar mensagem';

                // Esconde o feedback após 5 segundos
                setTimeout(() => {
                    feedback.style.display = 'none';
                    feedback.classList.remove('success', 'error');
                }, 5000);
            });
        });

        // Validação em tempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function () {
                if (this.value.trim() !== '') {
                    this.classList.add('has-value');
                    this.classList.remove('error');
                } else {
                    this.classList.remove('has-value');
                }
                
                // Validação de e-mail
                if (this.type === 'email' && this.value.trim() !== '') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.value)) {
                        this.classList.add('error');
                    } else {
                        this.classList.remove('error');
                    }
                }
            });
            
            // Adiciona classe quando o campo tem valor (para recarregamentos de página)
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            }
        });
    }
});
// ======= Formulário de contato =======
const contactForm = document.querySelector('.contato-form');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const feedback = contactForm.querySelector('.form-feedback');
        const formData = new FormData(contactForm);

        // Validação simples
        let isValid = true;
        contactForm.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        // Validação de e-mail
        const emailInput = contactForm.querySelector('input[name="email"]');
        if (emailInput && emailInput.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                isValid = false;
                emailInput.classList.add('error');
                if (feedback) {
                    feedback.textContent = 'Por favor, insira um e-mail válido.';
                    feedback.classList.add('error');
                    feedback.style.display = 'block';
                    setTimeout(() => {
                        feedback.style.display = 'none';
                        feedback.classList.remove('error');
                    }, 5000);
                }
                return;
            }
        }

        if (!isValid) {
            if (feedback) {
                feedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
                feedback.classList.add('error');
                feedback.style.display = 'block';
                setTimeout(() => {
                    feedback.style.display = 'none';
                    feedback.classList.remove('error');
                }, 5000);
            }
            return;
        }

        // Desabilita o botão durante o envio
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Enviando...';

        // Envio para o Formspree via AJAX
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json, text/plain, */*'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Tenta parsear JSON para sucesso
            } else {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
        })
        .then(data => {
            if (feedback) {
                feedback.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
                feedback.classList.add('success');
                feedback.style.display = 'block';
                contactForm.reset();
                contactForm.querySelectorAll('.form-group.floating input, .form-group.floating textarea').forEach(input => {
                    input.classList.remove('has-value');
                });
            }
        })
        .catch(error => {
            console.error('Erro no envio:', error);
            if (feedback) {
                feedback.textContent = 'Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.';
                feedback.classList.add('error');
                feedback.style.display = 'block';
            }
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Enviar mensagem';
            if (feedback) {
                setTimeout(() => {
                    feedback.style.display = 'none';
                    feedback.classList.remove('success', 'error');
                }, 5000);
            }
        });
    });

    // Validação em tempo real
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
                this.classList.remove('error');
            } else {
                this.classList.remove('has-value');
            }
            
            // Validação de e-mail em tempo real
            if (this.type === 'email' && this.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.value)) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            }
        });
        
        // Adiciona classe se já tem valor
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
    });
}