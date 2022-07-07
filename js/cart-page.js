//Retrieve cart data from session storage
window.addEventListener('load', () => {

  //var storedArray = sessionStorage.getItem("productArray");
  var productArray = JSON.parse(sessionStorage.getItem("productArray"));
  
  for(var i = 0; i < productArray.length; i++) {

    var productRow = document.createElement('div');
    productRow.classList.add('product')
    var productItems = document.getElementsByClassName('shopping-cart')[0];
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

    var productRowContents = `
    <div id="product-image">
      <img class="product-image" src="${imageSrc}">
    </div>
    <div class="product-details">
      <div class="product-title">${productArray[i][0]}</div>
      <p class="product-description">${description}</p>
      <button href="#" class="addOn_button" data-toggle="modal" data-target="#addOn">Add On Devices</button></p>
    </div>
    <div class="product-price">${productArray[i][1]}</div>
    <div id="product-quantity">
      <input class="product-quantity-input" type="number" value="${productArray[i][2]}" min="1">
    </div>
    <div id="product-removal">
      <button class="remove-product">
        Remove
      </button>
    </div>
    <div class="product-line-price">${productArray[i][3]}</div>`

    productRow.innerHTML = productRowContents
    productItems.append(productRow) 
    productRow.getElementsByClassName('remove-product')[0].addEventListener('change',removeItem)
    productRow.getElementsByClassName('product-quantity-input')[0].addEventListener('change',updateQuantity)

  }

  //call function when action triggered
  $('#product-removal button').click(function () {
    removeItem(this);
  });

  var addOnButton = document.getElementsByClassName('addOn_button');
  for (var i = 0; i < addOnButton.length; i++) {
    var button = addOnButton[i];
    button.addEventListener('click', addOnDeviceClicked);
  }

  var addToPackageButtons = document.getElementsByClassName("device-add-button");
  for (var i=0; i<addToPackageButtons.length; i++){
    var button = addToPackageButtons[i];
    button.addEventListener("click", addToPackageClicked); 
  }

  var removeDeviceButtons = document.getElementsByClassName('device-row-removal')
  for (var i = 0; i < removeDeviceButtons.length; i++) {
    var button = removeDeviceButtons[i]
    button.addEventListener('click', removeDevice)
  }

    /* Update quantity */
  function updateQuantity(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0 || input.value % 1 != 0) {
        input.value = 1
        
    }
    
    /* Calculate line price */
    var productRow = $(input).parent().parent();
    var price = parseFloat(productRow.children('.product-price').text());
    var quantity = $(input).val();
    var linePrice = price * quantity;
    var total_price

    var update_quantity = productRow[0].innerText.substring(0,11)
    console.log(update_quantity)
    for(var i = 0; i < productArray.length; i++) {
      total_price=productArray[i][3]
      if(productArray[i][0].includes(update_quantity)){
        total_price+=productArray[i][1]
        productArray[i][2]=input.value
        productArray[i][3]=total_price
      }
    }

    sessionStorage.setItem("productArray", JSON.stringify(productArray));
      
    /* Update line price display and recalc cart totals */
    productRow.children('.product-line-price').each(function () {
      $(this).fadeOut(fadeTime, function () {
        $(this).text(linePrice.toFixed(2));
        recalculateCart();
        $(this).fadeIn(fadeTime);
      });
    });
  }

  /* Remove item from cart */
  function removeItem(removeButton) {
    /* Remove row from DOM and recalc cart total */
    var productRow = $(removeButton).parent().parent();
    productRow.slideUp(fadeTime, function () {
      productRow.remove();
      recalculateCart();

      //set seesion after remove item
      
      var remove_item = productRow[0].innerText.substring(29,46)
      for(var i = 0; i < productArray.length; i++) {
        if(productArray[i][0].includes(remove_item)){
          productArray.splice(i,1);
        }
      }
      sessionStorage.setItem("productArray", JSON.stringify(productArray));
    });
  }

  recalculateCart();
})


/* Set rates + misc */
var taxRate = 0.05;
var shippingRate = 10.00;
var fadeTime = 300;

/* Recalculate cart */
function recalculateCart() {
  var subtotal = 0;

  /* Sum up row totals */
  $('.product').each(function () {
    subtotal += parseFloat($(this).children('.product-line-price').text());
  });

  /* Calculate totals */
  var tax = subtotal * taxRate;
  var shipping = (subtotal > 0 ? shippingRate : 0);
  var total = subtotal + tax + shipping;
  
  /* Update totals display */
  $('.totals-value').fadeOut(fadeTime, function () {
    $('#cart-subtotal').html(subtotal.toFixed(2));
    $('#cart-tax').html(tax.toFixed(2));
    $('#cart-shipping').html(shipping.toFixed(2));
    $('#cart-total').html(total.toFixed(2));
    if (total == 0) {
      $('.checkout').fadeOut(fadeTime);
    } else {
      $('.checkout').fadeIn(fadeTime);
    }
    $('.totals-value').fadeIn(fadeTime);
  });
}

/* Update price when device added*/
function updatePrice(package){

  /* Calculate line price */
  var price = parseFloat(package.getElementsByClassName('product-price')[0].innerText)
  var quantity = package.getElementsByClassName('product-quantity-input')[0].value
  var linePrice = price * quantity;

  /* Update line price display and recalc cart totals */
  $(package).each(function () {
    $(this).children('.product-line-price').fadeOut(fadeTime, function () {
      $(this).text(linePrice.toFixed(2));
      recalculateCart();
      $(this).fadeIn(fadeTime);
    });
  });
}

//remove device from package
function removeDevice(event) {
  var buttonClicked = event.target
  var package = buttonClicked.parentElement.parentElement.parentElement
  var packagePrice = parseFloat(package.getElementsByClassName('product-price')[0].innerText)

  var packageSubtotal = parseFloat(package.getElementsByClassName('product-line-price')[0].innerText)
  
  var device = buttonClicked.parentElement.parentElement
  var devicePrice = parseFloat(device.getElementsByClassName('device-row-price')[0].innerText.replace('RM', ''))
  

  packagePrice -= devicePrice
  packageSubtotal -= devicePrice

  package.getElementsByClassName('product-price')[0].innerText = packagePrice
  package.getElementsByClassName('product-line-price')[0].innerText = packageSubtotal
  buttonClicked.parentElement.parentElement.remove()
  recalculateCart()
}

/*Add To Package Funtion*/

function addOnDeviceClicked(packages){
  var button = packages.target;
  var packageType = button.parentElement;

  var package = packageType.getElementsByClassName('product-title')[0].innerText;
  addDeviceToPackage(null,null,null,package)
}

function addToPackageClicked(addDevice) {
  var button = addDevice.target;
  var shopItem = button.parentElement;

  var image = shopItem.getElementsByClassName('device-image')[0].src;
  var title = shopItem.getElementsByClassName('device-name')[0].innerText;
  var price = parseFloat(shopItem.getElementsByClassName('device-price')[0].innerText.replace('RM', ''));
  
  console.log(image,title,price)
  
  addDeviceToPackage(image, title, price);
  recalculateCart();
  }

var package = null
var n = 0
function addDeviceToPackage(image, title, price, packageName) {

  if (image == null && title == null && price == null){
    package = packageName
  }

  else{

    //count number of packages added in cart.html
    var countPackageRow = document.querySelectorAll('.product').length

    for (var i=0; i < countPackageRow; i++){
      var productItems = document.getElementsByClassName('product')[i];
      var productTitle = document.getElementsByClassName('product-title')[i].innerText
      var countDeviceRow = productItems.querySelectorAll('.product-row').length
      
      if(productTitle == package){
        
        var productRow = document.createElement('div');
        productRow.classList.add('product-row')
        
        var productItemNames = productItems.getElementsByClassName('product-description');

        if (productItemNames[n].innerText.includes(title)){
          alert('This device is already added to the package.')
          return
        }

        if (countDeviceRow > 0){
          for (var j=0; j<countDeviceRow; j++){
            var deviceItem = document.getElementsByClassName('device-row-title')[j].innerText
            if (title == deviceItem){
              alert('This device is already added to the package.')
              return
            }
          }
        }

        n += 1
      
        var productRowContents = `
        <div id="device-row-image">
          <img src="${image}">
        </div>
        <div class="device-details">
          <div class="device-row-title">${title}</div>
        </div>
        <div class="device-row-price">RM ${price}</div>
        <div id="device-row-quantity">1</div>
        <div class="device-row-removal">
          <button class="remove-device">
            Remove
          </button>
        </div>`
        
        productRow.innerHTML = productRowContents
        productItems.append(productRow)

        if (n == productItemNames.length){
          n = 0
        }
      
        /* Update packae price after add on devices*/
        var packagePrice = parseFloat(document.getElementsByClassName('product-price')[i].innerText)
        packagePrice += price
        document.getElementsByClassName('product-price')[i].innerText = packagePrice
        updatePrice(productItems)

        
        productRow.getElementsByClassName('device-row-removal')[0].addEventListener('click',removeDevice)
        packagePrice -= price
      }
    }
  }
}

const buttonSave = document.querySelector(".buttonSave");

buttonSave.addEventListener("click", () => {
  buttonSave.classList.add("buttonSaving");
});


  
  
  