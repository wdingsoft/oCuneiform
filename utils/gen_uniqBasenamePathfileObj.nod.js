
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
    //////sort by filesize descend.
    for(let [basename, ary] of Object.entries(retObj)){
        ary.sort(function(f1,f2){
            var sta1 = fs.statSync(f1)
            var sta2 = fs.statSync(f2)
            return sta2.size - sta1.size
        })
    }

    return retObj;
}

function main(sdir) {
    var retObj = gen_uniq_basename(sdir)

    var str="var uniqBasenamePathfileObj = " + JSON.stringify(retObj,null,4)
    fs.writeFileSync("uniqBasenamePathfileObj.json.js", str, "utf8");

    console.log("Update: ", Object.keys(retObj).length);



    //var trs = trs_uniBasename(retObj)
    //var tabs = `${DefaultHtm}<table border='1'>${trs}</table>`
    //fs.writeFileSync("uniqBasenameObj.htm", tabs, "utf8");
    //return Object.keys(retObj).length
}




/////////////////////////////////
var argv = process.argv.slice(2);
if (argv.length === 0) {
    console.log("~ dirname")
    return (1)
} else {
    var n = main(argv[0]);
    console.log("open main.htm", n)
}

