# 2023-10-09 responses analysis
import datetime
import numpy
import pandas
import matplotlib.pyplot as plt
from pathlib import Path

def savefig(fig, filename, hide_top_spine=True, hide_right_spine=True, transparent=True, dpi=100, tight_layout=True):
    if tight_layout:
        fig.tight_layout()
    for ax in fig.axes:
        ax.spines['top'].set_visible(not hide_top_spine)
        ax.spines['right'].set_visible(not hide_right_spine)
    fig.savefig(filename, transparent=transparent, dpi=dpi)
# savefig()
today = f'{datetime.datetime.today():%Y-%m-%d}'

def sliding_average(x, y, window_half_width=0.75, window_slide=0.1):
    sliding_centers = numpy.arange(x.min(), x.max(), window_slide)
    return pandas.Series(index=sliding_centers, data=[
        y[x.between(sliding_center - window_half_width, sliding_center + window_half_width, inclusive='right')].mean()
        for sliding_center in sliding_centers
    ]).rename(y.name)

if  __name__ == '__main__':
    
    Path('visualization').mkdir(exist_ok=True)
    for filter_scm in [True, False]:
        for question in ['all', 0, 1]:
            fig, axes = plt.subplots(figsize=(12, 8), nrows=2, ncols=3, sharey=True, sharex=False)
            for row, anchor_activated in enumerate([False, True]):
                for col, anchor_present in enumerate(['Undefined', 'Predefined', 'Predefined but weakened']):
                    ax = axes[row, col]
                    ax.text(x=0.05, y=0.7, s=f'Anchor\n{anchor_present.lower()}, \n{"activated" if anchor_activated else "not activated"}'.replace("&", "\n&"), transform=ax.transAxes, fontsize=15)
                    # ax.set(title=f'Anchor {anchor_present.lower()}, {"activated" if anchor_activated else "not activated"}') #ylim=(-0.1, 3.1),
                    if 0 == col:
                        ax.set(ylabel='Opinion distance' + ('\n(SCM only)' if filter_scm else ''))
                    if 1 == row:
                        ax.set(xlabel='Ideological distance')

                    # load data
                    data_file = 'condition_data/condition_' + str({'Undefined': 1, 'Predefined': 2, 'Predefined but weakened': 3}[anchor_present]) + '.csv'
                    data = pandas.read_csv(data_file, index_col=0)
                    # only use those who did not recognize bots
                    data = data.loc[~data['bot_detection']]
                    # only use validity_level==3 examples
                    if 'validity_level' in data.columns:
                        data = data.loc[3 == data['validity_level']]

                    # filter by scm labels?
                    if filter_scm and ('has_SCM_label' in data.columns):
                        data = data.loc[data['has_SCM_label']]
                        
                    # filter by question id
                    if 'all' != question:
                        data = data.loc[question == data['idx_of_question']]

                    # subgroup: human or bot first
                    if anchor_activated:  # bot answers first
                        data = data.loc[data['who_answers_first'].isin([0, 2])]
                    else:  # human answers first
                        data = data.loc[data['who_answers_first'].isin([1])]

                    # does it vary with ideology distance?
                    if ('ideology_distance' in data.columns) and (1 < len(data['ideology_distance'].unique())):
                        # plot and scatter
                        average = sliding_average(x=data['ideology_distance'], y=data['answer_distance'])  # pandas.Series
                        ax.scatter(data['ideology_distance'], data['answer_distance'], alpha=0.1)
                        ax.plot(average.index, average.values, lw=5)
                    else:
                        ax.violinplot([data['answer_distance']], showmeans=True, showextrema=False)
                        average = data['answer_distance'].mean() # float
                        ax.text(x=1, y=average, s=f'{average:.3f}', verticalalignment='bottom', horizontalalignment='center')
                        ax.set(xlim=[0.5, 1.5])

            savefig(fig, f'visualization/{today}-{"scm" if filter_scm else "all"}-question-{question}.pdf')

    for filter_scm in [True, False]:
        for question in ['all', 0, 1]:
            fig, ax = plt.subplots(figsize=(8, 4))
            for i, anchor in enumerate(['Absent', 'Undefined', 'Predefined']):  # , 'Predefined but weakened'

                # load data
                data_file = 'condition_data/condition_' + str({'Absent': 1, 'Undefined': 1, 'Predefined': 2, 'Predefined but weakened': 3}[anchor]) + '.csv'
                data = pandas.read_csv(data_file, index_col=0)

                # only use those who did not recognize bots
                data = data.loc[~data['bot_detection']]
                # only use validity_level==3 examples
                if 'validity_level' in data.columns:
                    data = data.loc[3 == data['validity_level']]

                # filter by scm labels?
                if filter_scm and ('has_SCM_label' in data.columns):
                    data = data.loc[data['has_SCM_label']]

                if 'all' != question:
                    data = data.loc[question == data['idx_of_question']]
                    
                # absent or present
                if 'Absent' == anchor:
                    data = data.loc[data['who_answers_first'].isin([1])] # human answers first
                else:
                    data = data.loc[data['who_answers_first'].isin([0, 2])] # bot answers first

                # bar or plot
                if anchor in ['Absent', 'Undefined']:
                    average = data['answer_distance'].mean() # float
                    ax.boxplot(data['answer_distance'], 
                               positions={'Absent': [-2], 'Undefined': [-1]}[anchor], 
                               showmeans=True, showfliers=False, medianprops={'linewidth': 0}, meanprops=dict(marker='o', color='k'))

                elif anchor in ['Predefined', 'Predefined but weakened']:
                    average = sliding_average(x=data['ideology_distance'], y=data['answer_distance'])  # pandas.Series
                    ax.plot(average.index, average.values, lw=5, label=anchor, alpha=0.7)

            # wrap up
            ax.legend(loc=0, frameon=False)
            ax.set(xlabel='                      Ideological distance between anchoring bot and human', 
                   ylabel='Opinion distance' + (' (SCM only)' if filter_scm else ''), #ylim=(-0.1, 3.1),
                   xticks=[-2, -1] + list(range(int(ax.get_xlim()[1] + 1))),
                   xticklabels=['No\nanchor', 'Undefined\nanchor'] + list(range(int(ax.get_xlim()[1] + 1)))
                  )
            savefig(fig, f'visualization/{today}-merged-{"scm" if filter_scm else "all"}-question-{question}.pdf')

