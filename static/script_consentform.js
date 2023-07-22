let button = document.querySelector("button");
adjust_button_size(button);

if (userData.participantId == -1)
    alert("It appears that you have not been redirected correctly from the Connect platform, which may affect your payment. We suggest that you return to Connect and attempt to redirect again.");

document.addEventListener("change", after_check);
document.querySelector("button").addEventListener("click", () =>{
    window.location.href = '/quiz/' + userData.quiz_type + '/' + 'aid=' + userData.aid;
});