let phase = 3;
let quiz_body = document.querySelector(".quiz_body");
let pilot_2_currentTime = new Date();
let pilot_2_startTime = Date.now();
let pilot_2_ideology_label = 0;     // answer to the first questions
let pilot_2_answers = [];           // answers from the second questions
let num_of_questions = 11;

quiz_body.innerHTML = `
    <p class="question">Q1 / ${num_of_questions}. How would you describe your political ideology?</p>
    <form class="form_ideology" style="margin: auto; margin-top: 30px">
        <label>
            <input type="radio" name="ideology" value="-2">
            Liberal
        </label><br>
        <label>
            <input type="radio" name="ideology" value="-1">
            Somewhat Liberal
        </label><br>
        <label>
            <input type="radio" name="ideology" value="0">
            Neutral
        </label><br>
        <label>
            <input type="radio" name="ideology" value="1">
            Somewhat Conservative
        </label><br>
        <label>
            <input type="radio" name="ideology" value="2">
            Conservative
        </label><br>
    </form>
    <button type="button" class="button_big" style="width: 200px" disabled="true">Submit</button>
`;

document.querySelector("form").addEventListener("click", () => {
    let index = 0;
    document.querySelectorAll("input").forEach((input) => {
        if (input.checked) {
            document.querySelector("button").disabled = false;
            pilot_2_ideology_label = index;
        }
        index++;
    });
});

let index_of_question = 0;
let type_index = 0;
document.querySelector("button").addEventListener("click", enter_next);

var data = {
    participantId: userData.participantId,
    assignmentId: userData.assignmentId,
    projectId: userData.projectId,
    ideology_label: 0,
    pilot_2_answers: [],
    total_time: 0,
    attention_passed: 0
};

let question_answered = {
    "issue": [false, false, false, false],
    "prediction": [false, false, false, false],
}


function enter_next() {
    quiz_body.innerHTML = phase_3_body_string;
    let statement = document.querySelector(".statement_phase_3");
    let question = document.querySelector(".question_phase_3");
    let slider = document.querySelector("input[type=range]");
    question.innerHTML = `Q${index_of_question + 2} / ${num_of_questions}. `;

    let question_type = "";
    if (index_of_question >= 8)
        question_type = "fact";
    else if (index_of_question % 2 == 0)
        question_type = "issue";
    else if (index_of_question % 2 == 1)
        question_type = "prediction";

    switch (question_type) {
        case "issue":
            question.innerHTML += `Do you agree with the following statement?`;
            break;
        case "prediction":
            question.innerHTML += `How likely do you think the following prediction is to be true?`;
            break;
        case "fact":
            question.innerHTML += `Select your answer to the following question:`;
            break;
    }

    statement_text = ""
    if (index_of_question >= 8) {
        type_index = index_of_question - 8;
    } else {
        while (true) {
            type_index = Math.floor(Math.random() * 4);
            if (!question_answered[question_type][type_index]) {
                question_answered[question_type][type_index] = true;
                break;
            }
        }
    }
    statement_text = phase_2_statements[question_type][type_index].text;
    statement.innerHTML = `"` + statement_text + `"`;
    question_wrap = phase_2_statements[question_type][type_index]
    generate_and_add_mark_texts()
    
    if (question_type == 'fact') {
        min_value = phase_2_statements[question_type][type_index].range[0];
        max_value = phase_2_statements[question_type][type_index].range[1];
        step = phase_2_statements[question_type][type_index].step;
        slider.min = min_value;
        slider.max = max_value;
        slider.step = phase_2_statements[question_type][type_index].step;
        slider.value = (min_value + max_value) / 2;
    }

    let display_value = document.querySelector(".display_value");

    if (question_type == "fact") {
        if (Math.abs(min_value) >= 1) {
            display_value.innerHTML += `
                Your value:
                <span id="slider_value">${(max_value + min_value) / 2}</span>
            `;
        } else {
            display_value.innerHTML += `
                Your value:
                <span id="slider_value">${100 * (max_value + min_value) / 2}%</span>
            `;
        }
    }

    document.querySelector("button").addEventListener("click", () => {

        pilot_2_answers.push(parseFloat(slider.value));     // track answers

        if (index_of_question < 9) {
            index_of_question += 1;
            if (index_of_question == 5) {
                attention_check();
            } else {
                enter_next();
            }
        } else {
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

            data.ideology_label = pilot_2_ideology_label;
            data.pilot_2_answers = pilot_2_answers;
            data.total_time = pilot_2_elapsedTime;

            if (!idExisted && userData.participantId != '') {
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
    });
}



function attention_check() {
    document.querySelector(".quiz_body").innerHTML = attention_check_string;
    document.querySelector(".attention_check").addEventListener("change", attention_check_click_handler);
    if (userData.quiz_type == 'pilot_2')
        document.querySelector("button").addEventListener("click", enter_next);
}