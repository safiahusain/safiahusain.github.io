document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("dynamicModalContainer");
  const cards = document.querySelectorAll(".project-card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const title = card.dataset.title;
      const desc = card.dataset.desc;
      const images = JSON.parse(card.dataset.images);
      openModal(title, desc, images);
    });
  });

  function openModal(title, desc, images) {
    container.innerHTML = `
      <div class="modal-overlay" id="projectModal">
        <div class="modal-box">
          <button class="close-modal" id="closeModal">&times;</button>

          <div class="carousel">
            ${images.map((img, i) => `<img src="${img}" class="${i===0?'active':''}">`).join('')}
            <button class="carousel-btn prev" id="prevBtn">&#10094;</button>
            <button class="carousel-btn next" id="nextBtn">&#10095;</button>
            <div class="carousel-dots">
              ${images.map((_, i) => `<span data-index="${i}" class="${i===0?'active':''}"></span>`).join('')}
            </div>
          </div>

          <div class="modal-content">
            <h2 class="modal-title">${title}</h2>
            <p class="modal-desc">${desc}</p>
          </div>
        </div>
      </div>
    `;

    const modal = document.getElementById("projectModal");
    const closeBtn = document.getElementById("closeModal");
    const imagesEl = modal.querySelectorAll(".carousel img");
    const dots = modal.querySelectorAll(".carousel-dots span");
    const prev = modal.querySelector("#prevBtn");
    const next = modal.querySelector("#nextBtn");

    let index = 0;
    let interval;

    const showImage = (i) => {
      imagesEl.forEach(img => img.classList.remove("active"));
      dots.forEach(dot => dot.classList.remove("active"));
      imagesEl[i].classList.add("active");
      dots[i].classList.add("active");
      index = i;
    };

    const nextSlide = () => showImage((index + 1) % imagesEl.length);
    const prevSlide = () => showImage(index === 0 ? imagesEl.length - 1 : index - 1);

    dots.forEach(dot => dot.addEventListener("click", () => showImage(+dot.dataset.index)));
    prev.addEventListener("click", () => { stopAuto(); prevSlide(); startAuto(); });
    next.addEventListener("click", () => { stopAuto(); nextSlide(); startAuto(); });

    function startAuto() { interval = setInterval(nextSlide, 3500); }
    function stopAuto() { clearInterval(interval); }

    startAuto();
    modal.style.display = "flex";

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

    function closeModal() {
      stopAuto();
      modal.remove();
    }
  }
});
