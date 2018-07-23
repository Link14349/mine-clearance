var chess = [];
const num = 100;
var surplusNum = num;
var styles = [
    "#00f",
    "#0f0",
    "#f00",
    "#08f",
    "#f30",
    "#0fa",
    "#943",
    "#eee"
];
var die = false;
var chessJq = $("#chess");
var chessLength = 25;
init();
function init() {
    if (num > Math.pow(chessLength,2))
        return;
    $("#chess").css({
        "width": chessLength * 30,
        "height": chessLength * 30
    });
    for (let i = 0 ; i < chessLength ; i++){
        chess[i] = [];
        for (let j = 0 ; j < chessLength ; j++){
            chess[i][j] = 0;
        }
    }
    for (let i = 0 ; i < num ; i++){
        while (true){
            var x = Math.floor(Math.random() * chess.length),y = Math.floor(Math.random() * chess.length);
            if (chess[y][x] == 0){
                chess[y][x] = -1;
                break;
            }
        }
    }
    for (let i = 0 ; i < chess.length ; i++){
        for (let j = 0 ; j < chess.length ; j++){
            if (chess[i][j] == -1)
                continue;
            chess[i][j] += get(i - 1,j);
            chess[i][j] += get(i + 1,j);
            chess[i][j] += get(i,j - 1);
            chess[i][j] += get(i,j + 1);
            chess[i][j] += get(i - 1,j - 1);
            chess[i][j] += get(i + 1,j + 1);
            chess[i][j] += get(i + 1,j - 1);
            chess[i][j] += get(i - 1,j + 1);
        }
    }
    chessJq.empty();
    for (let i = 0 ; i < chess.length ; i++){
        for (let j = 0 ; j < chess.length ; j++){
            // chessJq.append("<div class='block' id='" + i + "-" + j + "' style='color: " + styles[chess[i][j] - 1] + "'></div>");
            // if (chess[i][j] > 0){
            //     $("#" + i + "-" + j).html(chess[i][j]);
            // }
            chessJq.append("<div class='block' id='" + i + "-" + j + "'></div>");
        }
    }
    $(".block").mousedown(function (e) {
        if (die)
            return;
        var me = $(this);
        if (e.which == 1){// left click
            open(me,true,0);
        } else {// right click
            if (me.html().search(/0/g) !== -1){
                me.html("<img src='img/flag.bmp'/>");
                surplusNum--;
                update();
            } else if (me.html().search(/flag/g) !== -1) {
                me.html("<img src='img/ask.bmp'/>");
                surplusNum++;
                update();
            } else {
                me.html("<img src='img/0.bmp'>");
            }
            if (surplusNum == 0){
                for (let i = 0 ; i < chess.length ; i++){
                    for (let j = 0 ; j < chess.length ; j++){
                        if (chess[i][j] == -1 && $("#" + i + "-" + j).html().search("flag") == -1){
                            die = true;
                            break;
                        }
                    }
                }
                if (die){
                    $("#start").attr("src","img/face_fail.bmp");
                    dieShow();
                } else {
                    $("#start").attr("src","img/face-win.bmp");
                }
            }
        }
    });
    $(".block").bind("contextmenu", function(){
        return false;
    });
    surplusNum = num;
    update();
}
function dieShow() {
    for (let i = 0 ; i < chess.length ; i++){
        for (let j = 0 ; j < chess.length ; j++){
            let tmp = $("#" + i + "-" + j);
            if (chess[i][j] == -1){// have boom
                if (tmp.html().search(/blood/g) != -1)
                    continue;
                tmp.html("<img src='img/boom.bmp'/>");
            } else if (tmp.html().search(/flag/g) != -1 && chess[i][j] != -1){// not have boom and user is marked
                tmp.html("<img src='img/error.bmp'/>");
            } else if (chess[i][j] > 0){
                me.html(chess[i][j]);
                tmp.css({
                    "color": styles[chess[i][j]],
                    "background-image": "url(\"img/0.bmp\")"
                });
            } else {
                tmp.html("<img src='img/0.bmp'/>");
            }
        }
    }
}
function open(me,canBoom,level) {
    var id = me.attr("id");
    var tmp = id.split("-");
    var x = tmp[1] * 1;
    var y = tmp[0] * 1;
    if (level > 5){
        return;
    }
    if (me.html().search(/flag/g) != -1 || me.html().search(/ask/g) != -1)
        return;
    if (chess[y][x] == -1 && canBoom){
        me.html("<img src='img/blood.bmp'/>");
        die = true;
        $("#start").attr("src","img/face_fail.bmp");
        dieShow();
    } else if (chess[y][x] > 0){
        me.html(chess[y][x]);
        me.css({
            "color": styles[chess[y][x]],
            "background-image": "url(\"img/0.bmp\")"
        });
        // for (let i = y - 1 ; i < y + 2 ; i++){
            // if (i < 0 || i >= chess.length){
                // continue;
            // }
            // for (let j = x - 1 ; j < x + 2 ; j++){
            //     let tmp = $("#" + i + "-" + j);
            //     if (j < 0 || j >= chess.length || chess[i][j] == -1 || tmp.html().search(/flag/g) != -1){
            //         continue;
            //     }
            //     open(tmp,false,level + 1);
            // }
        // }
        let tmp = $("#" + y + "-" + x);
        if (tmp.html().search(/flag/g) != -1 || tmp.html().search(/ask/g) != -1)
            return;
        if (chess[y - 1][x] == -1 || chess[y + 1][x] == -1 || chess[y][x + 1] == -1 || chess[y][x - 1] == -1 ||
            chess[y - 1][x + 1] == -1 || chess[y + 1][x - 1] == -1 || chess[y + 1][x + 1] == -1 || chess[y - 1][x - 1] == -1
        ){
            return;
        }
        open($("#" + (y - 1) + "-" + (x)),false,level + 1);
        open($("#" + (y + 1) + "-" + (x)),false,level + 1);
        open($("#" + (y) + "-" + (x + 1)),false,level + 1);
        open($("#" + (y) + "-" + (x - 1)),false,level + 1);
        open($("#" + (y - 1) + "-" + (x + 1)),false,level + 1);
        open($("#" + (y + 1) + "-" + (x - 1)),false,level + 1);
        open($("#" + (y + 1) + "-" + (x + 1)),false,level + 1);
        open($("#" + (y - 1) + "-" + (x - 1)),false,level + 1);
    } else {
        me.html("<img src='img/0.bmp'>");
        // for (let i = y - 1 ; i < y + 2 ; i++){
        //     if (i < 0 || i >= chess.length){
        //         continue;
        //     }
        //     for (let j = x - 1 ; j < x + 2 ; j++){
        //         let tmp = $("#" + i + "-" + j);
        //         if (j < 0 || j >= chess.length || chess[i][j] == -1 || tmp.html().search(/flag/g) != -1){
        //             continue;
        //         }
        //         open(tmp,false,level + 1);
        //     }
        // }
        let tmp = $("#" + y + "-" + x);
        if (tmp.html().search(/flag/g) != -1 || tmp.html().search(/ask/g) != -1)
            return;
        if (chess[y - 1][x] == -1 || chess[y + 1][x] == -1 || chess[y][x + 1] == -1 || chess[y][x - 1] == -1 ||
            chess[y - 1][x + 1] == -1 || chess[y + 1][x - 1] == -1 || chess[y + 1][x + 1] == -1 || chess[y - 1][x - 1] == -1
        ){
            return;
        }
        open($("#" + (y - 1) + "-" + (x)),false,level + 1);
        open($("#" + (y + 1) + "-" + (x)),false,level + 1);
        open($("#" + (y) + "-" + (x + 1)),false,level + 1);
        open($("#" + (y) + "-" + (x - 1)),false,level + 1);
        open($("#" + (y - 1) + "-" + (x + 1)),false,level + 1);
        open($("#" + (y + 1) + "-" + (x - 1)),false,level + 1);
        open($("#" + (y + 1) + "-" + (x + 1)),false,level + 1);
        open($("#" + (y - 1) + "-" + (x - 1)),false,level + 1);
    }
}
function get(i,j) {
    if (i < 0 || i >= chess.length || j < 0 || j >= chess.length)
        return 0;
    if (chess[i][j] == -1)
        return 1;
    return 0;
}
function update() {
    surplusNum += "";
    if (surplusNum.length == 2)
        surplusNum = "0" + surplusNum;
    if (surplusNum.length == 1)
        surplusNum = "00" + surplusNum;
    if (surplusNum.length == 0)
        surplusNum = "000";
    $("#b-h").attr("src","img/d" + surplusNum.charAt(0) + ".bmp");
    $("#b-t").attr("src","img/d" + surplusNum.charAt(1) + ".bmp");
    $("#b-o").attr("src","img/d" + surplusNum.charAt(2) + ".bmp");
    surplusNum *= 1;
}
$("#start").click(function () {
    $(this).attr("src","img/face_normal.bmp");
    die = false;
    init();
});