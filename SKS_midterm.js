// set map, map tile style, zoom and lat, long coordinates for map starting place
let map = L.map('map').setView([39.230176177209856,-87.66420898685969], 5); //make zoom dif and not at renselear
let layerGroup = L.layerGroup().addTo(map);
let resume = { features: [] };

L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
}).addTo(map);


// load the data -- dataset created from geojson.io and has 8 data points/polygons
const showMapData = (features) => {
  const layer = L.geoJSON(features);
  layerGroup.clearLayers();
  layerGroup.addLayer(layer);
};

//make markers and map layers based on the json file  
function updateMap(features) {
  layerGroup.clearLayers();
  const geoJsonLayer = L.geoJSON(features, { pointToLayer: (p, latlng) => L.marker(latlng) })
    .bindTooltip(l => l.feature.properties)
    .addTo(layerGroup);

  return geoJsonLayer;
}

//what? is this to filter? 
function makeTypeCollection(type) {
  return {
    type: 'FeatureCollection',
    features: resume.features.filter(f => f.properties.type === type),
  };
}

// index slide at 0 and moves +1 with next page; -1 with previous page
let currentSlideIndex = 0;

//
const slidesDiv = document.querySelector('.slides');

// linking slides to map dataset
function syncMapToSlide(slide) {
  const collection = slide.era ? makeTypeCollection(slide.type) : resume;
  const layer = updateMap(collection);

//the way the map moves from point to point- make pan instead of fly
  function handlePanEnd() {
    if (slide.showpopups) {
      layer.eachLayer(l => {
        l.bindTooltip(l.feature.properties.label, { permanent: true });
        l.openTooltip();
      });
    }
    map.removeEventListener('moveend', handlePanEnd);
  }

  map.addEventListener('moveend', handlePanEnd);
  if (slide.bounds) {
    map.flyToBounds(slide.bounds);
  } else if (slide.type) {
    map.panToBounds(layer.getBounds());
  }
}

// map features and slide linked 
function syncMapToCurrentSlide() {
  const slide = slides[currentSlideIndex];
  syncMapToSlide(slide);
}

//building initial page
function initSlides() {
  const converter = new showdown.Converter({ smartIndentationFix: true });

//what? this has an error and doesnt work 
  slidesDiv.innerHTML = '';
  for (const [index, slide] of slides.entries()) {
    const slideDiv = htmlToElement(`
      <div class="slide" id="slide-${index}">
        <h2>${slide.title}</h2>
        ${converter.makeHtml(slide.content)}
      </div>
    `);
   slidesDiv.appendChild(slideDiv);
  }
}

// get dataset from raw link on my github
const fetchMapData = () => {
  fetch('https://raw.githubusercontent.com/sighuh/MUSA611_midterm_SKS/main/journey_midterm.json')
  .then(resp => resp.json())
  .then(data => {
    resume = data;
    syncMapToCurrentSlide();
    console.log(data) // this is for debugging 
  });
};

//defining a function is const calling the function is below
fetchMapData();

// moving from slide to slide
function calcCurrentSlideIndex() {
  const scrollPos = window.scrollY;
  const windowHeight = window.innerHeight;
  const slideDivs = document.getElementsByClassName('slide');

  let i;
  for (i = 0; i < slideDivs.length; i++) {
    const slidePos = slideDivs[i].offsetTop;
    if (slidePos - scrollPos - windowHeight > 0) {
      break;
    }
  }

  if (i === 0) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex != i - 1) {
    currentSlideIndex = i - 1;
    syncMapToCurrentSlide();
  }
}

document.addEventListener('scroll', calcCurrentSlideIndex);

initSlides();
syncMapToCurrentSlide();

/* ALl the code I attempted that did not work

// next step is to choose which feature i want to focus on when
let buildPage = function(){
  featureGroup.map(function(features){
    map = map.removeLayer(features)
    feature = []
  })
};


 //defining the current page
let currentPage = 0;
function showCurrentPage() {
  const slide = slides[currentPage];
  showSlide(slide);
}

//function to move to the next page
let nextPage = function(){
    //event handling for proceeding forward in slideshow
    let nextPage = currentPage + 1; //set it equal below to continue to move through the slides
    currentPage = nextPage;
    buildPage(slides[nextPage]);
  }

//function to move to the previous page
let prevPage = function(){
  //event handling for going backward in slideshow
  let prevPage = currentPage -1
  currentPage = prevPage
  buildPage(slides[prevPage])
}

// add event listener to button to execute prePage or nextPage function
const prevBtn = document.querySelector('button');
prevBtn.addEventListener('click', prevPage);

const nextBtn = document.querySelector('button');
nextBtn.addEventListener('click', nextPage);

const sidebar = document.createElement('sidebar');

// JS to appear in HTML
document.getElementsByClassName('sidebar');
sidebar.innerHTML = 'page0.content';

//map to HTML
document.getElementsByClassName('map');
content.innerHTML = layerGroup

const slideJumpSelect = document.querySelector('#jump-to-slide');

//function that shows text in page0 and focuses on indiana
function buildPage0() {
 content.innerHTML = 'page0.title';
//}

*/