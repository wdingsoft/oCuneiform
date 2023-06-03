function uniqBasenameJid_dbm() {
    this.m_uniqBasenameJid = uniqBasenameJid
}
uniqBasenameJid_dbm.prototype.uniqJidObj = function () {
    var uniqObj = {}
    for (let [cunfname, obj] of Object.entries(this.m_uniqBasenameJid)) {
        Object.keys(obj).forEach(function (jid) {
            if (!uniqObj[jid]) uniqObj[jid] = {}
            uniqObj[jid][cunfname] = 1
        })
    }
    return uniqObj
}


function uniqBasenameJid_view() {
    this.m_uniqBasenameJid = uniqBasenameJid
}
uniqBasenameJid_view.prototype.JidSrc = function (jid) {
    var imgAddr = "http://34.227.20.213/obi/data/obimg/odb/tbi/img/jgif/";//62859.gif
    var src = `${imgAddr}${jid}.gif`
    return src
}
uniqBasenameJid_view.prototype.uniqJidImgs = function () {
    var dbm = new uniqBasenameJid_dbm()
    var unq = dbm.uniqJidObj()
    var imgs = "", _THIS = this
    Object.keys(unq).forEach(function (jid) {
        imgs += `<img src='${_THIS.JidSrc(jid)}'/>`
    })
    return imgs
}