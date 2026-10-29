document.addEventListener('DOMContentLoaded', () => {
    // ======= Menu Mobile =======
    const menuBtn = document.querySelector('.menu-mobile');
    const navUl = document.querySelector('nav ul');

    const setMenu = (open) => {
        navUl.classList.toggle('active', open);
        menuBtn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    if (menuBtn && navUl) {
        menuBtn.addEventListener('click', () => setMenu(!navUl.classList.contains('active')));
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });
    }

    const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ======= Header com borda e barra de progresso ao rolar =======
    const header = document.querySelector('.site-header');
    const progresso = document.querySelector('.scroll-progress');
    const onScroll = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 8);
        if (progresso) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progresso.style.setProperty('--progresso', max > 0 ? window.scrollY / max : 0);
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ======= Link ativo na navegação =======
    const navLinks = document.querySelectorAll('nav ul a[href^="#"]');
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(link => {
                link.classList.toggle('ativo', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

    // ======= Modais de projeto =======
    const detailModals = document.querySelectorAll('.modal');
    let lastTrigger = null;

    const openModalById = (id) => {
        const targetModal = document.getElementById(id);
        if (!targetModal) return;
        targetModal.style.display = 'block';
        document.body.classList.add('modal-open');
        const closeBtn = targetModal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    };

    const closeOpenModals = () => {
        detailModals.forEach(item => {
            item.style.display = 'none';
        });
        document.body.classList.remove('modal-open');
        if (lastTrigger) {
            lastTrigger.focus();
            lastTrigger = null;
        }
    };

    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            lastTrigger = trigger;
            openModalById(trigger.dataset.modalTarget);
        });
    });

    detailModals.forEach(item => {
        item.addEventListener('click', event => {
            if (event.target === item || event.target.closest('.modal-close')) {
                closeOpenModals();
            }
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeOpenModals();
            if (navUl && navUl.classList.contains('active')) setMenu(false);
        }
    });

    // ======= Dark Mode =======
    const darkModeToggle = document.getElementById('toggle-dark');
    if (darkModeToggle) {
        const updateToggle = (enabled) => {
            darkModeToggle.innerHTML = `<i class="fas ${enabled ? 'fa-sun' : 'fa-moon'}"></i>`;
            darkModeToggle.setAttribute('aria-label', enabled ? 'Ativar modo claro' : 'Ativar modo escuro');
        };

        updateToggle(document.documentElement.classList.contains('dark'));

        darkModeToggle.addEventListener('click', () => {
            const enabled = document.documentElement.classList.toggle('dark');
            updateToggle(enabled);
            try {
                localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
            } catch (e) { }
        });
    }

    // ======= Animações ao rolar =======
    // Itens irmãos aparecem em cascata; depois da entrada a classe sai
    // para o hover dos cards voltar a usar as próprias transições.
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('is-visible');
            el.addEventListener('transitionend', () => {
                el.classList.remove('reveal', 'is-visible');
                el.style.removeProperty('--atraso');
            }, { once: true });
            revealObserver.unobserve(el);
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => {
        const irmaos = [...el.parentElement.children].filter(item => item.classList.contains('reveal'));
        el.style.setProperty('--atraso', `${irmaos.indexOf(el) * 0.12}s`);
        revealObserver.observe(el);
    });

    // ======= Efeito de digitação nos papéis =======
    const subtitulo = document.querySelector('.subtitulo[data-papeis]');
    if (subtitulo && !reduzMovimento) {
        const papeis = subtitulo.dataset.papeis.split('|');
        const texto = document.createElement('span');
        const cursorTexto = document.createElement('span');
        cursorTexto.className = 'type-cursor';
        subtitulo.replaceChildren(texto, cursorTexto);

        let papel = 0;
        let letra = 0;
        let apagando = false;
        const digitar = () => {
            const atual = papeis[papel];
            letra += apagando ? -1 : 1;
            texto.textContent = atual.slice(0, letra);

            let espera = apagando ? 40 : 85;
            if (!apagando && letra === atual.length) {
                apagando = true;
                espera = 1800;
            } else if (apagando && letra === 0) {
                apagando = false;
                papel = (papel + 1) % papeis.length;
                espera = 350;
            }
            setTimeout(digitar, espera);
        };
        digitar();
    }

    // ======= Cursor de borboleta com rastro de brilho (desktop) =======
    const borboleta = document.getElementById('custom-cursor');
    if (borboleta && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduzMovimento) {
        let ultimoBrilho = 0;
        document.addEventListener('mousemove', e => {
            borboleta.classList.remove('hidden');
            borboleta.style.transform = `translate(${e.clientX + 10}px, ${e.clientY + 10}px)`;

            const agora = performance.now();
            if (agora - ultimoBrilho > 45) {
                ultimoBrilho = agora;
                const brilho = document.createElement('span');
                brilho.className = 'brilho';
                brilho.style.left = `${e.clientX}px`;
                brilho.style.top = `${e.clientY}px`;
                document.body.appendChild(brilho);
                brilho.addEventListener('animationend', () => brilho.remove());
            }
        });
        document.addEventListener('mouseleave', () => borboleta.classList.add('hidden'));
    } else if (borboleta) {
        borboleta.remove();
    }

    // ======= Ano no rodapé =======
    const anoAtual = document.getElementById('ano-atual');
    if (anoAtual) anoAtual.textContent = new Date().getFullYear();

    // ======= Formulário de contato com Getform =======
    const contactForm = document.querySelector('.contato-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const feedback = contactForm.querySelector('.form-feedback');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let feedbackTimer;

        const showFeedback = (message, type) => {
            if (!feedback) return;
            clearTimeout(feedbackTimer);
            feedback.textContent = message;
            feedback.classList.remove('success', 'error');
            feedback.classList.add(type);
            feedback.style.display = 'block';
            feedbackTimer = setTimeout(() => {
                feedback.style.display = 'none';
                feedback.classList.remove('success', 'error');
            }, 5000);
        };

        contactForm.addEventListener('submit', e => {
            e.preventDefault();

            // Validação
            let isValid = true;
            contactForm.querySelectorAll('[required]').forEach(input => {
                const empty = !input.value.trim();
                input.classList.toggle('error', empty);
                if (empty) isValid = false;
            });

            if (!isValid) {
                showFeedback('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            const emailInput = contactForm.querySelector('#email');
            if (emailInput && !emailRegex.test(emailInput.value.trim())) {
                emailInput.classList.add('error');
                showFeedback('Por favor, insira um e-mail válido.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Enviando...';

            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                    showFeedback('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Erro Getform:', error);
                    showFeedback('Erro ao enviar. Tente novamente mais tarde.', 'error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.querySelector('.btn-text').textContent = 'Enviar mensagem';
                });
        });

        // Validação em tempo real
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                if (input.type === 'email' && input.value.trim()) {
                    input.classList.toggle('error', !emailRegex.test(input.value.trim()));
                } else if (input.value.trim()) {
                    input.classList.remove('error');
                }
            });
        });
    }
});
