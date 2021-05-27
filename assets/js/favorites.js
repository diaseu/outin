let favorites = JSON.parse(localStorage.getItem('favRec'))
for (i = 0; i < favorites.length; i++) {
  axios.get(`https://api.spoonacular.com/recipes/${favorites[i]}/information?apiKey=390ebfa488364e6496ce8853bd9bb10d&includeNutrition=true`)
    .then(res => {
      let price = Math.round(100 * (res.data.pricePerServing / 100)) / 100, imgSrc = res.data.image, recipe = res.data.instructions, time = res.data.readyInMinutes, glutenFree = res.data.glutenFree ? true : false, glutenFreeDisplay = ''
      if (glutenFree) {
        glutenFreeDisplay = '✅'
      }
      else {
        glutenFreeDisplay = '❌'
      }
      document.getElementById('favRec').innerHTML += `
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
                  <a href=""><span data-value="${res.data.id}" class="material-icons right addToFavoritesRecipe">bookmark_remove</span></a>

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
      console.log(res.data)
      var elems = document.querySelectorAll('.modal');
      var instances = M.Modal.init(elems, {})
    })
    .catch(err => console.error(err))
}

let favoriteRests = JSON.parse(localStorage.getItem('favRest'))
for (let i = 0; i < favoriteRests.length; i++) {
  document.getElementById('favRest').innerHTML += `
        
                  <div class="col s12 m11">
            <div class="card horizontal">
              <div class="card-image">
                <img src="${favoriteRests[i].imgSrc}" class="responsive-img" alt="${favoriteRests[i].restName}">
              </div>
              <div class="card-stacked">
                <div class="card-content">
                  <h4 class="header">${favoriteRests[i].restName}</h4>
                  <p><strong>Address</strong>: ${favoriteRests[i].restAddress}</p>
                  <p class="mb-3"><strong>Phone</strong>: ${favoriteRests[i].restPhone}</p>
                  <p><strong>Rating</strong>: ${favoriteRests[i].restRating}</p>
                  <p><strong>Price</strong>: ${favoriteRests[i].restPrice}</p>
                </div>
                <div class="card-action">
                  
                  <a href=""><span class="material-icons right addToFavoritesRest" data-name="${favoriteRests[i].restName}" data-address="${favoriteRests[i].restAddress}" data-img="${favoriteRests[i].imgSrc}" data-phone="${favoriteRests[i].restPhone}" data-rating="${favoriteRests[i].restRating}" data-price="${favoriteRests[i].restPrice}"> bookmark_remove </span></a>

                </div>
              </div>
            </div>
          </div>
      `
}

// this removes recipes from favorites
document.addEventListener('click', event => {
  event.preventDefault()
  if (event.target.classList.contains('addToFavoritesRecipe')) {
    event.target.parentNode.parentNode.parentNode.parentNode.remove()
    let favs = JSON.parse(localStorage.getItem('favRec'))
    console.log(event.target.dataset.value)
    function removeItemOnce(arr, value) {
      var index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
    }
    favs = removeItemOnce(favs, event.target.dataset.value)
    localStorage.setItem('favRec', JSON.stringify(favs))

  }
})

// this removes restaurants from favorites
document.addEventListener('click', event => {
  event.preventDefault()
  if (event.target.classList.contains('addToFavoritesRest')) {
    event.target.parentNode.parentNode.parentNode.parentNode.remove()
    let favs = JSON.parse(localStorage.getItem('favRest'))
    for (let i = 0; i < favs.length; i++) {
      if (favs[i].restAddress === event.target.dataset.address) {
        if (i > -1) {
          favs.splice(i, 1)
        }
      }
    }
    localStorage.setItem('favRest', JSON.stringify(favs))
  }
})