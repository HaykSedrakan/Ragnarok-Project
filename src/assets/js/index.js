import '../styles/reset.scss'
import '../styles/mixins.scss'
import '../styles/styles.scss'

import { languages } from './langauges'

const classes = {
    opened:'opened',
    hidden:'hidden',
    active:'active'
}

const checkboxes = {
    requirements: ["minimum", "recommended"],
    versions: ["standard", "limited"],
}

let isPlay = false

const checkbox = document.querySelectorAll('.checkbox')
const menuLink = document.querySelectorAll('.menu-link')
const header = document.querySelector('.header')
const menuButton = document.querySelector('.header-menu__button')
const video = document.getElementById('video')
const videoButton = document.querySelector('.video-btn')
const faqItem = document.querySelectorAll('.faq-item')
const sections = document.querySelectorAll('.section')
const language = document.querySelectorAll('.language')

const toggleMenu = () =>  header.classList.toggle(classes.opened)

const scrollToSection = (e) => {
    e.preventDefault()

    const href = e.currentTarget.getAttribute('href')

    if(!href && !href.startsWith('#')) return

    const section = href.slice(1)
    const top = document.getElementById(section)?.offsetTop || 0

    window.scrollTo({top,behavior:'smooth'})
}

const formatValue = val => val < 10 ? `0${val}` : val

const getTimerValues = (diff) => ({

    seconds:(diff / 1000) % 60,
    minutes:(diff / (1000 * 60)) % 60,
    hours:(diff / (1000 * 60 * 60)) % 24,
    days:(diff / (1000 * 60 * 60 * 24)) % 30,
})

const setTimerValues = (values) => {
    Object.entries(values).forEach(([key,value]) => {
        const timerValue = document.getElementById(key)
        timerValue.innerText = formatValue(Math.floor(value))
    })
}

const startTimer = date => {
  const id = setInterval(() => {
        const diff = new Date(date).getTime() - new Date().getTime()

        if(diff < 0)
        {
            clearInterval(id)
        }
        
        setTimerValues(getTimerValues(diff ))

    },1000) 
}

const handleVideo = ({target}) => {
    const info = target.parentElement

    isPlay = !isPlay

    info.classList.toggle(classes.hidden,isPlay)
    target.innerText = isPlay ? 'pause' : 'play'
    isPlay ? video.play() : video.pause()
}

const handleCheckbox = ({currentTarget:{checked,name}}) => {
   const {active} = classes

   const value = checkboxes[name][Number(checked)]
   const list = document.getElementById(value)
   const tabs = document.querySelectorAll(`[data-${name}]`)
   const siblings = list.parentElement.children

   for(const item of siblings) item.classList.remove(active)
  
   for (const tab of tabs) {
    tab.classList.remove(active);
    tab.dataset[name] === value && tab.classList.add(active);
  }
  
   list.classList.add(active)
}

const initSlider = () => {
    new Swiper('.swiper',{
        loop:true,
        slidesPerView:3,
        spaceBetween:20,
        initialSlide:2,
        navigation:{
            nextEl: '.swiper-button-next',
            prevEl:'.swiper-button-prev'
        }
    })
}

const handleFaqItem = ({currentTarget:target}) => {
    target.classList.toggle(classes.opened)

    const isOpened = target.classList.contains(classes.opened)
    const height = target.querySelector('p').clientHeight
    const content = target.querySelector(' .faq-item__content')

    content.style.height = `${isOpened ? height : 0}px`
}   

const handleScroll = () => {
    const {scrollY:y,innerHeight:h} = window

    sections.forEach(section => {
        if(y > section.offsetTop - h / 1.5){
            section.classList.remove(classes.hidden)
        }
    })
}

const setTexts = () => {
    const lang = localStorage.getItem('lang') || 'en'
    const content = languages[lang]

    Object.entries(content).forEach(([key,value]) => {
        const items = document.querySelectorAll(`[data-text=${key}]`)

        items.forEach(item => {
            item.innerText = value
        })
    })
}

const toggleLanguage = ({target}) => {
    const {lang} = target.dataset

    if(!lang) return

    localStorage.setItem('lang',lang)

    setTexts()
}

setTexts()
initSlider()
startTimer('November 9, 2023 00:00:00')
 menuButton.addEventListener('click',toggleMenu)
 menuLink.forEach(link => {
    link.addEventListener('click',scrollToSection)
 })

 videoButton.addEventListener('click',handleVideo)
 checkbox.forEach(box => {
    box.addEventListener('click',handleCheckbox)
 })

 window.addEventListener('scroll',handleScroll)

 faqItem.forEach(item => {
    item.addEventListener('click',handleFaqItem)
 })

 language.forEach(lang => {
    lang.addEventListener('click',toggleLanguage)
 })