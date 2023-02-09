const slider = document.querySelector('.heroImgSlider');
const images = document.querySelectorAll('.heroImgSlider img');

let current = 0;

function sliderChange() {
  for (let i = 0; i < images.length; i++) {
    images[i].style.display = "none";
  }

  current = (current + 1) % images.length;

  images[current].style.display = "block";
}

setInterval(sliderChange, 5000);