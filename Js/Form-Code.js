/* Js/Code.js
 * Cliente: validación, UI y envío AJAX del formulario.
 * Requiere jQuery. Validación cliente solo para UX; validar también en servidor.
 */

$(function() {
    // Referencias a elementos del DOM usados por el script
    const $form = $('#contact-form');            // formulario principal
    const $formContainer = $('#form-container'); // contenedor del formulario
    const $resultView = $('#result-view');       // vista que muestra el resultado
    const $aiReply = $('#ai-reply');             // contenedor con la respuesta/resumen
    const $loadingOverlay = $('#loading-overlay');// overlay de carga
    const $threadLoom = $('#thread-loom');       // contenedor donde se pintan los hilos

    // Crea los hilos visuales del telar
    function setupThreads() {
        $threadLoom.empty();
        // Creación de hilos horizontales
        for (let i = 0; i < 15; i++) {
            $('<div class="silk-thread horizontal"></div>')
                .css({ 'top': `${i * 7}%`, 'transition-delay': `${i * 80}ms` })
                .appendTo($threadLoom);
        }
        // Creación de hilos verticales
        for (let i = 0; i < 15; i++) {
            $('<div class="silk-thread vertical"></div>')
                .css({ 'left': `${i * 7}%`, 'transition-delay': `${i * 80}ms` })
                .appendTo($threadLoom);
        }
    }

    // Inicializamos los hilos al cargar
    setupThreads();

    /**
     * Elimina el estado visual de error de todos los campos.
     * Busca elementos con clase 'error-message' y limpia estilos de inputs.
     */
    function clearErrors() {
        $('.error-message').remove(); // Asumiendo que usas esta clase para el texto
        $form.find('input, textarea').removeClass('border-red-500 ring-2 ring-red-500'); // Ejemplo de clases Tailwind/CSS
    }

    /**
     * Muestra un error en el campo y pone el foco.
     * Llama a `clearErrors()` antes (opcional, según UX deseada) o gestiona el error específico.
     */
    function focusAndShow(id, msg) {
        const $field = $('#' + id);
        
        // Agrega estilo de error al input
        $field.addClass('border-red-500 ring-2 ring-red-500');
        
        // Crea y añade el mensaje de error si no existe
        const $err = $('<div class="error-message text-red-400 text-sm mt-1"></div>').text(msg);
        $field.after($err);
        
        // Pone el foco en el campo
        $field.focus();
    }

    // Validación simple de email con Regex
    function validateEmail(email) {
        // Regex estándar para emails
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validación básica de teléfono (opcional)
     * Paréntesis, signos + y guiones. Regla: longitud entre 6 y 20
     * caracteres "válidos". Si el campo está vacío se acepta (campo opcional).
     */
    function validatePhone(phone) {
        if (!phone) return true; // campo opcional
        return /^[0-9+\-()\s]{6,20}$/.test(phone);
    }

    // Mensajes temáticos con los que se responde al usuario al completar ok
    const silksongReplies = [
        "Pequeño Fantasma, tu hilo se ha enredado en el eco de la campana. La Ciudadela se agita.",
        "Una aguja guiará este anhelo; el telar no olvida esa persistencia.",
        "Tu petición se pliega en seda y canción. Espera junto a las campanas.",
        "Los Tejedores reconocen tu súplica, Errante. La seda ata todos los destinos.",
        "En las profundidades de Pharloom, tus palabras se tejen eternas. La canción continúa."
    ];

    // Maneja el submit: validación y envío AJAX
    $form.on('submit', function(e) {
        e.preventDefault();
        clearErrors();

        // Recolectar valores y normalizar (trim)
        const name = $('#name').val().trim();
        const surname = $('#surname').val().trim();
        const fullname = (name + ' ' + surname).trim();
        const email = $('#email').val().trim();
        const phone = $('#phone').val().trim();
        const message = $('#message').val().trim();

        // Validación secuencial — se detiene en el primer fallo
        if (!name) { focusAndShow('name', 'El nombre es obligatorio.'); return; }
        if (!surname) { focusAndShow('surname', 'El apellido es obligatorio.'); return; }
        if (!email) { focusAndShow('email', 'El email es obligatorio.'); return; }
        if (!validateEmail(email)) { focusAndShow('email', 'Introduce un email válido.'); return; }
        if (!validatePhone(phone)) { focusAndShow('phone', 'Teléfono inválido.'); return; }
        if (!message) { focusAndShow('message', 'La petición no puede quedar vacía.'); return; }

        // UI: bloquear interacciones y animar telar
        $form.css('opacity', '0.3').css('pointer-events', 'none');
        $('.silk-thread').addClass('weaving');
        $loadingOverlay.addClass('active');

        // AJAX: serializa el formulario y lo envía al `action` configurado
        $.ajax({
            url: $form.attr('action'),
            method: $form.attr('method') || 'POST',
            data: $form.serialize(),
            dataType: 'json'
        }).done(function(res) {
            // Construye la vista de resultado (escapando el nombre)
            const nameEcho = fullname || 'Errante';
            const reply = silksongReplies[Math.floor(Math.random() * silksongReplies.length)];
            const summary = res.form || res; // `postman-echo` devuelve `form`

            const html = `
                <div class="text-lg">${reply}</div>
                <div class="mt-4 text-sm text-left">
                    <strong>Sello del Telar:</strong>
                    <div>Hilo enviado por <strong>${$('<div>').text(nameEcho).html()}</strong>.</div>
                    <details class="mt-2" style="color:#e2d1c3;">
                        <summary style="cursor:pointer; color:#ffb443;">Ver datos enviados</summary>
                        <pre style="white-space:pre-wrap; color:#e2d1c3; background:transparent; border:none;">${JSON.stringify(summary, null, 2)}</pre>
                    </details>
                </div>
            `;

            $aiReply.html(html);
            $form.hide().css('pointer-events', 'auto');
            $resultView.removeClass('hidden');
        }).fail(function(err) {
            // Error de envío
            alert('El telar ha tropezado. No se pudo enlazar tu hilo; intenta de nuevo.');
            // Restaurar pointer-events en caso de error
            $form.css('pointer-events', 'auto');
        }).always(function() {
            // Restaurar estado visual
            $loadingOverlay.removeClass('active');
            $('.silk-thread').removeClass('weaving');
            $form.css('opacity', '1');
        });
    });

    // Reinicio del formulario: restaurar vista y estado
    $('#reset-btn').on('click', function() {
        $form.show().css('opacity', '1');
        $resultView.addClass('hidden');
        $('.silk-thread').removeClass('weaving');
        $form[0].reset();
        clearErrors();
    });

});