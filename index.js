'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const app = new App({ request, response });

  // 歴代の今年漢字＆理由
  const kanji_index = {
    2017: { kanji: "北", meaning: "北朝鮮ミサイルによる度重なるミサイル発射・核実験の強行や、九州北部豪雨などの災害" },
    2016: { kanji: "金", meaning: "リオデジャネイロオリンピックでの金メダルラッシュや、政治とカネ問題に揺れた年だったこと" },
    2015: { kanji: "安", meaning: "安保関連法案の成立が注目を集めたこと、世界で頻発するテロ事件や異常気象から人々を「不安」にさせたこと" },
    2014: { kanji: "税", meaning: "17年ぶりの消費税増税と、それに伴い生活環境が大きく変化したこと" },
    2013: { kanji: "輪", meaning: "2020年夏期オリンピックの東京招致に成功したこと、楽天イーグルスの初となる日本一達成" },
    2012: { kanji: "金", meaning: "東京スカイツリーの開業、ロンドンオリンピックでのメダルラッシュ、金環日食の発生" },
    2011: { kanji: "絆", meaning: "東日本大震災をはじめ、ニュージーランド地震、タイ洪水など国内外における大規模自然災害の発生から、「絆」の大切さを改めて感じた1年だったこと" },
    2010: { kanji: "暑", meaning: "観測史上1位の猛暑・残暑による熱中症の多発、地中の暑い中作業員が全員帰還したコピアポ鉱山落盤事故" },
    2009: { kanji: "新", meaning: "日本の政権交代、アメリカのオバマ大統領就任、新型インフルエンザの流行" },
    2008: { kanji: "変", meaning: "日本の内閣総理大臣の交代や、アメリカのオバマ次期大統領の「チェンジ」、リーマンショックによる経済の変化" },
    2007: { kanji: "偽", meaning: "不二家をはじめ、「白い恋人」や「赤福餅」など、食品表示偽装が次々と表面化したこと" },
    2006: { kanji: "命", meaning: "医師不足による命の不安、小中学生の自殺の多発" },
    2005: { kanji: "愛", meaning: "愛知県で「愛・地球博」が開催されたこと、また、「愛ちゃん」という相性の女性の活躍が目立ったこと" },
    2004: { kanji: "災", meaning: "新潟中越地震、台風23号をはじめとする、国内で自然災害が多かったこと" },
    2003: { kanji: "虎", meaning: "阪神タイガースの18年ぶりのリーグ優勝、イラク戦争の勃発、「虎の尾を踏む」ような自衛隊イラク派遣" },
    2002: { kanji: "帰", meaning: "初の日朝首脳会談により、北朝鮮に拉致された日本人が日本に帰国。また、日本経済がバブル期以前の標準に戻ったこと" },
    2001: { kanji: "戦", meaning: "アメリカ同時多発テロ事件の発生で、世界情勢が一変し、対テロ戦争が始まったこと" },
    2000: { kanji: "金", meaning: "シドニーオリンピックでの金メダルや、南北朝鮮統一に向けた金・金首脳会談の実現" },
    1999: { kanji: "末", meaning: "1999年は、20世紀末、1000年代の末であり、翌年への「末広がり」の期待を込めたこと" },
    1998: { kanji: "毒", meaning: "ダイオキシンや、環境ホルモン問題、和歌山で発生したカレー毒物混入事件の発生など" },
    1997: { kanji: "倒", meaning: "サッカー日本代表が強豪国を倒してワールドカップに初出場したり、山一證券をはじめとした大手企業の倒産が相次いだ出来事" },
    1996: { kanji: "食", meaning: "O157による集団食中毒事件、税金や福祉における汚職事件、狂牛病の発生" },
    1995: { kanji: "震", meaning: "「震」は、初の今年の漢字です。地下鉄サリン事件、阪神淡路大震災の発生や、金融機関の倒産などによる社会不安の拡大" }
  };

  let years = app.getArgument('years');
  let number = app.getArgument('number');

  let now = new Date();
  let nowYear = now.getFullYear();

  var kanji = '';
  var meaning = '';
  var kanji_message = '';
  var target = '';

  if (years !== null) {
    switch (years) {
      case "今年":
        target = nowYear;
        kanji = (kanji_index[target] !== undefined) ? kanji_index[target].kanji : undefined;
        meaning = (kanji_index[target] !== undefined) ? kanji_index[target].meaning : undefined;
        break;
      case "去年":
        target = nowYear - 1;
        kanji = kanji_index[target].kanji;
        meaning = kanji_index[target].meaning;
        break;
      case "一昨年":
        target = nowYear - 2;
        kanji = kanji_index[target].kanji;
        meaning = kanji_index[target].meaning;
        break;
    }
    kanji_message = years + '、' + target + '年の漢字は、「' + kanji + '」です。';

  } else if (number.toString().length == 4) {

    if (number < 1995) {
      app.tell(number + '年の漢字は、存在しません。「今年の漢字」は、1995年以降から始まりました。');
      return;
    }

    kanji = kanji_index[number].kanji;
    kanji_message = number + '年の漢字は、「' + kanji + '」です。';
    meaning = kanji_index[number].meaning;

  } else if (number.toString().length <= 2 || number.toString().length <= 3) {
    var requestYear = nowYear - number;

    if (requestYear < 1995) {
      app.tell(requestYear + '年の漢字は、存在しません。「今年の漢字」は、1995年以降から始まりました。');
      return;
    }

    kanji = kanji_index[requestYear].kanji;
    kanji_message = number + '年前、' + requestYear + '年の漢字は「' + kanji + '」です。';
    meaning = kanji_index[requestYear].meaning;
  }

  var kanji_reason = meaning + 'から、この漢字が選ばれました。';

  if (kanji === undefined) {
    kanji_message = '今年、' + nowYear + '年の漢字は、まだ決まっていません。';
    kanji_reason = 'どんな漢字になるのか、楽しみですね！';
  }

  app.tell(kanji_message + kanji_reason);
});