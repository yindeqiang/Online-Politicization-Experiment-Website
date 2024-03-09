const phase = 3;
let quiz_body = document.querySelector(".quiz_body");
let pilot_2_currentTime = new Date();
const pilot_2_startTime = Date.now();
let pilot_2_answers = [];
const num_of_questions = 25;
const attention_check_question_index = 20;

let data = {
    participantId: userData.participantId,
    assignmentId: userData.assignmentId,
    projectId: userData.projectId,
    ideology_label: 0,
    pilot_2_answers: [],
    total_time: 0,
    attention_passed: 0,
};

const ideology_question_idx = ask_ideology_first ? 1 :  num_of_questions + 1;
const ideology_question_string = `
    <p class="question">Q${ideology_question_idx} / ${num_of_questions + 1}. How would you describe your political ideology?</p>
    <div class="input">
        <input type="range" max="2" min="-2" step="0.1" oninput="get_slider_value(this)">
            <div class="answers_mark"></div>
                <div class="scales">
                    <div class="scale" style="left: 10px"></div>
                    <div class="scale" style="left: 155.75px"></div>
                    <div class="scale" style="left: 301px"></div>
                    <div class="scale" style="left: 446px"></div>
                    <div class="scale" style="left: 591px"></div>
                </div>
        <div class="mark_texts"></div>
    </div>
    <button type="button" class="button_big" style="width: 200px" disabled="true">Submit</button>
`;

// Sample and shuffle questions from phase_2_statements
const allQuestionsWithTypes = Object.entries(phase_2_statements).flatMap(([type, questions]) => 
    questions.map(question => ({
        ...question,
        type: type // Add the type to each question object
    }))
);

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const shuffledQuestions = shuffle([...allQuestionsWithTypes]).slice(0, 25);

const questionCounts = {
    design: 0,
    fact: 0,
    prediction: 0,
    issue: 0
};

shuffledQuestions.forEach(question => {
    questionCounts[question.type] += 1;
});

// console.log(questionCounts);

let index_of_question = 0;

let each_answer = {
    index: 0,
    type: 0,
    answer: 0
};

enter_next();

function enter_next() {

    if (ask_ideology_first) {
        if (index_of_question === 0) {
            displayIdeologyQuestion();
        } else if (index_of_question <= 25) {
            each_answer.index = shuffledQuestions[index_of_question - 1].index;
            each_answer.type = shuffledQuestions[index_of_question - 1].type;
            displayQuestion(shuffledQuestions[index_of_question - 1]);
        } else {
            end_quiz();
        }
    } else {
        if (index_of_question <= 24) {
            each_answer.index = shuffledQuestions[index_of_question].index;
            each_answer.type = shuffledQuestions[index_of_question].type;
            displayQuestion(shuffledQuestions[index_of_question]);
        } else if (index_of_question === 25) {
            displayIdeologyQuestion();
        } else {
            end_quiz();
        }
    }
}

function displayIdeologyQuestion() {
    quiz_body.innerHTML = ideology_question_string;
    add_mark_texts([`Liberal`, 'Somewhat<br>Liberal', `Neutral`, `Somewhat<br>Conservative`, `Conservative`]);
    document.querySelector("button").addEventListener("click", () => {
        data.ideology_label = parseFloat(document.querySelector("input[type=range]").value);
        index_of_question += 1;
        enter_next();
    });
}

function displayQuestion(questionInfo) {
    let inputHTML = '';
    switch (questionInfo.type) {
        case "issue":
            inputHTML = `
                <div class="choice-container">
                    <label class="choice-label"><input type="radio" name="choice" value="0" class="choice-radio">Agree</label>
                </div>
                <div class="choice-container">
                    <label class="choice-label"><input type="radio" name="choice" value="1" class="choice-radio">Disagree</label>
                </div>
            `;
            break;
        case "prediction":
        case "fact":
            inputHTML = `
                <div class="choice-container">
                    <label class="choice-label"><input type="radio" name="choice" value="0" class="choice-radio">True</label>
                </div>
                <div class="choice-container">
                    <label class="choice-label"><input type="radio" name="choice" value="1" class="choice-radio">False</label>
                </div>
            `;
            break;
        case "design":
            inputHTML = `
                <div class="choice-container">
                    <label class="choice-label"><input type="radio" name="choice" value="0" class="choice-radio">Left</label>
                </div>
                <div class="choice-container">
                    <label class="choice-label"><input type="radio" name="choice" value="1" class="choice-radio">Right</label>
                </div>
            `;
            break;
    }
    quiz_body.innerHTML = `
        <div class="instruction_phase_3"></div>
        <div class="identity_wrap phase_3_wrap"></div>
        <div class="question_phase_3"></div>
        <div class="statement_phase_3"></div>
        <div class="image-container"></div>
        <div class="input">${inputHTML}</div>
        <div class="operation">
            <span class="display_value"></span>
            <button type="button" disabled="true">Submit</button>
        </div>
    `;
    let statement = document.querySelector(".statement_phase_3");
    let question = document.querySelector(".question_phase_3");
    question.innerHTML = `Q${index_of_question + 1} / ${num_of_questions + 1}. `;
    let question_type = questionInfo.type;
    switch (question_type) {
        case "issue":
            question.innerHTML += `Do you agree or disagree with the following statement?`;
            break;
        case "prediction":
            question.innerHTML += `Do you think the following prediction is to be true?`;
            break;
        case "fact":
            question.innerHTML += `Do you think the following statement is true?`;
            break;
        case "design":
            question.innerHTML += "Which design do you prefer?";
            break;
    }
    const statement_text = questionInfo.text;
    statement.innerHTML = `"` + statement_text + `"`;

    if (questionInfo.type === 'design') {
        loadImageForDesignQuestion(questionInfo.index);
    }

    document.querySelectorAll('input[name="choice"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelector('button').disabled = false;
            each_answer.answer = this.value;
        });
    });
    document.querySelector("button").addEventListener("click", () => {
        index_of_question += 1;
        pilot_2_answers.push(JSON.parse(JSON.stringify(each_answer)));
        if (index_of_question == attention_check_question_index) {
            attention_check();
        } else {
            enter_next();
        }
    });
}

function loadImageForDesignQuestion(index) {
    // Load and display images for design questions
    let imgSrcA = `/static/data/design_pictures/${index}_a.jpg`;
    let imgSrcB = `/static/data/design_pictures/${index}_b.jpg`;
    document.querySelector('.image-container').innerHTML = `<img src="${imgSrcA}" alt="Design A"><img src="${imgSrcB}" alt="Design B">`;
}

function end_quiz() {
    document.querySelector(".quiz_body").innerHTML = `
        <div class="end">
            <h1>For Your Information</h1>
            <p>
                Thank you for finishing in this survey! By clicking “Finish”, you will be redirected back to the Connect platform and get your rewards.
            </p>
            <button type="button" class="button_big" disabled="true">Finish</button>
        </div>
    `;
    let pilot_2_endTime = Date.now();
    let pilot_2_elapsedTime = (pilot_2_endTime - pilot_2_startTime) / 1000;     // in seconds

    data.pilot_2_answers = pilot_2_answers;
    data.total_time = pilot_2_elapsedTime;

    if (!idExisted && userData.participantId != '') {
        // console.log(data);
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: `/${userData.quiz_type}/quiz`,
            data: JSON.stringify(data),
            dataType: "json"
        });
        let button = document.querySelector("button");
        button.disabled = false;
        button.addEventListener("click", () => {
            window.location.href = "https://connect.cloudresearch.com/participant/project/27f7e6b19c1947fbb6596dbdec058264/complete";
        })
    }
}

function attention_check() {
    document.querySelector(".quiz_body").innerHTML = attention_check_string;
    document.querySelector(".attention_check").addEventListener("change", attention_check_click_handler);
    document.querySelector("button").addEventListener("click", enter_next);
}