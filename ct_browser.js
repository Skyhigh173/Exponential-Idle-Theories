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
var description = "version : alpha-test-v1.1\n\na \"ct\" that allows you to browse all other known cts.\nDM skyhigh173#3120 if you wants to add your own theory!\n\nFunFacts: idk how to de the search system!! So hard! take a look at my source code, lol";
var authors = "skyhigh173#3120";
var version = 2;

 
var cts = [
    {name: 'QOL theory',author: 'Eaux Tacous#1021', description: 'A theory that automates the game process.\n\nFeatures:\n- auto reallocation of starts and students\n- auto publish theory & purchase theory variables', link:'https://raw.githubusercontent.com/1ekf/ex_QoL/testing/QoL_Theory.js'},
    {name: 'Sinusoidal Theory', author: '71-073~#7380', description: 'A theory where you have to pay attention to sinusoidal changes in your function. Buying any upgrades reverts time to its last multiple of π, allowing the function value to stay centered approximately at 0.', link: 'https://raw.githubusercontent.com/71M073J/CTs/master/SinusoidalTheory.js'},
    {name: 'Spirals Theory', author: 'EdgeOfDreams#4525', description: 'Swirly picture go brr\na theory with beautiful 3D shapes', link: 'https://raw.githubusercontent.com/dhebert/ExIdle-custom-theory/master/SpiralsTheory.js'},
    {name: 'Basic Theory', author: 'invalid-user#2123', description: 'This theory leads to a beautiful conclusion and is based off of the basic starter theory you get when making custom theories. It has a LOT of story chapters but you\'ll be satisfied in the end :) ouo.', link: 'https://raw.githubusercontent.com/atrainstudios/exidlebasictheory/main/CustomTheory.js'},
    {name: 'Fission Reactor', author: 'nubest#1001', description: 'A theory about "crafting elements"...? \na random theory that i created idk for some reason and it is cool i guess and yeah not nuclear craft a bunch nuclear stuff',link: 'https://raw.githubusercontent.com/nubestOuO/something-thign/main/fission%20reactor%20theorin%27t.js'},
    {name: 'Weyl Groups', author:'jackson hopper#0950', description: "Many years have passed since you found infinity. You are sitting in your office, trying not to think about all the people in your department who want you to retire. You know you have more research to give to the world. Out of the corner of your eye, you spot a dusty yellow book, \"Combinatorics of Coxeter Groups,\" by Björner and Brenti. You blow away the dust and flip through a couple pages. \n\nGood luck, and enjoy!", link: 'https://raw.githubusercontent.com/jacksonhopper/Weyl-Groups/main/Weyl-Groups.js'},
    {name: 'Exponential Limit Series', author: 'AfuroZamurai#2624',description: 'A theory to explore the beloved main formula from a different angle', link: 'https://raw.githubusercontent.com/AfuroZamurai/custom-theories/main/nonofficial/ExponentialLimitSeries.js'},
    {name: 'Trigonometry', author: 'skyhigh173#3120', description: 'You need some (a little) skills to play this theory.\nTrigonometry theory, play with sin() cos() and more. Pay attention to vartheta, it will slow down your theory when it gets bigger!', link: 'https://raw.githubusercontent.com/Skyhigh173/Theory/Offical-Release/MoreTheory/Trigonometry.js'},
    {name: 'Temperature Control Theory', author: 'Gaunter#7599', description: "Control Theory is a tool used in engineering to maintain a variable at a set value (known as the 'set point').\n\nTo make progress, you will need to disturb T to change rho.\nou will also need to grow the variable 'r', this grows faster when T is close to the setpoint, T_s.", link: 'https://raw.githubusercontent.com/lrobt97/Control-Theory/main/Control%20Theory.js'},
    {name: 'Cookie Idler', author: 'Sainen Lv.420#2684', description:"A game within a theory involving baking a copius amounts of cookies in exchange for something far greater...\n🍪==FEATURES==🍪\n🍪 Click, Bake, Farm, Produce your way into the big leagues. With 19 buildings to buy, empower, and upgrade.\n🍪 Experience a whole new level of text richness in theories like never before. Boatloads of text waiting to be read in all aspects, from the buildings, achievements, all the way to upgrades(nerdy mode included).\n🍪 Unique upgrades and intresting game mechanics will involve you to no end! Tasty Cookies, even tastier cookies, breaking the fourth wall, and changing the game itself.", link: 'https://raw.githubusercontent.com/KS-Sainen/Custom-Theory-Cookie-Idler/main/CookieIdler.js'},
    {name: 'Generating Functions', author: 'Solarion#4131', description: "One of your many students proposes an idea. At first, you are skeptical: you say, \"Are you really sure you can make something out of a possibly divergent series?\" They say to ignore the divergence and just do calculations. Despite thinking that they would be punished for such arrogance, you decided to give it a try, and the generating function was born. A generating function is a formal power series: it is in some ways similar to i. It is not always defined, but can still be used for calculations. For example, the sum of 1 + x + x^2 + x^3 + ... is equal to 1/(1-x) when x is between -1 and 1. We define the nth term of it 1/(1-x) as the coefficient of x^n, which here is always 1.", link: 'https://raw.githubusercontent.com/Solarion4131/Exponential-idle/main/Generating%20Functions.js'},
    {name: 'Theory Automator', author: 'rus9384#1864', description: "another useful theory.\nAutomates purchases and publications in theories.", link: 'https://raw.githubusercontent.com/rus9384/Theory-automator/main/Theory%20Automator.js'},
    {name: 'Fractional Integration', author: 'Gen#3006 SnaekySnacks#1161 XLII#0042', description: "he functions between a function and its derivative have many ways of being shown, this is one of them.\nFractional integration is a way to calculate what is between a function and its integral and is a smooth transition.\nAs such, as a fractional integral approaches 1, it should become the integral.", link: 'https://raw.githubusercontent.com/Gen1Code/Fractional-Integration/main/FI.js'},
    {name: 'Bin Packing', author: 'Gen#3006', description: "Pack as many Items as you can into Bins, each Bin has a set size.\nEach strategy tries to minimise the amount of Bins needed to store all the Items.", link: 'https://raw.githubusercontent.com/Gen1Code/Bin-Packing/main/BP.js'},
    {name: 'Permutations Derangement', author: 'Gen#3006', description: "A theory about the possible arrangements and derangements of objects.\nPermutations are the number of ways objects can be arranged as a different sequence, in this case a 'very' long string of text.\nDerangements are the number of ways all objects can be rearranged so that each object is not in its current position.\nNote: in this theory every object is treated as individually different for derangement (only the number of object matters, the types and amount in each of them doesn't).\n", link: 'https://raw.githubusercontent.com/Gen1Code/Permutations-Derangment/main/PD.js'},
    {name: 'TA-Overpush', author: 'Gen#3006', description: "Another automator theory.\nAutomates purchases and publications in theories.", link: 'https://raw.githubusercontent.com/Gen1Code/TA-Overpush/main/TA-Overpush.js'},
    {name: 'L-systems Renderer', author:'propfeds#5988', description: 'An educational tool that lets you draw various fractal figures and plants.\n\nFeatures:\n- Can store a whole army of systems!\n- Stochastic (randomised) systems\n- Switch between camera modes: fixed (scaled) and cursor-focused\n- Stroke options\n\nWarning: As of 0.18, the renderer\'s configuration will be messed up due to format changes to the internal state.', link: 'https://raw.githubusercontent.com/propfeds/L-systems-renderer/main/renderer.js'},
    {name: 'Goldbach\'s Conjecture', author:'GODofMEGANE', description: "ゴールドバッハ予想を使った理論ですnを二つの素数の和で表すことでnを増加させることができます出版は最初から購入可能なので直ぐに買おう\n\nA theory using the Goldbach conjecture.\nMoney can be increased by expressing \nn as the sum of two prime numbers.\nThe publication is available for purchase from the beginning.", link: 'https://raw.githubusercontent.com/GODofMEGANE/ExponentialIdle_CustomTheory/main/CustomTheory/GoldbachsConjecture.js'},
    {name: 'Probability Theory', author:'ducdat#0507 & Frozen Moon#7244', description: "A theory about random stuff. Featuring a randomized description generator, minigames, and some die rolling.\n\nTip of the day: The description of this theory will change every day! Or if I decide to update the description generator.\n(actually not here)", link: 'https://cdn.discordapp.com/attachments/969688918867988480/973566222295789569/ProbabilityTheory.js'},
    {name: 'Botched L-system', author:'propfeds#5988', description: "Your school's laboratory has decided to grow a fictional plant in the data room.\nBe careful of the implemented algorithms' limitations, else the database would slow down to a crawl, and eventually explode in a fatal ERROR.\n\nNote: the L-systems being drawn are of only level 4, instead of the actual size.", link: 'https://raw.githubusercontent.com/propfeds/botched-L-system/main/botched_L_system.js'},
    {name: 'Decay Theory', author:'soramame_256', description: "simple. Just a decay theory. What else did you exepect?", link: 'https://raw.githubusercontent.com/soramame0256/Exponential-Idle-Repo/master/Decay%20Theory.js'}
    //{name: '', author:'', description: "", link: ''}
];


var showCT = [];


function popupInfo(i){

    Sound.playClick();
    
    let desc = ui.createLabel({
        text:'\n' + showCT[i].description + '\n',
        horizontalOptions: LayoutOptions.CENTER,
        verticalOptions: LayoutOptions.CENTER,
        fontSize:16
    });

    let popupui = [
        ui.createProgressBar({progress: 0}),
        ui.createLabel({text: 'author',horizontalOptions: LayoutOptions.CENTER,fontSize:22}),
        ui.createLabel({text: showCT[i].author,horizontalOptions: LayoutOptions.CENTER}),
        ui.createProgressBar({progress: 0}),
        ui.createLabel({text: 'description',horizontalOptions: LayoutOptions.CENTER,fontSize:22}),
        ui.createFrame({heightRequest:100,cornerRadius:10,children:[ui.createScrollView({children:[desc]})]}),
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

    if (text == ''){
        showCT = cts;
        return;
    }

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

var getUIDelegate = () => {
    let scrV = ui.createScrollView({
        content: generateButton()
    });

    let rUI = () => ui.createStackLayout({
        children: [
            ui.createEntry({
                onTextChanged:function(old,newer){
                    filter(newer); 
                    scrV.content = generateButton();
                }
            }),
            scrV
        ]
    });

    return rUI();
}

filter('');