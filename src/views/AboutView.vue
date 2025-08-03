<script setup lang="ts">
import BottomNav from '../components/BottomNav.vue'
</script>

<template>
  <main class="container">
    <div class="about">
      <h1>About Learn Like K</h1>
      <p>A simple rote memorization learning tool inspired by Japanese kana learning applications.</p>
      
      <div class="features">
        <h2>Features</h2>
        <ul>
          <li><strong>YAML Topic Loading</strong> - Define your own question sets or use predefined topics</li>
          <li><strong>Flexible Question Sets</strong> - Enable/disable specific sets of questions</li>
          <li><strong>Persistent Settings</strong> - Your topic and preferences are saved automatically</li>
          <li><strong>Static Hosting</strong> - Runs entirely in your browser, no server needed</li>
        </ul>
      </div>

      <div class="tech-stack">
        <h2>Built With</h2>
        <ul>
          <li>Vue 3 + TypeScript</li>
          <li>Vite for build tooling</li>
          <li>Pinia for state management</li>
          <li>js-yaml for YAML parsing</li>
          <li>Claude Code for AI-assisted development</li>
        </ul>
      </div>
    </div>

    <BottomNav />
  </main>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.about {
  flex: 1;
}

.about h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.about p {
  font-size: 1.1em;
  line-height: 1.6;
  color: #555;
  margin-bottom: 30px;
}

.features, .tech-stack {
  margin-bottom: 30px;
}

.features h2, .tech-stack h2 {
  color: #2c3e50;
  margin-bottom: 15px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.features ul, .tech-stack ul {
  list-style: none;
  padding: 0;
}

.features li, .tech-stack li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.features li:last-child, .tech-stack li:last-child {
  border-bottom: none;
}

.features strong {
  color: #3498db;
}
</style>
