// src/common/router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import { UserStore } from '../stores/UserStore'

const routes = [
    { path:'/test', component: ()=> import('../views/Test.vue')},
    { path:'/login', component: ()=> import('../views/Login.vue')},
    { path:'/movies', component: ()=> import('../views/Movies.vue')},
    { path:'/movies/:id', component: ()=> import('../views/Screening.vue')},
    { path:'/seats', component: ()=> import('../views/Seats.vue')},
    { path:'/movies/create', component: ()=> import('../views/AdminMovie.vue')},
    { path:'/movies/alter/:id', component: ()=> import('../views/AdminMovie.vue')},
    { path:'/screenings/create', component: ()=> import('../views/AdminScreening.vue')},
    { path:'/screenings/alter', component: ()=> import('../views/AdminScreening.vue')},
    { path:'/calender', component: ()=> import('../views/ScreeningCalender.vue')},
    { path:'/profile', component: ()=> import('../views/Profile.vue')},
    { path:'/statistic', component: ()=> import('../views/Statistic.vue')},
]


const router = createRouter({
    history: createWebHashHistory(),
    routes
});



export { router, routes };