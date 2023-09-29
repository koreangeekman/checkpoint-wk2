// SECTION GLOBAL VARIABLES
let interrupts = 0;
let interruptsQueued = 0;

const clickUpgrades = [
  { // adds 'right-click' aka the second mouse button as an option - requires upgrades lvl 2
    ID: 'secondMouseBtn',
    name: 'Second Mouse Btn',
    cost: 16,
    qty: 1, // max of 1
    bonus: 1,
    lvl: 1,
    enabled: false
  },
  { // adds mouse button 3 - requires upgrades lvl 3
    ID: 'mouseBtn3',
    name: 'Mouse Btn 3',
    cost: 32,
    qty: 1, // max of 1
    bonus: 1,
    lvl: 1,
    enabled: false
  },
  { // adds mouse button 4  - requires upgrades lvl 4
    ID: 'mouseBtn4',
    name: 'Mouse Btn 4',
    cost: 64,
    qty: 1, // max of 1
    bonus: 1,
    lvl: 1,
    enabled: false
  },
  { // default scrolls 3 lines at a time... or just mouse button 3 - requires upgrades lvl 5
    ID: 'scrollWheel',
    name: 'Scroll Wheel',
    cost: 128,
    qty: 1, // max of 1
    bonus: 3,
    lvl: 1,
    enabled: false
  },
  {
    ID: 'gamerMouse',
    name: 'Gamer Mouse',
    cost: 256,
    qty: 1, // max of 1
    bonus: 12, // ALL the extra buttons!; does not get modified by level
  },
  {
    ID: 'mouseMovements',
    name: 'Capture Movements',
    cost: 65536,
    qty: 1, // max of 1
    bonus: 0, // aka false; disabled until purchased
    lvl: 1,
    enabled: false
  },
  {
    ID: 'mouseDPI',
    name: 'Increase DPI',
    cost: 8192,
    qty: 1, // max of 1
    bonus: 100, // default: 100, max: 32,000?; dependent on mouseMovements being TRUE; DPI doubles per level - secondary continual upgrade
    lvl: 1,
    enabled: false
  },
  {
    ID: 'additionalMice',
    name: 'Add a mouse',
    cost: 4096,
    qty: 1, // max of 127
    bonus: 1, // default:1, max 127; as a multiplier, duplicates the potential per mouse added! - primary continual upgrade
    lvl: 1,
    enabled: false
  }]

const autoUpgrades = [
  { // an actual mouse in a mouse wheel with a tab that clicks a computer mouse per rotation - levels add tabs to the wheel
    ID: 'mouseWheel',
    name: 'mouseWheel',
    cost: 69,
    qty: 1,
    bonus: 1,
    lvl: 1, // decreases interval in steps of 10ms? min 1ms; mouse running faster
    interval: 1000 // in ms
  }]
// !SECTION GLOBAL VARIABLES

// SECTION FUNCTIONS

// primary 'resource' gathering method
// example object contents
// {
//   name: 'secondMouseBtn',
//   cost: 16,
//   qty: 1, // max of 1
//   bonus: 1,
//   lvl: 1,
//   enabled: false
// }
function interrupt() {
  let interruptSubtotal = 1;
  clickUpgrades.forEach(upgrade => {
    let upgradeSubtotal = 1;
    if (upgrade.enabled) {
      interruptSubtotal += upgradeSubtotal * upgrade.bonus * upgrade.qty * upgrade.lvl
    }
  })
  interrupts += interruptSubtotal;
  interruptsQueued += interruptSubtotal;
  drawALL()
}

function buyClickUpgrade(upgradeName, cost) {

}

function formatClickUpgradeMenu() {
  let clickMenuHTML = `
      <div class="blueBG rounded p-1">
        <p class="fs-5 text-center">Click Upgrades</p>
  `;
  clickUpgrades.forEach(upgrade => {
    clickMenuHTML += `
          <span class="d-flex justify-content-between btn text-white">
            <p onclick="buyClickUpgrade(${upgrade.ID},${upgrade.cost})">${upgrade.name}: </p>
            <p>${upgrade.cost}</p>
          </span>
    `
  });
  clickMenuHTML += `
      </div>
  `
  document.getElementById('buyMenu').innerHTML += clickMenuHTML
}

function formatAutoUpgradeMenu() {
  let autoMenuHTML = `
      <div class="blueBG rounded p-1 mt-3">
        <p class="fs-5 text-center">Auto Upgrades</p>
  `;
  autoUpgrades.forEach(upgrade => {
    autoMenuHTML += `
          <span class="d-flex justify-content-between btn text-white">
            <p onclick="buyClickUpgrade(${upgrade.ID},${upgrade.cost})">${upgrade.name}: </p>
            <p>${upgrade.cost}</p>
          </span>
    `
  });
  autoMenuHTML += `
        </div>
  `
  document.getElementById('buyMenu').innerHTML += autoMenuHTML
}

function drawMenus() {
  document.getElementById('buyMenu').innerHTML = ""
  formatClickUpgradeMenu()
  formatAutoUpgradeMenu()
}

function drawStats() {
  console.log('boop')
}

function drawGrandTotal() {
  document.getElementById('grandTotal').innerText = interrupts;
}

function drawALL() {
  drawStats()
  drawMenus()
  drawGrandTotal()
}

// init draw
drawALL()