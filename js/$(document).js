$(document).ready(function () {
    const container = $("#dynamicModalContainer");

    $(".project-card").on("click", function () {
        const title = $(this).data("title");
        const desc = $(this).data("desc");
        const images = JSON.parse($(this).attr("data-images"));
        openModal(title, desc, images);
    });

    function openModal(title, desc, images) {
        let currentIndex = 0;
        let autoScroll = null;

        // Generate slides
        function generateSlides() {
            return images.map(img => `<div class="slide"><div class="img"><img src="${img}" loading="lazy"></div></div>`).join('');
        }

        container.html(`
            <div class="modal-overlay" id="projectModal">
                <div class="modal-box">
                    <button class="close-modal">&times;</button>
                    <div class="carousel-wrapper">
                        <button class="nav-btn left-btn">❮</button>
                        <div class="carousel">
                            ${generateSlides()}
                        </div>
                        <button class="nav-btn right-btn">❯</button>
                    </div>
                    <div class="modal-content">
                        <h2 class="modal-title">${title}</h2>
                        <p class="modal-desc">${desc}</p>
                    </div>
                </div>
            </div>
        `);

        const modal = $("#projectModal");
        const carousel = modal.find(".carousel");
        const slides = carousel.find(".slide");
        const total = slides.length;

        function updateSlides() {
            slides.removeClass("prev active next");

            const prevIndex = (currentIndex - 1 + total) % total;
            const nextIndex = (currentIndex + 1) % total;

            slides.eq(prevIndex).addClass("prev");
            slides.eq(currentIndex).addClass("active");
            slides.eq(nextIndex).addClass("next");

            // Center slide using transform
            const slideWidth = slides.eq(currentIndex).outerWidth(true);
            const wrapperWidth = carousel.parent().width();
            const offset = currentIndex * slideWidth;
            const center = offset - (wrapperWidth / 2 - slideWidth / 2);

            carousel.css('transform', `translateX(${-center}px)`);
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % total;
            updateSlides();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + total) % total;
            updateSlides();
        }

        function startAuto() {
            stopAuto();
            autoScroll = setInterval(nextSlide, 3000);
        }

        function stopAuto() {
            if(autoScroll){ clearInterval(autoScroll); autoScroll = null; }
        }

        updateSlides();
        startAuto();

        modal.on("click", ".right-btn", function(){ stopAuto(); nextSlide(); startAuto(); });
        modal.on("click", ".left-btn", function(){ stopAuto(); prevSlide(); startAuto(); });
        modal.on("click", ".close-modal", function(){ stopAuto(); modal.remove(); });
    }
});
