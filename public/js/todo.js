
//用于存放任务的数组
var taskAry = [];
//获取任务列表容器
var taskBox = $('#to-list');
// var taskBox = document.getElementById('to-list');
//调用函数 获取任务列表
fAjax();
//获取任务输入框
$('#task').on('keyup', function (event) {
    // console.log(event.keyCode); 
    //判断用户是否敲击的是回车键
    if (event.keyCode == 13) {
        //判断用户是否在文本框中输入了用户名称
        var taskName = $(this).val();
        //如果用户没有输入内容
        if (taskName.trim().length == 0) {
            alert('请输入任务名称')
            //阻止代码向下执行 
            return;
        }
        //向服务器端发送请求 添加任务
        $.ajax({
            type: 'post',
            url: '/todo/addtask',
            contentType: 'application/json',
            data: JSON.stringify({
                title: taskName,
            }),
            success: function (response) {
                // console.log(response);
                if (response === '添加成功') {
                    //调用函数发送请求获取任务列表
                    fAjax();
                    $('#task').val('');
                } else {
                    // console.log(response);
                    alert(response);
                }
            },
        });
    }
});

//刷新任务列表
function fAjax() {
    //发送ajax请求获取任务列表
    $.ajax({
        type: 'get',
        url: '/task',
        success: function (response) {
            // console.log(response);
            //将已存在的任务存储在taskAry变量中
            taskAry = response;
            //将数据和html拼接好
            var html = template('tasktpl', { tasks: taskAry });
            //将任务列表显示在页面中
            // taskBox.innerHTML = html;
            taskBox.html(html);
            calcCount();
        },
    });
};
//刷新用户未完成任务的数量
function calcCount() {
    $.ajax({
        type: 'get',
        url: '/todo/count',
        success: function (response) {
            // console.log(response.total);
            var count = response.total;
            //将未完成任务数量显示在页面中
            $('#item').text(count);
        },
    });
};

//任务分类后刷新页面
function taskSort(data) {
    $.ajax({
        type: 'get',
        url: '/tasksort',
        data: {
            completed: data,
        },
        success: function (response) {
            // console.log(response);
            //将未完成的任务存储在taskAry变量中
            taskAry = response;
            //将数据和html拼接好
            var html = template('tasktpl', { tasks: taskAry });
            //将任务列表显示在页面中
            // taskBox.innerHTML = html;
            taskBox.html(html);
            calcCount();
        },
    });
};


//判断刷新哪个页面
function page() {
    if ($('#all').attr('class') === 'selected') {
        fAjax();
    }
    if ($('#active').attr('class') === 'selected') {
        taskSort(0);
    }
    if ($('#completed').attr('class') === 'selected') {
        taskSort(1);
    }
};

//当用户点击删除按钮时触发ul身上的点击事件
$('#to-list').on('click', '.destory', function () {
    //获取到要删除任务的id
    var id = $(this).attr('data-id');
    // console.log(id);
    //向服务器端发送请求删除任务
    $.ajax({
        type: 'get',
        url: '/todo/deleteTask',
        data: {
            _id: id,
        },
        success: function (response) {
            if (response === '删除成功') {
                //判断用户更新哪个页面
                page();
            } else {
                console.log(response);
            }
        },
    });

});

//当鼠标悬停li时触发ul身上的鼠标事件
$('#to-list').on('mouseover', '.view', function () {
    $(this).children('button.destory').css("display", "block");
});
//当鼠标离开li时触发ul身上的鼠标离开事件
$('#to-list').on('mouseout', '.view', function () {
    $(this).children('button.destory').css("display", "none");
});

//事件委托 当用户改变复选框状态时触发
$('#to-list').on('change', '.toggle', function () {
    //代表复选框是否选中 true代表选中 false代表未选中
    const status = $(this).is(':checked');
    // console.log(status);
    //当前点击任务的id
    const id = $(this).siblings('button').attr('data-id');
    // console.log(id);
    $.ajax({
        type: 'post',
        url: '/todo/modifyTask',
        contentType: 'application/json',
        data: JSON.stringify({
            _id: id,
            completed: status,
        }),
        success: function (response) {
            if (response == '任务更新成功') {
                //判断更新哪个页面
                page();
            }
            else {
                console.log(response);
            }
        },
    });

});

//给label绑定双击事件
$('#to-list').on('dblclick', 'label', function () {
    // console.log("1111");
    //把当前任务框隐藏
    $(this).parent().css("display", "none");
    //显示编辑框
    $(this).parent().siblings('input').css("display", "block");
    //把label里的内容显示在编辑框里
    $(this).parent().siblings('input').val($(this).text());
    //编辑框 自动获取焦点
    $(this).parent().siblings('input').focus();

});

//当编辑框离开焦点的时候触发
$('#to-list').on('blur', '.edit', function () {
    //获取最新任务的名称
    var newTaskName = $(this).val();
    //获取任务的id
    var id = $(this).siblings().find('button').attr('data-id');
    // console.log(id);
    // console.log(newTaskName);

    $.ajax({
        type: 'post',
        url: '/todo/modifyTask',
        contentType: 'application/json',
        data: JSON.stringify({
            _id: id,
            title: newTaskName,
        }),
        success: function (response) {
            if (response == '任务更新成功') {
                //判断更新哪个页面
                page();
            }
            else {
                console.log(response);
            }
        },
    });
});

//当点击All按钮时触发 页面显示所有任务
$('#all').on('click', function () {
    $(this).addClass('selected');
    $('#active').removeClass('selected');
    $('#completed').removeClass('selected');
    fAjax();

});
//当点击active 按钮时触发
$('#active').on('click', function () {
    $(this).addClass('selected');
    $('#all').removeClass('selected');
    $('#completed').removeClass('selected');
    //调用函数任务分类后刷新页面
    // console.log($('#active').attr('class') === 'selected' ? true : false);
    taskSort(0);
});

//当点击completed按钮时触发
$('#completed').on('click', function () {
    $(this).addClass('selected');
    $('#active').removeClass('selected');
    $('#all').removeClass('selected');
    //调用函数任务分类后刷新页面
    taskSort(1);
});

//当点击clear按钮时触发
$('#clear').on('click', function () {
    $.ajax({
        type: 'get',
        url: '/todo/deleteAlltask',
        success: function (response) {
            // console.log(response);
            alert(response);
            var taskAry = [];
            var html = template('tasktpl', { tasks: taskAry });
            //将任务列表显示在页面中
            // taskBox.innerHTML = html;
            taskBox.html(html);
            calcCount();
        }
    })

});






