const num_of_participants = 3;
const num_of_bots = num_of_participants - 1;
const max_num_of_labels = 3;
const human_index = 1;
const phase_1_special_question_index = 3;

const test_mode = false;

const issue_answer_time = [8.103063157894741, 6.618499999999999, 6.054199999999997, 7.566473684210525, 8.115181818181819, 5.204784313725493, 6.32694, 5.685673076923079, 7.071762376237626, 6.577291666666668]

const time_configurations = {
    'test': 1,
    'wait': [0, 10],
    'phase_3_question': [4, 8],
    'preference': [1, 4],
    'issue': 5,
    'lag': 1,
    'confirm': [10, 10],
};

const style_configurations = {
    'finish_opacity': 0.2,
    'clicked_choice_background_color': 'grey',
    'disagree': 'Disagree X',
    'agree': 'Agree √',
};

var each_answer = {
    idx_of_question: -1,        // index of the question in the array of questions
    who_answers_first: -1,
    answers: [],
    time_to_answer: []
}

var data = {
    participantId: userData.participantId,
    assignmentId: userData.assignmentId,
    projectId: userData.projectId,
    identity_choices: [],
    ideologies: [],
    labels: [],
    attention_passed: false,
    bot_detected: 0,
    total_time: 0,              // total time to finish the experiment
    type_A_answers: [],         // ideological questions in phase I
    type_B_answers: [],         // preference questions in phase I
    type_C_answers: [],         // non-ideological questions in phase II
    type_D_answers: [],         // post-quiz questions
    reason: ""
};

let firstBotIndex = (human_index == 0) ? 1 : 0;
let lastBotIndex = (human_index == num_of_participants - 1) ? num_of_participants - 2 : num_of_participants - 1;

// status
var all_bots_timeup = false;        // whether all bots are time up
var phase = 0;
var temp_answers = [];
var answers_first = -1;
var next_question_seqNum = 0;
var question_seqNum_in_phase = 0;   // start from 0
var index_of_question = 0;          // in phase 1 and phase 3
var phase_1_answers_HTML = ``;
var pseudonyms_chosen = []
var avatars_index_chosen = [];
var start_time = [];

const total_start_time = Date.now();
const timeupEvent = new Event("timeup");
var timer;


function enter_next() {
    // deal with data
    if (phase == 1) {
        // track answers and display them
        track_answers();
        phase_1_answers_HTML = document.querySelector(".right").innerHTML;
        // save answers
        each_answer.answers = temp_answers;
        each_answer.idx_of_question = index_of_question;
        each_answer.who_answers_first = -1;
        data.type_A_answers.push(each_answer);
        each_answer = JSON.parse(JSON.stringify(each_answer));      // deep copy and generate a new answer object
    }

    else if (phase == 3) {
        each_answer.answers = temp_answers;
        each_answer.idx_of_question = index_of_question;
        each_answer.who_answers_first = answers_first;
        data.type_B_answers.push(each_answer);
        each_answer = JSON.parse(JSON.stringify(each_answer));
    }

    else if (phase == 4) {
        answers = [];
        split_answers = [];
        document.querySelectorAll("input[type=range]").forEach((range) => {
            answers.push(parseFloat(range.value));
        });
        split_answers.push(answers.slice(0, 3));
        if (userData.quiz_type == 'pilot_1') {
            split_answers.push(answers.slice(3, 5));
            split_answers.push(answers.slice(5, 7));
        }
        data.type_D_answers = split_answers;

        if (userData.quiz_type != 'condition_1') {
            let detection_answers = [0, 0];
            for (let i = 0; i <= 1; i++) {
                let identity_choice_seqNum = 0;
                while (input = document.getElementById(`detection_${i}_${identity_choice_seqNum}`)) {
                    if (input.checked) {
                        detection_answers[i] = identity_choice_seqNum;
                    }
                    identity_choice_seqNum += 1;
                }
            }
            data.bot_detected = detection_answers[0] * 10 + detection_answers[1];
        }
        document.querySelector(".quiz_body").removeEventListener("click", phase_4_click_handler);
    }

    temp_answers = [];      // restore answers
    all_bots_timeup = false;
    start_time = [];

    // is the last question in the phase
    if (question_seqNum_in_phase == get_phase_length(phase) - 1) {
        if (phase == 4)
            attention_check();

        else {
            if (userData.quiz_type == 'pilot_1' && phase == 1) {
                phase = 4;
                question_seqNum_in_phase = 0;
                show_instructions();
            } else if (userData.quiz_type == 'condition_1' && phase == 0) {
                phase = 3;
                question_seqNum_in_phase = 0;
                next_question_seqNum = 1;
                data.labels = [[], [], []];
                init_phase_3();
            } else {
                question_seqNum_in_phase = 0;
                phase += 1;
                // for phase 0, do not increase index of the next question
                if (phase != 0)
                    next_question_seqNum += 1;
                show_instructions();
            }
        }
    }

    else {
        question_seqNum_in_phase += 1;
        next_question_seqNum += 1;
        switch (phase) {
            case 1:
                init_phase_1();
                break;
            case 2:
                init_phase_2();
                break;
            case 3:
                init_phase_3();
                break;
            case 4:
                init_phase_4();
                break;
        }
    }
}



function show_instructions() {
    if (phase == 1 || phase == 3) {
        // DOM change
        document.querySelector(".quiz_body").innerHTML = rule_string;
        let title = document.querySelector("h1");
        // modify the title
        if (userData.quiz_type == "pilot_1") {
            title.innerHTML = `Instruction`;
        } else {
            if (phase == 1)
                title.innerHTML = 'Instruction for Phase I';
            else if (phase == 3)
                title.innerHTML = "Instruction for Phase II";
        }

        // modify the rules
        let rule = document.querySelector(".specific_rules");
        if (phase == 1) {
            if (userData.quiz_type == 'pilot_1')
                rule.innerHTML = section_rule_string[phase][userData.quiz_type];
            else
                rule.innerHTML = section_rule_string[phase]['default'];
        } else {
            rule.innerHTML = section_rule_string[phase];
        }

        // animation
        document.addEventListener("change", after_check);
        document.querySelector("button").addEventListener("click", () => {
            document.removeEventListener("change", after_check);
            switch (phase) {
                case 1:
                    init_phase_1();
                    break;
                case 3:
                    init_phase_3();
                    break;
            }
        });
    }

    else if (phase == 2)
        init_phase_2();

    else
        init_phase_4();

}



function choose_identity() {
    document.querySelector(".quiz_body").innerHTML = phase_0_body_string;
    adjust_button_size(document.querySelector(".button_checked"));
    let avatars_list = document.querySelector(".avatars_list");
    let pseudonyms_list = document.querySelector(".pseudonyms_list");
    for (let index = 0; index < pseudonyms.length; index++) {
        pseudonyms_list.innerHTML += `
            <div class="pseudonym_choice" id="pseudonym_${index}">
                <p>${pseudonyms[index]}</p>
            </div>
        `;
    }
    for (let index = 0; index < avatar_num; index++) {
        avatars_list.innerHTML += `
            <div class="avatar_choice" id="avatar_${index}">
                <img src="/static/avatars/avatar_${index}.svg" alt="avatar_${index}" >
            </div>
        `;
    }
    document.querySelector(".splits_wrap").addEventListener("click", click_pseudonym_or_avatar_handler);
    document.querySelector("button").addEventListener("click", wait_for_participants);
}



function wait_for_participants() {
    document.querySelector(".splits_wrap").removeEventListener("click", click_pseudonym_or_avatar_handler);
    document.querySelector("button").removeEventListener("click", wait_for_participants);
    document.querySelector(".quiz_body").innerHTML = `
        <div class="instruction instruction_phase_0">
            Please wait for other participants to join
            <span class="dots"></span>
        </div>
        <div class="identity_wrap wait_status"></div>
        <button type="button" class="button_big" disabled="true">Enter Quiz</button>
    `;
    transform_dots();
    let button = document.querySelector("button");
    adjust_button_size(button);

    // get pseudonyms
    let gender = pseudonym_chosen % 2;  // 0 is female, 1 is male
    let pseudonyms_to_choose = [];
    for (let index = gender; index < pseudonyms.length; index += 2) {
        pseudonyms_to_choose.push(index);
    }
    pseudonyms_to_choose.splice(pseudonyms_to_choose.indexOf(pseudonym_chosen), 1);
    let pseudonyms_index_chosen = randomly_choose(pseudonyms_to_choose, num_of_bots);
    pseudonyms_index_chosen.splice(human_index, 0, pseudonym_chosen);

    // get avatars
    let avatars_array = generate_sequence_array(0, avatar_num);
    avatars_array.splice(avatars_array.indexOf(avatar_chosen), 1);
    avatars_index_chosen = randomly_choose(avatars_array, num_of_bots);
    avatars_index_chosen.splice(human_index, 0, avatar_chosen);
    for (let index = 0; index < num_of_participants; index++) {
        pseudonyms_chosen.push(pseudonyms[pseudonyms_index_chosen[index]]);

        // store data
        data.identity_choices.push([pseudonyms_index_chosen[index], avatars_index_chosen[index]]);
    }

    // generate ideologies for bots
    data.ideologies = [generate_random_answer(-2, -1, 1), generate_random_answer(1, 2, 1)];
    data.ideologies.splice(human_index, 0, 0);
    wait_for_participants_to_join();
    document.addEventListener("timeup", all_timeup);
}



function all_timeup() {
    document.removeEventListener("timeup", all_timeup);
    document.querySelector(".instruction").textContent = ``;
    if (phase == 0) {
        let button = document.querySelector("button");
        button.disabled = false;
        button.addEventListener("click", enter_next);
    }
}



let phase_1_issue_index = randomly_choose(generate_sequence_array(0, phase_1_statements[0].length), phase_length[1][0]);
for (let index = phase_1_statements[0].length; index < phase_1_statements[0].length + phase_1_statements[1].length; index++)
    phase_1_issue_index.push(index);
let phase_1_issue_index_posted = {
    data: generate_zero_array(phase_1_issue_index.length)
};
let phase_1_preference_index = randomly_choose(generate_sequence_array(phase_1_statements[0].length + phase_1_statements[1].length, phase_1_statements[2].length), phase_length[1][2]);
let phase_1_preference_index_posted = {
    data: generate_zero_array(phase_1_preference_index.length)
}
let phase_1_distances = generate_zero_array(num_of_bots);



function init_phase_1() {
    // change DOM
    if (question_seqNum_in_phase == 0)
        document.querySelector(".quiz_body").innerHTML = phase_1_body_string;
    document.querySelector(".left").innerHTML = input_select_string;
    let question = document.querySelector(".question");
    let instruction = document.querySelector(".instruction");
    instruction.innerHTML = `
        Please select your choice and press
        <button type="button" class="button_small" disabled="true">Submit</button>`;
    add_identity_status();
    document.querySelectorAll(".status").forEach((status) => {
        status.innerHTML = loader_string;
    });
    each_answer.time_to_answer[human_index] = Date.now();

    // political issue question
    if (question_seqNum_in_phase < phase_length[1][0] + phase_length[1][1]) {
        // randomly pick a question that hasn't been chosen before
        index_of_question = randomly_choose(phase_1_issue_index, 1, phase_1_issue_index_posted)[0];
        question.innerHTML = `Q${next_question_seqNum}. Do you agree with the following statement: `;
        let statement_text = "";
        if (index_of_question < phase_1_statements[0].length)
            statement_text = phase_1_statements[0][index_of_question].statement;
        else
            statement_text = phase_1_statements[1][index_of_question - phase_1_statements[0].length].statement;
        document.querySelector(".statement").innerHTML = `"` + statement_text + `"`;
        add_ans_choices(['Agree √', 'Disagree X']);

        // for the ith question, pretend that the last participant is offline for some time
        if (question_seqNum_in_phase == phase_1_special_question_index) {
            let offlineBotIndex = (human_index == num_of_participants - 1) ? num_of_participants - 2 : num_of_participants - 1;
            let index_array = generate_bot_array(num_of_participants, human_index);
            index_array.splice(index_array.indexOf(offlineBotIndex), 1);
            start_bot_timers(index_array, 'issue');
        }

        // else, start timers for all bots
        else
            start_bot_timers(generate_bot_array(num_of_participants, human_index), "issue");
    }

    // preference questions
    else {
        document.querySelector(".statement").outerHTML = ``;
        index_of_question = randomly_choose(phase_1_preference_index, 1, phase_1_preference_index_posted)[0];
        let temp_length = phase_1_statements[0].length + phase_1_statements[1].length;
        question.innerHTML = `Q${next_question_seqNum}. ${phase_1_statements[2][index_of_question - temp_length].statement}`;
        add_ans_choices([
            phase_1_statements[2][index_of_question - temp_length].range[0],
            phase_1_statements[2][index_of_question - temp_length].range[1]
        ]);
        start_bot_timers(generate_bot_array(num_of_participants, human_index), "preference");
    }

    // animation of the flex
    index_of_choice_clicked = -1;
    let answer_choices = document.querySelector(".answer_choices");
    answer_choices.addEventListener("click", click_on_choice);
    document.querySelector("button").addEventListener("click", () => {
        answer_choices.removeEventListener("click", click_on_choice);
        answer_choices.style.opacity = style_configurations.finish_opacity;
        document.getElementById(`status_${human_index}`).innerHTML = ``;
        document.querySelector(".instruction").innerHTML = `
            Please wait for other participants to choose
            <span class="dots"></span>
        `;
        transform_dots();
        temp_answers = generate_answers_for_bots();
        temp_answers.splice(human_index, 0, index_of_choice_clicked);                               // track user answer
        each_answer.time_to_answer[human_index] = (Date.now() - start_time[human_index]) / 1000;    // track user time to answer

        // calculate distance, to be modified later
        if (question_seqNum_in_phase < phase_1_statements[0].length + phase_1_statements[1].length) {
            for (let index = 0; index < num_of_participants; index++)
                phase_1_distances[index] += Math.abs(temp_answers[human_index] - temp_answers[index]);
        }

        // for the special question, wait for the last participant after the human participant finishes answering.
        if (question_seqNum_in_phase == phase_1_special_question_index) {
            if (all_bots_timeup)
                bot_get_offline();
            else
                document.addEventListener("timeup", bot_get_offline);
        }
        else {
            if (all_bots_timeup)
                all_finish_answering();
            else
                document.addEventListener("timeup", all_finish_answering);
        }
    });
}



function bot_get_offline() {
    document.removeEventListener("timeup", bot_get_offline);
    let offlineBotIndex = (human_index == num_of_participants - 1) ? num_of_participants - 2 : num_of_participants - 1;
    let body = document.querySelector(".quiz_body");
    let offline_instruction = document.querySelector(".offline_instruction");
    setTimeout(() => {
        body.style.opacity = 0.1;
        offline_instruction.textContent = `
            One participant appears to be offline at the moment. Kindly wait a little while for their return. If they don't rejoin shortly, we will match another participant.
        `;
        setTimeout(() => {
            body.style.opacity = 1;
            offline_instruction.textContent = ``;
            document.getElementById(`status_${offlineBotIndex}`).innerHTML = ``;
            all_finish_answering();
        }, 5000);
    }, 10000);
}



function init_phase_2() {
    document.querySelector(".quiz_body").innerHTML = phase_1_body_string;
    document.querySelector(".left").innerHTML = phase_2_label_string;
    document.querySelector(".right").innerHTML = phase_1_answers_HTML;
    let wrap = document.querySelector(".labeling_wrap");
    add_identity_status();
    for (let index = 0; index < num_of_participants; index++)
        data.labels.push([]);
    let id = 0;
    document.querySelectorAll(".labels_pool").forEach((pool) => {
        for (let label_index = 0; label_index < labels.length; label_index++) {
            pool.innerHTML += `
                <input type="checkbox" id="${label_index}_${id}" name="labels" value="${labels[label_index]}">
                <label for="${label_index}_${id}">${labels[label_index]}</label>
                <br>
            `;
        }
        id++;
    });
    // clicking animation
    document.querySelector(".labeling_wrap").addEventListener("change", check_handler);
    // button check
    document.querySelector("button").addEventListener("click", () => {
        document.querySelector(".labeling_wrap").removeEventListener("change", check_handler);
        if (userData.quiz_type == 'condition_2' || userData.quiz_type == 'condition_3')
            attention_check();
        else
            enter_next();
    });
}



let num_of_type_phase_2 = [0, 0, 0];
let phase_3_statement_posted = generate_zero_array(phase_3_statements.length);
let phase_3_answer_times = generate_zero_array(num_of_participants);

function init_phase_3() {
    // change DOM
    document.querySelector(".quiz_body").innerHTML = phase_3_body_string;
    let question = document.querySelector(".question_phase_3");
    let statement = document.querySelector(".statement_phase_3");
    let instruction = document.querySelector(".instruction_phase_3");
    let slider = document.querySelector("input[type=range]");
    let input = document.querySelector(".input");
    add_identity_status();

    // choose a participant to answer first
    while (true) {
        answers_first = Math.floor(Math.random() * num_of_participants);
        // ensure that the user answers the first question first to make an example
        if (question_seqNum_in_phase == 0)
            answers_first = human_index;
        if (phase_3_answer_times[answers_first] < 2) {
            phase_3_answer_times[answers_first] += 1
            break;
        }
    }
    start_time[answers_first] = Date.now();
    if (answers_first == human_index) {
        instruction.innerHTML = `<b>You</b> are picked to answer this question first. Choose your answer by sliding the button on the scrollbar.`;
        instruction.style["text-align"] = "center";
    } else {
        instruction.innerHTML = `
            <b>${pseudonyms_chosen[answers_first]}</b> is picked to answer this question first.
        `;
        if (answers_first == 0)
            instruction.style["text-align"] = "left";
        else
            instruction.style["text-align"] = "right";
    }

    // DOM
    for (let index = 0; index < num_of_participants; index++) {
        if (index == answers_first) {
            document.getElementById(`status_${index}`).innerHTML = loader_string;
            document.getElementById(`profile_${index}`).classList.add("answering_now");
        } else {
            document.getElementById(`profile_${index}`).classList.add("not_answering_now");
        }
    }

    // select a statement that hasn't been chosen before, and meet '2 facts, 2 predictions, 2 issues'
    let statement_index = 0;
    let temp_statement = ``;
    while (true) {
        statement_index = Math.floor(Math.random() * phase_3_statements.length);
        if (phase_3_statement_posted[statement_index])
            continue;
        question.innerHTML = `Q${next_question_seqNum}. `;
        if (phase_3_statements[statement_index].type == "fact") {
            if (num_of_type_phase_2[0] <= 1) {
                num_of_type_phase_2[0] += 1;
                question.innerHTML += `Select your answer to the following question:`;
                break;
            }
        } else if (phase_3_statements[statement_index].type == "prediction") {
            if (num_of_type_phase_2[1] <= 1) {
                num_of_type_phase_2[1] += 1;
                question.innerHTML += `How likely do you think the following prediction is to be true?`;
                break;
            }
        } else {
            if (num_of_type_phase_2[2] <= 1) {
                num_of_type_phase_2[2] += 1;
                question.innerHTML += `Do you agree with the following statement?`;
                break;
            }
        }
    }
    index_of_question = statement_index;
    phase_3_statement_posted[statement_index] = true;
    temp_statement = `${phase_3_statements[statement_index].statement}`;
    let max_value = 0, min_value = 0, step = 0;
    if (phase_3_statements[index_of_question].type == 'fact') {
        min_value = phase_3_statements[index_of_question].range[0];
        max_value = phase_3_statements[index_of_question].range[1];
        step = phase_3_statements[index_of_question].step;
        slider.min = min_value;
        slider.max = max_value;
        slider.step = phase_3_statements[index_of_question].step;
        slider.value = (min_value + max_value) / 2;
    }

    let display_value = document.querySelector(".display_value");

    // if the user answers first
    if (answers_first == human_index) {
        pseudonyms_left = JSON.parse(JSON.stringify(pseudonyms_chosen));
        pseudonyms_left.splice(human_index, 1);

        if (phase_3_statements[index_of_question].type == "fact") {
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
        statement.textContent = `"` + temp_statement + `"`;
        generate_and_add_mark_texts();
        document.querySelector("button").addEventListener("click", () => {
            // get user's input
            each_answer.time_to_answer[human_index] = (Date.now() - start_time[human_index]) / 1000;
            for (let i = 0; i < num_of_participants; i++) {
                if (i == human_index) {
                    temp_answers[i] = parseFloat(slider.value);
                    if (phase_3_statements[index_of_question].type == 'fact')       // convert it to [-3, 3]
                        temp_answers[i] = -3 + (temp_answers[i] - min_value) / (max_value - min_value) * 6;
                } else 
                    temp_answers[i] = -100;
            }

            display_values();
            // change DOM
            slider.disabled = true;
            document.getElementById(`status_${human_index}`).innerHTML = ``;
            let profile = document.getElementById(`profile_${human_index}`);
            profile.classList.remove("answering_now");
            profile.classList.add("finish_answering");
            document.querySelector(".operation").innerHTML = ``;
            setTimeout(() => {
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
                    instruction.style["text-align"] = "left";
                    transform_dots();
                });
                bots_index = generate_bot_array(num_of_participants, human_index);
                for (const index of bots_index)
                    start_time[index] = Date.now();
                start_bot_timers(bots_index, "phase_3_question");
                document.addEventListener("timeup", all_finish_answering);
            }, time_configurations['lag'] * 1000)
        });
    }

    // if the bot answers first
    else {
        // change DOM
        statement.textContent = `You will see the statement after ${pseudonyms_chosen[answers_first]} submits her/his answer.`;
        statement.classList.add("concealed");
        input.classList.add("concealed");
        start_bot_timers([answers_first], "phase_3_question");
        document.addEventListener("timeup", after_bot_input_phase_3);
        slider.disabled = true;
        document.querySelector("button").style.opacity = '0';
    }
}



function after_bot_input_phase_3() {
    document.removeEventListener("timeup", after_bot_input_phase_3);
    all_bots_timeup = false;
    let instruction = document.querySelector(".instruction_phase_3");
    let statement = document.querySelector(".statement_phase_3");
    let input = document.querySelector(".input");
    let slider = document.querySelector("input[type=range]");
    let max_value = 0, min_value = 0, step = 0;
    if (phase_3_statements[index_of_question].type == 'fact') {
        min_value = phase_3_statements[index_of_question].range[0];
        max_value = phase_3_statements[index_of_question].range[1];
        step = phase_3_statements[index_of_question].step;
    }
    // register bot value
    temp_answers[answers_first] = generate_answers_for_bots();
    display_values();
    if (phase_3_statements[index_of_question].type == 'fact')       // convert it to [-3, 3]
        temp_answers[answers_first] = -3 + (temp_answers[answers_first] - min_value) / (max_value - min_value) * 6;

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

        statement.innerHTML = `"` + phase_3_statements[index_of_question]['statement'] + `"`;
        statement.classList.remove("concealed");
        input.classList.remove("concealed");
        generate_and_add_mark_texts();
        slider.disabled = false;
        document.querySelector("button").style.opacity = '1';

        // deal with instruction
        index_of_bots_left = generate_bot_array(num_of_participants, human_index);
        index_of_bots_left.splice(index_of_bots_left.indexOf(answers_first), 1);
        instruction.innerHTML = `
            Now it's <b>YOUR</b> and <b>${pseudonyms_chosen[index_of_bots_left[0]]}</b>'s turn to answer this question. Choose your answer by sliding the button on the scrollbar.
        `;
        instruction.style['text-align'] = 'left';
        if (phase_3_statements[index_of_question].type == "fact") {
            document.querySelector(".operation").innerHTML = `
                <span class="display_value"></span>
                <button type="button" disabled="true">Submit</button>
            `;
            let display_value = document.querySelector(".display_value");
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
        // start_bot_timers
        start_bot_timers(index_of_bots_left, "phase_3_question");
        start_time[human_index] = Date.now();

        // after the user clicks the button
        document.querySelector("button").addEventListener("click", () => {
            let profile = document.getElementById(`profile_${human_index}`);
            profile.classList.remove("answering_now");
            profile.classList.add("finish_answering");
            document.querySelector(".operation").innerHTML = ``;
            slider.disabled = true;
            for (let i = 0; i < num_of_participants; i++) {
                if (i == human_index) {
                    temp_answers[i] = parseFloat(slider.value);
                    if (phase_3_statements[index_of_question].type == 'fact')       // convert it to [-3, 3]
                        temp_answers[i] = -3 + (temp_answers[i] - min_value) / (max_value - min_value) * 6;
                }
                else if (i != answers_first)
                    temp_answers[i] = -100;
            }
            each_answer.time_to_answer[human_index] = (Date.now() - start_time[human_index]) / 1000;
            document.getElementById(`status_${human_index}`).innerHTML = ``;
            instruction.innerHTML = ``;
            if (all_bots_timeup)
                all_finish_answering();
            else
                document.addEventListener("timeup", all_finish_answering);
        });
    }, time_configurations['lag'] * 1000);
};


var evaluation_types = [];

function init_phase_4() {
    if (userData.quiz_type == "pilot_1")
        evaluation_types = ['ideology', 'competence', 'warmth'];
    else if (userData.quiz_type == 'condition_1')
        evaluation_types = ['ideology']

    // change DOM
    let body = document.querySelector(".quiz_body")
    body.innerHTML = phase_4_body_string;

    if (userData.quiz_type != "pilot_1")
        document.querySelector(".pilot_1_additional_questions").innerHTML = ``;

    document.getElementById("detection_name_0").innerHTML = pseudonyms_chosen[firstBotIndex];
    document.getElementById("detection_name_1").innerHTML = pseudonyms_chosen[lastBotIndex];
    document.getElementById("detection_img_0").src = `/static/avatars/avatar_${avatars_index_chosen[firstBotIndex]}.svg`;
    document.getElementById("detection_img_1").src = `/static/avatars/avatar_${avatars_index_chosen[lastBotIndex]}.svg`;

    for (let type of evaluation_types) {
        evaluation = document.getElementById(`evaluation_${type}`);
        for (let index = 0; index < num_of_participants; index++) {
            if (type == 'ideology' || index != human_index) {
                evaluation.innerHTML += `<div id="input_${type}_${index}" class="input input_phase_4">${slider_string_short}</div>`;
            }
        }
        if (type == 'ideology')
            add_mark_texts([`Liberal`, 'Somewhat<br>Liberal', `Neutral`, `Somewhat<br>Conservative`, `Conservative`], evaluation);
        else if (type == 'competence')
            add_mark_texts([`Very<br>Incompetent`, `Slightly<br>Incompetent`, `Neutral`, `Slightly<br>Competent`, `Very<br>Competent`], evaluation);
        else if (type == 'warmth')
            add_mark_texts([`Very<br>Unfriendly`, `Slightly<br>Unfriendly`, `Neutral`, `Slightly<br>Friendly`, `Very<br>Friendly`], evaluation);
    }
    display_values();
    document.querySelectorAll("input[type=range]").forEach((input) => {
        input.addEventListener('input', display_values);
    });
    document.querySelector(".detection_wrap").addEventListener("click", phase_4_click_handler);
    document.querySelector("button").addEventListener("click", enter_next);
}



function all_finish_answering() {
    document.removeEventListener("timeup", all_finish_answering);
    clearInterval(timer);
    all_bots_timeup = false;

    // a lag before "check your answers"
    setTimeout(() => {
        if (phase == 1) {
            document.querySelector(".instruction").innerHTML = `
                Please check your answers. When it's done, press
                <button type="button" class="button_small">OK</button>
            `;
            display_values();
        }

        else if (phase == 3) {
            let instruction = document.querySelector(".instruction_phase_3");
            instruction.innerHTML = `All of you have finished answering. Please enter the next question.`;
            instruction.style['text-align'] = 'left';
            document.querySelector(".operation").innerHTML = `<button type="button">Next Question</button>`;
        }

        document.querySelector("button").addEventListener('click', enter_next);
    }, time_configurations['lag'] * 1000);
}



function end_quiz() {
    data.total_time = (Date.now() - total_start_time) / 1000;
    document.querySelector(".quiz_body").innerHTML = end_quiz_string;
    if (userData.quiz_type == 'condition_1')
        document.querySelector(".bot_detection").innerHTML = ``;
    let button = document.querySelector("button");
    if (userData.participantId != '' && !idExisted) {
        button.disabled = false;
    }
    button.addEventListener('click', () => {
        // send data
        let reason = document.getElementById(`reason`);
        if (reason)
            data.reason = reason.value;
        console.log(data);
        console.log("Ready to send the data.");
        $.post({
            url: `/${userData.quiz_type}/quiz`,
            data: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            dataType: "json"
        })
        .done(function(response) {
            if (userData.quiz_type == 'pilot_1')
                window.location.href = "https://connect.cloudresearch.com/participant/project/f4ab53a4e1e34db0808d3aa985531f78/complete";
            else if (userData.quiz_type == 'pilot_2')
                window.location.href = "https://connect.cloudresearch.com/participant/project/27f7e6b19c1947fbb6596dbdec058264/complete";
            else if (userData.quiz_type == 'condition_1')
                window.location.href = "https://connect.cloudresearch.com/participant/project/99c5b40673e44da0afe2a36deb8b67c5/complete";
            else if (userData.quiz_type == 'condition_2')
                window.location.href = "https://connect.cloudresearch.com/participant/project/0cbdab43426f43b6824c5f54a33e2095/complete";
            else if (userData.quiz_type == 'condition_3')
                window.location.href = "https://connect.cloudresearch.com/participant/project/3679dedff7bf4c258a4eb15939a47712/complete";
        })
        .fail(function(error) {
            console.error("Error while sending data:", error);
        });
    });
}



function attention_check() {
    document.querySelector(".quiz_body").innerHTML = attention_check_string;
    document.querySelector(".attention_check").addEventListener("change", attention_check_click_handler);
    if (userData.quiz_type == 'pilot_1' || userData.quiz_type == 'condition_1') {
        document.querySelector("button").addEventListener("click",() => {
            document.querySelector(".attention_check").removeEventListener("change", attention_check_click_handler);
            end_quiz();
        });
    }
    else if (userData.quiz_type == 'condition_2' || userData.quiz_type == 'condition_3') {
        document.querySelector("button").addEventListener("click", () => {
              document.querySelector(".attention_check").removeEventListener("change", attention_check_click_handler);
              enter_next();
        });
    }
}


// choose_identity();

phase = 4;
avatars_index_chosen = [0, 1, 2];
data.ideologies = [-1, 0, 1];
data.labels = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
]
pseudonyms_chosen = ['Alice', 'Bob', 'Carol'];
init_phase_4();


// track inactivity, 2 minutes
const inactivityTimeout = 1000 * 120;
let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(inactivityPopup, inactivityTimeout);
}

function inactivityPopup() {
    alert("We noticed that you have been inactive for an extended period. To maintain the accuracy of the experiment, we kindly request you to restart the quiz and actively complete it. Your participation is essential, and we appreciate your cooperation. Thank you.");
    location.reload();
}

document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("mousedown", resetInactivityTimer);
document.addEventListener("keypress", resetInactivityTimer);

resetInactivityTimer();
