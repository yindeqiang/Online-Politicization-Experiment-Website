phase = 0;

// 将题目进行乱序
const statements = [];
statements[0] = shuffleArray([...phase_0_statements[0]]);
statements[1] = shuffleArray([...phase_0_statements[1]]);

function init_phase_0() {
    const body_string = `
        <div class="phase_0_wrapper">
            <h1 class="questions_block_title"></h1>
            <div class="questions_list"></div>
            <div class="button_block">
                <button class="button_big continue_btn" disabled onclick="enter_next()">Continue</button>
            </div>
        </div>
    `;
    document.querySelector(".quiz_body").innerHTML = body_string;

    const title = document.querySelector('.questions_block_title');
    const questions_list = document.querySelector('.questions_list');

    let questions = [];

    // 每页三道题
    if (question_seqNum_in_phase + 3 > statements[0].length) {
        title.innerHTML = `Q${next_question_seqNum}-Q${next_question_seqNum + 2}. Do you agree or disagree with the following statement?`
        questions = statements[1].slice(question_seqNum_in_phase - statements[0].length, question_seqNum_in_phase - statements[0].length + 3);
    } else {
        questions = statements[0].slice(question_seqNum_in_phase, question_seqNum_in_phase + 3);
    }

    question_seqNum_in_phase += 3;

    // 将三道题的dom添加到页面上
    questions.forEach((q, i) => {
        const dom = `
            <div class="question_title">Q${next_question_seqNum}. “${q.text}”</div>
            <div>${generateAxis(q)}</div>
        `
        const div = document.createElement('div');
        div.className = 'question_item';
        div.innerHTML = dom;
        questions_list.appendChild(div);
        if (i !== questions.length - 1) {
            next_question_seqNum += 1;
        }
    });

    const start_time = Date.now();

    function checkIfSubmitCanBeEnabled() {
        if (marker_dragged.every(o => o === true)) {
            continue_btn.removeAttribute('disabled');
        } else {
            continue_btn.setAttribute('disabled', 'disabled');
        }
    }
    const continue_btn = document.querySelector('.continue_btn');
    // 拖拽滑块
    const markers = document.querySelectorAll('.range-marker-phase-2');
    const range = document.querySelector('.range-number-line');
    let marker_dragged = [];
    let dragger = null;
    let current = -1;
    markers.forEach((marker, index) => {
        marker_dragged[index] = false;
        marker.addEventListener('mousedown', () => {
            dragger = marker;
            current = index;
            console.log(current);
            marker.style.cursor = 'grabbing';
            document.addEventListener('mouseup', handleMouseUp, false);
            document.addEventListener('mousemove', handleMouseMove, false);
            document.addEventListener('blur', handleMouseUp, false);
        });
    })
    

    function handleMouseUp() {
        current = -1;
        dragger.style.cursor = 'grab';
        document.removeEventListener('mouseup', handleMouseUp, false);
        document.removeEventListener('mousemove', handleMouseMove, false);
        document.removeEventListener('blur', handleMouseUp, false);
    }

    const segment_percentage = 2.5;
    function handleMouseMove(event) {
        if (current === -1) return;

        const rect = range.getBoundingClientRect();
        let x = event.clientX - rect.left;
        x = Math.max(x, 0);
        x = Math.min(x, rect.width);
        const percentage = (x / rect.width) * 100;
        let segmentIndex = Math.floor(percentage / segment_percentage);
        segmentIndex = Math.min(segmentIndex, 40);
        dragger.style.left = `${segmentIndex * segment_percentage}%`;

        const rangeValue = questions[current].range || [-2, 2];
        const value = (rangeValue[1] - rangeValue[0]) * (segmentIndex * segment_percentage / 100) + rangeValue[0];

        temp_answers[current] = {
            index_of_question: questions[current].index,
            answer: value,
            time_to_answer: (Date.now() - start_time) / 1000
        }
        // console.log(value);
        marker_dragged[current] = true;
        checkIfSubmitCanBeEnabled();
    }
}

function generateAxis(info) {
    if (info.axis === 'attitude') {
        return phase_0_axis_string_0(info);
    }
    return phase_0_axis_string_1(info);
}