/**
 * GalaxianEmpire - Galaxy Map Module
 * Handles the meta-gameplay features including planet conquest, fleet management, and reputation
 */

class GalaxyMap {
    constructor() {
        // Galaxy map properties
        this.sectors = [];
        this.playerFleet = [];
        this.conqueredPlanets = [];
        this.reputation = {
            "Earth Federation": 50,
            "Nova Consortium": 50,
            "Zephyr Collective": 50,
            "Enigma Remnant": 50
        };
        this.resources = {
            credits: 1000,
            materials: 100,
            technology: 10,
            influence: 5
        };
        
        // UI elements
        this.mapCanvas = null;
        this.mapContext = null;
        this.infoPanel = null;
        this.resourceDisplay = null;
        
        // State tracking
        this.selectedSector = null;
        this.selectedPlanet = null;
        this.selectedShip = null;
        this.currentView = "map"; // map, planet, fleet, missions
    }
    
    /**
     * Initialize the galaxy map
     */
    init() {
        // Create UI elements
        this.createUI();
        
        // Generate galaxy sectors
        this.generateSectors();
        
        // Create starting fleet
        this.createStartingFleet();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Draw initial map
        this.drawMap();
        
        // Update resource display
        this.updateResourceDisplay();
        
        return true;
    }
    
    /**
     * Create UI elements for the galaxy map
     */
    createUI() {
        // Create container
        const container = document.createElement('div');
        container.id = 'galaxy-map-container';
        container.style.display = 'none'; // Hidden by default
        document.body.appendChild(container);
        
        // Create map canvas
        this.mapCanvas = document.createElement('canvas');
        this.mapCanvas.id = 'galaxy-map';
        this.mapCanvas.width = 360;
        this.mapCanvas.height = 400;
        container.appendChild(this.mapCanvas);
        this.mapContext = this.mapCanvas.getContext('2d');
        
        // Create info panel
        this.infoPanel = document.createElement('div');
        this.infoPanel.id = 'info-panel';
        this.infoPanel.className = 'meta-ui-panel';
        container.appendChild(this.infoPanel);
        
        // Create resource display
        this.resourceDisplay = document.createElement('div');
        this.resourceDisplay.id = 'resource-display';
        this.resourceDisplay.className = 'meta-ui-panel';
        container.appendChild(this.resourceDisplay);
        
        // Create navigation buttons
        const navButtons = document.createElement('div');
        navButtons.id = 'nav-buttons';
        navButtons.className = 'meta-ui-panel';
        
        const mapButton = document.createElement('button');
        mapButton.id = 'map-button';
        mapButton.className = 'nav-button active';
        mapButton.textContent = 'Galaxy Map';
        mapButton.addEventListener('click', () => this.switchView('map'));
        navButtons.appendChild(mapButton);
        
        const fleetButton = document.createElement('button');
        fleetButton.id = 'fleet-button';
        fleetButton.className = 'nav-button';
        fleetButton.textContent = 'Fleet';
        fleetButton.addEventListener('click', () => this.switchView('fleet'));
        navButtons.appendChild(fleetButton);
        
        const missionsButton = document.createElement('button');
        missionsButton.id = 'missions-button';
        missionsButton.className = 'nav-button';
        missionsButton.textContent = 'Missions';
        missionsButton.addEventListener('click', () => this.switchView('missions'));
        navButtons.appendChild(missionsButton);
        
        const diplomacyButton = document.createElement('button');
        diplomacyButton.id = 'diplomacy-button';
        diplomacyButton.className = 'nav-button';
        diplomacyButton.textContent = 'Diplomacy';
        diplomacyButton.addEventListener('click', () => this.switchView('diplomacy'));
        navButtons.appendChild(diplomacyButton);
        
        container.appendChild(navButtons);
        
        // Create back to game button
        const backButton = document.createElement('button');
        backButton.id = 'back-to-game';
        backButton.className = 'meta-ui-button';
        backButton.textContent = 'Return to Ship';
        backButton.addEventListener('click', () => this.hideMap());
        container.appendChild(backButton);
        
        // Add styles for galaxy map UI
        const style = document.createElement('style');
        style.textContent = `
            #galaxy-map-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(5, 10, 30, 0.95);
                z-index: 50;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
            }
            
            #galaxy-map {
                border: 2px solid #2a3a6a;
                border-radius: 5px;
                margin-bottom: 10px;
            }
            
            .meta-ui-panel {
                width: 340px;
                background: rgba(20, 30, 60, 0.8);
                border: 1px solid #2a3a6a;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 10px;
                color: #b8c7e0;
            }
            
            #info-panel {
                height: 80px;
                overflow-y: auto;
            }
            
            #resource-display {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
            }
            
            .resource-item {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .resource-value {
                font-weight: bold;
                color: #4da6ff;
            }
            
            #nav-buttons {
                display: flex;
                justify-content: space-between;
                padding: 5px;
            }
            
            .nav-button {
                background: #1a2a4a;
                color: #b8c7e0;
                border: 1px solid #2a3a6a;
                border-radius: 3px;
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
            }
            
            .nav-button.active {
                background: #2a3a6a;
                color: #ffffff;
                border-color: #4da6ff;
            }
            
            .meta-ui-button {
                background: linear-gradient(135deg, #2a3a6a 0%, #4da6ff 100%);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 10px 20px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 10px rgba(77, 166, 255, 0.5);
                margin-top: 10px;
            }
            
            .meta-ui-button:hover {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(77, 166, 255, 0.8);
            }
            
            .planet-item, .ship-item, .mission-item {
                background: rgba(30, 40, 70, 0.8);
                border: 1px solid #2a3a6a;
                border-radius: 3px;
                padding: 8px;
                margin-bottom: 5px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .planet-item:hover, .ship-item:hover, .mission-item:hover {
                background: rgba(40, 50, 80, 0.8);
                border-color: #4da6ff;
            }
            
            .planet-item.selected, .ship-item.selected, .mission-item.selected {
                background: rgba(50, 70, 100, 0.8);
                border-color: #4da6ff;
                box-shadow: 0 0 5px rgba(77, 166, 255, 0.5);
            }
            
            .faction-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px;
                margin-bottom: 5px;
            }
            
            .reputation-bar {
                width: 100px;
                height: 10px;
                background: #1a2a4a;
                border-radius: 5px;
                overflow: hidden;
                margin: 0 10px;
            }
            
            .reputation-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff4d4d 0%, #ffcc4d 50%, #4dff77 100%);
            }
            
            .faction-status {
                font-size: 10px;
                width: 60px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Generate galaxy sectors with planets
     */
    generateSectors() {
        // Define factions
        const factions = ["Earth Federation", "Nova Consortium", "Zephyr Collective", "Enigma Remnant", "Neutral"];
        
        // Generate 25 sectors (5x5 grid)
        for (let i = 0; i < 25; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            
            // Determine if sector is discovered (first 5 are discovered)
            const isDiscovered = i < 5;
            
            // Determine controlling faction
            let controllingFaction = "Neutral";
            if (i < 5) {
                controllingFaction = "Earth Federation"; // Starting sectors
            } else if (i >= 5 && i < 10) {
                controllingFaction = "Nova Consortium";
            } else if (i >= 10 && i < 15) {
                controllingFaction = "Zephyr Collective";
            } else if (i >= 15 && i < 20) {
                controllingFaction = "Enigma Remnant";
            }
            
            // Generate 1-3 planets per sector
            const planetCount = Math.floor(Math.random() * 3) + 1;
            const planets = [];
            
            for (let j = 0; j < planetCount; j++) {
                // Generate planet properties
                const planetTypes = ["Terrestrial", "Gas Giant", "Ice", "Desert", "Volcanic", "Ocean"];
                const resourceLevels = ["Poor", "Average", "Rich", "Abundant"];
                
                const planet = {
                    id: `planet-${i}-${j}`,
                    name: this.generatePlanetName(),
                    type: planetTypes[Math.floor(Math.random() * planetTypes.length)],
                    resources: {
                        credits: Math.floor(Math.random() * 50) + 10,
                        materials: Math.floor(Math.random() * 20) + 5,
                        technology: Math.floor(Math.random() * 5) + 1
                    },
                    resourceLevel: resourceLevels[Math.floor(Math.random() * resourceLevels.length)],
                    controllingFaction: controllingFaction,
                    defenseLevel: Math.floor(Math.random() * 5) + 1,
                    conquered: false,
                    position: {
                        x: 30 + col * 60 + (Math.random() * 30 - 15),
                        y: 30 + row * 60 + (Math.random() * 30 - 15)
                    }
                };
                
                planets.push(planet);
            }
            
            // Create sector object
            const sector = {
                id: `sector-${i}`,
                row: row,
                col: col,
                position: {
                    x: 36 + col * 72,
                    y: 40 + row * 80
                },
                planets: planets,
                controllingFaction: controllingFaction,
                isDiscovered: isDiscovered,
                dangerLevel: Math.floor(Math.random() * 5) + 1
            };
            
            this.sectors.push(sector);
        }
    }
    
    /**
     * Create starting fleet
     */
    createStartingFleet() {
        // Create starter ship
        const starterShip = {
            id: "ship-0",
            name: "Pathfinder",
            type: "Scout",
            level: 1,
            maxLevel: 5,
            upgrades: {
                weapons: 1,
                shields: 1,
                engines: 1,
                special: 0
            },
            stats: {
                attack: 2,
                defense: 2,
                speed: 3,
                capacity: 1
            },
            status: "ready", // ready, mission, upgrading
            missionEndTime: 0
        };
        
        this.playerFleet.push(starterShip);
    }
    
    /**
     * Set up event listeners for galaxy map interactions
     */
    setupEventListeners() {
        // Map canvas click event
        this.mapCanvas.addEventListener('click', (e) => {
            const rect = this.mapCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if we're in map view
            if (this.currentView === 'map') {
                // Check if clicked on a sector
                for (const sector of this.sectors) {
                    if (sector.isDiscovered) {
                        const dx = sector.position.x - x;
                        const dy = sector.position.y - y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 20) {
                            this.selectSector(sector);
                            break;
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Draw the galaxy map
     */
    drawMap() {
        // Clear canvas
        this.mapContext.clearRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
        
        // Draw background
        this.mapContext.fillStyle = '#050a1e';
        this.mapContext.fillRect(0, 0, this.mapCanvas.width, this.mapCanvas.height);
        
        // Draw grid lines
        this.mapContext.strokeStyle = 'rgba(42, 58, 106, 0.3)';
        this.mapContext.lineWidth = 1;
        
        // Vertical lines
        for (let i = 0; i <= 5; i++) {
            const x = i * 72;
            this.mapContext.beginPath();
            this.mapContext.moveTo(x, 0);
            this.mapContext.lineTo(x, this.mapCanvas.height);
            this.mapContext.stroke();
        }
        
        // Horizontal lines
        for (let i = 0; i <= 5; i++) {
            const y = i * 80;
            this.mapContext.beginPath();
            this.mapContext.moveTo(0, y);
            this.mapContext.lineTo(this.mapCanvas.width, y);
            this.mapContext.stroke();
        }
        
        // Draw sectors
        for (const sector of this.sectors) {
            if (sector.isDiscovered) {
                // Draw sector circle
                this.mapContext.beginPath();
                this.mapContext.arc(sector.position.x, sector.position.y, 15, 0, Math.PI * 2);
                
                // Set color based on controlling faction
                switch (sector.controllingFaction) {
                    case "Earth Federation":
                        this.mapContext.fillStyle = 'rgba(77, 166, 255, 0.3)';
                        this.mapContext.strokeStyle = 'rgba(77, 166, 255, 0.8)';
                        break;
                    case "Nova Consortium":
                        this.mapContext.fillStyle = 'rgba(255, 77, 77, 0.3)';
                        this.mapContext.strokeStyle = 'rgba(255, 77, 77, 0.8)';
                        break;
                    case "Zephyr Collective":
                        this.mapContext.fillStyle = 'rgba(77, 255, 119, 0.3)';
                        this.mapContext.strokeStyle = 'rgba(77, 255, 119, 0.8)';
                        break;
                    case "Enigma Remnant":
                        this.mapContext.fillStyle = 'rgba(191, 77, 255, 0.3)';
                        this.mapContext.strokeStyle = 'rgba(191, 77, 255, 0.8)';
                        break;
                    default:
                        this.mapContext.fillStyle = 'rgba(150, 150, 150, 0.3)';
                        this.mapContext.strokeStyle = 'rgba(150, 150, 150, 0.8)';
                }
                
                // Highlight selected sector
                if (this.selectedSector && this.selectedSector.id === sector.id) {
                    this.mapContext.lineWidth = 3;
                } else {
                    this.mapContext.lineWidth = 1;
                }
                
                this.mapContext.fill();
                this.mapContext.stroke();
                
                // Draw sector label
                this.mapContext.fillStyle = '#ffffff';
                this.mapContext.font = '10px Arial';
                this.mapContext.textAlign = 'center';
                this.mapContext.fillText(`${sector.row + 1}-${sector.col + 1}`, sector.position.x, sector.position.y + 4);
                
                // Draw planets if sector is selected
                if (this.selectedSector && this.selectedSector.id === sector.id) {
                    for (const planet of sector.planets) {
                        // Draw planet
                        this.mapContext.beginPath();
                        this.mapContext.arc(planet.position.x, planet.position.y, 5, 0, Math.PI * 2);
                        
                        // Set color based on planet type
                        switch (planet.type) {
                            case "Terrestrial":
                                this.mapContext.fillStyle = '#4dff77';
                                break;
                            case "Gas Giant":
                                this.mapContext.fillStyle = '#ffcc4d';
                                break;
                            case "Ice":
                                this.mapContext.fillStyle = '#b8c7e0';
                                break;
                            case "Desert":
                                this.mapContext.fillStyle = '#d2a679';
                                break;
                            case "Volcanic":
                                this.mapContext.fillStyle = '#ff4d4d';
                                break;
                            case "Ocean":
                                this.mapContext.fillStyle = '#4da6ff';
                                break;
                        }
                        
                        // Highlight conquered planets
                        if (planet.conquered) {
                            this.mapContext.strokeStyle = '#ffffff';
                            this.mapContext.lineWidth = 2;
                        } else {
                            this.mapContext.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                            this.mapContext.lineWidth = 1;
                        }
                        
                        this.mapContext.fill();
                        this.mapContext.stroke();
                    }
                }
            } else {
                // Draw undiscovered sector
                this.mapContext.beginPath();
                this.mapContext.arc(sector.position.x, sector.position.y, 15, 0, Math.PI * 2);
                this.mapContext.fillStyle = 'rgba(50, 50, 50, 0.3)';
                this.mapContext.strokeStyle = 'rgba(100, 100, 100, 0.5)';
                this.mapContext.lineWidth = 1;
                this.mapContext.fill();
                this.mapContext.stroke();
                
                // Draw question mark
                this.mapContext.fillStyle = 'rgba(150, 150, 150, 0.5)';
                this.mapContext.font = '14px Arial';
                this.mapContext.textAlign = 'center';
                this.mapContext.fillText('?', sector.position.x, sector.position.y + 5);
            }
        }
    }
    
    /**
     * Update resource display
     */
    updateResourceDisplay() {
        this.resourceDisplay.innerHTML = '';
        
        const resources = [
            { name: 'Credits', value: this.resources.credits, icon: '💰' },
            { name: 'Materials', value: this.resources.materials, icon: '🔩' },
            { name: 'Technology', value: this.resources.technology, icon: '🔬' },
            { name: 'Influence', value: this.resources.influence, icon: '⭐' }
        ];
        
        for (const resource of resources) {
            const resourceItem = document.createElement('div');
            resourceItem.className = 'resource-item';
            resourceItem.innerHTML = `
                <div class="resource-icon">${resource.icon}</div>
                <div class="resource-value">${resource.value}</div>
                <div class="resource-name">${resource.name}</div>
            `;
            this.resourceDisplay.appendChild(resourceItem);
        }
    }
    
    /**
     * Select a sector on the map
     */
    selectSector(sector) {
        this.selectedSector = sector;
        this.selectedPlanet = null;
        
        // Update info panel
        this.updateInfoPanel();
        
        // Redraw map
        this.drawMap();
    }
    
    /**
     * Select a planet in the current sector
     */
    selectPlanet(planet) {
        this.selectedPlanet = planet;
        
        // Update info panel
        this.updateInfoPanel();
        
        // Redraw map
        this.drawMap();
    }
    
    /**
     * Update the info panel with selected object details
     */
    updateInfoPanel() {
        this.infoPanel.innerHTML = '';
        
        if (this.currentView === 'map') {
            if (this.selectedSector) {
                // Show sector info
                const sectorInfo = document.createElement('div');
                sectorInfo.innerHTML = `
                    <h3>Sector ${this.selectedSector.row + 1}-${this.selectedSector.col + 1}</h3>
                    <p>Controlling Faction: ${this.selectedSector.controllingFaction}</p>
                    <p>Danger Level: ${this.selectedSector.dangerLevel}/5</p>
                `;
                this.infoPanel.appendChild(sectorInfo);
                
                // Show planet list if not showing planet details
                if (!this.selectedPlanet) {
                    const planetList = document.createElement('div');
                    planetList.className = 'planet-list';
                    
                    for (const planet of this.selectedSector.planets) {
                        const planetItem = document.createElement('div');
                        planetItem.className = 'planet-item';
                        planetItem.innerHTML = `
                            <strong>${planet.name}</strong> (${planet.type})
                            <span>${planet.conquered ? '✓ Conquered' : ''}</span>
                        `;
                        
                        // Add click event
                        planetItem.addEventListener('click', () => this.selectPlanet(planet));
                        
                        planetList.appendChild(planetItem);
                    }
                    
                    this.infoPanel.appendChild(planetList);
                } else {
                    // Show planet details
                    const planetDetails = document.createElement('div');
                    planetDetails.innerHTML = `
                        <h3>${this.selectedPlanet.name}</h3>
                        <p>Type: ${this.selectedPlanet.type}</p>
                        <p>Resources: ${this.selectedPlanet.resourceLevel}</p>
                        <p>Controlling Faction: ${this.selectedPlanet.controllingFaction}</p>
                        <p>Defense Level: ${this.selectedPlanet.defenseLevel}/5</p>
                    `;
                    
                    // Add conquest button if not conquered
                    if (!this.selectedPlanet.conquered) {
                        const conquerButton = document.createElement('button');
                        conquerButton.className = 'meta-ui-button';
                        conquerButton.textContent = 'Attempt Conquest';
                        conquerButton.addEventListener('click', () => this.attemptConquest(this.selectedPlanet));
                        planetDetails.appendChild(conquerButton);
                    } else {
                        // Show resource generation
                        planetDetails.innerHTML += `
                            <p>Generating: 
                                💰 ${this.selectedPlanet.resources.credits}/day, 
                                🔩 ${this.selectedPlanet.resources.materials}/day, 
                                🔬 ${this.selectedPlanet.resources.technology}/day
                            </p>
                        `;
                    }
                    
                    // Add back button
                    const backButton = document.createElement('button');
                    backButton.className = 'meta-ui-button';
                    backButton.textContent = 'Back to Sector';
                    backButton.addEventListener('click', () => {
                        this.selectedPlanet = null;
                        this.updateInfoPanel();
                    });
                    planetDetails.appendChild(backButton);
                    
                    this.infoPanel.appendChild(planetDetails);
                }
            } else {
                this.infoPanel.innerHTML = '<p>Select a sector to view details.</p>';
            }
        } else if (this.currentView === 'fleet') {
            // Show fleet management
            const fleetInfo = document.createElement('div');
            fleetInfo.innerHTML = '<h3>Your Fleet</h3>';
            
            const shipList = document.createElement('div');
            shipList.className = 'ship-list';
            
            for (const ship of this.playerFleet) {
                const shipItem = document.createElement('div');
                shipItem.className = 'ship-item';
                shipItem.innerHTML = `
                    <strong>${ship.name}</strong> (${ship.type} Lvl ${ship.level})
                    <span>${ship.status}</span>
                `;
                
                // Add click event
                shipItem.addEventListener('click', () => this.selectShip(ship));
                
                shipList.appendChild(shipItem);
            }
            
            fleetInfo.appendChild(shipList);
            this.infoPanel.appendChild(fleetInfo);
            
            // Show selected ship details
            if (this.selectedShip) {
                const shipDetails = document.createElement('div');
                shipDetails.innerHTML = `
                    <h3>${this.selectedShip.name}</h3>
                    <p>Type: ${this.selectedShip.type}</p>
                    <p>Level: ${this.selectedShip.level}/${this.selectedShip.maxLevel}</p>
                    <p>Stats: Attack ${this.selectedShip.stats.attack}, Defense ${this.selectedShip.stats.defense}, Speed ${this.selectedShip.stats.speed}</p>
                    <p>Upgrades: Weapons ${this.selectedShip.upgrades.weapons}, Shields ${this.selectedShip.upgrades.shields}, Engines ${this.selectedShip.upgrades.engines}</p>
                `;
                
                // Add upgrade button if not at max level
                if (this.selectedShip.level < this.selectedShip.maxLevel) {
                    const upgradeButton = document.createElement('button');
                    upgradeButton.className = 'meta-ui-button';
                    upgradeButton.textContent = 'Upgrade Ship';
                    upgradeButton.addEventListener('click', () => this.upgradeShip(this.selectedShip));
                    shipDetails.appendChild(upgradeButton);
                }
                
                this.infoPanel.appendChild(shipDetails);
            }
        } else if (this.currentView === 'missions') {
            // Show available missions
            const missionsInfo = document.createElement('div');
            missionsInfo.innerHTML = '<h3>Available Missions</h3>';
            
            const missionTypes = [
                { type: 'exploration', name: 'Exploration', description: 'Discover new sectors', reward: '100 Credits, New Sector' },
                { type: 'resource', name: 'Resource Gathering', description: 'Collect resources from asteroid field', reward: '50 Materials' },
                { type: 'combat', name: 'Combat Patrol', description: 'Eliminate pirate ships', reward: '200 Credits, 10 Influence' },
                { type: 'diplomacy', name: 'Diplomatic Mission', description: 'Improve relations with faction', reward: 'Reputation +10' }
            ];
            
            const missionList = document.createElement('div');
            missionList.className = 'mission-list';
            
            for (const mission of missionTypes) {
                const missionItem = document.createElement('div');
                missionItem.className = 'mission-item';
                missionItem.innerHTML = `
                    <strong>${mission.name}</strong>
                    <p>${mission.description}</p>
                    <p>Reward: ${mission.reward}</p>
                `;
                
                // Add start mission button
                const startButton = document.createElement('button');
                startButton.className = 'meta-ui-button';
                startButton.textContent = 'Start Mission';
                startButton.addEventListener('click', () => this.startMission(mission.type));
                missionItem.appendChild(startButton);
                
                missionList.appendChild(missionItem);
            }
            
            missionsInfo.appendChild(missionList);
            this.infoPanel.appendChild(missionsInfo);
        } else if (this.currentView === 'diplomacy') {
            // Show faction relations
            const diplomacyInfo = document.createElement('div');
            diplomacyInfo.innerHTML = '<h3>Faction Relations</h3>';
            
            const factionList = document.createElement('div');
            factionList.className = 'faction-list';
            
            for (const [faction, value] of Object.entries(this.reputation)) {
                const factionItem = document.createElement('div');
                factionItem.className = 'faction-item';
                
                // Determine faction status
                let status = 'Neutral';
                if (value >= 75) status = 'Allied';
                else if (value >= 60) status = 'Friendly';
                else if (value <= 25) status = 'Hostile';
                else if (value <= 40) status = 'Unfriendly';
                
                factionItem.innerHTML = `
                    <div>${faction}</div>
                    <div class="reputation-bar">
                        <div class="reputation-fill" style="width: ${value}%;"></div>
                    </div>
                    <div class="faction-status">${status}</div>
                `;
                
                factionList.appendChild(factionItem);
            }
            
            diplomacyInfo.appendChild(factionList);
            this.infoPanel.appendChild(diplomacyInfo);
        }
    }
    
    /**
     * Switch between different views (map, fleet, missions, diplomacy)
     */
    switchView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.nav-button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(`${view}-button`).classList.add('active');
        
        // Reset selections
        this.selectedShip = null;
        
        // Update info panel
        this.updateInfoPanel();
        
        // Redraw if map view
        if (view === 'map') {
            this.drawMap();
        }
    }
    
    /**
     * Show the galaxy map
     */
    showMap() {
        document.getElementById('galaxy-map-container').style.display = 'flex';
        this.drawMap();
        this.updateInfoPanel();
        this.updateResourceDisplay();
    }
    
    /**
     * Hide the galaxy map
     */
    hideMap() {
        document.getElementById('galaxy-map-container').style.display = 'none';
    }
    
    /**
     * Attempt to conquer a planet
     */
    attemptConquest(planet) {
        // Calculate conquest chance based on player fleet strength vs planet defense
        let fleetStrength = 0;
        for (const ship of this.playerFleet) {
            if (ship.status === 'ready') {
                fleetStrength += ship.stats.attack + ship.stats.defense;
            }
        }
        
        const defenseStrength = planet.defenseLevel * 2;
        const conquestChance = Math.min(90, Math.max(10, 50 + (fleetStrength - defenseStrength) * 10));
        
        // Roll for success
        const roll = Math.random() * 100;
        const success = roll <= conquestChance;
        
        if (success) {
            // Conquest successful
            planet.conquered = true;
            planet.controllingFaction = "Earth Federation";
            this.conqueredPlanets.push(planet);
            
            // Update sector control if majority of planets conquered
            const sector = this.sectors.find(s => s.planets.includes(planet));
            const conqueredCount = sector.planets.filter(p => p.conquered).length;
            if (conqueredCount > sector.planets.length / 2) {
                sector.controllingFaction = "Earth Federation";
            }
            
            // Add reputation based on previous controlling faction
            if (planet.controllingFaction !== "Neutral") {
                this.reputation[planet.controllingFaction] -= 5;
            }
            
            // Show success message
            alert(`Conquest successful! ${planet.name} is now under your control.`);
        } else {
            // Conquest failed
            // Reduce ship health or apply other penalties
            
            // Show failure message
            alert(`Conquest failed! Your forces were repelled from ${planet.name}.`);
        }
        
        // Update UI
        this.updateInfoPanel();
        this.drawMap();
    }
    
    /**
     * Upgrade a ship
     */
    upgradeShip(ship) {
        // Calculate upgrade cost
        const creditCost = ship.level * 500;
        const materialCost = ship.level * 50;
        const techCost = ship.level * 5;
        
        // Check if player has enough resources
        if (this.resources.credits >= creditCost && 
            this.resources.materials >= materialCost && 
            this.resources.technology >= techCost) {
            
            // Deduct resources
            this.resources.credits -= creditCost;
            this.resources.materials -= materialCost;
            this.resources.technology -= techCost;
            
            // Upgrade ship
            ship.level++;
            ship.stats.attack++;
            ship.stats.defense++;
            
            // Show success message
            alert(`${ship.name} upgraded to level ${ship.level}!`);
            
            // Update UI
            this.updateResourceDisplay();
            this.updateInfoPanel();
        } else {
            // Show insufficient resources message
            alert(`Insufficient resources for upgrade. Need ${creditCost} Credits, ${materialCost} Materials, ${techCost} Technology.`);
        }
    }
    
    /**
     * Start a mission
     */
    startMission(missionType) {
        // Check if any ships are available
        const availableShips = this.playerFleet.filter(ship => ship.status === 'ready');
        
        if (availableShips.length === 0) {
            alert('No ships available for mission. Wait for current missions to complete.');
            return;
        }
        
        // Assign first available ship to mission
        const ship = availableShips[0];
        ship.status = 'mission';
        
        // Set mission duration (in milliseconds)
        const duration = 60000; // 1 minute for demo purposes
        ship.missionEndTime = Date.now() + duration;
        
        // Start mission timer
        setTimeout(() => {
            this.completeMission(ship, missionType);
        }, duration);
        
        // Show mission started message
        alert(`${ship.name} dispatched on ${missionType} mission. Will return in 1 minute.`);
        
        // Update UI
        this.updateInfoPanel();
    }
    
    /**
     * Complete a mission and award rewards
     */
    completeMission(ship, missionType) {
        // Set ship back to ready status
        ship.status = 'ready';
        
        // Award rewards based on mission type
        switch (missionType) {
            case 'exploration':
                // Discover a new sector
                const undiscoveredSectors = this.sectors.filter(s => !s.isDiscovered);
                if (undiscoveredSectors.length > 0) {
                    const sector = undiscoveredSectors[0];
                    sector.isDiscovered = true;
                }
                this.resources.credits += 100;
                break;
            case 'resource':
                this.resources.materials += 50;
                break;
            case 'combat':
                this.resources.credits += 200;
                this.resources.influence += 10;
                break;
            case 'diplomacy':
                // Improve relations with random faction
                const factions = Object.keys(this.reputation);
                const faction = factions[Math.floor(Math.random() * factions.length)];
                this.reputation[faction] = Math.min(100, this.reputation[faction] + 10);
                break;
        }
        
        // Show mission completed message
        alert(`${ship.name} has returned from ${missionType} mission. Rewards collected!`);
        
        // Update UI
        this.updateResourceDisplay();
        this.updateInfoPanel();
        this.drawMap();
    }
    
    /**
     * Collect resources from conquered planets
     * Called once per day (or other time period)
     */
    collectPlanetResources() {
        for (const planet of this.conqueredPlanets) {
            this.resources.credits += planet.resources.credits;
            this.resources.materials += planet.resources.materials;
            this.resources.technology += planet.resources.technology;
        }
        
        // Update UI
        this.updateResourceDisplay();
    }
    
    /**
     * Generate a random planet name
     */
    generatePlanetName() {
        const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
        const suffixes = ['Prime', 'Major', 'Minor', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus', 'Septimus'];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = Math.random() > 0.5 ? ' ' + suffixes[Math.floor(Math.random() * suffixes.length)] : '';
        const number = Math.floor(Math.random() * 10);
        
        return `${prefix}-${number}${suffix}`;
    }
    
    /**
     * Select a ship in the fleet view
     */
    selectShip(ship) {
        this.selectedShip = ship;
        this.updateInfoPanel();
    }
}

// Export the GalaxyMap class
window.GalaxyMap = GalaxyMap;
