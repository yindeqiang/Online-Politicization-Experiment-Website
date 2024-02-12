human_index = 1

phase_1_statements = [
    {
        'statement': "Government regulation of business is necessary to protect the public interest.",
        'type': 'issue',
        'summary': "Business regulation is necessary.",
        'left_attitude': True,
        'extreme': False,
    },
    {
        'statement': "Immigrants today strengthen our country because of their hard work and talents.",
        'type': 'issue',
        'summary': 'Immigrants strengthen our country.',
        'left_attitude': True,
        'extreme': False,
    },
    {
        'statement': "The best way to ensure peace is through military strength.",
        'type': 'issue',
        'summary': "Ensure peace via military.",
        'left_attitude': False,
        'extreme': False
    },
    {
        'statement': "Racial discrimination is the main reason why many black people can't get ahead these days.",
        'type': 'issue',
        'summary': 'The black suffer from discrimination.',
        'left_attitude': True,
        'extreme': False
    },
    {
        'statement': "Poor people today have it easy because they can get government benefits without doing anything in return.",
        'type': 'issue',
        "summary": "Poor people have it easy.",
        'left_attitude': False,
        'extreme': False
    },
    {
        'statement': "Homosexuality should be accepted by society.",
        'type': 'issue',
        'summary': 'Homosexuality is acceptable.',
        'left_attitude': True,
        'extreme': False,
    },
    {
        'statement': 'Schools should not impose any form of vaccine mandate.',
        'type': 'issue',
        'summary': 'No vaccine mandate.',
        'left_attitude': False,
        'extreme': True
    },
    {
        'statement': "No civilian should be allowed to possess guns.",
        'type': 'issue',
        'summary': 'Ban guns.',
        'left_attitude': True,
        'extreme': True
    },
    {
        'statement': "Health is not a business. The government should provide free medical care for every citizen.",
        'type': 'issue',
        'summary': 'Free healthcare.',
        'left_attitude': True,
        'extreme': True
    },
    {
        'statement': "Abortion, which is essentially murder, should not be allowed under any circumstance.",
        'type': 'issue',
        'summary': 'Ban abortion.',
        'left_attitude': False,
        'extreme': True
    },
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
        'range': ['Alone', "With friends"]
    },
    {
        'statement': "Do you prefer wet or dry weather?",
        'type': "preference",
        'summary': 'Prefer dry weather.',
        'range': ['Wet', 'Dry']
    },
]

phase_2_statements = {
    "prediction": [
        {
            "text": "The government should invest more scientific research funding into space exploration instead of virtual reality technology.",
            "alignment": 0,
            "type": "prediction",
            "index": 0,
        },
        {
            "text": "I think development of artificial intelligence should take priority over space engineering.",
            "alignment": 1,
            "type": "prediction",
            "index": 1,
        },
        {
            "text": "In the realm of scientific advancement, it's more crucial to channel efforts and resources into space exploration rather than the development of virtual reality technology.",
            "alignment": 0,
            "type":"prediction",
            "index": 2,
        },
        {
            "text": "If a Nobel Prize for Engineering were to be established, it should be awarded for advancements in virtual reality technology rather than for space exploration.",
            "alignment": 1,
            "type":"prediction",
            "index": 3
        }
    ],

    "issue": [
        {
            "text": "If robots and computers were able to perform most of the jobs currently being done by humans, the economy as a whole would be more efficient.",
            "alignment": 0,
            "type": "issue",
            "index": 4
        },
        {
            "text": "The advancements in Artificial Intelligence won't reduce costs or boost human productivity.",
            "alignment": 1,
            "type": "issue",
            "index": 5
        },
        {
            "text": "In a hypothetical world where robots and AI handle the bulk of human employment, from manufacturing to management, I think this automation revolution would make the economy run smoother.",
            "alignment": 0,
            "type": "issue",
            "index": 6
        },
        {
            "text": "Envision a future where our workforce is predominantly robotic, with AI and machines performing tasks that humans currently do. In my opinion, this radical shift wouldn't result in any boost in economic efficiency.",
            "alignment": 1,
            "type":"issue",
            "index": 7
        }
    ],

    "fact": [
        {
            "text": "What was the percentage of the population growth in California from 2010 to 2020?",
            "range": [0.01, 0.1],
            "step": 0.001,
            "percentage": True,
            "type": "fact",
            "index": 8
        },
        {
            "text": "How many cells on average does an adult body produce every second? (in million)",
            "range": [18, 30],
            "step": 0.1,
            "percentage": False,
            "type": "fact",
            "index": 9
        }
    ]
}

question_title_map = {
    "all": "All questions",
    0: "\"Invest more into space exploration\" (issue)",
    1: "\"Approve cloning\" (issue)",
    2: "\"Population growth\" (fact)",
    3: "\"Cell production\" (fact)",
    4: "\"Erasing memory brings happiness\" (prediction)",
    5: "\"Robots make efficiency\" (prediction)"
}

bot_detection_title_map = {
    "All": "All",
    "Yes": "Bot detected",
    "No": "Bot not detected"
}

label_map = {
    'Liberal': 0,
    'Somewhat liberal': 1,
    'Conservative': 2,
    'Somewhat conservative': 3,
    'Kind': 4,
    'Indifferent': 5,
    'Mature': 6,
    'Naive': 7,
    'Competent': 8,
    'Incompetent': 9,
}


ideology_group_title_map = {
    "all": "All participants",
    0: "Liberal participants",
    1: "Neutral participants",
    2: "Conservative participants"
}