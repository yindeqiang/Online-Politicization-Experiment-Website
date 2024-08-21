const num_of_participants = 3;
const num_of_bots = num_of_participants - 1;
const max_num_of_labels = 3;
const human_index = 1;
const phase_1_special_question_index = -1;
let test_mode = false;

const issue_answer_time = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const issue_answer_time_phaseII = [0, 0, 0, 0, 0];

let color_name_phase2_label = [];
let label_id_for_color;
let label_id_list = {}; // 初始化为一个空对象 来确保可以push方法添加元素


//var 声明的变量存在函数作用域或全局作用域中，而不是块级作用域。
//let 声明的变量存在块级作用域中，例如 {} 内，如 if 语句、for 循环等
//你在全局作用域中使用 let 声明一个变量，那么该变量会成为全局对象的属性，
//因此可以被全局访问到。但是它不会像使用 var 那样成为全局对象的属性，而是作为全局环境的一部分存在


/**const phase_1_probability = {//这是phaseI对应每个问题给出的概率值
    "-2": [0.03, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0],
    "-1": [0.25, 0.05, 0.775, 0.275, 0.95, 0.225, 0.85, 0.6, 0.05, 0.875],
    "1": [0.45, 0.36, 0.55, 0.91, 0.55, 0.73, 0.18, 1.0, 0.36, 0.55],
    "2": [0.92, 1.0, 0.08, 1.0, 0.0, 0.91, 0.0, 1.0, 1.0, 0.33]
};
//phase_1_probability一个对象，其键为字符串，值为数组。它可能表示在第一阶段中，对于不同标签或状态的某种概率分布。
//具体数值可以在main_phase_I.ipynb,Pilot_1.ipynb中算出来,原来按照5%来划分的*/
/**const phase_1_probability = {//这是phaseI对应每个问题给出的概率值,现在按照10-30-70-90划分
    "-2": [0.21, 0.24, 0.7, 0.3, 0.77, 0.24, 0.72, 0.24, 0.24, 0.71],
    "-1": [0.45, 0.38, 0.6, 0.375, 0.66, 0.4, 0.64, 0.28, 0.44, 0.63],
    "1": [0.52, 0.64, 0.35, 0.66, 0.4, 0.61, 0.38, 0.59, 0.56, 0.35],
    "2": [0.77, 0.72, 0.2, 0.74, 0.25, 0.76, 0.22, 0.68, 0.74, 0.2]
};*/
//////////////////注意新逻辑！！原来是按照概率选的，但实际有可能导致前后行为不一致！！所以不用概率直接用受试者的回答！！
const phase_1_conservative  = [//这是phaseI对应每个问题在piolt1中抽取的真人回答，liberal——prob是0.2，0.3，0.4分别抽取了6，2，2条
    /*[1, 1, 0, 1, 0, 1, 0, 0, 1, 1],[0, 1, 0, 1, 0, 1, 0, 1, 1, 1],[1, 1, 0, 0, 0, 1, 1, 1, 1, 0],[0, 0, 0, 1, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 1, 1, 1, 0, 1, 1, 0],[1, 1, 1, 0, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 1, 1, 1, 1, 0],[1, 1, 1, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 0, 0, 1, 1],[1, 1, 1, 1, 1, 0, 0, 1, 0, 0]*/

//这是phaseI对应每个问题在piolt1中抽取的真人回答，liberal——prob是0.4，0.3，0.2,0.1分别抽取了1,2,3,4条
[1, 1, 1, 1, 1, 0, 0, 1, 0, 0],

[1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
[1, 1, 1, 1, 0, 1, 0, 0, 0, 0],

[1, 1, 0, 1, 0, 1, 0, 0, 1, 1],
[0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
[1, 1, 0, 0, 0, 1, 1, 1, 1, 0],


[1, 1, 0, 0, 0, 1, 0, 1, 1, 0],
[1, 1, 1, 1, 0, 1, 0, 1, 1, 0],
[1, 1, 0, 0, 0, 1, 0, 1, 1, 0],
[1, 1, 1, 1, 0, 1, 0, 1, 1, 0]



];
const phase_1_liberal = [//这是phaseI对应每个问题在piolt1中抽取的真人回答，liberal——prob是0.6，0.7，0.8分别抽取了2，2，6条
    /*[1, 0, 0, 1, 1, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
    
    [1, 0, 1, 0, 1, 1, 1, 0, 0, 1],   
    [0, 0, 1, 0, 1, 1, 1, 1, 0, 1],
    [0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
    [0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 1]*/
    //这是phaseI对应每个问题在piolt1中抽取的真人回答，liberal——prob是0.7，0.8，0.9,1分别抽取了1，2,3，4条
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 1],

    [1, 0, 1, 0, 1, 1, 1, 0, 0, 1],[0, 0, 1, 0, 1, 1, 1, 1, 0, 1],

    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1],[0, 0, 1, 0, 1, 1, 1, 0, 0, 1],[0, 0, 1, 0, 1, 0, 1, 1, 0, 1],

[0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
[0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
[0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
[0, 0, 1, 0, 1, 0, 1, 0, 0, 1]

];
const time_configurations = {
    'test': 1,
    'wait': [0, 0],//原来是0，10，表示为掉线后一个和另一个bot应该等12秒+30*1个0~1的随机数后进入实验
    'phase_3_question': [7, 11],//对phaseII的问题回答
    'preference': [0, 0],//偏好类的问题这是phaseII里面对四种不同类的问题的时间设定，20240517从1，4变成0，0
    'issue': 5,//政治类的问题10个，phaseI.这里是agree&disagree类型的问题,政治类。
    // 'lag': 1,//用在每次确认回答的OK上的延时，1秒钟
    'confirm': [10, 10],
};
//定义了各种时间配置，如测试时间、等待时间、阶段3问题时间等

// const style_configurations = {
//     'finish_opacity': 0.2,
//     'clicked_choice_background_color': 'grey',
//     'disagree': 'Disagree ⇩',
//     'agree': 'Agree ⇧',
// };
const style_configurations = {
    'finish_opacity': 0.2,
    'clicked_choice_background_color': 'grey',
    'disagree': 'Disagree X',
    'agree': 'Agree √',
};
//一个对象，定义了样式配置，如完成后的透明度、点击选择后的背景颜色，以及不同意和同意的文本标签

var each_answer = {//对于每个问题存储了问题序号，谁先回答，三个人回答的list和分别花费的时间。
    idx_of_question: -1,        // index of the question in the array of questions
    who_answers_first: -1,
    answers: [],
    time_to_answer: []
};
//表示每个答案的状态。包含问题索引、首个回答者、答案数组和回答时间数组

var data = {//这些数据将会记录在数据库中
    participantId: userData.participantId,
    assignmentId: userData.assignmentId,
    projectId: userData.projectId,
    identity_choices: [],
    ideologies: [],
    labels: [],
    attention_passed: false,
    bot_detected: null, //检测bot的,现在又加了两个拓展问题,在enter——next函数位置进行数据传递
    //influence_importance_detected: 0, //添加的两个新问题，类比bot_detect的思路。
    total_time: 0,              // total time to finish the experiment
    type_A_answers: [],         // ideological questions in phase I
    type_B_answers: [],         // non-ideological questions in phase II
    type_D_answers: [],         // post-quiz questions，存拖动轴的数值
    reason: "",
    driven_answers: [],
    trust_answers: [],
};
///////////////////////////////////////////////////////////////////
let firstBotIndex = (human_index == 0) ? 1 : 0;
let lastBotIndex = (human_index == num_of_participants - 1) ? num_of_participants - 2 : num_of_participants - 1;
//这两个变量用于确定机器人参与者的索引范围。它们基于human_index（人类参与者的索引）来计算。如果人类参与者是第一个（human_index == 0），
//则第一个机器人是索引1；否则，第一个机器人是索引0。
//类似地，如果人类参与者是最后一个（human_index == num_of_participants - 1），则最后一个机器人是倒数第二个；否则，它是最后一个。

// status
var all_bots_timeup = false;        // whether all bots are time up,表示是否所有机器人都已经超时
/////
var phase = 0;                     //这里的phase变量对应的是网站的第几个阶段
///////////////
var temp_answers = [];             //用于临时存储答案

var answers_first = -1;            //初始值为-1，可能用于表示首先回答问题的参与者或机器人的索引
var next_question_seqNum = 0;      //一个变量，可能用于表示下一个问题的序列号或索引
var question_seqNum_in_phase = 0;   // start from 0,用于表示当前阶段或相位中的问题序列号或索引，初始值为0。
var index_of_question = 0;          // in phase 1 and phase 3用于表示在第一阶段(实验phase I回答问题)和第三阶段(实验phase II回答问题)中的问题索引
var phase_1_answers_HTML = ``;      //一个字符串变量，可能用于存储第一阶段答案的HTML内容
/////////////////////////////////////////
//var pseudonyms_chosen = [];        //一个数组，可能用于存储已选择的化名或别名,20240430之前存的空数组
//////////////////20240509////////////////////////

let color_name =[];//作为保存名字颜色的全局数组


///////////////////////////////////////////////////////////////
var avatars_index_chosen = [];     //用于存储已选择的头像的索引。！！！！！！！！！！！！！！！！！！！！改头像不如在这里换序号？？
var start_time = [];                //存储各种事件或操作的开始时间

const total_start_time = Date.now();
const timeupEvent = new Event("timeup");
var timer;
var attention_checked = false;

/*total_start_time
一个常量，用于存储实验或应用程序的总开始时间（以毫秒为单位）。

timeupEvent
一个自定义事件对象，可能用于触发超时事件。

其他
timer
一个变量，可能用于存储一个计时器对象或函数。

attention_checked
一个布尔变量，用于表示是否已检查参与者的注意力。*/
//////////////////////////////////////////////////////////20240509,随机生成名字（和头像，但头像不显示）

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let split_answers = [[]];
window.split_answers = [[]];
let num1 = [];let num2 = [];



function enter_next() {
    // attention check
    if (phase == 3 && question_seqNum_in_phase == 1 && !attention_checked) {
        attention_check(); // 这里原有的逻辑
        attention_checked = true;
        return;
    }
//这段代码检查当前是否处于第三阶段（phase == 3），并且是否是该阶段的第三个问题（question_seqNum_in_phase == 2），
//并且之前还没有进行过注意力检查（!attention_checked）。如果这三个条件都满足，那么调用 attention_check() 函数来执行注意力检查，
//并将 attention_checked 设置为 true 以表示已经进行了注意力检查。最后，函数返回，不再执行后续的代码。
    // deal with data
    if (phase == 1) {
        // track answers and display them
        track_answers();
        phase_1_answers_HTML = document.querySelector(".right").innerHTML;
        // save answers
        each_answer.answers = temp_answers;//each answer中存放答案的部分。
        each_answer.idx_of_question = index_of_question;
        each_answer.who_answers_first = -1;//在phaseI里面大家都是一起答，所以设置成-1
        data.type_A_answers.push(each_answer);//存phaseI答案
        each_answer = JSON.parse(JSON.stringify(each_answer));      // deep copy and generate a new answer object
        //当 phase 为 1 时，执行以下操作：
//调用 track_answers() 函数来追踪答案。
//从 DOM 中获取某个元素的 HTML 内容，并赋值给 phase_1_answers_HTML。
//将 temp_answers 数组的内容赋值给 each_answer.answers。
//设置 each_answer.idx_of_question 为 index_of_question 的值。
//将 each_answer.who_answers_first 设置为 -1（可能表示尚未确定首先回答问题的参与者）。
//将 each_answer 对象添加到 data.type_A_answers 数组中。
//使用 JSON.parse(JSON.stringify(each_answer)) 对 each_answer 进行深拷贝，以生成一个新的答案对象。
    } else if (phase == 3) {
        each_answer.answers = temp_answers;
        const set_num = Math.floor(question_seqNum_in_phase / 6);//属于第几个问题组，每5个为一组，20240626换成6个问题
        const question_num = question_seqNum_in_phase % 6;//5个问题中的第几个，20240626是6个问题
        const set_index = phase_2_orders.set_order[set_num];
        const question_index = phase_2_orders.question_order[set_num][question_num];
        each_answer.idx_of_question = set_index * 20 + question_index;//问题组乘20+在本问题组里的索引
        each_answer.who_answers_first = phase_2_orders.participant_order[set_num];//who_answer_first根据random选出来
        data.type_B_answers.push(each_answer);//存phaseII答案
        each_answer = JSON.parse(JSON.stringify(each_answer));
//当 phase 为 3 时，执行以下操作：
//将 temp_answers 数组的内容赋值给 each_answer.answers。
//计算 set_num 和 question_num，它们可能用于确定当前问题集和问题在集内的位置。
//从 phase_2_orders 对象中获取 set_index、question_index 和 participant_order 的值。
//计算 each_answer.idx_of_question 的值，它可能是通过集合索引和问题索引计算得出的。
//设置 each_answer.who_answers_first 为 participant_order 中对应集合的参与者顺序。
//将 each_answer 对象添加到 data.type_B_answers 数组中。
//对 each_answer 进行深拷贝。
    } else if (phase == 4) {
        /*answers = [];
        split_answers = [];
        document.querySelectorAll("input[type=range]").forEach((range) => {
            answers.push(parseFloat(range.value));
        });
        split_answers.push(answers.slice(0, 3));
        if (userData.quiz_type == 'pilot_1') {
            split_answers.push(answers.slice(3, 5));
            split_answers.push(answers.slice(5, 7));
        }
        data.type_D_answers = split_answers;//传过去一个数组，数组每个元素是轴的值，存拖动轴的数值*/
        //240626,轴上的数据换到phase 2来保存

        ////////////可用来参考写接下来的两个新加的问题，前一个乘10，后一个直接加
        //let detection_answers = [0, 0];
        let detection_answers = [0, 0, 9, 9];//现在把新问题添加到bot_detect里面，前面两个职业乘1000和100，后面两个是10和1
        //for (let i = 0; i <= 1; i++) {
            //删掉了前两个选职业的问题，所以从2开始
        for (let i = 2; i <= 3; i++) {
            let identity_choice_seqNum = 0;
            while (input = document.getElementById(`detection_${i}_${identity_choice_seqNum}`)) {
                if (input.checked) {
                    detection_answers[i] = identity_choice_seqNum;
                }
                identity_choice_seqNum += 1;
            }
        }
    }
    else if (phase == 2) {//保存phase2里面的拖轴的数值
        answers = [];
        //split_answers = [];
        document.querySelectorAll("input[type=range]").forEach((range) => {
            answers.push(parseFloat(range.value));
            //console.log("answers:", answers);
        });
        // split_answers.push(answers.slice(0, 3));
        if (userData.quiz_type == 'pilot_1') {
            split_answers.push(answers.slice(3, 5));
            split_answers.push(answers.slice(5, 7));
        }
        for (const ans of split_answers[0]) {
            data.ideologies.push(ans / 2);   // a workaround, should be implemented more elegantly
        }
        //240626,轴上的数据换到phase 2来保存
        num1 = Math.floor(Math.random() * 6);
        do {
            num2 = Math.floor(Math.random() * 6);
        } while (num2 === num1);

        // 将结果存储到全局变量 window.split_answers
        window.split_answers = split_answers;
        document.dispatchEvent(new Event('splitAnswersReady'));
    }

    // restore status
    temp_answers = [];//进入下一个阶段时将临时存放答案的list清空
    all_bots_timeup = false;
    start_time = [];

    // is the last question in the phase
    if (question_seqNum_in_phase == get_phase_length(phase) - 1) {//如果是本个phase中的最后一题
        if (phase == 4) {
            end_quiz();
        } else {
            if (userData.quiz_type == 'pilot_1' && phase == 1) {
                phase = 4;
                question_seqNum_in_phase = 0;
                show_instructions();
/*这段代码是 enter_next 函数的最后一部分，它处理第四阶段（phase == 4）的数据和状态更新，并包含一些其他逻辑来处理答题结束的情况。

第四阶段数据处理
初始化 answers 和 split_answers 数组。
遍历所有类型为 range 的输入元素，并将它们的值（转换为浮点数）添加到 answers 数组中。
将 answers 数组的前三个元素推入 split_answers 数组。
如果 userData.quiz_type 等于 'pilot_1'，则继续将 answers 数组中的后续元素推入 split_answers 数组。
将 split_answers 数组赋值给 data.type_D_answers。
接下来，代码处理与“检测”相关的逻辑：

初始化 detection_answers 数组，并准备循环来检查用户是否选中了某些特定元素。
循环遍历每个检测项，如果检测到某个元素被选中，则更新 detection_answers 数组。
将 detection_answers 数组中的值转换为一个数字，并赋值给 data.bot_detected。
移除 phase_4_click_handler 事件监听器。
状态恢复和逻辑处理
重置 temp_answers 数组和 all_bots_timeup 变量。
重置 start_time 数组。
检查当前问题是否是该阶段的最后一个问题。如果是，则执行以下操作：
如果当前阶段是第四阶段，调用 end_quiz() 函数来结束测试。
如果当前阶段不是第四阶段且 userData.quiz_type 为 'pilot_1'，则将阶段设置为第四阶段，重置问题序列号，并调用 show_instructions() 函数显示说明。*/
            } else if (userData.quiz_type == 'condition_1' && phase == 0) {
                phase = 3;//condition1直接进入phase3的阶段
                question_seqNum_in_phase = 0;
                next_question_seqNum = 1;
                data.labels = [[], [], []];
                init_phase_3();
        /*** 如果 `userData.quiz_type` 等于 `'condition_1'` 并且当前阶段 `phase` 是 0，则：  
	+ 将 `phase` 设置为 3，即跳过阶段 0 和阶段 1，直接进入阶段 3。  
	+ 重置当前阶段的问题序列号 `question_seqNum_in_phase` 为 0。  
	+ 设置 `next_question_seqNum` 为 1，这可能是用于追踪下一个问题的序列号。  
	+ 初始化 `data.labels` 为一个包含三个空数组的数组。  
	+ 调用 `init_phase_3()` 函数来初始化阶段 3 的设置。 */        
            } else {
                question_seqNum_in_phase = 0;
                phase += 1;
                // for phase 0, do not increase index of the next question
                if (phase != 0)
                {if(phase != 31)
                    {next_question_seqNum += 1;}}
                show_instructions();
            /*** 在不满足上述特定条件的情况下：  
	+ 重置当前阶段的问题序列号 `question_seqNum_in_phase` 为 0。  
	+ 增加 `phase` 的值，即进入下一个答题阶段。  
	+ 如果当前阶段不是 0，则增加 `next_question_seqNum` 的值。  
	+ 调用 `show_instructions()` 函数来显示当前阶段的说明或指令。 */    
            }
        }
    }

    else {//如果不是本phase里面的最后一题。
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
}/*** 如果上述条件都不满足，则：  
	+ 增加当前阶段的问题序列号 `question_seqNum_in_phase`。  
	+ 增加 `next_question_seqNum` 的值。  
	+ 使用 `switch` 语句根据当前的 
`phase` 值来调用相应的初始化函数（`init_phase_1()`, `init_phase_2()`, `init_phase_3()`, 或 `init_phase_4()`），以准备当前阶段的问题或界面。 */



function show_instructions() {//1,3开始前要有一个instruction的展示

    if (phase == 1)
        set_bots_behavior();

    if (phase == 1 || phase == 3) {
        // DOM change
        document.querySelector(".quiz_body").innerHTML = rule_string;
        let title = document.querySelector("h1");

/*** 使用 `querySelector` 选择 `.quiz_body` 元素，并将其 `innerHTML` 设置为 `rule_string` 的值，这可能是用于显示通用规则的字符串。 */
        // modify the title
        if (userData.quiz_type == "pilot_1") {
            title.innerHTML = `Instruction`;
        } else {
            if (phase == 1)
                title.innerHTML = 'Instruction for Phase 1';
            else if (phase == 3)
                title.innerHTML = "Instruction for Phase 2";
        }
/*** 如果 `userData.quiz_type` 为 `"pilot_1"`，则标题为 `Instruction`。  
* 否则，根据 `phase` 的值，标题会被设置为 `Instruction for Phase I` 或 `Instruction for Phase II`。 */


        //修改 .specific_rules 元素的内容，用于显示特定阶段的规则
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

/*** 如果阶段为1，代码会根据 `userData.quiz_type` 的值来选择规则字符串。
 * 如果 `userData.quiz_type` 为 `'pilot_1'`，则使用特定的规则字符串；否则，使用默认的规则字符串。  
* 对于其他阶段，直接使用 `section_rule_string[phase]` 的值。 */  
        
        // animation
        document.addEventListener("change", after_check);
        document.querySelector("button").addEventListener("click", () => {
            document.removeEventListener("change", after_check);
            switch (phase) {
                case 1:
                    init_phase_1();
                    break;
                case 3:
                    //init_phase_31();//在进入phase3后给出一个提示,然后开始抽签/////////////////////////////////////
                    // attention_check();
                    //20240509现在不要抽签，直接attention_check后进入答题//////////////////////////////////////////////
                    init_phase_3();
                    break;
            }
        });
    }
/**这部分代码为文档添加了一个 change 事件的监听器，并在一个按钮的点击事件处理函数中移除了该监听器。
 * 当按钮被点击时，根据 phase 的值，调用相应的初始化函数。 */
    else if (phase == 2)
        init_phase_2();

    else
        init_phase_4();/**如果当前阶段不是1或3，代码会根据 phase 的值来调用 init_phase_2 或 init_phase_4 函数，以初始化阶段2或阶段4的设置。

        总的来说，show_instructions 函数负责根据当前的答题阶段和用户的答题类型来更新页面内容，显示适当的说明或指令，并初始化特定答题阶段的设置。 */

}


//!!选名字，选头像的quiz部分！！！！/////////////////////////////////////////////////////////////
// 创建提示用户的函数
/*function createNotification() {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `
    <p class="avatar_notification" style="color: red;padding-left: 70px;margin-bottom: 100px;">The name and avatar have been chosen by another participant.</p>
    `;
    document.body.appendChild(notification);
}

// 删除提示的函数
function removeNotification() {
    const notification = document.querySelector(".notification");
    if (notification) {
        notification.parentNode.removeChild(notification);
    }
}*/

function choose_identity() {
    document.querySelector(".quiz_body").innerHTML = phase_0_body_string;
    //这行代码将.quiz_body类的元素的内容重置为phase_0_body_string变量的值。这可能是一个字符串，代表某个特定阶段或状态的页面内容。
    adjust_button_size(document.querySelector(".button_checked"));
    //调用adjust_button_size函数，并传递.button_checked类的元素作为参数。这个函数可能是用来调整按钮的大小的。

    let avatars_list = document.querySelector(".avatars_list");//选中头像列表

    let pseudonyms_list = document.querySelector(".pseudonyms_list");

    let notification_choose_identity = document.querySelector(".avatar_notification");


    for (let index = 0; index < pseudonyms.length; index++) {
        pseudonyms_list.innerHTML += `
            <div class="pseudonym_choice" id="pseudonym_${index}">
                <p>${pseudonyms[index]}</p>
            </div>
        `;
    }
    /*首先，选择.pseudonyms_list类的元素，然后遍历pseudonyms数组（这个数组在这段代码之外定义）。对于数组中的每个化名，它都会向
pseudonyms_list元素的innerHTML添加一个新的div元素，该元素包含一个段落元素，显示当前的化名。*/

notification_choose_identity.innerHTML += `
            <div class="avatar_notification">
                <p style="color: red;padding-left: 70px;margin-bottom: 100px;">The names and avatars in light grey have been chosen by other participants.</p>
            </div>
        `;

    for (let index = 0; index < avatar_num; index++) {
        avatars_list.innerHTML += `
            <div class="avatar_choice" id="avatar_${index}">
                <img src="/static/avatars/avatar_${index}.png" alt="avatar_${index}" >
            </div>
        `;
    }
    /*for (let index = 0; index < 1; index++) {//原来代码在上面，新逻辑是只有一个黑色人头图像，默认选第0个
        avatars_list.innerHTML += `
            <div class="avatar_choice" id="avatar_${index}">
                <img src="/static/avatars/avatar_${index}.svg" alt="avatar_${index}" >
            </div>
        `;
    }*/

//该元素包含一个图像元素，其源src是根据当前的索引动态生成的，并指向一个 SVG 格式的头像。

//下面是设定好第一个头像和名字禁用不可选的状态的设定
/////////////////////////////////////////////////////////////////////////////////////////////////
 // 获取第一个伪名和头像的元素
 const firstPseudonymChoice = document.getElementById("pseudonym_6");/**默认第二个（1）头像和第七个（6）名字 */
 const firstAvatarChoice = document.getElementById("avatar_1");
 
 // 设置第一个伪名和头像显示灰色，并禁止用户选择
 firstPseudonymChoice.style.backgroundColor = "light-grey";
 firstPseudonymChoice.style.opacity = "0.2"; // 设置透明度为0.2
 firstPseudonymChoice.style.pointerEvents = "none";
 firstAvatarChoice.style.backgroundColor = "light-grey";
 firstAvatarChoice.style.opacity = "0.2";
 firstAvatarChoice.style.pointerEvents = "none";
 
 // 调用创建提示的函数
//createNotification();
 
 // 禁止用户点击第一个名字和头像
 const disableFirstChoices = () => {
     firstPseudonymChoice.style.pointerEvents = "none";
     firstAvatarChoice.style.pointerEvents = "none";
 };
 
 // 禁止用户点击某个名字和头像
 disableFirstChoices();
////////////////////////////////////////////////////////////////////////////////////////////////////////
document.querySelector(".splits_wrap").addEventListener("click", click_pseudonym_or_avatar_handler);
document.querySelector("button").addEventListener("click", wait_for_participants);//选好后进入等待环节
    
    
    /* `.splits_wrap` 类的元素：当点击此元素时，会调用 `click_pseudonym_or_avatar_handler` 函数。
    从名称上看，这个函数可能是用来处理用户点击化名或头像时的逻辑。`button` 类的元素（这里似乎没有指定具体的类名，可能是一个错误，除非页面确实只有一个 `button` 元素）：
当点击此按钮时，会调用 `wait_for_participants` 函数。这个函数可能是用来等待其他参与者加入或开始某个过程。*/

}




var bots_answer_set_phase_1 = [null, null];
var first_bot_is_liberal;

function set_bots_behavior() {
    // Choose bots' pseudonyms and ideologies (answer patterns in phase I)
    let liberal_bot_liberal_score;
    let rand_int_liberal = Math.floor(Math.random() * 10);
    rand_int_liberal = Math.min(rand_int_liberal, 9);
    if (rand_int_liberal == 0)
        liberal_bot_liberal_score = 0.7;
    else if (rand_int_liberal >= 1 && rand_int_liberal <= 2)
        liberal_bot_liberal_score = 0.8;
    else if (rand_int_liberal >= 3 && rand_int_liberal <= 5)
        liberal_bot_liberal_score = 0.9;
    else
        liberal_bot_liberal_score = 1;
    
    let conservative_bot_liberal_score;
    rand_int_conservative = Math.floor(Math.random() * 10);
    rand_int_conservative = Math.min(rand_int_conservative, 9);
    if (rand_int_conservative == 0)
        conservative_bot_liberal_score = 0.4;
    else if (rand_int_conservative >= 1 && rand_int_conservative <= 2)
        conservative_bot_liberal_score = 0.3;
    else if (rand_int_conservative >= 3 && rand_int_conservative <= 5)
        conservative_bot_liberal_score = 0.2;
    else
        conservative_bot_liberal_score = 0.1;

    const rand_num = Math.random();         // whether the first or the third participant is liberal
    if (rand_num < 0.5) {
        first_bot_is_liberal = true;
        data.identity_choices = [[randomnumber_name, [liberal_bot_liberal_score, rand_int_liberal]], [null, [null, null]], [1 - randomnumber_name, [conservative_bot_liberal_score, rand_int_conservative]]];
        bots_answer_set_phase_1 = [rand_int_liberal, rand_int_conservative];
    } else {
        first_bot_is_liberal = false;
        data.identity_choices = [[randomnumber_name, [conservative_bot_liberal_score, rand_int_conservative]], [null, [null, null]], [1 - randomnumber_name, [liberal_bot_liberal_score, rand_int_liberal]]];
        bots_answer_set_phase_1 = [rand_int_conservative, rand_int_liberal];
    }
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

/**某个“时间到”事件触发后的行为。下面是详细的解释：

移除事件监听器：
document.removeEventListener("timeup", all_timeup);
这行代码移除了之前绑定在 document 对象上的名为 timeup 的事件监听器，确保 all_timeup 函数不再因 timeup 事件而被触发。

清空指令内容：
document.querySelector(".instruction").textContent = ``;
这行代码使用 querySelector 方法查找页面上类名为 instruction 的元素，并将其文本内容设置为空字符串，即清空这个元素的内容。

检查阶段并启用按钮：
if (phase == 0) { ... }
这个 if 语句检查一个名为 phase 的变量是否等于 0。如果是，它执行以下操作：

let button = document.querySelector("button");
使用 querySelector 方法查找页面上的第一个 button 元素，并将其存储在 button 变量中。

button.disabled = false;
将找到的按钮的 disabled 属性设置为 false，这意味着按钮现在可以被点击了。之前，它可能处于禁用状态，无法被点击。

button.addEventListener("click", enter_next);
给找到的按钮添加一个点击事件监听器。当按钮被点击时，enter_next 函数将被调用。这意味着，一旦时间到并且 phase 为 0，用户可以点击按钮，并触发 enter_next 函数的行为。 */


let phase_1_issue_index = randomly_choose(generate_sequence_array(0, phase_1_statements[0].length), phase_length[1][0]);

/**generate_sequence_array(0, phase_1_statements[0].length) 生成一个从0到phase_1_statements[0].length（不包含）的连续整数数组。
randomly_choose(..., phase_length[1][0]) 从这个数组中随机选择phase_length[1][0]个不重复的索引，并将这些索引赋值给phase_1_issue_index。
 */

for (let index = phase_1_statements[0].length; index < phase_1_statements[0].length + phase_1_statements[1].length; index++)
    phase_1_issue_index.push(index);

/**这个循环从phase_1_statements[0].length开始，直到phase_1_statements[0].length + phase_1_statements[1].length（不包含）。
对于每个index，它都将这个index添加到phase_1_issue_index数组的末尾。 */

let phase_1_issue_index_posted = {
    data: generate_zero_array(phase_1_issue_index.length)
};

/**generate_zero_array(phase_1_issue_index.length) 生成一个长度与phase_1_issue_index相同的数组，数组中的每个元素都是0。
这个数组被赋值给phase_1_issue_index_posted对象的data属性 */

let phase_1_preference_index = randomly_choose(generate_sequence_array(phase_1_statements[0].length + phase_1_statements[1].length, phase_1_statements[2].length), phase_length[1][2]);
/**generate_sequence_array(phase_1_statements[0].length + phase_1_statements[1].length, phase_1_statements[2].length) 生成一个从phase_1_statements[0].length + phase_1_statements[1].length到phase_1_statements[2].length（不包含）的连续整数数组。
randomly_choose(..., phase_length[1][2]) 从这个数组中随机选择phase_length[1][2]个不重复的索引，并将这些索引赋值给phase_1_preference_index。 */

let phase_1_preference_index_posted = {
    data: generate_zero_array(phase_1_preference_index.length)
}

/**类似于phase_1_issue_index_posted的创建，phase_1_preference_index_posted对象也包含一个由generate_zero_array生成的零数组，
 * 其长度与phase_1_preference_index相同。
 */
let phase_1_distances = generate_zero_array(num_of_bots);
/**generate_zero_array(num_of_bots) 生成一个长度为num_of_bots的数组，数组中的每个元素都是0。
这个数组被赋值给phase_1_distances。 */


function init_phase_1() {
    // change DOM
    if (question_seqNum_in_phase == 0)
        document.querySelector(".quiz_body").innerHTML = phase_1_body_string;
    //如果 question_seqNum_in_phase 的值为0（表示这是该阶段的第一个问题），
    //那么会将 .quiz_body 元素的内容设置为 phase_1_body_string 变量的值。这可能是为了显示该阶段特有的内容或布局。
    document.querySelector(".left").innerHTML = input_select_string;
    //将 .left 元素的内容设置为 input_select_string 变量的值。这可能是用户选择答案的界面或相关控件。
    let question = document.querySelector(".question");
    let instruction = document.querySelector(".instruction");
    instruction.innerHTML = `
        Please select your choice and press
        <button type="button" class="button_small" disabled="true">Submit</button>`;
    //首先，通过 querySelector 获取 .question 和 .instruction 元素。
    //然后，设置 .instruction 元素的 innerHTML，显示一条提示信息，告诉用户选择答案并点击一个当前被禁用的“Submit”按钮。
    add_identity_status();//用来在界面上添加或更新用户或参与者的身份状态。
    document.querySelectorAll(".status").forEach((status) => {
        status.innerHTML = ``;      // 原本是加载转圈圈，现在什么都不要
    });
    //选择所有带有 .status 类的元素，并将它们的 innerHTML 设置为 loader_string 变量的值。这可能是在答题开始前显示的一种加载状态或占位符。
    start_time[human_index] = Date.now();
    //获取当前时间（以毫秒为单位）并存储在 start_time 数组的 human_index 索引位置。这通常用于后续计算答题时间或用于其他与时间相关的逻辑。



    // political issue question
    if (question_seqNum_in_phase < phase_length[1][0] + phase_length[1][1]) {
        //这行代码检查当前问题序列号 question_seqNum_in_phase 是否小于某一阶段（可能是第一阶段）的总问题数。
        //phase_length[1][0] 和 phase_length[1][1] 可能是该阶段不同类型问题的数量。
        // randomly pick a question that hasn't been chosen before
        index_of_question = randomly_choose(phase_1_issue_index, 1, phase_1_issue_index_posted)[0];
        //通过调用 randomly_choose 函数，从 phase_1_issue_index 中随机选择一个未被提出过的问题的索引。
        question.innerHTML = `Q${next_question_seqNum}. Do you agree with the following statement: `;
        let statement_text = "";
        if (index_of_question < phase_1_statements[0].length)
            statement_text = phase_1_statements[0][index_of_question].statement;
        else
            statement_text = phase_1_statements[1][index_of_question - phase_1_statements[0].length].statement;
        document.querySelector(".statement").innerHTML = `"` + statement_text + `"`;
        add_ans_choices(['Agree √', 'Disagree X']);
        //设置问题的内容，并从 phase_1_statements 数组中获取对应的声明文本。
        //这个数组可能包含两组不同的声明，根据 index_of_question 的值，从其中一组或另一组中选择声明。
        // const answer_choices = document.querySelector(".answer_choices");
        // answer_choices.innerHTML += `
        //     <div class="answer_choice" id="choice_0">
        //         <p>Agree</p>
        //         ${up_arrow_svg}
        //     </div>
        //     <div class="answer_choice" id="choice_1">
        //         <p>Disagree</p>
        //         ${down_arrow_svg}
        //     </div?
        // `;
        // answer_choices.querySelectorAll(".arrow").forEach((arrow) => {
        //     arrow.classList.add("arrow-option")
        // })

        // for the ith question, pretend that the last participant is offline for some time
        if (question_seqNum_in_phase == phase_1_special_question_index) {
            //let offlineBotIndex = (human_index == num_of_participants - 1) ? num_of_participants - 2 : num_of_participants - 1;//默认botB
            let offlineBotIndex = (human_index == num_of_participants - 1) ? num_of_participants - 2 :  randomNumber//最后换成num_of_participants - 1
            let index_array = generate_bot_array(num_of_participants, human_index);
            index_array.splice(index_array.indexOf(offlineBotIndex), 1);
            ///////////////////////////////////////////////////////////////////////////20240509,新的实验里不需要有思考时间直接展示 
            start_bot_timers(index_array, 'issue');//phaseI当中，如果是政治倾向类的问题，那么启动issue
        }
        /**如果当前问题是某一特定问题（可能是需要特殊处理的问题），则执行以下逻辑：

确定一个“离线”的机器人索引 offlineBotIndex。
生成除了 offlineBotIndex 外的所有机器人索引数组。
为这些机器人启动计时器。 */

        // else, start timers for all bots
        else
            start_bot_timers(generate_bot_array(num_of_participants, human_index), "issue");
    }//如果当前问题不是特殊问题，则为所有机器人启动计时器。

    // preference questions
    else {//表示如果当前的问题不是政治问题，那么应该处理偏好问题
        document.querySelector(".statement").outerHTML = ``;
        //通过修改 .statement 元素的 outerHTML 属性，清除现有的声明内容。
        index_of_question = randomly_choose(phase_1_preference_index, 1, phase_1_preference_index_posted)[0];
        //使用 randomly_choose 函数从 phase_1_preference_index 中随机选择一个尚未被提出过的偏好问题的索引。
        let temp_length = phase_1_statements[0].length + phase_1_statements[1].length;
        //计算前两个声明数组的总长度，这似乎是为了确定偏好问题在 phase_1_statements[2] 中的起始位置
        question.innerHTML = `Q${next_question_seqNum}. ${phase_1_statements[2][index_of_question - temp_length].statement}`;
        //设置问题的内容，并从 phase_1_statements[2] 数组中获取对应的偏好声明。
        //由于偏好问题的索引是从前两个声明数组的总长度之后开始的，因此需要减去 temp_length 来获得正确的索引。
        add_ans_choices([
            phase_1_statements[2][index_of_question - temp_length].range[0],
            phase_1_statements[2][index_of_question - temp_length].range[1]
        ]);
        //调用 add_ans_choices 函数来添加偏好问题的答案选项。这些选项通常是一个范围或一组选项，它们存储在 range 数组中。
        start_bot_timers(generate_bot_array(num_of_participants, human_index), "preference");//phaseI里是偏好类的时间
    }//为所有机器人启动计时器，以模拟它们回答偏好问题的过程。传递 "preference" 作为参数，可能是为了区分不同类型的问题（政治问题或偏好问题）。

    // animation of the flex
    index_of_choice_clicked = -1;//-1说明现在还没选择选项
    //这行代码初始化了一个变量index_of_choice_clicked，用于存储用户点击的选项的索引。初始值为-1，表示没有选项被点击。
    let answer_choices = document.querySelector(".answer_choices");
    answer_choices.addEventListener("click", click_on_choice);
    //这里首先通过document.querySelector选择了类名为answer_choices的元素，并为其添加了一个点击事件监听器。
    //当该元素或其子元素被点击时，click_on_choice函数将被调用。
    document.querySelector("button").addEventListener("click", () => {
        answer_choices.removeEventListener("click", click_on_choice);
        answer_choices.style.opacity = style_configurations.finish_opacity;
        document.getElementById(`status_${human_index}`).innerHTML = ``;
        document.querySelector(".instruction").innerHTML = `
           
           <span class="dots"></span>
        `;//20240517直接清空当前内容 ： Please wait for other participants to choose
        transform_dots();
    //当某个按钮（类名未指定，假设它是页面上的一个普通按钮）被点击时，将移除之前添加到answer_choices上的点击事件监听器，
    //并更新界面元素（如设置透明度、清空状态、更新指示文本等）。
        let human_answer = index_of_choice_clicked;
        let bot_answers = generate_answers_for_bots(human_answer);
        temp_answers = [bot_answers[0], human_answer, bot_answers[1]];//按botA,human,botB的顺序存储答案。
    //这里首先获取用户点击的选项索引（即用户答案），然后根据这个答案生成两个机器人的答案。之后，将机器人和用户的答案存储在temp_answers数组中。
        each_answer.time_to_answer[human_index] = (Date.now() - start_time[human_index]) / 1000;    // track user time to answer
//这行代码计算了用户从开始到结束回答问题所用的时间（以秒为单位），并存储在each_answer.time_to_answer数组中
        // calculate distance, to be modified later
        if (question_seqNum_in_phase < phase_1_statements[0].length + phase_1_statements[1].length) {
            // hard-coding
            phase_1_distances[0] += Math.abs(temp_answers[0] - temp_answers[1]);
            phase_1_distances[1] += Math.abs(temp_answers[2] - temp_answers[1]);
        }
        //这部分代码计算了用户答案与机器人答案之间的某种“距离”

        // for the special question, wait for the last participant after the human participant finishes answering.
        //20240509版没有掉线环节！！////////////////////////////////////////////////////////////////////////////////////////////////////
        if (question_seqNum_in_phase == phase_1_special_question_index) {//这里删掉后总有奇怪的问题
            if (all_bots_timeup)
                bot_get_offline();//bot在完成三个题后显示一个掉线的效果
            else
                document.addEventListener("timeup", bot_get_offline);
        }
        else {
            if (all_bots_timeup)
                all_finish_answering();
            else
                document.addEventListener("timeup", all_finish_answering);
        }
    });/**这里检查当前的问题是否是特殊问题。如果是，则等待所有机器人回答完毕后再进行下一步操作；
    如果不是，则同样等待。但是，处理特殊问题的代码和处理常规问题的代码似乎不完整，因为被省略了。 */
}



function bot_get_offline() {//设置的一个trick,显示一个bot掉线的效果
    document.removeEventListener("timeup", bot_get_offline);
    let offlineBotIndex = (human_index == num_of_participants - 1) ? num_of_participants - 2 : randomNumber;//默认botB掉线,最后换成num_of_participants - 1
    //它在给定条件下确定了一个名为 offlineBotIndex 的变量的值。如果 human_index 等于 num_of_participants 减 1，
    //就将 offlineBotIndex 设置为 num_of_participants 减 2，否则将 offlineBotIndex 设置为 num_of_participants 减 1。
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
        }, 0);//原来这里两个数值分别是5000和10000.15000和20000秒
    }, 0);//setTimeout(() => { ... }, 10000);: 这是一个定时器，它在10秒后执行其中的代码块。在这段时间内，模拟机器人掉线的效果。
}



function init_phase_2() {
    document.querySelector(".quiz_body").innerHTML = phase_1_body_string;
    document.querySelector(".left").innerHTML = phase_2_label_string;
    document.querySelector(".right").innerHTML = phase_1_answers_HTML;  // the answer history of phase I
    const marker = document.querySelector('.range-marker-phase-2');
    const range = document.querySelector('.custom-range');
    let isDragging = [false, false, false];
    let marker_dragged = [false, false, false];
    let trust_answers_filled = [false, false];

    data.trust_answers = [null, null];

    for (let marker_idx = 0; marker_idx < 3; marker_idx++) {
        const marker = document.getElementById(`marker_${marker_idx}`);
        marker.addEventListener('mousedown', () => {
            isDragging[marker_idx] = true;
            marker.style.cursor = 'grabbing';
        });
    }

    document.addEventListener('mouseup', () => {
        isDragging[0] = isDragging[1] = isDragging[2] = false;
        marker.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (event) => {
        const segment_percentage = 7.69;
        let range_idx = -1;
        for (let idx = 0; idx < 3; idx++) {
            if (isDragging[idx]) {
                range_idx = idx;
                break;
            }
        }
        if (range_idx >= 0) {
            const rect = range.getBoundingClientRect();
            let x = event.clientX - rect.left;
            x = Math.max(x, 0);
            x = Math.min(x, rect.width);
            const percentage = (x / rect.width) * 100;
            let segmentIndex = Math.floor(percentage / segment_percentage);
            segmentIndex = Math.min(segmentIndex, 12);
            const marker = document.getElementById(`marker_${range_idx}`);
            marker.style.left = `${50 + (segmentIndex - 6) * segment_percentage}%`;
            const color = getComputedStyle(document.documentElement).getPropertyValue(`--color${segmentIndex}`);
            marker.style.backgroundColor = color;
            // document.getElementById(`name_${range_idx}`).style.border = `2px solid ${color}`;
            marker_dragged[range_idx] = true;
            split_answers[0][range_idx] = (segmentIndex - 6) / 3;

            checkIfAllConditionsMet(marker_dragged, trust_answers_filled);
        }
    });

    const inputs = document.querySelectorAll('input[type="radio"]');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.name == "detection_5") {
                data.trust_answers[0] = parseInt(input.value);
                trust_answers_filled[0] = true;
            } else if (input.name == "detection_6") {
                data.trust_answers[1] = parseInt(input.value);
                trust_answers_filled[1] = true;
            }

            checkIfAllConditionsMet(marker_dragged, trust_answers_filled);
        });
    });
}

// 检查是否所有条件都满足，如果满足则启用按钮
function checkIfAllConditionsMet(marker_dragged, trust_answers_filled) {
    const button = document.querySelector(".button_big");
    if (marker_dragged.every(Boolean) && trust_answers_filled.every(Boolean)) {
        button.disabled = false;
        button.addEventListener("click", enter_next);
    }
}





var evaluation_types = [];

// 全局变量标志
let phase4DataReady = false;

document.addEventListener('splitAnswersReady', function() {
    console.log(window.split_answers); // 这时 split_answers 已经初始化，应该能正确打印

    let dot_pos_1 = (window.split_answers[0][0] + 2) / 4;
    let dot_pos_3 = (window.split_answers[0][2] + 2) / 4;

    const color_0 = interpolateColor(dot_pos_1);
    const color_2 = interpolateColor(dot_pos_3);

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

    const label_0 = getIdeologyLabel(color_0);
    const label_2 = getIdeologyLabel(color_2);

    // 动态创建 phase_4_body_string 并存储
    window.phase_4_body_string = `
        <h1>Additional questions</h1>
        <p>
            Now you have completed the main part of this survey experiment. Before you are redirected to the Connect platform, we would like to ask you some additional questions. Your answers will <b>NOT</b> be disclosed to the other two participants. After answering these questions, please click “Submit”. Then you will be directed to the last page of this survey.
        </p>
        <hr>
        <div class="question_phase_4" id="question_4">
            <p>Q1. In phase 2, to what extent were your answers influenced by ${pseudonyms_chosen[0]} group's (${label_0}) answers?</p>
            <div class="detection_wrap">
                <div class="each_detection">
                    <form>
                        <input type="radio" id="detection_2_0" value="0" name="detection_2">
                        <label for="detection_2_0">Strongly influenced</label>
                        <br>
                        <input type="radio" id="detection_2_1" value="1" name="detection_2">
                        <label for="detection_2_1">Somewhat influenced</label>
                        <br>
                        <input type="radio" id="detection_2_2" value="2" name="detection_2">
                        <label for="detection_2_2">Not influenced at all</label>
                        <br>
                    </form>
                </div class="each_detection">
            </div>
        </div>
        
        <div class="question_phase_4" id="question_5">
            <p>Q2. In phase 2, to what extent were your answers influenced by ${pseudonyms_chosen[2]} group's (${label_2}) answers?</p>
            <div class="detection_wrap">
                <div class="each_detection">
                    <form>
                        <input type="radio" id="detection_3_0" value="0" name="detection_3">
                        <label for="detection_3_0">Strongly influenced</label>
                        <br>
                        <input type="radio" id="detection_3_1" value="1" name="detection_3">
                        <label for="detection_3_1">Somewhat influenced</label>
                        <br>
                        <input type="radio" id="detection_3_2" value="2" name="detection_3">
                        <label for="detection_3_2">Not influenced at all</label>
                        <br>
                    </form>
                </div class="each_detection">
            </div>
        </div>
        
        <div class="question_phase_4" id="question_6">
            <p>Q3. How important is ideology in forming your opinions on public issues?</p>
            <div class="detection_wrap">
                <div class="each_detection">
                    <form>
                        <input type="radio" id="detection_4_0" value="0" name="detection_4">
                        <label for="detection_4_0">Very important</label>
                        <br>
                        <input type="radio" id="detection_4_1" value="1" name="detection_4">
                        <label for="detection_4_1">Moderately important</label>
                        <br>
                        <input type="radio" id="detection_4_2" value="2" name="detection_4">
                        <label for="detection_4_2">Not important at all</label>
                        <br>
                    </form>
                </div class="each_detection">
            </div>
        </div>
        
        <button type="button" class="button_big" disabled="true">Submit</button>
    `;

    // 标志 phase 4 数据准备就绪
    phase4DataReady = true;
});

// 在需要时调用 init_phase_4
function init_phase_4() {
    if (!phase4DataReady) {
        console.error("Phase 4 data is not ready yet.");
        return;
    }

    if (userData.quiz_type == "pilot_1")
        evaluation_types = ['ideology', 'competence', 'warmth'];
    else if (userData.quiz_type == 'condition_1' || userData.quiz_type == 'condition_2' || userData.quiz_type == 'condition_3')
        evaluation_types = ['ideology'];

    const body = document.querySelector(".quiz_body");
    body.innerHTML = window.phase_4_body_string;

    const inputs = document.querySelectorAll('input[type="radio"]');
    const button = document.querySelector('.button_big');
    data.type_D_answers = [null, null, null];
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.name == "detection_2") {
                data.type_D_answers[0] = parseInt(input.value);
            } else if (input.name == "detection_3") {
                data.type_D_answers[1] = parseInt(input.value);
            } else if (input.name == "detection_4") {
                data.type_D_answers[2] = parseInt(input.value);
            }

            if (data.type_D_answers[0] !== null &&
                data.type_D_answers[1] !== null &&
                data.type_D_answers[2] !== null) {
                button.disabled = false;
            }
        });
    });
    document.querySelector("button").addEventListener("click", enter_next);
}

// document.addEventListener('splitAnswersReady', function() {
//     console.log(window.split_answers); // 这时 split_answers 已经初始化，应该能正确打印
//
//     let dot_pos_1 = (window.split_answers[0][0] + 2) / 4;
//     let dot_pos_3 = (window.split_answers[0][2] + 2) / 4;
//
//     const color_0 = interpolateColor(dot_pos_1);
//     const color_2 = interpolateColor(dot_pos_3);
//
//     function getIdeologyLabel(color) {
//         switch (color.toLowerCase()) {
//             case 'rgb(19, 59, 255)':
//             case 'rgb(55, 89, 252)':
//                 return 'strongly liberal';
//             case 'rgb(92, 118, 249)':
//             case 'rgb(128, 148, 246)':
//                 return 'liberal';
//             case 'rgb(164, 178, 243)':
//             case 'rgb(201, 207, 240)':
//                 return 'mildly liberal';
//             case '#ededed':
//                 return 'neutral';
//             case 'rgb(240, 206, 201)':
//             case 'rgb(243, 175, 166)':
//                 return 'mildly conservative';
//             case 'rgb(246, 144, 130)':
//             case 'rgb(249, 113, 94)':
//                 return 'conservative';
//             case 'rgb(252, 82, 59)':
//             case 'rgb(255, 51, 23)':
//                 return 'strongly conservative';
//             default:
//                 return 'unknown';  // 处理未知颜色的情况
//         }
//     }
//
//     const label_0 = getIdeologyLabel(color_0);
//     const label_2 = getIdeologyLabel(color_2);
//     // 在这里继续使用 label_0 和 label_2 进行后续操作
// });
//
// const phase_4_body_string = `
//         <h1>Additional questions</h1>
//         <p>
//             Now you have completed the main part of this survey experiment. Before you are redirected to the Connect platform, we would like to ask you some additional questions. Your answers will <b>NOT</b> be disclosed to the other two participants. After answering these questions, please click “Submit”. Then you will be directed to the last page of this survey.
//         </p>
//         <hr>
//         <!--<div class="question_phase_4" id="question_1">
//             <p>Q. Based on previous answers in Phase I, please choose the ideology of yourself and the other participants.</p>
//             <div id="evaluation_ideology" class="evaluation"></div>
//         </div>
//
//         <div class="pilot_1_additional_questions">
//             <div class="question_phase_4" id="question_2">
//                 <p>Q. How competent do you think the other participants are?
//                 <div id="evaluation_competence" class="evaluation"></div>
//             </div>
//             <div class="question_phase_4" id="question_3">
//                 <p>Q. Do you think the other participants would be friendly to you?
//                 <div id="evaluation_warmth" class="evaluation"></div>
//             </div>
//         </div>  注释了文字显示部分-->
//
//
//
//     <div class="question_phase_4" id="question_4">
//         <p>Q1. In phase 2, to what extent were your answers influenced by ${pseudonyms_chosen[0]} group's (${label_0}) answers?</p>
//         <div class="detection_wrap">
//             <div class="each_detection">
//                 <form>
//                     <input type="radio" id="detection_2_0" value="0" name="detection_2">
//                     <label for="detection_2_0">Strongly influenced</label>
//                     <br>
//                     <input type="radio" id="detection_2_1" value="1" name="detection_2">
//                     <label for="detection_2_1">Somewhat influenced</label>
//                     <br>
//                     <input type="radio" id="detection_2_2" value="2" name="detection_2">
//                     <label for="detection_2_2">Not influenced at all</label>
//                     <br>
//                 </form>
//             </div class="each_detection">
//         </div>
//     </div>
//
//     <div class="question_phase_4" id="question_5">
//         <p>Q2. In phase 2, to what extent were your answers influenced by ${pseudonyms_chosen[2]} group's (${label_2}) answers?</p>
//         <div class="detection_wrap">
//             <div class="each_detection">
//                 <form>
//                     <input type="radio" id="detection_3_0" value="0" name="detection_3">
//                     <label for="detection_3_0">Strongly influenced</label>
//                     <br>
//                     <input type="radio" id="detection_3_1" value="1" name="detection_3">
//                     <label for="detection_3_1">Somewhat influenced</label>
//                     <br>
//                     <input type="radio" id="detection_3_2" value="2" name="detection_3">
//                     <label for="detection_3_2">Not influenced at all</label>
//                     <br>
//                 </form>
//             </div class="each_detection">
//         </div>
//     </div>
//
//     <div class="question_phase_4" id="question_6">
//         <p>Q3. How important is ideology in forming your opinions on public issues?</p>
//         <div class="detection_wrap">
//             <div class="each_detection">
//                 <form>
//                     <input type="radio" id="detection_4_0" value="0" name="detection_4">
//                     <label for="detection_4_0">Very important</label>
//                     <br>
//                     <input type="radio" id="detection_4_1" value="1" name="detection_4">
//                     <label for="detection_4_1">Moderately important</label>
//                     <br>
//                     <input type="radio" id="detection_4_2" value="2" name="detection_4">
//                     <label for="detection_4_2">Not important at all</label>
//                     <br>
//                 </form>
//             </div class="each_detection">
//         </div>
//     </div>
//
//     <button type="button" class="button_big" disabled="true">Submit</button>
//     `;
//
// function init_phase_4() {
//     if (userData.quiz_type == "pilot_1")
//         evaluation_types = ['ideology', 'competence', 'warmth'];
//     else if (userData.quiz_type == 'condition_1' || userData.quiz_type == 'condition_2' || userData.quiz_type == 'condition_3')
//         evaluation_types = ['ideology'];
//     const body = document.querySelector(".quiz_body");
//     body.innerHTML = phase_4_body_string;
//     // document.querySelectorAll("input[type=range]").forEach((input) => {
//     //     input.addEventListener('input', display_values);
//     // });
//     const inputs = document.querySelectorAll('input[type="radio"]');
//     const button = document.querySelector('.button_big');
//     data.type_D_answers = [null, null];
//     inputs.forEach(input => {
//         input.addEventListener('change', () => {
//             if (input.name == "detection_2")
//                 data.type_D_answers[0] = parseInt(input.value);
//             else
//                 data.type_D_answers[1] = parseInt(input.value);
//             if (data.type_D_answers[0] !== null && data.type_D_answers[1] !== null) {
//                 button.disabled = false;
//             }
//         });
//     });
//     document.querySelector("button").addEventListener("click", enter_next);
// }



function all_finish_answering() {
    document.removeEventListener("timeup", all_finish_answering);
    //这一行移除了之前可能添加在 document 上的 "timeup" 事件的监听器。这意味着当 "timeup" 事件发生时，all_finish_answering 函数将不再被调用。
    clearInterval(timer);
    //这一行清除了之前可能设置的一个定时器（由 timer 变量引用）。定时器通常用于重复执行某个操作，如定时更新页面内容或倒计时。
    all_bots_timeup = false;
    //这一行将 all_bots_timeup 变量设置为 false。
    //从变量名可以推测，这可能是一个标志，用于指示所有“机器人”（可能是某种参与者或自动化程序）是否已经完成或超时。

    // a lag before "check your answers"
    setTimeout(() => {
        document.querySelector(".instruction").innerHTML = `
            Please check your answers. When it's done, press
            <button type="button" class="button_small">OK</button>
        `;//这一行更新了页面上具有类名 instruction 的元素的内部 HTML。它提示用户检查他们的答案，并在完成后点击一个“OK”按钮。
        display_values();
        document.querySelector("button").addEventListener('click', enter_next);//给页面上的第一个 button 元素添加了一个点击事件监听器。当用户点击这个按钮时，会调用 enter_next 函数。
    },);
}
        //从函数名可以推测，这可能是进入下一个阶段或进行下一步操作的函数
    //lag对应数值是1，所以是延时了1秒钟来完成检查和确认的提示
    //使用 setTimeout 设置了一个延迟执行的操作。这个延迟的时间由 time_configurations['lag'] 的值乘以 1000（转换为毫秒）决定。
    //在延迟结束后，会执行提供的箭头函数




function end_quiz() {//end_quiz 函数主要用于在测验结束时收集数据、更新页面内容，并为用户提供一个按钮来提交数据。提交数据成功后，
    //根据 userData.quiz_type 的值，用户会被重定向到不同的 URL。如果提交数据失败，会在控制台输出错误信息。
    data.total_time = (Date.now() - total_start_time) / 1000;
    //计算测验开始到现在经过的总时间（以秒为单位）。Date.now() 返回当前时间的毫秒数，而 total_start_time 应该是测验开始时的时间戳。
    //两者相减后除以1000得到秒数，然后存储到 data.total_time
    document.querySelector(".quiz_body").innerHTML = end_quiz_string;
    //将页面上具有类名 quiz_body 的元素的内部 HTML 更新为 end_quiz_string 变量的值。这可能用于显示测验结束的提示或信息。
    let button = document.querySelector("button");
    if (userData.participantId != '' && !idExisted) {
        button.disabled = false;
    }//选择页面上的第一个 button 元素，并根据条件（userData.participantId 不为空且 idExisted 为 false）来启用或禁用这个按钮。
    //如果条件满足，按钮将被启用（disabled 属性设置为 false）。
    button.addEventListener('click', () => {
        // send data
        let reason = document.getElementById(`reason`);
        if (reason)
            data.reason = reason.value;//尝试获取页面上 ID 为 reason 的元素，并将其值（如果存在）存储到 data.reason

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
        });//为上面选择的按钮添加一个点击事件监听器。当用户点击按钮时，会执行提供的箭头函数
    });/**使用 jQuery 的 $.post 方法发送一个 POST 请求到服务器。请求的 URL 由 userData.quiz_type 的值动态生成。发送的数据是 data 对象的 JSON 字符串形式，并设置了请求头 Content-Type 为 application/json。

    请求成功后，执行 .done 里的回调函数，根据 userData.quiz_type 的值，重定向到不同的 URL。
    
    如果请求失败，执行 .fail 里的回调函数，并在控制台输出错误信息。 */
}



function attention_check() {//注意力检测
    console.log("Attention Check!");
    document.querySelector(".quiz_body").innerHTML = attention_check_string;
    document.querySelector(".attention_check").addEventListener("change", attention_check_click_handler);
    document.querySelector("button").addEventListener("click",() => {
        document.querySelector(".attention_check").removeEventListener("change", attention_check_click_handler);
        enter_next(); // 注意如果单独使用attentioncheck作为一个新的phase，这里不要enter，要直接init phase3//////////////////////////////////
        // init_phase_3();//20240509版采用这个！！////////////////////////////////////////////////////////////////////////////////////////////
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//choose_identity();//用户选择昵称和头像的环节，20240509实验没有这个环节,如果不启用这个函数，那么匹配环节似乎也没有了？？
//确实如此，但应该先调用一下enter_next来跳过。
function choose_identity_jump_to_phase1(){enter_next();}
choose_identity_jump_to_phase1();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// track inactivity, 2 minutes
const inactivityTimeout = 1000 * 120;//2分钟如果没有答题，认为是没有答题，重新开始
let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(inactivityPopup, inactivityTimeout);
}

//弹出不活跃提示
function inactivityPopup() {
    alert("We noticed that you have been inactive for an extended period. To maintain the accuracy of the experiment, we kindly request you to restart the quiz and actively complete it. Your participation is essential, and we appreciate your cooperation. Thank you.");
    location.reload();
}

document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("mousedown", resetInactivityTimer);
document.addEventListener("keypress", resetInactivityTimer);

/**document.addEventListener("mousemove", resetInactivityTimer); 
 * 这行代码的意思是，当用户在文档（通常指整个网页）上移动鼠标时，resetInactivityTimer函数会被调用。
document.addEventListener("mousedown", resetInactivityTimer); 
这行代码的意思是，当用户在文档上按下鼠标按键时，resetInactivityTimer函数会被调用。
document.addEventListener("keypress", resetInactivityTimer); 
这行代码的意思是，当用户在文档上按下并释放某个键时（但不包括如Shift、Ctrl、Alt等修饰键），resetInactivityTimer函数会被调用。
 */

resetInactivityTimer();
/**用来重置某种不活跃计时器的。例如，在一个应用中，你可能想要在用户进行某些操作时（如移动鼠标、点击鼠标或按下键盘）重置一个表示用户不活跃状态的计时器。
 * 这样，当计时器达到某个阈值时，你可以执行一些操作，如自动保存、弹出提示或执行其他与用户不活跃状态相关的功能 */
