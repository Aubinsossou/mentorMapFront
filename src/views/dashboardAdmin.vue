

<script setup></script>

<template>
  <div class="adminDashboard">
    <header class="dashboard-header">
      <div class="dashboard-header-content">
        <div class="logo" style="display: block; width:">
          <span class="logo-icon">🎓</span>
          <span class="logo-text">Mentor MAP</span>
        </div>
        <div class="dashboard-link">
          <ul>
            <li><router-link to="#">Admin</router-link></li>
            <li><router-link to="#">Mentoree</router-link></li>
            <li><router-link to="#">Mentor</router-link></li>
          </ul>
        </div>
      </div>
    </header>
    <div class="dashboard-header-content-partie2">
      <div class="containerNew">
        <div class="dashboard-header-content-partie2-header">
          <div></div>
          <div class="menu-content">
            <button class="btn-primary">Deconnexion</button>
          </div>
        </div>
      </div>
      <div class="dashboard-header-content-partie2-body">
        <h1>body</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.containerNew {
  width: 1550px;
  margin: 0 auto;
}
/*Header */

.adminDashboard {
  display: flex;
}

.dashboard-header {
  height: 100vh;
  min-width: 300px;
  padding: 30px;
  border-radius: 0 5px 5px 0;
  box-shadow: 3px 7px 8px  rgb(149, 149, 225);
}

.logo {
  margin-bottom: 70px;
}

.logo-text {
  font-size: 2rem;
}
.dashboard-link ul {
  display: flex;
  align-content: center;
  flex-direction: column;
}
.dashboard-link li {
  margin-bottom: 50px;
  background-color: #d5d8e6;
  border-radius: 50px;
  padding: 30px 70px;
  text-align: center;
  font-size: 1.2rem;
}
.dashboard-link li:hover {
  background-color: white;
  cursor: pointer;
}
.dashboard-link li:active {
  background-color: white;
  cursor: pointer;
}

/*Menu */
.dashboard-header-content-partie2 {
  margin: 0 5px;
}
.dashboard-header-content-partie2-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  height: 100px;
  width: 100%;
  box-shadow: 6px 1px 8px 17px rgb(199, 189, 189);
  margin: 10px 10px 50px 10px;
}
.dashboard-header-content-partie2-body {
}

.menu-content button{
    margin-right: 20px;
}
</style>
