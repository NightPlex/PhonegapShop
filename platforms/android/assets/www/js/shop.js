/**
 * NightPlex
 */

function Product(name, quantity, nickname) {
    this.name = name;
    this.quantity = quantity;
    this.nickname = nickname;
}


//nickname for API
var nickname = window.localStorage.getItem("nickname");
console.log(nickname);

if (nickname == null) {
    nickname = "Anonymous";
} else {
    $("#hidden-nickname").show();
}


//Get shop  products from backend (API)

function getByNicknameFromServe(nickname) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/' + nickname,
        dataType: "json",
        success: function (data) {
           var listProducts = getListFromStorage();
           for(var i = 0; i < data.length; i++) {
               listProducts.push(new Product(data[i].name,data[i].quantity,data[i].nickname))
           }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}
alert("test");
//Add specific list to lists.
function writeListToPage() {

    $("#get-all-products").html("");
    getByNicknameFromServe(nickname);

    var products = getListFromStorage();

    if (products == null) {
        return;
    }

    for (var i = 0; i < products.length; i++) {
        $("#get-all-products").append(
            '<li class="swipeout">' +
            '<div class="swipeout-content item-content">' +
            '<div class="post_entry">' +
            '<div class="post_thumb"><img onclick="capturePhoto();" src="images/photos/photo8.jpg" alt="" title="" id="testing123" onclick=""/></div>' +
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
//deleteFromcache();

//Get list from storage according to nickname
function getListFromStorage() {
    console.log(" this is nick: " + nickname);
    var listArray = JSON.parse(window.localStorage.getItem(nickname));
    return listArray;
}

//temp
function deleteFromcache() {
    window.localStorage.clear();
}

function deleteProductFromList(name) {

    var listArray = JSON.parse(window.localStorage.getItem(nickname));
    console.log(listArray);

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
    var duplicateProductIndex = listArray.map(function (item) {
        return item.name;
    }).indexOf(newProduct.name);
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
    alert("plappla")
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI
    });
}

function onSuccess(imageURI) {

    alert(imageURI);
    $("#maybe").append("<img src='"+ imageURI +"'/>");
    alert("oonSuccess");
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

        if (validateData(name, quantity)) {
            var newProduct = new Product((name), parseInt(quantity), nickname);
            addNewProductToStorage(newProduct);
        } else {
            $("#add-new-shop-list-name").val("");
        }

    });


    //Nickname output
    $(".mynickname").text(nickname);

    writeListToPage();


});

//Validation
function validateData(name, amount) {
    if (name.length < 1) {
        $("#hidden-validation-name").text("Name must be at least 1 character long.");
        $("#hidden-validation-name").show().delay(3000).fadeOut();
        return false;
    }
    if (!isInt(amount) || amount < 1) {
        $("#hidden-validation-quantity").text("Amount must be higher than 0");
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
