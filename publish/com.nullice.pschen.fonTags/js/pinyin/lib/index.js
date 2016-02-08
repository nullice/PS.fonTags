"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var assign = require("object-assign");
var PINYIN_DICT = require("../data/dict-zi");
var Pinyin = require("./pinyin");
var jieba = undefined;
var PHRASES_DICT = undefined;

var NodePinyin = (function (_Pinyin) {
  _inherits(NodePinyin, _Pinyin);

  function NodePinyin() {
    _classCallCheck(this, NodePinyin);

    _get(Object.getPrototypeOf(NodePinyin.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(NodePinyin, [{
    key: "convert",

    // @param {String} hans 要转为拼音的目标字符串（汉字）。
    // @param {Object} options, 可选，用于指定拼音风格，是否启用多音字。
    // @return {Array} 返回的拼音列表。
    value: function convert(hans, options) {
      if (typeof hans !== "string") {
        return [];
      }

      options = assign({}, Pinyin.DEFAULT_OPTIONS, options);
      var phrases = options && options.segment ? segment(hans) : hans;
      var pys = [];
      var nohans = "";

      for (var i = 0, firstCharCode = undefined, words = undefined, l = phrases.length; i < l; i++) {

        words = phrases[i];
        firstCharCode = words.charCodeAt(0);

        if (PINYIN_DICT[firstCharCode]) {

          // ends of non-chinese words.
          if (nohans.length > 0) {
            pys.push([nohans]);
            nohans = ""; // reset non-chinese words.
          }

          if (words.length === 1) {
            pys = pys.concat(_get(Object.getPrototypeOf(NodePinyin.prototype), "convert", this).call(this, words, options));
          } else {
            pys = pys.concat(this.phrases_pinyin(words, options));
          }
        } else {
          nohans += words;
        }
      }

      // 清理最后的非中文字符串。
      if (nohans.length > 0) {
        pys.push([nohans]);
        nohans = ""; // reset non-chinese words.
      }

      return pys;
    }

    // 词语注音
    // @param {String} phrases, 指定的词组。
    // @param {Object} options, 选项。
    // @return {Array}
  }, {
    key: "phrases_pinyin",
    value: function phrases_pinyin(phrases, options) {
      var py = [];
      if (PHRASES_DICT.hasOwnProperty(phrases)) {
        //! copy pinyin result.
        PHRASES_DICT[phrases].forEach(function (item, idx) {
          py[idx] = [];
          if (options.heteronym) {
            item.forEach(function (py_item, py_index) {
              py[idx][py_index] = Pinyin.toFixed(py_item, options.style);
            });
          } else {
            py[idx][0] = Pinyin.toFixed(item[0], options.style);
          }
        });
      } else {
        for (var i = 0, l = phrases.length; i < l; i++) {
          py = py.concat(_get(Object.getPrototypeOf(NodePinyin.prototype), "convert", this).call(this, phrases[i], options));
        }
      }
      return py;
    }
  }]);

  return NodePinyin;
})(Pinyin);

function segment(hans) {
  try {
    jieba = jieba || require("nodejieba");
  } catch (ex) {
    console.error();
    console.error("    Segment need nodejieba, please run '$ npm install nodejieba'.");
    console.error("    分词需要使用 nodejieba 模块，请运行 '$ npm install nodejieba' 并确保安装完成。");
    console.error();
    throw ex;
  }
  // 词语拼音库。
  PHRASES_DICT = PHRASES_DICT || require("../data/phrases-dict");
  return jieba.cut(hans, "MP", 4);
}

var pinyin = new NodePinyin(PINYIN_DICT);

module.exports = pinyin.convert.bind(pinyin);
module.exports.STYLE_NORMAL = Pinyin.STYLE_NORMAL;
module.exports.STYLE_TONE = Pinyin.STYLE_TONE;
module.exports.STYLE_TONE2 = Pinyin.STYLE_TONE2;
module.exports.STYLE_TO3NE = Pinyin.STYLE_TO3NE;
module.exports.STYLE_INITIALS = Pinyin.STYLE_INITIALS;
module.exports.STYLE_FIRST_LETTER = Pinyin.STYLE_FIRST_LETTER;