# Online Politicization Experiment Website Repo

This repo contains the source code for the experiment website which you can run on your local server. You can also rerun or modify the data analysis code in the repo to reproduce the results in the paper.

## 1. Usage

### 1.1. Run the experiment website

Run the following command to install dependencies for the repo:
```bash
conda env create -f environment.yaml
# If this doesn't work you may need to manually install each pacakge via pip or conda
conda activate web_development
```
Then you can start the website on your local server using the following command. The local url displayed in the info should be http://127.0.0.1:5000 (the port may be different). Use your browser to access the website. (*Chrome* or *Firefox* recommended). You can press [Ctrl + C] to terminate the process.
```bash
flask --app app/server --debug run
```

# 技术手册

**修改时间：2024.7.15**，此后的修改可能没有在该手册中体现。

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
- **participantId, assignmentId, projectId**：字符串类型。这是Connect平台规定的participant、assignment以及project标识符。
- **attention_passed**：是否通过了问卷中的attention pass，只有通过了才会被算作有效数据进入分析。通过为1，不通过为0。
- **total_time**：完成问卷需要的总时间
- **ideologies**：
  - ``[a, b, c]``的形式，表示人类受试者在Phase I结束后给三个受试者标注的意识形态，范围为[-1, 1]，颗粒度为0.1，因此共21个选择，越小表示越liberal。
  - **2024.7.15前**：[a, None, b]的形式，在实验中bot会被预设一个意识形态，bot_0以75%的概率选择Conservative（-2），以25%的概率选择Somewhat conservative（-1），bot_2以75%的概率选择Liberal（2），以25%的概率选择Somewhat liberal（-1）（3.17修改前的概率是50%+50%）。None表示human_1的意识形态空缺。
- **identity_choices**：
  - ``[[pseudonym_index, [liberal_score, answer_set]], ...]``的形式，对于人类受试者这三个值都为``null``。
    - ``pseudonym_index``：是指随机分配给bot的名字，有Alex（取值0）和Blair（取值1）两个选择
    - ``liberal_score``, ``answer_set_index``：这两个变量涉及bot的意识形态。``liberal_score``越大表示bot越liberal。我们用Phase I中真人的回答（他们的``liberal_score``+他们的10个答案）来模拟bot，其中``liberal_score``表示10道题目中有多少道题作了liberal的回答。对于给定的``liberal_score``，根据真人回答采样的答案组可以在``script.js``中看到，每个分数可能对应多组答案，因此``answer_set_index``就表示最终抽取的回答组index（从0开始）。当然bot的答案也可以直接从``ideology_answers``这个表项中直接得到。
  - **2024.7.15前**：3个受试者选择的头像和名字，基本可以忽略
- **bot_detected**：
  - 没有这个环节了，可以忽略
  - **2024.7.15前**：部分实验最后问了人类受试者其他受试者的职业，第6个选项是bot，其它则是一些职业（教室、工程师等），借此来判断是否意识到了其他受试者是bot。储存的值为【bot_0的职业选项 * 10 + bot_2的职业选项】。因此如果值为56则代表bot_0不被认为是bot，bot_2被认为是bot。（其实是个完全没有必要的trick，但是现在也就不改了...）
- **submit_time**：提交问卷的时间（是美国东海岸or西海岸的时间）
- **reason**：
  - 问卷结束后会告知受试者另两个参与人的真实身份，收集的文字反馈
  - **2024.7.15前**：部分实验在问卷结束后有询问为什么认为其他受试者是bot，答案字符串储存在这个表项里。

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
    **注意**：2024年3月20日前的condition实验中每个问题的问题序号是唯一不重复的。在这之后的condition实验中，每个问题组（issue、prediction等）的问题序号都从0开始，每个问题组大概有10-15个问题。因此，"idx_of_question"被规定为问题组的序号*20+该问题组中问题的序号，这样可以保证每个问题序号的唯一。
- **non_ideology_answers**：Phase II的答案，同样是一个列表，格式如下。对于answers字段，如果受试者先回答，则bot的回答记为-100（或None）；如果某一个bot先回答，则记录bot和人类受试者的答案，另一个bot的回答记为不存在。
    ```JSON
    {
        "answers": [-100, 1.4, -100],
        "time_to_answer": [4.3, 5.6, 2.4],
        "idx_of_question": 4,
        "who_answers_first": 1      // 2024.7.15后，由于不再有bot，因此取值默认为null
    }
    ```
- **labels**：
  - 已经删除了这个环节
  - **2024.7.15前**：人类受试者给三个人贴的标签，二维列表。元素x表示给x贴的所有标签的列表。
- **additional_answers**：
  - 实验最后额外问的问题，例如意识形态、是否友善等等，每个版本实验的问题可能有较大差异。

## 2. 如何发布实验

（以下为建议的流程，可自由发挥）
### Step 1. 本地调试上传

在本机上确保网站能够正常运行。由于数据库部分无法在本地模拟，可以跳过。确认无误后上传到github；
```
git add -A
git commit -am "your commit message"
```

### Step 2. 更新 Pythonanywhere 网站文件
在本地用flask调试的网站只有你的本机可以访问，外网上的其他人无法访问。因此我们需要在一个对外运行的宿主服务器上挂载我们的网站。在本地调试好文件后，我们就需要把本地的文件同步到服务器中。

在Pythonanywhere网站里打开Consoles中的Bash Console，在命令行里操作：
```bash
cd mysite
git pull
```
确保文件同步后``server.py``的路径为``~/mysite/app/``。这是我之前的操作方式，由于现在**github repo需要更换**，所以步骤会有所不同，可以上网搜索。

单纯更换文件后访问 https://quiz-grawi.pythonanywhere.com 还是更新前的网站，需要在Pythonanywhere中点击Web中的绿色Reload按钮才会刷新网站。注意一旦实验开始，就不要再更新文件或是重载网站，否则会导致受试者界面出现问题。

### Step 3. 在线调试网站
现在需要正式调试受试者会访问的网站，即 quiz-grawi 开头的网址。相当于自己作为一个受试者完成网站的全流程，再在数据库中检查答案是否被正确地登记。

（可以先阅读3.2节）首先我需要假设一个自己的``participantId``（Connect平台上用于标记受试者的ID），可以是任何字符串例如``testId``。例如要访问Condition 2的实验网站时，在url中输入 https://quiz-grawi.pythonanywhere.com/condition_2?participantId=testId ，按照流程完成实验。

随后进入数据库中检查答案是否被正确记录。有2种选择：
- 在Pythonanywhere中，进入Consoles的MySQL console输入指令查看
- 在本地Python代码中拉取数据库查看

我通常采用方法1。以Condition 2为例，假设fake ID是``testId``。步骤如下：

1. 选择``testId``对应的答案：
    ```sql
    select * from condition_2 where participantId="testId";
    ```
2. 检查存储的答案和刚才在网站上填写的答案是否相同（通常我会录屏方便回溯）
3. 删除``testId``对应的答案（**慎重输入，输错了可能会删除所有答案）**：
    ```sql
    delete from condition_2 where participantId="testId";
    ```

如果发现数据库上传有问题，可以在Pythonanywhere中点击Web检查Server Log和Error Log进行Debug。

如果发现了问题需要再修改，就回到Step 1重复流程。

### Step 4. 在Connect平台上发布实验

进入[Connect](https://connect.cloudresearch.com/researcher/dashboard)平台点击Dashboard准备发布实验。步骤如下：

如果要新发布一个Pilot 2实验，可以在历史projects中找到一个Pilot 2实验，点击Clone，后**选择Reuse Link**，确保新的实验和旧的实验在最后使用了相同的跳转url，这样就不需要修改网站的代码。当然新创建一个实验并修改代码中的跳转url也是可运行的。以下表项注意修改：
- **What are you going to call this project internally?** 给这次的实验起个名字方便找
- **How many participants does your project require?**
- **How much are you paying for this project?** 以及 **How long will it take for your project to complete (estimated minutes)?**，价格由完成时间决定。标准为每分钟0.25美元。例如需要10分钟完成则每人支付2.5美元。
- **Demographic Targeting**：Political Ideology要设置每种20%的quota，同时Standard Demographics要添加上所有的General表项，但不设置quota，这样就可以在完成实验后从Connect平台上下载所有受试者的Demographic信息，这个数据是不同于数据库的。

**通常我会先发布20个左右的实验，确认平均完成时间**(80%的受试者需要在这个时间内完成)**，同时写好数据处理的代码查看初步分析结果，确保没有问题后，再正式发布实验。正式发布实验通常选择美国时间的晚上，如果是周末则更好。**

### Step 5. Connect平台的额外处理
Connect平台有一个额外设置是：受试者在完成实验后进入Pending状态，不会立即收到reward，在发布实验者Accept它的数据后才会付钱，当然也可以Refuse，这样就不会付钱。

我们Refuse答案的标准只有一个，就是ta没有通过attention check。我们在Python中得到这些受试者的Connect ID后，就可以在Connect上输入ID选择这些受试者，并Refuse他们的答案，其它的等待7天还是30天后自动Accept就可以了。从经验上看，未通过attention check的受试者不超过5%。

另外，如果Connect平台余额不足，可以让梅老师联系俊铭添加余额。

## 3. 网站设计

### 3.1. 网页组织
- 网站根目录为 https://quiz-grawi.pythonanywhere.com
- 要访问对应实验时，进入对应实验的地址。例如要访问pilot_2时，网址为 https://quiz-grawi.pythonanywhere.com/pilot_1 。共有5个取值：[pilot_1, pilot_2, condition_1, condition_2, condition_3]
- 每个实验的问卷内部分为2个网页。以condition 2为例：
    1. Consent form：https://quiz-grawi.pythonanywhere.com/condition_2
    2. Quiz：https://quiz-grawi.pythonanywhere.com/condition_2/quiz
- 在完成Consent form后点击提交，会跳转进入quiz界面

### 3.2. 网页跳转
当一个受试者从Connect跳转到我们的问卷网站例如 https://www.quiz.com 时，会添加后缀为 https://www.quiz.com?participantId=xxx&assignmentId=xxx&projectId=xxx ，我们便可以通过url获得受试者的三个标识符。在数据库中，我们只需要用``participanId``来区分受试者即可。另外两个ID（``assignmentId``、``projectId``）只是记录了下来，其实没有任何作用。因为在我们所有实验类型的数据库中，``participantId``被设置为索引。由于每个受试者不能同时参加我们的两个实验（在Connect上确保这一点），因此通过`participantId`我们就可以在对应实验的数据库中唯一地确定答案表项，而不需要另两个ID。

关于网站url的具体捕获策略可以在``server.py``中看到，具体含义可以搜索：
```Python
@app.route('/<string:quiz_type>/quiz', methods=['POST', 'GET'])
def quiz(quiz_type):
    # content
```

进入问卷网站后，以下两种情况会在前端报错：
1. 没有添加后缀
2. 添加了后缀但是其中的``participantId``在对应数据库中已经存在

在这两种情况下，实验都可以进行，但是最后页面上的提交（Submit）按钮不可用，因此答案不会录入数据库。可以直观理解为：第1种情况避免了非Connect平台跳转的人完成实验并提交了数据；第2种情况避免了同一个受试者完成某个实验两次导致数据库出错。尽管现实中我们在Connect平台上已经确保了这一点，但我们在测试时也有可能输入两次同样类型的fake ID。

在受试者完成试验后，点击最后一个提交按钮会跳转回Connect平台的某个url，这个url是由Connect提供的、每个实验**唯一**的。换言之，不同的实验会有不同的跳转url，但同一个实验的不同受试者url相同。

### 3.3. 数据上传
数据通过异步post上传到数据库中，在前端不可见。以condition 2为例，上传的url仍然是 https://quiz-grawi.pythonanywhere.com/condition_2/quiz ，区别在于使用了Post的方法。因此上述代码块中对于服务器而言，如果收到Get请求则返回网页内容，收到Post请求则上传请求中包含的数据到数据库。
