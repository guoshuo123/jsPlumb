function getType(obj, type) {
    if (type == 'eid') {
        $('input[jtk-att="permissions_eid"]').show();
        $('input[jtk-att="permissions_zu_one"]').hide();
        $('input[jtk-att="permissions_zu_all"]').hide();
        $('select[jtk-att="permissions_zu_ment"]').hide();
        $('select[jtk-att="permissions_zd_ment"]').hide();
        $('input[jtk-att="permissions_zu"]').val('');
    } else if (type == 'zu_one') {
        $('input[jtk-att="permissions_eid"]').hide();
        $('input[jtk-att="permissions_zu_one"]').show();
        $('input[jtk-att="permissions_zu_all"]').hide();
        $('select[jtk-att="permissions_zu_ment"]').hide();
        $('select[jtk-att="permissions_zd_ment"]').hide();
        $('input[jtk-att="permissions_eid"]').val('');
    } else if (type == 'zu_all') {
        $('input[jtk-att="permissions_eid"]').hide();
        $('input[jtk-att="permissions_zu_one"]').hide();
        $('input[jtk-att="permissions_zu_all"]').show();
        $('select[jtk-att="permissions_zu_ment"]').hide();
        $('select[jtk-att="permissions_zd_ment"]').hide();
        $('input[jtk-att="permissions_eid"]').val('');
    } else if (type == 'zu_ment') {
        $('input[jtk-att="permissions_eid"]').hide();
        $('input[jtk-att="permissions_zu_one"]').hide();
        $('input[jtk-att="permissions_zu_all"]').hide();
        $('select[jtk-att="permissions_zu_ment"]').show();
        $('select[jtk-att="permissions_zd_ment"]').hide();
        $('input[jtk-att="permissions_eid"]').val('');
    } else if (type == 'zd_ment') {
        $('input[jtk-att="permissions_eid"]').hide();
        $('input[jtk-att="permissions_zu_one"]').hide();
        $('input[jtk-att="permissions_zu_all"]').hide();
        $('select[jtk-att="permissions_zu_ment"]').hide();
        $('select[jtk-att="permissions_zd_ment"]').show();
        $('input[jtk-att="permissions_eid"]').val('');
    }
}

function getFormKey(obj) {
    var data = {
        form_mark: $('select[jtk-att="position_form"]').val(),
    }

    // $.ajax({
    //     url: '/approve/form/get-form-key',
    //     data: data,
    //     type: 'POST',
    //     dataType: 'json',
    //     success: function(res) {
    //         if (res.code == 0) {
    //             var appendStr = '<option value=" ">请选择表单字段</option>';
    //             $.each(res.data, function(key, value) {
    //                 appendStr += "<option>"+value.name+"</option>";
    //             })
    //             $('select[jtk-att="position_key"]').html(appendStr);
    //         }
    //     },
    //     error: function() {
    //     }
    // })
}

function add() {

    countNum = $("#add_question").prevAll('.note_question').length;
    cloneObj = $("#add_question").prev('.note_question');
    var dataNum = countNum.toString();
    while ($("#add_question").closest('.question').find('div[data="' + dataNum + '"]').html()) {
        countNum++;
        dataNum = countNum.toString();
    }

    var html = "<div class=\"note_question\" data=\"" + countNum + "\"  style=\"padding-top: 15px; border-top: 1px #ccc solid;\">" + cloneObj.html() + "</div>",
        reName = /jtk-att\=\"(\w+)\[(\w+)\]/g;
    obj = null;

    html = html.replace(reName, 'jtk-att\=\"$1[' + countNum + ']');

    obj = $(html);
    obj.find('textare').val("");
    obj.find('select').attr('selected', false);
    obj.find(':checkbox').attr('checked', false);
    obj.find('.clone_num').text(countNum + 1);

    $.each(obj.find(':text'), function (key, index, array) {
        if (index.getAttribute('readonly') == null) {
        }
    });

    $("#add_question").before(obj);

    return true;
}
$(document).on("click", ".clone_remove", function() {
    if ($(this).closest('.question').find(".note_question").length > 1) {
        $(this).closest('.note_question').remove();
    }
});