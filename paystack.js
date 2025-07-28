// paystack.js

// ─── Element refs ─────────────────────────────────────────────────────
const radioButtons = document.getElementsByName('package');
const amountInput  = document.getElementById('amount');
const Vip          = document.getElementById('vip');
const regular      = document.getElementById('reg');
const form         = document.getElementById('paymentForm');
const guestType    = document.getElementById('guesttype');
const dynamicGroup = document.getElementById('form-group');

// assign default package values
regular.value = '100';
Vip.value     = '200';

// ─── Recalculate amount & inject name fields ─────────────────────────
function updateAmountAndFields() {
  // 1. Base price from checked radio (100 or 200)
  const base  = parseInt(
    document.querySelector('input[name="package"]:checked').value,
    10
  );
  // 2. Add ₵80 if “couple”, else add 0
  if(guestType.value === 'couple'){
    amountInput.value = (base*2)-20
  }else{
    amountInput.value = base
  }

  // 3. Inject the correct set of name fields
  if (guestType.value === 'couple') {
    dynamicGroup.innerHTML = `
      <label for="first-name">Your First Name*</label>
      <input type="text" id="first-name" required />

      <label for="last-name">Your Last Name*</label>
      <input type="text" id="last-name" required />

      <label for="p-first-name">Partner’s First Name*</label>
      <input type="text" id="p-first-name" required />

      <label for="p-last-name">Partner’s Last Name*</label>
      <input type="text" id="p-last-name" required />
    `;
  } else {
    dynamicGroup.innerHTML = `
      <label for="first-name">First Name*</label>
      <input type="text" id="first-name" required />

      <label for="last-name">Last Name*</label>
      <input type="text" id="last-name" required />
    `;
  }
}

// seed on load & wire listeners
window.addEventListener('DOMContentLoaded', () => {
  // default to Regular if nothing’s checked
  const checked =
    document.querySelector('input[name="package"]:checked') ||
    regular;
  checked.checked = true;
  updateAmountAndFields();
});

radioButtons.forEach(r => r.addEventListener('change', updateAmountAndFields));
guestType.addEventListener('change', updateAmountAndFields);

// ─── Disable right-click ─────────────────────────────────────────────
window.addEventListener('contextmenu', e => e.preventDefault());

// ─── Phone validation ───────────────────────────────────────────────
function validatePhoneNumber() {
  const val = document.getElementById('numberBox').value;
  const pattern = /^(\+233|233|0)?\d{9}$/;
  if (!pattern.test(val)) {
    alert('Invalid phone number format');
    return false;
  }
  return true;
}

// ─── Modal logic unchanged ───────────────────────────────────────────
const modal    = document.getElementById('success-modal');
const closeBtn = modal.querySelector('.close-btn');
const refInput = document.getElementById('transaction-ref');
const copyBtn  = document.getElementById('copy-ref');

function showModal(ref) {
  refInput.value = ref;
  modal.style.display = 'flex';
}

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => {
  if (e.target === modal) modal.style.display = 'none';
});
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(refInput.value)
    .then(() => (copyBtn.textContent = 'Copied!'))
    .catch(() => (copyBtn.textContent = 'Failed'));
  setTimeout(() => (copyBtn.textContent = 'Copy'), 2000);
});

// ─── Paystack integration ────────────────────────────────────────────
async function payWithPaystack() {
  if (!validatePhoneNumber()) return;

  // Collect common fields
  const email     = document.getElementById('email-address').value.trim();
  const firstName = document.getElementById('first-name').value.trim();
  const lastName  = document.getElementById('last-name').value.trim();
  const phone     = document.getElementById('numberBox').value.trim();
  const amount    = parseInt(amountInput.value, 10) * 100;
  const reference = 'BLIZZ-' + Date.now();

  // Safely collect partner names
  const isCouple = guestType.value === 'couple';
  let pFirst = '', pLast = '';
  if (isCouple) {
    pFirst = document.getElementById('p-first-name').value.trim();
    pLast  = document.getElementById('p-last-name').value.trim();
  }

  // Build your custom_fields array
  const customFields = [
    { display_name: 'First Name',      variable_name: 'first_name',   value: firstName },
    { display_name: 'Last Name',       variable_name: 'last_name',    value: lastName  }
  ];
  if (isCouple) {
    customFields.push(
      { display_name: 'Partner’s First Name', variable_name: 'partner_first_name', value: pFirst },
      { display_name: 'Partner’s Last Name',  variable_name: 'partner_last_name',  value: pLast }
    );
  }
  customFields.push(
    { display_name: 'Phone Number', variable_name: 'phone_number', value: phone }
  );

  // Initialize Paystack
  const handler = PaystackPop.setup({
    key: 'pk_test_b471ee2b1372d9a277e09b93d0cb1e52db3dfba9',
    email,
    amount,
    currency: 'GHS',
    ref: reference,
    metadata: { custom_fields: customFields },
    callback(response)    { showModal(response.reference); },
    onClose()            { alert('Payment cancelled.'); }
  });

  handler.openIframe();
}


