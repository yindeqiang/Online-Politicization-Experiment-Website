var phase_2_orders = {
    set_order: [],
    question_order: [],
    participant_order: [null, 1, null, null],
};

const set_index_to_name = {
    0: "fact",
    1: "prediction",
    2: "issue",
    3: "design",
};

const phase_2_starting_question_index = 12;



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



function determine_phase_3_order() {
    const num_of_sets = Object.keys(phase_2_statements).length;
    phase_2_orders.set_order = shuffleArray([...Array(num_of_sets).keys()]);
    for (const set_index of phase_2_orders.set_order) {
        const key = set_index_to_name[set_index];
        let enabled_length = 0;
        phase_2_statements[key].forEach((question_info) => {
            if (question_info.enabled) { enabled_length += 1; }
        });
        // console.log(`[DEBUG] Number of questions in ${key}: ${enabled_length}`);
        const enabledQuestions = phase_2_statements[key].filter(question_info => question_info.enabled);
        const enabledQuestionsIndexes = enabledQuestions.map(question_info => question_info.index);
        if (enabledQuestionsIndexes.length != 5) {
            console.error('Assertion failed: enabledQuestionsIndexes does not have a length of 5');
        }
        phase_2_orders.question_order.push(shuffleArray(enabledQuestionsIndexes));
    }
    let randomNumber = Math.random();
    randomNumber = randomNumber < 0.5 ? 0 : 2;
    phase_2_orders.participant_order = [randomNumber, 1, 2 - randomNumber, randomNumber];
}

determine_phase_3_order();



function test_phase_II() {
    phase = 3;
    pseudonyms_chosen = ["Alice", "Alex", "Betty"];
    avatars_index_chosen = [0, 1, 2];
    data.identity_choices = [[0, 0], [1, 1], [2, 2]];   // actually unnecessary, but identity_choices is redundant
    data.ideologies = [-1, null, 1];
    data.labels = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ];
    // phase_2_orders.participant_order = [1, 1, 1, 1];
    next_question_seqNum = phase_2_starting_question_index;
    init_phase_3();
}



function selectOption(index) {
    const left_option = document.querySelector("#left_option");
    const right_option = document.querySelector("#right_option");
    document.querySelector(".submit-button").disabled = false;
    if (index == 0) {
        left_option.classList.add("selected");
        right_option.classList.remove("selected");
    } else {
        left_option.classList.remove("selected");
        right_option.classList.add("selected");
    }
    temp_answers[human_index] = index;
}



function toggle_image_display(question_index) {
    const leftPicture = document.querySelector("#left_picture");
    const rightPicture = document.querySelector("#right_picture");
    const default_src = `/static/data/design_pictures/default.jpg`;
    if (leftPicture.src.includes(default_src) && rightPicture.src.includes(default_src)) {
        leftPicture.src = `/static/data/design_pictures/${question_index}_a.jpg`;
        rightPicture.src = `/static/data/design_pictures/${question_index}_b.jpg`;
    } else {
        leftPicture.src = default_src;
        rightPicture.src = default_src;
    }
}



function init_phase_3() {
    // change DOM
    document.querySelector(".quiz_body").innerHTML = `
        <div class="split" id="left_part_phase_II">
            <div class="instruction_phase_3"></div>
            <div id="identity_wrap_phase_II"></div>
        </div>

        <div class="split" id="right_part_phase_II">
            <div id="right_content_phase_II">
                <div class="question_phase_3"></div>
                <div class="statement_phase_3"></div>
                <div id="answer_area_phase_II">
                    <div id="pictures_container">
                        <img src="/static/data/design_pictures/default.jpg" class="picture_phase_II" id="left_picture">
                        <img src="/static/data/design_pictures/default.jpg" class="picture_phase_II" id="right_picture">
                    </div>
                    <div id="operations">
                        <div id="options_container">
                            <button class="option-button" onclick="selectOption(0)" id="left_option">Option 1</button>
                            <button class="option-button" onclick="selectOption(1)" id="right_option">Option 2</button>
                        </div>
                        <div id="buttons_container">
                            <button class="submit-button" disabled>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    let question = document.querySelector(".question_phase_3");
    let statement = document.querySelector(".statement_phase_3");
    let instruction = document.querySelector(".instruction_phase_3");
    let answer_area = document.querySelector("#answer_area_phase_II");
    const set_num = Math.floor(question_seqNum_in_phase / 5);
    const question_num = question_seqNum_in_phase % 5;
    const set_index = phase_2_orders.set_order[set_num];
    const question_index = phase_2_orders.question_order[set_num][question_num];
    const question_type = set_index_to_name[set_index];
    add_identity_status();
    answers_first = phase_2_orders.participant_order[set_num];
    start_time[answers_first] = Date.now();
    const set_begin_seqNum = phase_2_starting_question_index + 5 * set_num;
    const set_end_seqNum = set_begin_seqNum + 4;
    if (answers_first == human_index) {
        instruction.innerHTML = `For Q${set_begin_seqNum}~Q${set_end_seqNum}, <b>You</b> are picked to answer first.\nPlease choose your answer.`;
    } else {
        instruction.innerHTML = `
            For Q${set_begin_seqNum}~Q${set_end_seqNum}, <b>${pseudonyms_chosen[answers_first]}</b> is picked to answer first. Please wait
            <span class="dots"></span>
        `;
        transform_dots();
    }

    // profile
    for (let index = 0; index < num_of_participants; index++) {
        if (index == answers_first) {
            document.getElementById(`status_${index}`).innerHTML = loader_string;
            document.getElementById(`profile_${index}`).classList.add("answering_now");
        } else {
            document.getElementById(`profile_${index}`).classList.add("not_answering_now");
        }
    }

    // text
    question.innerHTML = `Q${next_question_seqNum}. `;
    const left_option = document.querySelector("#left_option");
    const right_option = document.querySelector("#right_option");
    switch (question_type) {
        case "issue":
            question.innerHTML += `Do you agree or disagree with the following statement?`;
            left_option.textContent = "Agree";
            right_option.textContent = "Disagree"
            break;
        case "prediction":
            question.innerHTML += `Do you think the following prediction is to be true?`;
            left_option.textContent = "Yes";
            right_option.textContent = "No";
            break;
        case "fact":
            question.innerHTML += `Do you think the following statement is true?`;
            left_option.textContent = "Yes";
            right_option.textContent = "No";
            break;
        case "design":
            question.innerHTML += "Which design do you prefer?";
            left_option.textContent = "Left";
            right_option.textContent = "Right";
            break;
        default:
            break;
    }
    statement_text = phase_2_statements[question_type][question_index].text;

    // pictures
    if (question_type == "design") {
        document.querySelector("#pictures_container").style.display = "flex";
    }

    // if the user answers first
    if (answers_first == human_index) {
        pseudonyms_left = JSON.parse(JSON.stringify(pseudonyms_chosen));
        pseudonyms_left.splice(human_index, 1);
        statement.innerHTML = `"` + statement_text + `"`;
        toggle_image_display(question_index);
        document.querySelector(".submit-button").addEventListener("click", () => {
            each_answer.time_to_answer[human_index] = (Date.now() - start_time[human_index]) / 1000;
            for (let i = 0; i < num_of_participants; i++) {
                if (i != human_index) { temp_answers[i] = null; }
            }
            document.querySelectorAll("button").forEach((button) => {
                button.disabled = true;
            });
            answer_area.classList.add("concealed");
            display_values(answers_first, question_type);

            // change DOM
            document.getElementById(`status_${human_index}`).innerHTML = ``;
            let profile = document.getElementById(`profile_${human_index}`);
            setTimeout(() => {
                profile.classList.remove("answering_now");
                profile.classList.add("finish_answering");
                let profiles = document.querySelectorAll(".profile_with_labels");
                let index = 0;
                profiles.forEach((profile) => {
                    if (index == human_index) {
                        profile.classList.remove("finish_answering");
                        profile.classList.add("not_answering_now");
                    } else {
                        profile.classList.add("answering_now");
                        profile.classList.remove("not_answering_now");
                        document.getElementById(`status_${index}`).innerHTML = loader_string;
                    }
                    index++;
                    instruction.innerHTML = `
                        Now it's <b>${pseudonyms_left[0]}</b>'s and <b>${pseudonyms_left[1]}</b>'s turn to answer this question. Please wait
                        <span class="dots"></span>
                    `;
                    transform_dots();
                });
                bots_index = generate_bot_array(num_of_participants, human_index);
                for (const index of bots_index)
                    start_time[index] = Date.now();
                start_bot_timers(bots_index, "phase_3_question");
                document.addEventListener("timeup", all_finish_answering_phase_3);
            }, time_configurations['lag'] * 1000)
        });
    }

    // if the bot answers first
    else {
        // change DOM
        statement.textContent = `You will see the question after ${pseudonyms_chosen[answers_first]} submits her/his answer.`;
        statement.classList.add("concealed");
        answer_area.classList.add("concealed");
        document.querySelectorAll("button").forEach((button) => {
            button.disabled = true;
        });
        start_bot_timers([answers_first], "phase_3_question");
        document.addEventListener("timeup", after_bot_input_phase_3);
    }
}



function after_bot_input_phase_3() {
    document.removeEventListener("timeup", after_bot_input_phase_3);
    all_bots_timeup = false;
    let instruction = document.querySelector(".instruction_phase_3");
    let statement = document.querySelector(".statement_phase_3");
    let answer_area = document.querySelector("#answer_area_phase_II");
    const set_num = Math.floor(question_seqNum_in_phase / 5);
    const set_index = phase_2_orders.set_order[set_num];
    const question_index = phase_2_orders.question_order[set_num][question_seqNum_in_phase % 5];
    const question_type = set_index_to_name[set_index];

    // register bot value
    temp_answers[answers_first] = generate_answers_for_bots();
    display_values(answers_first, question_type);
    
    // change DOM
    setTimeout(() => {
        let profiles = document.querySelectorAll(".profile_with_labels");
        let index = 0;
        profiles.forEach((profile) => {
            if (index == answers_first) {
                profile.classList.remove("finish_answering");
                profile.classList.add("not_answering_now");
            } else {
                profile.classList.add("answering_now");
                profile.classList.remove("not_answering_now");
                document.getElementById(`status_${index}`).innerHTML = loader_string;
            }
            index++;
        });

        statement.innerHTML = `"` + statement_text + `"`;
        statement.classList.remove("concealed");
        answer_area.classList.remove("concealed");
        document.querySelectorAll(".option-button").forEach((button) => {
            button.disabled = false;
        });
        if (set_index_to_name[set_index] == "design") {
            toggle_image_display(question_index);
        }

        // deal with instruction
        index_of_bots_left = generate_bot_array(num_of_participants, human_index);
        index_of_bots_left.splice(index_of_bots_left.indexOf(answers_first), 1);
        instruction.innerHTML = `
            Now it's <b>YOUR</b> and <b>${pseudonyms_chosen[index_of_bots_left[0]]}</b>'s turn to answer this question. Please choose your answer.
        `;
        // start_bot_timers
        start_bot_timers(index_of_bots_left, "phase_3_question");
        start_time[human_index] = Date.now();

        // after the user clicks the button
        document.querySelector(".submit-button").addEventListener("click", () => {
            let profile = document.getElementById(`profile_${human_index}`);
            profile.classList.remove("answering_now");
            profile.classList.add("finish_answering");
            answer_area.classList.add("concealed");
            document.querySelectorAll("button").forEach((button) => {
                button.disabled = true;
            });
            for (let i = 0; i < num_of_participants; i++) {
                if (i != answers_first && i != human_index)
                    temp_answers[i] = null;
            }
            each_answer.time_to_answer[human_index] = (Date.now() - start_time[human_index]) / 1000;
            document.getElementById(`status_${human_index}`).innerHTML = ``;
            instruction.innerHTML = ``;
            if (all_bots_timeup)
                all_finish_answering_phase_3();
            else
                document.addEventListener("timeup", all_finish_answering_phase_3);
        });
    }, time_configurations['lag'] * 1000);
};



function all_finish_answering_phase_3() {
    document.removeEventListener("timeup", all_finish_answering_phase_3);
    clearInterval(timer);
    all_bots_timeup = false;

    // a lag before "check your answers"
    setTimeout(() => {
        let instruction = document.querySelector(".instruction_phase_3");
        instruction.innerHTML = `All of you have finished answering.\nPlease enter the next question.`;
        const answer_area = document.querySelector("#answer_area_phase_II");
        answer_area.innerHTML = `<button class="enter-next-button">Next Question</button>`;
        answer_area.classList.remove("concealed");
        document.querySelectorAll(".profile_with_labels").forEach((profile) => {
            profile.classList.remove("finish_answering");
            profile.classList.add("not_answering_now");
        })
        document.querySelector("button").addEventListener('click', enter_next);
    }, time_configurations['lag'] * 1000);
};

