
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

const DefaultHtm=`
<style> 
img{
    width:40px;
}
</style>
<script>
function zoomin(_this){
    //_this.style.width='400px'
    document.getElementById("zoomer").src = _this.src
}
function zoomout(_this){
    _this.style.width='40px'
}
</script>
<img id="zoomer" style="width:400px;"/>
`
function main(sdir) {

    var htm = DefaultHtm, idx = 0
    var imgext = [".png", ".jpg", ".jpeg", ".img", ".jdf"]
    DirFilesUti.recursively_getPathFiles(sdir, function (spathfname) {
        var extnam = path.extname(spathfname)
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

