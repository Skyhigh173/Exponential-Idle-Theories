import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import { ui } from "../api/ui/UI"
import { Sound } from "../api/UI/Sound"
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Color } from "../api/ui/properties/Color";
import { Thickness } from "./api/ui/properties/Thickness";
import { TextAlignment } from "./api/ui/properties/TextAlignment";


var id = "CTB";
var name = "Custom Theory Browser";
var description = "A all-in-one CT collection that stores all the information of exisiting non-official custom theories.\nDM skyhigh173 if you want to add your own theory!";
var authors = "skyhigh173";
var version = 4;

// POLYFILL
// string.count(substring)
function occurrences(e, n, r) { if (e += "", (n += "").length <= 0) return e.length + 1; for (var t = 0, f = 0, c = r ? 1 : n.length; ;)if ((f = e.indexOf(n, f)) >= 0) ++t, f += c; else break; return t }

const groupBy = (arr, callback) => {
  return arr.reduce((acc = {}, ...args) => {
    const key = callback(...args);
    acc[key] ??= []
    acc[key].push(args[0]);
    return acc;
  }, {});
};

if (typeof Object.groupBy === typeof undefined) {
  Object.groupBy = groupBy;
}

if (typeof Array.groupToMap === typeof undefined) {
  Array.groupToMap = groupBy;
}

if (typeof Array.group === typeof undefined) {
  Array.group = groupBy;
}

var tag = {
  ct: "Custom Theory",
  ui_ct: "UI based custom theory",
  auto: "Automator",
  other: "Other / Fun",
  troll: "Troll"
}

var cts = [
  { name: 'QOL theory', author: 'Eaux Tacous#1021', tag: tag.auto, description: 'A theory that automates the game process.\n\nFeatures:\n- auto reallocation of starts and students\n- auto publish theory & purchase theory variables', link: 'https://raw.githubusercontent.com/1ekf/ex_QoL/testing/QoL_Theory.js' },
  { name: 'Sinusoidal Theory', author: '71-073~#7380', description: 'A theory where you have to pay attention to sinusoidal changes in your function. Buying any upgrades reverts time to its last multiple of π, allowing the function value to stay centered approximately at 0.', link: 'https://raw.githubusercontent.com/71M073J/CTs/master/SinusoidalTheory.js' },
  { name: 'Spirals Theory', author: 'EdgeOfDreams#4525', description: 'Swirly picture go brr\na theory with beautiful 3D shapes', link: 'https://raw.githubusercontent.com/dhebert/ExIdle-custom-theory/master/SpiralsTheory.js' },
  { name: 'Basic Theory', author: 'invalid-user#2123', description: 'This theory leads to a beautiful conclusion and is based off of the basic starter theory you get when making custom theories. It has a LOT of story chapters but you\'ll be satisfied in the end :) ouo.', link: 'https://raw.githubusercontent.com/atrainstudios/exidlebasictheory/main/CustomTheory.js' },
  { name: 'Fission Reactor', author: 'nubest#1001', description: 'A theory about "crafting elements"...? \na random theory that i created idk for some reason and it is cool i guess and yeah not nuclear craft a bunch nuclear stuff', link: 'https://raw.githubusercontent.com/nubestOuO/something-thign/main/fission%20reactor%20theorin%27t.js' },
  { name: 'Weyl Groups', author: 'jackson hopper#0950', description: "Many years have passed since you found infinity. You are sitting in your office, trying not to think about all the people in your department who want you to retire. You know you have more research to give to the world. Out of the corner of your eye, you spot a dusty yellow book, \"Combinatorics of Coxeter Groups,\" by Björner and Brenti. You blow away the dust and flip through a couple pages. \n\nGood luck, and enjoy!", link: 'https://raw.githubusercontent.com/jacksonhopper/Weyl-Groups/main/Weyl-Groups.js' },
  { name: 'Exponential Limit Series', author: 'AfuroZamurai#2624', description: 'A theory to explore the beloved main formula from a different angle', link: 'https://raw.githubusercontent.com/AfuroZamurai/custom-theories/main/nonofficial/ExponentialLimitSeries.js' },
  { name: 'Trigonometry', author: 'skyhigh173#3120', description: 'You need some (a little) skills to play this theory.\nTrigonometry theory, play with sin() cos() and more. Pay attention to vartheta, it will slow down your theory when it gets bigger!', link: 'https://raw.githubusercontent.com/Skyhigh173/Theory/Offical-Release/MoreTheory/Trigonometry.js' },
  { name: 'Temperature Control Theory', tag: tag.ui_ct, author: 'Gaunter#7599', description: "Control Theory is a tool used in engineering to maintain a variable at a set value (known as the 'set point').\n\nTo make progress, you will need to disturb T to change rho.\nou will also need to grow the variable 'r', this grows faster when T is close to the setpoint, T_s.", link: 'https://raw.githubusercontent.com/lrobt97/Control-Theory/main/Control%20Theory.js' },
  { name: 'Cookie Idler', author: 'Sainen Lv.420#2684', tag: tag.ui_ct, description: "A game within a theory involving baking a copius amounts of cookies in exchange for something far greater...\n🍪==FEATURES==🍪\n🍪 Click, Bake, Farm, Produce your way into the big leagues. With 19 buildings to buy, empower, and upgrade.\n🍪 Experience a whole new level of text richness in theories like never before. Boatloads of text waiting to be read in all aspects, from the buildings, achievements, all the way to upgrades(nerdy mode included).\n🍪 Unique upgrades and intresting game mechanics will involve you to no end! Tasty Cookies, even tastier cookies, breaking the fourth wall, and changing the game itself.", link: 'https://raw.githubusercontent.com/KS-Sainen/Custom-Theory-Cookie-Idler/main/CookieIdler.js' },
  { name: 'Generating Functions', author: 'Solarion#4131', description: "One of your many students proposes an idea. At first, you are skeptical: you say, \"Are you really sure you can make something out of a possibly divergent series?\" They say to ignore the divergence and just do calculations. Despite thinking that they would be punished for such arrogance, you decided to give it a try, and the generating function was born. A generating function is a formal power series: it is in some ways similar to i. It is not always defined, but can still be used for calculations. For example, the sum of 1 + x + x^2 + x^3 + ... is equal to 1/(1-x) when x is between -1 and 1. We define the nth term of it 1/(1-x) as the coefficient of x^n, which here is always 1.", link: 'https://raw.githubusercontent.com/Solarion4131/Exponential-idle/main/Generating%20Functions.js' },
  { name: 'Theory Automator', author: 'rus9384#1864', tag: tag.auto, description: "another useful theory.\nAutomates purchases and publications in theories.", link: 'https://raw.githubusercontent.com/rus9384/Theory-automator/main/Theory%20Automator.js' },
  // { name: 'Fractional Integration', author: 'Gen#3006 SnaekySnacks#1161 XLII#0042', description: "The functions between a function and its derivative have many ways of being shown, this is one of them.\nFractional integration is a way to calculate what is between a function and its integral and is a smooth transition.\nAs such, as a fractional integral approaches 1, it should become the integral.", link: 'https://raw.githubusercontent.com/Gen1Code/Fractional-Integration/main/FI.js' },
  { name: 'Bin Packing', author: 'Gen#3006', description: "Pack as many Items as you can into Bins, each Bin has a set size.\nEach strategy tries to minimise the amount of Bins needed to store all the Items.", link: 'https://raw.githubusercontent.com/Gen1Code/Bin-Packing/main/BP.js' },
  { name: 'Permutations Derangement', author: 'Gen#3006', description: "A theory about the possible arrangements and derangements of objects.\nPermutations are the number of ways objects can be arranged as a different sequence, in this case a 'very' long string of text.\nDerangements are the number of ways all objects can be rearranged so that each object is not in its current position.\nNote: in this theory every object is treated as individually different for derangement (only the number of object matters, the types and amount in each of them doesn't).\n", link: 'https://raw.githubusercontent.com/Gen1Code/Permutations-Derangment/main/PD.js' },
  { name: 'TA-Overpush', author: 'Gen#3006', tag: tag.auto, description: "Another automator theory.\nAutomates purchases and publications in theories. \nfeel free to try it!", link: 'https://raw.githubusercontent.com/Gen1Code/TA-Overpush/main/TA-Overpush.js' },
  { name: 'L-systems Renderer', author: 'propfeds#5988', tag: tag.ui_ct, description: 'An educational tool that lets you draw various fractal figures and plants.\n\nFeatures:\n- Can store a whole army of systems!\n- Stochastic (randomised) systems\n- Switch between camera modes: fixed (scaled) and cursor-focused\n- Stroke options\n\nWarning: As of 0.18, the renderer\'s configuration will be messed up due to format changes to the internal state.', link: 'https://raw.githubusercontent.com/propfeds/L-systems-renderer/main/renderer.js' },
  { name: 'Goldbach\'s Conjecture', author: 'GODofMEGANE', description: "ゴールドバッハ予想を使った理論ですnを二つの素数の和で表すことでnを増加させることができます出版は最初から購入可能なので直ぐに買おう\n\nA theory using the Goldbach conjecture.\nMoney can be increased by expressing \nn as the sum of two prime numbers.\nThe publication is available for purchase from the beginning.", link: 'https://raw.githubusercontent.com/GODofMEGANE/ExponentialIdle_CustomTheory/main/CustomTheory/GoldbachsConjecture.js' },
  { name: 'Probability Theory', author: 'ducdat#0507 & Frozen Moon#7244', tag: tag.ui_ct, description: "A theory about random stuff. Featuring a randomized description generator, minigames, and some die rolling.\n\nTip of the day: The description of this theory will change every day! Or if I decide to update the description generator.\n(actually not here)", link: 'https://cdn.discordapp.com/attachments/969688918867988480/973566222295789569/ProbabilityTheory.js' },
  { name: 'Decay Theory', author: 'soramame_256', description: "simple. Just a decay theory. What else did you exepect?", link: 'https://raw.githubusercontent.com/soramame0256/Exponential-Idle-Repo/master/Decay%20Theory.js' },
  { name: 'Derivative Equation', author: 'skyhigh173#3120', description: "A simple theory with a single function - f(x)\nx increases over time,\nhowever with caps.\nyou can buy upgrades to make f(x) and x gain more powerful but reset x.\n\nfeeling slow? try idling.", link: 'https://raw.githubusercontent.com/Skyhigh173/Exponential-Idle-Theories/main/derivative-equation.js' },
  // temp unlist cuz I will make a new one soon { name: 'Antimatter Dimensions', author: 'skyhigh173#3120', description: "ANTIMATTER DIMENSIONS but in exp idle.\nstage: 1 - 1.79e308 antimatter\noriginal game : https://ivark.github.io", tag: tag.ui_ct, link: 'https://raw.githubusercontent.com/Skyhigh173/Antimatter-Dimensions-EXPV/main/ad.js' },
  { name: 'Collatz Conjecture', author: 'propfeds, Cipher#9599, XLII#0042', description: "puzzle revolving around trying to counteract the even clause of the Collatz Conjecture.\n\n 'If it's odd, take triple and one,\nIf it's even, cut that in two.\n\nIf you woke up with a bread in hand,\nwhat would you do?'", link: 'https://raw.githubusercontent.com/propfeds/collatz-conjecture/dev/collatz.js' },
  { name: 'Custom Theory Browser', author: 'skyhigh173', description: "CT browser in CT browser\ncuz why not?", tag: tag.other, link: 'https://raw.githubusercontent.com/Skyhigh173/Exponential-Idle-Theories/main/ct_browser.js' },
  { name: 'Sudoku Theory', author: 'AfuroZamurai#2624', description: "A minigame theory which allows you to play different difficulties of sudoku (alpha version, still missing a lot of the ultimately planned features)", tag: tag.ui_ct, link: 'https://raw.githubusercontent.com/AfuroZamurai/custom-theories/dev/nonofficial/Sudoku_alpha.js' },
  { name: 'Lemma\'s Garden', author: 'propfeds#5988', description: "Last night, Lemma swept away the rubbles of her old garden. You are her first student in a long while.", tag: tag.ui_ct, link: 'https://raw.githubusercontent.com/propfeds/lemmas-garden/v0.0.3/theory.js' },
  { name: 'Laplace Transform', author: 'lrobt97', description: "A custom theory based on Laplace transforms.", tag: tag.ui_ct, link: 'https://raw.githubusercontent.com/lrobt97/Laplace-Transform/main/theory.js' },
  { name: 'Pong Theory', author: '71~073~#7380', description: "Pong in Exponential Idle. Yes, you read that right.", tag: tag.ui_ct, link: 'https://raw.githubusercontent.com/71M073J/CTs/master/pongTheory.js' },
  { name: 'Logistic Function pet ouo', author: 'skyhigh173', description: "yeah, t5 pet", tag: tag.troll, link: 'https://raw.githubusercontent.com/Skyhigh173/theory-sdk/main/samples/T5-LogisticFunction.js' },
  
  {name: 'Riemann Xi', author: 'killamdintom', description: "(In development)", tag: tag.ct, link: 'https://raw.githubusercontent.com/YouSlovenia/RiemannXi/refs/heads/main/RiemannXi.js'},
  {name: 'Curve of Time', author: 'HyperKNF', description: "(In development)", tag: tag.ct, link: 'https://raw.githubusercontent.com/hyperknf/ExponentialIdleCustomTheory/main/TimeCurve.js'},
  {name: 'Logistic Map', author: 'propfeds', description: "The ebb and flow of populations, represented by a simple quadratic function.\nThe variable r represents the population's reproduction rate, but as the population gets larger, starvation will begin to take effect.", tag: tag.ct, link: 'https://raw.githubusercontent.com/propfeds/logistic-map/main/theory.js'},
  //{name: '', author: '', description: "", tag: '', link: ''},
];

// add ID (0...length-1) to each theory
for (let i = 0; i < cts.length; i++) { cts[i].id = i; if (cts[i].tag === undefined) { cts[i].tag = tag.ct } }


var showCT = [];

function popupInfo(i) {
  log(`got | i, ${cts[i].id}`)

  Sound.playClick();
  let ctTag = cts[i].tag == undefined ? "custom theory" : cts[i].tag;

  let createHeading = text => ui.createLabel({
    text: text,
    fontAttributes: FontAttributes.BOLD,
    horizontalOptions: LayoutOptions.CENTER,
    horizontalTextAlignment: TextAlignment.CENTER
  });

  let createInnerLabel = lab => ui.createLabel({
    text: lab,
    horizontalOptions: LayoutOptions.CENTER,
    fontSize: 14
  });

  let createSpacer = () => ui.createLabel({ minimumHeightRequest: 10, heightRequest: 10 });

  let popupui = [
    ui.createFrame({
      padding: new Thickness(10, 0),
      children: [ui.createScrollView({
        minimumHeightRequest: 200,
        padding: new Thickness(10),
        children: [ui.createStackLayout({
          children: [
            createHeading('Description'),
            createInnerLabel(cts[i].description),
            createSpacer(),

            createHeading('Author'),
            createInnerLabel(cts[i].author),
            createSpacer(),

            createHeading('Type'),
            createInnerLabel(ctTag)
          ]
        })]
      })]
    }),
    createSpacer(),
    createHeading('Download'),
    ui.createEntry({
      text: cts[i].link,
      horizontalOptions: LayoutOptions.CENTER,
      horizontalTextAlignment: TextAlignment.CENTER,
      fontSize: 10
    })
  ];

  popupui = ui.createStackLayout({
    children: popupui
  });

  let result = ui.createPopup({
    title: cts[i].name,
    content: popupui,
    minimumHeightRequest: 300,
  });

  result.show();
}

function filter(text) {
  showCT = JSON.parse(JSON.stringify(cts));
  showCT.sort((a, b) => {
    a = a.name.toUpperCase();
    b = b.name.toUpperCase();
    return a > b ? 1 : (a == b ? 0 : -1)
  });

  if (text == '') return;

  showCT = [];

  for (let k = 0; k < cts.length; k++) {
    if (cts[k].name.toUpperCase().indexOf(text.toUpperCase()) > -1) {
      showCT.push(cts[k])
    }
  }

  return showCT;
}

// generate the list using showCT
var generateButton = () => {
  let UIresult = [];
  let grouped = Object.groupBy(showCT, i => i.tag);
  // TODO - put 'ct' at the front
  let gk = Object.entries(grouped);
  for (let groupID = 0; groupID < gk.length; groupID++) {

    UIresult.push(ui.createLabel({ text: gk[groupID][0], fontSize: 14, horizontalTextAlignment: TextAlignment.CENTER }));
    for (let i = 0; i < gk[groupID][1].length; i++) {
      UIresult.push(
        ui.createFrame({
          minimumHeightRequest: 45,
          heightRequest: 45,
          children: [ui.createLatexLabel({
            text: gk[groupID][1][i].name,
            fontSize: 14,
            verticalOptions: LayoutOptions.CENTER,
            horizontalOptions: LayoutOptions.CENTER,
            verticalTextAlignment: TextAlignment.CENTER
          })],
          onTouched: (e) => {
            if (e.type === TouchType.LONGPRESS_RELEASED || e.type === TouchType.SHORTPRESS_RELEASED)
              {popupInfo(gk[groupID][1][i].id); log(gk[groupID][1][i].id); }
          }
        })
      );
    }
  }

  UIresult.push(
    ui.createLabel({
      text: showCT.length.toString() + ' theories found | v4',
      horizontalOptions: LayoutOptions.CENTER
    })
  );

  UIresult = ui.createStackLayout({ padding: new Thickness(7, 0), children: UIresult });

  return UIresult;
}

var isShowed = false;

var mainScrollV = ui.createScrollView({
  content: generateButton()
});

var entry = ui.createEntry({
  column: 1,
  onTextChanged: function (old, newer) {
    filter(newer);
    mainScrollV.content = generateButton();
  }
});
var getUIDelegate = () => {
  let rUI = () => ui.createStackLayout({
    children: [
      entry,
      ui.createGrid({ heightRequest: 10 }),
      mainScrollV
    ]
  });

  return rUI();
}

filter('');
mainScrollV.content = generateButton();
