const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);

    //adding feature number 2: image lightbox
    //If you click double in any image in the gallery this will show as lightbox....
    //To return..you should click out of the lightbox image.

    let lightbox = document.createElement('div')
    lightbox.id = 'lightbox'
    document.body.appendChild(lightbox);
    div.addEventListener('dblclick', e => {
      lightbox.classList.add('active')
      const img = document.createElement('img')
      img.src = `${image.webformatURL}`;
      while (lightbox.firstChild) {
        lightbox.removeChild(lightbox.firstChild)
      }
      lightbox.appendChild(img);
    })

    lightbox.addEventListener('click', e => {
      if (e.target !== e.currentTarget) return
      lightbox.classList.remove('active')
    })
    toggleSpinner(false);
  })

}

const getImages = (query) => {
  toggleSpinner(true);
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    //.then(data => showImages(data.hitS))   ***Problem Number 1: here int "data.hitS" the alphabet "s" is in uppercase which is wrong.

    .then(data => showImages(data.hits)) // *** Now the first problem is fixed when I have set "data.hits" on the contrary of "data.hitS"
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    //alert('Hey, Already added !');
    toggleImage(element, img);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;
  console.log('duration', duration); // *** the 2nd problem is solved  after changing the name of the {id="duration"} in the input box in line number 33.

  if (duration < 1000) {
    alert('As you input a value less than 1000 so we have fixed your duration time as 1000ms'); //*** the 3rd problem is solved by fixing duration as 1000ms for any value less then 1000 */
    duration = 1000;
  }

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

//problem number 5 has been solver here by toggling 'added' class
// toggle image click
const toggleImage = (element, img) => {
  element.classList.toggle('added');
  const index = sliders.indexOf(img);
  if (index > -1) {
    sliders.splice(index, 1);
  }
}

//Extra feature number : 1
//this feature will show a spinner when loading data

/*const toggleSpinner = (show) =>{
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.toggle('d-none');
}*/

const toggleSpinner = (show) => {
  const spinner = document.getElementById('loading-spinner');
  if (show) {
    spinner.classList.remove('d-none');
  } else {
    spinner.classList.add('d-none');
  }
}