const radioButtons = document.getElementsByName('package');
const amountInput = document.getElementById('amount');
const Vip = document.getElementById('vip');
const regular = document.getElementById('reg');
const button = document.querySelector('button')
const form = document.getElementById('paymentForm')
regular.value='100'
vip.value='200'


radioButtons.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      document.getElementById('amount').value = e.target.value;
    });
  });

  addEventListener('contextmenu',(e)=>{
    e.preventDefault()
  })

  function validatePhoneNumber() {
  const phoneNumber = document.getElementById('numberBox').value;
  const pattern = /^(\+233|233|0)?\d{9}$/; // adjust the pattern as needed
  if (!pattern.test(phoneNumber)) {
    alert('Invalid phone number format');
    return false;
  }
  return true;
}



function payWithPaystack() {
if (!validatePhoneNumber()) {
    return;
  }
    console.log('Pay button clicked');
  var handler = PaystackPop.setup({ 
    key: 'pk_test_b471ee2b1372d9a277e09b93d0cb1e52db3dfba9',
    email: document.getElementById('email-address').value,
    amount: document.getElementById('amount').value * 100,
    firstname: document.getElementById('first-name').value,
    lastname: document.getElementById('last-name').value,
    phone: document.getElementById('numberBox').value,
    currency: "GHS",
    ref: '' + Math.floor((Math.random() * 1000000000) + 1),
    callback: function(response) {
      console.log('Payment successful');
      alert('Payment successful! Transaction reference: ' + response.reference);
      window.location.replace('')
    },
    onClose: function() {
      console.log('Payment cancelled');
      alert('Payment cancelled');
    }
  });
  handler.openIframe();
  console.log('Paystack handler opened');
}
