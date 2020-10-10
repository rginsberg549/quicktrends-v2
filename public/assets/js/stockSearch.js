const stockInput = $("#stockInput");
const submit = $("#stockSearch");

function submitStock(event) {
    event.preventDefault();

    let stock = stockInput.val();
    console.log(stock)
    $.ajax({
        method: "POST",
        url: "http://localhost:3001/api/stocks/" + stock
    }).then(function() {
        location.reload();
    })
}

submit.on("click", submitStock);