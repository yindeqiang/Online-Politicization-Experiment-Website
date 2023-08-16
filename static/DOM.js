const pseudonyms = [
    "Alice", "Alex", "Betty", "Bob", "Catherine", "Charlie", "Emily", "David", "Grace", "Edward",
    "Jane", "Frank", "Laura", "Henry", "Maria", "John", "Nicole", "Kevin", "Sandra", "Michael"
];

const phase_length = [1, [6, 4, 3], 1, 6, 1];

const avatar_num = 6;

const labels = [
    'Radically liberal',
    'Mildly liberal',
    'Mildly conservative',
    'Radically conservative',
    'Sympathetic',
    'Indifferent',
    'Mature',
    'Naive',
    'Competent',
    'Incompetent'
];

const num_of_identity_choices = pseudonyms.length;

const tickmark_string = `<div class="tick-mark"></div>`;
const loader_string = `<div class="loader"></div>`;

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
            `In what follows, you will be asked 10-13 questions on either public issues or personal preferences.
            <span class="br_small"></span>
            <input type="checkbox" id="checkbox_1">
            <label for="checkbox_1">
                For each question, please provide your own answer by clicking the option that represent your own attitude and then click “Submit”.
            </label>
            <span class="br_small"></span>
            <input type="checkbox" id="checkbox_2">
            <label for="checkbox_2">
                After answering each question, all the participants' answers will be shown to each other.
            </label>
            <span class="br_big"></span>
            <input type="checkbox" id="checkbox_3">
            <label for="checkbox_3">
                After Phase I, you will be asked to pick 1-3 labels that best describe how you think of yourself and the other two participants respectively. So <b>please be aware of their answers in this phase</b>. The other two participants will <b>NOT</b> see the labels you pick.
            </label>`,
    },


    ``,

    `<p class="p_instruction">
        In what follows, you will be asked 6 questions on either hard facts, or future-trend predictions, or controversial public issues.
    </p>
    <span class="br_small"></span>
    <input type="checkbox" id="checkbox_1">
    <label for="checkbox_1">
        For each question, one of the three participants will be randomly nominated to answer the question first. Then the question together with her/his answer will be shown to the other two participants. The other two also need to answer the question, but their answers are <b>NOT</b> disclosed.
    </label>
    <span class="br_small"></span>
    <input type="checkbox" id="checkbox_2">
    <label for="checkbox_2">
        For each question, you will know which participant is randomly picked. When it is your turn to answer the question, please pull the scrollbar to the position that represent your own attitude, and then click “Submit”.
    </label>`,

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
            <p>Before the experiment, please pick a pseudonym for yourself from the following list:</p>
            <div class="pseudonyms_list"></div>
            <p>Please click a cartoon avatar from the following:</p>
            <div class="identity_wrap avatars_list"></div>
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

const phase_2_label_string = `
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
`;

const phase_3_body_string = `
    <div class="instruction_phase_3"></div>
    <div class="identity_wrap phase_3_wrap"></div>
    <div class="question_phase_3"></div>
    <div class="statement_phase_3"></div>
    <div class="input">${slider_string}</div>
    <div class="operation">
        <span class="display_value"></span>
        <button type="button" disabled="true">Submit</button>
    </div>
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

const phase_4_body_string = `
    <h1>Additional questions</h1>
    <p>
        Now you have completed the main part of this survey experiment. Before you are redirected to the Connect platform, we would like to ask you three additional questions. Your answers will <b>NOT</b> be disclosed to the other two participants. After answering these three questions, please click “Submit”. Then you will be directed to the last page of this survey.
    </p>
    <hr>
    <div class="question_phase_4" id="question_1">
        <p>Q1. Based on the answers in Phase I, please choose the ideology of yourself and the other participants.</p>
        <div id="evaluation_ideology" class="evaluation"></div>
    </div>
    <div class="question_phase_4" id="question_2">
        <p>Q2. How competent do you think the other participants are?
        <div id="evaluation_competence" class="evaluation"></div>
    </div>
    <div class="question_phase_4" id="question_3">
        <p>Q3. Do you think the other participants would be friendly to you?
        <div id="evaluation_warmth" class="evaluation"></div>
    </div>
    <div class="question_phase_4" id="question_4">
        <p>Q4. Which of the following identities do you think can best describe the other participants?</p>
        <div class="detection_wrap">
            <div class="each_detection">
                <img src="/static/avatars/avatar_default.png" id="detection_img_0"/>
                <div class="name_in_detection" id="detection_name_0">Name</div>
                <form>
                    <input type="radio" id="detection_0_0" value="0" name="detection_0">
                    <label for="detection_0_0">Wanderer</label>
                    <br>
                    <input type="radio" id="detection_0_1" value="1" name="detection_0">
                    <label for="detection_0_1">Lawyer</label>
                    <br>
                    <input type="radio" id="detection_0_2" value="2" name="detection_0">
                    <label for="detection_0_2">Artist</label>
                    <br>
                    <input type="radio" id="detection_0_3" value="3" name="detection_0">
                    <label for="detection_0_3">Bot</label>
                    <br>
                    <input type="radio" id="detection_0_4" value="4" name="detection_0">
                    <label for="detection_0_4">Entrepreneur</label>
                    <br>
                    <input type="radio" id="detection_0_5" value="5" name="detection_0">
                    <label for="detection_0_5">Blue-Collar Worker</label>
                    <br>
                </form>
            </div class="each_detection">

            <div class="each_detection">
                <img src="/static/avatars/avatar_default.png" id="detection_img_1"/>
                <div class="name_in_detection" id="detection_name_1">Name</div>
                <form>
                    <input type="radio" id="detection_1_0" value="0" name="detection_1">
                    <label for="detection_1_0">Wanderer</label>
                    <br>
                    <input type="radio" id="detection_1_1" value="1" name="detection_1">
                    <label for="detection_1_1">Lawyer</label>
                    <br>
                    <input type="radio" id="detection_1_2" value="2" name="detection_1">
                    <label for="detection_1_2">Artist</label>
                    <br>
                    <input type="radio" id="detection_1_3" value="3" name="detection_1">
                    <label for="detection_1_3">Bot</label>
                    <br>
                    <input type="radio" id="detection_1_4" value="4" name="detection_1">
                    <label for="detection_1_4">Entrepreneur</label>
                    <br>
                    <input type="radio" id="detection_1_5" value="5" name="detection_1">
                    <label for="detection_1_5">Blue-Collar Worker</label>
                    <br>
                </form>
            </div class="each_detection">

        </div>
    </div>
    <div class="question_phase_4" id="question_5">
        <p>Q5. How much does ideology matter to you when you form your attitudes towards public issues?</p>
        <form class="form_ideology">
            <input type="radio" id="A" value="1" name="preference"/>
            <label for="A">It matters a lot.</label>
            <br>
            <input type="radio" id="B" value="2" name="preference" />
            <label for="B">It matters.</label>
            <br>
            <input type="radio" id="C" value="3" name="preference" />
            <label for="C">It matters only a little bit.</label>
            <br>
            <input type="radio" id="D" value="4" name="preference" />
            <label for="D">Not at all.</label>
        </form>
        <div class="reason_wrap"></div>
    </div>
    <button type="button" class="button_big" disabled="true">Submit</button>
`;

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
`;

const ideology_matters_string = `
    <form class="form_ideology">
        <input type="radio" id="A" value="1" name="preference" checked/>
        <label for="A">It matters a lot.</label>
        <br>
        <input type="radio" id="B" value="2" name="preference" />
        <label for="B">It matters.</label>
        <br>
        <input type="radio" id="C" value="3" name="preference" />
        <label for="C">It matters only a little bit.</label>
        <br>
        <input type="radio" id="D" value="4" name="preference" />
        <label for="D">Not at all.</label>
    </form>
`;

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
            Thank you for finishing in this survey!
            <span class="br_small"></span>
            <p>At the end of this survey, we would like to inform you that we took a deceptive measure in our experiment. Now we are revealing to you the true experiment set-up: Among the three participants, you are the only human. The other two are bots whose behavior is pre-programmed by us. We sincerely ask for your pardon and hope you understand that this is a necessary measure to achieve the objective of our study.</p>
            <span clas="br_big"></span>
            <p>If you've selected 'bot' to describe other participants, it would be greatly appreciated if you could share your reasoning below. Your feedback will greatly contribute to improving the effectiveness of our experiment.</p>
            <textarea id="reason" maxlength="100"></textarea>
            <span class="br_big"></span>
            <p>Thanks again for your participation. By clicking “Finish”, you will be redirected back to the Connect platform and get your rewards.</p>
        </p>
        <button type="button" class="button_big" disabled="true">Finish</button>
    </div>
`;

const phase_1_statements = [
    [
        {
            'statement': "Government regulation of business is necessary to protect the public interest.",
            'type': 'issue',
            'summary': "Business regulation is necessary.",
            'left_attitude': true,
            'extreme': false
        },
        {
            'statement': "Immigrants today strengthen our country because of their hard work and talents.",
            'type': 'issue',
            'summary': 'Immigrants strengthen our country.',
            'left_attitude': true,
            'extreme': false
        },
        {
            'statement': "The best way to ensure peace is through military strength.",
            'type': 'issue',
            'summary': "Ensure peace via military.",
            'left_attitude': false,
            'extreme': false
        },
        {
            'statement': `Racial discrimination is the main reason why many black people can't get ahead these days.`,
            'type': 'issue',
            'summary': 'The black suffer from discrimination.',
            'left_attitude': true,
            'extreme': false
        },
        {
            'statement': "Poor people today have it easy because they can get government benefits without doing anything in return.",
            'type': 'issue',
            "summary": "Poor people have it easy.",
            'left_attitude': false,
            'extreme': false
        },
        {
            'statement': "Homosexuality should be accepted by society.",
            'type': 'issue',
            'summary': 'Homosexuality is acceptable.',
            'left_attitude': true,
            'extreme': false
        }
    ],

    [
        {
            // 'statement': `The so-called 'global warming' is a hoax.`,
            'statement': 'Schools should not impose any form of vaccine mandate.',
            'type': 'issue',
            // 'summary': 'Global warming is a hoax.',
            'summary': 'No vaccine mandate.',
            'left_attitude': false,
            'extreme': true
        },
        {
            'statement': `No civilian should be allowed to possess guns.`,
            'type': 'issue',
            'summary': 'Ban guns.',
            'left_attitude': true,
            'extreme': true
        },
        {
            'statement': `Health is not a business. The government should provide free medical care for every citizen.`,
            'type': 'issue',
            'summary': 'Free healthcare.',
            'left_attitude': true,
            'extreme': true
        },
        {
            'statement': `Abortion, which is essentially murder, should not be allowed under any circumstance.`,
            'type': 'issue',
            'summary': 'Ban abortion.',
            'left_attitude': false,
            'extreme': true
        },
    ],

    [
        {
            'statement': "Do you like pets?",
            'type': 'preference',
            'summary': 'Like pets.',
            'range': ['Like', 'Dislike']
        },
        {
            'statement': 'When you feel tired of work, do you prefer spending time alone or hanging out with friends?',
            'type': 'preference',
            'summary': 'Prefer being alone.',
            'range': ['Alone', `With friends`]
        },
        {
            'statement': "Do you prefer wet or dry weather?",
            'type': "preference",
            'summary': 'Prefer dry weather.',
            'range': ['Wet', 'Dry']
        },
    ]
];

const phase_3_statements = [
    {
        'statement': "If a robot's body, language, behavior, and emotions are no diﬀerent from human beings, then this robot should enjoy the same basic human rights as ordinary people.",
        'type': 'issue'
    },
    {
        'statement': "After artiﬁcial intelligence technology matures, human judges should be replaced by AI. This can better ensure the fairness of court decisions.",
        'type': 'issue'
    },
    {
        'statement': "If it is technically feasible to transfer part of one person's lifetime to another person, the government should allow the legalization of such life trading.",
        'type': 'issue'
    },
    {
        "statement": "The government should invest more scientiﬁc research funding into space exploration instead of virtual reality technology.",
        'type': 'issue'
    },
    {
        'statement': "If scientists discover that a huge asteroid is about to hit and destroy the earth in one year, the government should keep it secret from the public to avoid social panic.",
        'type': 'issue'
    },
    {
        'statement': "If technically feasible, adults without fertility should be allowed to adopt their own clones.",
        'type': 'issue'
    },
    {
        'statement': "Self-driving cars should be programmed to make life-or-death decisions that minimize total harm or death, even if that means sacriﬁcing the driver's own safety.",
        'type': 'issue'
    },
    {
        'statement': "The use of cloning technology should be approved, to provide infertile couples using test-tube fertilization with more embryos to increase their chances of conceiving.",
        'type': "issue"
    },
    {
        'statement': "Everyone should be allowed to use paid advertising to present their point of view on controversial public policy issues, no matter how insane it is.",
        'type': "issue"
    },
    {
        'statement': "If newer technologies become available in the future related to vision or sight, it is appropriate to use technologies to improve a person's normal vision to a level that is greatly beyond normal human capabilities.",
        'type': "issue"
    },
    {
        'statement': "How many homicides were oﬃcially registered in Chicago in 2021?",
        'type': 'fact',
        'range': [100, 1000],
        'step': 10,
        'percentage': false
    },
    {
        'statement': "What was the percentage of the population growth in California from 2010 to 2020?",
        'type': 'fact',
        'range': [0.01, 0.1],
        'step': 0.001,
        'percentage': true
    },
    {
        'statement': "How far on average is Mars from Earth? (in million miles)",
        'type': 'fact',
        'range': [100, 190],
        'step': 1,
        'percentage': false
    },
    {
        'statement': "How many cells on average does an adult body produce every second? (in million)",
        'type': 'fact',
        'range': [18, 30],
        'step': 0.1,
        'percentage': false
    },
    {
        'statement': "How many elevators are there in New York's Empire State Building?",
        'type': 'fact',
        'range': [68, 80],
        'step': 1,
        'percentage': false
    },

    {
        'statement': "In 50 years, cryptocurrencies (such as Bitcoin, Ethereum, or Litecoin) will replace the US dollars and become the oﬃcial currency of the US.",
        'type': 'prediction',
    },
    {
        'statement': "Within 50 years, self-driving technology will be suﬃciently mature that most personal cars will no longer be equipped with a steering wheel.",
        'type': 'prediction'
    },
    {
        'statement': "As artificial-intelligence technology develops, most people will eventually live better lives without having to work.",
        'type': 'prediction'
    },
    {
        'statement': "If scientists invented a non-invasive clinical surgery that could accurately erase people's memory of a certain period, the overall happiness of our society would be greatly improved.",
        'type': 'prediction'
    },
    {
        'statement': "Within the next 100 years, human beings will have contact with intelligent life from other planets.",
        'type': 'prediction'
    },
    {
        'statement': "Within the next 100 years, computer scientists will develop computers with true artificial intelligence. That is, computers that can think for themselves.",
        'type': 'prediction'
    },
    {
        'statement': "In the future, robots and computers with advanced capabilities may be able to do most of the jobs that are currently done by humans today. Within 50 years, the job of software engineers will likely be mostly replaced by robots or computers.",
        'type': "prediction"
    },
    {
        'statement': "If robots and computers were able to perform most of the jobs currently being done by humans, the economy as a whole would be more efficient.",
        'type': "prediction"
    },
    {
        'statement': "Very likely, a breakthrough will occur within the next 5 years in the area of cheaper energy.",
        'type': "prediction"
    },
    {
        'statement': "In the next 50 years, computers will be as effective as people at creating important works of art such as music, novels, movies, or paintings.",
        'type': "prediction"
    }
];

const phase_3_types_first_index = [-1, -1, -1];

let index = 0;
for (let statement_wrap of phase_3_statements) {
    if (statement_wrap.type == "fact") {
        if (phase_3_types_first_index[0] == -1)
            phase_3_types_first_index[0] = index;
    } else if (statement_wrap.type == "prediction") {
        if (phase_3_types_first_index[1] == -1)
            phase_3_types_first_index[1] = index;
    } else {
        if (phase_3_types_first_index[2] == -1)
            phase_3_types_first_index[2] = index;
    }
    index++;
}

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
}

const test_string = `
    <button type="button" class="button_small" id="phase_0">Phase 0</button>
    <button type="button" class="button_small" id="phase_1">Phase 1</button>
    <button type="button" class="button_small" id="phase_2">Phase 2</button>
    <button type="button" class="button_small" id="phase_3">Phase 3</button>
    <button type="button" class="button_small" id="phase_4">Phase 4</button>
    <button type="button" class="button_small" id="phase_end">End</button>
`;