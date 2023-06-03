
//var Uti = require("../Uti.Module").Uti
const fs = require('fs');
var path = require('path');

var Uti = {
    proc_argv2obj: function () {
        var argv = process.argv.slice(2);
        var obj = {};
        argv.forEach(function (str) {
            var pos = str.indexOf(":");
            if (pos > 0) {
                var key = str.substr(0, pos);
                var val = str.substr(1 + pos);
                obj[key] = val;
            }
            else {
                console.log("err:" + str);
            }
        });
        return { obj: obj, argv: argv };
    }
}



var DirFilesUti = {
    getDirectories: function (srcpath) {
        return fs.readdirSync(srcpath).filter(function (file) {
            if ("." === file[0]) return false;
            return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
    },
    getPathfiles: function (srcpath) {
        return fs.readdirSync(srcpath).filter(function (file) {
            if ("." === file[0]) return false;
            return fs.statSync(srcpath + '/' + file).isFile();
        });
    },
    recursively_getPathFiles: function (srcpath, cbf) {
        DirFilesUti.getDirectories(srcpath).forEach(function (sdir) {
            var spath = path.join(srcpath, sdir)
            //console.log(spath)
            if (fs.statSync(spath).isDirectory()) {
                DirFilesUti.recursively_getPathFiles(spath, cbf)
                DirFilesUti.getPathfiles(spath).forEach(function (sfname) {
                    var spathfname = path.join(spath, sfname)
                    //console.log(spathfname)
                    if (cbf) cbf(spathfname)
                })
            } else {
            }
        })
    }
}

const DefaultHtm = `




<!-------------------Begin--------------->
<script src="./jquery.js"></script>
<script src="./uniqBasenameJid.json.js"></script>
<script src="./uniqBasenameJid_dbm.js"></script>
<style>
    img.iconic {
        width: 40px;
    }

    .hili {
        border: 2px solid red;
    }
    #txa{
        position: fixed;
        right:30px;
    }
    #uniqJidList{
        position: fixed;
        left:10px;
        background-color: lightblue;
        width:500px;
        height: 50px;
        resize: both;
        overflow: scroll;
    }
    td.editable{
        background-color: antiquewhite;
    }
</style>
<script>
    function init_load_Jid() {
        var jidview =new uniqBasenameJid_view()
        var uniqJid={}
        for(let [basnam, obj] of Object.entries(uniqBasenameJid)){
            var ar = Object.keys(obj)
            var imgs = ""
            ar.forEach(function(jid){
                imgs+="<img src='" + jidview.JidSrc(jid) + "'/>"
            })
            $("td[title='"+basnam +"']").append(imgs)
        }

        var igm = jidview.uniqJidImgs()
        $("#uniqJidList").append(igm)
    }
    function zoomout(_this) {
        _this.style.width = '40px'
    }
    $(() => {
        init_load_Jid()

        $(".editable").each(function(){
            $(this).attr("contenteditable",true)
        })
        
        //////////////////////////////////
        $("img").on("click", function () {
            $(".hili").removeClass("hili")
            $(this).addClass("hili")
            $(this).toggleClass("iconic")
            $(".hili")[0].scrollIntoView()
        })

        ///////////////////////////////////
        $("#txa").on("click", function () {
            var obj = {}
            $("td.editable").each(function () {
                var title = $(this).attr("title")
                $(this).find("img").each(function () {
                    if (!obj[title]) {
                        obj[title] = {}
                    }
                    var src = $(this).attr("src")
                    var ids = src.slice(-9, -4)
                    obj[title][ids] = 1;//$(".hili").attr("src")
                })
            })
            var str = "var uniqBasenameJid = " + JSON.stringify(obj, null, 4)
            $(this).val(str)
        })
    })
</script>
<div id="uniqJidList"></div>
<textarea id="txa"></textarea>
<hr />
<!---------------End-------------->


`

function gen_uniq_basename(sdir) {
    var retObj = {}
    var imgext = [".png", ".jpg", ".jpeg", ".img", ".jdf"]
    DirFilesUti.recursively_getPathFiles(sdir, function (spathfname) {
        var extnam = path.extname(spathfname)
        //console.log(spathfname, extnam)
        //if(!.match(/\.htm$/i)) continue
        if (imgext.indexOf(extnam) >= 0) {
            var basenm = path.basename(spathfname)
            if (!retObj[basenm]) {
                retObj[basenm] = []
            }
            retObj[basenm].push(spathfname)
            console.log(spathfname, extnam)
        }
    })
    var str="var uniqBasenameObj = " + JSON.stringify(retObj,null,4)
    fs.writeFileSync("uniqBasenameObj.json.js", str, "utf8");
    return retObj;
}
function trs_uniBasename(obj) {
    var contxt = fs.readFileSync("uniqBasenameJid.json.js", "utf8")
    var datstr = contxt.slice(contxt.indexOf("{"))
    var uniqBasenameJidObj = JSON.parse(datstr)
    
    var trs = "", idx = 0;
    for (let [basename, ar] of Object.entries(obj)) {
        trs += `<tr><td>${idx++}</td><td title='${basename}' class='editable'></td><td>${basename}<br>`
        ar.forEach(function (pthnm) {
            trs += `<img class='iconic' src='${pthnm}'/>-`
        })
        trs += `</td><td>${ar.join("<br/>\n")}</td></tr>`
    }
    return trs;
}
function main(sdir) {
    var retObj = gen_uniq_basename(sdir)
    console.log("Update: ", Object.keys(retObj).length);
    //var trs = trs_uniBasename(retObj)
    //var tabs = `${DefaultHtm}<table border='1'>${trs}</table>`
    //fs.writeFileSync("uniqBasenameObj.htm", tabs, "utf8");
    //return Object.keys(retObj).length
}

function main_htm(sdir) {
    var htm = DefaultHtm, idx = 0
    var imgext = [".png", ".jpg", ".jpeg", ".img", ".jdf"]
    DirFilesUti.recursively_getPathFiles(sdir, function (spathfname) {
        var extnam = path.extname(spathfname)
        var basenm = path.basename(spathfname)
        //console.log(spathfname, extnam)
        //if(!.match(/\.htm$/i)) continue
        if (imgext.indexOf(extnam) >= 0) {
            console.log(spathfname, extnam)
            htm += `<img src='${spathfname}' onmouseenter="zoomin(this);"/>${idx++} | ${spathfname}<br/>\n`
        }
    })

    fs.writeFileSync("imgs.htm", htm, "utf8");
    console.log("Update: ");
    return idx
}
var argv = process.argv.slice(2);
if (argv.length === 0) {
    console.log("~ dirname")
    return (1)
} else {
    var n = main(argv[0]);
    console.log("open main.htm", n)
}

