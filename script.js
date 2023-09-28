/* Déclaration de variables. */
let nombrePaire = 0
let nombrePaireRetournee = 0
const formulaire = document.getElementById('formulaire')
const jeu = document.getElementById('jeu')
const boutonRecommencer = document.getElementById('boutonRecommencer')
const resultatDuJeu = document.getElementById('resultatJeu')
let premiereCarteCliquee = null
let deuxiemeCarteCilquee = null
const cartes = []

formulaire.addEventListener('submit', validerFormulaire)
resultatDuJeu.addEventListener('click', messageJeu)
jeu.hidden = true
boutonRecommencer.hidden = true
resultatDuJeu.hidden = true

/**
 * Il affiche un message à l'utilisateur, selon qu'il a gagné ou perdu, puis il arrête le chronomètre
 */
function messageJeu () {
  if (nombrePaireRetournee === nombrePaire && duree > 0) {
    resultatDuJeu.textContent = 'Vous avez gagné!'
  } else {
    resultatDuJeu.textContent = 'Vous avez perdu!'
  }
  boutonRecommencer.hidden = false
  resultatDuJeu.hidden = false
  clearInterval(intervalId)
}

/**
 * Il valide le formulaire et s'il n'y a pas d'erreurs, il masque le formulaire et affiche le jeu
 * @param e - l'objet événement
 */
function validerFormulaire (e) {
  e.preventDefault()
  const nom = document.getElementById('inpNom').value
  nombrePaire = parseInt(document.getElementById('nombrePaire').value)

  const regNom = /^[A-Za-z]{1,}$/

  let erreurDetectee = false
  if (nombrePaire > 10 || nombrePaire < 2) {
    document.getElementById('erreur-nombrePaire').textContent = 'Vous devez choisir un nombre de paire valide.'
    erreurDetectee = true
    e.preventDefault()
  } else {
    document.getElementById('erreur-nombrePaire').textContent = ''
  }

  if (regNom.test(nom) === false) {
    document.getElementById('erreur-nom').textContent = 'Vous devez saisir un nom valide.'
    erreurDetectee = true
    e.preventDefault()
  } else {
    document.getElementById('erreur-nom').textContent = ''
  }

  if (erreurDetectee === false) {
    formulaire.hidden = true
    jeu.hidden = false

    creerJeu(nombrePaire)
  }
}

/**
 * Créez les cartes en mémoire, mélangez-les, puis créez-les dans le DOM.
 * @param nombrePaire - nombre de paires de cartes
 */
function creerJeu (nombrePaire) {
  // Créer les cartes en mémoire
  for (let index = 0; index < nombrePaire; index++) {
    cartes.push(CreerCarte(index))
    cartes.push(CreerCarte(index))
  }
  // Mélanger les cartes
  const carteMelanger = melangerCartes()

  // Créer les cartes dans le DOM
  for (let i = 0; i < carteMelanger.length; i++) {
    const elementCarte = carteMelanger[i]
    jeu.appendChild(elementCarte.carteHTML)
  }
}

/**
 * Il prend un tableau de cartes et renvoie un nouveau tableau de cartes avec les mêmes cartes dans un
 * ordre différent
 * @returns Un tableau de cartes mélanger.
 */
function melangerCartes () {
  const cartesAMelanger = [...cartes]
  for (let index = 0; index < cartesAMelanger.length; index++) {
    const element = cartesAMelanger[index]
    const indexAleatoire = Math.floor(Math.random() * cartesAMelanger.length)
    const carteAleatoire = cartesAMelanger[indexAleatoire]

    cartesAMelanger[index] = carteAleatoire
    cartesAMelanger[indexAleatoire] = element
  }

  return cartesAMelanger
}

/**
 * Il crée un élément de bouton, lui ajoute des classes, lui ajoute un écouteur d'événement et renvoie
 * un objet avec certaines propriétés.
 * @param numeroCarte - le numéro de la carte
 * @returns un objet.
 */
function CreerCarte (numeroCarte) {
  const carteHTML = document.createElement('button')

  carteHTML.style.width = jeu.offsetWidth / (nombrePaire * 2) - 10 + 'px'
  carteHTML.style.height = (jeu.offsetWidth / (nombrePaire * 2) - 10) * 1.5 + 'px'
  carteHTML.style.fontSize = (jeu.offsetWidth / (nombrePaire * 2) - 10) / 2 + 'px'
  carteHTML.classList.add('carte')
  carteHTML.classList.add('carte-cachee')
  carteHTML.setAttribute('id-carte', cartes.length)
  carteHTML.addEventListener('click', function (e) { CliqueCarte(e) })

  const carteObjet = {
    idCarte: cartes.length,
    numeroCarte,
    carteHTML,
    retourne: false,
    paireTrouver: false,
    retournerCarte () {
      if (this.retourne === false) {
        this.carteHTML.textContent = this.numeroCarte
        this.retourne = true
        this.carteHTML.classList.replace('carte-cachee', 'carte-retournee')
      } else {
        this.carteHTML.textContent = ''
        this.retourne = false
        this.carteHTML.classList.replace('carte-retournee', 'carte-cachee')
      }
    }
  }

  return carteObjet
}

/**
 * Si la première carte est nulle, alors la première carte est la carte cliquée et la carte est
 * retournée. Si la première carte n'est pas nulle et que la première carte n'est pas la carte cliquée,
 * alors la deuxième carte est la carte cliquée et la carte est retournée. Si la première carte et la
 * deuxième carte ont le même numéro, alors les cartes sont valides et les cartes sont désactivées. Si
 * la première carte et la deuxième carte n'ont pas le même numéro, alors les cartes sont invalides et
 * les cartes sont cachées après une seconde.
 * @param e - l'objet événement
 */
function CliqueCarte (e) {
  const idCarteCliquee = e.target.getAttribute('id-carte')
  const carteCliquee = cartes[idCarteCliquee]

  if (premiereCarteCliquee == null) {
    premiereCarteCliquee = carteCliquee
    premiereCarteCliquee.retournerCarte()
  } else if (premiereCarteCliquee !== carteCliquee) {
    deuxiemeCarteCilquee = carteCliquee
    deuxiemeCarteCilquee.retournerCarte()

    if (premiereCarteCliquee.numeroCarte === deuxiemeCarteCilquee.numeroCarte) {
      premiereCarteCliquee.carteHTML.classList.add('carte-valide')
      deuxiemeCarteCilquee.carteHTML.classList.add('carte-valide')

      premiereCarteCliquee.paireTrouver = true
      deuxiemeCarteCilquee.paireTrouver = true

      premiereCarteCliquee.carteHTML.disabled = true
      deuxiemeCarteCilquee.carteHTML.disabled = true

      premiereCarteCliquee = null
      deuxiemeCarteCilquee = null

      nombrePaireRetournee++
      if (nombrePaireRetournee === nombrePaire) {
        desactiverToutesCartes()
        messageJeu()
      }
    } else {
      premiereCarteCliquee.carteHTML.classList.add('carte-invalide')
      deuxiemeCarteCilquee.carteHTML.classList.add('carte-invalide')

      desactiverToutesCartes()
      setTimeout(cacherCartes, 1000)
    }
  }
}

boutonRecommencer.addEventListener('click', recommencer)

/**
 * Si l'utilisateur clique sur le bouton 'recommencer', la page se rechargera et la fonction
 * messageJeu() sera appelée.
 */
function recommencer () {
  location.reload()
  messageJeu()
}

/**
 * Il désactive toutes les cartes
 */
function desactiverToutesCartes () {
  for (let index = 0; index < cartes.length; index++) {
    const carte = cartes[index]
    carte.carteHTML.disabled = true
  }
}

/**
 * Pour chaque carte du tableau de cartes, si la paire de la carte n'a pas été trouvée, activez la
 * carte.
 */
function activerToutesCartes () {
  for (let index = 0; index < cartes.length; index++) {
    const carte = cartes[index]
    if (carte.paireTrouver === false) {
      carte.carteHTML.disabled = false
    }
  }
}

/**
 * Cette fonction masque les cartes sur lesquelles l'utilisateur a cliqué, supprime la classe qui les
 * rend rouges et réactive toutes les cartes.
 */
function cacherCartes () {
  premiereCarteCliquee.retournerCarte()
  deuxiemeCarteCilquee.retournerCarte()
  premiereCarteCliquee.carteHTML.classList.remove('carte-invalide')
  deuxiemeCarteCilquee.carteHTML.classList.remove('carte-invalide')

  premiereCarteCliquee = null
  deuxiemeCarteCilquee = null
  activerToutesCartes()
}

// prendre le display du timer

const timerDisplay = document.getElementById('timer')

// mettre le temps en secondes
let duree = 300
let intervalId

/* Une fonction qui démarre le chronomètre lorsque l'utilisateur clique sur le jeu. */
jeu.addEventListener('click', function () {
  // commencer le timer

  if (!intervalId) {
    /* Une fonction qui décrémente le chronomètre à chaque seconde. */
    intervalId = setInterval(function () {
      duree--
      let minutes = Math.floor(duree / 60)
      let seconds = duree % 60

      // afficher le temps restant
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      timerDisplay.innerHTML = minutes + ':' + seconds

      // si le temps est écoulé, arrêter le timer
      if (duree < 0) {
        timerDisplay.innerHTML = "Time's up!"
        desactiverToutesCartes()
        messageJeu()
      }
    }, 1000)
  }
})
