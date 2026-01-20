<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { apiGet } from '@/helpers/axiosApi'

// État
const sidebarOpen = ref(true)
const infoPanelOpen = ref(true)
const searchQuery = ref('')
const newMessage = ref('')
const isTyping = ref(false)
const showEmojiPicker = ref(false)
const messagesContainer = ref(null)
const fileInput = ref(null)
const indexConversation = ref(0)

const associatementorMentoree = ref()

/* PArtie Pratique */

const apiAssociatementorMentoree = async () => {
  //loading.value = true

  const response = await apiGet(
    'http://localhost:8000/api/v1/mentoree/mentorsAssocie'
  )
  associatementorMentoree.value = response
  console.log('associatementorMentoree.value: ', associatementorMentoree.value)
 // loading.value = false
}




// Conversations
const conversations = ref([
  {
    id: 1,
    name: 'Sophie Martin',
    domain: 'Développement Web',
    lastMessage: 'Super ! À bientôt alors 😊',
    lastTime: '10:30',
    unread: 0,
    online: true
  },
  {
    id: 2,
    name: 'Jean Kouassi',
    domain: 'Marketing Digital',
    lastMessage: 'J\'ai regardé ton projet, c\'est bien !',
    lastTime: 'Hier',
    unread: 2,
    online: false
  },
 
])

const currentMentor = ref(conversations.value[indexConversation.value])

// Messages
const messages = ref([
  {
    id: 1,
    text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    time: '09:15',
    isMine: false,
    read: true
  },
  {
    id: 2,
    text: 'Bonjour Sophie ! J\'aimerais avoir des conseils sur Vue.js 3',
    time: '09:18',
    isMine: true,
    read: true
  },
  {
    id: 3,
    text: 'Excellent choix ! Vue 3 apporte beaucoup d\'améliorations. Quelle est votre expérience actuelle avec Vue ?',
    time: '09:20',
    isMine: false,
    read: true
  },
  {
    id: 4,
    text: 'J\'ai déjà utilisé Vue 2, mais je veux passer à Vue 3 pour un nouveau projet',
    time: '09:22',
    isMine: true,
    read: true
  },
 
])

// Émojis
const emojis = ref([
  '😊', '😂', '❤️', '👍', '👏', '🙏', '🎉', '🔥',
  '✨', '💯', '🚀', '💪', '👌', '✅', '❌', '🤔'
])

// Computed
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value
  return conversations.value.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
const selectConversation = (conv) => {
  currentMentor.value = conv
  conv.unread = 0
  sidebarOpen.value = false // Fermer sur mobile
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  messages.value.push({
    id: messages.value.length + 1,
    text: newMessage.value,
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    isMine: true,
    read: false
  })

  newMessage.value = ''

  scrollToBottom()

  // Simuler une réponse
  setTimeout(() => {
    isTyping.value = true
  }, 1000)

  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      id: messages.value.length + 1,
      text: 'Merci pour votre message ! Je vais y répondre dans quelques instants.',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMine: false,
      read: false
    })
    scrollToBottom()
  }, 3000)
}

const sendQuickMessage = (text) => {
  newMessage.value = text
  sendMessage()
}

const addEmoji = (emoji) => {
  newMessage.value += emoji
  showEmojiPicker.value = false
}

const handleTyping = () => {
  // Simuler l'indicateur "en train d'écrire"
  console.log('Utilisateur en train d\'écrire...')
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    messages.value.push({
      id: messages.value.length + 1,
      text: 'Fichier envoyé',
      file: file.name,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      read: false
    })
    scrollToBottom()
  }
}

const shareFile = () => {
  fileInput.value.click()
}

const scheduleSession = () => {
  alert('Fonctionnalité de planification à implémenter')
}

const viewFullProfile = () => {
  alert('Redirection vers le profil complet du mentor')
}

const goBack = () => {
  alert('Retour à la liste des mentors')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  apiAssociatementorMentoree()
  scrollToBottom()
})
</script>


<template>
  <div class="chat-page">
    <!-- Header -->
    <header class="chat-header">
      <div class="header-left" v-if="associatementorMentoree">
        <button @click="goBack" class="btn-back">←</button>
        <div class="mentor-info-header">
          <div class="avatar-small">{{ associatementorMentoree.mentorsAssocies[indexConversation].name.charAt(0) }}</div>
          <div class="info-text">
            <h3 class="mentor-name-header">{{ associatementorMentoree.mentorsAssocies[indexConversation].name }}</h3>
            <span class="status" :class="{ online: currentMentor.online }">
              <span class="status-dot"></span>
              {{ currentMentor.online ? 'En ligne' : 'Hors ligne' }}
            </span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-icon" title="Appel vocal">📞</button>
        <button class="btn-icon" title="Appel vidéo">📹</button>
        <button class="btn-icon" title="Plus d'options">⋮</button>
      </div>
    </header>

    <div class="chat-container">
      <!-- Sidebar - Liste des conversations -->
      <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
        <div class="sidebar-header">
          <h2 class="sidebar-title">💬 Mes conversations</h2>
          <button @click="sidebarOpen = !sidebarOpen" class="btn-toggle">
            {{ sidebarOpen ? '✕' : '☰' }}
          </button>
        </div>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher..."
            class="search-input"
          />
        </div>

        <div class="conversations-list" v-if="associatementorMentoree">
          <div 
            v-for="conv in associatementorMentoree.mentorsAssocies" 
            :key="conv.id"
            class="conversation-item"
            :class="{ active: currentMentor.id === conv.id }"
            @click="selectConversation(conv)"
          >
            <div class="conv-avatar">
              {{ conv?.name?.charAt(0) }}
              <span v-if="conv.online" class="online-indicator"></span>
            </div>
            <div class="conv-info" >
              <div class="conv-header">
                <h4 class="conv-name">{{ conv.name }}</h4>
                <span class="conv-time">{{ conv.lastTime }}</span>
              </div>
              <div class="conv-preview">
                <p class="last-message">{{ conv.lastMessage }}</p>
                <span v-if="conv.unread" class="unread-badge">{{ conv.unread }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Zone de chat principale -->
      <main class="chat-main">
        <!-- Messages -->
        <div class="messages-container" ref="messagesContainer" >
          <!-- Date separator -->
          <div class="date-separator">
            <span>Aujourd'hui</span>
          </div>

          <!-- Messages -->
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message"
            :class="{ 'message-sent': message.isMine, 'message-received': !message.isMine }"
          >
            <div v-if="!message.isMine" class="message-avatar">
              {{ currentMentor.name.charAt(0) }}
            </div>
            
            <div class="message-content">
              <div v-if="!message.isMine" class="message-sender">{{ currentMentor.name }}</div>
              
              <div class="message-bubble" :class="{ 'bubble-sent': message.isMine }">
                <p class="message-text">{{ message.text }}</p>
                <div v-if="message.file" class="message-file">
                  <span class="file-icon">📎</span>
                  <span class="file-name">{{ message.file }}</span>
                </div>
              </div>
              
              <div class="message-meta">
                <span class="message-time">{{ message.time }}</span>
                <span v-if="message.isMine" class="message-status">
                  {{ message.read ? '✓✓' : '✓' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="typing-indicator">
            <div class="typing-avatar">{{ currentMentor.name.charAt(0) }}</div>
            <div class="typing-bubble">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>

        <!-- Input zone -->
        <div style="position: fixed; bottom:0; width:66%; margin: 0 18px" >
          <div class="input-container">
            <button class="btn-attach" title="Joindre un fichier">
              <input type="file" ref="fileInput" @change="handleFileSelect" hidden />
              📎
            </button>
            
            <button class="btn-emoji" @click="showEmojiPicker = !showEmojiPicker" title="Émojis">
              😊
            </button>

            <!-- Emoji Picker -->
            <div v-if="showEmojiPicker" class="emoji-picker">
              <div class="emoji-grid">
                <span 
                  v-for="emoji in emojis" 
                  :key="emoji"
                  class="emoji-item"
                  @click="addEmoji(emoji)"
                >
                  {{ emoji }}
                </span>
              </div>
            </div>

            <textarea 
              v-model="newMessage"
              @keydown.enter.exact.prevent="sendMessage"
              @input="handleTyping"
              placeholder="Écrivez votre message..."
              class="message-input"
              rows="1"
            ></textarea>

            <button 
              @click="sendMessage" 
              class="btn-send"
              :disabled="!newMessage.trim()"
            >
              <span class="send-icon">📤</span>
            </button>
          </div>

          <!-- Quick actions -->
          <div class="quick-actions">
            <button class="quick-btn" @click="sendQuickMessage('Bonjour ! 👋')">
              <span>👋</span>
              <span>Saluer</span>
            </button>
            <button class="quick-btn" @click="sendQuickMessage('Merci beaucoup ! 🙏')">
              <span>🙏</span>
              <span>Remercier</span>
            </button>
            <button class="quick-btn" @click="scheduleSession">
              <span>📅</span>
              <span>Planifier</span>
            </button>
            <button class="quick-btn" @click="shareFile">
              <span>📂</span>
              <span>Fichier</span>
            </button>
          </div>
        </div>
      </main>

      <!-- Panel d'informations -->
      <aside class="info-panel" :class="{ 'panel-open': infoPanelOpen }">
        <button @click="infoPanelOpen = !infoPanelOpen" class="btn-toggle-panel">
          {{ infoPanelOpen ? '→' : '←' }}
        </button>

        <div class="panel-content">
          <div class="mentor-profile-mini" v-if="associatementorMentoree">
            <div class="avatar-large">{{ associatementorMentoree.mentorsAssocies[indexConversation].name.charAt(0) }}</div>
            <h3 class="profile-name">{{ associatementorMentoree.mentorsAssocies[indexConversation].name }}</h3>
            <p class="profile-role">{{ associatementorMentoree.mentorsAssocies[indexConversation].domaines[1].name }}</p>
            <button @click="viewFullProfile" class="btn-view-profile">
              Voir le profil complet
            </button>
          </div>

          <div class="panel-section">
            <h4 class="panel-section-title">📅 Prochaine session</h4>
            <div class="session-card">
              <div class="session-date">
                <span class="date-day">15</span>
                <span class="date-month">Déc</span>
              </div>
              <div class="session-info">
                <p class="session-time">14h00 - 15h00</p>
                <p class="session-type">Session de mentorat</p>
              </div>
            </div>
          </div>

          <div class="panel-section">
            <h4 class="panel-section-title">📎 Fichiers partagés</h4>
            <div class="shared-files">
              <div class="file-item">
                <span class="file-icon-mini">📄</span>
                <span class="file-name-mini">Cours_Vue3.pdf</span>
              </div>
              <div class="file-item">
                <span class="file-icon-mini">📊</span>
                <span class="file-name-mini">Projet_Final.zip</span>
              </div>
              <div class="file-item">
                <span class="file-icon-mini">🖼️</span>
                <span class="file-name-mini">Screenshot.png</span>
              </div>
            </div>
            <button class="btn-see-all">Voir tout</button>
          </div>

          
        </div>
      </aside>
    </div>
  </div>

</template>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

/* Header */
.chat-header {
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-back {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back:hover {
  background: #e2e8f0;
  transform: scale(1.1);
}

.mentor-info-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-small {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.mentor-name-header {
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 700;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #64748b;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
}

.status.online .status-dot {
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-icon:hover {
  background: #e2e8f0;
  transform: scale(1.1);
}

/* Chat Container */
.chat-container {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr 300px;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-title {
  font-size: 1.2rem;
  color: #1e293b;
  font-weight: 700;
}

.btn-toggle {
  display: none;
  width: 36px;
  height: 36px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
}

.search-box {
  margin: 16px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  padding: 16px 20px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f8fafc;
}

.conversation-item:hover {
  background: #f8fafc;
}

.conversation-item.active {
  background: #eff6ff;
  border-left: 3px solid #2563eb;
}

.conv-avatar {
  position: relative;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #64748b, #475569);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  flex-shrink: 0;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.conv-info {
  flex: 1;
  min-width: 0;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.conv-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.conv-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.conv-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-message {
  font-size: 0.9rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  background: #2563eb;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}

/* Chat Main */
.chat-main {
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  height: 700px;

}

.messages-container {
  flex: 1;
   overflow-y: auto;  
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.date-separator {
  text-align: center;
  margin: 20px 0;
}

.date-separator span {
  background: #e2e8f0;
  color: #64748b;
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 70%;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-sender {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.message-bubble {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.bubble-sent {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
}

.message-file {
  margin-top: 8px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bubble-sent .message-file {
  background: rgba(255, 255, 255, 0.2);
}

.file-icon {
  font-size: 1.2rem;
}

.file-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.message-sent .message-meta {
  justify-content: flex-end;
}

.message-status {
  color: #10b981;
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.typing-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
}

.typing-bubble {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  animation: bounce 1.4s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}

/* Input Zone */
.input-zone {
position: fixed;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
  bottom: 0;
  width: 68%;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 8px 12px;
  position: relative;
}

.input-container:focus-within {
  border-color: #2563eb;
}

.btn-attach,
.btn-emoji {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.3s;
}

.btn-attach:hover,
.btn-emoji:hover {
  background: #e2e8f0;
}

.emoji-picker {
  position: absolute;
  bottom: 60px;
  left: 50px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 100;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
  max-width: 320px;
}

.emoji-item {
  font-size: 1.5rem;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s;
}

.emoji-item:hover {
  background: #f1f5f9;
  transform: scale(1.2);
}

.message-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  resize: none;
  max-height: 120px;
  font-family: inherit;
}

.message-input:focus {
  outline: none;
}

.btn-send {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-send:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  font-size: 1.2rem;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 8px 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-2px);
}

/* Info Panel */
.info-panel {
  background: white;
  border-left: 1px solid #e2e8f0;
  overflow-y: auto;
  position: relative;
  transition: transform 0.3s;
}

.btn-toggle-panel {
  position: absolute;
  top: 20px;
  left: -15px;
  width: 30px;
  height: 30px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.3s;
}

.btn-toggle-panel:hover {
  background: #f1f5f9;
  transform: scale(1.1);
}

.panel-content {
  padding: 24px;
}

.mentor-profile-mini {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 auto 16px;
}

.profile-name {
  font-size: 1.2rem;
  color: #1e293b;
  margin-bottom: 6px;
  font-weight: 700;
}

.profile-role {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.btn-view-profile {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view-profile:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.3);
}

.panel-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-section:last-child {
  border-bottom: none;
}

.panel-section-title {
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 16px;
  font-weight: 700;
}

.session-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #eff6ff;
  border: 2px solid #bfdbfe;
  border-radius: 12px;
}

.session-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  padding: 12px;
  border-radius: 10px;
  min-width: 60px;
}

.date-day {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 0.85rem;
  text-transform: uppercase;
  font-weight: 600;
}

.session-info {
  flex: 1;
}

.session-time {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.session-type {
  font-size: 0.9rem;
  color: #64748b;
}

.shared-files {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.file-item:hover {
  background: #f1f5f9;
}

.file-icon-mini {
  font-size: 1.3rem;
}

.file-name-mini {
  font-size: 0.9rem;
  color: #475569;
  font-weight: 500;
}

.btn-see-all {
  width: 100%;
  padding: 8px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.3s;
}

.btn-see-all:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 100%;
  padding: 12px;
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.action-btn.danger {
  color: #ef4444;
}

.action-btn.danger:hover {
  background: #fee2e2;
}

/* Responsive */
@media (max-width: 1280px) {
  .chat-container {
    grid-template-columns: 300px 1fr;
  }

  .info-panel {
    position: fixed;
    right: 0;
    top: 73px;
    bottom: 0;
    width: 300px;
    transform: translateX(100%);
    z-index: 20;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  }

  .info-panel.panel-open {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .chat-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 73px;
    bottom: 0;
    width: 320px;
    transform: translateX(-100%);
    z-index: 30;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .btn-toggle {
    display: flex;
  }

  .header-actions .btn-icon:nth-child(2),
  .header-actions .btn-icon:nth-child(3) {
    display: none;
  }

  .message {
    max-width: 85%;
  }

  .quick-actions {
    overflow-x: auto;
    flex-wrap: nowrap;
  }
}

@media (max-width: 480px) {
  .chat-header {
    padding: 12px 16px;
  }

  .messages-container {
    padding: 16px;
  }

  .input-zone {
    padding: 12px 16px;
  }

  .sidebar {
    width: 280px;
  }
}


</style>
  