const stockInput = $("#stockInput");
const submit = $("#stockSearch");
const trashBtn = $("#trash-btn");

function submitStock(event) {
  event.preventDefault();

  let stock = stockInput.val();
  console.log(stock);
  $.ajax({
    method: "POST",
    url: "/api/stocks/" + stock,
  }).then(function () {
    console.log("Stock created!");
    location.reload();
  });
}

function deleteStock() {
  const data_id = trashBtn.parent().data("id");
  $.ajax({
    method: "DELETE",
    url: "/api/stocks/" + data_id,
  }).then(location.reload());
}

submit.on("click", submitStock);
trashBtn.on("click", deleteStock);
