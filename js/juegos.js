document.addEventListener('DOMContentLoaded', () => {
  const retos = [
    { id: 1, titulo: 'Detectives de la presión', descripcion: 'El consentimiento debe ser libre, claro y reversible.' },
    { id: 2, titulo: '¿Límite o control?', descripcion: 'Diferencia entre un límite saludable y una conducta de control.' },
    { id: 3, titulo: 'La rueda de las decisiones', descripcion: 'Explora la autonomía personal dentro de las relaciones.' },
    { id: 4, titulo: 'Construye el acuerdo', descripcion: 'Explora cómo resolver un conflicto de forma cuidadosa.' },
    { id: 5, titulo: 'Semáforo de señales', descripcion: 'Reconoce conductas saludables, señales de alerta y formas de control.' },
    { id: 6, titulo: 'El valor de la verdad', descripcion: 'Cuestiona mitos sobre relaciones, celos, género y afectividad.' },
    { id: 7, titulo: '¿De quién es la responsabilidad?', descripcion: 'Explora la corresponsabilidad afectiva dentro de un vínculo.' },
    { id: 8, titulo: 'Antes de publicar', descripcion: 'Toma decisiones responsables sobre privacidad y vínculos digitales.' },
    { id: 9, titulo: 'Repara el vínculo', descripcion: 'Construye una ruta de responsabilidad y reparación del daño.' },
    { id: 10, titulo: 'Construye tu red de apoyo', descripcion: 'Identifica apoyos posibles ante situaciones de presión o control.' }
  ];

  const storageKey = 'decalogoRetosCompletados';
  const modal = document.querySelector('#challenge-modal');
  const title = document.querySelector('#challenge-title');
  const indicator = document.querySelector('#challenge-indicator');
  const description = document.querySelector('#challenge-description');
  const gameArea = document.querySelector('#challenge-game-area');
  const feedback = document.querySelector('#challenge-feedback');
  const progressText = document.querySelector('#progress-text');
  const progressFill = document.querySelector('#progress-fill');
  const progressTrack = progressFill.parentElement;
  const progressSegments = [...progressTrack.querySelectorAll('i')];
  const pianoKeys = [...document.querySelectorAll('[data-piano-key]')];
  const resetButton = document.querySelector('#reset-progress');
  let lastFocus;

  const readProgress = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return [...new Set(stored.filter((id) => Number.isInteger(id) && id >= 1 && id <= 10))];
    } catch { return []; }
  };
  const saveProgress = (completed) => localStorage.setItem(storageKey, JSON.stringify(completed));
  const renderProgress = () => {
    const completed = readProgress();
    const count = completed.length;
    progressText.textContent = count + ' de 10 retos completados';
    progressTrack.setAttribute('aria-valuenow', String(count));
    progressFill.style.width = (count * 10) + '%';
    retos.forEach((reto) => {
      const card = document.querySelector('[data-game="' + reto.id + '"]')?.closest('.rule-card');
      card?.classList.toggle('is-completed', completed.includes(reto.id));
    });
    pianoKeys.forEach((key, index) => key.classList.toggle('is-active', completed.includes(index + 1)));
    progressSegments.forEach((segment, index) => segment.classList.toggle('is-active', completed.includes(index + 1)));
    const finale = document.querySelector('#finale');
    const finaleLabel = finale.querySelector('.locked-label');
    const finaleTitle = finale.querySelector('#finale-title');
    const finaleText = finale.querySelector('#finale-message');
    const finaleKicker = finale.querySelector('#finale-kicker');
    finale.classList.toggle('is-unlocked', count === 10);
    finaleLabel.textContent = count === 10 ? 'Partitura completada · 10 / 10' : count + ' / 10 notas encontradas';
    finaleTitle.innerHTML = count === 10 ? 'Has completado<br>la partitura' : 'La partitura<br>está incompleta';
    finaleText.textContent = count === 10 ? 'Diez principios para construir vínculos más sanos.' : 'Completa los diez retos para descubrir el mensaje final.';
    finaleKicker.textContent = count === 10 ? 'Pieza final · completada' : 'Pieza final · bloqueada';
  };
  const markCompleted = (id) => {
    const completed = readProgress();
    if (!retos.some((reto) => reto.id === id) || completed.includes(id)) return;
    saveProgress([...completed, id].sort((a, b) => a - b));
    renderProgress();
  };
  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus?.focus();
  };

  const renderRetoUno = () => {
    let detected = new Set();
    description.textContent = 'Encuentra las dos frases que esconden presión emocional.';
    gameArea.className = 'challenge-game-area challenge-box chat-scene';
    gameArea.innerHTML = '<p class="chat-scene__label">Conversación</p><button class="chat-message chat-message--a" type="button" data-pressure="true"><span>Persona A</span>“Si de verdad me quisieras, deberías hacerlo.”</button><button class="chat-message chat-message--b" type="button" data-pressure="false"><span>Persona B</span>“No estoy segura.”</button><button class="chat-message chat-message--a" type="button" data-pressure="true"><span>Persona A</span>“Todas las parejas lo hacen.”</button><button class="chat-message chat-message--b" type="button" data-pressure="false"><span>Persona B</span>“Prefiero no hacerlo.”</button>';
    feedback.textContent = 'Selecciona los mensajes que contienen presión emocional.';
    gameArea.querySelectorAll('.chat-message').forEach((message) => {
      message.addEventListener('click', () => {
        if (message.dataset.pressure === 'false') {
          feedback.textContent = 'Esta frase expresa una decisión o un límite, no una forma de presión.';
          feedback.classList.add('is-correction');
          return;
        }
        if (message.classList.contains('is-detected')) return;
        message.classList.add('is-detected');
        message.insertAdjacentHTML('beforeend', '<small>Presión detectada</small>');
        detected.add(message.textContent);
        feedback.textContent = detected.size + ' de 2 señales detectadas.';
        feedback.classList.remove('is-correction');
        if (detected.size === 2) renderRetoUnoResultado();
      });
    });
  };
  const renderRetoUnoResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 01</p><h3>Detectaste las señales</h3><p>Condicionar el cariño y comparar con otras parejas son formas de presión emocional. El consentimiento debe darse libremente, sin culpa, miedo, insistencia ni manipulación.</p><p class="challenge-result__key">“El consentimiento no se obtiene: se construye entre personas que pueden decidir libremente.”</p><button class="button button--primary" id="complete-challenge-one" type="button">Completar reto</button>';
    feedback.textContent = 'Las dos señales de presión han sido identificadas.';
    document.querySelector('#complete-challenge-one').addEventListener('click', () => {
      markCompleted(1);
      closeModal();
      document.querySelector('[data-game="2"]').closest('.rule-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const renderRetoDos = () => {
    const situations = [
      { text: '“No quiero que revises mis conversaciones privadas.”', answer: 'LÍMITE' },
      { text: '“Si somos pareja, tienes que darme la contraseña de tu celular.”', answer: 'CONTROL' },
      { text: '“Hoy necesito estar un rato sola.”', answer: 'LÍMITE' },
      { text: '“No quiero que hables con esa persona porque soy tu pareja.”', answer: 'CONTROL' },
      { text: '“Prefiero que no publiques esa foto mía.”', answer: 'LÍMITE' }
    ];
    let current = 0;

    const showSituation = () => {
      const situation = situations[current];
      description.textContent = 'Clasifica cada situación: ¿protege un espacio personal o intenta decidir por alguien más?';
      gameArea.className = 'challenge-game-area challenge-box classify-game';
      gameArea.innerHTML = '<p class="classify-game__count challenge-counter">Situación ' + (current + 1) + ' de ' + situations.length + '</p><p class="classify-game__statement challenge-question">' + situation.text + '</p><p class="challenge-prompt">¿Protege un espacio personal o intenta decidir por otra persona?</p><div class="classify-game__actions challenge-options"><button type="button" class="classify-choice challenge-option" data-choice="LÍMITE">LÍMITE</button><button type="button" class="classify-choice challenge-option" data-choice="CONTROL">CONTROL</button></div>';
      feedback.textContent = 'Elige una opción para continuar.';
      feedback.classList.remove('is-correction');
      gameArea.querySelectorAll('.classify-choice').forEach((choice) => {
        choice.addEventListener('click', () => {
          const isCorrect = choice.dataset.choice === situation.answer;
          gameArea.querySelectorAll('.classify-choice').forEach((item) => item.disabled = true);
          choice.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
          feedback.textContent = isCorrect
            ? 'Correcto. ' + (situation.answer === 'LÍMITE' ? 'Un límite protege el bienestar y el espacio personal sin controlar las decisiones de otra persona.' : 'Una conducta de control intenta decidir por la otra persona o limitar su autonomía.')
            : 'No es esa opción. ' + (situation.answer === 'LÍMITE' ? 'Un límite protege el bienestar y el espacio personal sin controlar las decisiones de otra persona.' : 'Una conducta de control intenta decidir por la otra persona o limitar su autonomía.');
          feedback.classList.toggle('is-correction', !isCorrect);
          const next = document.createElement('button');
          next.type = 'button';
          next.className = 'classify-next';
          next.textContent = current === situations.length - 1 ? 'Ver resultado' : 'Siguiente situación';
          next.addEventListener('click', () => {
            current += 1;
            if (current < situations.length) showSituation(); else renderRetoDosResultado();
          });
          feedback.append(document.createElement('br'), next);
        });
      });
    };
    showSituation();
  };

  const renderRetoDosResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 02</p><h3>Los límites protegen.<br>El control restringe.</h3><p>Una relación sana permite expresar necesidades y límites sin utilizar el cariño como excusa para vigilar, imponer o decidir por alguien más.</p><button class="button button--primary" id="complete-challenge-two" type="button">Completar reto</button>';
    feedback.textContent = 'Completaste las cinco situaciones.';
    document.querySelector('#complete-challenge-two').addEventListener('click', () => {
      markCompleted(2);
      closeModal();
      document.querySelector('[data-game="3"]').closest('.rule-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const renderRetoTres = () => {
    const decisions = [
      { text: 'Elegir qué carrera estudiar.', answer: 'MÍA', explanation: 'Esta decisión forma parte de tu proyecto de vida y te corresponde decidirla a ti.' },
      { text: 'Decidir qué hacer juntos durante una salida.', answer: 'JUNTOS', explanation: 'Cuando una decisión afecta una experiencia compartida, puede conversarse y acordarse entre ambas personas.' },
      { text: 'Elegir quiénes son mis amistades.', answer: 'MÍA', explanation: 'Tus amistades forman parte de tu vida personal: una relación sana no las controla.' },
      { text: 'Decidir cómo resolver un conflicto de la relación.', answer: 'JUNTOS', explanation: 'Resolver un conflicto requiere escuchar y construir acuerdos entre quienes participan en él.' },
      { text: 'Elegir qué ropa usar.', answer: 'MÍA', explanation: 'La forma en que te vistes es una expresión personal y una decisión propia.' },
      { text: 'Decidir si deseo continuar o terminar una relación.', answer: 'MÍA', explanation: 'Permanecer o terminar un vínculo siempre es una decisión personal y libre.' }
    ];
    let current = 0;
    const showDecision = () => {
      const decision = decisions[current];
      description.textContent = 'Clasifica cada decisión según el espacio que le corresponde.';
      gameArea.className = 'challenge-game-area challenge-box decision-game';
      gameArea.innerHTML = '<p class="decision-game__count challenge-counter">Decisión ' + (current + 1) + ' de ' + decisions.length + '</p><p class="decision-game__statement challenge-question">' + decision.text + '</p><div class="decision-game__actions challenge-options"><button type="button" class="decision-choice challenge-option" data-choice="MÍA">Me corresponde decidir a mí</button><button type="button" class="decision-choice challenge-option" data-choice="JUNTOS">Podemos decidirlo juntos</button></div><p class="decision-game__note challenge-note"><strong>La otra persona no puede decidirlo por mí</strong><br>Es una advertencia importante: ninguna relación da derecho a imponer decisiones personales.</p>';
      feedback.textContent = 'Elige la categoría que corresponda.';
      feedback.classList.remove('is-correction');
      gameArea.querySelectorAll('.decision-choice').forEach((choice) => {
        choice.addEventListener('click', () => {
          const isCorrect = choice.dataset.choice === decision.answer;
          gameArea.querySelectorAll('.decision-choice').forEach((item) => item.disabled = true);
          choice.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
          feedback.textContent = isCorrect ? 'Correcto. ' + decision.explanation : 'No es esa categoría. ' + decision.explanation;
          feedback.classList.toggle('is-correction', !isCorrect);
          const next = document.createElement('button');
          next.type = 'button';
          next.className = 'classify-next';
          next.textContent = current === decisions.length - 1 ? 'Ver resultado' : 'Siguiente decisión';
          next.addEventListener('click', () => {
            current += 1;
            if (current < decisions.length) showDecision(); else renderRetoTresResultado();
          });
          feedback.append(document.createElement('br'), next);
        });
      });
    };
    showDecision();
  };

  const renderRetoTresResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 03</p><h3>Compartir la vida no significa entregar nuestras decisiones.</h3><p>Una relación sana permite construir acuerdos comunes sin perder la autonomía personal.</p><button class="button button--primary" id="complete-challenge-three" type="button">Completar reto</button>';
    feedback.textContent = 'Completaste las seis decisiones.';
    document.querySelector('#complete-challenge-three').addEventListener('click', () => {
      markCompleted(3);
      closeModal();
      document.querySelector('[data-game="4"]').closest('.rule-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const renderRetoCuatro = () => {
    const actions = [
      { id: 1, text: 'Ignorar el problema hasta que desaparezca.' },
      { id: 2, text: 'Escuchar cómo se sintió la otra persona.' },
      { id: 3, text: 'Insultarlo para demostrar que estás enojado.' },
      { id: 4, text: 'Reconocer lo ocurrido y asumir responsabilidad.' },
      { id: 5, text: 'Hacer lo mismo para que aprenda la lección.' },
      { id: 6, text: 'Pensar juntos qué se puede hacer para reparar el daño.' }
    ];
    const correct = [2, 4, 6];
    let selected = [];
    description.textContent = 'Dos amigos tuvieron una discusión porque uno compartió un secreto del otro. Ambos están molestos y quieren resolver lo ocurrido.';
    gameArea.className = 'challenge-game-area challenge-box agreement-game';
    gameArea.innerHTML = '<p class="agreement-game__instruction">Selecciona las tres acciones que ayudan a construir un acuerdo.</p><div class="agreement-game__list">' + actions.map((action) => '<button type="button" class="agreement-action" data-action="' + action.id + '"><span>' + String(action.id).padStart(2, '0') + '</span>' + action.text + '</button>').join('') + '</div><button type="button" class="button button--primary agreement-check" id="check-agreement" disabled>Comprobar acuerdo</button>';
    feedback.textContent = '0 de 3 acciones seleccionadas.';
    feedback.classList.remove('is-correction');
    const checkButton = document.querySelector('#check-agreement');
    const actionButtons = [...gameArea.querySelectorAll('.agreement-action')];
    actionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.action);
        if (selected.includes(id)) {
          selected = selected.filter((value) => value !== id);
          button.classList.remove('is-selected');
        } else if (selected.length < 3) {
          selected.push(id);
          button.classList.add('is-selected');
        }
        feedback.textContent = selected.length + ' de 3 acciones seleccionadas.';
        feedback.classList.remove('is-correction');
        checkButton.disabled = selected.length !== 3;
      });
    });
    checkButton.addEventListener('click', () => {
      const isCorrect = selected.every((id) => correct.includes(id));
      if (isCorrect) {
        renderRetoCuatroResultado();
        return;
      }
      feedback.textContent = 'Algunas de estas acciones podrían aumentar el conflicto. Intenta nuevamente.';
      feedback.classList.add('is-correction');
      selected = [];
      actionButtons.forEach((button) => button.classList.remove('is-selected'));
      checkButton.disabled = true;
    });
  };

  const renderRetoCuatroResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 04</p><h3>Acuerdo reconstruido</h3><p>Resolver un conflicto implica escuchar, asumir responsabilidad y buscar una forma de reparar lo ocurrido.</p><button class="button button--primary" id="complete-challenge-four" type="button">Completar reto</button>';
    feedback.textContent = 'Encontraste las tres acciones que cuidan el vínculo.';
    document.querySelector('#complete-challenge-four').addEventListener('click', () => {
      markCompleted(4);
      closeModal();
      document.querySelector('[data-game="5"]').closest('.rule-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const renderRetoCinco = () => {
    const signals = [
      { text: '“Me dice que confía en mí aunque tengamos amistades diferentes.”', answer: 'VERDE', explanation: 'La confianza permite mantener vínculos y espacios propios sin necesidad de vigilar.' },
      { text: '“Se molesta cada vez que tardo en responder y espera que le conteste inmediatamente.”', answer: 'AMARILLO', explanation: 'Puede ser una señal de alerta si empieza a generar presión o exigencias constantes.' },
      { text: '“Me pide que deje de hablar con una amistad porque no le gusta.”', answer: 'ROJO', explanation: 'Intentar decidir con quién puede relacionarse otra persona limita su autonomía.' },
      { text: '“Podemos decirnos cuando algo nos incomoda sin insultarnos.”', answer: 'VERDE', explanation: 'Expresar incomodidad con respeto es parte de una comunicación saludable.' },
      { text: '“Me dice: ‘Si realmente te importara, harías lo que te estoy pidiendo’.”', answer: 'ROJO', explanation: 'Condicionar el cariño es una forma de presión emocional.' },
      { text: '“Se pone celoso algunas veces, pero lo conversa sin imponerme qué hacer.”', answer: 'AMARILLO', explanation: 'Sentir celos es una emoción posible; lo importante es cómo se manejan y si se respeta la autonomía.' }
    ];
    let current = 0;
    const showSignal = () => {
      const signal = signals[current];
      description.textContent = 'Clasifica cada conducta según la señal que representa en un vínculo.';
      gameArea.className = 'challenge-game-area challenge-box signal-game';
      gameArea.innerHTML = '<p class="signal-game__count challenge-counter">Señal ' + (current + 1) + ' de ' + signals.length + '</p><p class="signal-game__statement challenge-question">' + signal.text + '</p><div class="signal-game__actions challenge-options"><button type="button" class="signal-choice challenge-option" data-choice="VERDE"><i></i><strong>Verde</strong><small>Conducta saludable</small></button><button type="button" class="signal-choice challenge-option" data-choice="AMARILLO"><i></i><strong>Amarillo</strong><small>Señal de alerta</small></button><button type="button" class="signal-choice challenge-option" data-choice="ROJO"><i></i><strong>Rojo</strong><small>Control o manipulación</small></button></div>';
      feedback.textContent = 'Elige una categoría para continuar.';
      feedback.classList.remove('is-correction');
      gameArea.querySelectorAll('.signal-choice').forEach((choice) => {
        choice.addEventListener('click', () => {
          const isCorrect = choice.dataset.choice === signal.answer;
          gameArea.querySelectorAll('.signal-choice').forEach((item) => item.disabled = true);
          choice.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
          feedback.textContent = (isCorrect ? 'Correcto. ' : 'No es esa categoría. ') + signal.explanation;
          feedback.classList.toggle('is-correction', !isCorrect);
          const next = document.createElement('button');
          next.type = 'button';
          next.className = 'classify-next';
          next.textContent = current === signals.length - 1 ? 'Ver resultado' : 'Siguiente señal';
          next.addEventListener('click', () => {
            current += 1;
            if (current < signals.length) showSignal(); else renderRetoCincoResultado();
          });
          feedback.append(document.createElement('br'), next);
        });
      });
    };
    showSignal();
  };

  const renderRetoCincoResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 05</p><h3>Las señales no siempre son evidentes</h3><p>Una conducta aislada puede requerir contexto, pero cuando la presión, el control o la manipulación se repiten, pueden afectar la autonomía y el bienestar de una persona.</p><p class="challenge-result__key">“El cariño no convierte el control en cuidado.”</p><button class="button button--primary" id="complete-challenge-five" type="button">Completar reto</button>';
    feedback.textContent = 'Completaste las seis señales.';
    document.querySelector('#complete-challenge-five').addEventListener('click', () => {
      markCompleted(5);
      closeModal();
      document.querySelector('[data-game="6"]').closest('.rule-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const renderRetoSeis = () => {
    const statements = [
      { text: '“Si una persona siente celos, significa que ama mucho.”', answer: 'FALSO', explanation: 'Los celos son una emoción, pero no justifican vigilar, controlar o limitar a otra persona.' },
      { text: '“Una persona puede cambiar de opinión aunque antes haya aceptado algo.”', answer: 'VERDADERO', explanation: 'El consentimiento es reversible y puede retirarse en cualquier momento.' },
      { text: '“En una relación, una persona debería decidir más porque tiene más experiencia.”', answer: 'FALSO', explanation: 'Tener más experiencia no da derecho a imponer decisiones ni a tener más poder sobre la otra persona.' },
      { text: '“Los hombres deben ser quienes tomen siempre la iniciativa.”', answer: 'FALSO', explanation: 'Los roles de género no deberían decidir quién habla, propone, siente o toma decisiones.' },
      { text: '“Poner límites puede ser una forma de cuidar una relación.”', answer: 'VERDADERO', explanation: 'Los límites ayudan a expresar necesidades y proteger el bienestar sin controlar a la otra persona.' },
      { text: '“Compartir contraseñas es una obligación si realmente existe confianza.”', answer: 'FALSO', explanation: 'La confianza no exige renunciar a la privacidad.' }
    ];
    let current = 0;
    const showStatement = () => {
      const statement = statements[current];
      description.textContent = 'Decide si la afirmación cuestiona o reproduce una creencia desigual.';
      gameArea.className = 'challenge-game-area challenge-box truth-game';
      gameArea.innerHTML = '<p class="truth-game__count challenge-counter">Afirmación ' + (current + 1) + ' de ' + statements.length + '</p><p class="truth-game__statement challenge-question">' + statement.text + '</p><div class="truth-game__actions challenge-options"><button type="button" class="truth-choice challenge-option" data-choice="VERDADERO">ES VERDAD</button><button type="button" class="truth-choice challenge-option" data-choice="FALSO">ES FALSO</button></div>';
      feedback.textContent = 'Elige una respuesta para continuar.';
      feedback.classList.remove('is-correction');
      gameArea.querySelectorAll('.truth-choice').forEach((choice) => {
        choice.addEventListener('click', () => {
          const isCorrect = choice.dataset.choice === statement.answer;
          gameArea.querySelectorAll('.truth-choice').forEach((item) => item.disabled = true);
          choice.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
          feedback.innerHTML = '<strong class="truth-verdict">' + statement.answer + '</strong>' + (isCorrect ? ' Correcto. ' : ' La respuesta correcta es esta. ') + statement.explanation;
          feedback.classList.toggle('is-correction', !isCorrect);
          const next = document.createElement('button');
          next.type = 'button';
          next.className = 'classify-next';
          next.textContent = current === statements.length - 1 ? 'Ver resultado' : 'Siguiente';
          next.addEventListener('click', () => {
            current += 1;
            if (current < statements.length) showStatement(); else renderRetoSeisResultado();
          });
          feedback.append(document.createElement('br'), next);
        });
      });
    };
    showStatement();
  };

  const renderRetoSeisResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 06</p><h3>No todo lo normalizado es saludable</h3><p>Muchas ideas sobre el amor, los celos o los roles de género se aprenden socialmente. Cuestionarlas ayuda a construir relaciones más libres e igualitarias.</p><p class="challenge-result__key">“Una costumbre no se vuelve justa solo porque sea común.”</p><button class="button button--primary" id="complete-challenge-six" type="button">Completar reto</button>';
    feedback.textContent = 'Completaste las seis afirmaciones.';
    document.querySelector('#complete-challenge-six').addEventListener('click', () => {
      markCompleted(6);
      closeModal();
      document.querySelector('[data-game="7"]').closest('.rule-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const renderRetoSiete = () => {
    const situations = [
      { text: '“Expresar con claridad que algo me incomoda.”', answer: 'MÍA', explanation: 'Comunicar lo que sientes y necesitas es una responsabilidad propia.' },
      { text: '“Escuchar y dialogar para resolver un problema que afecta a ambos.”', answer: 'AMBOS', explanation: 'Cuando un problema afecta al vínculo, escucharlo y dialogarlo es una tarea compartida.' },
      { text: '“Controlar las reacciones emocionales de la otra persona.”', answer: 'OTRA', explanation: 'Podemos acompañar a alguien, pero no somos responsables de controlar sus emociones o decisiones.' },
      { text: '“Cumplir un acuerdo que acepté libremente.”', answer: 'MÍA', explanation: 'Cumplir los acuerdos que eliges asumir forma parte de tu responsabilidad personal.' },
      { text: '“Construir acuerdos que respeten las necesidades de los dos.”', answer: 'AMBOS', explanation: 'Los acuerdos que cuidan a ambas personas se construyen entre quienes forman el vínculo.' },
      { text: '“Asumir las consecuencias de una acción propia que causó daño.”', answer: 'MÍA', explanation: 'Reconocer y reparar las consecuencias de una acción propia es una responsabilidad personal.' }
    ];
    let current = 0;
    const showSituation = () => {
      const situation = situations[current];
      description.textContent = 'Identifica a quién le corresponde asumir cada responsabilidad.';
      gameArea.className = 'challenge-game-area challenge-box responsibility-game';
      gameArea.innerHTML = '<p class="responsibility-game__count challenge-counter">Situación ' + (current + 1) + ' de ' + situations.length + '</p><p class="responsibility-game__statement challenge-question">' + situation.text + '</p><div class="responsibility-game__actions challenge-options"><button type="button" class="responsibility-choice challenge-option" data-choice="MÍA">Me corresponde a mí</button><button type="button" class="responsibility-choice challenge-option" data-choice="OTRA">Le corresponde a la otra persona</button><button type="button" class="responsibility-choice challenge-option" data-choice="AMBOS">Nos corresponde a ambos</button></div>';
      feedback.textContent = 'Elige una opción para continuar.';
      feedback.classList.remove('is-correction');
      gameArea.querySelectorAll('.responsibility-choice').forEach((choice) => {
        choice.addEventListener('click', () => {
          const isCorrect = choice.dataset.choice === situation.answer;
          gameArea.querySelectorAll('.responsibility-choice').forEach((item) => item.disabled = true);
          choice.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
          feedback.textContent = (isCorrect ? 'Correcto. ' : 'No es esa opción. ') + situation.explanation;
          feedback.classList.toggle('is-correction', !isCorrect);
          const next = document.createElement('button');
          next.type = 'button';
          next.className = 'classify-next';
          next.textContent = current === situations.length - 1 ? 'Ver resultado' : 'Siguiente';
          next.addEventListener('click', () => {
            current += 1;
            if (current < situations.length) showSituation(); else renderRetoSieteResultado();
          });
          feedback.append(document.createElement('br'), next);
        });
      });
    };
    showSituation();
  };

  const renderRetoSieteResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 07</p><h3>Cuidar un vínculo es una tarea compartida</h3><p>La corresponsabilidad afectiva implica comunicar, escuchar y asumir las consecuencias de nuestras decisiones, sin controlar ni cargar con las decisiones de otra persona.</p><p class="challenge-result__key">“Responsabilidad compartida no significa culpa compartida.”</p><button class="button button--primary" id="complete-challenge-seven" type="button">Completar reto</button>';
    feedback.textContent = 'Completaste las seis situaciones.';
    document.querySelector('#complete-challenge-seven').addEventListener('click', () => {
      markCompleted(7);
      closeModal();
      document.querySelector('[data-game="8"]').closest('.rule-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const renderRetoOcho = () => {
    const situations = [
      { icon: '▧', text: 'Tienes una foto divertida de una amistad y quieres subirla a tus historias.', answer: 'PREGUNTAR', explanation: 'Aunque la foto parezca inofensiva, la otra persona debe poder decidir si quiere que se publique.' },
      { icon: '✉', text: 'Te enviaron una captura de una conversación privada de otra persona.', answer: 'NO', explanation: 'Difundir conversaciones privadas sin permiso invade la privacidad.' },
      { icon: '◫', text: 'Tu amistad te pidió explícitamente que publiques una foto en la que aparecen ambos.', answer: 'PUBLICAR', explanation: 'Existe autorización para compartirla.' },
      { icon: '⌖', text: 'Tu pareja te pide acceso permanente a tu ubicación para comprobar dónde estás.', answer: 'NO', explanation: 'Compartir ubicación debe ser una decisión libre, no una obligación para demostrar confianza.' },
      { icon: '✦', text: 'Una persona te cuenta algo personal y luego otra amistad te pregunta qué pasó.', answer: 'NO', explanation: 'La confianza también implica respetar la información que alguien comparte en privado.' },
      { icon: '▧', text: 'Quieres publicar una foto grupal donde aparecen varias personas.', answer: 'PREGUNTAR', explanation: 'Es recomendable asegurarse de que las personas estén de acuerdo antes de publicar.' }
    ];
    let current = 0;
    const showSituation = () => {
      const situation = situations[current];
      description.textContent = 'Antes de compartir información, imágenes o conversaciones, piensa en el consentimiento.';
      gameArea.className = 'challenge-game-area challenge-box digital-game';
      gameArea.innerHTML = '<p class="digital-game__count challenge-counter">Situación digital ' + (current + 1) + ' de ' + situations.length + '</p><div class="digital-card"><span class="digital-card__icon" aria-hidden="true">' + situation.icon + '</span><p class="digital-card__label">Antes de publicar</p><p class="digital-card__statement challenge-question">' + situation.text + '</p></div><div class="digital-game__actions challenge-options"><button type="button" class="digital-choice challenge-option" data-choice="PUBLICAR">Publicar</button><button type="button" class="digital-choice challenge-option" data-choice="PREGUNTAR">Preguntar primero</button><button type="button" class="digital-choice challenge-option" data-choice="NO">No compartir</button></div>';
      feedback.textContent = 'Elige una decisión para continuar.';
      feedback.classList.remove('is-correction');
      gameArea.querySelectorAll('.digital-choice').forEach((choice) => {
        choice.addEventListener('click', () => {
          const isCorrect = choice.dataset.choice === situation.answer;
          gameArea.querySelectorAll('.digital-choice').forEach((item) => item.disabled = true);
          choice.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');
          feedback.textContent = (isCorrect ? 'Correcto. ' : 'No es la decisión más cuidadosa. ') + situation.explanation;
          feedback.classList.toggle('is-correction', !isCorrect);
          const next = document.createElement('button');
          next.type = 'button';
          next.className = 'classify-next';
          next.textContent = current === situations.length - 1 ? 'Ver resultado' : 'Siguiente situación';
          next.addEventListener('click', () => {
            current += 1;
            if (current < situations.length) showSituation(); else renderRetoOchoResultado();
          });
          feedback.append(document.createElement('br'), next);
        });
      });
    };
    showSituation();
  };

  const renderRetoOchoResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 08</p><h3>Lo digital también forma parte de nuestros vínculos</h3><p>Compartir, reenviar, publicar o pedir acceso a información personal también requiere respeto y consentimiento.</p><p class="challenge-result__key">“Que algo pueda compartirse no significa que deba compartirse.”</p><button class="button button--primary" id="complete-challenge-eight" type="button">Completar reto</button>';
    feedback.textContent = 'Completaste las seis situaciones digitales.';
    document.querySelector('#complete-challenge-eight').addEventListener('click', () => {
      markCompleted(8);
      closeModal();
      document.querySelector('[data-game="9"]').closest('.rule-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const renderRetoNueve = () => {
    const cards = [
      { id: 1, text: 'Reconocer lo que hice.', correct: true },
      { id: 2, text: 'Escuchar cómo afectó a la otra persona.', correct: true },
      { id: 3, text: 'Pedir disculpas sin justificarme.', correct: true },
      { id: 4, text: 'Preguntar qué puedo hacer para reparar el daño.', correct: true },
      { id: 5, text: 'Cambiar la conducta para que no vuelva a ocurrir.', correct: true },
      { id: 6, text: 'Decir que no fue para tanto.', correct: false },
      { id: 7, text: 'Explicar que la otra persona también cometió errores.', correct: false },
      { id: 8, text: 'Pedir perdón solo para terminar la discusión.', correct: false },
      { id: 9, text: 'Esperar que lo olvide sin hablar del tema.', correct: false }
    ];
    let nextStep = 1;
    description.textContent = 'Compartiste sin permiso algo que una amistad te había contado en confianza. La persona se enteró y se sintió traicionada.';
    gameArea.className = 'challenge-game-area challenge-box repair-game';
    gameArea.innerHTML = '<p class="repair-game__instruction">Construye la ruta de reparación seleccionando los cinco pasos en orden.</p><ol class="repair-route" id="repair-route"><li>Primer paso por construir</li><li>Segundo paso por construir</li><li>Tercer paso por construir</li><li>Cuarto paso por construir</li><li>Quinto paso por construir</li></ol><div class="repair-cards">' + cards.map((card) => '<button type="button" class="repair-card" data-card="' + card.id + '">' + card.text + '</button>').join('') + '</div>';
    feedback.textContent = 'Selecciona el primer paso de la ruta.';
    feedback.classList.remove('is-correction');
    const routeSteps = [...gameArea.querySelectorAll('.repair-route li')];
    gameArea.querySelectorAll('.repair-card').forEach((card) => {
      card.addEventListener('click', () => {
        const item = cards.find((entry) => entry.id === Number(card.dataset.card));
        if (!item.correct) {
          feedback.textContent = 'Esta acción evita asumir responsabilidad. Intenta otra opción.';
          feedback.classList.add('is-correction');
          card.classList.add('is-rejected');
          window.setTimeout(() => card.classList.remove('is-rejected'), 350);
          return;
        }
        if (item.id !== nextStep) {
          feedback.textContent = 'Ese paso puede ser importante, pero aún falta un paso anterior en la ruta. Intenta construirla en orden.';
          feedback.classList.add('is-correction');
          return;
        }
        routeSteps[nextStep - 1].textContent = nextStep + '. ' + item.text;
        routeSteps[nextStep - 1].classList.add('is-built');
        card.disabled = true;
        card.classList.add('is-used');
        nextStep += 1;
        feedback.textContent = nextStep > 5 ? 'La ruta de reparación está completa.' : 'Paso ' + (nextStep - 1) + ' construido. Continúa con el siguiente.';
        feedback.classList.remove('is-correction');
        if (nextStep > 5) {
          gameArea.classList.add('is-complete');
          window.setTimeout(renderRetoNueveResultado, 550);
        }
      });
    });
  };

  const renderRetoNueveResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 09</p><h3>Reparar también es parte de cuidar</h3><p>Cuando nuestras acciones dañan a alguien, asumir responsabilidad implica reconocer lo ocurrido, escuchar, reparar cuando sea posible y modificar la conducta.</p><p class="challenge-result__key">“Una disculpa sin cambio puede quedarse solo en palabras.”</p><button class="button button--primary" id="complete-challenge-nine" type="button">Completar reto</button>';
    feedback.textContent = 'Construiste una ruta de reparación.';
    document.querySelector('#complete-challenge-nine').addEventListener('click', () => {
      markCompleted(9);
      closeModal();
      document.querySelector('[data-game="10"]').closest('.rule-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const renderRetoDiez = () => {
    const actions = [
      { id: 1, text: 'Hablar con una persona adulta o de confianza.', correct: true },
      { id: 2, text: 'Contarle la situación a alguien que pueda escuchar sin juzgar.', correct: true },
      { id: 3, text: 'Identificar lugares y personas donde pueda sentirse acompañada.', correct: true },
      { id: 4, text: 'Guardar todo en secreto para no preocupar a nadie.', correct: false },
      { id: 5, text: 'Alejarse de todas sus amistades para evitar más problemas.', correct: false },
      { id: 6, text: 'Buscar orientación o apoyo especializado si la situación continúa o empeora.', correct: true }
    ];
    let selected = [];
    description.textContent = 'Una persona siente que su pareja controla constantemente con quién habla, se molesta cuando pone límites y utiliza culpa para que cambie sus decisiones.';
    gameArea.className = 'challenge-game-area challenge-box support-game';
    gameArea.innerHTML = '<p class="support-game__question">¿Qué acciones podrían ayudar a construir una ruta de apoyo?</p><div class="support-actions">' + actions.map((action) => '<button type="button" class="support-action" data-action="' + action.id + '"><span>+</span>' + action.text + '</button>').join('') + '</div><button type="button" class="button button--primary support-check" id="check-support" disabled>Comprobar ruta</button>';
    feedback.textContent = '0 de 4 acciones seleccionadas.';
    feedback.classList.remove('is-correction');
    const checkButton = document.querySelector('#check-support');
    const actionButtons = [...gameArea.querySelectorAll('.support-action')];
    actionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const id = Number(button.dataset.action);
        if (selected.includes(id)) {
          selected = selected.filter((value) => value !== id);
          button.classList.remove('is-selected');
        } else if (selected.length < 4) {
          selected.push(id);
          button.classList.add('is-selected');
        }
        feedback.textContent = selected.length + ' de 4 acciones seleccionadas.';
        feedback.classList.remove('is-correction');
        checkButton.disabled = selected.length !== 4;
      });
    });
    checkButton.addEventListener('click', () => {
      const isCorrect = selected.every((id) => actions.find((action) => action.id === id).correct);
      if (isCorrect) {
        renderRetoDiezResultado();
        return;
      }
      feedback.textContent = 'Algunas acciones podrían aislar más a la persona. Intenta construir otra ruta de apoyo.';
      feedback.classList.add('is-correction');
      selected = [];
      actionButtons.forEach((button) => button.classList.remove('is-selected'));
      checkButton.disabled = true;
    });
  };

  const renderRetoDiezResultado = () => {
    gameArea.className = 'challenge-game-area challenge-box challenge-result';
    gameArea.innerHTML = '<p class="challenge-result__eyebrow">Reto resuelto · 10</p><h3>No tenemos que resolver todo solos</h3><p>Cuando una relación genera presión, miedo, control o malestar constante, buscar apoyo puede ayudar a comprender lo que ocurre y tomar decisiones con mayor seguridad.</p><p class="challenge-result__key">“Pedir ayuda no elimina nuestra autonomía: puede ayudarnos a recuperarla.”</p><button class="button button--primary" id="complete-challenge-ten" type="button">Completar último reto</button>';
    feedback.textContent = 'Construiste una ruta de apoyo.';
    document.querySelector('#complete-challenge-ten').addEventListener('click', () => {
      markCompleted(10);
      closeModal();
      document.querySelector('#finale').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  const openModal = (id, trigger) => {
    const reto = retos.find((item) => item.id === id);
    if (!reto) return;
    lastFocus = trigger;
    indicator.textContent = 'Reto ' + reto.id + ' de 10';
    title.textContent = reto.titulo;
    description.textContent = reto.descripcion;
    gameArea.className = 'challenge-game-area challenge-box';
    gameArea.innerHTML = '<span aria-hidden="true">♩</span><p>El área de juego se preparará aquí.</p>';
    feedback.textContent = 'La dinámica de este reto se incorporará aquí.';
    feedback.classList.remove('is-correction');
    if (id === 1) renderRetoUno();
    if (id === 2) renderRetoDos();
    if (id === 3) renderRetoTres();
    if (id === 4) renderRetoCuatro();
    if (id === 5) renderRetoCinco();
    if (id === 6) renderRetoSeis();
    if (id === 7) renderRetoSiete();
    if (id === 8) renderRetoOcho();
    if (id === 9) renderRetoNueve();
    if (id === 10) renderRetoDiez();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal__close').focus();
  };

  document.querySelectorAll('[data-game]').forEach((button) => button.addEventListener('click', () => openModal(Number(button.dataset.game), button)));
  modal.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
  const resetProgress = () => {
    if (!window.confirm('¿Quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) return false;
    localStorage.removeItem(storageKey);
    renderProgress();
    return true;
  };
  resetButton.addEventListener('click', resetProgress);
  document.querySelector('#final-reset').addEventListener('click', resetProgress);
  document.querySelector('#back-to-start').addEventListener('click', () => document.querySelector('#inicio').scrollIntoView({ behavior: 'smooth', block: 'start' }));
  window.retosDecalogo = { retos, markCompleted, reset: resetProgress };
  renderProgress();
});
