/*Cart Funtion*/

/*Store items to cart*/

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
}

else {
  ready();
}

window.addEventListener('load', () => {

var productArray = JSON.parse(sessionStorage.getItem("productArray"));

for(var i = 0; i < productArray.length; i++) {
  
  for(var j = 0; j < productArray[i].length; j++) {
      console.log(productArray[i][j]);
  }

  var cartRow = document.createElement('div');
  cartRow.classList.add('cart-row')
  var cartItems = document.getElementsByClassName('cart-items')[0];
  var description

  //assign description for each package
  if (productArray[i][0] == 'Basic Home Package') {
    imageSrc = 'img/icon/basic.png'
    description = '2 devices included: Mini Call Button, M2 Hub.'
  }

  else if (productArray[i][0] == 'Standard Home Package') {
    imageSrc = 'img/icon/standard.png'
    description = '5 devices included: Mini Call Button, Vayyar Home Detection, Motion Sensor, \
    Door & Window Sensor, Hub G3 Camera.'
  }

  else if (productArray[i][0] == 'Premium Home Package') {
    imageSrc = 'img/icon/premium.png'
    description = '6 devices included: Mini Call Button, Vayyar Home Detection, Motion Sensor, \
    Door & Window Sensor, Hub G3 Camera, Google Nest Hub.'
  }

  var cartRowContents = `
  <div class="cart-item cart-column">
  <span class="cart-item-title">${productArray[i][0]}</span> 
  </div>
  <span class="cart-price cart-column">RM ${productArray[i][1]}</span>
  <div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="${productArray[i][2]}" min="1">
  </div>
  <span class="cart-subtotal cart-column">RM ${productArray[i][3]}</span>
  <span class="cart-remove-btn cart-column"><i class="fa fa-trash" aria-hidden="true"></i></span>`

  cartRow.innerHTML = cartRowContents
  cartItems.append(cartRow)
  updateCartTotal()
  cartRow.getElementsByClassName('cart-remove-btn')[0].addEventListener('click',removeCartItem)
  cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',quantityChanged)
}
})

function ready() {
var removeCartItemButtons = document.getElementsByClassName('cart-remove-btn')
for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i]
    button.addEventListener('click', removeCartItem)
}

var quantityInputs = document.getElementsByClassName('cart-quantity-input')
for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i]
    input.addEventListener('change', quantityChanged)
}

var addToCartButtons = document.getElementsByClassName('addCart_button');
console.log('length' + addToCartButtons.length)
for (var i = 0; i < addToCartButtons.length; i++) {
  var button = addToCartButtons[i];
  button.addEventListener('click', addToCartClicked);
}

}

function removeCartItem(event) {
  var buttonClicked = event.target
  buttonClicked.parentElement.parentElement.remove()
  var removedItem = buttonClicked.parentElement.parentElement
  var removeKey = 1
  updateCartTotal(removeKey, removedItem)
}

function quantityChanged(event) {
  var input = event.target
  if (isNaN(input.value) || input.value <= 0 || input.value % 1 != 0) {
      input.value = 1
  }
  updateCartTotal()
}

var a=0;
var cartArray = [[]]
function updateCartTotal(removeKey, removedItem) {
  var cartItemContainer = document.getElementsByClassName('cart-items')[0]
  var cartRows = cartItemContainer.getElementsByClassName('cart-row')
  var subtotal = 0
  var total = 0

  if(cartRows.length == 0){
    sessionStorage.clear()
  }

  else{

    for (var i = 0; i < cartRows.length; i++) {
        
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('RM', ''))
        var quantity = quantityElement.value
        subtotal = price * quantity
        total = total + (price * quantity)
        var title = cartRow.getElementsByClassName('cart-item-title')[0].innerText

        document.getElementsByClassName('cart-subtotal')[i].innerText = 'RM' + subtotal
        
        //to check if remove item are triggered
        if (removeKey == 1){
          var removedItemTitle = removedItem.getElementsByClassName('cart-item-title')[0].innerText
          for(var h = 0; h < cartArray.length; h++) {
            if (removedItemTitle == cartArray[h][0]){
              cartArray.splice(h,1)
            }
          }
        }

        else{
          cartArray[i] = [title, price, quantity, subtotal]
        }

        //saving the values in session storage  
        sessionStorage.setItem("productArray", JSON.stringify(cartArray));
    }
  } 

  total = Math.round(total * 100) / 100

  if (total % 1 != 0){
    document.getElementsByClassName('cart-total-price')[0].innerText = total 
  }

  else{
    document.getElementsByClassName('cart-total-price')[0].innerText = total+ '.00'
  }

  document.getElementsByClassName('label')[0].innerText = 'My Cart (' + cartRows.length +')'
}


/*Add To Cart Funtion*/
function addToCartClicked(addCart) {
  var button = addCart.target;
  var shopItem = button.parentElement.parentElement;

  var title = shopItem.getElementsByClassName('item-title')[0].innerText;
  var price = shopItem.getElementsByClassName('item-price')[0].innerText;

  addItemToCart(title, price);
  updateCartTotal();
}

var addItemId = 0;

function addItemToCart(title, price) {

  //cart drop down
  var cartRow = document.createElement('div');
  cartRow.classList.add('cart-row')
  var cartItems = document.getElementsByClassName('cart-items')[0];
  var cartItemNames = cartItems.getElementsByClassName('cart-item-title');

  for (var i = 0; i < cartItemNames.length; i++){
    if (cartItemNames[i].innerText == title){
      alert('This package is already added to the cart.')
      return
    }
  }

  var cartRowContents = `
    <div class="cart-item cart-column">
    <span class="cart-item-title">${title}</span> 
    </div>
    <span class="cart-price cart-column">RM ${price}</span>
    <div class="cart-quantity cart-column">
      <input class="cart-quantity-input" type="number" value="1" min="1">
    </div>
    <span class="cart-subtotal cart-column">RM ${price}</span>
    <span class="cart-remove-btn cart-column"><i class="fa fa-trash" aria-hidden="true"></i></span>`

  cartRow.innerHTML = cartRowContents
  cartItems.append(cartRow)
  cartRow.getElementsByClassName('cart-remove-btn')[0].addEventListener('click',removeCartItem)
  cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',quantityChanged)
}



