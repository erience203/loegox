import { useEffect, useState } from "react";
import axios from 'axios';
import { useWeb3React } from "@web3-react/core";
import { Modal, Form, Table, Card, InputGroup, FormControl } from 'react-bootstrap';
import { toast } from 'wc-toast';
import InnerHeader from "./Inner-Header";
import { bnb_rate, btc_rate, eth_rate, usdt_rate, matic_rate, current_phase, total_phase, completed_phase, price_of, token_recevied, total_amount, phase_total_sale } from './Price';
import { BEP_USDT, ERC_USDT, CRONOS_USDT, BNB, ETH, MATIC, BEP_BTC, ERC_BTC, getTokenContract } from './constant';
import { setupNetwork } from "../helper/connectors";
import copy from 'copy-text-to-clipboard';
const {    parseUnits, parseEther } = require("@ethersproject/units");
var qs = require('qs');


const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
};

const api_url = "https://legox.xyz/test/";

const Presale = () => {
    const context = useWeb3React();
    const { library, account, chainId } = context;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [amount, setAmount] = useState(0);
    // const [currency, setCurrency] = useState(0);
    const [rate, setRate] = useState(usdt_rate);
    const [recevicedtoken, setRecevicedtoken] = useState(0);
    const [contract, setContract] = useState(BEP_USDT);
    const [istransfer, setIstransfer] = useState(2);
    const [selectchain, setSelectchain] = useState(56);
    const [type, setType] = useState("BEP_USDT");
    const [transactionhistory, setTransactionhistory] = useState([]);
    const [userbuysum, setUserbuysum] = useState(0);
    const [userefsum, setUserrefsum] = useState(0);
    const [successTx, setSuccessTx] = useState(new Date());
    const [referrallink, setReferrallink] = useState('connect to wallet');
    const [totalsale, setTotalsale] = useState('0%')
    const [refaddress, setRefaddress] = useState('')
    const [totalSaleToken, setTotalSaleToken] = useState('')
    const [referralusd, setReferralusd] = useState(0)
    const [purchasedusd, setPurchasedusd] = useState(0)
    const [refinputshow, setRefinputshow] = useState(false)


    const handleCurrencyChange = (e) => {
        // setCurrency(e.target.value)
        if (e.target.value === 'usdt_bep') {
            setRate(usdt_rate);
            setRecevicedtoken((parseFloat(amount * usdt_rate)).toFixed(4));
            setContract(BEP_USDT);
            setIstransfer(2);
            setSelectchain(97);
            setType("BEP_USDT");
        }
        else if (e.target.value === 'usdt_erc') {
            setRate(usdt_rate);
            setRecevicedtoken((parseFloat(amount * usdt_rate)).toFixed(4));
            setContract(ERC_USDT);
            setIstransfer(2);
            setSelectchain(3);
            setType("ERC_USDT");
        }
        else if (e.target.value === 'usdt_cronos') {
            setRate(usdt_rate);
            setRecevicedtoken((parseFloat(amount * usdt_rate)).toFixed(4));
            setContract(CRONOS_USDT)
            setIstransfer(2);
            setSelectchain(338);
            setType("CRONOS_USDT");
        }
        else if (e.target.value === 'bnb') {
            setRate(bnb_rate);
            setRecevicedtoken((parseFloat(amount * bnb_rate)).toFixed(4));
            setContract(BNB);
            setIstransfer(1);
            setSelectchain(97);
            setType("BNB");
        }
        else if (e.target.value === 'matic') {
            setRate(matic_rate)
            setRecevicedtoken((parseFloat(amount * matic_rate)).toFixed(4));
            setContract(MATIC);
            setIstransfer(1);
            setSelectchain(80001);
            setType("MATIC");
        }
        else if (e.target.value === 'btc_erc') {
            setRate(btc_rate)
            setRecevicedtoken((parseFloat(amount * btc_rate)).toFixed(4));
            setContract(ERC_BTC)
            setIstransfer(2);
            setSelectchain(3);
            setType("ERC_BTC");

        }
        else if (e.target.value === 'btc_bep') {
            setRate(btc_rate)
            setRecevicedtoken((parseFloat(amount * btc_rate)).toFixed(4));
            setContract(BEP_BTC);
            setIstransfer(2);
            setSelectchain(97);
            setType("BEP_BTC");
        }
        else if (e.target.value === 'eth') {
            setRate(eth_rate)
            setRecevicedtoken((parseFloat(amount * eth_rate)).toFixed(4));
            setContract(ETH);
            setIstransfer(1);
            setSelectchain(3);
            setType("ETH");
        }
        else {
            setRate(usdt_rate)
            setRecevicedtoken(0);
            setContract(BEP_USDT);
            setIstransfer(2);
            setSelectchain(97);
        }
    }

    const handleBuyLegox = async () => {
        // try {
        if (account && chainId) {
            let args;
            let balance = await library.getBalance(account);
            let ref_address = '';
            balance = balance.toString() / Math.pow(10, 18);

            if (typeof amount !== 'undefined' && amount > 0) {
                if (selectchain === chainId) {
                    var url = window.location.href;
                    var split_url = url.split("/");
                    var ref = split_url[split_url.length - 1];
                    if (typeof ref.search("ref") === "number") {
                        var address = ref.toString().slice(-42);
                        ref_address = address;
                    }

                    if (istransfer === 1) {
                        if (contract && typeof contract.recevier !== 'undefined') {
                            if (parseFloat(balance) > 0 && parseFloat(balance) > parseFloat(amount)) {
                                let provider = library.getSigner()
                                await provider.sendTransaction({
                                    "to": contract.recevier,
                                    "value": parseUnits(amount)
                                }).then(async (result) => {
                                    if (result) {
                                        toast.success(`Transaction create successfully!`)
                                        args = {
                                            "fromAddress": result.from,
                                            "toAddress": contract.recevier,
                                            "hash": result.hash,
                                            "amount": amount,
                                            "type": type,
                                            "refAddress": ref_address,
                                            "receviedToken": parseFloat(recevicedtoken),
                                            "remarks": JSON.stringify(result),
                                            "status": 2
                                        }

                                        let saveTx = await axios.post(`${api_url}insert-address.php`, qs.stringify(args), headers);
                                        if (saveTx) {
                                            var interval = setInterval(async function () {
                                                var receipt = await library.getTransactionReceipt(result.hash);
                                                if (receipt != null) {
                                                    clearInterval(interval)
                                                    if (receipt.status === 1) {
                                                        toast.success(`Last Transaction is Successfull !`);
                                                        setSuccessTx(new Date());
                                                    }
                                                    else if (receipt.status === 2) {
                                                        toast.error('Last Transaction is failed!')
                                                    }
                                                    else {
                                                        toast.error('Last Transaction is failed!')
                                                    }
                                                }
                                            }, 5000);
                                        }

                                    }
                                }).catch((err) => {
                                    toast.error(err.message);
                                });
                            }
                            else {
                                toast.error('Insufficient funds for transaction cost!')
                            }

                        }
                        else {
                            toast.error('Internal server error!');
                        }

                    }
                    else if (istransfer === 2) {
                        if (contract && typeof contract.token !== 'undefined' && typeof contract.recevier !== 'undefined' && typeof contract.decimal !== 'undefined') {

                            let token_contract = await getTokenContract(contract.token, library.getSigner());
                            let token_balance = await token_contract.balanceOf(account);
                            token_balance = token_balance.toString() / Math.pow(10, contract.decimal);
                            if (parseFloat(token_balance) > 0 && parseFloat(token_balance) > parseFloat(amount)) {


                                let value = parseEther(amount);
                                token_contract.transfer(contract.recevier, value.toString())
                                    .then(async (result) => {
                                        toast.success(`Transaction create successfully!`)
                                        if (result) {
                                            args = {
                                                "fromAddress": result.from,
                                                "toAddress": contract.recevier,
                                                "hash": result.hash,
                                                "amount": amount,
                                                "type": type,
                                                "refAddress": ref_address,
                                                "receviedToken": parseFloat(recevicedtoken),
                                                "remarks": JSON.stringify(result),
                                                "status": 2
                                            }

                                            let saveTx = await axios.post(`${api_url}insert-address.php`, qs.stringify(args), headers);
                                            if (saveTx) {
                                                var interval = setInterval(async function () {
                                                    var receipt = await library.getTransactionReceipt(result.hash);
                                                    if (receipt != null) {
                                                        clearInterval(interval)
                                                        if (receipt.status === 1) {
                                                            toast.success(`Last Transaction is Successfull !`);
                                                            setSuccessTx(new Date());
                                                        }
                                                        else if (receipt.status === 2) {
                                                            toast.error('Last Transaction is failed!')
                                                        }
                                                        else {
                                                            toast.error('Last Transaction is failed!')
                                                        }
                                                    }
                                                }, 5000);
                                            }
                                        }
                                    })
                                    .catch((err) => {
                                        toast.error(err.message);
                                    })
                            }
                            else {
                                toast.error('Insufficient funds for transaction cost!')
                            }
                        }
                    }
                    else {
                        toast.error('Please Try Again !');
                    }
                }
                else {
                    setupNetwork(selectchain)
                }
            }
            else {
                toast.error('Enter amount must be greater than zero !');
            }
        }
        else {
            toast.error('please connect to wallet!');
        }
        // }
        // catch (err) {
        //     toast.error(err.message);
        // }

    }

    const handleMaxAmount = async () => {
        try {
            if (account && chainId && library) {
                if (istransfer === 2) {
                    let token_contract = await getTokenContract(contract.token, library.getSigner());
                    let token_balance = await token_contract.balanceOf(account);
                    token_balance = token_balance.toString() / Math.pow(10, contract.decimal);
                    setAmount(token_balance);
                    setRecevicedtoken((parseFloat(rate * token_balance)).toFixed(4));
                }
                else {
                    let balance = await library.getBalance(account);
                    balance = balance.toString() / Math.pow(10, 18);
                    setAmount(balance);
                    setRecevicedtoken((parseFloat(rate * balance)).toFixed(4));
                }
            }
            else {
                toast.error('connect to wallet!');
            }
        }
        catch (err) {
            toast.error(err.message);
        }
    }

    const handleChangeAmount = (e) => {
        setAmount(e.target.value);
        setRecevicedtoken((parseFloat(rate * e.target.value)).toFixed(4));

    }

    useEffect(() => {
        async function checkAddress() {
            if (typeof account !== 'undefined' && account !== '') {
                setReferrallink(`${window.location.origin}?ref=${account}`);

                try {
                    let args = { address: account }
                    let saveTx = await axios.post(`${api_url}check-address.php`, qs.stringify(args), headers);

                    if (saveTx) {
                        if (typeof saveTx.data !== 'undefined') {
                            if (saveTx.data.error === 'OK') {
                                let result = saveTx.data.data;
                                if (result.length > 0) {
                                    setTransactionhistory(result);
                                    let sum = 0;
                                    result.forEach(value => {
                                        if (value.status === '1') {
                                            sum += parseFloat(value['receviedToken']);
                                        }
                                    });
                                    setUserbuysum(new Intl.NumberFormat('ja-JP', { maximumSignificantDigits: 3 }).format((sum)))
                                    setPurchasedusd(new Intl.NumberFormat('ja-JP', { maximumSignificantDigits: 3 }).format((sum / usdt_rate)));
                                }
                            }
                            else {
                                toast.error(saveTx.data.error)
                            }
                        }
                        else {
                            toast.error('Internal server error!');
                        }
                    }
                    else {
                        toast.error('Internal server error!');
                    }
                }
                catch (err) {
                    toast.error(err.message)
                }
            }
        }
        checkAddress();

    }, [account, successTx]);

    useEffect(() => {
        async function totalsaletoken() {
            try {
                var url = window.location.href;
                var split_url = url.split("/");
                var ref = split_url[split_url.length - 1];
                if (typeof ref.search("ref") === "number") {
                    var address = ref.toString().slice(-42);
                    setRefaddress(address);
                    setRefinputshow(true);
                }

                let saveTx = await axios.get(`${api_url}total-sale-token.php`, headers);

                if (saveTx) {
                    if (typeof saveTx.data !== 'undefined') {
                        if (saveTx.data.error === 'OK') {
                            let a = phase_total_sale !== 'undefined' ? parseFloat((saveTx.data.data / phase_total_sale) * 100).toFixed(3) : 0;
                            let total_token_sale = new Intl.NumberFormat('ja-JP', { maximumSignificantDigits: 3 }).format(saveTx.data.data)
                            setTotalSaleToken(total_token_sale)
                            setTotalsale(`${a}%`);


                        }
                        else {
                            toast.error(saveTx.data.error)
                        }
                    }
                    else {
                        toast.error('Internal server error!');
                    }
                }
                else {
                    toast.error('Internal server error!');
                }
            }
            catch (err) {
                toast.error(err.message)
            }
        }
        totalsaletoken();
    }, [])
    
    useEffect( () => {
        async function getuserref() {
            if (typeof account !== 'undefined' && account !== '') {
                try {
                    let args = { address: account }
                    let saveTx = await axios.post(`${api_url}get-user-ref.php`, qs.stringify(args), headers);
                    if (saveTx) {
                        if (typeof saveTx.data !== 'undefined') {
                            if (saveTx.data.error === 'OK') {
                                let result = saveTx.data.data;
                                if (result.length > 0) {
                                    let sum = 0;
                                    result.forEach(value => {
                                        if (value.status === '1') {
                                            sum += parseFloat(value['receviedToken']);
                                        }
                                    });
                                    setUserrefsum(new Intl.NumberFormat('ja-JP', { maximumSignificantDigits: 3 }).format((sum)));
                                    setReferralusd(new Intl.NumberFormat('ja-JP', { maximumSignificantDigits: 3 }).format((sum / usdt_rate)));
                                }
                            }
                            else {
                                toast.error(saveTx.data.error)
                            }
                        }
                        else {
                            toast.error('Internal server error!');
                        }
                    }
                    else {
                        toast.error('Internal server error!');
                    }
                }
                catch (err) {
                    toast.error(err.message)
                }
            }
        }
        getuserref();

    }, [account, successTx])

    const copyRefLink = (e) => {
        e.preventDefault();
        copy(referrallink);
        toast.success('copy');
    }

    
    return (
        <>
            <InnerHeader />
            <wc-toast></wc-toast>

            <section className="darkblue ptb-200">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <div className="text-center mb-5 legox-title">
                                <p><span className="">While LEGOx NFTs grant you citizenship rights in the LEGOx Republic,</span><br /> <span className="phase-color ">$LEGOx</span> is the official currency of the LEGOx. <br />You can read our whitepaper on main website. </p>
                            </div>
                        </div>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-sm-12 col-md-12 col-lg-6">

                            <div className="calculator">
                                <div className="calculator-bx left-calculator">
                                    <h4 className="text-left">Launchpad <span className="phase-color">Phase {current_phase}/{total_phase}</span> is Live !</h4>
                                    <div className="text-left  text-white text-xl mt-10">
                                        <span className="mr-2">Price =</span>
                                        <span className="text-yellow ml-2 mr-2 whitespace-nowrap">${price_of}</span>
                                        <span className="mr-2">per</span>
                                        <span className="text-yellow">{token_recevied}</span>
                                        <span className="text-yellow ml-2">$LEGOx</span>
                                    </div>
                                    <p className="text-left  text-xl text-yellow mt-4 mb-4">{completed_phase} phases completed </p>
                                    <div className="progress" style={{ "height": "40px" }}>
                                        <div className="progress-bar bg-warning" role="progressbar" style={{ "width": totalsale }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <div className="mt-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <p>{totalSaleToken}</p>
                                                <p>$LEGOx</p>
                                            </div>
                                            <div>
                                                <p>{total_amount}</p>
                                                <p>$LEGOx</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xl mt-5 price-text">
                                        <span className="purchased-cont text-left">Your Purchased $LEGOx = </span>
                                        <span className="text-yellow text-3xl mr-5">{userbuysum} (${purchasedusd})</span>

                                    </p>
                                    <p className="text-white text-xs mt-4 price-text">
                                        <span className="purchased-cont text-left"> Your earned $LEGOx from referral = </span>
                                        <span className="text-yellow text-xl">{userefsum} (${referralusd}) </span>
                                    </p>
                                    <div className="text-center btn-width mt-5">
                                        <button className="btn btn-primary" onClick={(e) => handleShow(e)}>Copy your unique referral link</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6">
                            <div className="calculator">
                                <div className="calculator-bx">
                                    <h4>$LEGOx - ICO Pad</h4>
                                    {/* <ul className="total-profit clearfix">
                                        <li>LEGOX</li>
                                        <li id="token_apy_balance">0</li>
                                    </ul> */}
                                    <div className="d-flex justify-content-between align-items-center mb-2 buy-btn">
                                        <div>
                                            <span>Buy</span>
                                        </div>
                                        <div>
                                            <button className="lego-button" onClick={handleMaxAmount} type="button" id="button-addon2">Max</button>
                                        </div>
                                    </div>
                                    <div className="input-space">
                                        <div className="input-group mb-3">

                                            <div className="input-group-append">

                                            </div>
                                            <div className="input-group-prepend align-items-center">
                                                {/* <span className="input-group-text">
                                                BNB
                                                </span> */}
                                                <input type="text" className="form-control" onChange={(e) => handleChangeAmount(e)} name="amount" value={amount} aria-label="Enter Amount" />
                                                <div className="dropdown bnb-btn">
                                                    <Form.Select size="sm" className="btn btn-secondary" onChange={(e) => handleCurrencyChange(e)}>
                                                        <option value="usdt_bep">USDT (BEP-20)</option>
                                                        <option value="usdt_erc" >USDT (ERC-20)</option>
                                                        <option value="usdt_cronos" >USDT (Cronos)</option>
                                                        <option value="bnb" >BNB (BEP-20)</option>
                                                        <option value="matic" >MATIC (Polygon)</option>
                                                        <option value="btc_erc" >BTC (ERC-20)</option>
                                                        <option value="btc_bep" >BTC (BEP-20)</option>
                                                        <option value="eth">ETH (ERC-20)</option>
                                                    </Form.Select>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-2 buy-btn">
                                        <div>
                                            <span>Get</span>
                                        </div>

                                    </div>
                                    <div className="input-group-prepend align-items-center input-space">
                                        {/* <span className="input-group-text">
                                                BNB
                                                </span> */}
                                        <input type="text" className="form-control" aria-label="Enter Amount" placeholder="0.00" readOnly="readonly" value={recevicedtoken} />
                                        <div className="bnb-btn">
                                            <button className="lego-button" type="button"  >
                                                $LEGOx
                                            </button>
                                        </div>

                                    </div>
                                    <div className="my-4 select-refrral">
                                        <div className="form-check">
                                            <input className="form-check-input" onChange={(e)=> setRefinputshow(e.target.checked) } checked={refinputshow} type="checkbox" id="flexCheckDefault" />
                                            
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Show my referrer address
                                            </label><br></br>
                                            {(refaddress !== '' || refinputshow === true) &&
                                                <input type="text" className="form-control"  onChange={(e)=> {e.preventDefault(); setRefaddress(e.target.value); }} value={refaddress} />
                                            }

                                        </div>
                                    </div>
                                    <div className="text-center btn-width">
                                        <button className="btn btn-primary" onClick={handleBuyLegox}>Buy $LEGOx</button>
                                        {/* <a target="_blank" href="#" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">Buy $LEGOX</a> */}
                                    </div>
                                    <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header border-bottom-none">
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Modal show={show} onHide={handleClose} size="lg"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered style={{ "color": "#000" }}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Your Unique Referral Link:</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form>
                                                <InputGroup className="mb-3">
                                                    <FormControl readonly value={referrallink} aria-label="Referral Link" />
                                                    <button variant="copytoclip" className="lego-button" onClick={(e) => copyRefLink(e)}>Copy Link</button>
                                                </InputGroup>
                                            </form>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12">
                            <Card>
                                <Card.Header>My $LEGOx Transaction History</Card.Header>
                                <Card.Body>
                                    <Table striped bordered hover variant="dark">
                                        <thead>
                                            <tr key="sadcnsj">
                                                <th>Address</th>
                                                <th>Transaction Hash</th>
                                                <th>Payment Method</th>
                                                <th>Amount</th>
                                                <th>No. of Tokens</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {transactionhistory && transactionhistory.length > 0 && transactionhistory.map((value) => {

                                                return (
                                                    <tr key={value._id}>
                                                        <td>
                                                            {typeof value.fromAddress !== 'undefined' && value.fromAddress !== '' && value.fromAddress.toString().slice(0, 5)}...{value.fromAddress.toString().slice(-5)}
                                                        </td>
                                                        <td>
                                                            {typeof value.hash !== 'undefined' && value.hash !== '' && value.hash.toString().slice(0, 8)}...{value.hash.toString().slice(-8)}
                                                        </td>
                                                        <td>
                                                            {typeof value.type !== 'undefined' && value.type !== '' ? value.type : ' - '}
                                                        </td>
                                                        <td>
                                                            {typeof value.amount !== 'undefined' && value.amount !== '' ? value.amount : ' - '}
                                                        </td>
                                                        <td>{typeof value.receviedToken !== undefined && value.amount !== '' ? parseFloat(value.receviedToken) : ' - '}</td>
                                                        <td>
                                                            {typeof value.status !== 'undefined' && value.status === '1' ? <button className="badge badge-success">success</button> : value.status === '2' ? <button className="badge badge-info">pending</button> : value.status === '3' ? <button className="badge badge-danger">failed</button> : <button className="badge badge-info">pending</button>}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            }

                                        </tbody>
                                    </Table>

                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Presale;