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

const phase_2_starting_question_index = 12;//从第12个题号开始起始索引
const instruction_background_color = "#d3d3d354";

/**phase_2_orders: 这是一个对象，包含三个数组属性。

set_order: 一个空数组。
question_order: 一个空数组。
participant_order: 一个包含四个元素的数组，其中有两个元素是null，一个元素是1。
set_index_to_name: 这是一个对象，它将数字索引映射到字符串名称。例如，数字0对应字符串"fact"，数字1对应字符串"prediction"等。

phase_2_starting_question_index: 这是一个常量，其值为12。它可能表示第二阶段问题的起始索引。

instruction_background_color: 这是一个颜色字符串，表示某种指令或背景的颜色。其值为"#d3d3d354"，这是一个带有透明度的灰色。 */
// 1 为自己 出现概率20%，2为blair 出现概率40%, 0为alex 出现概率40%
function getRandomUser() {
    const userRandomArray = [0,0,1,0,2,2,1,0,2,2];
    const r = parseInt(Math.random() * 10);
    return userRandomArray[r];
}
// 获取一个随机值，一位小数，且小数位为偶数
function getRandomValue(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let value = Math.random() * (max - min) + min;
    value = Math.round(value * 10) / 10;
    if (value * 10 % 2 === 0) return value;
    return Math.round(value * 10 + 1) / 10;
}

function getOpinionByValue(val) {
    if (val > 1 && val <= 2) {
        return 'strongly agree';
    } else if (val > 0 && val <= 1) {
        return 'somewhat agree';
    } else if (val >= -1 && val < 0) {
        return 'somewhat disagree';
    } else if (val => -2 && val < -1) {
        return  'strongly disagree';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
/**shuffleArray(array): 这是一个函数，用于随机打乱传入的数组。

函数使用Fisher-Yates洗牌算法来打乱数组。
for循环从数组的最后一个元素开始，逐步向前遍历。
在每次迭代中，它都会生成一个随机数j，该数在0到当前索引i（包括i）之间。
然后，它使用ES6的解构赋值来交换array[i]和array[j]的值。
最后，函数返回打乱后的数组。 */

function determine_phase_3_order() {
    const num_of_sets = 1;
    phase_2_orders.set_order = [0, 1, 2]; // 启用的是第三个问题组
    for (const set_index of phase_2_orders.set_order) {
        const key = set_index_to_name[set_index];
        let enabled_length = 0;
        phase_2_statements[key].forEach((question_info) => {
            if (question_info.enabled) { enabled_length += 1; }
        });

        const enabledQuestions = phase_2_statements[key].filter(question_info => question_info.enabled);
        const enabledQuestionsIndexes = enabledQuestions.map(question_info => question_info.index);

        const shuffledQuestions = shuffleArray(enabledQuestionsIndexes);
        phase_2_orders.question_order.push(shuffledQuestions);
    }
    phase_2_orders.participant_order = [null, null, null];
}

determine_phase_3_order();

/**设置变量:

num_of_sets 被设置为 1，但原本应该是通过 phase_2_statements 对象的键的数量来确定的。由于 phase_2_statements 在这段代码中没有定义，我们假设它可能是一个在其他地方定义的变量，包含了一系列的陈述或问题集。
phase_2_orders.set_order 被硬编码为 [2]，这意味着它只考虑索引为 2 的集合。
处理每个集合:

函数遍历 phase_2_orders.set_order 中的每个 set_index。
使用 set_index_to_name 对象将 set_index 转换为对应的名称（例如 "fact"、"prediction" 等）。
对 phase_2_statements[key] 中的每个 question_info 进行遍历，计算启用的问题的数量（enabled_length）。
使用 filter 方法筛选出启用的问题，并获取它们的索引。
如果启用的问题索引数量不等于 5，则输出一个错误消息。
将启用的问题索引随机打乱后，添加到 phase_2_orders.question_order 数组中。
确定参与者顺序:

生成一个介于 0 和 1 之间的随机数 randomNumber。
如果 randomNumber 小于 0.5，则将其设置为 0，否则设置为 2。
更新 phase_2_orders.participant_order 为 [randomNumber, 1, 2 - randomNumber, randomNumber]。
总结
这个函数的主要目的是：

根据给定的 set_index（这里硬编码为 2），确定哪些问题是启用的，并将它们的索引随机打乱后添加到 question_order 中。
确保启用的问题索引数量是 5，如果不是，则输出错误。
随机确定一个参与者顺序，其中某些位置是固定的（例如第二个位置总是 1），而其他位置则基于生成的随机数。 */


let selectedOption; // 记录当前选中的选项


function toggle_image_display(question_index) {//对选图片类的问题进行问答
    //toggle_image_display 函数根据当前图片是否为默认图片来切换显示。如果两个图片都是默认图片，则显示与 question_index 相关的两张图片；
    //否则，将两个图片都重置为默认图片。
    //这种切换功能可能用于某些交互式问答或选择场景中，其中用户可以通过查看不同的图片来做出选择或回答问题。
    const leftPicture = document.querySelector("#left_picture");
    const rightPicture = document.querySelector("#right_picture");
    //使用 document.querySelector 方法分别获取页面上 ID 为 left_picture 和 right_picture 的图片元素，并将它们分别赋值给 leftPicture 和 rightPicture 常量。
    const default_src = `/static/data/design_pictures/default.jpg`;
    //定义一个常量 default_src，它存储了默认图片的路径
    if (leftPicture.src.includes(default_src) && rightPicture.src.includes(default_src)) {
        leftPicture.src = `/static/data/design_pictures/${question_index}_a.jpg`;
        rightPicture.src = `/static/data/design_pictures/${question_index}_b.jpg`;
    } else {
        leftPicture.src = default_src;
        rightPicture.src = default_src;
    }
    /**首先，检查 leftPicture 和 rightPicture 的 src 属性是否都包含 default_src。如果都包含，则执行以下操作：

将 leftPicture 的 src 属性设置为 /static/data/design_pictures/${question_index}_a.jpg。这里使用了模板字符串，将 question_index 变量的值插入到路径中，从而生成具体的图片路径。
将 rightPicture 的 src 属性设置为 /static/data/design_pictures/${question_index}_b.jpg，同样使用了模板字符串。
如果 leftPicture 或 rightPicture 的 src 属性不包含 default_src，则执行以下操作：

将 leftPicture 和 rightPicture 的 src 属性都重置为 default_src，即显示默认图片 */
}

let statement_text;
let choice1 = -1, choice3 = -1;
let overlap_1_3, overlap_1_2, overlap_2_3, overlap_1_2_3;
const bias_for_2_arrows_left = "-30%";
const bias_for_2_arrows_right = "30%";
const bias_for_3_arrows_left = "-60%";
const bias_for_3_arrows_right = "60%";
const bias_for_1line = "80px", bias_for_2line = "95px";
const bias_for_second_name = "65px";

function test_phase_3() {
    test_mode = true;
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
    phase_2_orders.participant_order = [2, 1, 1, 1];
    next_question_seqNum = phase_2_starting_question_index;
    split_answers = [[-2, -2, -2]];     // ideology labeled after Phase I
    init_phase_3();
}


function init_phase_3() {
    phase = 3;
    document.querySelector(".quiz_body").innerHTML = `
        <div class="split" id="left_part_phase_II">
            <div id="left_content_phase_II">
                <div class="instruction_phase_3"></div>
                <div id="identity_wrap_phase_II"></div>
            </div>
        </div>

        <div class="split" id="right_part_phase_II">
            <div id="right_content_phase_II">
                <div class="container">
                    <div class="left-side">
<!--        <div class="padding_title" id="ideology_spectrum"></div>-->
                            <div class="info-text">
                                <p><b>For you information</b>:</p>
                                <p class="question-infomation"> From our database, we randomly sampled 20 previous participants who gave exactly the answers as Alex to the questions in Phase 1. We call them the Alex group.</p>
                                <p> The positions of Alex’s, Blair’s and your ideologies are displayed in the following ideology spectrum:</p>
                            </div>
                        <div>
                            ${phase_3_range_string}
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="right-side" id="right_part_phase_II">
                        <div id="right_content_phase_II">
                            <div class="question_phase_3"></div>
                            <br><br>
                            <div class="statement_phase_3"></div>
                            <div id="answer_area_phase_II">
                                <div id="operations">
                                    <div id="options_container">
                                        <div class="option-with-profile" id="option-with-profile-0">
                                            <button class="option-button" onclick="selectOption(0)" id="left_option">Option 1</button>
                                            <div class="group-info" id="group-info-left"></div>
                                        </div>
                                        <div class="option-with-profile" id="option-with-profile-1">
                                            <button class="option-button" onclick="selectOption(1)" id="right_option">Option 2</button>
                                            <div class="group-info" id="group-info-right"></div>
                                        </div>
                                    </div>
                                    <div class="additional-wrapper"></div>
                                    <div style="display: flex; justify-content: flex-end;">
                                        <button type="button" class="submit-button" id="submit_button_phase2" disabled="true" style="margin: 0">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
    `;

    const question = document.querySelector(".question_phase_3");
    const statement = document.querySelector(".statement_phase_3");

    const left_option = document.querySelector("#left_option");
    const right_option = document.querySelector("#right_option");

    const instruction = document.querySelector(".instruction_phase_3");
    const instruction_right = document.getElementById("instruction_right_phase_II");
    const answer_area = document.querySelector("#answer_area_phase_II");
    //这些行使用document.querySelector和document.getElementById方法来获取页面上的特定元素，并将它们存储在常量中，以便稍后在代码中引用。

    // 根据当前问题计数，计算处于哪个组中
    let set_num = 0;
    let question_num = 0;
    let question_count = 0;
    for (let i=0; i<phase_2_orders.question_order.length; i++) {
        question_count += phase_2_orders.question_order[i].length;
        if (question_count >= question_seqNum_in_phase + 1) {
            set_num = i;
            question_num =  phase_2_orders.question_order[i].length - (question_count - question_seqNum_in_phase);
            break;
        }
    }
    const set_index = phase_2_orders.set_order[set_num];
    const question_index = phase_2_orders.question_order[set_num][question_num];
    const question_type = set_index_to_name[set_index];
    //这些行计算当前问题的集合编号（set_num）和问题编号（question_num）。
    //然后，它们从phase_2_orders对象中检索设置和问题索引，并从set_index_to_name对象中检索问题类型。

    const additionalQuestionHTML = `
            <div class="additional-question-container">
                <p sytle="line-height: 1.8"><strong>Additional question:</strong> Do you think your opinion reflects the typical standpoint of people with similar ideologies to yours?</p>
                <div id="additional-options" style="display: flex; align-items: center; margin-top: 5px;">
                    <!-- <button id="yes_button" style="flex-grow: 1; margin-right: 10px;" class="option-button" onclick="selectAdditionalOption('yes')">Yes, they are ideology driven.</button> -->
                    <!-- <button id="no_button" style="flex-grow: 1; margin-right: 10px;" class="option-button" onclick="selectAdditionalOption('no')">No, they are not.</button> -->
                    <label style="display: flex; align-items: center; font-weight: bold; margin: 0 50px 0 0;"><input id="yes_button" type="radio" name="additional-options" value="yes" style="width: 20px; height: 20px;  margin: 0 10px 0 0;" />YES</label>
                    <label style="display: flex; align-items: center; font-weight: bold; margin: 0 30px 0 0"><input id="no_button" type="radio" name="additional-options" value="no" style="width: 20px; height: 20px; margin: 0 10px 0 0;" />NO</label>
                </div>
            </div>
        `;


    if (next_question_seqNum === 12) {
        document.querySelector(".additional-wrapper").insertAdjacentHTML('beforeend', additionalQuestionHTML);

        data.driven_answers = [null];
            // 添加事件监听器来捕捉按钮点击事件
        document.getElementById('yes_button').addEventListener('click', function() {
            data.driven_answers[0] = 0;  // 选择 Yes, 记录为 0
        });

        document.getElementById('no_button').addEventListener('click', function() {
            data.driven_answers[0] = 1;  // 选择 No, 记录为 1
        });
}

// 监听提交按钮点击事件
document.querySelector("#submit_button_phase2").addEventListener('click', function() {
        // localStorage.setItem('additionalQuestionInserted', 'true');
});

    // 计算滑块位置
    let dot_pos_1 = (split_answers[0][0] + 2) / 4;
    let dot_pos_2 = (split_answers[0][1] + 2) / 4;
    let dot_pos_3 = (split_answers[0][2] + 2) / 4;

    const color_0 = interpolateColor(dot_pos_1);
    const color_2 = interpolateColor(dot_pos_3);
    // selectedOption = null;
        let leftColor, rightColor, leftGroup, rightGroup;
        leftColor = color_0;
        rightColor = color_2;
        leftGroup = pseudonyms_chosen[0];
        rightGroup = pseudonyms_chosen[2];
        const question_range = phase_2_statements[question_type][question_index].range || [-2, 2];
        temp_answers[0] = getRandomValue(question_range[0], question_range[1]);
        temp_answers[2] = getRandomValue(question_range[0], question_range[1]);

    // left_option.style.backgroundColor = leftColor;
    // left_option.style.color = leftColor !== "#ededed" ? 'white' : 'black';
    // right_option.style.backgroundColor = rightColor;
    // right_option.style.color = rightColor !== "#ededed" ? 'white' : 'black';

    left_option.style.backgroundColor = "white";
    right_option.style.backgroundColor = "white";

    const new_color = interpolateColor((split_answers[0][1] + 2) / 4);

    document.documentElement.style.setProperty('--left-color', leftColor);
    document.documentElement.style.setProperty('--right-color', rightColor);
    document.documentElement.style.setProperty('--user-color', new_color);

    // 设置姓名标签的位置
    document.getElementById('name-with-dot1').style.left = (dot_pos_1) * 100 - (dot_pos_1 - 0.5) * 8 + '%';
    document.getElementById('name-with-dot2').style.left = (dot_pos_2) * 100 - (dot_pos_2 - 0.5) * 8 + '%';
    document.getElementById('name-with-dot3').style.left = (dot_pos_3) * 100 - (dot_pos_3 - 0.5) * 8 + '%';

// 设置姓名标签的颜色
    document.getElementById('name1').innerText = `${pseudonyms_chosen[0]}`;
    document.getElementById('name1').style.color = interpolateColor(dot_pos_1);
    document.getElementById('triangle_arrow_1').style.color = interpolateColor(dot_pos_1);

    document.getElementById('name2').innerText = `${pseudonyms_chosen[1]}`;
    document.getElementById('name2').style.color = interpolateColor(dot_pos_2);
    document.getElementById('triangle_arrow_2').style.color = interpolateColor(dot_pos_2);

    document.getElementById('name3').innerText = `${pseudonyms_chosen[2]}`;
    document.getElementById('name3').style.color = interpolateColor(dot_pos_3);
    document.getElementById('triangle_arrow_3').style.color = interpolateColor(dot_pos_3);

    // 检查重叠情况并调整位置
    let nameWithDotElements = [
        { elem: document.getElementById('name-with-dot1'), pos: dot_pos_1 },
        { elem: document.getElementById('name-with-dot2'), pos: dot_pos_2 },
        { elem: document.getElementById('name-with-dot3'), pos: dot_pos_3 }
    ];

    nameWithDotElements.sort((a, b) => a.pos - b.pos);

    // 检查是否三个标签重叠
    if (Math.abs(nameWithDotElements[0].pos - nameWithDotElements[1].pos) < 0.01 &&
        Math.abs(nameWithDotElements[1].pos - nameWithDotElements[2].pos) < 0.01) {
        nameWithDotElements[0].elem.querySelector('.name').style.top = '-30px';
        nameWithDotElements[1].elem.querySelector('.name').style.top = '-50px';
        nameWithDotElements[2].elem.querySelector('.name').style.top = '-70px';
    } else {
        // 检查两个标签重叠的情况
        for (let i = 0; i < nameWithDotElements.length - 1; i++) {
            if (Math.abs(nameWithDotElements[i].pos - nameWithDotElements[i + 1].pos) < 0.01) {
                nameWithDotElements[i].elem.querySelector('.name').style.top = '-30px';
                nameWithDotElements[i + 1].elem.querySelector('.name').style.top = '-50px';
            }
        }
    }
function getIdeologyLabel(color) {
    switch (color.toLowerCase()) {
        case 'rgb(19, 59, 255)':
        case 'rgb(55, 89, 252)':
            return 'strongly liberal';
        case 'rgb(92, 118, 249)':
        case 'rgb(128, 148, 246)':
            return 'liberal';
        case 'rgb(164, 178, 243)':
        case 'rgb(201, 207, 240)':
            return 'mildly liberal';
        case '#ededed':
            return 'neutral';
        case 'rgb(240, 206, 201)':
        case 'rgb(243, 175, 166)':
            return 'mildly conservative';
        case 'rgb(246, 144, 130)':
        case 'rgb(249, 113, 94)':
            return 'conservative';
        case 'rgb(252, 82, 59)':
        case 'rgb(255, 51, 23)':
            return 'strongly conservative';
        default:
            return 'unknown';  // 处理未知颜色的情况
    }
}

function getIdeologyLabel2(color) {
    switch (color.toLowerCase()) {
        case 'rgb(19, 59, 255)':
        case 'rgb(55, 89, 252)':
            return 'strong liberal';
        case 'rgb(92, 118, 249)':
        case 'rgb(128, 148, 246)':
            return 'liberal';
        case 'rgb(164, 178, 243)':
        case 'rgb(201, 207, 240)':
            return 'mild liberal';
        case '#ededed':
            return 'neutral';
        case 'rgb(240, 206, 201)':
        case 'rgb(243, 175, 166)':
            return 'mild conservative';
        case 'rgb(246, 144, 130)':
        case 'rgb(249, 113, 94)':
            return 'conservative';
        case 'rgb(252, 82, 59)':
        case 'rgb(255, 51, 23)':
            return 'strong conservative';
        default:
            return 'unknown';  // 处理未知颜色的情况
    }
}

    const leftlabel = getIdeologyLabel(leftColor);
    const new_label = getIdeologyLabel2(new_color);
    const rightlabel = getIdeologyLabel(rightColor);

    // Populate the text for the left option
    // document.getElementById('group-info-left').innerHTML = `The majority of <span class="group-color-left">${leftGroup} group</span> chose this.`;
    // Populate the text for the right option
    // document.getElementById('group-info-right').innerHTML = `The majority of <span class="group-color-right">${rightGroup} group</span> chose this.`;

    document.getElementById('options_container').innerHTML = phase_3_custom_range_1_string;

    // 拖拽滑块
    const marker = document.querySelector('.range-marker-phase-2');
    const range = document.querySelector('.range-number-line');
    let isDragging = false;
    marker.addEventListener('mousedown', () => {
        isDragging = true;
        marker.style.cursor = 'grabbing';
        document.addEventListener('mouseup', handleMouseUp, false);
        document.addEventListener('mousemove', handleMouseMove, false);
        document.addEventListener('blur', handleMouseUp, false);
    });

    function handleMouseUp() {
        isDragging = false;
        marker.style.cursor = 'grab';
        document.removeEventListener('mouseup', handleMouseUp, false);
        document.removeEventListener('mousemove', handleMouseMove, false);
        document.removeEventListener('blur', handleMouseUp, false);
    }

    const segment_percentage = 2.5;
    function handleMouseMove(event) 

        const rect = range.getBoundingClientRect();
        let x = event.clientX - rect.left;
        console.log(event.clientX, rect.left, x);
        x = Math.max(x, 0);
        x = Math.min(x, rect.width);
        const percentage = (x / rect.width) * 100;
        let segmentIndex = Math.floor(percentage / segment_percentage);
        segmentIndex = Math.min(segmentIndex, 40);
        marker.style.left = `${segmentIndex * segment_percentage}%`;
        const rangeValue = phase_2_statements[question_type][question_index].range || [-2, 2];
        const value = (rangeValue[1] - rangeValue[0]) * (segmentIndex * segment_percentage / 100) + rangeValue[0];
        temp_answers[human_index] = value;
        console.log(rangeValue, value)
    }

    question.innerHTML = `<b>Q${next_question_seqNum}. </b>`;
    const random_user = getRandomUser();
    const random_bot = [leftGroup,'', rightGroup][random_user]; // 随机出现一个机器人（可无）
    const question_infomation = document.querySelector('.question-infomation');
    const botAnswer = getOpinionByValue(temp_answers[random_user]);
    if (random_bot) {
        question_infomation.innerHTML = `For Question ${next_question_seqNum}, you will see ${random_bot}’s answer before submitting your own answer. `;
        const range = phase_2_statements[question_type][question_index].range || [-2, 2];
        const botMarker = document.querySelector('.range-marker-bot');
        botMarker.querySelector('span').innerHTML = `${random_bot}'s<br/>answer`;
        const percentage = temp_answers[random_user] / (range[1] - range[0]) * 100;
        let segmentIndex = Math.floor(percentage / segment_percentage);
        segmentIndex = Math.min(segmentIndex, 40);
        botMarker.style.left = segmentIndex * segment_percentage + '%';
        botMarker.style.display = 'block';
    } else {
        question_infomation.innerHTML = `You will answer Question ${next_question_seqNum} on your own.`;
    }
    switch (question_type) {
        case "issue":
            question.innerHTML += (random_bot ? `${random_bot}’s opinion towards the following statement is shown in the opinion spectrum below, see the rectangle on the opinion axis. ${random_bot} (${botAnswer}) thinks that her/his opinion reflects the typical standpoint of people with similar ideologies to hers/his.` : '') + `As a mild liberal, what is your opinion on the following statement`;
            left_option.textContent = "Agree";
            right_option.textContent = "Disagree"
            break;
        case "prediction":
            question.innerHTML += (random_bot ? `${random_bot}’s opinion towards the following statement is shown in the opinion spectrum below, see the rectangle on the opinion axis. ${random_bot} (${botAnswer}) thinks that her/his opinion reflects the typical standpoint of people with similar ideologies to hers/his.` : '') + `As a mild liberal, what is your opinion on the following statement`;
            left_option.textContent = "Yes";
            right_option.textContent = "No";
            break;
        case "fact":
            question.innerHTML += (random_bot ? `${random_bot}’s answer to the following question is shown in the box below, see the rectangle on the answer axis. ${random_bot} (${botAnswer}) believes that people with ideologies similar to hers/his are more knowledgeable on this question than those with opposite ideologies.` : '') + `As a mild liberal, what is your answer to the following question?`;
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

    /**将问题文本（存储在 question 变量中）更新为新的序列号（由 next_question_seqNum 定义）。
根据 question_type（问题的类型）的不同，更新左右选项的文本内容：
如果是 "issue" 类型，选项为 "Agree" 和 "Disagree"。
如果是 "prediction" 类型，选项为 "Yes" 和 "No"。
如果是 "fact" 类型，选项也为 "Yes" 和 "No"。
如果是 "design" 类型，选项为 "Left" 和 "Right"。
从 phase_2_statements 对象中获取与当前 question_type 和 question_index 对应的 text，
并将其赋值给 statement_text 变量（虽然该变量在这段代码中没有进一步使用）。 */

    answers_first = phase_2_orders.participant_order[set_num];
    start_time[answers_first] = Date.now();

    instruction.innerHTML = `
        <div>
        For each question, you will see <b style="color: ${color_name[answers_first]};">${pseudonyms_chosen[answers_first]}</b>'s answer.
            <span class="dots"></span>
        </div>
    `;
    instruction.style[`background-color`] = instruction_background_color;

    // pictures
    if (question_type == "design") {//选择左右图片类的问题//20240509//////////////////////////////////////
        document.querySelector("#pictures_container").style.display = "flex";//涉及图片问答的design才会用到picture
    }
    //如果问题的类型是 "design"，则显示 ID 为 "pictures_container" 的 HTML 容器，并设置其样式为 flex（可能是用于显示两张设计图片）。

    after_bot_input_phase_3();
}

let agreeDisagreeSelected = false;
let yesNoSelected = false;

function selectOption(index) {
    const left_option = document.querySelector("#left_option");
    const right_option = document.querySelector("#right_option");
    const new_color = interpolateColor((split_answers[0][1] + 2) / 4);

    if (index == 0) {
        left_option.classList.add("selected");
        left_option.style.outline = `11px solid ${new_color}`;
        right_option.classList.remove("selected");
        right_option.style.outline = 'none';
        selectedOption = 0;
    } else {
        right_option.classList.add("selected");
        right_option.style.outline = `11px solid ${new_color}`;
        left_option.classList.remove("selected");
        left_option.style.outline = 'none';
        selectedOption = 1;
    }
    agreeDisagreeSelected = true;
    checkIfSubmitCanBeEnabled();

    // 如果 index 等于 0，则给 left_option 元素添加 selected 类，并从 right_option 元素中移除 selected 类。这意味着 left_option 将显示被选中的样式，而 right_option 则不会。

    //如果 index 不等于 0（即等于 1 或其他非零值），则给 right_option 元素添加 selected 类，并从 left_option 元素中移除 selected 类。这意味着 right_option 将显示被选中的样式，而 left_option 则不会。
    temp_answers[human_index] = index; //在选项点击位置处已经保存了人的回答
    //将 temp_answers 数组在 human_index 索引位置的值设置为 index。
    //这里假设 temp_answers 是一个已经定义好的数组，而 human_index 是一个全局变量或在这段代码之前已经定义好的变量
}

function selectAdditionalOption(option) {
    const yes_button = document.querySelector("#yes_button");
    const no_button = document.querySelector("#no_button");

    if (option === 'yes') {
        yes_button.classList.add("selected");
        no_button.classList.remove("selected");
    } else {
        no_button.classList.add("selected");
        yes_button.classList.remove("selected");
    }

    yesNoSelected = true;
    checkIfSubmitCanBeEnabled();
}

function checkIfSubmitCanBeEnabled() {
    if (agreeDisagreeSelected && yesNoSelected) {
        document.querySelector(".submit-button").disabled = false;
    }
}

function after_bot_input_phase_3() {//在bot回答结束后,20240509直接跳过这个函数！！//////////////
    document.removeEventListener("timeup", after_bot_input_phase_3);//移除之前添加的 timeup 事件监听器，以避免重复触发
    all_bots_timeup = false;//all_bots_timeup 变量设置为 false，可能表示机器人回答的时间已经结束，但其他逻辑或事件可能还在进行中。
    const instruction = document.querySelector(".instruction_phase_3");
    const statement = document.querySelector(".statement_phase_3");
    const answer_area = document.querySelector("#answer_area_phase_II");
    //使用 querySelector 和 getElementById 方法获取页面上的特定元素。

    let set_num = 0;
    let question_num = 0;
    let question_count = 0;
    for (let i=0; i<phase_2_orders.question_order.length; i++) {
        question_count += phase_2_orders.question_order[i].length;
        if (question_count >= question_seqNum_in_phase + 1) {
            set_num = i;
            question_num =  phase_2_orders.question_order[i].length - (question_count - question_seqNum_in_phase);
            break;
        }
    }

    const set_index = phase_2_orders.set_order[set_num];
    const question_index = phase_2_orders.question_order[set_num][question_num];

    // change DOM
    setTimeout(() => {
        let profiles = document.querySelectorAll(".profile_with_labels");
        let index = 0;
        profiles.forEach((profile) => {//让带标签的卡片显示是否正在回答问题的效果
            profile.classList.add("answering_now");
            index++;
        });
        //使用 setTimeout 函数（尽管延迟设置为0毫秒）来确保DOM更新在当前的执行栈完成后发生。
        statement.innerHTML = `Statement: ` + `"` + statement_text + `"`;
        statement.classList.remove("concealed");
        answer_area.classList.remove("concealed");
        //将 statement 元素的 innerHTML 设置为 statement_text，
        //并在其前后添加引号。同时，移除 statement 和 answer_area 元素的 concealed 类，使它们可见。
        document.querySelectorAll(".option-button").forEach((button) => {
            button.disabled = false;
        });//通过查询所有的 .option-button 元素，并遍历它们，将每个按钮的 disabled 属性设置为 false，从而启用它们。
        if (set_index_to_name[set_index] == "design") {
            toggle_image_display(question_index);
        }//如果当前问题的类型是 "design"，则调用 toggle_image_display 函数，根据 question_index 来显示或隐藏相关的图片。

        // deal with instruction
        index_of_bots_left = generate_bot_array(num_of_participants, human_index);
        index_of_bots_left.splice(index_of_bots_left.indexOf(answers_first), 1);

        // start_bot_timers
        start_bot_timers(index_of_bots_left, "phase_3_question");//先回答的bot回答结束后，开始人回答，计算回答时间。
        start_time[human_index] = Date.now();
        //调用 start_bot_timers 函数来启动剩余机器人的计时器。同时，记录当前人类用户开始回答问题的时间

        // after the user clicks the button
        document.querySelector(".submit-button").addEventListener("click", () => {
            statement.innerHTML = ``;
            const question = document.querySelector(".question_phase_3");
            question.innerHTML = ``;
            instruction.innerHTML = ``;
            statement.style[`background-color`] = "";

            //240627,现在需要保存每个人在phase II的回答
            //遍历所有参与者，除了已经回答问题的机器人 answers_first 和当前人类用户 human_index，
            //将其他机器人的临时答案 temp_answers 设置为 null。

            each_answer.time_to_answer[human_index] = (Date.now() - start_time[human_index]) / 1000;
            //计算人类用户从开始回答问题到点击提交按钮所花费的时间（秒），并将这个时间存储在 each_answer.time_to_answer 数组中。
            //document.getElementById(`status_${human_index}`).innerHTML = ``;
            enter_next();
        });
    }, time_configurations['lag'] * 1);//取消延迟1000-》1
};



//all_finish_answering_phase_3 函数的主要目的是在所有用户完成答题后，更新页面上的各种元素，包括指令、答案区域、用户头像状态，并准备进入下一个问题
function all_finish_answering_phase_3() {
    document.removeEventListener("timeup", all_finish_answering_phase_3);
    //这行代码移除了之前可能添加的名为 "timeup" 的事件监听器，确保 all_finish_answering_phase_3 函数不会再次被该事件触发。
    clearInterval(timer);
    //如果之前有设置一个名为 timer 的定时器（可能是用来控制答题时间或检查机器人是否超时），这行代码会清除它，避免继续执行定时器的回调函数。
    all_bots_timeup = false;
    //将 all_bots_timeup 变量设置为 false，表示当前没有机器人超时。
    const statement = document.querySelector(".statement_phase_3");
    statement.innerHTML = ``;
    const question = document.querySelector(".question_phase_3");
    question.innerHTML = ``;
    // a lag before "check your answers"
    setTimeout(() => {
        const instruction_right = document.getElementById("instruction_right_phase_II");
        const instruction = document.getElementsByClassName("instruction_phase_3")[0];

        ///20240509清除样式//////////////////////////////////////////////////////////////////////////////////////////////
        instruction_right.innerHTML = `
            <div>
                Now you have finished this question. Please enter the next question.
            </div>
        `;
        //instruction_right.style[`background-color`] = instruction_background_color;
        //获取页面上的 instruction_right_phase_II 元素，并更新其 innerHTML 来显示一条消息，告知所有用户都已完成答题，
        //可以输入下一个问题。同时，设置该元素的背景颜色为 instruction_background_color 变量的值。

        instruction.innerHTML = ``;
        //instruction.style[`background-color`] = "";
        //清空 instruction_phase_3 类的第一个元素的 innerHTML，并移除其背景颜色样式*/

        const answer_area = document.querySelector("#answer_area_phase_II");
        answer_area.innerHTML = `<button class="enter-next-button">Next Question</button>`;
        answer_area.classList.remove("concealed");

        //获取 answer_area_phase_II 元素，并更新其 innerHTML 来显示一个带有 "Next Question" 文本的按钮。同时，移除 concealed 类，使得答案区域可见

        document.querySelector("button").addEventListener('click', enter_next);
        //为页面上的第一个按钮元素添加点击事件监听器，当该按钮被点击时，会调用 enter_next 函数。
    }, time_configurations['lag'] * 1);//使用 setTimeout 函数来设置一个延迟，延迟的时间是 time_configurations['lag'] 的值乘以 1000（将其从秒转换为毫秒）。
    //在这个延迟之后，会执行提供的回调函数，用于更新页面状态,20240509不设置延迟，原来乘1000
};

