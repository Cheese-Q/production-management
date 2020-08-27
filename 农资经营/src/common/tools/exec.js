/**
 * @intro: 正则校验工具类.
 *
 */

export default new class Uri {
  constructor() {
  }

  //校验手机号
  checkPhone(value) {
    if (!(/^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})|1[34578]\d{9}$/.test(value))) {
      return false;
    } else {
      return true;
    }
  }

  //校验手机号
  checkPhone(rule, value, callback) {
    if (!(/^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})|1[34578]\d{9}$/.test(value))) {
      callback(new Error('联系方式有误，请重新填写'));
    } else {
      callback();
    }
  }

  //校验身份证
  checkCardNo(rule, value, callback) {
    if (!value) {
      callback();
    }
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('身份证有误，请重新填写'));
    }
  }

  //校验0-9数字
  checkPositiveNumber(rule, value, callback) {
    if (!value) {
      callback();
    }
    var reg = /(^[0-9]*$)/;
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入整数，请重新填写'));
    }
  }

  //校验数字
  checkNumber(rule, value, callback) {
    if (!value) {
      callback();
    }
    var reg = /(^\d+(\.\d+)?$)/;
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error('请输入数字，请重新填写'));
    }
  }

}
