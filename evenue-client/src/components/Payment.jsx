import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import TopNav from "./Navbar";
import './Payment.css';

const stripePromise = loadStripe("pk_test_51N0e60JpjphrwPFp1DDXHdvxJetdutABkfuYk4AbZvNkjsdmrV4pm9zUHRT4lSSIu3dWeNMxCfW5hQFSrJ1vJVDB00yco69JUK");

const CheckoutForm = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const stripe = useStripe();
  const elements = useElements();
  const locations = useLocation();
    const eid = new URLSearchParams(locations.search).get('eid');
    const name = new URLSearchParams(locations.search).get('name');
    const date = new URLSearchParams(locations.search).get('date');
    const address = new URLSearchParams(locations.search).get('address');
    const organizer = new URLSearchParams(locations.search).get('organizer');
    const booked_by = new URLSearchParams(locations.search).get('booked_by');
    const starttime = new URLSearchParams(locations.search).get('starttime');
    const data = new URLSearchParams(locations.search).get('data');
    const [type, setType] = useState("success");
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
  const navigate=useNavigate();
  const [modalShow, setModalShow] = React.useState(false);


  /*
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardNumberElement),
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[paymentMethod]", paymentMethod);
    }
  };
  */

  function bookActivity() {
    if (booked_by === "") {
      navigate('/Login')
    }

    else {
      //const name = name
    //const date = date
    //const address = address
    //const organizer = organizer
    //const _id = eid
    //const starttime = starttime

    fetch('/book_event', {
              method: 'POST',
              mode: 'cors',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: name,
                date: date,
                booked_by: booked_by,
                address: address,
                organizer: organizer,
                id: eid,
                starttime: starttime
              })
            })
            .then(response => response.json())
            .then(data => {
              const res = data
              console.log(res.message)
              setMessage(res.message)
              setShow(true)
              if (res.message === "No user found") {
                navigate('/Login')
              }
              if (res.message === "Already booked. Check mail.") {
                setType("warning")
                setTimeout(() => setModalShow(false), 3000)
              }
              if (res.message == "Booking successful!") {
                setType("success")
                alert("success")
              }

            
              axios.post("/after_book_event",{
                "eid": eid,
                "email":booked_by
              })
                .then(response => {
                  console.log(response.message)
                })
                .catch(error => {
                  console.error(error);
                })
            })
            .catch(error => console.log(error));


    }

    
  }

  function handleBook1(id) {
    console.log(id)
    if (data=="false") {
      console.log("No data! :( ")
    }
    
    bookActivity();
    }



  const inputStyle = {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  };

  const cardIconsStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  };

  const visaIcon = (
    <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa Icon" />
  );

  const mastercardIcon = (
    <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard Icon" />
  );

  const amexIcon = (
    <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex Icon" />
  );

  const discoverIcon = (
    <img src="https://img.icons8.com/color/48/000000/discover.png" alt="Discover Icon" />
  );

  return (
    <div className="bag-payments">
        <TopNav />
        <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            
            <button className='btn-about' onClick={toggleTheme}>Toggle Theme</button>
        <div style={{height:'100vh'}}>
        <div className="payment" >
            <form onSubmit={handleBook1}>
            <div className="form-group">
                <label htmlFor="cardNumberElement" style={{color:"var(--text-color)",textAlign:"left"}}>Card number</label>
                <div style={cardIconsStyle}>
                  {visaIcon}
                  {mastercardIcon}
                  {amexIcon}
                  {discoverIcon}
                </div>
                <CardNumberElement
                id="cardNumberElement"
                options={{ style: inputStyle }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="cardExpiryElement" style={{color:"var(--text-color)"}}>Expiration date</label>
                <CardExpiryElement
                id="cardExpiryElement"
                options={{ style: inputStyle }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="cardCvcElement" style={{color:"var(--text-color)"}}>CVC</label>
                <CardCvcElement id="cardCvcElement" options={{ style: inputStyle }} />
            </div>
            <button type="submit" onClick={() => {handleBook1(eid)}}>
                Pay
            </button>
            </form>
        </div>
        </div>
    </div>
    </div>
  );
};

const StripeCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeCheckout;
