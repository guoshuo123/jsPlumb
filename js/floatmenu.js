(function(window, document) {
    var styles = '.fe-floatmenu{position: fixed;top:10px;padding:5px;background: #fff;border:1px solid #919191;z-index:100000000;width:150px;}.fe-floatmenu>ul{display: block;}.fe-floatmenu.show{width:200px;padding:2px;}.fe-floatmenu.show>ul{display: block;}.fe-floatmenu.show>a{text-align:center;}.fe-floatmenu a{color:#434343;display: block;height:18px;line-height:18px;}.fe-floatmenu li{border:1px solid #fff;padding:2px 6px;margin-bottom:-1px;background: #f0f0f0;}.fe-floatmenu .close{display:block;position:absolute;right:2px;top:2px;color:#00a1d7;}.fe-floatmenu a:hover{color:#00a1d7;}.fe-floatmenu>ul>li>ul{display: block;padding-left:10px;}.fe-floatmenu>ul>li>ul>li>ul{display: block;padding-left:10px;}.fe-floatmenu>ul>li>ul>li>ul>li>ul{display: none;padding-left:10px;}.fe-floatmenu .hassubmenu>a{position: relative;padding-bottom:3px;}.fe-floatmenu .hassubmenu>a:after{content:"+";position: absolute;right:0;top:0;}.fe-floatmenu .hassubmenu.show>ul{display: block;}.fe-floatmenu .hassubmenu.show>a:after{content:"-";}';
    var html = '<div class="fe-floatmenu">' +
        '<a href="javascript:;">页面导航</a>' + '<a class="close" href="javascript:;">关闭</a>' +
        '<ul>' +
        '<li><a href="index.html">首页</a></li>' +
        '<li><a href="look.html">首页弹窗</a></li>' +
        '<li><a href="login.html">登录页面</a></li>' +
        '<li><a href="client.html">客户管理</a></li>' +
        '<li class="hassubmenu"><a href="javascript:;">产品管理</a>' +
        '<ul>' +
        '<li><a href="product.html">黑马会</a></li>' +
        '<li><a href="product.html">黑马学院</a></li>' +
        '</ul>' +
        '</li>' +
        '<li><a href="data_static.html">数据统计</a></li>' +
        '<li><a href="news.html">动态消息</a></li>' +
        '<li><a href="news_all.html">动态消息全部</a></li>' +
        '<li><a href="person_set.html">个人设置</a></li>' +
        '<li class="hassubmenu"><a href="javascript:;">客户个人信息</a>' +
        '<ul>' +
        '<li><a href="personal_msg.html">个人信息－展示</a></li>' +
        '<li><a href="edit_personal.html">个人信息</a></li>' +
        '<li><a href="edit_company.html">公司信息</a></li>' +
        '<li><a href="edit_meeting.html">黑马会信息</a></li>' +
        '<li><a href="edit_institute.html">黑马学院信息</a></li>' +
        '</ul>' +
        '</li>' +
        '<li class="hassubmenu"><a href="javascript:;">报名</a>' +
        '<ul>' +
        '<li><a href="camp_register.html">成长营报名结果</a></li>' +
        '<li><a href="camp_step1.html">报名第1步</a></li>' +
        '<li><a href="camp_step2.html">报名第2步</a></li>' +
        '<li><a href="camp_step3.html">报名第3步</a></li>' +
        '<li><a href="camp_step4.html">报名第4步</a></li>' +
        '<li><a href="camp_step5.html">报名第5步</a></li>' +
        '<li><a href="camp_step6.html">报名第6步</a></li>' +
        '<li><a href="class_register.html">班型报名结果</a></li>' +
        '<li><a href="class_step1.html">班型报名第1步</a></li>' +
        '<li><a href="class_step2.html">班型报名第2步</a></li>' +
        '<li><a href="class_step3.html">班型报名第3步</a></li>' +

        '</ul>' +
        '</li>' +
        '<li class="hassubmenu"><a href="javascript:;">系统设置</a>' +
        '<ul>' +
        '<li><a href="system_set.html">用户管理</a></li>' +
        '<li><a href="system_set_use.html">权限设置</a></li>' +
        '<li><a href="system_set_sale.html">销售分组</a></li>' +
        '<li><a href="system_set_city.html">地方分会分组</a></li>' +
        '</ul>' +
        '</li>' +
        '</ul>' +
        '</div>';
    var styleWrap = document.createElement("style");

    styleWrap.innerHTML = styles;
    document.body.appendChild(styleWrap);

    var htmlWrap = document.createElement("div");
    htmlWrap.innerHTML = html;
    document.body.appendChild(htmlWrap);

    var $ = document.querySelectorAll.bind(document);

    Element.prototype.on = Element.prototype.addEventListener;

    NodeList.prototype.on = function(event, fn) {
        [].forEach.call(this, function(el) {
            el.on(event, fn);
        });
        return this;
    };

    var css = function(t, s) {
        s = document.createElement('style');
        s.innerText = t;
        document.body.appendChild(s);
    };
    $(".fe-floatmenu>a").on("click", function(e) {
        $("a.close")[0].style.display = "block";
        $(".fe-floatmenu ul")[0].style.display = "block";
        this.parentNode.classList.add('show');
    });

    $(".fe-floatmenu").on("mouseleave", function(e) {
        // this.classList.remove('show');
    });
    $(".close").on("click", function(e) {
        $("a.close")[0].style.display = "none";
        $(".fe-floatmenu ul")[0].style.display = "none";
        $(".fe-floatmenu")[0].classList.remove('show');
    });
    $(".fe-floatmenu .hassubmenu").on("click", function(e) {
        e.stopPropagation();
        var obj = this.children[1];
        var display = window.getComputedStyle(obj).display;
        if (display == "block") {
            this.classList.toggle('show');
        } else if (display == "none") {
            this.classList.toggle('show');
        }
    });

})(window, document);
