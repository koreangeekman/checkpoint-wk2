// SECTION GLOBAL VARIABLES
let interrupts = 0;
let interruptsQueued = 0;
let interruptsProcessed = 0;
let interruptCallRate = 0;

const clickUpgrades = [
  { // adds 'right-click' aka the second mouse button as an option - requires upgrades lvl 2
    ID: 'secondMouseBtn',
    name: 'Second Button',
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
    ID: 'mouseMovements',
    name: 'Capture Movements',
    cost: 65536,
    qty: 1, // max of 1
    bonus: 0, // mouseDPI disabled until purchased
    lvl: 1,
    enabled: false
  },
  {
    ID: 'additionalMice',
    name: 'Add a mouse',
    cost: 4096,
    qty: 0, // max of 127
    bonus: 1, // default:1, max 127; as a multiplier, duplicates the potential per mouse added! - primary continual upgrade
    lvl: 1,
    enabled: false
  }]

const autoUpgrades = [
  { // an actual mouse in a mouse wheel with a tab that clicks a computer mouse per rotation - levels add tabs to the wheel
    ID: 'mouseWheel',
    name: 'Mouse Wheel',
    cost: 69,
    qty: 1,
    bonus: 2, // dependent on original mouse upgrades
    lvl: 1, // decreases interval in steps of 10ms? min 1ms; mouse running faster
    interval: 2000, // in ms
    enabled: false
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
    if (upgrade.enabled) {
      interruptSubtotal += upgrade.bonus * upgrade.qty * upgrade.lvl
    }
  })
  addInterrupts(interruptSubtotal);
  drawALL()
}

function buyClickUpgrade(upgradeID) {
  clickUpgrades.find(upgrade => {

    if (upgrade.ID == upgradeID) {
      if (interruptsQueued >= upgrade.cost && !upgrade.enabled) {
        interruptsProcessed += upgrade.cost;
        interruptsQueued -= upgrade.cost
        upgrade.enabled = true;

        if (upgradeID != 'mouseDPI' && upgradeID != 'additionalMice') {
          markCheckbox(upgradeID);
        }

        if (upgradeID == 'mouseMovements') {
          document.getElementById('mouseDPI').classList.remove('d-none');
          clickUpgrades.find(dpi => dpi.ID == 'mouseDPI' ? dpi.enabled = true : console.log('dpiFIND'))
          // a better way to do this? accessing another object from the same list via find while it's already parsing through it instead of initiating another
        }
      }
    }

    if (upgrade.ID == upgradeID && upgrade.ID == 'mouseDPI' && upgrade.enabled) {
      spendInterrupts(upgrade.cost);
      upgrade.cost *= 2;
      upgrade.bonus *= 2;
    }

    if (upgrade.ID == upgradeID && upgrade.ID == 'additionalMice' && upgrade.enabled) {
      spendInterrupts(upgrade.cost);
      upgrade.cost *= 2;
      upgrade.qty++
    }

  })
  drawALL()
}

function markCheckbox(upgradeID) {
  const upgradeDOM = document.getElementById(upgradeID)
  upgradeDOM.querySelector('i').classList.add('d-none')
  upgradeDOM.querySelectorAll('i')[1].classList.remove('d-none')
}

function unmarkCheckboxes(upgradeID) { // to be part of a game reset
  const upgradeDOM = document.getElementById(upgradeID)
  upgradeDOM.querySelector('i').classList.remove('d-none')
  upgradeDOM.querySelectorAll('i')[1].classList.add('d-none')
}

function buyAutoUpgrade(upgradeID) {
  autoUpgrades.find(upgrade => {
    if (upgrade.ID == upgradeID) {
      if (interruptsQueued >= upgrade.cost && upgrade.enabled) {
        spendInterrupts(upgrade.cost)
        upgrade.qty++
        // upgrade.bonus *= 2; // when lvl is adjusted
        if (upgrade.qty == 2) {
          upgrade.cost = 1024;
        } else {
          upgrade.cost *= 2;
        }
        let bonus = upgrade.bonus * upgrade.qty * upgrade.lvl;
        setInterval(autoMouseWheel, upgrade.interval, bonus)
      }
      if (interruptsQueued >= upgrade.cost && !upgrade.enabled) {
        spendInterrupts(upgrade.cost)
        upgrade.enabled = true;
        upgrade.cost = 420;
        let bonus = upgrade.bonus * upgrade.qty * upgrade.lvl;
        autoMouseWheel(bonus)
        setInterval(autoMouseWheel, upgrade.interval, bonus)
        document.getElementById('mouseWheel').classList.remove('d-none')
      }
    }
  })
  drawALL()
}

function autoMouseWheel(bonus) {
  console.log('initiated auto mouse wheel')
  addInterrupts(bonus)
  drawALL();
}

function formatClickUpgradeMenu() {
  let clickMenuHTML = `
      <div class="blueBG rounded p-1" id="clickMenu">
        <p class="fs-5 text-center">Click Upgrades</p>
  `;
  clickUpgrades.forEach(upgrade => {
    clickMenuHTML += `
          <span onclick="buyClickUpgrade('${upgrade.ID}')" class="d-flex justify-content-between align-items-center btn text-white ${!upgrade.enabled && upgrade.ID == 'mouseDPI' ? 'd-none' : ''} ${interruptsQueued < upgrade.cost ? 'disabled' : ''} ${upgrade.enabled && upgrade.ID != 'mouseDPI' && upgrade.ID != 'additionalMice' ? 'd-none' : ''}">
            <p>${upgrade.name}: </p>
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
      <div class="blueBG rounded p-1 mt-3" id="autoMenu">
        <p class="fs-5 text-center">Auto Upgrades</p>
  `;
  autoUpgrades.forEach(upgrade => {
    autoMenuHTML += `
          <span onclick="buyAutoUpgrade('${upgrade.ID}')" class="d-flex justify-content-between btn text-white ${interruptsQueued >= upgrade.cost ? 'enabled' : 'disabled'}">
            <p>${upgrade.name}: </p>
            <p>${upgrade.cost}</p>
          </span>
    `
  });
  autoMenuHTML += `
        </div>
  `
  document.getElementById('buyMenu').innerHTML += autoMenuHTML
}

function calcCallRate() {
  interruptCallRate = 0;
  calcClickRate();
  calcAutoRate();
  addMouse();
}

function calcClickRate() {
  let rate = 1;
  clickUpgrades.forEach(upgrade => {
    if (upgrade.enabled == true) {
      rate += upgrade.bonus * upgrade.qty * upgrade.lvl;
    }
  });
  interruptCallRate += rate;
  document.getElementById('interruptCallRatePerClick').innerHTML = `${rate} |`;
}

function calcAutoRate() {
  let rate = 0;
  autoUpgrades.forEach(upgrade => {
    if (upgrade.enabled == true) {
      rate += upgrade.bonus * upgrade.qty * upgrade.lvl;
    }
  });
  interruptCallRate += rate;
  document.getElementById('interruptCallRateAuto').innerHTML = `${rate} |`;
}

function addMouse() {
  let mouseBonus = 1;
  clickUpgrades.forEach(upgrade => {
    upgrade.enabled && upgrade.ID != 'additionalMice' && upgrade.ID != 'mouseMovements' ? mouseBonus += upgrade.bonus * upgrade.qty * upgrade.lvl : null;
  })
  clickUpgrades.find(upgrade => upgrade.ID == 'additionalMice' ? upgrade.bonus = mouseBonus : null)
}

function addInterrupts(cost) { // adding to global vars for both counters
  interrupts += cost; // GRAND TOTAL of interrupts sent
  interruptsQueued += cost; // currently available interrupts to spend
}

function spendInterrupts(cost) { // removes from available currency and adds to spent amount
  interruptsProcessed += cost;
  interruptsQueued -= cost
}

function drawMenus() {
  document.getElementById('buyMenu').innerHTML = ""
  formatClickUpgradeMenu()
  formatAutoUpgradeMenu()
}

function drawStats() {
  calcCallRate()
  document.getElementById('totalInterruptsSent').innerHTML = `${interrupts} |`;
  document.getElementById('interruptsQueued').innerHTML = `${interruptsQueued} |`;
  document.getElementById('interruptsProcessed').innerHTML = `${interruptsProcessed} |`;
}

function drawUpgrades() {
  const addedMice = document.getElementById('additionalMice').innerText;
  clickUpgrades.find(upgrade => {
    if (upgrade.ID == 'additionalMice') {
      document.getElementById('numberOfMice').innerText = upgrade.qty;
      document.getElementById('bonusPerMouse').innerText = upgrade.bonus;
      document.getElementById('bonusMiceClickTotal').innerText = upgrade.qty * upgrade.bonus;
    }
    if (upgrade.ID == 'mouseDPI') {
      document.getElementById('mouseDPIRate').innerText = upgrade.bonus;
    }
  })
  autoUpgrades.find(upgrade => {
    if (upgrade.ID = 'mouseWheel') {
      document.getElementById('mouseWheelLVL').innerText = `L${upgrade.lvl}`;
      document.getElementById('mouseWheelQTY').innerText = `x${upgrade.qty}`;
      // document.getElementById('mouseWheelRate').innerText = `Rate @ ${upgrade.bonus}`;
    }
  })
}

function drawALL() {
  drawMenus();
  drawStats();
  drawUpgrades();
}

// init draw
drawALL()