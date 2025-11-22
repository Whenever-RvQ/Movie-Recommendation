const fs = require('fs');
const path = require('path');
const NodeRSA = require('node-rsa');
const { priKeyPath, pubKeyPath } = require('../../config');
const { compile } = require('morgan');
const mongoPage = require('mongoose-sex-page');
const qs = require('qs')


function generateKeys() {
  const newkey = new NodeRSA({ b: 512 });
  newkey.setOptions({ encryptionScheme: 'pkcs1' })
  let public_key = newkey.exportKey('pkcs8-public')//公钥,
  let private_key = newkey.exportKey('pkcs8-private') //私钥

  fs.writeFileSync(priKeyPath, private_key);
  fs.writeFileSync(pubKeyPath, public_key);


}

function encrypt(plain) {
  let public_key = fs.readFileSync(pubKeyPath, 'utf8');
  const nodersa = new NodeRSA(public_key);
  nodersa.setOptions({ encryptionScheme: 'pkcs1' });
  const encrypted = nodersa.encrypt(plain, 'base64');
  return encrypted;
}

function decrypt(cipher) {
  let private_key = fs.readFileSync(priKeyPath, 'utf8'); //私钥
  let prikey = new NodeRSA(private_key);
  prikey.setOptions({ encryptionScheme: 'pkcs1' });
  return prikey.decrypt(cipher, 'utf8')
}

async function pagination({ model, query, options, populate = {}, size, page, dis }) {
  // 解析查询字符串
  if (typeof query === 'string') {
    try {
      query = qs.parse(query)
    } catch (e) {
      query = {}
    }
  }

  console.log(query)

  // 处理查询参数类型转换
  let mongoQuery = {}

  // 类型转换函数
  function convertValueType(key, value, schema) {
    // 如果有对应的 schema 定义，根据 schema 类型转换
    if (schema && schema.path(key)) {
      const path = schema.path(key)
      const instanceType = path.instance

      switch (instanceType) {
        case 'Boolean':
          if (typeof value === 'string') {
            return value.toLowerCase() === 'true' ? true : value.toLowerCase() === 'false' ? false : value
          }
          return value
        case 'Number':
          if (typeof value === 'string' && !isNaN(value) && value !== '') {
            return Number(value)
          }
          return value
        case 'Date':
          if (typeof value === 'string') {
            const date = new Date(value)
            return isNaN(date.getTime()) ? value : date
          }
          return value
        default:
          return value
      }
    }

    // 如果没有 schema 或者是通用字段，基于值的内容进行推测转换
    if (typeof value === 'string') {
      // 布尔值转换
      if (value.toLowerCase() === 'true') return true
      if (value.toLowerCase() === 'false') return false

      // 数字转换
      if (!isNaN(value) && value !== '' && !isNaN(parseFloat(value))) {
        return Number(value)
      }

      // ObjectId 转换（简单的长度判断）
      if (/^[0-9a-fA-F]{24}$/.test(value)) {
        return value
      }
    }

    return value
  }

  // 转换查询参数类型
  const schema = model.schema
  if (query && typeof query === 'object') {
    Object.keys(query).forEach(key => {
      // 排除特殊处理的字段
      if (key !== 'q' && key !== 'column') {
        mongoQuery[key] = convertValueType(key, query[key], schema)
      }
    })
  }

  // 处理关键词搜索
  let q = query?.q
  if (q) {
    let regExp = new RegExp(q, 'i')
    // 关键词搜索使用 $or 操作符
    mongoQuery.$or = [
      { title: { $regex: regExp } },
      { body: { $regex: regExp } }
    ]
  }

  // 处理其他查询参数，如 column
  if (query?.column) {
    mongoQuery.column = convertValueType('column', query.column, schema)
  }

  console.log('最终查询条件:', mongoQuery)

  // 使用处理后的查询条件
  let result = await mongoPage(model)
    .find(mongoQuery)
    .sort({ '_id': 1 })
    .populate(populate)
    .select(options)
    .size(size)
    .page(page)
    .display(dis)
    .exec()

  let { total, records: list, pages, display } = result
  //count 当次返回的 list的长度 数据数量
  let count = list.length
  return { count, page, size, total, list, pages, display }
}

function toDouble(num) {
  return String(num)[1] && String(num) || '0' + num;
}

function formatDate(date = new Date(), format = "yyyy-MM-dd hh:mm:ss") {

  let regMap = {
    'y': date.getFullYear(),
    'M': toDouble(date.getMonth() + 1),
    'd': toDouble(date.getDate()),
    'h': toDouble(date.getHours()),
    'm': toDouble(date.getMinutes()),
    's': toDouble(date.getSeconds()),
  }

  //逻辑(正则替换 对应位置替换对应值) 数据(日期验证字符 对应值) 分离
  return Object.entries(regMap).reduce((acc, [reg, value]) => {
    return acc.replace(new RegExp(`${reg}+`, 'g'), value);
  }, format);
}


module.exports = {
  generateKeys,
  encrypt,
  decrypt,
  pagination,
  formatDate
};