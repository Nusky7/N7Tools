const donateBtn = document.getElementById('donateBtn');
const donationModal = document.getElementById('donationModal');
const closeModal = document.getElementById('closeModal');
const paypalBtn = document.getElementById('paypalBtn');
const kofiBtn = document.getElementById('kofiBtn');
const stripeBtn = document.getElementById('stripeBtn');
const btcAddress = "bc1qzn5dj9vlcwhc0x502yeev5w4uuml34rqc6y6u9";
const copyBtcBtn = document.getElementById("copyBtcBtn");
const coffeeTxt = document.getElementById("coffee-txt");

/**
 * Muestra el modal de donaciones al hacer clic en el botón de donación.
 * @param {Event} event - Evento de clic.
 */
donateBtn.addEventListener('click', (event) => {
    console.log('Botón de donación clickeado');
    donationModal.classList.remove('hidden'); 
    coffeeTxt.classList.remove('opacity-0', 'group-hover:opacity-100');
});

/**
 * Cierra el modal de donaciones al hacer clic en el botón de cierre.
 */
closeModal.addEventListener('click', () => {
    console.log('Botón de cerrar clickeado');
    donationModal.classList.add('hidden');
    coffeeTxt.classList.add('opacity-0');
    coffeeTxt.classList.remove('group-hover:opacity-100'); 
});

/**
 * Redirige al usuario a la página de PayPal para donaciones.
 */
paypalBtn.addEventListener('click', () => {
    window.open('https://www.paypal.me/Nusky7', '_blank'); 
    donationModal.classList.add('hidden'); 
    coffeeTxt.classList.add('opacity-0');
    coffeeTxt.classList.remove('group-hover:opacity-100'); 
});

/**
 * Redirige al usuario a la página de Ko-fi para donaciones.
 */
kofiBtn.addEventListener('click', () => {
    window.open('https://ko-fi.com/nusky7', '_blank'); 
    donationModal.classList.add('hidden'); 
    coffeeTxt.classList.add('opacity-0');
    coffeeTxt.classList.remove('group-hover:opacity-100'); 
});

/**
 * Redirige al usuario a la página de Stripe para donaciones.
 */
stripeBtn.addEventListener('click', () => {
    window.open('https://donate.stripe.com/00g14ngOpcPEdrycMM', '_blank');
    donationModal.classList.add('hidden'); 
    coffeeTxt.classList.add('opacity-0');
    coffeeTxt.classList.remove('group-hover:opacity-100'); 
});

/**
 * Copia la dirección de Bitcoin al portapapeles.
 */
copyBtcBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(btcAddress) 
      .then(() => {
        alert("₿  Dirección de Bitcoin copiada al portapapeles"); 
      })
      .catch(err => {
        console.error("Failed to copy text: ", err); 
        alert("Fallo al copiar la dirección. Por favor inténtalo de nuevo."); 
      });
});