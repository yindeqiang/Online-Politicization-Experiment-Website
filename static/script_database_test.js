data = {
    a: 5,
    b: 6,
    c: 7
}
$.ajax({
    type: "POST",
    contentType: "application/json",
    url: "/database_test",
    data: JSON.stringify(data),
    dataType: "json"
})