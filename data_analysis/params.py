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
    0: "left",
    1: "middle",
    2: "right"
}