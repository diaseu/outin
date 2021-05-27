let zipcode = document.getElementById('location').value, cuisine = document.getElementById('cuisine').value
let hcuisine = localStorage.getItem('hcuisine')
let hlocation = localStorage.getItem('hlocation')

// if there is a search made on another page, show results based on that
$(document).ready(function () {
  if (hcuisine !== null) {
    cuisine = hcuisine
    zipcode = hlocation
    getYelp()
    getSpoon()
    localStorage.removeItem(hcuisine)
    localStorage.removeItem(hlocation)
  } else {
    // otherwise, show results based on search
    cuisine = document.getElementById('cuisine').value
    zipcode = document.getElementById('location').value
  }
})
// End the document.ready

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});
});

function getYelp() {
  $('#restaurantResults').html('')
  $('#recipeResults').html('')
  $('#main').show()
  axios.get('https://cors-proxy-j.herokuapp.com/', {
    headers: {
      // here, pass the actual API request url you are trying to hit
      'Target-URL': `https://api.yelp.com/v3/businesses/search?location=${zipcode}&term=${cuisine}&limit=5`,
      // here, put any other important headers if needed from the API
      'Authorization': 'Bearer lbogapYHxff9h2fSNoWEoM420b8mRfQ4JBsiphR6BtaNKlmR51XQt3wCm2ocKhlkvpnv_46BvAcMuB_cTrv7pmRtuMMplxzaBAA_nAU57ttpRZlv9y05lvxWcXUoX3Yx'
    }
  })
    .then(({ data }) => {
      for (let i = 0; i < 5; i++) {
        let restName = data.businesses[i].name, address = data.businesses[i].location.address1 + ', ' + data.businesses[i].location.city + ', ' + data.businesses[i].location.state + ' ' + data.businesses[i].location.zip_code, phone = data.businesses[i].phone, price = data.businesses[i].price, rating = data.businesses[i].rating, imgSrc = data.businesses[i].image_url
        if (phone === '') {
          phone = 'No phone number'
        }
        if (!data.businesses[i].hasOwnProperty('price')) {
          price = 'No price available'
        }

        document.getElementById('restaurantResults').innerHTML += `
        
                  <div class="col s12 m11">
            <div class="card horizontal">
              <div class="card-image">
                <img src="${imgSrc}" class="responsive-img" alt="${restName}">
              </div>
              <div class="card-stacked">
                <div class="card-content">
                  <h4 class="header">${restName}</h4>
                  <p><strong>Address</strong>: ${address}</p>
                  <p class="mb-3"><strong>Phone</strong>: ${phone}</p>
                  <p><strong>Rating</strong>: ${rating}</p>
                  <p><strong>Price</strong>: ${price}</p>
                </div>
                <div class="card-action">
                  
                  <a href=""><span class="material-icons right addToFavoritesRest" data-name="${restName}" data-address="${address}" data-img="${imgSrc}" data-phone="${phone}" data-rating="${rating}" data-price="${price}"> bookmark_border</span></a>

                </div>
              </div>
            </div>
          </div>
                    
        
        `
      }
    })
    .catch(err => console.error(err))
}

function getSpoon() {
  axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${cuisine}&apiKey=390ebfa488364e6496ce8853bd9bb10d`)
    .then(({ data }) => {
      for (let i = 0; i < 5; i++) {
        let recId = data.results[i].id
        axios.get(`https://api.spoonacular.com/recipes/${recId}/information?apiKey=390ebfa488364e6496ce8853bd9bb10d&includeNutrition=true`)
          .then(res => {
            let price = Math.round(100 * (res.data.pricePerServing / 100)) / 100, imgSrc = res.data.image, recipe = res.data.instructions, time = res.data.readyInMinutes, glutenFree = res.data.glutenFree ? true : false, glutenFreeDisplay = ''
            if (glutenFree) {
              glutenFreeDisplay = '✅'
            }
            else {
              glutenFreeDisplay = '❌'
            }
            document.getElementById('recipeResults').innerHTML += `
              <div class="col s12 m11">
                <div class="card horizontal">
                  <div class="card-image">
                    <img src="${imgSrc}" class="responsive-img" alt="${res.data.title}">
                  </div>
                  <div class="card-stacked">
                    <div class="card-content">
                      <h4 class="header">${res.data.title}</h4>
                      <p><strong>Gluten-Free</strong>: ${glutenFreeDisplay}</p>
                      <p><strong>Servings</strong>: ${res.data.servings}</p>
                      <p><strong>Price</strong>: $${price}/serving</p>
                    </div>
                    <div class="card-action">
                      <a href="#" data-target="#recipe${i}" class="modal-trigger">See Recipe</a>
                      <a href=""><span data-value='${recId}' class="material-icons right addToFavoritesRecipe">bookmark_border</span></a>

                    </div>
                  </div>
                </div>
              </div>
                        
                <div id="recipe${i}" class="modal modal-fixed-footer">
                  <div class="modal-content">
                    <h4>${res.data.title}</h4>
                    <p>${res.data.instructions}</p>
                  </div>
                  <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
                  </div>
                </div>
                `
            var elems = document.querySelectorAll('.modal');
            var instances = M.Modal.init(elems, {})
          })
          .catch(err => console.error(err))

      }
    })
    .catch(err => console.error(err))
}



document.getElementById('search').addEventListener('click', event => {
  event.preventDefault()
  cuisine = document.getElementById('cuisine').value
  zipcode = document.getElementById('location').value
  localStorage.setItem('hcuisine', document.getElementById('cuisine').value);
  localStorage.setItem('hlocation', document.getElementById('location').value);
  getYelp()
  getSpoon()
})


document.addEventListener('click', event => {
  if (event.target.className === 'modal-trigger') {
    let instance = M.Modal.getInstance(document.querySelector(event.target.dataset.target))
    instance.open()
  }
})

function addToFavs(recID) {
  let FavRec = JSON.parse(localStorage.getItem('favRec')) || []
  let alreadyExists = false
  for (let i = 0; i < FavRec.length; i++) {
    if (FavRec[i] == recID) { alreadyExists = true }
  }
  if (alreadyExists == false) {
    FavRec.push(recID)
  }
  localStorage.setItem('favRec', JSON.stringify(FavRec))
}

function addToFaveRests(restName, restAddress, imgSrc, phone, rating, price) {
  let FavRest = JSON.parse(localStorage.getItem('favRest')) || []
  let alreadyExists = false
  for (let i = 0; i < FavRest.length; i++) {
    if (FavRest[i].restAddress === restAddress) { alreadyExists = true }
  }
  if (alreadyExists == false) {
    FavRest.push({
      restName: restName,
      restAddress: restAddress,
      imgSrc: imgSrc,
      restPhone: phone,
      restRating: rating,
      restPrice: price
    })
  }
  localStorage.setItem('favRest', JSON.stringify(FavRest))
}

document.addEventListener('click', event => {
  event.preventDefault()
  if (event.target.classList.contains('addToFavoritesRecipe')) {
    addToFavs(event.target.dataset.value)
    $(event.target).text('bookmark')
  }
})

document.addEventListener('click', event => {
  event.preventDefault()
  if (event.target.classList.contains('addToFavoritesRest')) {
    addToFaveRests(event.target.dataset.name, event.target.dataset.address, event.target.dataset.img, event.target.dataset.phone, event.target.dataset.rating, event.target.dataset.price)
    $(event.target).text('bookmark')
  }
})

$("#location").keyup(function (event) {
  if (event.keyCode === 13) {
    $("#search").click();
  }
});