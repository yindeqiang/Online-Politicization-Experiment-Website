phase = 0;

function init_phase_0() {
    const body_string = `
        <h1 class="questions_block_title"></h1>
        <div class="questions_list"></div>
    `;
    document.querySelector(".quiz_body").innerHTML = body_string;
}