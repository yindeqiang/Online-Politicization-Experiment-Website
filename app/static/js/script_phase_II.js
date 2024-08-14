var phase_2_orders = {
    set_order: [],
    question_order: [],
    participant_order: [null, 1, null, null],
};

const set_index_to_name = {
    0: "fact",
    1: "prediction",
    2: "issue",
    3: "design",
};

const phase_2_starting_question_index = 12;//从第12个题号开始起始索引
const instruction_background_color = "#d3d3d354";

/**phase_2_orders: 这是一个对象，包含三个数组属性。

set_order: 一个空数组。
question_order: 一个空数组。
participant_order: 一个包含四个元素的数组，其中有两个元素是null，一个元素是1。
set_index_to_name: 这是一个对象，它将数字索引映射到字符串名称。例如，数字0对应字符串"fact"，数字1对应字符串"prediction"等。

phase_2_starting_question_index: 这是一个常量，其值为12。它可能表示第二阶段问题的起始索引。

instruction_background_color: 这是一个颜色字符串，表示某种指令或背景的颜色。其值为"#d3d3d354"，这是一个带有透明度的灰色。 */

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
/**shuffleArray(array): 这是一个函数，用于随机打乱传入的数组。

函数使用Fisher-Yates洗牌算法来打乱数组。
for循环从数组的最后一个元素开始，逐步向前遍历。
在每次迭代中，它都会生成一个随机数j，该数在0到当前索引i（包括i）之间。
然后，它使用ES6的解构赋值来交换array[i]和array[j]的值。
最后，函数返回打乱后的数组。 */


// function determine_phase_3_order() {//确定phaseII的顺序
//     // const num_of_sets = Object.keys(phase_2_statements).length;
//     const num_of_sets = 1;
//     // phase_2_orders.set_order = shuffleArray([...Array(num_of_sets).keys()]);
//
//     phase_2_orders.set_order = [2];//启用的是第三个问题组
//     for (const set_index of phase_2_orders.set_order) {
//         const key = set_index_to_name[set_index];
//         let enabled_length = 0;
//         phase_2_statements[key].forEach((question_info) => {
//             if (question_info.enabled) { enabled_length += 1; }
//         });
//         // console.log(`[DEBUG] Number of questions in ${key}: ${enabled_length}`);
//         const enabledQuestions = phase_2_statements[key].filter(question_info => question_info.enabled);
//         const enabledQuestionsIndexes = enabledQuestions.map(question_info => question_info.index);
//         if (enabledQuestionsIndexes.length != 6) {//之前是5，现在换成6个问题2*3
//             console.error('Assertion failed: enabledQuestionsIndexes does not have a length of 2');
//         }
//         phase_2_orders.question_order.push(shuffleArray(enabledQuestionsIndexes));
//     }
//     /*let randomNumber = Math.random();
//     randomNumber = randomNumber < 0.5 ? 0 : 2;*/
//     //这里的随机数random number换成了全局变量，一开始就决定好发言顺序，这样phaseII里先回答的bot就是前面掉线的bot
//     // phase_2_orders.participant_order = [randomNumber, 1, 2 - randomNumber, randomNumber];
//     phase_2_orders.participant_order = [null, null, null];
//     //这里是随机设置的回答
//     //phase_2_orders.participant_order = random_order;
// }

function determine_phase_3_order() {
    const num_of_sets = 1;
    phase_2_orders.set_order = [2]; // 启用的是第三个问题组
    for (const set_index of phase_2_orders.set_order) {
        const key = set_index_to_name[set_index];
        let enabled_length = 0;
        phase_2_statements[key].forEach((question_info) => {
            if (question_info.enabled) { enabled_length += 1; }
        });

        const enabledQuestions = phase_2_statements[key].filter(question_info => question_info.enabled);
        const enabledQuestionsIndexes = enabledQuestions.map(question_info => question_info.index);

        if (enabledQuestionsIndexes.length != 6) {
            console.error('Assertion failed: enabledQuestionsIndexes does not have a length of 6');
        }

        let shuffledQuestions;
        do {
            shuffledQuestions = shuffleArray(enabledQuestionsIndexes);
        } while (
            shuffledQuestions[0] === 15 || shuffledQuestions[1] === 15 ||
            shuffledQuestions[0] === 16 || shuffledQuestions[1] === 16
        );

        phase_2_orders.question_order.push(shuffledQuestions);
    }
    phase_2_orders.participant_order = [null, null, null];
}

determine_phase_3_order();

/**设置变量:

num_of_sets 被设置为 1，但原本应该是通过 phase_2_statements 对象的键的数量来确定的。由于 phase_2_statements 在这段代码中没有定义，我们假设它可能是一个在其他地方定义的变量，包含了一系列的陈述或问题集。
phase_2_orders.set_order 被硬编码为 [2]，这意味着它只考虑索引为 2 的集合。
处理每个集合:

函数遍历 phase_2_orders.set_order 中的每个 set_index。
使用 set_index_to_name 对象将 set_index 转换为对应的名称（例如 "fact"、"prediction" 等）。
对 phase_2_statements[key] 中的每个 question_info 进行遍历，计算启用的问题的数量（enabled_length）。
使用 filter 方法筛选出启用的问题，并获取它们的索引。
如果启用的问题索引数量不等于 5，则输出一个错误消息。
将启用的问题索引随机打乱后，添加到 phase_2_orders.question_order 数组中。
确定参与者顺序:

生成一个介于 0 和 1 之间的随机数 randomNumber。
如果 randomNumber 小于 0.5，则将其设置为 0，否则设置为 2。
更新 phase_2_orders.participant_order 为 [randomNumber, 1, 2 - randomNumber, randomNumber]。
总结
这个函数的主要目的是：

根据给定的 set_index（这里硬编码为 2），确定哪些问题是启用的，并将它们的索引随机打乱后添加到 question_order 中。
确保启用的问题索引数量是 5，如果不是，则输出错误。
随机确定一个参与者顺序，其中某些位置是固定的（例如第二个位置总是 1），而其他位置则基于生成的随机数。 */


let selectedOption; // 记录当前选中的选项

// function selectOptionHelper(index) {
//     index = 1 - index;
//     initBotHelper();
//     // change the style of dots, names and arrows
//     if (overlap_1_2_3) {
//         if (!choice1 && !index && !choice3) {
//             document.getElementById('arrow_down_1').style.translate = bias_for_3_arrows_left;
//             document.getElementById('arrow_down_2').style.translate = 0;
//             document.getElementById('arrow_down_3').style.translate = bias_for_3_arrows_right;
//         } else if (!choice1 && !index && choice3) {
//             document.getElementById('arrow_down_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_down_2').style.translate = bias_for_2_arrows_right;
//             document.getElementById('arrow_up_3').style.translate = 0;
//         } else if (!choice1 && index && !choice3) {
//             document.getElementById('arrow_down_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_up_2').style.translate = 0;
//             document.getElementById('arrow_down_3').style.translate = bias_for_2_arrows_right;
//         } else if (!choice1 && index && choice3) {
//             document.getElementById('arrow_down_1').style.translate = 0;
//             document.getElementById('arrow_up_2').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_up_3').style.translate = bias_for_2_arrows_right;
//         } else if (choice1 && !index && !choice3) {
//             document.getElementById('arrow_up_1').style.translate = 0;
//             document.getElementById('arrow_down_2').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_down_3').style.translate = bias_for_2_arrows_right;
//         } else if (choice1 && !index && choice3) {
//             document.getElementById('arrow_up_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_down_2').style.translate = 0;
//             document.getElementById('arrow_up_3').style.translate = bias_for_2_arrows_right;
//         } else if (choice1 && index && !choice3) {
//             document.getElementById('arrow_up_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_up_2').style.translate = bias_for_2_arrows_right;
//             document.getElementById('arrow_down_3').style.translate = 0;
//         } else if (choice1 && index && choice3) {
//             document.getElementById('arrow_up_1').style.translate = bias_for_3_arrows_left;
//             document.getElementById('arrow_up_2').style.translate = 0;
//             document.getElementById('arrow_up_3').style.translate = bias_for_3_arrows_right;
//         }
//     } else if (overlap_1_2) {
//         if (choice1 && index) {
//             document.getElementById('arrow_up_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_up_2').style.translate = bias_for_2_arrows_right;
//         } else if (!choice1 && !index) {
//             document.getElementById('arrow_down_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_down_2').style.translate = bias_for_2_arrows_right;
//         } else if (choice1 && !index) {
//             document.getElementById('arrow_up_1').style.translate = 0;
//             document.getElementById('arrow_down_2').style.translate = 0;
//         } else if (!choice1 && index) {
//             document.getElementById('arrow_down_1').style.translate = 0;
//             document.getElementById('arrow_up_2').style.translate = 0;
//         }
//     } else if (overlap_2_3) {
//         if (choice3 && index) {
//             document.getElementById('arrow_up_3').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_up_2').style.translate = bias_for_2_arrows_right;
//         } else if (!choice3 && !index) {
//             document.getElementById('arrow_down_3').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_down_2').style.translate = bias_for_2_arrows_right;
//         } else if (choice3 && !index) {
//             document.getElementById('arrow_up_3').style.translate = 0;
//             document.getElementById('arrow_down_2').style.translate = 0;
//         } else if (!choice3 && index) {
//             document.getElementById('arrow_down_3').style.translate = 0;
//             document.getElementById('arrow_up_2').style.translate = 0;
//         }
//     }
//
//     if (index) {
//         document.getElementById('arrow_up_2').style.visibility = "visible";
//         document.getElementById('arrow_down_2').style.visibility = "hidden";
//     } else {
//         document.getElementById('arrow_up_2').style.visibility = "hidden";
//         document.getElementById('arrow_down_2').style.visibility = "visible";
//     }
// }
//
// function initBotHelper() {
//     document.getElementById('arrow_up_1').style.translate = 0;
//     document.getElementById('arrow_down_1').style.translate = 0;
//     document.getElementById('arrow_up_3').style.translate = 0;
//     document.getElementById('arrow_down_3').style.translate = 0;
//     if (overlap_1_2_3) {
//         document.getElementById('name-with-dot1').style.left = document.getElementById('name-with-dot2').style.left;
//         document.getElementById('name-with-dot3').style.left = document.getElementById('name-with-dot2').style.left;
//         document.getElementById('dot1').style.visibility = "hidden";
//         document.getElementById('dot3').style.visibility = "hidden";
//         document.getElementById('name1').style.visibility = "hidden";
//         document.getElementById('name3').style.visibility = "hidden";
//         document.getElementById('name2').innerText = "Alex, Blair, You";
//         if (choice1 === choice3) {
//             document.getElementById('arrow_up_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_down_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_up_3').style.translate = bias_for_2_arrows_right;
//             document.getElementById('arrow_down_3').style.translate = bias_for_2_arrows_right;
//         }
//         document.getElementById('arrow_down_1').style.top = bias_for_1line;
//         document.getElementById('arrow_down_2').style.top = bias_for_1line;
//         document.getElementById('arrow_down_3').style.top = bias_for_1line;
//     } else if (overlap_1_2) {
//         document.getElementById('name-with-dot1').style.left = document.getElementById('name-with-dot2').style.left;
//         document.getElementById('dot1').style.visibility = "hidden";
//         document.getElementById('name2').style.left = document.getElementById('name1').style.left;
//         document.getElementById('name2').style.top = bias_for_second_name;
//         document.getElementById('arrow_down_1').style.top = bias_for_2line;
//         document.getElementById('arrow_down_2').style.top = bias_for_2line;
//         document.getElementById('arrow_down_3').style.top = bias_for_1line;
//     } else if (overlap_1_3) {
//         document.getElementById('name-with-dot1').style.left = document.getElementById('name-with-dot3').style.left;
//         document.getElementById('dot3').style.visibility = "hidden";
//         document.getElementById('name3').style.left = document.getElementById('name1').style.left;
//         document.getElementById('name3').style.top = bias_for_second_name;
//         if (choice1 === choice3) {
//             document.getElementById('arrow_up_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_down_1').style.translate = bias_for_2_arrows_left;
//             document.getElementById('arrow_up_3').style.translate = bias_for_2_arrows_right;
//             document.getElementById('arrow_down_3').style.translate = bias_for_2_arrows_right;
//         }
//         document.getElementById('arrow_down_1').style.top = bias_for_2line;
//         document.getElementById('arrow_down_2').style.top = bias_for_1line;
//         document.getElementById('arrow_down_3').style.top = bias_for_2line;
//     } else if (overlap_2_3) {
//         document.getElementById('name-with-dot3').style.left = document.getElementById('name-with-dot2').style.left;
//         document.getElementById('dot3').style.visibility = "hidden";
//         document.getElementById('name2').style.left = document.getElementById('name3').style.left;
//         document.getElementById('name2').style.top = bias_for_second_name;
//
//         document.getElementById('arrow_down_1').style.top = bias_for_1line;
//         document.getElementById('arrow_down_2').style.top = bias_for_2line;
//         document.getElementById('arrow_down_3').style.top = bias_for_2line;
//     } else {
//         document.getElementById('arrow_down_1').style.top = bias_for_1line;
//         document.getElementById('arrow_down_2').style.top = bias_for_1line;
//         document.getElementById('arrow_down_3').style.top = bias_for_1line;
//     }
//
//     document.getElementById('arrow_up_2').style.visibility = "hidden";
//     document.getElementById('arrow_down_2').style.visibility = "hidden";
// }



//
//
//
// function onMouseEnter(index) {
//     if (selectedOption == null) {
//         selectOptionHelper(index);
//         document.getElementById("arrow_up_2").style.opacity = 0.3;
//         document.getElementById("arrow_down_2").style.opacity = 0.3;
//     }
// }
//
//
//
// function onMouseLeave(index) {
//     if (selectedOption == null) {
//         initBotHelper();
//     }
// }



function toggle_image_display(question_index) {//对选图片类的问题进行问答
    //toggle_image_display 函数根据当前图片是否为默认图片来切换显示。如果两个图片都是默认图片，则显示与 question_index 相关的两张图片；
    //否则，将两个图片都重置为默认图片。
    //这种切换功能可能用于某些交互式问答或选择场景中，其中用户可以通过查看不同的图片来做出选择或回答问题。
    const leftPicture = document.querySelector("#left_picture");
    const rightPicture = document.querySelector("#right_picture");
    //使用 document.querySelector 方法分别获取页面上 ID 为 left_picture 和 right_picture 的图片元素，并将它们分别赋值给 leftPicture 和 rightPicture 常量。
    const default_src = `/static/data/design_pictures/default.jpg`;
    //定义一个常量 default_src，它存储了默认图片的路径
    if (leftPicture.src.includes(default_src) && rightPicture.src.includes(default_src)) {
        leftPicture.src = `/static/data/design_pictures/${question_index}_a.jpg`;
        rightPicture.src = `/static/data/design_pictures/${question_index}_b.jpg`;
    } else {
        leftPicture.src = default_src;
        rightPicture.src = default_src;
    }
    /**首先，检查 leftPicture 和 rightPicture 的 src 属性是否都包含 default_src。如果都包含，则执行以下操作：

将 leftPicture 的 src 属性设置为 /static/data/design_pictures/${question_index}_a.jpg。这里使用了模板字符串，将 question_index 变量的值插入到路径中，从而生成具体的图片路径。
将 rightPicture 的 src 属性设置为 /static/data/design_pictures/${question_index}_b.jpg，同样使用了模板字符串。
如果 leftPicture 或 rightPicture 的 src 属性不包含 default_src，则执行以下操作：

将 leftPicture 和 rightPicture 的 src 属性都重置为 default_src，即显示默认图片 */
}

/*let hasFunctionBeenCalled = false;//确保指定抽签环节只进行一次！
function init_phase_31() {//对应着phase II回答问题的部分，包括了选择4种主题其1等操作
    phase = 31;
    // change DOM
    document.querySelector(".quiz_body").innerHTML = `
        <div id="choose_part">
           
            <div id="identity_wrap_choose"></div>
            
            <form>
                <button type="button" class="button_big_choose" disabled="true">Proceed to Phase II</button>
            </form>
        </div>
    `; 
/////注意，展示资料卡片的操作每过一个题就要调用一次！！
    
    add_identity_status();//放置页面显示的labels，实质上在这里展示的头像，名字和label////////////////////////////////////////////到这里左半部分
    
    ////////////////////////////////////////////
    const notification1 = document.createElement("div");
    notification1.classList.add("notification_choose");
    // 创建用于显示提示信息的元素
    notification1.textContent = 'Currently we are randomly picking the one who will answer first for each question in PhaseII.';
    notification1.style.whiteSpace = 'nowrap'; // 设置文本不换行
    notification1.style.position = 'fixed';
    notification1.style.top = '30px';//提示信息元素距离浏览器窗口顶部的距离为 10px，这样提示信息元素就会位于页面顶部偏下一点
    notification1.style.right = '50%';//设置了提示信息元素距离浏览器窗口右侧的距离为窗口宽度的一半50%
    notification1.style.translate = 'translateX(50%)';//将提示信息元素向右（+30）平移了它自身宽度的一半
    notification1.style.backgroundColor = '#f0f0f0';//浅灰色背景颜色
    notification1.style.border = '1px solid #ccc';//浅灰色实线
    notification1.style.padding = '10px';//内边距，文本和文本框
    notification1.style.borderRadius = '5px';//圆角边框
    //alert('Currently, we are choosing the one who will answer first for each question in Phase II.');
    /////////////////////////////////////////////////////////////////
    if (!hasFunctionBeenCalled) {
        //choose_who_answer_first_status_phaseII();下面开始抽签/////////////////////////////////////////////
    // 将提示信息元素添加到页面中
    document.body.appendChild(notification1);
    // 执行抽签过程
    let profiles = document.querySelectorAll(".profile_with_labels");
    let randomIndex = Math.floor(Math.random() * profiles.length);
    let answersFirst = randomNumber; // 假设事先设定的被选中的人的索引是1
    let currentIndex = 0;
    let counter = 0;
    let first_answer_name = pseudonyms_chosen[answersFirst];

    let interval = setInterval(function() {
        /*profiles[currentIndex].style.opacity = "0"; // 隐藏当前卡片,透明度方式来隐藏*/
/*profiles[currentIndex].style.display = "none"; // 隐藏当前卡片,用display的方式不会让空白的页面占位置，这样三个卡片可以同时显示在同一个位置


currentIndex = (currentIndex + 1) % profiles.length; // 更新当前索引

/*profiles[currentIndex].style.opacity = "1"; // 显示下一个卡片*/
/* profiles[currentIndex].style.display = "block"; // 显示当前卡片


 counter++;

 if (answersFirst == 0) {
     // 如果隐藏和切换重复大于10次后
     
     if (counter == 36) {
         clearInterval(interval); // 停止抽签
         /*profiles[currentIndex].style.opacity = "0"; // 隐藏当前卡片*/
/*profiles[currentIndex].style.display = "block"; // 显示当前卡片
notification1.textContent = `${first_answer_name} is chosen to answer first `;
//createNotification_choose(`${first_answer_name} is chosen to answer first `);
/*setTimeout(() => {
    
    document.body.removeChild(notification);
}, 1000); // 假设5秒后移除提示信息
alert(`${first_answer_name} is chosen to answer first ` );*/
/*counter=0;
}
}

if(answersFirst == 2){
if (counter == 35) {
clearInterval(interval); // 停止抽签
/* profiles[currentIndex].style.opacity = "0"; // 隐藏当前卡片*/
/*profiles[currentIndex].style.display = "block"; // 显示当前卡片
 notification1.textContent = `${first_answer_name} is chosen to answer first `;
 counter=0;
}
}
}, 200); // 每个卡片显示的时间间隔（毫秒）

// 将标志变量设置为 true，表示函数已经被调用过了
hasFunctionBeenCalled = true;
}
///////////////////////////////////////////////////////
 
 
 
//let button = document.querySelector("button");
const button = document.querySelector('.button_big_choose');
setTimeout(() => {      
button.disabled = false;//当抽签结束后，让button禁用解除,抽签最多耗时7.2秒*/
/*}, 7200);
//button.disabled = false;//当抽签结束后，让button禁用解除*/
// 添加点击事件监听器
/*function remove_initphase3() {
    document.body.removeChild(notification1);
    init_phase_3();//调用一次enter_next，题号+1,所以直接初始化phase3！！！！！！！
    ////这里非常重要，直接enter——next的话phaseII的题号会对不上，因为每调用一次题号题组都会默认加1!!
    //因为前面在提出instruction的时候phase=3时初始化了phase31，所以这里在结束的时候初始化phase3刚好可以对的上。
}
document.querySelector("button").addEventListener("click", remove_initphase3);//选好后进入phase3

 
}
*/

let statement_text;
let choice1 = -1, choice3 = -1;
let overlap_1_3, overlap_1_2, overlap_2_3, overlap_1_2_3;
const bias_for_2_arrows_left = "-30%";
const bias_for_2_arrows_right = "30%";
const bias_for_3_arrows_left = "-60%";
const bias_for_3_arrows_right = "60%";
const bias_for_1line = "80px", bias_for_2line = "95px";
const bias_for_second_name = "65px";



function test_phase_3() {
    test_mode = true;
    phase = 3;
    pseudonyms_chosen = ["Alice", "Alex", "Betty"];
    avatars_index_chosen = [0, 1, 2];
    data.identity_choices = [[0, 0], [1, 1], [2, 2]];   // actually unnecessary, but identity_choices is redundant
    data.ideologies = [-1, null, 1];
    data.labels = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ];
    phase_2_orders.participant_order = [2, 1, 1, 1];
    next_question_seqNum = phase_2_starting_question_index;
    split_answers = [[-2, -2, -2]];     // ideology labeled after Phase I
    init_phase_3();
}


function init_phase_3() {
    phase = 3;
    document.querySelector(".quiz_body").innerHTML = `
        <div class="split" id="left_part_phase_II">
            <div id="left_content_phase_II">
                <div class="instruction_phase_3"></div>
                <div id="identity_wrap_phase_II"></div>
            </div>
        </div>

        <div class="split" id="right_part_phase_II">
            <div id="right_content_phase_II">
                <div class="container">
                    <div class="left-side">
<!--        <div class="padding_title" id="ideology_spectrum"></div>-->
                            <div class="info-text">
                                <p><b>For you information</b>:</p>
                                <p>1. From our database, we randomly sampled 20 previous participants who gave exactly the answers as Alex to the questions in Phase 1. We call them the Alex group.</p>
                                <p>2. Similarly, we randomly sampled 20 previous participants who gave exactly the answers as Blair to the questions in Phase 1. We call them the Blair group.</p>
                                <p>3. The ideologies of Alex, Blair, and yourself are positioned on the following ideology spectrum.</p>
                            </div>
                        <div>
                            ${phase_3_range_string}
                        </div>
                    </div>

                    <div class="divider"></div>

                    <div class="right-side" id="right_part_phase_II">
                        <div id="right_content_phase_II">
                            <div class="question_phase_3"></div>
                            <br><br>
                            <div class="statement_phase_3"></div>
                            <div id="answer_area_phase_II">
                                <div id="operations">
                                    <div id="options_container">
                                        <div class="option-with-profile" id="option-with-profile-0">
                                            <button class="option-button" onclick="selectOption(0)" id="left_option">Option 1</button>
                                        </div>
                                        <div class="option-with-profile" id="option-with-profile-1">
                                            <button class="option-button" onclick="selectOption(1)" id="right_option">Option 2</button>
                                        </div>
                                        <button type="button" class="submit-button" id="submit_button_phase2" disabled="true">Submit</button>
                                    </div>
                                </div>
                <!--                <div id="buttons_container">-->
                <!--                    <button type="button" class="submit-button" id="submit_button_phase2" disabled="true">Submit</button>-->
                <!--                </div>-->
                                <div class="footer-note">
                                    Each option is marked in the ideology color of the group whose majority chose it. Please choose your opinion by clicking the corresponding option and then click "Submit" to proceed to the next question.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
    `;



// function init_phase_3() {//对应着phase II回答问题的部分，包括了选择4种主题其1等操作
//     phase = 3;
//
//     document.querySelector(".quiz_body").innerHTML = `
//         <div class="split" id="left_part_phase_II">
//             <div id="left_content_phase_II">
//                 <div class="instruction_phase_3"></div>
//                 <div id="identity_wrap_phase_II"></div>
//             </div>
//         </div>
//
//         <div class="split" id="right_part_phase_II">
//             <div id="right_content_phase_II">
//
//                 <!--<div id="instruction_right_phase_II"></div>-->
//                 <div class="question_phase_3"></div>
//
//                 <div class="statement_phase_3"></div>
//                 <div class="padding_title" id="ideology spectrum"></div>
//
//                 <div class="padding_line_phaseII">
//                     <div class="legend"> <strong>Answers:</strong> ⇧Agree ⇩Disagree </div>
//                     <div class="choices-text">
//                         <div id="choice1"> <strong>${pseudonyms_chosen[0]} chose </strong> </div>
//                         <div id="choice3"> <strong>${pseudonyms_chosen[2]} chose </strong> </div>
//                     </div>
//                     ${phase_3_range_string}
//                 </div>
//
//                 <div id="answer_area_phase_II">
//                     <div class="options-wrapper">
//                     <div class="option" id="agree" onmouseover="highlightOption('agree')" onmouseout="unhighlightOption('agree')" onclick="selectOption('agree')">
//                         <div class="option-text" id="agree-text">Agree</div>
//                         <div class="circles" id="agree-circles"></div>
//                     </div>
//                     <div class="option" id="disagree" onmouseover="highlightOption('disagree')" onmouseout="unhighlightOption('disagree')" onclick="selectOption('disagree')">
//                         <div class="option-text" id="disagree-text">Disagree</div>
//                         <div class="circles" id="disagree-circles"></div>
//                     </div>
//                     </div>
//
//                     <div id="buttons_container">
//                         <button class="submit-button" id="submit_button_phase2" disabled>Submit</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;

    const question = document.querySelector(".question_phase_3");
    const statement = document.querySelector(".statement_phase_3");

    const left_option = document.querySelector("#left_option");
    const right_option = document.querySelector("#right_option");

    const instruction = document.querySelector(".instruction_phase_3");
    const instruction_right = document.getElementById("instruction_right_phase_II");
    const answer_area = document.querySelector("#answer_area_phase_II");
    //这些行使用document.querySelector和document.getElementById方法来获取页面上的特定元素，并将它们存储在常量中，以便稍后在代码中引用。

    const set_num = Math.floor(question_seqNum_in_phase / 6);//20240626，换成6个问题
    //换句话说，它将问题序列号在当前阶段中的位置除以 5，并将结果向下取整，以确定当前问题所属的集合编号。
    /*
    将 question_seqNum_in_phase 除以 5，然后向下取整，得到的结果赋值给 set_num 常量。
    */
    const question_num = question_seqNum_in_phase % 6;//换成6个问题20240626，确定是6个中哪一个
    const set_index = phase_2_orders.set_order[set_num];
    const question_index = phase_2_orders.question_order[set_num][question_num];
    const question_type = set_index_to_name[set_index];
    //这些行计算当前问题的集合编号（set_num）和问题编号（question_num）。
    //然后，它们从phase_2_orders对象中检索设置和问题索引，并从set_index_to_name对象中检索问题类型。
    // 定义 additionalQuestionHTML 变量
const additionalQuestionHTML = `
    <div style="margin-top: 20px; text-align: left; padding: 10px; display: block; visibility: visible;">
        <p><strong>Additional question:</strong></p>
        <p>Do you think Alex and Blair group's answers are ideology driven?</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <button style="flex-grow: 1; margin-right: 10px;" class="option-button">Yes, they are ideology driven.</button>
            <button style="flex-grow: 1; margin-right: 10px;" class="option-button">No, they are not.</button>
            <button style="flex-grow: 0;" type="button" class="submit-button">Submit</button>
        </div>
    </div>
`;

document.addEventListener('DOMContentLoaded', function() {
    if (next_question_seqNum === 12) {
        document.querySelector("#right_content_phase_II").insertAdjacentHTML('beforeend', additionalQuestionHTML);
    }
});

    // 计算滑块位置
    let dot_pos_1 = (split_answers[0][0] + 2) / 4;
    let dot_pos_2 = (split_answers[0][1] + 2) / 4;
    let dot_pos_3 = (split_answers[0][2] + 2) / 4;

    const color_0 = interpolateColor(dot_pos_1);
    const color_2 = interpolateColor(dot_pos_3);
    // selectedOption = null;
    const randomNum = Math.random();
        let leftColor, rightColor, leftGroup, rightGroup;

        if (randomNum < 0.5) {
            leftColor = color_0;
            rightColor = color_2;
            leftGroup = pseudonyms_chosen[0];
            rightGroup = pseudonyms_chosen[2];
        } else {
            leftColor = color_2;
            rightColor = color_0;
            leftGroup = pseudonyms_chosen[2];
            rightGroup = pseudonyms_chosen[0];
        }

    left_option.style.backgroundColor = leftColor;
    left_option.style.color = leftColor !== "#ededed" ? 'white' : 'black';
    right_option.style.backgroundColor = rightColor;
    right_option.style.color = rightColor !== "#ededed" ? 'white' : 'black';

    const new_color = interpolateColor((split_answers[0][1] + 2) / 4);

    document.documentElement.style.setProperty('--left-color', leftColor);
    document.documentElement.style.setProperty('--right-color', rightColor);
    document.documentElement.style.setProperty('--user-color', new_color);

    // 设置姓名标签的位置
    document.getElementById('name-with-dot1').style.left = (dot_pos_1) * 100 - (dot_pos_1 - 0.5) * 8 + '%';
    document.getElementById('name-with-dot2').style.left = (dot_pos_2) * 100 - (dot_pos_2 - 0.5) * 8 + '%';
    document.getElementById('name-with-dot3').style.left = (dot_pos_3) * 100 - (dot_pos_3 - 0.5) * 8 + '%';

// 设置姓名标签的颜色
    document.getElementById('name1').innerText = `${pseudonyms_chosen[0]}`;
    document.getElementById('name1').style.color = interpolateColor(dot_pos_1);
    document.getElementById('triangle_arrow_1').style.color = interpolateColor(dot_pos_1);

    document.getElementById('name2').innerText = `${pseudonyms_chosen[1]}`;
    document.getElementById('name2').style.color = interpolateColor(dot_pos_2);
    document.getElementById('triangle_arrow_2').style.color = interpolateColor(dot_pos_2);

    document.getElementById('name3').innerText = `${pseudonyms_chosen[2]}`;
    document.getElementById('name3').style.color = interpolateColor(dot_pos_3);
    document.getElementById('triangle_arrow_3').style.color = interpolateColor(dot_pos_3);

    // 检查重叠情况并调整位置
    let nameWithDotElements = [
        { elem: document.getElementById('name-with-dot1'), pos: dot_pos_1 },
        { elem: document.getElementById('name-with-dot2'), pos: dot_pos_2 },
        { elem: document.getElementById('name-with-dot3'), pos: dot_pos_3 }
    ];

    nameWithDotElements.sort((a, b) => a.pos - b.pos);

    // 检查是否三个标签重叠
    if (Math.abs(nameWithDotElements[0].pos - nameWithDotElements[1].pos) < 0.01 &&
        Math.abs(nameWithDotElements[1].pos - nameWithDotElements[2].pos) < 0.01) {
        nameWithDotElements[0].elem.querySelector('.name').style.top = '-30px';
        nameWithDotElements[1].elem.querySelector('.name').style.top = '-50px';
        nameWithDotElements[2].elem.querySelector('.name').style.top = '-70px';
    } else {
        // 检查两个标签重叠的情况
        for (let i = 0; i < nameWithDotElements.length - 1; i++) {
            if (Math.abs(nameWithDotElements[i].pos - nameWithDotElements[i + 1].pos) < 0.01) {
                nameWithDotElements[i].elem.querySelector('.name').style.top = '-30px';
                nameWithDotElements[i + 1].elem.querySelector('.name').style.top = '-50px';
            }
        }
    }
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

    const leftlabel = getIdeologyLabel(leftColor);
    const new_label = getIdeologyLabel(new_color);
    const rightlabel = getIdeologyLabel(rightColor);

    question.innerHTML = `<b>Q${next_question_seqNum}. </b>`;
    switch (question_type) {
        case "issue":
            question.innerHTML += `<b>For the Statement below, the majority of the <span class="group-color-left">${leftGroup} group (${leftlabel})</span> chose "Agree", while the majority of the <span class="group-color-right">${rightGroup} group (${rightlabel})</span> chose "Disagree". As a <span class="user-color">${new_label}</span>, do <span class="user-color">you</span> agree or disagree with this statement?</b>`;
            // question.innerHTML += `<b>For the Statement below, the majority of the ${leftGroup} group chose "Agree", while the majority of the ${rightGroup} group chose "Disagree". As a (), do you agree or disagree with this statement?</b>`;
            left_option.textContent = "Agree";
            right_option.textContent = "Disagree"
            break;
        case "prediction":
            question.innerHTML += `Do you think the following prediction is to be true?`;
            left_option.textContent = "Yes";
            right_option.textContent = "No";
            break;
        case "fact":
            question.innerHTML += `Do you think the following statement is true?`;
            left_option.textContent = "Yes";
            right_option.textContent = "No";
            break;
        case "design":
            question.innerHTML += "Which design do you prefer?";
            left_option.textContent = "Left";
            right_option.textContent = "Right";
            break;
        default:
            break;
    }



    statement_text = phase_2_statements[question_type][question_index].text;
    //console.log("question_index:", question_index); // 使用字符串拼接
    //console.log("randomNumber_phaseII_text:", randomNumber_phaseII_text);


    //statement.innerHTML = `Q${next_question_seqNum}. <b style="color: ${color_name[answers_first]};">${pseudonyms_chosen[answers_first]}</b> thinks that `+ statement_text;
    /**将问题文本（存储在 question 变量中）更新为新的序列号（由 next_question_seqNum 定义）。
根据 question_type（问题的类型）的不同，更新左右选项的文本内容：
如果是 "issue" 类型，选项为 "Agree" 和 "Disagree"。
如果是 "prediction" 类型，选项为 "Yes" 和 "No"。
如果是 "fact" 类型，选项也为 "Yes" 和 "No"。
如果是 "design" 类型，选项为 "Left" 和 "Right"。
从 phase_2_statements 对象中获取与当前 question_type 和 question_index 对应的 text，
并将其赋值给 statement_text 变量（虽然该变量在这段代码中没有进一步使用）。 */

    // initBotHelper();

    // const leftOption = document.getElementById('option-with-profile-0');
    // const rightOption = document.getElementById('option-with-profile-1');
    // const submitbutton = document.getElementById('submit_button_phase2');
    //
    // // 添加事件监听器
    // leftOption.addEventListener('mouseenter', () => onMouseEnter(0));
    // leftOption.addEventListener('mouseleave', () => onMouseLeave(0));
    // //leftOption.addEventListener('click', () => onClickOption(0));
    //
    // rightOption.addEventListener('mouseenter', () => onMouseEnter(1));
    // rightOption.addEventListener('mouseleave', () => onMouseLeave(1));//鼠标在对应区域上的效果
    // //rightOption.addEventListener('click', () => onClickOption(1));

    //add_identity_status();//放置页面显示的labels，实质上在这里展示的头像，名字和label////////////////////////////////////////////到这里左半部分


    answers_first = phase_2_orders.participant_order[set_num];
    start_time[answers_first] = Date.now();
    //调用add_identity_status函数（这个函数的具体实现在这段代码中没有给出）。
    //然后，它设置answers_first为当前集合的参与者顺序，并记录当前时间作为该参与者的开始时间。

    const set_begin_seqNum = phase_2_starting_question_index + 6 * set_num;//起始索引位置加上6*0
    const set_end_seqNum = set_begin_seqNum + 5;//20240626，换成6个题，下标+5
    //计算当前设置的问题序列的开始和结束编号。
    if (answers_first == human_index) {//如果人被选中第一个回答问题//抽签结束后再显示
        instruction_right.innerHTML = `
            <div>
                For Q${set_begin_seqNum}~Q${set_end_seqNum}, <b>You</b> are picked to answer first. Please choose your answer.
            </div>
        `;//XXX被选作第一个来回答
        instruction_right.style[`background-color`] = instruction_background_color;
    } else {//两个bot选择其中一个来回答问题
        /////////////////////////////////////////////////////20240509,把卡片上的提示语换了///////////////////////////////
        instruction.innerHTML = `
            <div>
            For each question, you will see <b style="color: ${color_name[answers_first]};">${pseudonyms_chosen[answers_first]}</b>'s answer.
                <span class="dots"></span>
            </div>
        `;
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        instruction.style[`background-color`] = instruction_background_color;
        //////////////////20240509///////////////////////////////////////////////
        //transform_dots();//实现正在等待的效果，一堆...
        ////////////////////
    }
    /**根据answers_first是否等于human_index，代码更新instruction_right或instruction元素的innerHTML内容。
     * 如果answers_first等于human_index，则告诉用户他们是第一个回答问题的人。
     * 否则，告诉用户另一个被选中的参与者（pseudonyms_chosen[answers_first]）是第一个回答问题的人，
     * 并调用transform_dots函数（这个函数的具体实现也在这段代码之外）。 */

    // profile
    //////////////////////////////////////////20240509/////////////////////把是否 在回答问题的停用了。
    /*for (let index = 0; index < num_of_participants; index++) {
    if (index == answers_first) {
        document.getElementById(`status_${index}`).innerHTML = loader_string;//状态是一个正在加载的字符串
        document.getElementById(`profile_${index}`).classList.add("answering_now");//正在回答问题的外观展示
    } else {
        document.getElementById(`profile_${index}`).classList.add("not_answering_now");
    }
}*/
    /**更新参与者状态：
    通过一个循环遍历所有参与者（由 num_of_participants 定义）。
    如果当前索引 index 等于 answers_first（可能是当前正在回答问题的参与者的索引），则：
    将对应的 HTML 元素（ID 为 status_${index}）的内容更新为 loader_string（显示一个正在加载转圈的效果）。
    给对应的 HTML 元素（ID 为 profile_${index}）添加一个 CSS 类 answering_now，以标识该参与者正在回答问题。
    对于其他所有参与者，给对应的 HTML 元素（ID 为 profile_${index}）添加一个 CSS 类 not_answering_now，以标识这些参与者没有回答问题 */
    // text
    ////////20240509////////////////////////////////////////////////////////////////////////////////////////

    // pictures
    if (question_type == "design") {//选择左右图片类的问题//20240509//////////////////////////////////////
        document.querySelector("#pictures_container").style.display = "flex";//涉及图片问答的design才会用到picture
    }
    //如果问题的类型是 "design"，则显示 ID 为 "pictures_container" 的 HTML 容器，并设置其样式为 flex（可能是用于显示两张设计图片）。

    // if the user answers first
    if (answers_first == human_index) {//人先回答////////////////////////////////////20240509不需要变动///////////////////
        pseudonyms_left = JSON.parse(JSON.stringify(pseudonyms_chosen));
        pseudonyms_left.splice(human_index, 1);
        //通过深拷贝 pseudonyms_chosen 数组来创建 pseudonyms_left 数组，并从 pseudonyms_left 中移除位于 human_index 位置的元素（即用户的化名）。
        statement.innerHTML = `"` + statement_text + `"`;
        toggle_image_display(question_index);//展示左右图片的函数
        //设置 statement 元素的文本内容，并调用 toggle_image_display 函数来根据 question_index 更新图片显示


        //提交按钮被点击时,计算并存储用户从开始回答问题到点击提交按钮所用的时间,将除了当前用户外的所有参与者的答案设置为 null
        // document.querySelector(".submit-button").addEventListener("click", () => {
        document.querySelector(".submit-button").addEventListener("click", () => {
            each_answer.time_to_answer[human_index] = (Date.now() - start_time[human_index]) / 1000;
            for (let i = 0; i < num_of_participants; i++) {
                if (i != human_index) { temp_answers[i] = null; }
            }
            document.querySelectorAll("button").forEach((button) => {
                button.disabled = true;//禁用页面上所有的按钮，并隐藏答案区域。
            });
            answer_area.classList.add("concealed");
            display_values(answers_first, question_type);//人先回答时调用 display_values 函数来显示答案，并清空用户的状态元素的内容。

            // change DOM
            document.getElementById(`status_${human_index}`).innerHTML = ``;
            let profile = document.getElementById(`profile_${human_index}`);
            setTimeout(() => {
                //////////////////////////20240509//////////////////////////////////////////////////
                profile.classList.remove("answering_now");
                profile.classList.add("finish_answering");

                let profiles = document.querySelectorAll(".profile_with_labels");//让外观是含labels的卡片
                let index = 0;
                ///////////////////////////////////////////////////////////////
                profiles.forEach((profile) => {
                    if (index == human_index) {
                        profile.classList.remove("finish_answering");
                        profile.classList.add("not_answering_now");
                    } else {
                        profile.classList.add("answering_now");
                        profile.classList.remove("not_answering_now");
                        document.getElementById(`status_${index}`).innerHTML = loader_string;
                    }
                    //////////////////////////////////////////////////////
                    index++;
                    //首先，移除当前用户的 answering_now 类，并添加 finish_answering 类。然后，遍历所有带有 .profile_with_labels 类的元素，如果元素的索引等于 human_index，则移除 finish_answering 类并添加 not_answering_now 类；
                    //否则，添加 answering_now 类并移除 not_answering_now 类，同时更新对应的状态元素的内容为 loader_string。
                    instruction.innerHTML = `
                        <div>
                            Now it's <b>${pseudonyms_left[0]}</b>'s and <b>${pseudonyms_left[1]}</b>'s turn to answer this question. Please wait
                            <span class="dots"></span>
                        </div>
                    `;
                    //这里将 instruction 元素的 HTML 内容更新为一条消息，告知用户现在是 pseudonyms_left[0] 和 pseudonyms_left[1] 这两个化名对应的参与者回答问题的时间。
                    //同时，这个消息后面带有一个 span 元素，其类名为 dots，可能用于显示加载或等待动画。
                    instruction.style[`background-color`] = instruction_background_color;
                    //设置 instruction 元素的背景颜色为 instruction_background_color。
                    instruction_right.innerHTML = ``;
                    console.log("before", instruction_right.style[`background-color`])
                    instruction_right.style[`background-color`] = "";
                    console.log("before", instruction_right.style[`background-color`])
                    //清空 instruction_right 元素的 HTML 内容，并重置其背景颜色为默认值（空字符串表示不设置特定颜色）。同时，使用 console.log 打印出修改前后的背景颜色，可能是为了调试。
                    transform_dots();//正在等待
                });
                bots_index = generate_bot_array(num_of_participants, human_index);
                for (const index of bots_index)
                    start_time[index] = Date.now();//为机器人设置开始时间并启动计时器
                start_bot_timers(bots_index, "phase_3_question");//如果人先答，让bot回答phaseII的时间
                document.addEventListener("timeup", all_finish_answering_phase_3);
            }, time_configurations['lag'] * 1000)
        });
    }/////////////////////////////////以上是人先回答//////////////////////

    // if the bot answers first/////////////////////////////20240509/////////////////////////////////////////
    else {//20240509/////////////////////////////////////////
        // change DOM

        /*statement.textContent = `You will see the question after ${pseudonyms_chosen[answers_first]} submits her/his answer.`;
        statement.classList.add("concealed");
        answer_area.classList.add("concealed");
//更新 statement 的文本内容，告知用户他们将在某个机器人提交答案后看到问题。同时，隐藏问题和答案区域。
        document.querySelectorAll("button").forEach((button) => {
            button.disabled = true;
        });//禁用页面上的所有按钮，防止用户进一步操作
        start_bot_timers([answers_first], "phase_3_question");//bot先答时，为第一个回答phaseII的机器人（索引为 answers_first）。
        document.addEventListener("timeup", after_bot_input_phase_3);
        //当 timeup 事件被触发时，调用 after_bot_input_phase_3 函数。这可能是在机器人完成回答后执行的函数。*/

        //all_finish_answering_phase_3();直接用这个还没答题就开始next了
        after_bot_input_phase_3();


    }

//这段代码处理了一个多人问答环节的两种情况：人类首先回答和机器人首先回答。
//在这两种情况下，它都会更新页面元素、禁用按钮、启动计时器，并监听时间结束事件。

    // setupOptions();
    // setupEventHandlers();
}


// function selectOption(index) {
//     const left_option = document.querySelector("#left_option");
//     const right_option = document.querySelector("#right_option");
//     document.querySelector(".submit-button").disabled = false;
//
//     const color_0 = interpolateColor((split_answers[0][0] + 2) / 4);
//     const new_color = interpolateColor((split_answers[0][1] + 2) / 4);
//     const color_2 = interpolateColor((split_answers[0][2] + 2) / 4);
//
//     if (index == 0) {
//         left_option.classList.add("selected");
//         if (color_0 != "#ededed") {
//             left_option.style.backgroundColor = color_0;
//             left_option.style.color = 'white';
//         } else {
//             left_option.style.backgroundColor = "#ededed";
//             left_option.style.color = "black";
//         }
//         left_option.style.outline = `11px solid ${new_color}`;
//
//         right_option.classList.remove("selected");
//         right_option.style.backgroundColor = color_2;
//         right_option.style.color = 'white';
//         right_option.style.outline = 'none';
//
//         selectedOption = 0;
//     } else {
//         right_option.classList.add("selected");
//         if (color_2 != "#ededed") {
//             right_option.style.backgroundColor = color_2;
//             right_option.style.color = 'white';
//         } else {
//             right_option.style.backgroundColor = "#ededed";
//             right_option.style.color = "black";
//         }
//         right_option.style.outline = `11px solid ${new_color}`;
//
//         left_option.classList.remove("selected");
//         left_option.style.backgroundColor = color_0;
//         left_option.style.color = 'white';
//         left_option.style.outline = 'none';
//
//         selectedOption = 1;
//     }
// }

// function selectOption(index) {
//     const left_option = document.querySelector("#left_option");
//     const right_option = document.querySelector("#right_option");
//     document.querySelector(".submit-button").disabled = false;
//
//     // const color_0 = interpolateColor((split_answers[0][0] + 2) / 4);
//     // const new_color = interpolateColor((split_answers[0][1] + 2) / 4);
//     // const color_2 = interpolateColor((split_answers[0][2] + 2) / 4);
//
//     if (index == 0) {
//         left_option.classList.add("selected");
//         if (leftColor != "#ededed") {
//             left_option.style.backgroundColor = leftColor;
//             left_option.style.color = 'white';
//         } else {
//             left_option.style.backgroundColor = "#ededed";
//             left_option.style.color = "black";
//         }
//         left_option.style.outline = `11px solid ${new_color}`;
//
//         right_option.classList.remove("selected");
//         right_option.style.backgroundColor = rightColor;
//         right_option.style.color = 'white';
//         right_option.style.outline = 'none';
//
//         selectedOption = 0;
//     } else {
//         right_option.classList.add("selected");
//         if (rightColor != "#ededed") {
//             right_option.style.backgroundColor = rightColor;
//             right_option.style.color = 'white';
//         } else {
//             right_option.style.backgroundColor = "#ededed";
//             right_option.style.color = "black";
//         }
//         right_option.style.outline = `11px solid ${new_color}`;
//
//         left_option.classList.remove("selected");
//         left_option.style.backgroundColor = leftColor;
//         left_option.style.color = 'white';
//         left_option.style.outline = 'none';
//
//         selectedOption = 1;
//     }
// }

function selectOption(index) {
    // document.querySelector(".submit-button").disabled = false;
    document.querySelector(".submit-button").disabled = false;
    const left_option = document.querySelector("#left_option");
    const right_option = document.querySelector("#right_option");
    const new_color = interpolateColor((split_answers[0][1] + 2) / 4);

    if (index == 0) {
        left_option.classList.add("selected");
        left_option.style.outline = `11px solid ${new_color}`;
        right_option.classList.remove("selected");
        right_option.style.outline = 'none';
        selectedOption = 0;
    } else {
        right_option.classList.add("selected");
        right_option.style.outline = `11px solid ${new_color}`;
        left_option.classList.remove("selected");
        left_option.style.outline = 'none';
        selectedOption = 1;
    }

    // 如果 index 等于 0，则给 left_option 元素添加 selected 类，并从 right_option 元素中移除 selected 类。这意味着 left_option 将显示被选中的样式，而 right_option 则不会。

    //如果 index 不等于 0（即等于 1 或其他非零值），则给 right_option 元素添加 selected 类，并从 left_option 元素中移除 selected 类。这意味着 right_option 将显示被选中的样式，而 left_option 则不会。
    temp_answers[human_index] = index; //在选项点击位置处已经保存了人的回答
    //将 temp_answers 数组在 human_index 索引位置的值设置为 index。
    //这里假设 temp_answers 是一个已经定义好的数组，而 human_index 是一个全局变量或在这段代码之前已经定义好的变量
}

// function setupOptions() {
//     const { default_0, default_2, deviationProbability_0, deviationProbability_2 } = initializeGroups();
//
//     const choices_0 = memberChoice(default_0, deviationProbability_0);
//     const choices_2 = memberChoice(default_2, deviationProbability_2);
//
//     const choiceCounts = storeChoices(choices_0, choices_2);
//
//     const agreeButton = document.getElementById('agree');
//     const disagreeButton = document.getElementById('disagree');
//     const agreeText = document.getElementById('agree-text');
//     const disagreeText = document.getElementById('disagree-text');
//
//     let dot_pos_1 = (split_answers[0][0] + 2) / 4;
//     let dot_pos_3 = (split_answers[0][2] + 2) / 4;
//
//
//     agreeButton.style.backgroundColor = interpolateColor(dot_pos_1);
//     disagreeButton.style.backgroundColor = interpolateColor(dot_pos_3);
//
//     setCircles('agree-circles', [
//         { count: choiceCounts.agreeCount_0, color: interpolateColor(dot_pos_1) },
//         { count: choiceCounts.agreeCount_2, color: interpolateColor(dot_pos_3) }
//     ]);
//     setCircles('disagree-circles', [
//         { count: choiceCounts.disagreeCount_0, color: interpolateColor(dot_pos_1) },
//         { count: choiceCounts.disagreeCount_2, color: interpolateColor(dot_pos_3) }
//     ]);


 // Determine dominant group and generate the question text
 //    const agreeDominantGroup = choiceCounts.agreeCount_0 > choiceCounts.agreeCount_2 ? 0 : 2;
 //    const disagreeDominantGroup = choiceCounts.disagreeCount_0 > choiceCounts.disagreeCount_2 ? 0 : 2;
 //
 //    const agreeCount = agreeDominantGroup === 0 ? choiceCounts.agreeCount_0 : choiceCounts.agreeCount_2;
 //    const disagreeCount = disagreeDominantGroup === 0 ? choiceCounts.disagreeCount_0 : choiceCounts.disagreeCount_2;
 //
 //    const agreeGroup = agreeDominantGroup === 0 ? pseudonyms_chosen[0] : pseudonyms_chosen[2];
 //    const disagreeGroup = disagreeDominantGroup === 0 ? pseudonyms_chosen[0] : pseudonyms_chosen[2];
 //
 //    const agreeColor = agreeDominantGroup === 0 ? interpolateColor(dot_pos_1) : interpolateColor(dot_pos_3);
 //    const disagreeColor = disagreeDominantGroup === 0 ? interpolateColor(dot_pos_1) : interpolateColor(dot_pos_3);
 //    const youColor = interpolateColor(dot_pos_2);
 //
 //    const questionContainer = document.createElement('div');
 //    questionContainer.innerHTML = `
 //        <p class="question-text">
 //            Q11. For the statement below, ${agreeCount} out of 10 people from the
 //            <span class="alex-group" style="color: ${agreeColor};">${agreeGroup} group</span> chose
 //            <span class="agree-disagree">“Agree”</span>; ${disagreeCount} out of 10 people from the
 //            <span class="blair-group" style="color: ${disagreeColor};">${disagreeGroup} group</span> chose
 //            <span class="agree-disagree">“Disagree”</span>. Based on the information above, do
 //            <span class="you" style="color: ${youColor};">you</span> agree or disagree with the following statement?
 //        </p>
 //    `;
 //    document.getElementById('answer_area_phase_II').prepend(questionContainer);



//
// function setCircles(containerId, circles) {
//     const container = document.getElementById(containerId);
//     container.innerHTML = ''; // 清空容器内的内容
//     circles.forEach(({ count, color }) => {
//         for (let i = 0; i < count; i++) {
//             const circle = document.createElement('div');
//             circle.classList.add('circle');
//             circle.style.backgroundColor = color;
//             container.appendChild(circle);
//         }
//     });
// }
//
//
// function setupEventHandlers() {
//     let selectedOption = null;
//     let isOptionSelected = false;
//     let dot_pos_2 = (split_answers[0][1] + 2) / 4;
//     const userColor = interpolateColor(dot_pos_2);
//
//     function highlightOption(optionId) {
//         if (!isOptionSelected && optionId !== selectedOption) {
//             document.getElementById(optionId).style.outline = `11px solid ${userColor}`;
//         }
//     }
//
//     function unhighlightOption(optionId) {
//         if (!isOptionSelected && optionId !== selectedOption) {
//             document.getElementById(optionId).style.outline = 'none';
//         }
//     }
//
//     function selectOption(optionId) {
//         if (selectedOption && selectedOption !== optionId) {
//             document.getElementById(selectedOption).style.outline = 'none';
//         }
//         selectedOption = optionId;
//         document.getElementById(optionId).style.outline = `11px solid ${userColor}`;
//         document.getElementById('submit_button_phase2').disabled = false;
//         isOptionSelected = true;
//     }
//
//     document.getElementById('agree').addEventListener('mouseover', () => highlightOption('agree'));
//     document.getElementById('agree').addEventListener('mouseout', () => unhighlightOption('agree'));
//     document.getElementById('agree').addEventListener('click', () => selectOption('agree'));
//
//     document.getElementById('disagree').addEventListener('mouseover', () => highlightOption('disagree'));
//     document.getElementById('disagree').addEventListener('mouseout', () => unhighlightOption('disagree'));
//     document.getElementById('disagree').addEventListener('click', () => selectOption('disagree'));
//
//     document.getElementById('submit_button_phase2').addEventListener('click', () => {
//         if (selectedOption) {
//             alert(`You selected: ${selectedOption}`);
//             const userChoice = selectedOption;
//             console.log('User choice:', userChoice);
//         } else {
//             alert('Please select an option.');
//         }
//     });
// }
//
// function initializeGroups() {
//     const defaultOptions = ['agree', 'disagree'];
//     const probabilities = [0.1, 0.15, 0.2];
//
//     const default_0 = defaultOptions[Math.floor(Math.random() * defaultOptions.length)];
//     const default_2 = default_0 === 'agree' ? 'disagree' : 'agree';
//
//     const deviationProbability_0 = probabilities[Math.floor(Math.random() * probabilities.length)];
//     const deviationProbability_2 = probabilities[Math.floor(Math.random() * probabilities.length)];
//
//     return {
//         default_0,
//         default_2,
//         deviationProbability_0,
//         deviationProbability_2
//     };
// }
//
// function memberChoice(defaultOption, deviationProbability, groupSize = 10) {
//     const choices = [];
//     for (let i = 0; i < groupSize; i++) {
//         const randomValue = Math.random();
//         const choice = (randomValue < deviationProbability)
//             ? (defaultOption === 'agree' ? 'disagree' : 'agree')
//             : defaultOption;
//         choices.push(choice);
//     }
//     return choices;
// }
//
// function storeChoices(choices_0, choices_2) {
//     const agreeCount_0 = choices_0.filter(choice => choice === 'agree').length;
//     const disagreeCount_0 = choices_0.length - agreeCount_0;
//
//     const agreeCount_2 = choices_2.filter(choice => choice === 'agree').length;
//     const disagreeCount_2 = choices_2.length - agreeCount_2;
//
//     return {
//         agreeCount_0,
//         disagreeCount_0,
//         agreeCount_2,
//         disagreeCount_2
//     };
// }


    // 检查是否三个标签重叠
    // if (Math.abs(nameWithDotElements[0].pos - nameWithDotElements[1].pos) < 0.01 &&
    //     Math.abs(nameWithDotElements[1].pos - nameWithDotElements[2].pos) < 0.01) {
    //     nameWithDotElements[0].elem.querySelector('.name').style.top = '-80px';
    //     nameWithDotElements[1].elem.querySelector('.name').style.top = '-50px';
    //     nameWithDotElements[2].elem.querySelector('.name').style.top = '-20px';
    //     // nameWithDotElements[0].elem.querySelector('.arrow-down-name').style.height = '80px';
    //     // nameWithDotElements[1].elem.querySelector('.arrow-down-name').style.height = '50px';
    //     // nameWithDotElements[2].elem.querySelector('.arrow-down-name').style.height = '20px';
    // } else {
    //     // 检查两个标签重叠的情况
    //     for (let i = 0; i < nameWithDotElements.length - 1; i++) {
    //         if (Math.abs(nameWithDotElements[i].pos - nameWithDotElements[i + 1].pos) < 0.01) {
    //             nameWithDotElements[i].elem.querySelector('.name').style.top = '-80px';
    //             nameWithDotElements[i + 1].elem.querySelector('.name').style.top = '-50px';
    //             // nameWithDotElements[i].elem.querySelector('.arrow-down-name').style.height = '80px';
    //             // nameWithDotElements[i + 1].elem.querySelector('.arrow-down-name').style.height = '50px';
    //         }
    //     }
    // }
    //
    // // 单个标签
    // for (let i = 0; i < nameWithDotElements.length; i++) {
    //     if (nameWithDotElements[i].elem.querySelector('.name').style.top === '') {
    //         nameWithDotElements[i].elem.querySelector('.name').style.top = '-80px';
    //         // nameWithDotElements[i].elem.querySelector('.arrow-down-name').style.height = '80px';
    //     }
    // }


    // let dot_pos_1 = (split_answers[0][0] + 2) / 4;
    // let dot_pos_2 = (split_answers[0][1] + 2) / 4;
    // let dot_pos_3 = (split_answers[0][2] + 2) / 4;
    //
    // document.getElementById('name-with-dot1').style.left = (dot_pos_1) * 100 - (dot_pos_1 - 0.5) * 3.85 * 2 + '%';
    // document.getElementById('name-with-dot2').style.left = (dot_pos_2) * 100 - (dot_pos_2 - 0.5) * 3.85 * 2 + '%';
    // document.getElementById('name-with-dot3').style.left = (dot_pos_3) * 100 - (dot_pos_3 - 0.5) * 3.85 * 2 + '%';
    //
    // document.getElementById('dot1').style.background = interpolateColor(dot_pos_1);
    // document.getElementById('dot2').style.background = interpolateColor(dot_pos_2);
    // document.getElementById('dot3').style.background = interpolateColor(dot_pos_3);

    // if (split_answers[0][0] == split_answers[0][1] && split_answers[0][1] == split_answers[0][2]) {
    //     document.getElementById("name2").style.width = "max-content";
    //     document.getElementById("name2").style.left = "calc(50% - 45px)";
    // }





function after_bot_input_phase_3() {//在bot回答结束后,20240509直接跳过这个函数！！//////////////
    document.removeEventListener("timeup", after_bot_input_phase_3);//移除之前添加的 timeup 事件监听器，以避免重复触发
    all_bots_timeup = false;//all_bots_timeup 变量设置为 false，可能表示机器人回答的时间已经结束，但其他逻辑或事件可能还在进行中。
    const instruction = document.querySelector(".instruction_phase_3");
    const instruction_right = document.getElementById("instruction_right_phase_II");
    const statement = document.querySelector(".statement_phase_3");
    const answer_area = document.querySelector("#answer_area_phase_II");
    //使用 querySelector 和 getElementById 方法获取页面上的特定元素。
    const set_num = Math.floor(question_seqNum_in_phase / 6);//换成0，1，2三个分组每组2个题
    const set_index = phase_2_orders.set_order[set_num];
    const question_index = phase_2_orders.question_order[set_num][question_seqNum_in_phase % 6];
    const question_type = set_index_to_name[set_index];
    //这些计算是为了确定当前问题的集合编号、集合索引、问题索引和问题类型。
    //temp_answers[answers_first] = generate_answers_for_bots();//现在保存两个bot的回答，4个一上一下，两个同方向
    // register bot value
    /*temp_answers[answers_first] = generate_answers_for_bots();
    let text;
    if(temp_answers[answers_first] == 0)
        {text = "agrees"}
    else
        {text = "disagrees"}
    
    if(temp_answers[answers_first] == 1)
            {
                if(question_index == 0)
                    {statement_text = "the government should invest more scientific research funding into virtual reality technology instead of space exploration.";}
                if(question_index == 1)
                    {statement_text = "the cloning technology should NOT be used to provide infertile couples using test-tube fertilization with more embryos to increase their chances of conceiving.";}
                if(question_index == 4)
                    {statement_text = "the city council should name new streets after natural landmarks rather than local historical figures.";}
                if(question_index == 6)
                    {statement_text = "the priority of public space usage should be given to street performers rather than to food vendors.";}
                if(question_index == 8)
                    {statement_text = "the local government should prioritize waste-to-energy plants over recycling programs in changes to waste management.";}
            }
    console.log("question_index:", question_index); // 使用字符串拼接
    console.log("randomNumber_phaseII_text:", temp_answers[answers_first]);    */


    //display_values(answers_first, question_type);//只展示先回答的bot
    //20240514新设定，不展示///////////////////////////////////////////////////

    //调用 generate_answers_for_bots 函数为机器人生成答案，并将答案存储在 temp_answers 数组中。然后，调用 display_values 函数来显示这些答案。
    //document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);

    // change DOM
    setTimeout(() => {
        let profiles = document.querySelectorAll(".profile_with_labels");
        let index = 0;
        profiles.forEach((profile) => {//让带标签的卡片显示是否正在回答问题的效果
            ///////////////////20240509,不需要这样的变化，直接展示卡片//////////////////////////////
            /*if (index == answers_first) {
                profile.classList.remove("finish_answering");
                profile.classList.add("not_answering_now");
            } else {
                profile.classList.add("answering_now");
                profile.classList.remove("not_answering_now");
                document.getElementById(`status_${index}`).innerHTML = loader_string;
            }*///////////////////////////////////////////////////////////////////////////////////
            profile.classList.add("answering_now");
            index++;
        });
        //使用 setTimeout 函数（尽管延迟设置为0毫秒）来确保DOM更新在当前的执行栈完成后发生。
        //statement.innerHTML = `Q${next_question_seqNum}. <b style="color: ${color_name[answers_first]};">${pseudonyms_chosen[answers_first]}</b> thinks that ` + statement_text;
        statement.innerHTML = `Statement: ` + `"` + statement_text + `"`;
        statement.classList.remove("concealed");
        answer_area.classList.remove("concealed");
        //将 statement 元素的 innerHTML 设置为 statement_text，
        //并在其前后添加引号。同时，移除 statement 和 answer_area 元素的 concealed 类，使它们可见。
        document.querySelectorAll(".option-button").forEach((button) => {
            button.disabled = false;
        });//通过查询所有的 .option-button 元素，并遍历它们，将每个按钮的 disabled 属性设置为 false，从而启用它们。
        if (set_index_to_name[set_index] == "design") {
            toggle_image_display(question_index);
        }//如果当前问题的类型是 "design"，则调用 toggle_image_display 函数，根据 question_index 来显示或隐藏相关的图片。

        // deal with instruction
        index_of_bots_left = generate_bot_array(num_of_participants, human_index);
        index_of_bots_left.splice(index_of_bots_left.indexOf(answers_first), 1);
        //instruction.innerHTML = ``;
        //instruction.style[`background-color`] = "";
        //首先，通过调用 generate_bot_array 函数来生成一个包含所有机器人索引的数组，
        //并从中移除当前已经回答问题的机器人索引 answers_first。然后，清空 instruction 元素的 innerHTML 和背景颜色
        //20240509//////////////////////////////////////////////////////////////////////////////////////////////////////
        //instruction_right.innerHTML = `Q${next_question_seqNum}. `;
        /*instruction_right.innerHTML += `
            <div style="font-size: 30px;">
            Q${next_question_seqNum}. <b style="color: ${color_name[answers_first]};">${pseudonyms_chosen[answers_first]}</b> <b style="color: ${color_name[answers_first]};">${text}</b> with the statement below:
            </div>
        `;*/
        //instruction_right.style[`background-color`] = instruction_background_color;给instruction设置灰色
        //statement.style[`background-color`] = instruction_background_color;

        //更新 instruction_right 元素的 innerHTML，显示当前轮到哪个用户（人类或机器人）来回答问题。同时，设置 instruction_right 的背景颜色。

        // start_bot_timers
        start_bot_timers(index_of_bots_left, "phase_3_question");//先回答的bot回答结束后，开始人回答，计算回答时间。
        start_time[human_index] = Date.now();
        //调用 start_bot_timers 函数来启动剩余机器人的计时器。同时，记录当前人类用户开始回答问题的时间

        // after the user clicks the button
        document.querySelector(".submit-button").addEventListener("click", () => {
        // document.querySelector(".submit-button").addEventListener("click", () => {
            //当页面上的 .submit-button 元素被点击时，会触发一个匿名函数
            /*let profile = document.getElementById(`profile_${human_index}`);
            profile.classList.remove("answering_now");
            profile.classList.add("finish_answering");
        //通过用户索引 human_index 获取用户的头像元素 profile，移除 answering_now 类（表示用户正在回答中），
        //并添加 finish_answering 类（表示用户已完成回答）。
            answer_area.classList.add("concealed");
            //给 answer_area 元素添加 concealed 类，以隐藏答案区域。
            document.querySelectorAll("button").forEach((button) => {
                button.disabled = true;
            });//选择页面上的所有按钮，并将它们的 disabled 属性设置为 true，以禁用这些按钮
*///20240514//////////////////
            statement.innerHTML = ``;
            const question = document.querySelector(".question_phase_3");
            question.innerHTML = ``;
            instruction.innerHTML = ``;
            statement.style[`background-color`] = "";

            /*for (let i = 0; i < num_of_participants; i++) {
                if (i != answers_first && i != human_index)
                    temp_answers[i] = null;
            }*/
            //240627,现在需要保存每个人在phase II的回答
            //遍历所有参与者，除了已经回答问题的机器人 answers_first 和当前人类用户 human_index，
            //将其他机器人的临时答案 temp_answers 设置为 null。


            each_answer.time_to_answer[human_index] = (Date.now() - start_time[human_index]) / 1000;
            //计算人类用户从开始回答问题到点击提交按钮所花费的时间（秒），并将这个时间存储在 each_answer.time_to_answer 数组中。
            //document.getElementById(`status_${human_index}`).innerHTML = ``;
            enter_next();
            //清空当前人类用户的状态显示区域的 innerHTML。
            //instruction.innerHTML = ``;
            //清空 instruction 元素的 innerHTML，移除之前的指令内容。
            /* if (all_bots_timeup)
                 all_finish_answering_phase_3();//在所有用户完成答题后，更新页面上的各种元素
             else
                 document.addEventListener("timeup", all_finish_answering_phase_3);*/
            //20240515：不再需要完成回答的界面，直接enter——next
            //如果 all_bots_timeup 为 true，即所有机器人已经回答完毕或者超时，则直接调用 all_finish_answering_phase_3 函数。
            //否则，为 document 添加一个名为 timeup 的事件监听器，当该事件触发时，会调用 all_finish_answering_phase_3 函数。
        });
    }, time_configurations['lag'] * 1);//取消延迟1000-》1
};



//all_finish_answering_phase_3 函数的主要目的是在所有用户完成答题后，更新页面上的各种元素，包括指令、答案区域、用户头像状态，并准备进入下一个问题
function all_finish_answering_phase_3() {
    document.removeEventListener("timeup", all_finish_answering_phase_3);
    //这行代码移除了之前可能添加的名为 "timeup" 的事件监听器，确保 all_finish_answering_phase_3 函数不会再次被该事件触发。
    clearInterval(timer);
    //如果之前有设置一个名为 timer 的定时器（可能是用来控制答题时间或检查机器人是否超时），这行代码会清除它，避免继续执行定时器的回调函数。
    all_bots_timeup = false;
    //将 all_bots_timeup 变量设置为 false，表示当前没有机器人超时。
    const statement = document.querySelector(".statement_phase_3");
    statement.innerHTML = ``;
    const question = document.querySelector(".question_phase_3");
    question.innerHTML = ``;
    // a lag before "check your answers"
    setTimeout(() => {
        const instruction_right = document.getElementById("instruction_right_phase_II");
        const instruction = document.getElementsByClassName("instruction_phase_3")[0];

        ///20240509清除样式//////////////////////////////////////////////////////////////////////////////////////////////
        instruction_right.innerHTML = `
            <div>
                Now you have finished this question. Please enter the next question.
            </div>
        `;
        //instruction_right.style[`background-color`] = instruction_background_color;
        //获取页面上的 instruction_right_phase_II 元素，并更新其 innerHTML 来显示一条消息，告知所有用户都已完成答题，
        //可以输入下一个问题。同时，设置该元素的背景颜色为 instruction_background_color 变量的值。

        instruction.innerHTML = ``;
        //instruction.style[`background-color`] = "";
        //清空 instruction_phase_3 类的第一个元素的 innerHTML，并移除其背景颜色样式*/

        const answer_area = document.querySelector("#answer_area_phase_II");
        answer_area.innerHTML = `<button class="enter-next-button">Next Question</button>`;
        answer_area.classList.remove("concealed");

        //获取 answer_area_phase_II 元素，并更新其 innerHTML 来显示一个带有 "Next Question" 文本的按钮。同时，移除 concealed 类，使得答案区域可见
        /*document.querySelectorAll(".profile_with_labels").forEach((profile) => {
            profile.classList.remove("finish_answering");
            profile.classList.add("not_answering_now");
            //选择所有带有 profile_with_labels 类的元素，移除它们的 finish_answering 类，并添加 not_answering_now 类，以更新用户头像的状态。
        })*/


        document.querySelector("button").addEventListener('click', enter_next);
        //为页面上的第一个按钮元素添加点击事件监听器，当该按钮被点击时，会调用 enter_next 函数。
    }, time_configurations['lag'] * 1);//使用 setTimeout 函数来设置一个延迟，延迟的时间是 time_configurations['lag'] 的值乘以 1000（将其从秒转换为毫秒）。
    //在这个延迟之后，会执行提供的回调函数，用于更新页面状态,20240509不设置延迟，原来乘1000
};

