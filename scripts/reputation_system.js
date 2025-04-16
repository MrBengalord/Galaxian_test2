/**
 * GalaxianEmpire - Reputation System Module
 * Handles faction relationships and diplomatic interactions
 */

class ReputationSystem {
    constructor() {
        // Faction reputation values (0-100)
        this.factions = {
            "Earth Federation": {
                reputation: 50,
                description: "The unified government of Earth and its colonies. Values diplomacy and balanced development.",
                color: "#4da6ff",
                leader: "Admiral Helena Chen",
                specialization: "Balanced ships with diplomatic advantages"
            },
            "Nova Consortium": {
                reputation: 50,
                description: "A powerful corporate alliance focused on expansion and resource exploitation.",
                color: "#ff4d4d",
                leader: "Director Marcus Vega",
                specialization: "Strong offensive capabilities and resource generation"
            },
            "Zephyr Collective": {
                reputation: 50,
                description: "A loose federation of independent worlds prioritizing defense and sustainability.",
                color: "#4dff77",
                leader: "Chancellor Aria Solaris",
                specialization: "Superior defensive systems and sustainability"
            },
            "Enigma Remnant": {
                reputation: 50,
                description: "A mysterious civilization with ancient technology and unknown motives.",
                color: "#bf4dff",
                leader: "The Overseer",
                specialization: "Unique technologies and special abilities"
            }
        };
        
        // Diplomatic status with each faction
        this.diplomaticStatus = {
            "Earth Federation": "Neutral",
            "Nova Consortium": "Neutral",
            "Zephyr Collective": "Neutral",
            "Enigma Remnant": "Neutral"
        };
        
        // Available diplomatic actions
        this.diplomaticActions = [
            {
                name: "Trade Agreement",
                description: "Establish trade routes for mutual benefit",
                reputationRequired: 60,
                effect: "Increased resource generation",
                cost: { credits: 500, influence: 10 }
            },
            {
                name: "Research Partnership",
                description: "Collaborate on technological development",
                reputationRequired: 65,
                effect: "Access to faction-specific technologies",
                cost: { credits: 800, technology: 20 }
            },
            {
                name: "Non-Aggression Pact",
                description: "Formal agreement to avoid conflict",
                reputationRequired: 55,
                effect: "Reduced chance of hostile encounters",
                cost: { credits: 300, influence: 15 }
            },
            {
                name: "Military Alliance",
                description: "Mutual defense agreement",
                reputationRequired: 75,
                effect: "Military assistance during conflicts",
                cost: { credits: 1000, influence: 25 }
            },
            {
                name: "Cultural Exchange",
                description: "Share cultural knowledge and practices",
                reputationRequired: 50,
                effect: "Gradual reputation increase over time",
                cost: { credits: 200, influence: 5 }
            }
        ];
        
        // Active diplomatic agreements
        this.activeAgreements = [];
        
        // UI elements
        this.reputationContainer = null;
        this.factionInfoPanel = null;
        this.diplomaticActionsPanel = null;
        
        // Selected faction
        this.selectedFaction = null;
    }
    
    /**
     * Initialize the reputation system
     */
    init() {
        // Create UI elements
        this.createUI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        return true;
    }
    
    /**
     * Create UI elements for the reputation system
     */
    createUI() {
        // Create container
        const container = document.createElement('div');
        container.id = 'reputation-container';
        container.style.display = 'none'; // Hidden by default
        document.body.appendChild(container);
        this.reputationContainer = container;
        
        // Create header
        const header = document.createElement('div');
        header.id = 'reputation-header';
        header.className = 'reputation-ui-panel';
        header.innerHTML = '<h2>Galactic Diplomacy</h2>';
        container.appendChild(header);
        
        // Create faction list
        const factionList = document.createElement('div');
        factionList.id = 'faction-list';
        factionList.className = 'reputation-ui-panel';
        
        for (const [factionName, factionData] of Object.entries(this.factions)) {
            const factionItem = document.createElement('div');
            factionItem.className = 'faction-list-item';
            factionItem.dataset.faction = factionName;
            
            // Determine status class
            let statusClass = 'neutral';
            if (factionData.reputation >= 75) statusClass = 'allied';
            else if (factionData.reputation >= 60) statusClass = 'friendly';
            else if (factionData.reputation <= 25) statusClass = 'hostile';
            else if (factionData.reputation <= 40) statusClass = 'unfriendly';
            
            factionItem.innerHTML = `
                <div class="faction-name">${factionName}</div>
                <div class="faction-reputation-bar">
                    <div class="faction-reputation-fill" style="width: ${factionData.reputation}%; background-color: ${factionData.color}"></div>
                </div>
                <div class="faction-status ${statusClass}">${this.diplomaticStatus[factionName]}</div>
            `;
            
            // Add click event
            factionItem.addEventListener('click', () => this.selectFaction(factionName));
            
            factionList.appendChild(factionItem);
        }
        
        container.appendChild(factionList);
        
        // Create faction info panel
        const factionInfoPanel = document.createElement('div');
        factionInfoPanel.id = 'faction-info-panel';
        factionInfoPanel.className = 'reputation-ui-panel';
        container.appendChild(factionInfoPanel);
        this.factionInfoPanel = factionInfoPanel;
        
        // Create diplomatic actions panel
        const diplomaticActionsPanel = document.createElement('div');
        diplomaticActionsPanel.id = 'diplomatic-actions-panel';
        diplomaticActionsPanel.className = 'reputation-ui-panel';
        container.appendChild(diplomaticActionsPanel);
        this.diplomaticActionsPanel = diplomaticActionsPanel;
        
        // Create back button
        const backButton = document.createElement('button');
        backButton.id = 'back-from-reputation';
        backButton.className = 'reputation-ui-button';
        backButton.textContent = 'Return to Galaxy Map';
        backButton.addEventListener('click', () => this.hideReputationSystem());
        container.appendChild(backButton);
        
        // Add styles for reputation UI
        const style = document.createElement('style');
        style.textContent = `
            #reputation-container {
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
            
            .reputation-ui-panel {
                width: 340px;
                background: rgba(20, 30, 60, 0.8);
                border: 1px solid #2a3a6a;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 10px;
                color: #b8c7e0;
            }
            
            #reputation-header {
                text-align: center;
            }
            
            #reputation-header h2 {
                margin: 0;
                color: #4da6ff;
            }
            
            #faction-list {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .faction-list-item {
                display: flex;
                align-items: center;
                padding: 5px;
                border-radius: 3px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .faction-list-item:hover {
                background: rgba(42, 58, 106, 0.5);
            }
            
            .faction-list-item.selected {
                background: rgba(42, 58, 106, 0.8);
                border: 1px solid #4da6ff;
            }
            
            .faction-name {
                width: 120px;
                font-weight: bold;
            }
            
            .faction-reputation-bar {
                flex-grow: 1;
                height: 10px;
                background: #1a2a4a;
                border-radius: 5px;
                overflow: hidden;
                margin: 0 10px;
            }
            
            .faction-reputation-fill {
                height: 100%;
            }
            
            .faction-status {
                width: 80px;
                text-align: center;
                font-size: 12px;
                padding: 2px 5px;
                border-radius: 3px;
            }
            
            .faction-status.allied {
                background: rgba(77, 255, 119, 0.3);
                color: #4dff77;
            }
            
            .faction-status.friendly {
                background: rgba(77, 166, 255, 0.3);
                color: #4da6ff;
            }
            
            .faction-status.neutral {
                background: rgba(150, 150, 150, 0.3);
                color: #b8c7e0;
            }
            
            .faction-status.unfriendly {
                background: rgba(255, 204, 77, 0.3);
                color: #ffcc4d;
            }
            
            .faction-status.hostile {
                background: rgba(255, 77, 77, 0.3);
                color: #ff4d4d;
            }
            
            #faction-info-panel {
                min-height: 150px;
            }
            
            .faction-info {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .faction-header {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .faction-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                font-weight: bold;
                color: #050a1e;
            }
            
            .faction-title {
                font-size: 18px;
                font-weight: bold;
            }
            
            .faction-description {
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .faction-details {
                display: flex;
                flex-direction: column;
                gap: 5px;
                font-size: 14px;
            }
            
            .faction-detail {
                display: flex;
            }
            
            .faction-detail-label {
                width: 100px;
                font-weight: bold;
            }
            
            #diplomatic-actions-panel {
                min-height: 150px;
            }
            
            .diplomatic-actions-list {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .diplomatic-action {
                background: rgba(30, 40, 70, 0.8);
                border: 1px solid #2a3a6a;
                border-radius: 3px;
                padding: 8px;
            }
            
            .diplomatic-action-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            }
            
            .diplomatic-action-name {
                font-weight: bold;
                color: #4da6ff;
            }
            
            .diplomatic-action-cost {
                font-size: 12px;
                color: #ffcc4d;
            }
            
            .diplomatic-action-description {
                font-size: 12px;
                margin-bottom: 5px;
            }
            
            .diplomatic-action-effect {
                font-size: 12px;
                color: #4dff77;
                margin-bottom: 5px;
            }
            
            .diplomatic-action-button {
                background: linear-gradient(135deg, #2a3a6a 0%, #4da6ff 100%);
                color: white;
                border: none;
                border-radius: 3px;
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .diplomatic-action-button:hover {
                transform: scale(1.05);
            }
            
            .diplomatic-action-button:disabled {
                background: #1a2a4a;
                color: #5a6a8a;
                cursor: not-allowed;
                transform: none;
            }
            
            .reputation-ui-button {
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
            
            .reputation-ui-button:hover {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(77, 166, 255, 0.8);
            }
            
            .active-agreements {
                margin-top: 10px;
                border-top: 1px solid #2a3a6a;
                padding-top: 10px;
            }
            
            .active-agreements-title {
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .agreement-item {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                padding: 3px 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Event listeners are set up during UI creation
    }
    
    /**
     * Select a faction to view details
     */
    selectFaction(factionName) {
        this.selectedFaction = factionName;
        
        // Update selected item in list
        document.querySelectorAll('.faction-list-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`.faction-list-item[data-faction="${factionName}"]`).classList.add('selected');
        
        // Update faction info panel
        this.updateFactionInfoPanel();
        
        // Update diplomatic actions panel
        this.updateDiplomaticActionsPanel();
    }
    
    /**
     * Update faction info panel with selected faction details
     */
    updateFactionInfoPanel() {
        if (!this.selectedFaction) {
            this.factionInfoPanel.innerHTML = '<p>Select a faction to view details.</p>';
            return;
        }
        
        const faction = this.factions[this.selectedFaction];
        
        // Create faction info
        const factionInfo = document.createElement('div');
        factionInfo.className = 'faction-info';
        
        // Faction header
        const factionHeader = document.createElement('div');
        factionHeader.className = 'faction-header';
        
        const factionIcon = document.createElement('div');
        factionIcon.className = 'faction-icon';
        factionIcon.style.backgroundColor = faction.color;
        factionIcon.textContent = this.selectedFaction.charAt(0);
        factionHeader.appendChild(factionIcon);
        
        const factionTitle = document.createElement('div');
        factionTitle.className = 'faction-title';
        factionTitle.textContent = this.selectedFaction;
        factionHeader.appendChild(factionTitle);
        
        factionInfo.appendChild(factionHeader);
        
        // Faction description
        const factionDescription = document.createElement('div');
        factionDescription.className = 'faction-description';
        factionDescription.textContent = faction.description;
        factionInfo.appendChild(factionDescription);
        
        // Faction details
        const factionDetails = document.createElement('div');
        factionDetails.className = 'faction-details';
        
        const leaderDetail = document.createElement('div');
        leaderDetail.className = 'faction-detail';
        leaderDetail.innerHTML = `
            <div class="faction-detail-label">Leader:</div>
            <div class="faction-detail-value">${faction.leader}</div>
        `;
        factionDetails.appendChild(leaderDetail);
        
        const specializationDetail = document.createElement('div');
        specializationDetail.className = 'faction-detail';
        specializationDetail.innerHTML = `
            <div class="faction-detail-label">Specialization:</div>
            <div class="faction-detail-value">${faction.specialization}</div>
        `;
        factionDetails.appendChild(specializationDetail);
        
        const reputationDetail = document.createElement('div');
        reputationDetail.className = 'faction-detail';
        reputationDetail.innerHTML = `
            <div class="faction-detail-label">Reputation:</div>
            <div class="faction-detail-value">${faction.reputation}/100</div>
        `;
        factionDetails.appendChild(reputationDetail);
        
        const statusDetail = document.createElement('div');
        statusDetail.className = 'faction-detail';
        statusDetail.innerHTML = `
            <div class="faction-detail-label">Status:</div>
            <div class="faction-detail-value">${this.diplomaticStatus[this.selectedFaction]}</div>
        `;
        factionDetails.appendChild(statusDetail);
        
        factionInfo.appendChild(factionDetails);
        
        // Active agreements
        const activeAgreements = this.activeAgreements.filter(agreement => 
            agreement.faction === this.selectedFaction
        );
        
        if (activeAgreements.length > 0) {
            const agreementsSection = document.createElement('div');
            agreementsSection.className = 'active-agreements';
            
            const agreementsTitle = document.createElement('div');
            agreementsTitle.className = 'active-agreements-title';
            agreementsTitle.textContent = 'Active Agreements:';
            agreementsSection.appendChild(agreementsTitle);
            
            for (const agreement of activeAgreements) {
                const agreementItem = document.createElement('div');
                agreementItem.className = 'agreement-item';
                agreementItem.innerHTML = `
                    <div>${agreement.name}</div>
                    <div>${agreement.effect}</div>
                `;
                agreementsSection.appendChild(agreementItem);
            }
            
            factionInfo.appendChild(agreementsSection);
        }
        
        // Clear and append
        this.factionInfoPanel.innerHTML = '';
        this.factionInfoPanel.appendChild(factionInfo);
    }
    
    /**
     * Update diplomatic actions panel with available actions
     */
    updateDiplomaticActionsPanel() {
        if (!this.selectedFaction) {
            this.diplomaticActionsPanel.innerHTML = '<p>Select a faction to view available diplomatic actions.</p>';
            return;
        }
        
        this.diplomaticActionsPanel.innerHTML = '<h3>Available Diplomatic Actions</h3>';
        
        const actionsList = document.createElement('div');
        actionsList.className = 'diplomatic-actions-list';
        
        // Filter out actions that are already active
        const activeActionNames = this.activeAgreements
            .filter(a => a.faction === this.selectedFaction)
            .map(a => a.name);
        
        const availableActions = this.diplomaticActions.filter(
            action => !activeActionNames.includes(action.name)
        );
        
        if (availableActions.length === 0) {
            actionsList.innerHTML = '<p>No additional diplomatic actions available.</p>';
        } else {
            for (const action of availableActions) {
                const actionItem = document.createElement('div');
                actionItem.className = 'diplomatic-action';
                
                actionItem.innerHTML = `
                    <div class="diplomatic-action-header">
                        <div class="diplomatic-action-name">${action.name}</div>
                        <div class="diplomatic-action-cost">
                            ${Object.entries(action.cost).map(([resource, amount]) => 
                                `${resource}: ${amount}`
                            ).join(', ')}
                        </div>
                    </div>
                    <div class="diplomatic-action-description">${action.description}</div>
                    <div class="diplomatic-action-effect">Effect: ${action.effect}</div>
                `;
                
                // Add action button
                const actionButton = document.createElement('button');
                actionButton.className = 'diplomatic-action-button';
                actionButton.textContent = 'Propose Agreement';
                
                // Disable if reputation is too low
                const isReputationSufficient = this.factions[this.selectedFaction].reputation >= action.reputationRequired;
                actionButton.disabled = !isReputationSufficient;
                
                if (!isReputationSufficient) {
                    const requiredRep = document.createElement('div');
                    requiredRep.className = 'required-reputation';
                    requiredRep.textContent = `Requires ${action.reputationRequired} reputation`;
                    actionItem.appendChild(requiredRep);
                }
                
                // Add click event
                actionButton.addEventListener('click', () => this.proposeAgreement(action));
                
                actionItem.appendChild(actionButton);
                actionsList.appendChild(actionItem);
            }
        }
        
        this.diplomaticActionsPanel.appendChild(actionsList);
    }
    
    /**
     * Propose a diplomatic agreement
     */
    proposeAgreement(action) {
        // Check if reputation is sufficient
        if (this.factions[this.selectedFaction].reputation < action.reputationRequired) {
            this.showNotification(`Insufficient reputation with ${this.selectedFaction}`, true);
            return;
        }
        
        // Check if resources are sufficient (would need to be integrated with main game)
        // For now, assume resources are sufficient
        
        // Add agreement to active agreements
        this.activeAgreements.push({
            faction: this.selectedFaction,
            name: action.name,
            effect: action.effect,
            startTime: Date.now()
        });
        
        // Update diplomatic status if needed
        this.updateDiplomaticStatus(this.selectedFaction);
        
        // Show notification
        this.showNotification(`${action.name} established with ${this.selectedFaction}`);
        
        // Update UI
        this.updateFactionInfoPanel();
        this.updateDiplomaticActionsPanel();
        this.updateFactionList();
    }
    
    /**
     * Update diplomatic status based on reputation and agreements
     */
    updateDiplomaticStatus(factionName) {
        const reputation = this.factions[factionName].reputation;
        const agreements = this.activeAgreements.filter(a => a.faction === factionName);
        
        let newStatus = "Neutral";
        
        if (reputation >= 75 || agreements.some(a => a.name === "Military Alliance")) {
            newStatus = "Allied";
        } else if (reputation >= 60 || agreements.some(a => a.name === "Trade Agreement" || a.name === "Research Partnership")) {
            newStatus = "Friendly";
        } else if (reputation <= 25) {
            newStatus = "Hostile";
        } else if (reputation <= 40) {
            newStatus = "Unfriendly";
        }
        
        this.diplomaticStatus[factionName] = newStatus;
    }
    
    /**
     * Update faction list UI
     */
    updateFactionList() {
        document.querySelectorAll('.faction-list-item').forEach(item => {
            const factionName = item.dataset.faction;
            const factionData = this.factions[factionName];
            
            // Update reputation bar
            const reputationBar = item.querySelector('.faction-reputation-fill');
            reputationBar.style.width = `${factionData.reputation}%`;
            
            // Update status
            const statusElement = item.querySelector('.faction-status');
            statusElement.textContent = this.diplomaticStatus[factionName];
            
            // Update status class
            statusElement.className = 'faction-status';
            if (factionData.reputation >= 75) statusElement.classList.add('allied');
            else if (factionData.reputation >= 60) statusElement.classList.add('friendly');
            else if (factionData.reputation <= 25) statusElement.classList.add('hostile');
            else if (factionData.reputation <= 40) statusElement.classList.add('unfriendly');
            else statusElement.classList.add('neutral');
        });
    }
    
    /**
     * Change reputation with a faction
     */
    changeReputation(factionName, amount) {
        if (!this.factions[factionName]) return;
        
        // Update reputation value
        this.factions[factionName].reputation = Math.max(0, Math.min(100, this.factions[factionName].reputation + amount));
        
        // Update diplomatic status
        this.updateDiplomaticStatus(factionName);
        
        // Update UI if visible
        if (this.reputationContainer.style.display !== 'none') {
            this.updateFactionList();
            
            if (this.selectedFaction === factionName) {
                this.updateFactionInfoPanel();
                this.updateDiplomaticActionsPanel();
            }
        }
    }
    
    /**
     * Show the reputation system interface
     */
    showReputationSystem() {
        this.reputationContainer.style.display = 'flex';
        
        // Select first faction by default if none selected
        if (!this.selectedFaction) {
            this.selectFaction(Object.keys(this.factions)[0]);
        }
    }
    
    /**
     * Hide the reputation system interface
     */
    hideReputationSystem() {
        this.reputationContainer.style.display = 'none';
    }
    
    /**
     * Show notification
     */
    showNotification(message, isError = false) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('reputation-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'reputation-notification';
            document.body.appendChild(notification);
            
            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                #reputation-notification {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(20, 30, 60, 0.9);
                    border: 1px solid #2a3a6a;
                    border-radius: 5px;
                    padding: 10px 20px;
                    color: #ffffff;
                    font-weight: bold;
                    z-index: 100;
                    transition: all 0.3s ease;
                    opacity: 0;
                    pointer-events: none;
                }
                
                #reputation-notification.show {
                    opacity: 1;
                }
                
                #reputation-notification.error {
                    background: rgba(60, 20, 20, 0.9);
                    border-color: #6a2a2a;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set notification content and show
        notification.textContent = message;
        notification.className = isError ? 'error show' : 'show';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.className = '';
        }, 3000);
    }
    
    /**
     * Process reputation effects from game events
     */
    processReputationEvent(eventType, targetFaction, amount = 5) {
        switch (eventType) {
            case 'conquest':
                // Conquering a planet reduces reputation with its faction
                this.changeReputation(targetFaction, -amount);
                break;
            case 'mission':
                // Completing a mission for a faction increases reputation
                this.changeReputation(targetFaction, amount);
                break;
            case 'trade':
                // Trading with a faction slightly increases reputation
                this.changeReputation(targetFaction, Math.ceil(amount / 2));
                break;
            case 'attack':
                // Attacking a faction significantly reduces reputation
                this.changeReputation(targetFaction, -amount * 2);
                break;
            case 'defend':
                // Defending a faction significantly increases reputation
                this.changeReputation(targetFaction, amount * 2);
                break;
        }
    }
}

// Export the ReputationSystem class
window.ReputationSystem = ReputationSystem;
