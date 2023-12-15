let button = document.querySelector("button");
adjust_button_size(button);

if (userData.participantId == "")
    alert("It seems that you have not been redirected correctly from the Connect platform, which may affect your payment. We suggest that you return to Connect and attempt to redirect again.");

if (idExisted)
    alert("It seems that you have completed the experiment once. We appreciate your involvement, but we kindly ask you to leave the site and explore other available experiments.");

document.addEventListener("change", after_check);
document.querySelector("button").addEventListener("click", () =>{
    window.location.href = `${userData.quiz_type}/quiz?participantId=${userData.participantId}&assignmentId=${userData.assignmentId}&projectId=${userData.projectId}`;
});