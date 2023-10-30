import pandas
import numpy as np
import matplotlib.pyplot
import pandas as pd
import datetime

human_index = 1

def sliding_average(x, y, window_half_width=0.75, window_slide=0.1):
    sliding_centers = np.arange(x.min(), x.max(), window_slide)
    means = pandas.Series(index=sliding_centers, data=[
        y[x.between(sliding_center - window_half_width, sliding_center + window_half_width, inclusive='right')].mean()
        for sliding_center in sliding_centers
    ]).rename(y.name)
    stds = pandas.Series(index=sliding_centers, data=[
        y[x.between(sliding_center - window_half_width, sliding_center + window_half_width, inclusive='right')].std()
        for sliding_center in sliding_centers
    ]).rename(y.name)
    return [means, means - stds, means + stds]



def savefig(fig, filename, hide_top_spine=True, hide_right_spine=True, transparent=True, dpi=100, tight_layout=True):
    if tight_layout:
        fig.tight_layout()
    for ax in fig.axes:
        ax.spines['top'].set_visible(not hide_top_spine)
        ax.spines['right'].set_visible(not hide_right_spine)
    fig.savefig(filename, transparent=transparent, dpi=dpi)



def plot_with_std(ax, average: pandas.Series, low: pandas.Series, high: pandas.Series):
    ax.plot(average.index, average.values, lw=5, alpha=0.7)
    ax.fill_between(average.index, low, high, alpha=0.2)



def get_datetime_str():
    return f'{datetime.datetime.today():%Y_%m_%d}'



def load_data(conditions, path="data/"):
    df = None
    if isinstance(conditions, int):
        df = pd.read_csv(path + f"condition_{conditions}.csv")
    elif isinstance(conditions, list):
        for condition in conditions:
            df = pd.concat([df, pd.read_csv(path + f"condition_{condition}.csv")])
    else:
        raise ValueError
    return df


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