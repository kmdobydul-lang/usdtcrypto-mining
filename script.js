// Smart Demo Website - Complete JavaScript
class SmartDemoSystem {
    constructor() {
        this.invites = JSON.parse(localStorage.getItem('demoInvites')) || [];
        this.highlightColor = '#ffff99';
        this.updateInviteDisplay();
        this.logToConsole('🚀 Smart Demo System Initialized');
        this.logToConsole('💡 Type commands or use control buttons');
    }

    // Smart Highlight System
    highlightElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('highlight-active');
            setTimeout(() => {
                element.classList.remove('highlight-active');
            }, 2000);
        }
    }

    highlightAllSections() {
        this.logToConsole('✨ Starting Smart Highlight Demo...');
        const sections = document.querySelectorAll('.section');
        
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('highlight-active');
                this.logToConsole(`🔦 Highlighting: ${section.id || 'Unknown Section'}`);
                
                setTimeout(() => {
                    section.classList.remove('highlight-active');
                }, 2000);
            }, index * 800);
        });
        
        this.logToConsole('✅ All sections highlighted successfully!');
    }

    // Invitation System
    generateInviteCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    createInvite(email, role = 'member') {
        const newInvite = {
            id: Date.now(),
            email: email,
            role: role,
            inviteCode: this.generateInviteCode(),
            status: 'pending',
            createdAt: new Date().toLocaleString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString()
        };
        
        this.invites.push(newInvite);
        this.saveToLocalStorage();
        this.updateInviteDisplay();
        
        this.logToConsole(`📧 New invitation created for: ${email}`);
        this.logToConsole(`🔑 Invite Code: ${newInvite.inviteCode} | Role: ${role}`);
        
        return newInvite;
    }

    sendInvite(email = 'demo@example.com', role = 'member') {
        this.logToConsole(`📤 Sending invitation to: ${email}`);
        
        // Simulate API call delay
        setTimeout(() => {
            const invite = this.createInvite(email, role);
            this.logToConsole(`✅ Invitation sent successfully!`);
            this.logToConsole(`📋 Code: ${invite.inviteCode} | Status: ${invite.status}`);
            
            // Highlight invitation section
            this.highlightElement('invitation-system');
        }, 1000);
    }

    acceptInvite(inviteCode = null, userName = 'Demo User') {
        if (!inviteCode) {
            inviteCode = prompt('Enter invitation code:') || 'DEMO123';
        }
        
        this.logToConsole(`🔍 Searching for invite code: ${inviteCode}`);
        
        const invite = this.invites.find(inv => inv.inviteCode === inviteCode);
        
        if (invite) {
            invite.status = 'accepted';
            invite.acceptedBy = userName;
            invite.acceptedAt = new Date().toLocaleString();
            
            this.saveToLocalStorage();
            this.updateInviteDisplay();
            
            this.logToConsole(`🎉 Welcome ${userName}! Invitation accepted successfully!`);
            this.highlightElement('invitation-system');
        } else {
            this.logToConsole(`❌ Invalid invitation code: ${inviteCode}`, 'error');
        }
    }

    showAllInvites() {
        this.logToConsole('📊 === ALL INVITATIONS ===');
        
        if (this.invites.length === 0) {
            this.logToConsole('No invitations found. Send some invites first!');
            return;
        }
        
        this.invites.forEach(invite => {
            this.logToConsole(
                `📨 ${invite.email} | Code: ${invite.inviteCode} | ` +
                `Role: ${invite.role} | Status: ${invite.status}`
            );
        });
        
        this.highlightElement('invitation-system');
    }

    // Utility Methods
    updateInviteDisplay() {
        const inviteCount = document.getElementById('inviteCount');
        const inviteList = document.getElementById('inviteList');
        
        if (inviteCount) inviteCount.textContent = this.invites.length;
        
        if (inviteList) {
            inviteList.innerHTML = this.invites
                .map(invite => `
                    <div class="invite-item">
                        <strong>${invite.email}</strong> 
                        | Code: ${invite.inviteCode}
                        | Role: ${invite.role}
                        | Status: <span style="color: ${invite.status === 'accepted' ? 'green' : 'orange'}">
                            ${invite.status}
                        </span>
                    </div>
                `)
                .join('');
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('demoInvites', JSON.stringify(this.invites));
    }

    logToConsole(message, type = 'info') {
        const consoleOutput = document.getElementById('console-output');
        if (consoleOutput) {
            const line = document.createElement('div');
            line.className = 'console-line';
            line.style.color = type === 'error' ? '#ff4444' : '#00ff00';
            line.textContent = `> ${message}`;
            consoleOutput.appendChild(line);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
        
        // Also log to browser console
        console.log(`[SmartDemo] ${message}`);
    }

    resetDemo() {
        if (confirm('Are you sure you want to reset the demo? All invites will be deleted.')) {
            this.invites = [];
            this.saveToLocalStorage();
            this.updateInviteDisplay();
            this.logToConsole('🔄 Demo reset successfully! All data cleared.');
        }
    }

    smartDemo() {
        this.logToConsole('🤖 Starting Smart Auto-Demo...');
        
        // Sequence of automated demo actions
        setTimeout(() => this.highlightAllSections(), 1000);
        setTimeout(() => this.sendInvite('user1@demo.com', 'member'), 3000);
        setTimeout(() => this.sendInvite('admin@demo.com', 'admin'), 5000);
        setTimeout(() => this.acceptInvite(this.invites[0]?.inviteCode, 'John Doe'), 7000);
        setTimeout(() => this.showAllInvites(), 9000);
        
        this.logToConsole('✅ Smart Demo sequence started! Watch the magic happen...');
    }
}

// Initialize the system
const demoSystem = new SmartDemoSystem();

// Global functions for HTML buttons
function sendInvite() {
    demoSystem.sendInvite();
}

function acceptInvite() {
    demoSystem.acceptInvite();
}

function highlightAll() {
    demoSystem.highlightAllSections();
}

function showAllInvites() {
    demoSystem.showAllInvites();
}

function resetDemo() {
    demoSystem.resetDemo();
}

function smartDemo() {
    demoSystem.smartDemo();
}

function customInvite() {
    const email = document.getElementById('emailInput').value || 'demo@example.com';
    const role = document.getElementById('roleSelect').value;
    demoSystem.sendInvite(email, role);
}

function executeCommand() {
    const commandInput = document.getElementById('command-input');
    const command = commandInput.value.trim();
    
    if (!command) return;
    
    demoSystem.logToConsole(`💻 Executing: ${command}`);
    commandInput.value = '';
    
    // Simple command parser
    try {
        if (command === 'highlightAll()') {
            highlightAll();
        } else if (command === 'sendInvite()') {
            sendInvite();
        } else if (command === 'acceptInvite()') {
            acceptInvite();
        } else if (command === 'showAllInvites()') {
            showAllInvites();
        } else if (command === 'resetDemo()') {
            resetDemo();
        } else if (command === 'smartDemo()') {
            smartDemo();
        } else if (command.startsWith('sendInvite(')) {
            const match = command.match(/sendInvite\(\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\)/);
            if (match) {
                demoSystem.sendInvite(match[1], match[2]);
            } else {
                demoSystem.logToConsole('❌ Invalid syntax. Use: sendInvite("email", "role")', 'error');
            }
        } else {
            demoSystem.logToConsole(`❌ Unknown command: ${command}`, 'error');
            demoSystem.logToConsole('💡 Available commands: highlightAll(), sendInvite(), acceptInvite(), showAllInvites(), resetDemo(), smartDemo()');
        }
    } catch (error) {
        demoSystem.logToConsole(`❌ Error executing command: ${error.message}`, 'error');
    }
}

// Add Enter key support for command input
document.getElementById('command-input')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        executeCommand();
    }
});

// Add click handlers for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        demoSystem.logToConsole(`🔍 Clicked on feature: ${section}`);
        demoSystem.highlightElement('features');
    });
});

// Initial demo message
setTimeout(() => {
    demoSystem.logToConsole('🎯 Try the "Smart Demo" button for automated showcase!');
}, 2000);
