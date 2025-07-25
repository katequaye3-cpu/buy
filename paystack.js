const radioButtons = document.getElementsByName('package');
const amountInput  = document.getElementById('amount');
const Vip          = document.getElementById('vip');
const regular      = document.getElementById('reg');
const form         = document.getElementById('paymentForm');

// assign default values if missing
regular.value = '100';
Vip.value     = '200';

// seed amount on load & sync on change
window.addEventListener('DOMContentLoaded', () => {
  const checked =
    document.querySelector('input[name="package"]:checked') ||
    regular;
  checked.checked = true;
  amountInput.value = checked.value;
});

radioButtons.forEach(radio => {
  radio.addEventListener('change', e => {
    amountInput.value = e.target.value;
  });
});

// disable right-click
window.addEventListener('contextmenu', e => e.preventDefault());

// phone validation
function validatePhoneNumber() {
  const phoneNumber = document.getElementById('numberBox').value;
  const pattern = /^(\+233|233|0)?\d{9}$/;
  if (!pattern.test(phoneNumber)) {
    alert('Invalid phone number format');
    return false;
  }
  return true;
}

// modal elements
const modal    = document.getElementById('success-modal');
const closeBtn = modal.querySelector('.close-btn');
const refInput = document.getElementById('transaction-ref');
const copyBtn  = document.getElementById('copy-ref');

// show modal
function showModal(ref) {
  refInput.value = ref;
  modal.style.display = 'flex';
}

// close modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});

// copy to clipboard
copyBtn.addEventListener('click', () => {
  navigator.clipboard
    .writeText(refInput.value)
    .then(() => (copyBtn.textContent = 'Copied!'))
    .catch(() => (copyBtn.textContent = 'Failed'));
  setTimeout(() => (copyBtn.textContent = 'Copy'), 2000);
});

function payWithPaystack() {
  if (!validatePhoneNumber()) return;

  const email  =
    document.getElementById('email-address').value.trim();
  const first  =
    document.getElementById('first-name').value.trim();
  const last   =
    document.getElementById('last-name').value.trim();
  const phone  =
    document.getElementById('numberBox').value.trim();
  const amount =
    parseInt(document.getElementById('amount').value, 10) * 100;

  const reference = 'BLIZZ-' + Date.now();

  const handler = PaystackPop.setup({
    key: 'pk_test_b471ee2b1372d9a277e09b93d0cb1e52db3dfba9',
    email,
    amount,
    currency: 'GHS',
    ref: reference,

    firstname: first,
    lastname: last,
    phone: phone,

    metadata: {
      custom_fields: [
        {
          display_name: "First Name",
          variable_name: "first_name",
          value: first
        },
        {
          display_name: "Last Name",
          variable_name: "last_name",
          value: last
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: phone
        }
      ]
    },

    callback: function(response) {
      showModal(response.reference);
    },

    onClose: function() {
      alert('Payment cancelled.');
    }
  });

  handler.openIframe();
}
