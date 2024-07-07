const pseudonyms = ["Alex", "Blair"];// 这是进入实验时选的名字，原来是"Alice", "Alex", "Betty", "Bob", "Catherine", "Charlie", "Emily", "David", "Grace", "Edward","Jane", "Frank", "Laura", "Henry", "Maria", "John", "Nicole", "Kevin", "Sandra", "Michael"

//const phase_length = [1, [6, 4, 3], 1, 5, 1];//原来是5道题，现在换成6个问题
const phase_length = [1, [6, 4, 3], 1, 6, 1];//phase0选头像名字（已弃用），phase1答题，phase2标签，phase3答题，phase4 additional question

const avatar_num = 6;//新的实验是6个空白头像，原来是有6个卡通图像
//const avatar_num = 3;

const labels = [
    'Liberal',
    'Somewhat liberal',
    'Somewhat conservative',
    'Conservative',
    'Kind',
    'Indifferent',
    'Mature',
    'Naive',
    'Competent',
    'Incompetent',
];//phaseI结束后人给自己和俩bot贴标签
//注意，在20240417之后'Somewhat conservative'是序号2第三个，'Conservative'是序号3第四个，这两个互换位置了！！

const num_of_identity_choices = pseudonyms.length;
//////////////////////////////////////////////////////////////////////////20240509
var pseudonyms_chosen = [, "You", ];
///////选名字的逻辑//////////////////////////////////////////////////////////////////////////////
// get pseudonyms
/*let gender = pseudonym_chosen % 2;  // 0 is female, 1 is male
let pseudonyms_to_choose = [];
for (let index = gender; index < pseudonyms.length; index += 2) {
    pseudonyms_to_choose.push(index);
}
pseudonyms_to_choose.splice(pseudonyms_to_choose.indexOf(pseudonym_chosen), 1);
//let firstbotname_choose = [6];
let pseudonyms_index_chosen = randomly_choose1(pseudonyms_to_choose, 2);//随机给bot的名字和头像，不含0，专门用的randomly_choose1
//pseudonyms_index_chosen[0] = 6; //将第一个bot固定成第7个名字(下标6)
pseudonyms_index_chosen.splice(1, 0, pseudonym_chosen);//将 pseudonym_chosen 插入到 pseudonyms_index_chosen 数组的 human_index 位置，*/
//而不删除任何元素
/////////////////////////////////20240701，直接指定两个名字///////////////////////////////////
//pseudonyms_chosen[0] = pseudonyms[pseudonyms_index_chosen[0]];
//pseudonyms_chosen[2] = pseudonyms[pseudonyms_index_chosen[2]];

let randomNumber = Math.random();//确定 who_answer_first的随机数////////////////////////////////////////////////
randomNumber = randomNumber < 0.5 ? 0 : 2;
let randomnumber_name = randomNumber/2;

pseudonyms_chosen[0] = pseudonyms[randomnumber_name];
pseudonyms_chosen[2] = pseudonyms[1-randomnumber_name];


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const tickmark_string = `<div class="tick-mark"></div>`;//包含了一个 tick mark（打勾）图标的 HTML它可能被用来表示某个操作成功完成或某个状态被激活。
const loader_string = `<div class="loader"></div>`;//实现了一个“正在加载转圈”效果

const section_rule_string = [
    ``,

    {
        "pilot_1":
            `In what follows, you will be asked 10 questions on public issues.
            <span class="br_small"></span>
            <input type="checkbox" id="checkbox_1">
            <label for="checkbox_1">
                For each question, please provide your own answer by clicking the option that represent your own attitude and then click “Submit”.
            </label>
            <span class="br_small"></span>
            <input type="checkbox" id="checkbox_2">
            <label for="checkbox_2">
                After answering each question, all the participants' answers will be shown to each other.
            </label>`,

        "default":
            `In what follows, you will be asked 10-13 questions on either public issues or personal preferences. For each question, please choose your answer and then click “Submit”.<br><br>

            We have randomly drawn two previous participants from our earlier experiment dataset. They are randomly assigned alias names <b>${pseudonyms_chosen[0]}</b> and <b>${pseudonyms_chosen[2]}</b> respectively. For each question in Phase 1, their answers will be shown to you after you submit your own answer. `,
    },


    ``,

    `<p class="p_instruction">
    In what follows, you will be asked 6 questions on either hard facts, future-trend predictions, controversial public issues or design problems.
    </p>
    <br>
    Together with each question, you will see the following information:<br>
    <span class="br_small"></span>
    1) <b>${pseudonyms_chosen[0]}</b> and <b>${pseudonyms_chosen[2]}</b>'s answers to the question;<br>
    <span class="br_small"></span>
    2) <b>${pseudonyms_chosen[0]}</b>'s and <b>${pseudonyms_chosen[2]}</b>'s and <b>your</b> positions on the ideology spectrum. <br>
    <span class="br_big"></span>
    Please then choose your answer to the question being asked by clicking the option. <br>
    <span class="br_big"></span>
    Click “Submit” when you finish answering the five questions.
    `,

    `<p class="p_instruction">
        In what follows, you will be asked 3 questions on your attitude towards ideology and the other participants.
    </p>
    <span class="br_small"></span>
    <input type="checkbox" id="checkbox_1">
    <label for="checkbox_1">
        For each question, please provide your own answer by clicking on the corresponding option, and then click “Submit”.
    </label>
    <span class="br_small"></span>
    <input type="checkbox" id="checkbox_2">
    <label for="checkbox_2">
        Your answers will <b>NOT</b> be disclosed to the others.
    </label>`
];

const rule_string = `
    <h1>Instructions</h1>
    <div class="rules">
        <p>
            <b>Please read the following instructions and check the box next to each item.</b>
        </p>
        <span class="br_big"></span>

        <div class="specific_rules"></div>

        <span class="br_big"></span>
        When you have read the above instructions, please check the box below and press continue:
        <span class="br_small"></span>
        <input type="checkbox" id="i0">
        <label for="i0">I have carefully read the instructions and am ready to continue with the survey.</label>
        <button type="button" class="button_big" disabled="true">Continue</button>
    </div>

`;

const slider_string = `
    <input type="range" max="3" min="-3" step="0.1" oninput="get_slider_value(this)">
    <div class="answers_mark"></div>
    <div class="scales">
        <div class="scale" style="left: 10px"></div>
        <div class="scale" style="left: 107.5px"></div>
        <div class="scale" style="left: 204px"></div>
        <div class="scale" style="left: 301px"></div>
        <div class="scale" style="left: 398px"></div>
        <div class="scale" style="left: 494px"></div>
        <div class="scale" style="left: 591px"></div>
    </div>
    <div class="mark_texts"></div>
`;

const slider_string_short = `
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
`;

const input_select_string = `
    <div class="question"></div>
    <div class="statement"></div>
    <div class="answer_choices"></div>
    <div class="instruction"></div>
    <div class="identity_wrap answer_status"></div>
`;

const phase_0_body_string = `
    <h1>Please choose your pseudonym and cartoon avatar</h1>
    <div class="splits_wrap">
        <div class="split phase_0_left">
        <!-- 这是一个HTML注释:下面分别是提示+选名字、头像 -->
            <p>Before the experiment, please pick a pseudonym for yourself from the following list:</p>
            <div class="pseudonyms_list"></div>
            <p>Please click a cartoon avatar from the following:</p>
            <div class="identity_wrap avatars_list"></div>
            <div class="avatar_notification"></div>
        </div>
        <div class="split phase_0_right">
            <p class="p_centered">
                Your identity will be displayed as:
            </p>
            <div class="identity_chosen">
                <img src="/static/avatars/avatar_default.png" />
                <span>Name</span>
            </div>
            <form>
                <input type="checkbox" id="cb_0">
                <label for="cb_0">The other two participants will see your pseudonym and carton avatar.</label>
                <button type="button" class="button_big button_checked" disabled="true">Proceed to Phase I</button>
            </form>
        </div>
    </div>
`;
/* <button type="button" class="button_big button_checked" disabled="true">Proceed to Phase I</button>
1个JS中的button，展示的类型是big button,目前是禁用的状态。
*/
const phase_1_body_string = `
    <div class="split left">
        ${input_select_string}
    </div>

    <div class="split right">
        <div class="answers_side">
            <h3>Answers</h3>
            <div class="caption">(Your answers are highlighted)</div>
            <table class="table_answers">
            </table>
        </div>
    </div>
`;

/*const phase_2_label_string = `
    <div class="instruction_phase_2">
        <p>
            For each participant (including yourself), please pick <b>one to three</b> labels that best describe him/her.
        </p>
    </div>
    <div class="identity_wrap labeling_wrap"></div>
    <div class="instruction_phase_2">
        <p>Please pick at least one label for each participant. The labels you pick will remain on their name cards in the rest of this experiment. After you have finished picking labels, press "Submit" to proceed.
    </div>
    <button type="button" class="button_big" disabled="true">Submit</button>
`;*/

const phase_2_label_string = `
    
    
    <div class="question_phase_2" id="question_1"> 
        <p> Below you will see three scrollbars, for the two previous participants and yourself respectively.  Based on the answers in Phase 1, please pull each scrollbar to the position that best describes the corresponding person's ideology.</p>
        <div id="evaluation_ideology" class="evaluation"></div>
    </div>

    
<button type="button" class="button_big" disabled="true">Submit</button>

`;

const phase_4_evaluate_string = `
    <form>
        <label for="ideology"></label>
        <select id="ideology">
            <option value="none" selected disabled hidden>Select an Option</option>
            <option value="0">Extremely Liberal</option>
            <option value="1">Mildly Liberal</option>
            <option value="2">Neutral</option>
            <option value="3">Mildly Conservative</option>
            <option value="4">Extremely Conservative</option>
        </select>
    </form>
`;

//问题1，拖轴；问题2，3是piolt1独有；问题4，选职业,问题5，6是多大程度受到影响。
//20240506:选职业部分删掉bot选项
const phase_4_body_string = `
    <h1>Additional questions</h1>
    <p>
        Now you have completed the main part of this survey experiment. Before you are redirected to the Connect platform, we would like to ask you some additional questions. Your answers will <b>NOT</b> be disclosed to the other two participants. After answering these questions, please click “Submit”. Then you will be directed to the last page of this survey.
    </p>
    <hr>
    <!--<div class="question_phase_4" id="question_1">
        <p>Q. Based on previous answers in Phase I, please choose the ideology of yourself and the other participants.</p>
        <div id="evaluation_ideology" class="evaluation"></div>
    </div>

    <div class="pilot_1_additional_questions">
        <div class="question_phase_4" id="question_2">
            <p>Q. How competent do you think the other participants are?
            <div id="evaluation_competence" class="evaluation"></div>
        </div>
        <div class="question_phase_4" id="question_3">
            <p>Q. Do you think the other participants would be friendly to you?
            <div id="evaluation_warmth" class="evaluation"></div>
        </div>
    </div>  注释了文字显示部分-->

    

<div class="question_phase_4" id="question_4">
    <p>Q. In phase II,to what extent were your answers influenced by the one who answered each question first?</p>
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
    <p>Q. How important is ideology in forming your opinions on public issues?</p>
    <div class="detection_wrap">
        <div class="each_detection">
            <form>
                <input type="radio" id="detection_3_0" value="0" name="detection_3">
                <label for="detection_3_0">Very important</label>
                <br>
                <input type="radio" id="detection_3_1" value="1" name="detection_3">
                <label for="detection_3_1">Moderately important</label>
                <br>
                <input type="radio" id="detection_3_2" value="2" name="detection_3">
                <label for="detection_3_2">Not important at all</label>
                <br>
            </form>
        </div class="each_detection">
    </div>
</div>


    <button type="button" class="button_big" disabled="true">Submit</button>
`;// phase4是结束后的addition question,后面两个是新加入的问题

/**HTML结构：
<div class="each_detection">：这是一个外部容器，它有一个类名each_detection，这个类名可能用于CSS样式化或者JavaScript操作。
子元素：
图片 (<img>)：

src="/static/avatars/avatar_default.png"：指定图片的来源地址。
id="detection_img_1"：给图片元素一个唯一的ID，这可以用于JavaScript或CSS的特定引用。
名称 (<div>)：

class="name_in_detection"：这个div元素有一个类名name_in_detection，可以用于样式化。
id="detection_name_1"：给这个div元素一个唯一的ID。
表单 (<form>)：

这个表单包含多个单选按钮 (<input type="radio">)，用于用户选择。
所有单选按钮的name属性都是detection_1，这意味着这些单选按钮是一组，用户只能选择其中的一个。
每个单选按钮都有一个唯一的id和一个value，value值用于表示用户选择的选项。
<label>元素用于描述每个单选按钮的功能。for属性与相应单选按钮的id相匹配，这样当用户点击标签时，对应的单选按钮也会被选中。
选项：
Wanderer：表示漫游者。
Lawyer：表示律师（注意：这里可能是拼写错误，应为Lawyer）。
Artist：表示艺术家。
Bot：表示机器人。
Entrepreneur：表示企业家。
Blue-Collar worker：表示蓝领工人。
I have no idea：表示没有想法或不确定。
总结：
这个HTML片段可能是用于某种检测或分类结果的展示，允许用户通过单选按钮选择他们认为最合适的类别。同时，该代码也预留了足够的空间，通过ID和类名，可以方便地使用JavaScript或CSS进行进一步的操作和样式化。 */



const attention_check_string = `
    <div class="attention_check">
        <div>
            <h1>Attention check questions</h1>
            <p>1. Please select "Strongly Disagree" to show you are paying attention to this question.</p>
            <form>
                <label>
                    <input type="radio" name="question_1" value="A">Strongly Agree
                </label><br>
                <label>
                    <input type="radio" name="question_1" value="B">Agree
                </label><br>
                <label>
                    <input type="radio" name="question_1" value="C">Disagree
                </label><br>
                <label>
                    <input type="radio" name="question_1" value="D">Strongly Disagree
                </label><br>
            </form>
            <p>2. I work fourteen months a year.</p>
            <form>
                <label>
                    <input type="radio" name="question_2" value="A">Yes, this is true of me.
                </label><br>
                <label>
                    <input type="radio" name="question_2" value="B">No, this is not true of me.
                </label><br>
            </form>
            <p>3. Which of the following country names start with the letter "D"?</p>
            <form>
                <label>
                    <input type="radio" name="question_3" value="A">Chile
                </label><br>
                <label>
                    <input type="radio" name="question_3" value="B">Austria
                </label><br>
                <label>
                    <input type="radio" name="question_3" value="C">Japan
                </label><br>
                <label>
                    <input type="radio" name="question_3" value="D">Denmark
                </label><br>
            </form>
            <button class="button_big" disabled="true">Continue</button>
        </div>
    </div>
`;//attention check,可以用来设置选项的文本

const reason_wrap_string = `
    <span class="br_small"></span>
    <p>If you perceived them as bots, could you please share what led you to this conclusion? Your insights are invaluable in enhancing our experiment effectiveness.</p>
    <span class="br_small"></span>
    <textarea id="reason" name="reason" rows="4" cols="80" style="resize: none; font-family: Arial, Helvetica, sans-serif;", placeholder="response time, answer pattern, etc." max_length="500"></textarea>
`;

const end_quiz_string = `
    <div class="end">
        <h1>For Your Information</h1>
        <p>
        Thank you for completing this survey!
            <span class="br_small"></span>
            <p>At the end of this survey, we would like to inform you that we took a deceptive measure in our experiment: <b>${pseudonyms_chosen[0]}</b> and <b>${pseudonyms_chosen[2]}</b>’s answers in Phase 1 are indeed drawn from two real persons. But their answers in Phase 2 are randomly generated by us. We sincerely ask for your pardon and hope you understand that this is a necessary measure to achieve the objective of our study.</p>
            <span clas="br_big"></span>
            <div class="bot_detection">
                <p>It would be greatly appreciated if you could provide some feedback below about the experiment procedure or how you feel during the experiment. Your comments will greatly contribute to improving the effectiveness of our experiment.</p>
                <textarea id="reason" maxlength="100"></textarea>
                <span class="br_big"></span>
            </div>
            <p>Thanks again for your participation. By clicking “Finish”, you will be redirected back to the Connect platform and get your rewards.</p>
        </p>
        <button type="button" class="button_big" disabled="true">Finish</button>
    </div>
`;

const mark_texts = {
    'issue': [
        `Definitely<br><b>NO</b>`,
        `Strongly<br>disagree`,
        `Somewhat<br>disagree`,
        `Neutral`,
        `Somewhat<br>agree`,
        `Strongly<br>agree`,
        `Definitely<br><b>YES</b>`
    ],

    'prediction': [
        `Impossible`,
        `Very<br>unlikely`,
        `Maybe<br>not`,
        `Not<br>sure`,
        `Maybe`,
        `Very<br>likely`,
        `Deﬁnitely`
    ]
};

const phase_II_range_string = `
    <div class="range-with-description">
    <div style="position: relative; color: blue; margin-left: 10px;">strongly liberal</div>
    <div class="range-container">
        <div class="custom-range" id="custom-range1"></div>
        <div class="range-border"></div>
        <div class="spectrum"></div>
        <div class="name-with-dot" id="name-with-dot1">
            <div class="arrow-up-choice" id="arrow_up_1">⇧</div>
            <div class="name" id="name1" style="font-size: 13px; font-weight: bold;">${pseudonyms_chosen[0]}
            </div>
            <div class="dot" id="dot1"></div>
            <div class="arrow-down-choice" id="arrow_down_1">⇩</div>
        </div>

        <div class="name-with-dot" id="name-with-dot2">
            <div class="arrow-up-choice" id="arrow_up_2">⇧</div>
            <!-- <div class="choice" id="choice2"></div> -->
            <div class="name" id="name2" style="font-size: 13px; font-weight: bold;">${pseudonyms_chosen[1]}
            </div>
            <div class="dot" id="dot2"></div>
            <div class="arrow-down-choice" id="arrow_down_2">⇩</div>
        </div>

        <div class="name-with-dot" id="name-with-dot3">
            <div class="arrow-up-choice" id="arrow_up_3">⇧</div>
            <div class="name" id="name3" style="font-size: 13px; font-weight: bold;">${pseudonyms_chosen[2]}
            </div>
            <div class="dot" id="dot3"></div>
            <div class="arrow-down-choice" id="arrow_down_3">⇩</div>
        </div>
    </div>
    <div style="position: relative; color: red">strongly conservative</div>
    </div>
`;