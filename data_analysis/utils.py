import pandas
import numpy as np
import matplotlib.pyplot
import pandas as pd
import datetime
import MySQLdb
import sshtunnel
from key import *


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