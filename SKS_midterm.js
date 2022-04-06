// set map, map tile style, zoom and lat, long coordinates for map starting place
let map = L.map('map').setView([39.230176177209856,-87.66420898685969], 5); //make zoom dif == is 5
//let layerGroup = L.layerGroup().addTo(map);

L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
}).addTo(map);

// get dataset from raw link on my github
let showMapData; //declaring this variable saying it exists 
let points;

const fetchMapData = () => {
  fetch('https://raw.githubusercontent.com/sighuh/MUSA611_midterm_SKS/main/journey_midterm.json')
  .then(resp => resp.json())
  .then(data => {
    points = data;//assigning something, this thing that exists represents value on right side of = sign
    showMapData = L.geoJSON(data)
    showMapData.bindTooltip(l => l.feature.properties.Place).
    addTo(map);
    showCurrentSlide();
    console.log(data) // this is for debugging 
  });
}

//declare and assign is defining something, eg const fetchMapDAta = () => {}
//defining a function is const calling the function is below
fetchMapData();

/* load the data -- dataset created from geojson.io and has 8 data points/polygons
const updateMap = (features) => {
  const layer = L.geoJSON(features);
  layerGroup.clearLayers();
  layerGroup.addLayer(layer);
};
*/

// index slide at 0 and moves i+1 with next page; i-1 with previous page queryselector-links to HTML can use console to look up where the element is 
let currentSlideIndex = 0;
const slideTitleDiv = document.querySelector('.slide-title');
const slideContentDiv = document.querySelector('.slide-content');
const slidePrevButton = document.querySelector('#prev-slide');
const slideNextButton = document.querySelector('#next-slide');
//const slideJumpSelect = document.querySelector('#jump-to-slide');


//make markers and map layers based on the json file  
function updateMap(collection) {
  layerGroup.clearLayers();
  const geoJsonLayer = L.geoJSON(features, { pointToLayer: (p, latlng) => L.marker(latlng) })
    .bindTooltip(l => l.feature.properties)
    .addTo(layerGroup);

  return geoJsonLayer;
}

function makeEraCollection(era) {
  return {
    type: 'FeatureCollection',
    features: lifeCollection.features.filter(f => f.properties.era === era),
  };
}

function showSlide(slide) {
  slideTitleDiv.innerHTML = `<h3>${slide.properties.Place}</h3>`;
  slideContentDiv.innerHTML = `<p>${slide.properties.content}</p>`

  map.eachLayer(marker => {
    if (marker.feature && marker.feature.properties.Place === slide.properties.Place) {
      map.flyTo(marker.getLatLng(), 10);
  
/* Open the marker popup
      marker
        .bindPopup(`<h3>${slide.properties.Location}</h3>`)
        .openPopup();
    } else {
      marker.closePopup(); */
    }
  });
}

  function showCurrentSlide() {
    const slide = points.features[currentSlideIndex];
    showSlide(slide);
  }

  // moving from slide to slide, iterating through to next, and moving back to previous
  function goNextSlide() {
    currentSlideIndex++;
  
    if (currentSlideIndex === 23) {
      currentSlideIndex = 0;
    }
  
    showCurrentSlide();
  }
  
  function goPrevSlide() {
    currentSlideIndex--;
  
    if (currentSlideIndex < 0) {
      currentSlideIndex = slides.length - 1;
    }
  
    showCurrentSlide();
  }
  
  function jumpToSlide() {
    currentSlideIndex = parseInt(slideJumpSelect.value, 10);
    showCurrentSlide();
  }
 /* not needed because taking out the ability to jump to different slides, took out line 127 because it was called from this function
  function initSlideSelect() {
    slideJumpSelect.innerHTML = ''; //empty string to make inner HTML empty - that div container becomes empty
    for (const [index, slide] of slides.entries()) {
      const option = document.createElement('option');
      option.value = index;
      option.innerHTML = slide.title;
      slideJumpSelect.appendChild(option);
    }
  }
*/

slidePrevButton.addEventListener('click', goPrevSlide);
slideNextButton.addEventListener('click', goNextSlide);
//slideJumpSelect.addEventListener('click', jumpToSlide);

//initSlideSelect();
// showCurrentSlide();