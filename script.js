
const track = document.querySelector(".review-track");

const nextBtn = document.querySelector(".next-btn");

const prevBtn = document.querySelector(".prev-btn");


let currentIndex = 0;

nextBtn.addEventListener("click", function () {

    if (currentIndex < 2) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }

    console.log(currentIndex);
    
const card = document.querySelector(".review-card");

const cardWidth = card.getBoundingClientRect().width;

const move = currentIndex * (cardWidth + 20);

track.style.transform = `translateX(-${move}px)`;


});

prevBtn.addEventListener("click", function () {

    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = 2;
    }

    const card = document.querySelector(".review-card");

    const cardWidth = card.getBoundingClientRect().width;

    const move = currentIndex * (cardWidth + 20);

    track.style.transform = `translateX(-${move}px)`;

});


setInterval(function () {

    if (currentIndex < 2) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }

    const card = document.querySelector(".review-card");

    const cardWidth = card.getBoundingClientRect().width;

    const move = currentIndex * (cardWidth + 20);

    track.style.transform = `translateX(-${move}px)`;

}, 3000);

