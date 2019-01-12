// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import {
    default as Web3
} from 'web3'
import {
    default as contract
} from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import StarNotaryArtifact from '../../build/contracts/StarNotary.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const StarNotary = contract(StarNotaryArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let me
let instance

const App = {
    start: async () => {
        StarNotary.setProvider(web3.currentProvider)
        me = web3.eth.accounts[0];
        instance = await StarNotary.deployed()
    },
    createStar: async () => {
        document.getElementById('status').innerHTML = 'Loading...';
        const name = document.getElementById("starName").value;
        const id = document.getElementById("starId").value;
        await instance.createStar(name, id, {from: me});
        document.getElementById('status').innerHTML = "New Star Owner is <mark>" + me + "</mark>.";
    },
    lookUpStar: async () => {
        document.getElementById('star').innerHTML = 'Loading...';
        const starId = document.getElementById("starIdCheck").value;
        let token = await instance.tokenIdToStarInfo.call(parseInt(starId));
        document.getElementById('star').innerHTML = token;
    }
}

window.App = App

window.addEventListener('load', () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider)
    } else {
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
    }
    App.start(window.web3)
})
