
// referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');



const searchParams = new URLSearchParams(window.location.search);


if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
divAlerta.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    btnAtender.disabled = true;
});

socket.on('enviar-mensaje', (payload) => {
    console.log( payload )
})


socket.on('tickets-pendientes', (payload) => {
    lblPendientes.innerText = payload;
    if (payload === 0) {
        lblTicket.innerText = 'No hay mas tickets.'
    } 
});

btnAtender.addEventListener('click', () =>{

    socket.emit('atender-ticket', {escritorio}, ({ok, ticket, msg}) => {

        if (!ok) {
            lblTicket.innerText = 'No hay mas tickets.';    
            return divAlerta.style.display = '';
        }

        lblTicket.innerText = 'Ticket ' + ticket.numero;
    });

});

