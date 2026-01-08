$(document).ready(function () 
{
    const container = $("#dynamicModalContainer");
    let sliderInterval;
    let imgIndex = 0;
    let images = []; // moved here

    $(".project-card").on("click", function () 
    {
        let title = $(this).data("title");
        let desc = $(this).data("desc");
        images = JSON.parse($(this).attr("data-images"));

        clearInterval(sliderInterval);
        imgIndex = 0;

        openModal(title, desc);
        if(images.length > 0)
        {
            runSlider();
            
            // Auto start
            sliderInterval = setInterval(() => {
                runSlider();
            }, 4000);
        }

    });

    function openModal(title, desc) 
    {
        let modalHTML = '';

        modalHTML += `
            <div class="modal-box">
                <button class="close-modal">&times;</button>
        `;

        if(images.length > 0)
        {
            modalHTML += `
                        <div class="carousel-wrapper">
                            <button class="nav-btn left-btn">❮</button>
                            <section class="carousel" id="carousel"></section>
                            <button class="nav-btn right-btn">❯</button>
                        </div>
            `;
        }

        modalHTML += `
                    <div class="modal-content">
                        <h2 class="modal-title">${title}</h2>
                        <p class="modal-desc">${desc}</p>
                    </div>
                </div>
        `;
        container.html(`<div class="modal-overlay" id="projectModal">${modalHTML}</div>`);
    }

    function runSlider() 
    {
        const left  = images[(imgIndex) % images.length];
        const mid   = images[(imgIndex + 1) % images.length];
        const right = images[(imgIndex + 2) % images.length];

        $("#carousel").html(`
            <div class="left-slide slide inactive"><div class="img"><img src="${left}" alt=""></div></div>
            <div class="center-slide slide active"><div class="img"><img src="${mid}" alt=""></div></div>
            <div class="right-slide slide inactive"><div class="img"><img src="${right}" alt=""></div></div>
        `);

        imgIndex++;
    }

    // 👉 Right button = next iteration instantly (without restarting interval)
    $(document).on("click", ".right-btn", function () {
        runSlider(); // next set
    });

    // 👉 Left button = move 1 step back — reverse iteration
    $(document).on("click", ".left-btn", function () {
        imgIndex -= 2; // reverse logic
        if (imgIndex < 0) imgIndex = images.length - 1;
        runSlider();
    });

    // Close modal
    $(document).on("click", ".close-modal", function () 
    {
        try 
        {
            if (typeof sliderInterval !== "undefined" && sliderInterval) 
            {
                clearInterval(sliderInterval);
            }
        } 
        catch (error) 
        {
            console.log("No slider interval found");
        }

        $("#projectModal").remove();
    });

    // Close modal when clicking outside modal-box
    $(document).on("click", ".modal-overlay", function () {
        if (typeof sliderInterval !== "undefined" && sliderInterval) {
            clearInterval(sliderInterval);
        }
        $("#projectModal").remove();
    });
    // Prevent modal close when clicking inside modal-box
    $(document).on("click", ".modal-box", function (e) {
        e.stopPropagation();
    });

});
