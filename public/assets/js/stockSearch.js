const stockInput = $("#stockInput");
const submit = $("#stockSearch");
const trashBtn = $(".trash-btn");

function submitStock(event) {
  event.preventDefault();
  let stock = stockInput.val();
  $.ajax({
    method: "POST",
    url: "/api/stocks/" + stock,
  }).then(function (data) {
    location.replace("/dashboard/" + data.id);
  });
}

function deleteStock() {
  const data_id = $(this).parent().data("id");
  $.ajax({
    method: "DELETE",
    url: "/api/stocks/" + data_id,
  }).then(function () {
    location.replace("/dashboard/");
  });
}

// function submitStock(event) {
//   event.preventDefault();
//   let stock = $(this).attr("data-name")
//   $.ajax({
//     method: "POST",
//     url: "/api/stocks/" + stock,
//   }).then(function (data) {
//     location.replace("/dashboard/" + data.id);
//   });
// }

// $("#stockAnchor").on("click", function (event) {
//     event.preventDefault();
//     let reStock = $(this).val()
//     console.log(reStock)
//     $.ajax({
//       method: "POST",
//       url: "/api/stocks/" + reStock,
//     }).then(function () {
//       location.reload();
//     });
// })

submit.on("click", submitStock);
$(document).on("click", ".trash-btn", deleteStock);
$(document).on("click", ".stockAnchor", function(event){
  event.preventDefault();
  let stock = $(this).attr("data-name")
  $.ajax({
    method: "POST",
    url: "/api/stocks/" + stock,
  }).then(function (data) {
    location.replace("/dashboard/" + data.id);
  });
 
});
