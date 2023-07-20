function generate_sequence_array(start, num) {
    let ret = [];
    for (let i = 0; i < num; i++) {
        ret.push(i + start);
    }
    return ret;
}


function generate_zero_array(num) {
    let ret = [];
    for (let i = 0; i < num; i++) {
        ret.push(0);
    }
    return ret;
}



var get_ranks = (arr) => arr.map((x, y, z) => z.filter((w) => w > x).length + 1);



function gaussianRandom(mean = 0, stdev = 1, lower_bound = null, upper_bound = null) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    let ret = z * stdev + mean;
    if (lower_bound)
        ret = Math.max(ret, lower_bound);
    if (upper_bound)
        ret = Math.min(ret, upper_bound);
    return ret;
}



function transform_dots() {
    let dots = document.querySelector(".dots");
    let base_t = new Date().getTime();
    timer = setInterval(() => {
        let temp_t = new Date().getTime();
        let seconds = Math.floor(((temp_t - base_t) % (1000 * 60)) / 1000);
        if (seconds % 4 == 0)
            dots.innerHTML = '';
        else if (seconds % 4 == 1)
            dots.innerHTML = '.';
        else if (seconds % 4 == 2)
            dots.innerHTML = '..';
        else
            dots.innerHTML = '...';
    }, 1000);
}



function generate_random_answer(min = -3, max = 3, step = 0.1) {
    let fix_num = Math.max(0, -Math.floor(Math.log10(step)));
    return parseFloat((Math.random() * (max - min) + min).toFixed(fix_num));
}



function after_check() {
    let checkboxes = document.querySelectorAll("input[type=checkbox]");
    let button = document.querySelector("button");
    let all_checked = true;
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked == false) {
            all_checked = false;
        }
    })
    if (all_checked) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}



function get_slider_value(eSlider) {
    let slider_value =  document.querySelector('#slider_value');
    if (slider_value) {
        if (phase != 3) {
            slider_value.innerHTML = parseFloat(eSlider.value).toFixed(1);
        }
        else {
            let step = phase_3_statements[index_of_question].step;
            let fix_num = Math.max(-Math.floor(Math.log10(step)), 0);
            if (phase_3_statements[index_of_question].type != 'fact')
                slider_value.innerHTML = parseFloat(eSlider.value).toFixed(2);
            else {
                if (phase_3_statements[index_of_question].percentage)
                    slider_value.innerHTML = `${parseFloat(eSlider.value * 100).toFixed(Math.max(fix_num - 2, 0))}%`;
                else
                    slider_value.innerHTML = parseFloat(eSlider.value).toFixed(fix_num);
            }
        }
    }
    if (phase != 4)
        document.querySelector("button").disabled = false;
}



function generate_form(name_list) {
    let ret = `<form class="form_generated"><div class="radios">`;
    let index = 0;
    for (let name of name_list) {
        if (index == 0)
            ret += `<input type="radio" id="radio_${index}" name="unknown" value="${index}" checked/>`;
        else
        ret += `<input type="radio" id="radio_${index}" name="unknown" value="${index}" />`;
        ret += `<label for="radio_${index}">${name}</label>`;
        index += 1;
    }
    ret += `</div></form>`;
    return ret;
}



function add_mark_texts(name_list, area = document) {
    let all_marks = area.querySelectorAll(".mark_texts");
    all_marks.forEach((marks) => {
        if (name_list.length == 2)
            name_list = [name_list[0], null, null, 'Neutral', null, null, name_list[1]];
        let index = 0;
        for (let name of name_list) {
            if (name) {
                let len = 0;
                for (let char of name) {
                    if (char != '<')
                        len++;
                    else
                        break;
                }
                let dis_from_left = 10 + 97 * index - len * 2.4;
                marks.innerHTML += `<div class="mark_text" id="text_${index}" style="left: ${dis_from_left}px">${name}</div>`;
            }
            index++;
        }
    });
}



function generate_and_add_mark_texts() {
    let index = index_of_question;
    if (phase_3_statements[index].type == 'issue')
        add_mark_texts(mark_texts.issue);
    else if (phase_3_statements[index].type == 'prediction')
        add_mark_texts(mark_texts.prediction);
    else {
        let min = phase_3_statements[index].range[0];
        let max = phase_3_statements[index].range[1];
        let mark_texts = [];
        for (let i = 0; i <= 6; i++) {
            let number = min + (max - min) / 6 * i;
            if (number >= 1)
                mark_texts.push(`${number}`);
            else {
                mark_texts.push(`${(number * 100).toFixed(1)}%`);
            }
        }
        add_mark_texts(mark_texts);
    }
}



function display_values() {
    if (phase == 1) {
        for (let index = 0; index < num_of_participants; index++) {
            let ans = '';
            if (index_of_question < phase_1_statements[0].length + phase_1_statements[1].length) {
                if (temp_answers[index] == 1)
                    ans = style_configurations.disagree;
                else
                    ans = style_configurations.agree;
            } else {
                ans = phase_1_statements[2][index_of_question - phase_1_statements[0].length - phase_1_statements[1].length].range[temp_answers[index]];
            }
            
            if (temp_answers[index] != temp_answers[0]) {
                document.getElementById(`profile_${index}`).innerHTML += `
                    <div class="bubble_white" id="bubble_${index}">
                        ${ans}
                    </div>
                `;
            } else {
                document.getElementById(`profile_${index}`).innerHTML += `
                    <div class="bubble" id="bubble_${index}">
                        ${ans}
                    </div>
                `;
            }
        }
    }
    
    else if (phase == 3) {
        let value = temp_answers[answers_first];
        let min = -3, max = 3;
        
        // slider
        if (answers_first != 0) {
            if (phase_3_statements[index_of_question].type == 'fact') {
                min = phase_3_statements[index_of_question].range[0];
                max = phase_3_statements[index_of_question].range[1];
            }
            let dis_from_left = 10 + 97 * (value - min) / ((max - min) / 6);
            document.querySelector(".answers_mark").innerHTML += `
                <div>
                    <div class="answer_scale" style="left: ${dis_from_left}px"></div>
                    <img class="img_mark" style="left: ${dis_from_left - 19}px" src="/static/avatar_${avatars_index_chosen[answers_first]}.svg">
                </div>
            `;
        }
    }

    else if (phase == 4) {
        let min = -3, max = 3;
        const evaluation_types = ['ideology', 'competence', 'warmth'];
        for (let type of evaluation_types) {
            let start_index = 1;
            if (type == "ideology")
                start_index = 0;
            for (let index = start_index; index < num_of_participants; index++) {
                let input = document.querySelector(`#input_${type}_${index}`);
                let value = input.querySelector(`input[type=range]`).value;
                let dis_from_left = -3 + 97 * (value - min) / ((max - min) / 6);
                let name = pseudonyms_chosen[index];
                if (index == 0)
                    name += '<b>(You)</b>';
                input.querySelector(".answers_mark").innerHTML = `
                    <div>
                        <div class="avatar_scale_phase_4" style="left: ${dis_from_left}px">
                            <img src="/static/avatars/avatar_${avatars_index_chosen[index]}.svg" />
                        </div>
                        <div class="pseudonym_scale_phase_4" style="left: ${dis_from_left + 31}px">${name}</div>
                    </div>
                `;
            }
        }
    }
}




function track_answers() {
    let table = document.querySelector(".table_answers");
    let index = question_seqNum_in_phase;

    // for the first one, add the header of the table
    if (index == 0) {
        let HTML = `<tr><th class="th_summary"></th>`;
        for (let index = 0; index < num_of_participants; index ++) {
            if (index == 0)
                HTML += `
                    <th class="th_name">
                        ${pseudonyms_chosen[index]}
                        <br>
                        <span style="font-size: 10px">(You)</span>
                    </th>
                `;
            else
                HTML += `<th class="th_name">${pseudonyms_chosen[index]}</th>`;
        }
        HTML +=`<tr>`;
        table.innerHTML += HTML;
    }
    let summary_text = "";
    if (index_of_question < phase_1_statements[0].length)
        summary_text = phase_1_statements[0][index_of_question]['summary'];
    else if (index_of_question < phase_1_statements[0].length + phase_1_statements[1].length)
        summary_text = phase_1_statements[1][index_of_question - phase_1_statements[0].length]['summary'];
    else
        summary_text = phase_1_statements[2][index_of_question - phase_1_statements[0].length - phase_1_statements[1].length]['summary']
    table.innerHTML += `
        <tr>
            <td class="td_summary">
                <span class="answer_title">
                    Q${next_question_seqNum}.
                </span>
                <span class="summary">
                    ${summary_text}
                </span>
            </td>
            <td class="td_answer" id=ans${index}_0></td>
            <td class="td_answer" id=ans${index}_1></td>
            <td class="td_answer" id=ans${index}_2></td>
        </tr>
        <tr class="tr_margin"></tr>
    `;
    for (let i = 0; i < num_of_participants; i++) {
        let block = document.getElementById(`ans${index}_${i}`);
        if (temp_answers[i] == 0)
            block.innerHTML = `√`;
        else
            block.innerHTML = `X`;
        // if the answer is the same as the user's
        if (temp_answers[i] == temp_answers[0])
            block.style['background-color'] = 'lightgrey';
    }
}



function generate_answers_for_bots() {
    if (phase == 1) {
        let ret = [];
        // issue question
        if (index_of_question < phase_1_statements[0].length) {
            // default answer of B is agree
            let left_answer = 1;
            if (phase_1_statements[0][index_of_question].left_attitude)
                left_answer = 0;
            let rand_num = Math.random();
            ret.push(left_answer, 1 - left_answer);
        }

        // extreme question
        else if (index_of_question >= phase_1_statements[0].length && index_of_question < phase_1_statements[0].length + phase_1_statements[1].length) {
            
            // default answer of B is agree
            let left_answer = 1;
            if (phase_1_statements[1][index_of_question - phase_1_statements[0].length].left_attitude)
                left_answer = 0;

            // B's answer
            switch (data.ideologies[1]) {
                case -1:
                    ret.push(1);
                    break;

                case -2:
                    ret.push(left_answer);
                    break;

            }

            // C's answer
            switch (data.ideologies[2]) {
                case 1:
                    ret.push(1);
                    break;

                case 2:
                    ret.push(1 - left_answer);
                    break;
            }
        }

        // preference question
        else {
            let user_value = temp_answers[0];
            let ranks = get_ranks(phase_1_distances);
            for (let index = 0; index < num_of_bots; index++) {
                // from the farthest to the nearest
                if (ranks[index] == 1) {
                    ret.push(user_value);
                } else if (ranks[index] == 2) {
                    ret.push(1 - user_value);
                }
            }
        }
        return ret;
    }

    else if (phase == 3) {
        let max = 3, min = -3, step = 0.1;
        if (phase_3_statements[index_of_question].type == 'fact') {
            max = phase_3_statements[index_of_question].range[1];
            min = phase_3_statements[index_of_question].range[0];
            step = phase_3_statements[index_of_question].step;
        }
        return generate_random_answer(min, max, step);
    }
}



function add_ans_choices(name_list) {
    let index = 0;
    let flex = document.querySelector(".answer_choices");
    for (let name of name_list) {
        flex.innerHTML += `
            <div class="answer_choice" id="choice_${index}">
                <p>${name}</p>
            </div>
        `;
        index++;
    }
}



let index_of_choice_clicked = -1;

function click_on_choice(e) {
    let choices = document.querySelectorAll(".answer_choice")
    choices.forEach((choice) => {
        // the choice should contain e.target
        if (choice.contains(e.target)) {
            let id = parseInt(choice.id.replace("choice_", ""));
            // no choice is clicked yet
            if (index_of_choice_clicked < 0) {
                toggle_choice(choice, true);
                index_of_choice_clicked = id;
            }
            // else, unclick the already clicked one
            else {
                // unclick
                let choice_clicked = document.getElementById(`choice_${index_of_choice_clicked}`);
                toggle_choice(choice_clicked, false);
                // click itself
                if (id == index_of_choice_clicked)
                    index_of_choice_clicked = -1;
                // click other choices
                else {
                    toggle_choice(choice, true);
                    index_of_choice_clicked = id;
                }
            }
        }
        let button = document.querySelector("button");
        if (index_of_choice_clicked >= 0)
            button.disabled = false;
        else
            button.disabled = true;
    });
}



function toggle_choice(choice, click_or_unclick) {
    if (phase == 0) {
        if (click_or_unclick)
            choice.style.outline = style_configurations.clicked_identity_outline;
        else
            choice.style.removeProperty('outline');
    }

    else if (phase == 1) {
        if (click_or_unclick)
            choice.style['background-color'] = style_configurations.clicked_choice_background_color;
        else
            choice.style.removeProperty('background-color');
    }
}



function randomly_choose(choices, num_to_choose, is_chosen) {
    let ret = [];
    if (is_chosen == undefined) {
        is_chosen = generate_zero_array(choices.length);
        while (ret.length < num_to_choose) {
            let temp_index = generate_random_answer(0, choices.length, 1);
            if (is_chosen[temp_index] == 0) {
                is_chosen[temp_index] = 1;
                ret.push(choices[temp_index]);
            }
        }
    } else {
        while (ret.length < num_to_choose) {
            let temp_index = generate_random_answer(0, choices.length, 1);
            if (is_chosen.data[temp_index] == 0) {
                is_chosen.data[temp_index] = 1;
                ret.push(choices[temp_index]);
            }
        }
    }

    return ret;
}



function start_bot_timers(index_list, type) {
    let wait_time = [];
    let last_time = 0, index_of_last_one = 0;
    let temp_time = 0;
    for (index of index_list) {
        if (test_mode)
            temp_time = 1;
        else
            temp_time = time_configurations[type][0] + Math.random() * time_configurations[type][1];
            
        wait_time.push(temp_time);

        // if it's the last timer, then send the timeup event
        if (temp_time > last_time) {
            last_time = temp_time;
            index_of_last_one = index;
        }
    }
    let sequenced_index = 0;
    for (index of index_list) {
        setTimeout(bot_timeup, wait_time[sequenced_index] * 1000, index, index_of_last_one);
        sequenced_index += 1;
    }
}



function bot_timeup(index, last_bot_index) {
    let status = document.getElementById(`status_${index}`);
    if (status) {
        if (phase == 1 || phase == 3)
            status.innerHTML = ``;
        else
            status.innerHTML = tickmark_string;
    }

    if (phase == 0) {
        let name = pseudonyms_chosen[index];
        document.getElementById(`profile_${index}`).innerHTML = `
            <img src="/static/avatars/avatar_${avatars_index_chosen[index]}.svg" class="img_big" >
            ${name}
            <div id="status_${index}" class="status">${tickmark_string}</div>
        `;
    } else if (phase == 3) {
        let profile = document.getElementById(`profile_${index}`);
        profile.classList.remove("answering_now");
        profile.classList.add("finish_answering");
    }

    each_answer.time_to_answer[index] = (Date.now() - start_time[index]) / 1000;

    if (index == last_bot_index) {
        all_bots_timeup = true;
        document.dispatchEvent(timeupEvent);
    }
}



function add_identity_status() {
    let status = document.querySelector(".identity_wrap");
    for (let index = 0; index < num_of_participants; index ++) {
        let name = pseudonyms_chosen[index];
    
        // add br for user's name
        if (index == 0) {
            if (phase == 4) {
                continue;
            } else if (phase == 2 || phase == 0) {
                name += ' <b>(You)</b>';
            } else
                name += '<br><b>(You)</b>';
        }

        if (phase == 0) {
            if (index == 0) {
                status.innerHTML += `
                    <div class="profile_waiting" id="profile_${index}">
                        <img src="/static/avatars/avatar_${avatars_index_chosen[0]}.svg" >
                        ${name}
                        <div id="status_${index}" class="status">${tickmark_string}</span>
                    </div>
                `;
            } else {
                status.innerHTML += `
                    <div class="profile_waiting" id="profile_${index}">
                        <img src="/static/avatars/avatar_default.png" >
                        <div id="status_${index}" class="status">${loader_string}</span>
                    </div>
                `;
            }

        }
  
        else if (phase == 1) {
            status.innerHTML += `
                <div id="profile_${index}" class="profile_answering">
                    <div class="identity_part">
                        <img src="/static/avatars/avatar_${avatars_index_chosen[index]}.svg" >
                        ${name}
                    </div>
                    <div class="labels_part"></div>
                    <div class="status" id="status_${index}"></div>
                </div>
            `;
        }

        else if (phase == 2) {
            status.innerHTML += `
                <div id="profile_${index}" class="profile_labeling">
                    <div class="identity_part_phase_2">
                        <div class="image_part_phase_2">
                            <img src="/static/avatars/avatar_${avatars_index_chosen[index]}.svg" >
                        </div>
                        ${name}
                    </div>
                    <div class="labels_pool" id="pool_${index}">
                    </div>
                </div>
            `;
        }
        
        else if (phase == 3) {
            status.innerHTML += `
                <div id="profile_${index}" class="profile_with_labels profile_labeling">
                    <div class="profile_content">
                        <div class="identity_part">
                            <img src="/static/avatars/avatar_${avatars_index_chosen[index]}.svg" >
                            ${name}
                        </div>
                        <div class="labels_part" id="list_${index}">
                            <ul class="labels_list"></ul>
                            <div class="status" id="status_${index}"></div>
                        </div>
                    </div>
                </div>
            `;
            let list = document.querySelector(`#list_${index} > ul`);
            for (let label_id of data.labels[index])
                list.innerHTML += `<li>${labels[label_id]}</li>`;
        }
    }
}



function display_labels_chosen() {
    let labels_lists = document.querySelectorAll(".labels_list");
    labels_lists.forEach((labels_list) => {
        labels_list.innerHTML = ``;
    });
    let index = 0;
    labels_lists.forEach((labels_list) => {
        for (let label of data.labels[index]) {
            labels_list.innerHTML += `
                <li class="label_chosen" id="label_${labels.indexOf(label)}" draggable="false">
                    ${label}
                </li>`;
        }
        index++;
    });
}



function check_handler(event) {
    let button = document.querySelector("button");
    let splits = event.target.id.split('_');
    let label_id = parseInt(splits[0]), participant_id = parseInt(splits[1]);

    // if the action is unclicking
    if (!event.target.checked) {
        data.labels[participant_id].splice(data.labels[participant_id].indexOf(label_id), 1);
        if (data.labels[participant_id].length == 0)
            button.disabled = true;
    }
    
    // if the action is clicking
    else {
        if (data.labels[participant_id].length == 3)
            event.target.checked = false;
        else {
            data.labels[participant_id].push(label_id);
            let flag = true;
            for (let index = 0; index < num_of_participants; index++) {
                if (data.labels[index].length == 0) {
                    flag = false;
                    break;
                }
            }
            if (flag)
                button.disabled = false;
        }
    }
}



function phase_4_click_handler() {
    let flag = true;
    document.querySelectorAll("select").forEach((select) => {
        if (select.value == "none") {
            flag = false;
        }
    });
    if (flag) {
        flag = false;
        document.querySelectorAll("input[type=radio]").forEach((radio) => {
            if (radio.checked)
                flag = true;
        })
        if (flag)
            document.querySelector("button").disabled = false;
    }
}


let attention_passed = false;

function attention_check_click_handler() {
    let answers = [-1, -1, -1];
    const names = ['question_1', 'question_2', 'question_3'];
    let index_of_question = 0
    for (let name of names) {
        inputs = document.querySelectorAll(`input[name="${name}"]`);
        index_of_choice = 0;
        for (let input of inputs) {
            if (input.checked) {
                answers[index_of_question] = index_of_choice;
            }
            index_of_choice += 1;
        }
        index_of_question += 1;
    }
    if (answers[0] != -1 && answers[1] != -1 && answers[2] != -1) {
        document.querySelector("button").disabled = false;
    }
    if (answers[0] == 3 && answers[1] == 1 && answers[2] == 3) {
        attention_passed = true;
    }
    data.attention_passed = attention_passed;
}



let pseudonym_chosen = -1;
let avatar_chosen = -1;

function click_pseudonym_or_avatar_handler(event) {
    
    let name_displayed = document.querySelector(".identity_chosen > span");
    let avatar_displayed = document.querySelector(".identity_chosen > img");

    document.querySelectorAll(".pseudonym_choice").forEach((choice) => {
        if (choice.contains(event.target)) {
            let id = parseInt(choice.id.replace("pseudonym_", ""));
            if (pseudonym_chosen == -1) {
                pseudonym_chosen = id;
                choice.style['background-color'] = 'grey';
                name_displayed.textContent = pseudonyms[pseudonym_chosen];
                name_displayed.style.opacity = 1;
            } else if (id == pseudonym_chosen) {
                pseudonym_chosen = -1;
                choice.style.removeProperty("background-color");
                name_displayed.style.opacity = 0;
            } else {
                document.getElementById(`pseudonym_${pseudonym_chosen}`).style.removeProperty("background-color");
                choice.style['background-color'] = 'grey';
                pseudonym_chosen = id;
                name_displayed.textContent = pseudonyms[pseudonym_chosen];
            }
        }
    });

    document.querySelectorAll(".avatar_choice").forEach((choice) => {
        if (choice.contains(event.target)) {
            let id = parseInt(choice.id.replace("avatar_", ""));
            // no choice is clicked yet
            if (avatar_chosen == -1) {
                avatar_chosen = id;
                choice.style['outline'] = '3px solid black';
                avatar_displayed.src = `/static/avatars/avatar_${id}.svg`;
            } else if (id == avatar_chosen) {
                avatar_chosen = -1;
                choice.style.removeProperty("outline");
                avatar_displayed.src = `/static/avatars/avatar_default.png`;
            } else {
                document.getElementById(`avatar_${avatar_chosen}`).style.removeProperty("outline");
                choice.style['outline'] = '3px solid black';
                avatar_chosen = id;
                avatar_displayed.src = `/static/avatars/avatar_${id}.svg`;
            }
        }
    });

    let button = document.querySelector(".button_checked");
    if (avatar_chosen != -1 && pseudonym_chosen != -1) {
        let cb_checked = document.querySelector("input[type=checkbox]").checked;
        if (cb_checked)
            button.disabled = false;
        else
            button.disabled = true;
    } else {
        button.disabled = true;
    }
}



function adjust_button_size(button) {
    let length = parseFloat(button.textContent.length);
    button.style.width = `${18 * length * 0.5 + 20}px`;
}



function get_phase_length(phase) {
    if (typeof(phase_length[phase]) == "number")
        return phase_length[phase];
    else {
        let sum = 0;
        if (userData.quiz_type == "pilot_1" || userData.quiz_type == 'condition_2') {
            sum = phase_length[phase][0] + phase_length[phase][1]
        } else {
            for (let len of phase_length[phase])
                sum += len;
        }
        return sum; 
    }
}



function fit_text(text) {
    var width = text.offsetWidth;
    var textWidth = text.scrollWidth;
    var fontSize = width / textWidth * parseFloat(window.getComputedStyle(text).fontSize);
    text.style.fontSize = fontSize + "px";
}