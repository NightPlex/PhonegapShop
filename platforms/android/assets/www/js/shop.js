/**
 * NightPlex
 */

//Constructor for shop items
function Product(name, quantity) {
    this.name = name;
    this.quantity = quantity;
}


//nickname for API
var nickname = window.localStorage.getItem("nickname");

if (nickname == null) {
    nickname = "Anonymous";
} else {
    $("#hidden-nickname").show();
}


//Add specific list to lists.

function writeListToPage() {

    $("#get-all-products").html("");

    var products = getListFromStorage();

    if (products == null) {
        return;
    }

    for (var i = 0; i < products.length; i++) {
        $("#get-all-products").append(
            '<li class="swipeout">' +
            '<div class="swipeout-content item-content">' +
            '<div class="post_entry">' +
            '<div class="post_thumb"><img onclick="capturePhoto();" src="images/photos/photo8.jpg" alt="" title="" id="'+ products[i].name +'" onclick=""/></div>' +
            '<div class="post_details">' +
            '<h2>' + products[i].name + '  ' + products[i].quantity + 'x</h2>' +
            '<span class="post_author">by <a href="#">' + nickname + '</a></span>' +
            '</div>' +
            '<div class="post_swipe"><img src="images/swipe_more.png" alt="" title=""/></div>' +
            '</div>' +
            '</div>' +
            '<div class="swipeout-actions-right">' +
            '<a href="#" onclick="deleteProductFromList(\'' + products[i].name + '\')"><img' +
            'src="images/icons/white/heart.png" alt="" title=""/></a>' +
            '</div>' +
            '</li>'
        );
    }
}

//temp
function deleteFromcache() {
    window.localStorage.clear();
}
//deleteFromcache();

//Get list from storage according to nickname
function getListFromStorage() {
    var listArray = JSON.parse(window.localStorage.getItem(nickname));
    return listArray;
}

//Delete product from list using name
function deleteProductFromList(name) {
    var listArray = JSON.parse(window.localStorage.getItem(nickname));

    //Good old stream
    var newArray = listArray.filter(function (e) {
        return e.name !== name;
    });
    var JSONArray = JSON.stringify(newArray);
    window.localStorage.setItem(nickname, JSONArray);
    writeListToPage();
}

//Write lists to storage with nickname as key.
function addNewProductToStorage(newProduct) {
    var listArray = JSON.parse(window.localStorage.getItem(nickname));
    //If doesn't exist yet add a new
    if (listArray === null) {
        listArray = [];
    }

    //First let us check if item already exists.

    // Using map to find index
    var duplicateProductIndex = listArray.map(function (item) { return item.name; }).indexOf(newProduct.name);
    if (duplicateProductIndex > -1) {
        listArray[duplicateProductIndex].quantity += newProduct.quantity;
    } else {
        //Add new to list
        listArray.push(newProduct);
    }

    //JSON
    var JSONArray = JSON.stringify(listArray);
    window.localStorage.setItem(nickname, JSONArray);
    writeListToPage();

}

//Nickname logic
$("#set-nickname").click(function () {
    setNickname();
    $("#input-nickname").val("");
    $("#hidden-nickname").hide();
    $("#nickname-set").show().delay(5000).fadeOut();

});

function setNickname() {
    var nick = $("#input-nickname").val();
    window.localStorage.setItem("nickname", nick);
    nickname = nick;
    $(".mynickname").text(nickname);
    writeListToPage();
}

//Photo related stuff:
//Start of camera function::
function capturePhoto() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
    });
}

function onSuccess(imageURI) {

    $("#testImg").src = imageURI;
}

function onFail(message) {
    alert('Failed because: ' + message);
}


//Init required for framework7
$$(document).on('pageInit', function (e) {


    //Add new products.
    $("#add-new-product").click(function () {

        var name = $("#add-new-shop-list-name").val();
        var quantity = $("#add-new-shop-list-number").val();

        if(validateData(name, quantity)) {
            var newProduct = new Product((name), parseInt(quantity));
            addNewProductToStorage(newProduct);
        }else {
            $("#add-new-shop-list-name").val("");
        }

    });


    //Nickname output
    $(".mynickname").text(nickname);

    writeListToPage();


});

//Validation
function validateData(name, amount) {
    if(name.length < 1) {
        $("#hidden-validation-name").text("Name must be at least 1 character long.");
        $("#hidden-validation-name").show().delay(3000).fadeOut();
        return false;
    }
    if(!isInt(amount)) {
        $("#hidden-validation-quantity").text("Amount must be inserted");
        $("#hidden-validation-quantity").show().delay(3000).fadeOut();
        return false;
    }

    return true;
}

function isInt(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}
