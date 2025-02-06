import { Color } from "../api/ui/properties/Color";
import { LayoutOptions } from "../api/ui/properties/LayoutOptions";
import { TouchType } from "../api/ui/properties/TouchType";

var id = "distribution_checker";
var name = "Theory Distribution Checker";
var description = "convient tools for sim. WARNING: tau does not include custom theories'.";
var authors = "skyhigh173";
var version = 1;

var displayMode = 0; // percentage ~ value
var includeSigma = true;

var getTheoryTau = (id) => game.theories[id].tau;

var theoryID = [0,1,2,3,4,5,6,7];

var getTheoryDisplay = (id) => displayMode ? getTheoryTau(id).toString(4) : `${(BigNumber.from(100) * (getTheoryTau(id).max(1).log10() / game.tau.log10())).toString(2)}%`;

var getQuaternaryEntries = () => theoryID.map(i => new QuaternaryEntry(`\\tau_${i+1}`, getTheoryDisplay(i)));

var getPrimaryEquation = () => `\\tau = ${game.tau.toString(4)}`;

var tick = (_, __) => {
  theory.invalidateQuaternaryValues();
}

// must be used in grid
var getTriangleSize = (mode) => mode ? Math.sqrt(2 * Math.pow(getTriangleSize(0), 2)) : 10 * ui.screenHeight / 844;
var getSmallTriangle = () => [
  // another black magic to create triangle (tm)
  // TODO fix translate XY on different devices
  ui.createBox({ row: 0, widthRequest: getTriangleSize(0), minimumWidthRequest: getTriangleSize(0), heightRequest: getTriangleSize(0), minimumHeightRequest: getTriangleSize(0), horizontalOptions: LayoutOptions.START, verticalOptions: LayoutOptions.START }),
  ui.createBox({ row: 0, widthRequest: getTriangleSize(1), minimumWidthRequest: getTriangleSize(1), heightRequest: getTriangleSize(1), minimumHeightRequest: getTriangleSize(1), horizontalOptions: LayoutOptions.START, verticalOptions: LayoutOptions.START, rotation: 45, translationX: 3.8, translationY: 3.8, backgroundColor: Color.MEDIUM_BACKGROUND }),
];

var createBtn = (tri, textUp, textDown, onTouch, override) => ui.createFrame(Object.assign({
  children: [
    ui.createGrid({
      verticalOptions: LayoutOptions.CENTER,
      rowDefinitions: ['2*','2*'],
      heightRequest: 55 * ui.screenHeight / 844,
      children: [
        ...(tri ? getSmallTriangle() : []),
        ui.createLatexLabel({ verticalOptions: LayoutOptions.END, horizontalOptions: LayoutOptions.CENTER, text: textUp, row: 0 }),
        ui.createLatexLabel({ verticalOptions: LayoutOptions.START, horizontalOptions: LayoutOptions.CENTER, text: textDown, row: 1 })
      ],
    })
  ],
  onTouched: (e) => {
    if (e.type === TouchType.SHORTPRESS_RELEASED || e.type == TouchType.LONGPRESS_RELEASED) {
      onTouch();
      Sound.playClick();
    }
  }
}, override ?? {}));

var mainUI = ui.createStackLayout({
  margin: new Thickness(5, 5, 5, 0),
  children: [
    createBtn(true, '\\textbf{Display}', () => displayMode ? 'Value' : 'Percentage', () => displayMode = 1 - displayMode),
    ui.createBox({ heightRequest: 2 }),
    ui.createLatexLabel({ text: 'Copy the $\\tau$ distribution to the simulator, or other places.', fontSize: 10, textColor: Color.TEXT_MEDIUM, horizontalOptions: LayoutOptions.CENTER }),
    ui.createEntry({ text: '', fontSize: 9, horizontalTextAlignment: TextAlignment.CENTER }),
    ui.createGrid({
      columnDefinitions: ['1*','1*'],
      children: [
        createBtn(true, '\\textbf{Include \\sigma}', () => includeSigma ? 'On' : 'Off', () => { includeSigma = !includeSigma; updateEntry(); }, {column: 0}),
        createBtn(false, '\\textbf{Refresh}', 'Execute', () => updateEntry(), {column: 1})
      ]
    })
  ]
});

var getUpgradeListDelegate = () => mainUI;

var updateEntry = () => {
  let text = '';
  if (includeSigma) text += Math.floor(game.sigmaTotal) + ' ';  // how can sigmaTotal return float??
  for (let i = 0; i < 7; i++)
    text += getTheoryTau(i) + ' ';

  mainUI.children[3].text = text;
}

updateEntry();