class DeliveryQueue {
    constructor() {
        this.queue = [];
        this.history = [];
        this.destinations = [
            'Marte', 'Vênus', 'Júpiter', 'Saturno', 'Netuno', 
            'Estação Espacial Alpha', 'Colônia Lunar', 'Base Orbital X-9'
        ];
    }

    enqueue(parcel) {
        parcel.destination = this.destinations[Math.floor(Math.random() * this.destinations.length)];
        parcel.trackingId = 'GX-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        this.queue.push(parcel);
        this.updateDisplay();
        this.playSound('add');
    }

    dequeue() {
        if (this.queue.length === 0) return null;
        const parcel = this.queue.shift();
        this.history.push({
            ...parcel,
            deliveryTime: new Date().toLocaleString('pt-BR'),
            status: 'Entregue com sucesso!'
        });
        this.updateDisplay();
        this.playSound('deliver');
        return parcel;
    }

    playSound(type) {
        const sounds = {
            add: '',
            deliver: ''
        };
        console.log(sounds[type]);
    }

    updateDisplay() {
        const queueDisplay = document.getElementById('queueDisplay');
        queueDisplay.innerHTML = this.queue.map((parcel, index) => `
            <div class="package-item">
                <strong>Pacote Espacial #${parcel.trackingId}</strong><br>
                <i class="fas fa-user-astronaut"></i> Destinatário: ${parcel.name}<br>
                <i class="fas fa-globe"></i> Origem: ${parcel.city}, ${parcel.country}<br>
                <i class="fas fa-rocket"></i> Destino: ${parcel.destination}
            </div>
        `).join('');

        const historyDisplay = document.getElementById('historyDisplay');
        historyDisplay.innerHTML = this.history.map((parcel, index) => `
            <div class="package-item delivered">
                <strong>Missão Completada: ${parcel.trackingId}</strong><br>
                <i class="fas fa-user-astronaut"></i> Destinatário: ${parcel.name}<br>
                <i class="fas fa-globe"></i> Origem: ${parcel.city}, ${parcel.country}<br>
                <i class="fas fa-rocket"></i> Destino: ${parcel.destination}<br>
                <i class="fas fa-clock"></i> Entregue em: ${parcel.deliveryTime}<br>
                <span class="status"><i class="fas fa-check-circle"></i> ${parcel.status}</span>
            </div>
        `).join('');
    }
}

async function fetchRandomUser() {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const user = data.results[0];
        return {
            name: `${user.name.first} ${user.name.last}`,
            city: user.location.city,
            country: user.location.country
        };
    } catch (error) {
        console.error('Erro ao buscar usuário aleatório:', error);
        return {
            name: 'Comandante Silva',
            city: 'São Paulo',
            country: 'Brasil'
        };
    }
}

async function animateDelivery() {
    const spaceship = document.getElementById('deliveryTruck');
    const statusLight = document.querySelector('.status-light');
    
    statusLight.style.backgroundColor = '#ff3d00';
    spaceship.style.transform = 'translateY(-50%) rotate(-15deg)';
    await new Promise(resolve => setTimeout(resolve, 500));
    
    spaceship.style.left = '90%';
    spaceship.style.transform = 'translateY(-50%) rotate(0deg)';
    statusLight.style.backgroundColor = '#00f3ff';
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    spaceship.style.transform = 'translateY(-50%) rotate(15deg)';
    spaceship.style.left = '0';
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    spaceship.style.transform = 'translateY(-50%) rotate(0deg)';
}

const deliveryQueue = new DeliveryQueue();

document.getElementById('addPackage').addEventListener('click', async () => {
    const parcel = await fetchRandomUser();
    deliveryQueue.enqueue(parcel);
});

document.getElementById('deliverPackage').addEventListener('click', async () => {
    if (deliveryQueue.queue.length > 0) {
        const parcel = deliveryQueue.dequeue();
        if (parcel) {
            await animateDelivery();
        }
    } else {
        alert('Não há pacotes na fila de lançamento!');
    }
});
