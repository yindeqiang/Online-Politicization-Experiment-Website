phase = 0;

function init_phase_0() {
    const body_string = `
        <div class="phase_0_wrapper">
            <h1 class="questions_block_title"></h1>
            <div class="questions_list"></div>
        </div>
    `;
    document.querySelector(".quiz_body").innerHTML = body_string;

    const title = document.querySelector('.questions_block_title');
    const questions_list = document.querySelector('.questions_list');

    // 将题目进行乱序
    const statements = [];
    statements[0] = shuffleArray([...phase_0_statements[0]]);
    statements[1] = shuffleArray([...phase_0_statements[1]]);

    let questions = [];

    // 每页三道题
    if (question_seqNum_in_phase + 3 > statements[0].length) {
        questions = statements[1].slice(question_seqNum_in_phase, question_seqNum_in_phase + 3);
    } else {
        questions = statements[0].slice(question_seqNum_in_phase, question_seqNum_in_phase + 3);
    }

    // 将三道题的dom添加到页面上
    questions.forEach(q => {
        const dom = `
            <div class="question_title">Q${next_question_seqNum}. “${q.text}”</div>
            <div>${generateAxis(q)}</div>
        `
        const div = document.createElement('div');
        div.className = 'question_item';
        div.innerHTML = dom;
        questions_list.appendChild(div);


        next_question_seqNum += 1;
    });
}

function generateAxis(info) {
    if (info.axis === 'attitude') {
        return phase_0_axis_string_0;
    } else {
        return phase_0_axis_string_1(info);
    }
}