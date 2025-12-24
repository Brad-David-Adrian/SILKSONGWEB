
import { GoogleGenAI } from "@google/genai";

$(document).ready(function() {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const $form = $('#contact-form');
    const $formContainer = $('#form-container');
    const $resultView = $('#result-view');
    const $aiReply = $('#ai-reply');
    const $loadingOverlay = $('#loading-overlay');
    const $threadLoom = $('#thread-loom');

    // Populate the loom with intricate threads
    function setupThreads() {
        $threadLoom.empty();
        
        const count = 30; // Increased thread count for density
        
        // Horizontal threads with randomized offsets and delays
        for (let i = 0; i < count; i++) {
            const opacity = Math.random() * 0.3 + 0.1;
            const delay = Math.random() * 800;
            const thickness = Math.random() > 0.8 ? '2px' : '1px';
            
            $('<div class="silk-thread horizontal"></div>')
                .css({ 
                    'top': `${(i / count) * 100}%`, 
                    'transition-delay': `${delay}ms`,
                    'opacity': opacity,
                    'height': thickness,
                    'background': Math.random() > 0.5 ? 'var(--silk-red)' : 'rgba(139, 29, 29, 0.6)'
                })
                .appendTo($threadLoom);
        }
        
        // Vertical threads with randomized offsets and delays
        for (let i = 0; i < count; i++) {
            const opacity = Math.random() * 0.3 + 0.1;
            const delay = Math.random() * 800;
            const thickness = Math.random() > 0.8 ? '2px' : '1px';

            $('<div class="silk-thread vertical"></div>')
                .css({ 
                    'left': `${(i / count) * 100}%`, 
                    'transition-delay': `${delay}ms`,
                    'opacity': opacity,
                    'width': thickness,
                    'background': Math.random() > 0.5 ? 'var(--silk-red)' : 'rgba(139, 29, 29, 0.6)'
                })
                .appendTo($threadLoom);
        }
    }

    setupThreads();

    // Smooth scroll for nav links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = this.hash;
        if (!target) return;
        
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 1000);
    });

    async function generateReply(data) {
        const systemInstruction = `You are a cryptic and wise Weaver from the kingdom of Pharloom (Hollow Knight: Silksong). 
        Write a brief, atmospheric response (max 50 words). 
        Use metaphors of silk, song, needles, and bells. 
        Refer to the traveler as 'Little Ghost', 'Wanderer', or 'Pilgrim'.
        Be mysterious yet acknowledge their message is being woven into the grand tapestry of the Citadel.`;

        const userPrompt = `A traveler named "${data.name}" (email: ${data.email}) has approached your loom with a request regarding "${data.subject || 'a journey through the Citadel'}".
        Their message: "${data.message}".`;

        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: userPrompt,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.8,
                    topP: 0.9,
                },
            });
            return response.text;
        } catch (error) {
            console.error("Gemini Error:", error);
            return "The thread snaps, but the intent remains. Your message is heard amidst the bells of Pharloom.";
        }
    }

    $form.on('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };

        // UI Transition initiation
        $form.css('opacity', '0.05').css('pointer-events', 'none');
        
        // Trigger weaving with staggered start for more "silky" feel
        $('.silk-thread').each(function(idx) {
            const $t = $(this);
            setTimeout(() => {
                $t.addClass('weaving');
            }, Math.random() * 500);
        });

        $loadingOverlay.removeClass('hidden').hide().fadeIn(300);

        try {
            const reply = await generateReply(formData);
            
            // Artificial delay for atmospheric weight
            setTimeout(() => {
                $loadingOverlay.fadeOut(300);
                $form.hide();
                $aiReply.text(reply);
                $resultView.removeClass('hidden');
                
                // Final seal animation - the Spider's Mark
                const $seal = $('<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-[#ffb443] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,180,67,0.6)] animate-pulse z-[70] bg-black/70 backdrop-blur-md border-opacity-80 transition-all duration-1000"><span class="text-5xl drop-shadow-[0_0_10px_#ffb443]">🕷️</span></div>');
                $formContainer.append($seal);
                
                // Subtle camera shake on completion
                $formContainer.addClass('animate-bounce');
                setTimeout(() => $formContainer.removeClass('animate-bounce'), 500);
                
            }, 2500);

        } catch (err) {
            $loadingOverlay.fadeOut(300);
            $form.css('opacity', '1').css('pointer-events', 'auto');
            $('.silk-thread').removeClass('weaving');
            alert("The loom failed to weave. The threads of fate are knotted. Try again, Wanderer.");
        }
    });

    $('#reset-btn').on('click', function() {
        $form.show().css('opacity', '1').css('pointer-events', 'auto');
        $resultView.addClass('hidden');
        $('.silk-thread').removeClass('weaving');
        $('.animate-pulse.z-\\[70\\]').fadeOut(500, function() { $(this).remove(); }); 
        $form[0].reset();
        setupThreads(); // Re-randomize threads for next use
    });

    // Parallax and ambient interactions
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        $('.floating').css('transform', 'translateY(' + -(scrolled * 0.15) + 'px)');
        
        // Subtle glow effect based on scroll position for nav
        if (scrolled > 100) {
            $('nav').addClass('shadow-[0_0_20px_rgba(139,29,29,0.2)]');
        } else {
            $('nav').removeClass('shadow-[0_0_20px_rgba(139,29,29,0.2)]');
        }
    });
});
