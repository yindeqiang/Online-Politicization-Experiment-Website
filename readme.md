# Online Politicization Experiment Website Repo

This repo contains the source code for the experiment website which you can run on your local server. You can also rerun or modify the data analysis code in the repo to reproduce the results in the paper.

## 1. Usage

### 1.1. Run the experiment website

Run the following command to install dependencies for the repo:
```bash
conda env create -f environment.yaml
conda activate web_development
```
Then you can start the website on your local server using the following command. The local url displayed in the info should be http://127.0.0.1:5000 (the port may be different). Use your browser to access the website. (*Chrome* or *Firefox* recommended). You can press [Ctrl + C] to terminate the process.
```bash
flask --app app/server --debug run
```

# 技术手册

## 1. 数据接口
数据分析的代码在``/data_analysis``下，部分notebook需要从PythonAnywhere的数据库中拉取数据，因此需要将``key.py``放在``/data_analysis``中用于登录平台和数据库。

在界面中，由于人类受试者位于第二个，因此用bot_0代表左边第一个bot，human_1表示人类受试者，bot_2表示最右边的bot，在数据中同样以此顺序存储。

在``server.py``中可以看到各个数据库的表项。
```python
class Condition_2(Base):
    __tablename__ = "condition_2"   # 名称
    ideology_answers = Column(JSON)
    non_ideology_answers = Column(JSON)
    additional_answers = Column(JSON)
    labels = Column(JSON)
```
例如，以上为condition 2实验对应的数据库，除了继承Base数据库的表项外，还另有4个新增的特属于该实验的表项。

### 1.1. Base数据库
- **participantId, assignmentId, projectId**：字符串类型。这是Connect平台规定的受试者标识符。当一个受试者从Connect跳转到我们的问卷网站（e.g. www.quiz.com ）时，会添加后缀为 www.quiz.com?participantId=xxx&assignmentId=xxx&projectId=xxx ，我们便可以通过url获得受试者的标识符。在数据库中，我们只需要用participanId来区分受试者即可。因为我们规定同一个受试者不能同时参加我们的两个实验。
- **attention_passed**：是否通过了问卷中的attention pass，只有通过了才会被算作有效数据进入分析。通过为1，不通过为0。
- **total_time**：完成问卷需要的总时间
- **identity_choices**：[a, None, b]的形式，在实验中bot会被预设一个意识形态，bot_0以75%的概率选择Conservative（-2），以25%的概率选择Somewhat conservative（-1），bot_2以75%的概率选择Liberal（2），以25%的概率选择Somewhat liberal（-1）（3.17修改前的概率是50%+50%）。None表示human_1的意识形态空缺。
- **identity_choices**：3个受试者选择的头像和名字，可以忽略
- **bot_detected**：部分实验最后问了人类受试者其他受试者的职业，第6个选项是bot，其它则是一些职业（教室、工程师等），借此来判断是否意识到了其他受试者是bot。储存的值为【bot_0的职业选项 * 10 + bot_2的职业选项】。因此如果值为56则代表bot_0不被认为是bot，bot_2被认为是bot。（其实是个完全没有必要的trick，但是现在也就不改了...）
- **submit_time**：提交问卷的时间
- **reason**：部分实验在问卷结束后有询问为什么认为其他受试者是bot，答案字符串储存在这个表项里。

### 1.2. Pilot_2数据库
- **pilot_2_answers**：字典的列表，储存每道题的答案和序号。由于做过很多轮pilot_2，因此数据格式每次都略有区别。
- **ideology_label**：受试者自己标注的自己的意识形态，范围是-2到2（在很早之前是-3到3）

### 1.3. Condition数据库
- **ideology_answers**：Phase I的答案，是一个列表，列表中的每个元素格式如下。如果是Condition 1/2则有10个元素（10道题），Condition 3有13个元素。
    ```JSON
    {
        "answers": [0, 1, 1],       // 三个受试者的答案
        "time_to_answer": [4.3, 5.6, 2.4],     // 回答时间
        "idx_of_question": 4        // 问题在问题库中的序号
    }
    ```
- **non_ideology_answers**：Phase II的答案，同样是一个列表，格式如下。对于answers字段，如果受试者先回答，则bot的回答记为-100（或None）；如果某一个bot先回答，则记录bot和人类受试者的答案，另一个bot的回答记为不存在。
    ```JSON
    {
        "answers": [-100, 1.4, -100],
        "time_to_answer": [4.3, 5.6, 2.4],
        "idx_of_question": 4,
        "who_answers_first": 1
    }
    ```
- **labels**：人类受试者给三个人贴的标签，二维列表。元素x表示给x贴的所有标签的列表。
- **additional_answers**：实验最后额外问的问题，例如意识形态、是否友善等等，每个实验的标注略有差异。