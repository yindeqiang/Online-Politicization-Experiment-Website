function generate_sequence_array(start, num) {
    let ret = [];
    for (let i = 0; i < num; i++) {
        ret.push(i + start);
    }
    return ret;
}


function generate_zero_array(num) {
    let ret = [];
    for (let i = 0; i < num; i++) {
        ret.push(0);
    }
    return ret;
}



function generate_bot_array(num_of_participants, human_index) {
    let ret = [];
    for (let i = 0; i < num_of_participants; i++) {
        if (i != human_index)
            ret.push(i);
    }
    return ret;
}
//generate_bot_array 的目的是生成一个数组，该数组包含了从 0 到 num_of_participants - 1 的整数，但排除了 human_index 这个特定的索引


var get_ranks = (arr) => arr.map((x, y, z) => z.filter((w) => w > x).length + 1);



function gaussianRandom(mean = 0, stdev = 1, lower_bound = null, upper_bound = null) {
    let u = 1 - Math.random(); // Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // Transform to the desired mean and standard deviation:
    let ret = z * stdev + mean;
    if (lower_bound)
        ret = Math.max(ret, lower_bound);
    if (upper_bound)
        ret = Math.min(ret, upper_bound);
    return ret;
}



function transform_dots() {//正在等待的效果
    let dots = document.querySelector(".dots");
    let base_t = new Date().getTime();
    timer = setInterval(() => {
        let temp_t = new Date().getTime();
        let seconds = Math.floor(((temp_t - base_t) % (1000 * 60)) / 1000);
        if (seconds % 4 == 0)
            dots.innerHTML = '';
        else if (seconds % 4 == 1)
            dots.innerHTML = '.';
        else if (seconds % 4 == 2)
            dots.innerHTML = '..';
        else
            dots.innerHTML = '...';
    }, 1000);
}
/**transform_dots 函数是用来在网页上动态显示一个“等待”效果的，
 * 具体表现为在指定的元素中不断地添加或移除点号（.），从而创建出一种“正在加载”或“请稍候”的视觉效果。 */


function generate_random_answer(min = -3, max = 3, step = 0.1) {//指定最大最小和步长
    let fix_num = Math.max(0, -Math.floor(Math.log10(step)));
    return parseFloat((Math.random() * (max - min) + min).toFixed(fix_num));
}
/**这个函数用于生成一个指定范围内的随机数，可以指定最小值、最大值和步长（可选，默认为0.1）。

min 是生成随机数的最小值，默认为 -3。
max 是生成随机数的最大值，默认为 3。
step 是生成随机数的步长，即随机数之间的最小差值，默认为 0.1。
函数首先计算 step 的小数点位数（即小数部分的位数），然后使用 toFixed 方法将生成的随机数保留相同的小数点位数。最后，将结果解析为浮点数并返回。

这个函数的作用是确保生成的随机数在指定的范围内，并且保留了与步长相符的小数点位数。 */


function after_check() {
    let checkboxes = document.querySelectorAll("input[type=checkbox]");
    let button = document.querySelector("button");
    let all_checked = true;
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked == false) {
            all_checked = false;
        }
    })
    if (all_checked) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}


var slider_moved = [false, false, false];

function get_slider_value(eSlider) {
    let slider_value = document.querySelector('#slider_value');
    if (slider_value) {
        if (phase != 3) {
            slider_value.innerHTML = parseFloat(eSlider.value).toFixed(1);
        }
        else {
            let step = question_wrap.step;
            let fix_num = Math.max(-Math.floor(Math.log10(step)), 0);
            if (question_wrap.type != 'fact')
                slider_value.innerHTML = parseFloat(eSlider.value).toFixed(2);
            else {
                if (question_wrap.percentage)
                    slider_value.innerHTML = `${parseFloat(eSlider.value * 100).toFixed(Math.max(fix_num - 2, 0))}%`;
                else
                    slider_value.innerHTML = parseFloat(eSlider.value).toFixed(fix_num);
            }
        }
    }
    if (phase != 4) {
        if (phase == 2) {
            const ideology_id = eSlider.parentNode.id.charAt(eSlider.parentNode.id.length - 1);
            slider_moved[ideology_id] = true;
            if (slider_moved[0] && slider_moved[1] && slider_moved[2]) {
                document.querySelector("button").disabled = false;
            }
        } else {
            document.querySelector("button").disabled = false;
        }
    }
}



function generate_form(name_list) {
    let ret = `<form class="form_generated"><div class="radios">`;
    let index = 0;
    for (let name of name_list) {
        if (index == 0)
            ret += `<input type="radio" id="radio_${index}" name="unknown" value="${index}" checked/>`;
        else
            ret += `<input type="radio" id="radio_${index}" name="unknown" value="${index}" />`;
        ret += `<label for="radio_${index}">${name}</label>`;
        index += 1;
    }
    ret += `</div></form>`;
    return ret;
}



function add_mark_texts(name_list, area = document) {//添加标签
  
    //let evaluation = document.getElementById(`evaluation_0`);
    //console.log(area, evaluation);
    let all_marks = area.querySelectorAll(".mark_texts");

    if (name_list.length == 2 || name_list.length == 7) {
        all_marks.forEach((marks) => {
            if (name_list.length == 2)
                name_list = [name_list[0], null, null, 'Neutral', null, null, name_list[1]];
            let index = 0;
            for (let name of name_list) {
                if (name) {
                    let len = 0;
                    for (let char of name) {
                        if (char != '<')
                            len++;
                        else
                            break;
                    }
                    let dis_from_left = 10 + 97 * index - len * 2.4;
                    marks.innerHTML += `<div class="mark_text" id="text_${index}" style="left: ${dis_from_left}px">${name}</div>`;
                }
                index++;
            }
        });
    }

    else if (name_list.length == 5) {
        all_marks.forEach((marks) => {
            let index = 0;
            for (let name of name_list) {
                let len = 0;
                for (let char of name) {
                    if (char == '<')
                        len = 0;
                    else if (char != '>')
                        len++;
                }
                let initial_offset = 12;
                let range_len = 145.5;
                let len_coef = 2.5;
                let dis_from_left = initial_offset + index * range_len - len * len_coef;
                marks.innerHTML += `<div class="mark_text" id="text_${index}" style="left: ${dis_from_left}px">${name}</div>`;
                index++;
            }
        });
    }
}

/**主要作用是：根据 name_list 列表中的元素数量和内容，向页面中的特定元素（类名为 mark_texts 的元素）添加一些具有特定样式的子元素（类名为 mark_text 的 div 元素）。

以下是函数的主要步骤和逻辑：

使用 querySelectorAll 方法从 area 参数指定的范围内选择所有类名为 mark_texts 的元素，并将它们存储在 all_marks 变量中。

检查 name_list 的长度。如果长度为 2 或 7，则执行以下操作：

遍历 all_marks 中的每个元素（marks）。
如果 name_list 的长度为 2，则将其扩展为 [name_list[0], null, null, 'Neutral', null, null, name_list[1]]。
定义一个索引变量 index 并初始化为 0。
遍历 name_list 中的每个元素（name）。
如果 name 非空，则计算其长度（排除 '<' 字符之前的所有字符）。
计算 name 应该距离左边多远的位置（dis_from_left），并基于该位置向 marks 的 innerHTML 添加一个新的 div 元素，该元素包含 name 并且具有特定的样式（特别是 left 属性）。
index 自增。
如果 name_list 的长度为 5，则执行与上述类似的逻辑，但计算距离左边的位置（dis_from_left）时使用的公式和参数不同。 */




function generate_and_add_mark_texts() {
    if (question_wrap["type"] == 'issue')
        add_mark_texts(mark_texts.issue);
    else if (question_wrap["type"] == 'prediction')
        add_mark_texts(mark_texts.prediction);
    else {
        let min = question_wrap["range"][0];
        let max = question_wrap["range"][1];
        let mark_texts = [];
        for (let i = 0; i <= 6; i++) {
            let number = min + (max - min) / 6 * i;
            if (number >= 1)
                mark_texts.push(`${number}`);
            else {
                mark_texts.push(`${(number * 100).toFixed(1)}%`);
            }
        }
        add_mark_texts(mark_texts);
    }
}
/**主要目的是根据 question_wrap 对象的 type 属性值来生成不同的标记文本（mark texts），并使用 add_mark_texts 函数将这些文本添加到页面上。

以下是该函数的逻辑步骤：

检查问题类型：
函数首先检查 question_wrap 对象的 type 属性。如果 type 是 'issue'，则调用 add_mark_texts 函数并传入 mark_texts.issue 作为参数。如果 type 是 'prediction'，则传入 mark_texts.prediction。

生成标记文本（对于非特定类型）：
如果 type 不是 'issue' 或 'prediction'，则函数进入另一个逻辑分支，该分支生成一个基于 question_wrap["range"] 的标记文本数组。

min 和 max 分别从 question_wrap["range"] 数组中获取最小值和最大值。
接下来，函数通过一个循环生成 7 个标记文本（i 从 0 到 6）。每个文本都是基于 min 和 max 之间的等距间隔计算出来的。
如果计算出的 number 大于或等于 1，则将其转换为字符串并添加到 mark_texts 数组中。
如果 number 小于 1，则将其乘以 100 并保留一位小数，然后添加百分号（%）并转换为字符串，再添加到 mark_texts 数组中。
最后，使用生成的 mark_texts 数组调用 add_mark_texts 函数。 */



function display_values(index = null, question_type = null) {///////重要！这是实际在使用的展示模块
    if (phase == 1) {
        // non-preference questions
        if (index_of_question < phase_1_statements[0].length + phase_1_statements[1].length) {
            for (let index = 0; index < num_of_participants; index++) {
                const profile = document.getElementById(`profile_${index}`);
                if (temp_answers[index] == 0) {
                    profile.innerHTML += `
                        <div class="bubble" id="bubble_${index}">
                            <p>Agree</p>
                            ${up_arrow_svg}
                        </div>
                    `;
                } else {
                    profile.innerHTML += `
                        <div class="bubble" id="bubble_${index}">
                            <p>Disagree</p>
                            ${down_arrow_svg}
                        </div>
                    `;
                }
                profile.querySelector(".arrow").classList.add("arrow-answer");
                if (temp_answers[index] == temp_answers[human_index]) {
                    const bubble = document.getElementById(`bubble_${index}`)
                    bubble.style["background-color"] = "lightgrey";
                    bubble.style.setProperty('--bubble-after-color', 'lightgrey');
                }
            }
        }
        // preference-related questions
        else {
            const ans = phase_1_statements[2][index_of_question - phase_1_statements[0].length - phase_1_statements[1].length].range[temp_answers[index]];
            if (temp_answers[index] != temp_answers[human_index]) {
                document.getElementById(`profile_${index}`).innerHTML += `
                    <div class="bubble_white" id="bubble_${index}">
                        ${ans}
                    </div>
                `;
            } else {
                document.getElementById(`profile_${index}`).innerHTML += `
                    <div class="bubble" id="bubble_${index}">
                        ${ans}
                    </div>
                `;
            }
        }
    }

    else if (phase == 3) {
        const ans = temp_answers[index];//ans是一个临时的答案列表
        let ans_text = "";
        switch (question_type) {
            case "design":
                if (ans == 0)
                    ans_text = "Left";
                else
                    ans_text = "Right";
                break;
            case 'fact':
            case 'prediction':
                if (ans == 0)//左侧的选项是0，文字是agree
                    ans_text = "Yes";
                else
                    ans_text = "No";
                break;
            case 'issue':
                if (ans == 0)
                    ans_text = "Agree";
                else
                    ans_text = "Disagree";
                break;
            default:
                break;
        }
        /**函数参数:
        
        index（默认为 null）：表示参与者的索引。
        question_type（默认为 null）：表示问题的类型。
        函数体:
        
        检查当前阶段：
        
        如果 phase 等于 1，函数会执行一系列操作来更新页面，具体取决于当前的问题索引 index_of_question 和存储在 temp_answers 数组中的答案。
        如果 phase 等于 3，函数会基于提供的 index 和 question_type 来显示特定的答案文本。
        阶段 1 的处理:
        
        函数首先遍历所有的参与者（从 0 到 num_of_participants - 1）。
        对于每个参与者，它检查当前的问题索引 index_of_question 是否小于前两个声明数组 phase_1_statements[0] 和 phase_1_statements[1] 的长度之和。
        如果是，它会检查 temp_answers[index] 是否为 1，并据此设置 ans 为同意或不同意的样式配置。
        如果不是，它会从第三个声明数组 phase_1_statements[2] 中获取相应的范围文本。
        接下来，函数检查当前参与者的答案是否与人类的答案（temp_answers[human_index]）不同。
        如果不同，它会在对应的 profile_${index} 元素中添加一个带有白色气泡的 div 元素，并显示答案。
        如果相同，它会添加一个带有普通气泡的 div 元素。
        阶段 3 的处理:
        
        函数首先获取存储在 temp_answers[index] 中的答案。
        使用 switch 语句，根据 question_type 的值来设置 ans_text 的内容。
        如果 question_type 是 "design"，它会根据答案是 0 还是其他值来设置 ans_text 为 "Left" 或 "Right"。
        如果 question_type 是 'fact' 或 'prediction'，它会设置 ans_text 为 "Yes" 或 "No"。
        如果 question_type 是 'issue'，它会设置 ans_text 为 "Agree" 或 "Disagree"。
        对于其他 question_type，函数不执行任何操作。 */
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        /**let profile_html = document.getElementById(`profile_${index}`).innerHTML;
         //这行代码获取了ID为profile_${index}的元素的HTML内容，并将其存储在profile_html变量中。
         //这里${index}是一个模板字符串，它会被替换为index变量的实际值 
         let tempDiv = document.createElement('div');
         //创建了一个新的div元素，并将其存储在tempDiv变量中 
         tempDiv.innerHTML = profile_html;
         //将之前获取的profile_html内容设置为tempDiv的HTML内容。 
         tempDiv.classList = "profile-in-option";//phaseII的CSS221行，这是指在选项中的卡片展示情况
         //这行代码给tempDiv添加了一个CSS类profile-in-option 
         const option_with_profile = document.getElementById(`option-with-profile-${ans}`);
         //ID为option-with-profile-${ans}的元素，并将其存储在option_with_profile常量中。这里${ans}同样是一个模板字符串.
         option_with_profile.appendChild(tempDiv);
         //这行代码将tempDiv作为子元素添加到option_with_profile中
         option_with_profile.innerHTML += `
             <div class="arrow-down"></div>
         `;这行代码在option_with_profile的HTML内容末尾添加了一个具有arrow-down类的div元素 */
        let profile_html = document.getElementById(`profile_${index}`).innerHTML;//phaseII使用中index用的answerfirst，也就是answer_first的外观
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = profile_html;
        //tempDiv.classList.add("profile-in-option");
        // 根据答案的位置动态设置卡片的位置和箭头的方向
        if (ans === 0) {
            ///////////////////////////20240509,不需要在选项附近展示卡片和箭头了//////////////////////////////////////////
            tempDiv.classList.add("profile-left");//在向下箭头基础上进行旋转修正成左右


            // 创建一个新的内联元素 <span> 用于显示文本提示
            /*var textElement = document.createElement("span");
            textElement.textContent = `It is ${pseudonyms_chosen[answers_first]}'s answer for this question.`; // 设置文本内容
            
            // 找到具有 "profile-left" 类的元素
            var profileLeftElement = document.querySelector(".profile-left");
            
            // 将新元素添加到具有 "profile-left" 类的元素内部
            profileLeftElement.appendChild(textElement);*/


            //createNotification_phaseII_answer();
            //tempDiv.classList.add("profile-left-mention");
            // 找到具有 "profile-left-mention" 类的所有元素
            //let mentionElements = document.querySelectorAll('.profile-left-mention');
            // 遍历每个元素并修改其文本内容
            //mentionElements.forEach(function(element) {element.textContent = `It is ${pseudonyms_chosen[answers_first]}'s answer for this question.`;});
            //element.textContent = `It is ${pseudonyms_chosen[answers_first]}'s answer for this question.`;

            //option_with_profile.innerHTML += `<div class="arrow-down-new arrow-right"></div>`;
        } else {
            ///////////////////////////20240509,不需要在选项附近展示卡片和箭头了//////////////////////////////////////////
            tempDiv.classList.add("profile-right");


            //createNotification_phaseII_answer();
            //tempDiv.classList.add("profile-right-mention");
            //let mentionElements = document.querySelectorAll('.profile-right-mention');
            // 遍历每个元素并修改其文本内容
            //mentionElements.forEach(function(element) {element.textContent = `It is ${pseudonyms_chosen[answers_first]}'s answer for this question.`;});

            //option_with_profile.innerHTML += `<div class="arrow-down-new arrow-left"></div>`;
        }
        const option_with_profile = document.getElementById(`option-with-profile-${ans}`);//在选项的样式中添加子类来实现选项附近的卡片和提示
        option_with_profile.appendChild(tempDiv);
        if (ans === 0) {
            ///////////////////////////20240509,不需要在选项附近展示卡片和箭头了//////////////////////////////////////////
            option_with_profile.innerHTML += `<div class="arrow-down-new arrow-right"></div>`;
            var mentionLeftDiv = document.createElement('div');
            mentionLeftDiv.className = "mention-left";
            option_with_profile.appendChild(mentionLeftDiv);

        }
        else {
            option_with_profile.innerHTML += `<div class="arrow-down-new arrow-left"></div>`;
            var mentionRightDiv = document.createElement('div');
            mentionRightDiv.className = "mention-right";
            option_with_profile.appendChild(mentionRightDiv);
        }
        // 创建一个新的文本节点
        ////////////////////////////20240509////////////////////////////////////////////////////////////////////////////////
        var textNodeLeft = document.createTextNode(`${pseudonyms_chosen[answers_first]} has chosen this option.`);
        var textNodeRight = document.createTextNode(`${pseudonyms_chosen[answers_first]} has chosen this option.`);

        var textBefore = "chose this.";
        var coloredText = document.createElement('span'); // 创建一个span元素  
        coloredText.textContent = `${pseudonyms_chosen[answers_first]}`; // 设置span的文本内容  
        coloredText.style.color = color_name[answers_first]; // 设置span的文本颜色  

        // 创建一个文本节点包含剩下的文本  
        var textAfterNode = document.createTextNode(textBefore);
        //<h2 class="name" style="font-weight: bold; font-size: larger; color: ${color_name[index]};">${name}</h2>
        // 找到具有 ".mention-left" 类的元素
        var mentionLeftElement = document.querySelector(".mention-left");
        // 将文本节点添加到 .mention-left 元素中
        if (mentionLeftElement) {
            /////////////////////////////////////////////20240509
            mentionLeftElement.appendChild(textNodeLeft);

            //mentionLeftElement.appendChild(coloredText);
            //mentionLeftElement.appendChild(textAfterNode);
        }


        // 找到具有 ".mention-right" 类的元素
        var mentionRightElement = document.querySelector(".mention-right");
        // 将文本节点添加到 .mention-right 元素中
        // 将文本节点添加到 .mention-right 元素中
        if (mentionRightElement) {
            ///////////////////20240509///////////////////////////////////////////////
            mentionRightElement.appendChild(textNodeRight);
            //mentionLeftElement.appendChild(coloredText);
            //mentionLeftElement.appendChild(textAfterNode);
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //我希望把左侧的气泡删掉，下面是尝试过程,删掉后已成功，现在不需要删
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        /*document.getElementById(`profile_${index}`).innerHTML += `
             <div class="bubble_down" id="bubble_${index}">
                 ${ans_text}
             </div>
         `;
         ///////////////////////////////////////////////////////////////////////////////////////////////////
         /**这行代码在ID为profile_${index}的元素的HTML内容末尾添加了一个新的div元素，为了在左侧显示一个agree/disagree的效果
          * 该元素具有bubble_down类，并且ID为bubble_${index}，同时其内部包含${ans_text}的内容 */

        //document.querySelector(".profile-in-option > * > * > .status").innerHTML = ``;/** */
        // 定义事件处理程序函数
        if (ans === 0) {
            document.querySelector(".profile-left > * > * > .status").innerHTML = ``;
            //document.querySelector(".profile-left-mention > * > * > .status").innerHTML = ``; 

        }
        else {
            document.querySelector(".profile-right > * > * > .status").innerHTML = ``;
            //document.querySelector(".profile-right-mention > * > * > .status").innerHTML = ``;
        }

        // 添加事件监听器
        //document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

        // 在需要时移除事件监听器
        // 例如，在某个条件下执行以下代码以移除事件监听器
        // document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);

        /*if (ans === 0) {
        document.querySelector(".profile-in-left > * > * > .status").innerHTML = ``;/** 
        document.querySelector(".profile-left-mention > * > * > .status").innerHTML = ``;/** 
         
        }
        else
        {document.querySelector(".profile-in-right > * > * > .status").innerHTML = ``;/** 
        document.querySelector(".profile-right-mention > * > * > .status").innerHTML = ``;}*/

        //removeNotification_phaseII_answer();

        /**这行代码选择了所有满足.profile-in-option > * > * > .status选择器的元素，并清空其HTML内容。
         * 这实际上可能选择多个元素，但只会更改第一个找到的元素的HTML内容。 */

        /*let statusElements = document.querySelectorAll(".profile-in-option > * > * > .status");

        // 遍历所有匹配的元素并更改它们的 HTML 内容
        statusElements.forEach(function(element) {
        element.innerHTML = ""; // 清空HTML内容
        });*/
    }
    else if (phase == 2) {
        let min = -2, max = 2;
        for (let type of evaluation_types) {
            for (let index = 0; index < num_of_participants; index++) {
                if (type != 'ideology' && index == human_index)
                    continue;
                let input = document.querySelector(`#input_${type}_${index}`);
                let value = input.querySelector(`input[type=range]`).value;
                let dis_from_left = -3 + 97 * (value - min) / ((max - min) / 6);
                let name = pseudonyms_chosen[index];
                //console.log("split_answers:", split_answers);
                //newAvatarIndextmp[index]代表索引方式存储的偏置label
                //if (index == human_index),只注释下面，就只能显示human的名字了！！
                //name += '<b>(You)</b>';//phase4选头像阶段！！！！！！这里是拖动轴的3个人的头像！！！label是png格式！！
                ///////////////////////////////////////20240509不需要在受试者加you/////////////////////////////////////////////
                ///注意，现在还是换成选择原来的空白头像0号，而不是${newAvatarIndextmp[index]}
                let x = document.querySelectorAll("input[type=range]")[index].value;
                let normalizedX = (parseFloat(x) + 2) / 4;
                input.querySelector(".answers_mark").innerHTML = `
                    <div>
                        <!--<div class="avatar_scale_phase_4" style="left: ${dis_from_left}px">
                            < img src="/static/avatars/label_${avatars_index_chosen[index]}_0.png" />
                        </div>  -->
        <!--           20240509上面注释掉了图片，下面名字+31也换成了0                                    -->
                        <div class="pseudonym_scale_phase_4" style="left: ${dis_from_left + 0}px;" color=${interpolateColor(normalizedX)}>${name}</div>
                    </div>
                `;
            }
        }
    }
    /**该部分代码似乎是为阶段 3 添加的额外逻辑，
    它首先获取了某个参与者的 profile 的 HTML 内容，然后创建了一个新的 div 元素（tempDiv），并将获取的 HTML 内容赋给它。
    接着，它给这个 tempDiv 添加了一个类名 "profile-in-option"，并将其作为一个子元素添加到了另一个元素（option_with_profile-${ans}）中。
    在这个 option_with_profile 元素内部，还添加了一个带有类名 "arrow-down" 的 div 元素。
    最后，它在原始的 profile_${index} 元素内部添加了一个带有类名 "bubble_down" 的 div 元素，并显示了 ans_text 的内容。
    代码的最后一行清空了具有类名 "status" 的元素的内部 HTML，但不清楚这个元素具体属于哪个父元素或上下文。 */
    else if (phase == 4) {
        let min = -2, max = 2;
        for (let type of evaluation_types) {
            for (let index = 0; index < num_of_participants; index++) {
                if (type != 'ideology' && index == human_index)
                    continue;
                let input = document.querySelector(`#input_${type}_${index}`);
                let value = input.querySelector(`input[type=range]`).value;
                let dis_from_left = -3 + 97 * (value - min) / ((max - min) / 6);
                let name = pseudonyms_chosen[index];
                //newAvatarIndextmp[index]代表索引方式存储的偏置label
                //if (index == human_index),只注释下面，就只能显示human的名字了！！
                //name += '<b>(You)</b>';//phase4选头像阶段！！！！！！这里是拖动轴的3个人的头像！！！label是png格式！！
                ///////////////////////////////////////20240509不需要在受试者加you/////////////////////////////////////////////
                ///注意，现在还是换成选择原来的空白头像0号，而不是${newAvatarIndextmp[index]}
                input.querySelector(".answers_mark").innerHTML = `
                    <div>
                        <!--<div class="avatar_scale_phase_4" style="left: ${dis_from_left}px">
                            <img src="/static/avatars/label_${avatars_index_chosen[index]}_0.png" />
                        </div>  -->
        <!--           20240509上面注释掉了图片，下面名字+31也换成了0                                    -->
                        <!-- <div class="pseudonym_scale_phase_4" style="left: ${dis_from_left + 0}px">${name}</div> -->
                        <div class="pseudonym_scale_phase_4">${name}</div>
                    </div>
                `;
            }
        }
    }
}

/**
 
处理阶段 4:

当 phase 等于 4 时，代码会执行一系列操作来更新页面，这些操作似乎与某种评价或比较有关。
首先，定义了 min 和 max 两个变量，分别代表范围的最小值和最大值。
接着，代码遍历 evaluation_types 数组中的每个类型。
对于每种类型，代码又遍历所有的参与者。
如果类型是 'ideology' 并且当前参与者是人类（index == human_index），则跳过当前循环。
对于每个参与者，代码通过查询选择器找到对应的输入元素，并获取其中的滑块输入值。
根据滑块的值，计算 dis_from_left（距离左侧的位移），这个位移用于设置头像的位置。
代码还获取了参与者的昵称，并在是人类的情况下，给昵称添加了加粗和括号标记。
最后，代码更新了输入元素内部的 .answers_mark 的 HTML 内容，显示了带有位移的头像和昵称。
 */




function track_answers() {
    let table = document.querySelector(".table_answers");
    let index = question_seqNum_in_phase;

    // for the first one, add the header of the table
    if (index == 0) {
        let HTML = `<tr><th class="th_summary"></th>`;
        for (let index = 0; index < num_of_participants; index++) {
            if (index == human_index)
                HTML += `<th class="th_name">You</th>`;
            else
                HTML += `<th class="th_name">${pseudonyms_chosen[index]}</th>`;
        }
        HTML += `<tr>`;
        table.innerHTML += HTML;
    }
    let summary_text = "";
    if (index_of_question < phase_1_statements[0].length)
        summary_text = phase_1_statements[0][index_of_question]['summary'];
    else if (index_of_question < phase_1_statements[0].length + phase_1_statements[1].length)
        summary_text = phase_1_statements[1][index_of_question - phase_1_statements[0].length]['summary'];
    else
        summary_text = phase_1_statements[2][index_of_question - phase_1_statements[0].length - phase_1_statements[1].length]['summary']
    table.innerHTML += `
        <tr>
            <td class="td_summary">
                <span class="answer_title">
                    Q${next_question_seqNum}.
                </span>
                <span class="summary">
                    ${summary_text}
                </span>
            </td>
            <td class="td_answer" id=ans${index}_0></td>
            <td class="td_answer" id=ans${index}_1></td>
            <td class="td_answer" id=ans${index}_2></td>
        </tr>
        <tr class="tr_margin"></tr>
    `;
    for (let i = 0; i < num_of_participants; i++) {
        let block = document.getElementById(`ans${index}_${i}`);
        if (temp_answers[i] == 0)
            block.innerHTML = up_arrow_svg;
        else
            block.innerHTML = down_arrow_svg;
        block.querySelectorAll(".arrow").forEach((arrow) => {
            arrow.classList.add("arrow-history");
        });
        // if the answer is the same as the user's
        if (temp_answers[i] == temp_answers[human_index])
            block.style['background-color'] = 'lightgrey';
    }
}



function generate_answers_for_bots(human_answer) {//给bot生成答案，注意现在要换成真实的human回答
    if (phase == 1) {
        let random_number = Math.floor(Math.random() * 10);//生成0~9的整数，floor向下取整
        let ret = [];//存机器人答案
        // issue question
        if (index_of_question < phase_1_statements[0].length + phase_1_statements[1].length) {//statement类的问题
            //let randValue = Math.random();
            let random_number = Math.floor(Math.random() * 10);//生成0~9的整数，floor向下取整
            //if (randValue <= phase_1_probability[data.ideologies[firstBotIndex.toString()]][index_of_question])//前一个，liberal,原来的逻辑是//生成的随机数比概率列表小的，将数值1添加到数组里，大的添加0
            if (phase_1_liberal[random_number][index_of_question] == 1)//前一个，liberal
                ret.push(1);
            else
                ret.push(0);//!!!!注意，这里的0代表左边选项，1代表右边选项！！！（按设定左边一般是同意，0）
            //randValue = Math.random();
            random_number = Math.floor(Math.random() * 10);//生成0~9的整数，floor向下取整
            //if (randValue <= phase_1_probability[data.ideologies[lastBotIndex.toString()]][index_of_question])//后一个bot，conservative
            if (phase_1_conservative[random_number][index_of_question] == 1)//前一个，liberal
                ret.push(1);
            else
                ret.push(0);

            return ret;


        }

        /**如果当前阶段（phase）是 1，函数会执行以下逻辑：
判断当前问题的索引（index_of_question）是否小于阶段 1 的陈述（statements）长度之和。
如果是，生成两个随机值（randValue），并基于这些随机值和预定义的概率数组 phase_1_probability 来决定机器人的答案。这个概率数组似乎是基于机器人的意识形态（ideologies）和问题的索引来确定的。如果随机值小于或等于对应的概率，机器人选择答案 1；否则选择答案 0。
如果不是（即处理偏好问题），函数将执行另一段逻辑。 */

        // preference question
        else {
            let ranks = get_ranks(phase_1_distances);
            for (let index = 0; index < num_of_bots; index++) {
                // from the farthest to the nearest
                if (ranks[index] == 1)
                    ret.push(human_answer);
                else if (ranks[index] == 2)
                    ret.push(1 - human_answer);
            }
        }
        return ret;
        /**如果当前问题不是阶段 1 的陈述问题，函数会处理偏好问题。
        首先，通过调用 get_ranks 函数，根据 phase_1_distances 数组获取机器人的排名（ranks）。
        然后，对于每个机器人（通过 index 遍历），根据其在排名中的位置来生成答案。
        如果机器人的排名是 1（即最远），它选择与用户相同的答案（human_answer）。
        如果机器人的排名是 2，它选择与用户相反的答案（1 - human_answer）。 */
    }

    else if (phase == 3) {
        let randomNumber = Math.random();
        randomNumber = randomNumber < 0.5 ? 0 : 1;
        return randomNumber;
    }
    /**let randomNumber = Math.random();: 使用 Math.random() 函数生成一个介于 0（包含）和 1（不包含）之间的随机浮点数，并将其赋值给 randomNumber。
    转换随机数为 0 或 1:
    
    randomNumber = randomNumber < 0.5 ? 0 : 1;: 
    使用三元运算符（ternary operator）将 randomNumber 转换为整数 0 或 1。如果 randomNumber 小于 0.5，则赋值为 0；否则，赋值为 1。 */
}



function add_ans_choices(name_list) {
    let index = 0;
    let flex = document.querySelector(".answer_choices");
    for (let name of name_list) {
        flex.innerHTML += `
            <div class="answer_choice" id="choice_${index}">
                <p>${name}</p>
            </div>
        `;
        index++;
    }
}



let index_of_choice_clicked = -1;

function click_on_choice(e) {
    let choices = document.querySelectorAll(".answer_choice")
    choices.forEach((choice) => {
        // the choice should contain e.target
        if (choice.contains(e.target)) {
            let id = parseInt(choice.id.replace("choice_", ""));
            // no choice is clicked yet
            if (index_of_choice_clicked < 0) {
                toggle_choice(choice, true);
                index_of_choice_clicked = id;
            }
            // else, unclick the already clicked one
            else {
                // unclick
                let choice_clicked = document.getElementById(`choice_${index_of_choice_clicked}`);
                toggle_choice(choice_clicked, false);
                // click itself
                if (id == index_of_choice_clicked)
                    index_of_choice_clicked = -1;
                // click other choices
                else {
                    toggle_choice(choice, true);
                    index_of_choice_clicked = id;
                }
            }
        }
        let button = document.querySelector("button");
        if (index_of_choice_clicked >= 0)
            button.disabled = false;
        else
            button.disabled = true;
    });
}

function interpolateColor(normalizedX) {
    if (normalizedX == 0.5)
        return "white";

    // 将颜色字符串转换为RGB对象（这里为了简单起见，我们使用固定的RGB值）
    function hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // 线性插值函数
    function lerp(t, a, b) {
        return a + t * (b - a);
    }

    // 假设的颜色值（你可以根据需要更改这些值）
    let blue = hexToRgb('#0000ff');
    let white = hexToRgb('#ffffff');
    let red = hexToRgb('#ff0000');

    // 根据normalizedX的值决定插值哪种颜色对
    if (normalizedX < 0.5) {
        // 蓝色到白色的插值
        let interpolatedColor = {
            r: Math.round(lerp(normalizedX * 2, blue.r, white.r)),
            g: Math.round(lerp(normalizedX * 2, blue.g, white.g)),
            b: Math.round(lerp(normalizedX * 2, blue.b, white.b))
        };
        return 'rgb(' + interpolatedColor.r + ', ' + interpolatedColor.g + ', ' + interpolatedColor.b + ')';
    } else if(normalizedX == 0.5){return '#000000';}
        
        else{
        // 白色到红色的插值
        let interpolatedColor = {
            r: Math.round(lerp((normalizedX - 0.5) * 2, white.r, red.r)),
            g: Math.round(lerp((normalizedX - 0.5) * 2, white.g, red.g)),
            b: Math.round(lerp((normalizedX - 0.5) * 2, white.b, red.b))
        };
        return 'rgb(' + interpolatedColor.r + ', ' + interpolatedColor.g + ', ' + interpolatedColor.b + ')';
    }
}



function toggle_choice(choice, click_or_unclick) {
    if (phase == 0) {
        if (click_or_unclick)
            choice.style.outline = style_configurations.clicked_identity_outline;
        else
            choice.style.removeProperty('outline');
    }

    else if (phase == 1) {
        if (click_or_unclick)
            choice.style['background-color'] = style_configurations.clicked_choice_background_color;
        else
            choice.style.removeProperty('background-color');
    }
}

function randomly_choose1(choices, num_to_choose, is_chosen) {//为选头像和名字不含0的专门写了一个函数！！
    //这里还是有问题！！！以后实验要改！！
    let ret = [];
    if (is_chosen == undefined) {//没有提供 is_chosen 参数，函数会使用 generate_zero_array 函数生成一个全零数组 is_chosen
        is_chosen = generate_zero_array(choices.length);//默认构建一个和选项长度一样长的全是0的数组
        ///20240509,直接随机选即可，不用默认占用////////////////////////////////////
        if (choices.length < 7)//6个头像
        { is_chosen[1] = 1; }
        if (choices.length > 7)//20个名字
        { is_chosen[6] = 1; }
        while (ret.length < num_to_choose) {//现在指定1号和6号被抽过了！
            let temp_index = generate_random_answer(0, choices.length, 1);//从0开始到所有的步长为1的选择
            if (is_chosen[temp_index] == 0) {//如果还是原来的默认0，那么就是没选过，可以将当前的作为新的头像选择
                is_chosen[temp_index] = 1;
                ret.push(choices[temp_index]);
            }
        }
    }
    return ret;
}


function randomly_choose(choices, num_to_choose, is_chosen) {
    let ret = [];
    if (is_chosen == undefined) {//没有提供 is_chosen 参数，函数会使用 generate_zero_array 函数生成一个全零数组 is_chosen
        is_chosen = generate_zero_array(choices.length);//默认全是0
        while (ret.length < num_to_choose) {
            let temp_index = generate_random_answer(0, choices.length, 1);//这里直接改成1可能会有问题
            if (is_chosen[temp_index] == 0) {
                is_chosen[temp_index] = 1;
                ret.push(choices[temp_index]);
            }
        }
    } else {
        while (ret.length < num_to_choose) {//选名字和头像用的这个
            //提供了 is_chosen 参数，则函数会在同样的方式下进行操作，但是会检查 is_chosen 对象的 data 属性中的值来确定哪些选项已被选择
            let temp_index = generate_random_answer(0, choices.length, 1);//这个函数的作用是确保生成的随机数在指定的范围内，并且保留了与步长相符的小数点位数
            if (is_chosen.data[temp_index] == 0) {//随机的时候不会选0，因为已经默认选了。
                is_chosen.data[temp_index] = 1;
                ret.push(choices[temp_index]);
            }
        }
    }

    return ret;
}
/**这个函数的作用是从给定的选项中随机选择一定数量的选项。

choices 是一个包含可供选择的选项的数组。
num_to_choose 是要选择的选项的数量。
is_chosen 是一个可选的参数，用于指示哪些选项已经被选择了。如果不提供此参数，函数会生成一个与 choices 数组长度相同的全零数组来表示哪些选项已被选择。
函数首先创建一个空数组 ret 用于存储选中的选项。

然后它有两种情况：

如果没有提供 is_chosen 参数，函数会使用 generate_zero_array 函数生成一个全零数组 is_chosen，表示所有选项都未被选择。然后它会在一个循环中随机选择一个选项，并检查它是否已经被选择。如果未被选择，则将其添加到结果数组 ret 中，并将 is_chosen 中对应的位置标记为已选择。
如果提供了 is_chosen 参数，则函数会在同样的方式下进行操作，但是会检查 is_chosen 对象的 data 属性中的值来确定哪些选项已被选择。
最后，函数返回选中的选项数组 ret。 */


function start_bot_timers(index_list, type) {//bot的计时器
    let wait_time = [];
    let last_time = 0, index_of_last_one = 0;
    let temp_time = 0;
    for (index of index_list) {//这里的index是在遍历index_list的每一个元素，而不是将下表的索引进行遍历！
        start_time[index] = Date.now();
        if (test_mode)
            temp_time = 0.5;//测试模式下直接0.5秒
        else {//20240509版：直接展示答案
            temp_time = 0.001;
            //20240430版：在下面的注释里/////////////////////////////////////////////////////////////////////////////////////
            /*if (type != 'issue')//不是issue类的问题
                {
                if(type != 'phase_3_question')
                    temp_time = time_configurations[type][0] + Math.random() * time_configurations[type][1];
                else 
                for (let index1 = 0; index1 < index_list.length; index1++) {//按照索引值的位置来遍历
                    temp_time = issue_answer_time_phaseII[index1] + time_configurations[type][0] + Math.random() * time_configurations[type][1];
                }

                
                }
            else {
                for (let index1 = 0; index1 < index_list.length; index1++) {//按照索引值的位置来遍历
                    temp_time = issue_answer_time[index1] + 2 * (Math.random() * time_configurations['issue'] - 0.5 * time_configurations['issue']);
                
                }
                //下面这个是按照题号的值对应索引的，我现在改成按照在列表中的位置进行索引！！
                //temp_time = issue_answer_time[index_of_question] + 2 * (Math.random() * time_configurations['issue'] - 0.5 * time_configurations['issue']);
                //temp_time = Math.max(temp_time, 7.88);//这里是指返回这两个数值中较大的一个。原来是3，我改成7.88了
                //issue类的问题，直接用设定好的10个数组，phaseI的问题。
            }*/
        }
        ///////////////////////20240430及以前//////
        wait_time.push(temp_time);
        /////////////////////////////////////////////////////////////////////////////////////////////////
        //202400509
        //wait_time.push(0);
        // if it's the last timer, then send the timeup event
        if (temp_time > last_time) {
            last_time = temp_time;
            index_of_last_one = index;
        }
    }
    let sequenced_index = 0;
    for (index of index_list) {
        setTimeout(bot_timeup, wait_time[sequenced_index] * 1000, index, index_of_last_one);
        sequenced_index += 1;
    }
}



function bot_timeup(index, last_bot_index) {
    let status = document.getElementById(`status_${index}`);
    if (status) {
        if (phase == 1 || phase == 3)
            status.innerHTML = ``;
        else
            status.innerHTML = tickmark_string;
    }

    /*if (phase == 0) {///进入phase1答题前的选头像!!注意现在都是png图像！！！！
        let name = pseudonyms_chosen[index];//进入phase1答题前的选头像
        document.getElementById(`profile_${index}`).innerHTML = `
            <img src="/static/avatars/avatar_${avatars_index_chosen[index]}.png" class="img_big" >
            ${name}
            <div id="status_${index}" class="status">${tickmark_string}</div>
        `;
    } else if (phase == 3) {
        let profile = document.getElementById(`profile_${index}`);//添加是否在回答问题
        profile.classList.remove("answering_now");
        profile.classList.add("finish_answering");
    }*/
   //20240626没有上述过程

    each_answer.time_to_answer[index] = (Date.now() - start_time[index]) / 1000;

    if (index == last_bot_index) {
        all_bots_timeup = true;
        document.dispatchEvent(timeupEvent);
    }
}



function wait_for_participants_to_join() {//等待受试者加入实验,这是原来的代码
    let firstWaitingIndex = 0;  // the index of the bot waiting first, could be from 0 to number of participants
    let lastWaitingIndex = 2;
    if (human_index == 0)
        firstWaitingIndex += 1; // if the index of human is 0, then the first waiting bot takes 1

    // When the user enters, a bot has already been waiting. Before the other bot enters, that first bot will leave.
    let hisNameIndex = 0;//默认给第一个进入实验的bot设定的第一个名字和第一个头像
    let hisAvatarIndex = 0;

    // get the first name and avatar that isn't the same with all participants (include human)
    while (true) {//保证让bot和人的名字头像不一样
        let flag = true;
        for (let i = 0; i < num_of_participants; i++) {//三个人，选了3次头像
            if ((pseudonyms_chosen[i] == pseudonyms[hisNameIndex])) {//first_bot选名字
                flag = false;
                break;
            }
        }
        if (flag)
            break;
        hisNameIndex++;
    }
    while (true) {
        let flag = true;
        for (let i = 0; i < num_of_participants; i++) {
            if ((avatars_index_chosen[i] == hisAvatarIndex)) {//first_bot选头像
                flag = false;
                break;
            }
        }
        if (flag)
            break;
        hisAvatarIndex++;
    }
    //上面选好之后，进入到了等待环节
    let status = document.querySelector(".identity_wrap");
    let index = 0;
    let firstbotavatar = 1;//现在默认是0，0；我应该改成设定好的1，6！！！！！！！
    let firstbotname = 6;
    for (index = 0; index < num_of_participants; index++) {
        if (index == firstWaitingIndex) {//第一个进来的bot，默认选好头像名字
            /*status.innerHTML += `
                <div class="profile_waiting" id="profile_${index}">
                    <img src="/static/avatars/avatar_${hisAvatarIndex}.png" >
                    ${pseudonyms[hisNameIndex]}
                    <div id="status_${index}" class="status">${tickmark_string}</span>
                </div>
            `;*/
            status.innerHTML += `
                <div class="profile_waiting" id="profile_${index}">
                    <img src="/static/avatars/avatar_${firstbotavatar}.png" >
                    ${pseudonyms[firstbotname]}
                    <div id="status_${index}" class="status">${tickmark_string}</span>
                </div>
            `;

        } else if (index == human_index) {//等受试者加入实验的界面头像
            status.innerHTML += `
                <div class="profile_waiting" id="profile_${index}">
                    <img src="/static/avatars/avatar_${avatars_index_chosen[index]}.png" >
                    ${pseudonyms_chosen[human_index]} <b>(You)</b>
                    <div id="status_${index}" class="status">${tickmark_string}</span>
                </div>
            `;
        } else {//第三个默认是一个空头像
            status.innerHTML += `
                <div class="profile_waiting" id="profile_${index}">
                    <img src="/static/avatars/avatar_default.png" >
                    <div id="status_${index}" class="status">${loader_string}</span>
                </div>
            `;
        }
    }

    setTimeout(() => {//上面三个展示完了之后，开启一段等待
        /*document.getElementById(`profile_${firstWaitingIndex}`).innerHTML = `
            <img src="/static/avatars/avatar_default.png" >
            <div id="status_${index}" class="status">${loader_string}</span>
        `;//等一段时间结束后进入函数体，将第一个bot设置成空白头像*/
        const lastBotProfile = document.getElementById(`profile_${lastWaitingIndex}`);
        lastBotProfile.innerHTML = `
        <img src="/static/avatars/avatar_${hisAvatarIndex}.png" >
        ${pseudonyms[hisNameIndex]}
        <div id="status_${firstWaitingIndex}" class="status">${tickmark_string}</span>
    `;

        let index_array = generate_bot_array(num_of_participants, human_index);
        start_bot_timers(index_array, 'wait');//在受试者配对的时间！！
    }, 0);//原来是5000,现在设定等待一分钟完成匹配60000
}




///////////////////////

function getAvatarIndexByLabels(data, index1) {
    const labelToAvatarIndexMap = {
        'Liberal': 1,
        'Somewhat liberal': 2,
        'Somewhat conservative': 3,
        'Conservative': 4
    };

    // 遍历指定人的所有labelText  
    for (let labelId of data.labels[index1]) {

        const labelText = labels[labelId]; // 假设labels是一个可以通过labelId获取标签文本的对象
        // 检查labelText是否在映射中  
        const index1 = labelToAvatarIndexMap[labelText];

        if (index1) {
            // 如果找到匹配项，返回对应的索引值  
            return index1;
        }
    }

    // 如果所有标签都不满足，返回0  
    return 0;
}
//!!!////////////////////////注意，要对一组text检测！不是某一个text!!!!
/*function getAvatarIndexByLabel(labelText) {  
    const labelToAvatarIndexMap = {  
        'Liberal': 1,
        'Somewhat liberal': 2,
        'Conservative': 3,
        'Somewhat conservative': 4
    };  
      
    // 检查labelText是否在映射中  
    return labelToAvatarIndexMap[labelText] || 0; // 如果不存在，返回0  
}*/

var newAvatarIndextmp = [];//一个保存临时的头像索引全局变量的元素，用在phase4的拖轴上
var newFirstBotAvatar;//分别记录，用在phase4的两个bot上
var newHumanAvatar;
var newLastBotAvatar;

// 标签颜色映射，使用RGB值  
const labelColorMap = {
    'Liberal': 'rgb(0, 58, 179)', // 深蓝色  
    'Somewhat liberal': 'rgb(114, 146, 213)', // 浅蓝色  
    'Somewhat conservative': 'rgb(232, 127, 127)', // 浅红色  
    'Conservative': 'rgb(210, 0, 0)', // 深红色  
    'Competent': 'rgb(125, 186, 76, 255)', // 绿色  
    'Kind': 'rgb(125, 186, 76, 255)', // 绿色(125, 186, 76, 255)其中255代表透明度 是完全不透明
    'Mature': 'rgb(125, 186, 76, 255)' // 绿色  
    // 如果还有其他的标签需要特殊颜色，可以在这里添加  
};

// 根据标签文本获取颜色，如果不在映射中则返回黑色  
function getLabelColor(labelText) {
    const color = labelColorMap[labelText];
    return color || 'rgb(0, 0, 0)'; // 如果color存在，则返回它；否则返回黑色  
}
/////////////////////////////////////下面两个是给名字加颜色的20240509///////////////////////////
const labelColorMap_name = {
    'Liberal': 'rgb(0, 58, 179)', // 深蓝色  
    'Somewhat liberal': 'rgb(114, 146, 213)', // 浅蓝色  
    'Somewhat conservative': 'rgb(232, 127, 127)', // 浅红色  
    'Conservative': 'rgb(210, 0, 0)', // 深红色  
};

// 根据标签文本获取颜色，如果不在映射中则返回黑色  
function getLabelColor_name(labelText) {
    const color = labelColorMap_name[labelText];

    return color || 'rgb(0, 0, 0)'; // 如果color存在，则返回它；否则返回黑色  
}
const labelColorMap_number = {
    0: 'rgb(0, 58, 179)', // 深蓝色，对应'Liberal'    
    1: 'rgb(114, 146, 213)', // 浅蓝色，对应'Somewhat liberal'    
    2: 'rgb(232, 127, 127)', // 浅红色，对应'Somewhat conservative'    
    3: 'rgb(210, 0, 0)', // 深红色，对应'Conservative'    
};
function getLabelColor_number(labelNumber) {
    // 确保labelNumber是有效的（在这个例子中，我们只检查它是否存在于映射中）  
    const color = labelColorMap_number[labelNumber];

    // 如果color存在，则返回它；否则返回黑色  
    return color || 'rgb(0, 0, 0)';
}
//////////////////////////////////////

function add_identity_status() {
    let status = document.querySelector(".identity_wrap");
    //通过类选择器 .identity_wrap 获取到页面上的某个元素，这个元素将作为身份状态信息的容器。
    for (let index = 0; index < num_of_participants; index++) {
        let name = pseudonyms_chosen[index];

        // add '(You)' for user's displayed name///////////////////////20240509不需要这个设定！
        /*if (index == human_index) {
            if (phase == 4) {
                continue;
            } else if (phase == 2 || phase == 0) {
                name += ' <b>(You)</b>';
            } else
                name += '<br><b>(You)</b>';
        }*/

        /**pseudonyms_chosen 数组存储了所有参与者的化名，human_index 变量可能表示当前用户（人类用户）在参与者列表中的索引。
         * 如果当前遍历到的参与者的索引等于 human_index，则表示这是当前用户的身份，函数会根据 phase 的值来决定如何显示 (You) 标识。 */

        if (phase == 1) {//phase1答题的时候的头像,图像现在20240414都换成了png格式!!//20240509不展示头像
            status.innerHTML += `
                
                <div id="profile_${index}" class="profile_answering">
                    <div class="identity_part">
                        <!-- <img src="/static/avatars/avatar_${avatars_index_chosen[index]}.png" >  -->
                        <b style="font-weight: bold; font-size: larger;">${name}</b>
                    </div>
                    <div class="labels_part"></div>
                    <div class="status" id="status_${index}"></div>
                </div>
            `;
        }

        else if (phase == 2) {//phase2贴标签时的头像,png格式头像！！//20240509不展示头像

            status.innerHTML += `
                <div id="profile_${index}" class="profile_with_labels profile_labeling">
                    <div class="identity_part_phase_2">
                        <!--  <div class="image_part_phase_2">
                            <img src="/static/avatars/avatar_${avatars_index_chosen[index]}.png" >
                        </div>  -->
                        <b style="font-weight: bold; font-size: larger;" id="name${index}">${name}</b>
                        <div class="labels_part" id="list_${index}">  
                        <ul class="labels_list"></ul>  
                        </div>
                    </div>
                <div class="labels_pool" id="pool_${index}">
                    </div>
                </div>
            `;
        }

        else if (phase == 3) {//进入phaseII后的显示效果

            //avatars_index_chosen[index]是原来的所选的头像，现在应该根据原来所选的头像的索引来索引到该头像应该对应什么样的颜色背景。
            //getAvatarIndexByLabels(data, index)获取的本质是某个空白头像应该对应的颜色背景的索引
            //avatars_index_chosen[index] = getAvatarIndexByLabels(data, index);//换成对label的list的索引，直接索引颜色。
            /*avatars_index_chosen[0] = 1;//换成对label的list的索引
            avatars_index_chosen[1] = 2;//换成对label的list的索引
            avatars_index_chosen[2] = 3;//换成对label的list的索引*/
            //console.log('现在的avatars_index_chosen[index] 的内容是:', avatars_index_chosen[index]);
            if (index == 0) { newFirstBotAvatar = getAvatarIndexByLabels(data, index); }
            if (index == 1) { newHumanAvatar = getAvatarIndexByLabels(data, index); }
            if (index == 2) { newLastBotAvatar = getAvatarIndexByLabels(data, index); }
            newAvatarIndextmp[index] = getAvatarIndexByLabels(data, index);

            //通过document.querySelector("#identity_wrap_phase_II").innerHTML += ...，在ID为identity_wrap_phase_II的元素内部追加一个新的<div>元素。
            //这个新的<div>元素包含了个人信息的展示和标签列表。它的ID是动态生成的，格式为profile_${index}，其中index是某个变量（可能是循环中的索引或其他标识）。
            //内部包含两个部分：
            //identity_part：显示头像和名字。
            //labels_part：包含一个空的<ul>元素（用于存放标签）和一个<div>元素（可能用于显示状态）。在profile_with_labels基础上追加profile_labeling效果
            //20240509,不显示头像，名字变成对应的颜色//////////////////////////////////////////////////////////////////////////////////////////////

            for (let labelId of data.labels[index]) {  //labelId是一个数值
                /**for...of 循环来遍历 data.labels[index] 数组的示例。
                 * 这里假设 data.labels 是一个二维数组[[0, 8, 6], [0, 4, 8], [2, 9]]，其中 data.labels[index] 表示第 index 个人的所有标签。
                 * labelId 则是在每次迭代中得到的当前标签的值。 */
                const labelText = labels[labelId]; // 假设labels是一个可以通过labelId获取标签文本的对象
                //console.log('labelText 的内容是:', labelText);
                color_name[index] = getLabelColor_name(labelText);
                if (newAvatarIndextmp[index] != 0) { break; }
            }// 获取标签文本对应的颜色 ///////////////////////////这里和下面的括号是新加的
            document.querySelector("#identity_wrap_phase_II").innerHTML += `  
        <div id="profile_${index}" class="profile_with_labels profile_labeling">  
            <div class="profile_content">  
                <div class="identity_part">  
                    <!-- <img src="/static/avatars/label_${avatars_index_chosen[index]}_${newAvatarIndextmp[index]}.png">  -->
                    <h2 class="name" style="font-weight: bold; font-size: larger; color: ${color_name[index]};">${name}</h2>  
                    <div class="status" id="status_${index}"></div> 
                </div>  
                <div class="labels_part" id="list_${index}">  
                    <ul class="labels_list"></ul>  
                     
                </div>  
            </div>  
        </div>  
    `;  /////20240509这个括号如果在这，每个label都创建一个新卡片！不合理！
            //使用document.querySelector选择新添加的<div>中的<ul>元素。这个<ul>元素的ID是动态生成的，格式为list_${index}。,class="img"可以让上边是一个类
            let list = document.querySelector(`#list_${index} > ul`);

            for (let labelId of data.labels[index]) {  //labelId是一个数值
                /**for...of 循环来遍历 data.labels[index] 数组的示例。
                 * 这里假设 data.labels 是一个二维数组[[0, 8, 6], [0, 4, 8], [2, 9]]，其中 data.labels[index] 表示第 index 个人的所有标签。
                 * labelId 则是在每次迭代中得到的当前标签的值。 */
                const labelText = labels[labelId]; // 假设labels是一个可以通过labelId获取标签文本的对象
                const color = getLabelColor(labelText); // 获取标签文本对应的颜色  
                list.innerHTML += `<li style="background-color: ${color}; color: white;font-weight: bold;text-align: center;">${labelText}</li>`; // 设置颜色并添加<li>元素 

                // 创建一个新的 <li> 元素/////////////////////////////////////////////////////////////////////////////
                const newLi = document.createElement('li');
                newLi.textContent = 'Somewhat conservative';
                // 将新创建的 <li> 元素添加到页面中的 <ul> 元素下面
                const ul = document.querySelector('ul');
                ul.appendChild(newLi);
                newLi.classList.add('custom-li-style');
                //这里实现的效果是，我根据文本最长的指定'Somewhat conservative'来设定一个新的li元素，但这个li元素不能展示在页面里/////////////
                //const labelText1 = 'Somewhat conservative';
                //<ul id="maxli"> `<li style="background-color: ${color}; color: white;font-weight: bold;text-align: center;">${labelText1}</li>`</ul>;
                // 找到所有的<li>元素
                const lis = document.querySelectorAll('li');

                // 初始化最大文本宽度
                let maxWidth = 0;
                let maxHeight = 0;

                // 遍历所有<li>元素，找到最大文本宽度和高度
                lis.forEach(li => {
                    const liTextWidth = li.offsetWidth;
                    const liTextHeight = li.offsetHeight;
                    if (liTextWidth > maxWidth) {
                        maxWidth = liTextWidth + 2;
                    }
                    if (liTextHeight > maxHeight) {
                        maxHeight = liTextHeight + 0.2;
                    }
                });

                //maxWidth=li.offsetWidth+4;
                //maxHeight=li.offsetHeight+0.5;


                // 从父元素中移除子元素
                document.querySelector('ul').removeChild(newLi);

                //console.log("当前最大的文本长度为:", maxWidth);
                //console.log("当前最大的文本高度为:", maxHeight);
                // 将所有<li>元素的宽度设置为最大文本宽度和高度还要高一点
                lis.forEach(li => {
                    li.style.width = maxWidth + 'px';
                    li.style.height = maxHeight + 'px';
                })

            }


        }
        else if (phase == 31) {//进入phaseII后的抽签部分内部的显示效果,和phase3尽量保持一致

            if (index == 0) { newFirstBotAvatar = getAvatarIndexByLabels(data, index); }
            if (index == 1) { newHumanAvatar = getAvatarIndexByLabels(data, index); }
            if (index == 2) { newLastBotAvatar = getAvatarIndexByLabels(data, index); }
            newAvatarIndextmp[index] = getAvatarIndexByLabels(data, index);
            document.querySelector("#identity_wrap_choose").innerHTML += `  
        <div id="profile_${index}" class="profile_with_labels profile_labeling">  
            <div class="profile_content">  
                <div class="identity_part">  
                    <img src="/static/avatars/label_${avatars_index_chosen[index]}_${newAvatarIndextmp[index]}.png">  
                    <h2 class="name">${name}</h2>  
                </div>  
                <div class="labels_part" id="list_${index}">  
                    <ul class="labels_list"></ul>  

                </div>  
            </div>  
        </div>  
    `;
            let list = document.querySelector(`#list_${index} > ul`);

            for (let labelId of data.labels[index]) {
                const labelText = labels[labelId];
                const color = getLabelColor(labelText);
                list.innerHTML += `<li style="background-color: ${color}; color: white;font-weight: bold;text-align: center;width:90%;height:20%">${labelText}</li>`; // 设置颜色并添加<li>元素 

            }


        }
    }

}

/**根据 phase 的不同值，函数构建并添加不同的 HTML 结构到 status 元素中。

当 phase == 1 时，函数为每个参与者添加一个带有 profile_answering 类的 div 元素，该元素包含头像、化名以及其他几个空的 div 用于后续填充标签和状态信息。

当 phase == 2 时，函数为每个参与者添加一个带有 profile_labeling 类的 div 元素，该元素包含头像、化名以及一个空的 div（带有 labels_pool 类）用于后续填充标签池。

当 phase == 3 时，函数向另一个元素（通过 id 选择器 #identity_wrap_phase_II 获取）添加带有 profile_with_labels 和 profile_labeling 类的 div 元素，该元素的结构与 phase == 2 时类似，但具体布局和样式可能有所不同。 */

// 假设我们有一个映射，将标签文本映射到颜色类名  //////////////////////////////////
/*const labelStyleMap = {  
    'Liberal': 'label-Liberal', // 假设这是红色标签的类名  
    'Somewhat liberal': 'label-Somewhat-liberal',   // 假设这是橙色标签的类名  
    'Conservative': 'label-Conservative', // 假设这是红色标签的类名  
    'Somewhat conservative': 'label-Somewhat-conservative',   // 假设这是橙色标签的类名
    'Kind': 'label-Kind', // 假设这是红色标签的类名  
    'Indifferent': 'label-Indifferent',   // 假设这是橙色标签的类名
    'Mature': 'label-Mature', // 假设这是红色标签的类名  
    'Naive': 'label-Naive',   // 假设这是橙色标签的类名
    'Competent': 'label-Competent', // 假设这是红色标签的类名  
    'Incompetent': 'label-Incompetent',   // 假设这是橙色标签的类名
    // ... 其他标签和颜色映射  //////////////////////////////////////
};  */
function display_labels_chosen() {//展示标签,没有人调用？？
    let labels_lists = document.querySelectorAll(".labels_list");
    labels_lists.forEach((labels_list) => {
        labels_list.innerHTML = ``;
    });
    let index = 0;
    labels_lists.forEach((labels_list) => {
        for (let label of data.labels[index]) {
            // 检查标签是否在映射中，并获取相应的类名//////////////////  
            //let styleClass = labelStyleMap[label] || ''; 
            ////////////////////////////////////////////
            labels_list.innerHTML += `
                <li class="label_chosen" id="label_${labels.indexOf(label)}" draggable="false">
                    ${label}
                </li>`;
        }
        index++;
    });
}

function insertLabelId(labels, participant_id, label_id) {  //保证labei数组中存放的顺序和labelID的顺序一致，不是单纯在数组末尾加
    // 找到label_id应该插入的位置  
    let insertIndex = 0;
    while (insertIndex < labels[participant_id].length && labels[participant_id][insertIndex] < label_id) {
        insertIndex++;
    }

    // 使用splice在指定位置插入新元素  
    labels[participant_id].splice(insertIndex, 0, label_id);
}

function removeLiByLabelId(ul,labelId) {
    // 获取包含li元素的ul元素  
    
    if (ul) {
        // 使用querySelector查找具有特定data-label-id的li元素  
        let liToRemove = ul.querySelector(`li[data-label-id="${labelId}"]`);
        if (liToRemove) {
            console.log('label remove', liToRemove);
            // 如果找到匹配的li元素，则将其从ul中移除  
            ul.removeChild(liToRemove);
        }
    } else {
        console.log('label remove: not found');
    }
}
/**
将特定的标签列表（data.labels）中的标签显示在页面中所有类名为 labels_list 的元素内。下面是对该函数的详细解释：

获取所有标签列表元素：
使用 document.querySelectorAll(".labels_list") 获取页面中所有类名为 labels_list 的元素，并将它们存储在 labels_lists 变量中。

清空现有内容：
遍历 labels_lists 中的每个元素（labels_list），并将它们的 innerHTML 设置为空字符串，从而清空这些元素现有的内容。

初始化索引：
定义一个变量 index 并初始化为 0，用于在后续循环中跟踪 data.labels 数组中的当前位置。

显示选择的标签：
再次遍历 labels_lists 中的每个元素（labels_list）。对于每个 labels_list，执行以下操作：

遍历 data.labels[index] 数组中的每个标签（label）。
为每个标签创建一个新的 li 元素，并设置其类名为 label_chosen。id 属性设置为 label_ 加上该标签在 labels 数组中的索引（使用 labels.indexOf(label) 获取）。注意：这里似乎有一个小错误，因为 labels 变量在函数中没有定义，可能应该使用 data.labels[index] 或其他相关数组。
将标签文本（label）作为 li 元素的内容。
将创建的 li 元素添加到 labels_list 的 innerHTML 中，从而在页面上显示该标签。
增加 index 的值，以便在下一次迭代中处理 data.labels 数组中的下一个元素。
函数结束后，页面上的每个 labels_list 元素都应该包含来自 data.labels 数组的相应标签列表。 */


function check_handler(event) { //用户可以为参与者（participants）选择或取消选择标签（labels）
    let button = document.querySelector("button");
    let splits = event.target.id.split('_');
    let label_id = parseInt(splits[0]), participant_id = parseInt(splits[1]);
    /**函数首先获取页面上的第一个 button 元素，然后它从触发此事件的目标元素的 id 属性中提取信息。
     * id 属性被假定为包含两个由下划线 _ 分隔的部分，其中第一部分是 label_id，
     * 第二部分是 participant_id。这两个ID分别被转换为整数，以便于后续操作。
     * 

 */
    let ul = document.querySelector(`#list_${participant_id} > ul`);

    // if the action is unclicking
    if (!event.target.checked) {
        data.labels[participant_id].splice(data.labels[participant_id].indexOf(label_id), 1);//实际传输数据库的label数组删除
        if (!label_id_list[participant_id]) {  
            label_id_list[participant_id] = []; // 初始化数组  
        }  
        label_id_list[participant_id].splice(data.labels[participant_id].indexOf(label_id), 1);//暂存选中顺序的label数组删除
        //////////////////////////////////////////////////
if(label_id < 4){//仅对前四个标签进行删除时变成黑色
        label_id_for_color = 5;
        //const bElement = document.querySelector('name');  
        color_name_phase2_label[participant_id] = getLabelColor_number(label_id_for_color);
        // 从color_name_phase2_label对象中获取颜色  
        const color = color_name_phase2_label[participant_id];
        var bs1 = document.querySelectorAll('.identity_part_phase_2 b');
        if (bs1.length > 0) {
            bs1[participant_id].style.color = color;
        }}
        
        removeLiByLabelId(ul,label_id);
        
        //////////////////////////////////////////////
        if (data.labels[participant_id].length == 0)
            button.disabled = true;
    }
    /**如果事件的目标元素（可能是一个复选框）未被选中（!event.target.checked），
     * 则函数从 data.labels 数组中移除对应的 label_id。如果移除后 participant_id 对应的标签数组为空，则禁用 button 元素。 */

    // if the action is clicking
    else {
        if (data.labels[participant_id].length == 3)
            event.target.checked = false;
        else {
            //data.labels[participant_id].push(label_id);//push只是向末尾添加数值，不能保证顺序
            insertLabelId(data.labels, participant_id, label_id);
            if (!label_id_list[participant_id]) {  
                label_id_list[participant_id] = []; // 初始化数组  
            }  
            label_id_list[participant_id].push(label_id);//暂存按选中顺序的label_id;
            /////////////////////////////////////////////////////////
            if (label_id < 4) {// 获取<b>标签元素  
                color_name_phase2_label[participant_id] = getLabelColor_number(label_id);
                // 从color_name_phase2_label对象中获取颜色  
                const color = color_name_phase2_label[participant_id];
                // 假设你想要更改第一个b标签的颜色  
                var bs = document.querySelectorAll('.identity_part_phase_2 b');
                bs[participant_id].style.color = color;   
            }
            //document.getElementById('name${participant_id}').style.color = color; // 替换为你想要的颜色
            let list = document.querySelector(`#list_${participant_id} > ul`);
            const labelText = labels[label_id]; // 假设labels是一个可以通过labelId获取标签文本的对象
            const color = getLabelColor(labelText); // 获取标签文本对应的颜色
            //if (data.labels[participant_id].length == 1)  
            list.innerHTML += `<li style="background-color: ${color}; color: white;font-weight: bold;text-align: center;" data-label-id=${label_id}>${labelText}</li>`;
            /*if (data.labels[participant_id].length == 2)  
                {removeLiByLabelId(ul,label_id_list[0]);
            const labelText0 = labels[label_id_list[0]]; // 假设labels是一个可以通过labelId获取标签文本的对象
            const color0 = getLabelColor(labelText0); // 获取标签文本对应的颜色
            list.innerHTML += `<li style="background-color: ${color0}; color: white;font-weight: bold;text-align: center;" data-label-id=${label_id_list[0]}>${labelText0}</li>`;
            list.innerHTML += `<li style="background-color: ${color}; color: white;font-weight: bold;text-align: center;" data-label-id=${label_id}>${labelText}</li>`;}
            if (data.labels[participant_id].length == 3)  
                {removeLiByLabelId(ul,label_id_list[0]);
                removeLiByLabelId(ul,label_id_list[1]);
                const labelText0 = labels[label_id_list[0]]; // 假设labels是一个可以通过labelId获取标签文本的对象
            const color0 = getLabelColor(labelText0); // 获取标签文本对应的颜色
            list.innerHTML += `<li style="background-color: ${color0}; color: white;font-weight: bold;text-align: center;" data-label-id=${label_id_list[0]}>${labelText0}</li>`;
            const labelText1 = labels[label_id_list[1]]; // 假设labels是一个可以通过labelId获取标签文本的对象
            const color1 = getLabelColor(labelText1); // 获取标签文本对应的颜色
            list.innerHTML += `<li style="background-color: ${color1}; color: white;font-weight: bold;text-align: center;" data-label-id=${label_id_list[1]}>${labelText1}</li>`;
            list.innerHTML += `<li style="background-color: ${color}; color: white;font-weight: bold;text-align: center;" data-label-id=${label_id}>${labelText}</li>`;}
           */ /////////////////////////////////////////////////////////////////////////////////////
            let flag = true;
            for (let index = 0; index < num_of_participants; index++) {
                if (data.labels[index].length == 0) {
                    flag = false;
                    break;
                }
            }
            if (flag)
                button.disabled = false;
        }
    }
}
/**如果事件的目标元素被选中（即用户点击了复选框），则函数首先检查 participant_id 对应的标签数组长度。
 * 如果长度已经达到3（可能表示每个参与者最多只能选择3个标签），则取消选中该复选框。

如果长度小于3，函数将 label_id 添加到 participant_id 
flag 来检查是否所有参与者都至少有一个标签。这通过遍历所有参与者的标签数组来完成，如果发现任何参与者的标签数组为空，则将 flag 设置为 false 并中断循环。

最后，如果 flag 为 true（即所有参与者都有标签），则启用 button 元素。 */


function phase_4_click_handler() {//这里还是没办法换成4个，暂时用9代表没选。
    let detectionWraps = document.querySelectorAll(".detection_wrap");
    let allQuestionsAnswered = true;

    // 遍历每个 detection_wrap
    detectionWraps.forEach(function (detectionWrap) {
        let questions = detectionWrap.querySelectorAll("input[type='radio']"); // 获取当前 detection_wrap 下所有问题的 input 元素

        let answered = false; // 当前 detection_wrap 是否所有问题都被回答

        // 遍历每个问题
        questions.forEach(function (question) {
            if (question.checked) { // 如果某个问题被回答
                answered = true; // 设置标记为已回答
                return; // 结束当前问题的循环
            }
        });

        // 如果当前 detection_wrap 内的所有问题都没有被回答
        if (!answered) {
            allQuestionsAnswered = false; // 设置标记为有问题未回答
        }
    });

    // 如果所有 detection_wrap 内的所有问题都被回答
    if (allQuestionsAnswered) {
        document.querySelector("button").disabled = false; // 启用按钮
    } else {
        document.querySelector("button").disabled = true; // 禁用按钮
    }


}



let attention_passed = false;

function attention_check_click_handler() {
    let temp_answers = [-1, -1, -1];
    const names = ['question_1', 'question_2', 'question_3'];
    let index_of_question = 0
    for (let name of names) {
        inputs = document.querySelectorAll(`input[name="${name}"]`);
        index_of_choice = 0;
        for (let input of inputs) {
            if (input.checked) {
                temp_answers[index_of_question] = index_of_choice;
            }
            index_of_choice += 1;
        }
        index_of_question += 1;
    }
    if (temp_answers[0] != -1 && temp_answers[1] != -1 && temp_answers[2] != -1) {
        console.log(temp_answers);
        document.querySelector("button").disabled = false;
    }
    if (temp_answers[0] == 3 && temp_answers[1] == 1 && temp_answers[2] == 3) {
        attention_passed = true;//只有三个全部回答正确的才会记为true
    }
    data.attention_passed = attention_passed;//将取值传给data
}



let pseudonym_chosen = -1;
let avatar_chosen = -1;

function click_pseudonym_or_avatar_handler(event) {//选受试者的头像和化名的函数




    let name_displayed = document.querySelector(".identity_chosen > span");
    let avatar_displayed = document.querySelector(".identity_chosen > img");
    ///////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.querySelectorAll(".pseudonym_choice").forEach((choice) => {
        if (choice.contains(event.target)) {
            let id = parseInt(choice.id.replace("pseudonym_", ""));
            if (pseudonym_chosen == -1) {
                pseudonym_chosen = id;
                choice.style['background-color'] = 'grey';
                name_displayed.textContent = pseudonyms[pseudonym_chosen];
                name_displayed.style.opacity = 1;
            } else if (id == pseudonym_chosen) {
                pseudonym_chosen = -1;
                choice.style.removeProperty("background-color");
                name_displayed.style.opacity = 0;
            } else {
                document.getElementById(`pseudonym_${pseudonym_chosen}`).style.removeProperty("background-color");
                choice.style['background-color'] = 'grey';
                pseudonym_chosen = id;
                name_displayed.textContent = pseudonyms[pseudonym_chosen];
            }
        }
    });

    document.querySelectorAll(".avatar_choice").forEach((choice) => {
        if (choice.contains(event.target)) {
            let id = parseInt(choice.id.replace("avatar_", ""));
            // no choice is clicked yet
            if (avatar_chosen == -1) {
                avatar_chosen = id;
                choice.style['outline'] = '3px solid black';
                avatar_displayed.src = `/static/avatars/avatar_${id}.png`;
            } else if (id == avatar_chosen) {
                avatar_chosen = -1;
                choice.style.removeProperty("outline");
                avatar_displayed.src = `/static/avatars/avatar_default.png`;
            } else {
                document.getElementById(`avatar_${avatar_chosen}`).style.removeProperty("outline");
                choice.style['outline'] = '3px solid black';
                avatar_chosen = id;
                avatar_displayed.src = `/static/avatars/avatar_${id}.png`;
            }
        }
    });

    let button = document.querySelector(".button_checked");
    if (avatar_chosen != -1 && pseudonym_chosen != -1) {
        let cb_checked = document.querySelector("input[type=checkbox]").checked;
        if (cb_checked)
            button.disabled = false;
        else
            button.disabled = true;
    } else {
        button.disabled = true;
    }
}



function adjust_button_size(button) {
    let length = parseFloat(button.textContent.length);
    button.style.width = `${18 * length * 0.5 + 20}px`;
}//调整按键的大小



function get_phase_length(phase) {
    if (typeof (phase_length[phase]) == "number")
        return phase_length[phase];
    else {
        let sum = 0;
        if (userData.quiz_type == "pilot_1" || userData.quiz_type == 'condition_2') {
            sum = phase_length[phase][0] + phase_length[phase][1]
        } else {
            for (let len of phase_length[phase])
                sum += len;
        }
        return sum;
    }
}



function fit_text(text) {
    var width = text.offsetWidth;
    var textWidth = text.scrollWidth;
    var fontSize = width / textWidth * parseFloat(window.getComputedStyle(text).fontSize);
    text.style.fontSize = fontSize + "px";
}