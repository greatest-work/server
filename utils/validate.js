// 数据验证
module.exports = validate = async (ctxdata, checkData) => {
    return new Promise((resolve, reject) => {
        let result = [];
        for (let i in checkData) {
            let resli = {
                name: i,
                msg: "",
            };
            let msgli = [];
            for (let k in checkData[i].split("|")) {
                switch (checkData[i].split("|")[k]) {
                    case "required": // 指，这个参数是必填
                        if (!ctxdata[i]) {
                            resli.state = false;
                            msgli.push("不能为空");
                        }
                        break;
                    case "number": // 指，参数必须是number
                        if (!/^[0-9]+.?[0-9]*/.test(ctxdata[i])) {
                            resli.state = false;
                            msgli.push("必须是 number 类型");
                        }
                        break;
                    // 所以接下来，您可以自己添加需要验证的规则，是不是 boolean、string、array等；
                    default:
                        resli.state = true;
                        break;
                }
            }
            resli.msg = `参数 ${i} ${msgli.map((el) => el).join(",")}`;
            if (resli.state === false) {
                result.push(resli);
            }
        }
        if (result.length > 0) {
            reject(result);
        } else {
            resolve(true);
        }
    });
};
