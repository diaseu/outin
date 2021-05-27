
// let hcuisine = document.getElementById('hcuisine').value, hlocation = document.getElementById('hlocation').value

function populateStorage() {
  localStorage.setItem('hcuisine', document.getElementById('hcuisine').value);
  localStorage.setItem('hlocation', document.getElementById('hlocation').value);
}

document.getElementById('hsearch').addEventListener('click', event => {
  populateStorage()
  window.location.replace("search.html")
})

$("#hlocation").keyup(function (event) {
  if (event.keyCode === 13) {
    $("#hsearch").click();
  }
});