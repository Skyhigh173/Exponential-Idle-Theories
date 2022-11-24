import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";
import { ui } from "../api/ui/UI"
import { Sound } from "../api/UI/Sound"

var id = "CTB";
var name = "Custom Theory Browser";
var description = "version : alpha-test-v1\n\na \"ct\" that allows you to browse all other known cts.\nDM skyhigh173#3120 if you wants to add your own theory!\n\nFunFacts: idk how to de the search system!! So hard! take a look at my source code, lol";
var authors = "skyhigh173#3120";
var version = 1;

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
    {name: 'Cookie Idler', author: 'Sainen Lv.420#2684', description:"\nA game within a theory involving baking a copius amounts of cookies in exchange for something far greater...\n🍪==FEATURES==🍪\n🍪 Click, Bake, Farm, Produce your way into the big leagues. With 19 buildings to buy, empower, and upgrade.\n🍪 Experience a whole new level of text richness in theories like never before. Boatloads of text waiting to be read in all aspects, from the buildings, achievements, all the way to upgrades(nerdy mode included).\n🍪 Unique upgrades and intresting game mechanics will involve you to no end! Tasty Cookies, even tastier cookies, breaking the fourth wall, and changing the game itself.", link: 'https://raw.githubusercontent.com/KS-Sainen/Custom-Theory-Cookie-Idler/main/CookieIdler.js'},
    {name: 'Generating Functions', author: 'Solarion#4131', description: "One of your many students proposes an idea. At first, you are skeptical: you say, \"Are you really sure you can make something out of a possibly divergent series?\" They say to ignore the divergence and just do calculations. Despite thinking that they would be punished for such arrogance, you decided to give it a try, and the generating function was born. A generating function is a formal power series: it is in some ways similar to i. It is not always defined, but can still be used for calculations. For example, the sum of 1 + x + x^2 + x^3 + ... is equal to 1/(1-x) when x is between -1 and 1. We define the nth term of it 1/(1-x) as the coefficient of x^n, which here is always 1.", link: 'https://raw.githubusercontent.com/Solarion4131/Exponential-idle/main/Generating%20Functions.js'},
    {name: 'Theory Automator', author: 'rus9384#1864', description: "another useful theory.\nAutomates purchases and publications in theories.", link: 'https://raw.githubusercontent.com/rus9384/Theory-automator/main/Theory%20Automator.js'},
    {name: 'Fractional Integration', author: 'Gen#3006 SnaekySnacks#1161 XLII#0042', description: "he functions between a function and its derivative have many ways of being shown, this is one of them.\nFractional integration is a way to calculate what is between a function and its integral and is a smooth transition.\nAs such, as a fractional integral approaches 1, it should become the integral.", link: 'https://raw.githubusercontent.com/Gen1Code/Fractional-Integration/main/FI.js'},
    {name: 'Bin Packing', author: 'Gen#3006', description: "Pack as many Items as you can into Bins, each Bin has a set size.\nEach strategy tries to minimise the amount of Bins needed to store all the Items.", link: 'https://raw.githubusercontent.com/Gen1Code/Bin-Packing/main/BP.js'},
    {name: 'Permutations Derangement', author: 'Gen#3006', description: "A theory about the possible arrangements and derangements of objects.\nPermutations are the number of ways objects can be arranged as a different sequence, in this case a 'very' long string of text.\nDerangements are the number of ways all objects can be rearranged so that each object is not in its current position.\nNote: in this theory every object is treated as individually different for derangement (only the number of object matters, the types and amount in each of them doesn't).\n", link: 'https://raw.githubusercontent.com/Gen1Code/Permutations-Derangment/main/PD.js'},
    {name: 'TA-Overpush', author: 'Gen#3006', description: "Another automator theory.\nAutomates purchases and publications in theories.", link: 'https://raw.githubusercontent.com/Gen1Code/TA-Overpush/main/TA-Overpush.js'}
]
var showCT = []

function sound(){ Sound.playClick() }



function popupInfo(i){
    sound()
    
    let fix = ui.createLabel({text:'\n'})
    if (showCT[i].description.length > 100){
        fix = ui.createLabel({text:'\n\n\n\n\n'})
    }
    let result = ui.createPopup({
        title: showCT[i].name,
        content: ui.createStackLayout({
            children:[
                ui.createProgressBar({progress: 0}),
                ui.createLabel({text: 'author',horizontalOptions: LayoutOptions.CENTER,fontSize:22}),
                ui.createLabel({text: showCT[i].author,horizontalOptions: LayoutOptions.CENTER}),
                ui.createProgressBar({progress: 0}),
                ui.createLabel({text: 'description',horizontalOptions: LayoutOptions.CENTER,fontSize:22}),
                ui.createLabel({text:showCT[i].description,horizontalOptions: LayoutOptions.CENTER, verticalOptions: LayoutOptions.CENTER,fontSize:16}),
                ui.createProgressBar({progress: 0}),
                ui.createLabel({text:'link',horizontalOptions: LayoutOptions.CENTER,fontSize:22}),
                ui.createEntry({
                    text: showCT[i].link,
                    horizontalOptions: LayoutOptions.CENTER
                }),
                fix  //idk why the game popup is bugged
            ]
        })
    })
    result.show()
}
function filter(text){
    //log('filtered');
    if (text == ''){
        showCT = cts;
        return;
    }
    showCT = []
    for (let k = 0; k < cts.length;k++){
        if (cts[k].name.toUpperCase().indexOf(text.toUpperCase()) > -1){
            showCT.push(cts[k])
        }
    }
    //log('val = ' + JSON.stringify(showCT))
}
var generateButton = () => {
    result = []
    for (let i = 0; i < showCT.length; i++) {
        result.push(ui.createButton({text:showCT[i].name,fontSize:24, onClicked: function(){popupInfo(i)}}))
    }
    return ui.createStackLayout({children:result})
}

var UIS = () => {
    let rUI = ui.createStackLayout({
        children: [
            //ui.createEntry({onTextChanged:function(old,newer){filter(newer); tick();}}),
            ui.createScrollView({
                content: generateButton()
            })
        ]
    });
    return rUI;
}
filter('')
var getUIDelegate = () => UIS()
var tick = () => {
    getUIDelegate = function(){ return UIS() }
}