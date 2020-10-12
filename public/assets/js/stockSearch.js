const stockInput = $("#stockInput");
const submit = $("#stockSearch");
const trashBtn = $("#trash-btn");

function submitStock(event) {
  event.preventDefault();

  let stock = stockInput.val();

  $.ajax({
    method: "POST",
    url: "/api/stocks/" + stock,
  }).then(function () {
    location.reload();
  });
}

function deleteStock() {
  const data_id = trashBtn.parent().data("id");
  $.ajax({
    method: "DELETE",
    url: "/api/stocks/" + data_id,
  }).then(function () {
    location.reload()
  });
}

submit.on("click", submitStock);
trashBtn.on("click", deleteStock);
