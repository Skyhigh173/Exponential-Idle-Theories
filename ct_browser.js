import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import { ui } from "../api/ui/UI"
import { Sound } from "../api/UI/Sound"
import { ImageSource } from "../api/ui/properties/ImageSource";
import { Color } from "../api/ui/properties/Color";


var id = "CTB";
var name = "Custom Theory Browser";
var description = "version : beta-v1\n\na \"ct\" that allows you to browse all other known cts.\nDM skyhigh173 if you wants to add your own theory!\n\nfunfacts : due to discord name change, I have to remove #3120";
var authors = "skyhigh173";
var version = 3;

// string.count(substring)
function occurrences(e,n,r){if(e+="",(n+="").length<=0)return e.length+1;for(var t=0,f=0,c=r?1:n.length;;)if((f=e.indexOf(n,f))>=0)++t,f+=c;else break;return t}

var tag = {
  ct: "custom theory",
  ui_ct: "UI based custom theory",
  auto: "automator"
}
 
var cts = [
  {name: 'QOL theory',author: 'Eaux Tacous#1021', tag:tag.auto, description: 'A theory that automates the game process.\n\nFeatures:\n- auto reallocation of starts and students\n- auto publish theory & purchase theory variables', link:'https://raw.githubusercontent.com/1ekf/ex_QoL/testing/QoL_Theory.js'},
  {name: 'Sinusoidal Theory', author: '71-073~#7380', description: 'A theory where you have to pay attention to sinusoidal changes in your function. Buying any upgrades reverts time to its last multiple of π, allowing the function value to stay centered approximately at 0.', link: 'https://raw.githubusercontent.com/71M073J/CTs/master/SinusoidalTheory.js'},
  {name: 'Spirals Theory', author: 'EdgeOfDreams#4525', description: 'Swirly picture go brr\na theory with beautiful 3D shapes', link: 'https://raw.githubusercontent.com/dhebert/ExIdle-custom-theory/master/SpiralsTheory.js'},
  {name: 'Basic Theory', author: 'invalid-user#2123', description: 'This theory leads to a beautiful conclusion and is based off of the basic starter theory you get when making custom theories. It has a LOT of story chapters but you\'ll be satisfied in the end :) ouo.', link: 'https://raw.githubusercontent.com/atrainstudios/exidlebasictheory/main/CustomTheory.js'},
  {name: 'Fission Reactor', author: 'nubest#1001', description: 'A theory about "crafting elements"...? \na random theory that i created idk for some reason and it is cool i guess and yeah not nuclear craft a bunch nuclear stuff',link: 'https://raw.githubusercontent.com/nubestOuO/something-thign/main/fission%20reactor%20theorin%27t.js'},
  {name: 'Weyl Groups', author:'jackson hopper#0950', description: "Many years have passed since you found infinity. You are sitting in your office, trying not to think about all the people in your department who want you to retire. You know you have more research to give to the world. Out of the corner of your eye, you spot a dusty yellow book, \"Combinatorics of Coxeter Groups,\" by Björner and Brenti. You blow away the dust and flip through a couple pages. \n\nGood luck, and enjoy!", link: 'https://raw.githubusercontent.com/jacksonhopper/Weyl-Groups/main/Weyl-Groups.js'},
  {name: 'Exponential Limit Series', author: 'AfuroZamurai#2624',description: 'A theory to explore the beloved main formula from a different angle', link: 'https://raw.githubusercontent.com/AfuroZamurai/custom-theories/main/nonofficial/ExponentialLimitSeries.js'},
  {name: 'Trigonometry', author: 'skyhigh173#3120', description: 'You need some (a little) skills to play this theory.\nTrigonometry theory, play with sin() cos() and more. Pay attention to vartheta, it will slow down your theory when it gets bigger!', link: 'https://raw.githubusercontent.com/Skyhigh173/Theory/Offical-Release/MoreTheory/Trigonometry.js'},
  {name: 'Temperature Control Theory', tag:tag.ui_ct, author: 'Gaunter#7599', description: "Control Theory is a tool used in engineering to maintain a variable at a set value (known as the 'set point').\n\nTo make progress, you will need to disturb T to change rho.\nou will also need to grow the variable 'r', this grows faster when T is close to the setpoint, T_s.", link: 'https://raw.githubusercontent.com/lrobt97/Control-Theory/main/Control%20Theory.js'},
  {name: 'Cookie Idler', author: 'Sainen Lv.420#2684', tag:tag.ui_ct, description:"A game within a theory involving baking a copius amounts of cookies in exchange for something far greater...\n🍪==FEATURES==🍪\n🍪 Click, Bake, Farm, Produce your way into the big leagues. With 19 buildings to buy, empower, and upgrade.\n🍪 Experience a whole new level of text richness in theories like never before. Boatloads of text waiting to be read in all aspects, from the buildings, achievements, all the way to upgrades(nerdy mode included).\n🍪 Unique upgrades and intresting game mechanics will involve you to no end! Tasty Cookies, even tastier cookies, breaking the fourth wall, and changing the game itself.", link: 'https://raw.githubusercontent.com/KS-Sainen/Custom-Theory-Cookie-Idler/main/CookieIdler.js'},
  {name: 'Generating Functions', author: 'Solarion#4131', description: "One of your many students proposes an idea. At first, you are skeptical: you say, \"Are you really sure you can make something out of a possibly divergent series?\" They say to ignore the divergence and just do calculations. Despite thinking that they would be punished for such arrogance, you decided to give it a try, and the generating function was born. A generating function is a formal power series: it is in some ways similar to i. It is not always defined, but can still be used for calculations. For example, the sum of 1 + x + x^2 + x^3 + ... is equal to 1/(1-x) when x is between -1 and 1. We define the nth term of it 1/(1-x) as the coefficient of x^n, which here is always 1.", link: 'https://raw.githubusercontent.com/Solarion4131/Exponential-idle/main/Generating%20Functions.js'},
  {name: 'Theory Automator', author: 'rus9384#1864',tag:tag.auto , description: "another useful theory.\nAutomates purchases and publications in theories.", link: 'https://raw.githubusercontent.com/rus9384/Theory-automator/main/Theory%20Automator.js'},
  {name: 'Fractional Integration', author: 'Gen#3006 SnaekySnacks#1161 XLII#0042', description: "The functions between a function and its derivative have many ways of being shown, this is one of them.\nFractional integration is a way to calculate what is between a function and its integral and is a smooth transition.\nAs such, as a fractional integral approaches 1, it should become the integral.", link: 'https://raw.githubusercontent.com/Gen1Code/Fractional-Integration/main/FI.js'},
  {name: 'Bin Packing', author: 'Gen#3006', description: "Pack as many Items as you can into Bins, each Bin has a set size.\nEach strategy tries to minimise the amount of Bins needed to store all the Items.", link: 'https://raw.githubusercontent.com/Gen1Code/Bin-Packing/main/BP.js'},
  {name: 'Permutations Derangement', author: 'Gen#3006', description: "A theory about the possible arrangements and derangements of objects.\nPermutations are the number of ways objects can be arranged as a different sequence, in this case a 'very' long string of text.\nDerangements are the number of ways all objects can be rearranged so that each object is not in its current position.\nNote: in this theory every object is treated as individually different for derangement (only the number of object matters, the types and amount in each of them doesn't).\n", link: 'https://raw.githubusercontent.com/Gen1Code/Permutations-Derangment/main/PD.js'},
  {name: 'TA-Overpush', author: 'Gen#3006', tag:tag.auto, description: "Another automator theory.\nAutomates purchases and publications in theories. \nfeel free to try it!", link: 'https://raw.githubusercontent.com/Gen1Code/TA-Overpush/main/TA-Overpush.js'},
  {name: 'L-systems Renderer', author:'propfeds#5988', tag:tag.ui_ct, description: 'An educational tool that lets you draw various fractal figures and plants.\n\nFeatures:\n- Can store a whole army of systems!\n- Stochastic (randomised) systems\n- Switch between camera modes: fixed (scaled) and cursor-focused\n- Stroke options\n\nWarning: As of 0.18, the renderer\'s configuration will be messed up due to format changes to the internal state.', link: 'https://raw.githubusercontent.com/propfeds/L-systems-renderer/main/renderer.js'},
  {name: 'Goldbach\'s Conjecture', author:'GODofMEGANE', description: "ゴールドバッハ予想を使った理論ですnを二つの素数の和で表すことでnを増加させることができます出版は最初から購入可能なので直ぐに買おう\n\nA theory using the Goldbach conjecture.\nMoney can be increased by expressing \nn as the sum of two prime numbers.\nThe publication is available for purchase from the beginning.", link: 'https://raw.githubusercontent.com/GODofMEGANE/ExponentialIdle_CustomTheory/main/CustomTheory/GoldbachsConjecture.js'},
  {name: 'Probability Theory', author:'ducdat#0507 & Frozen Moon#7244', tag:tag.ui_ct, description: "A theory about random stuff. Featuring a randomized description generator, minigames, and some die rolling.\n\nTip of the day: The description of this theory will change every day! Or if I decide to update the description generator.\n(actually not here)", link: 'https://cdn.discordapp.com/attachments/969688918867988480/973566222295789569/ProbabilityTheory.js'},
  {name: 'Botched L-system', author:'propfeds#5988', description: "Your school's laboratory has decided to grow a fictional plant in the data room.\nBe careful of the implemented algorithms' limitations, else the database would slow down to a crawl, and eventually explode in a fatal ERROR.\n\nNote: the L-systems being drawn are of only level 4, instead of the actual size.", link: 'https://raw.githubusercontent.com/propfeds/botched-L-system/main/botched_L_system.js'},
  {name: 'Decay Theory', author:'soramame_256', description: "simple. Just a decay theory. What else did you exepect?", link: 'https://raw.githubusercontent.com/soramame0256/Exponential-Idle-Repo/master/Decay%20Theory.js'},
  {name: 'Derivative Equation', author:'skyhigh173#3120', description: "A simple theory with a single function - f(x)\nx increases over time,\nhowever with caps.\nyou can buy upgrades to make f(x) and x gain more powerful but reset x.\n\nfeeling slow? try idling.", link: 'https://raw.githubusercontent.com/Skyhigh173/Exponential-Idle-Theories/main/derivative-equation.js'},
  {name: 'Antimatter Dimensions', author:'skyhigh173#3120', description: "ANTIMATTER DIMENSIONS but in exp idle.\nstage: 1 - 1.79e308 antimatter\noriginal game : https://ivark.github.io", tag:tag.ui_ct, link: 'https://raw.githubusercontent.com/Skyhigh173/Antimatter-Dimensions-EXPV/main/ad.js'},
  {name: 'Collatz Conjecture', author:'propfeds, Cipher#9599, XLII#0042', description: "puzzle revolving around trying to counteract the even clause of the Collatz Conjecture.\n\n 'If it's odd, take triple and one,\nIf it's even, cut that in two.\n\nIf you woke up with a bread in hand,\nwhat would you do?'", link: 'https://raw.githubusercontent.com/propfeds/collatz-conjecture/dev/collatz.js'},
  //{name: '', author:'', description: "", link: ''},
];

// @ => \n , & => \\dot{\\rho}
// * = equation too long, modified
var eqs = [
  // QoL
  ["\\text{No equation available.}","",""],
  // sin
  ["& = f + c\\frac{t^p}{10dt}\\cos(t)","\\tau_i=(\\max\\rho)^{0.2}, \\dot{c} = c_1 c_2 dt @ dt=\\min\\{1,\\log_{10}(c)^{0.75}\\}","c=1,l=0,dt=1"],
  // spiral*
  ["x = L\\cos(\\theta)+r_2\\cos(\\theta Lr_1^{-1}) @ L=R-r_1 @ y = L\\sin(\\theta)-r_2\\sin(\\theta Lr_1^{-1}) @ r_2=r_2","& = \\frac{r_1r_2R}{\\gcd(R,r_1)} \\cdot q\\sqrt{x^2+y^2}","q=1\\qquad\\gcd(R,r_1)=0"],
  // BT
  ["&=(tai)(rao) + \\left( \\frac{\\int_0^{tai \\times (e^{\\pi i}+1)} x^{0.01C}dx}{\\frac{d}{dx}(1.71C^{1.7x}|x=rao)} \\right)","",""],
  // Fission  (omg finally a short one)
  ["P = \\sum DE_s + \\sum RE_s","\\tau_i=\\max P^{0.76}",""],
  // Weyl
  ["& = q \\cdot 2^{\\ell(w)}, \\dot{q} = \\frac{q_1q_2q_3}{10}, \\tau_i=\\max\\rho^{0.1}","\\text{Type} = A_3 @ w = *","q = 0.0, \\ell(w)=0"],
  // ELS
  ["& = q_1q_2 \\sqrt{s} \\qquad s = \\sum^n_{j=1} \\left(1 + \\frac{k}{j} \\right)^j","q_1q_2 = 0.00","\\tau_i = \\max \\rho"],
  // Trig
  ["& = \\frac{a_1q + a_2q^2}{|\\varrho| + 10^{-k}}","\\varrho = \\sum_{n=0}^\\vartheta \\frac{(-1)^nx^{2n+1}}{(2n+1)!} \\qquad \\tau_i=\\max\\rho^{0.4}","x=0.00 \\qquad &=0.00 \\qquad \\varrho = 0.01 \\qquad q=1.00"],
  // TC*
  ["& = r\\sqrt{c_1\\dot{T}^2} @ \\dot{r} = \\frac{r_1r_2}{1+\\log_{10}(1+|e(t)|)} @ \\dot{T}=\\begin{cases} u(t)(200-T) : u(t)>0 @ u(t)(T-30) : u(t)<0 \\end{cases}","e(t) = T_s - T @ u(t) = 0 @ \\tau_i=\\max\\rho^{0.2}","T=100.00,T_s=100,e(t)=0.00,r=1.00",12],
  // Cookie
  ["C = P(B(0) + P_{cp}\\sum_{i=1}^{18} B(i))","M = M_iK(0.2)+(K-10)(0.3)@+(K-25)(0.4)+(K-50)(0.5)","\\tau_i=\\max C^{0.2}"],
  // Gen Func
  // TODO : lazy, but will add later, soon™
]


// multi line eq support
eqs = eqs.map(x => {
  let f = (j) => {
    let a = j.split("@").join("\\\\").split("&").join("\\dot{\\rho}");
    return "$\\begin{matrix} " + a + " \\end{matrix}$";
  }
  return [f(x[0]),f(x[1]),f(x[2])];
});

// add ID (0...length-1) to each theory
for (let i = 0; i < cts.length; i++) {cts[i].id = i}


var showCT = [];
var selectType = 0;

function popupInfo(i){

    Sound.playClick();
    let h = showCT[i].description;
    let desc = ui.createLabel({
        text: h + '\n',
        horizontalOptions: LayoutOptions.CENTER,
        //verticalOptions: LayoutOptions.CENTER,
        fontSize:16
    });

    let tags = showCT[i].tag == undefined ? "custom theory" : showCT[i].tag;

    
    h = Math.max(Math.min((h.length / 40 + occurrences(h,'\n',false)) * 20,175),40);
  
    let eq = eqs[showCT[i].id];
    if(eq == undefined) {eq = ["No equation available (in dev)","",""]}
    let equi = ui.createPopup({title:"equations",content: ui.createGrid({
      rowDefinitions: ["2*","2*","1*"],
      children: [
        ui.createLatexLabel({row:0,text:eq[0],horizontalOptions: LayoutOptions.CENTER, fontSize:eq[3] == undefined ? 15 : eq[3]}),
        ui.createLatexLabel({row:1,text:eq[1],horizontalOptions: LayoutOptions.CENTER, fontSize:12, textColor:Color.fromRgb(0.8,0.8,0.8)}),
        ui.createLatexLabel({row:2,text:eq[2],horizontalOptions: LayoutOptions.CENTER, fontSize:11, textColor:Color.fromRgb(0.6,0.6,0.6)}),
      ]
    })})
  
    let popupui = [
        ui.createProgressBar({progress: 0}),
        ui.createLabel({text: 'author',horizontalOptions: LayoutOptions.CENTER,fontSize:22}),
        ui.createLabel({text: showCT[i].author,horizontalOptions: LayoutOptions.CENTER}),
        ui.createProgressBar({progress: 0}),
        ui.createLabel({text: 'description',horizontalOptions: LayoutOptions.CENTER,fontSize:22}),
        ui.createScrollView({children:[desc]}),
        //ui.createFrame({heightRequest:h,cornerRadius:5,children:[ui.createScrollView({children:[desc]})]}),
        ui.createLabel({text:'tag : ' + tags, fontSize:15, horizontalOptions: LayoutOptions.CENTER, verticalOptions: LayoutOptions.CENTER}),
        ui.createProgressBar({progress: 0}),
        ui.createButton({text:"equations",fontSize:20,onClicked:()=>{Sound.playClick();equi.show()}}),
        ui.createProgressBar({progress: 0}),
        ui.createLabel({text:'link',horizontalOptions: LayoutOptions.CENTER,fontSize:22}),
        ui.createEntry({
            text: showCT[i].link,
            horizontalOptions: LayoutOptions.CENTER,
            fontSize:10
        })
    ];

    popupui = ui.createStackLayout({
        children:popupui
    });

    let result = ui.createPopup({
        title: showCT[i].name,
        content: popupui
    });

    result.show();
}
function filter(text){

    showCT = cts;
    showCT.sort((a,b) => {
        a = a.name.toUpperCase();
        b = b.name.toUpperCase();
        return a > b ? 1 : (a == b ? 0 : -1)
    });
  
    if (text == '') return;

    showCT = [];

    for (let k = 0; k < cts.length;k++){
        if (cts[k].name.toUpperCase().indexOf(text.toUpperCase()) > -1){
            showCT.push(cts[k])
        }
    }
    
    return showCT;
    
}
var generateButton = () => {
    result = []
    for (let i = 0; i < showCT.length; i++) {
        result.push(
            ui.createButton({
                text:showCT[i].name,
                fontSize:20,
                onClicked: function(){popupInfo(i)}
            })
        );
    }

    result.push(
        ui.createLabel({
            text:showCT.length.toString() + ' theories found',
            horizontalOptions: LayoutOptions.CENTER,
            textColor: Color.fromRgb(0.3,0.3,0.3)
        })
    );
    
    result = ui.createStackLayout({children: result});
    
    return result;
}

var isShowed = false;

var scrV = ui.createScrollView({
  content: generateButton()
});

var entry = ui.createEntry({
  column:1,
  onTextChanged:function(old,newer){
    filter(newer); 
    scrV.content = generateButton();
  }
});
var getUIDelegate = () => {
    let rUI = () => ui.createStackLayout({
        children: [
            ui.createGrid({
              columnDefinitions: ['1*','1*'],
              minimumHeightRequest: 100,
              isVisible: () => isShowed,
              children: [
                ui.createButton({column:0,text:'Normal CT'}),
                ui.createButton({column:1,text:'Abnormal CT'}),
              ]
            }),
            ui.createGrid({
              columnDefinitions: ['0*','10*'],
              minimumHeightRequest: 25*(ui.screenHeight/667),
              heightRequest: 25*(ui.screenHeight/667),
              children:[
                ui.createButton({
                  text: () => isShowed ? '^' : 'v',
                  onClicked: () => {
                    isShowed = !isShowed;
                  }
                }),
                entry,
              ]
            }),
            ui.createGrid({heightRequest:10}),
            scrV
        ]
    });

    return rUI();
}

filter('');
scrV.content = generateButton();
