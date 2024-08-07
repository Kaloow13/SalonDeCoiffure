/* ------------------------
 *    Au chargement mettre l'image
      du coiffeur 
 * ------------------------ */
      const televerserInput = document.getElementById("televerser");
      const imageTeleverser = document.getElementById("imageteleverser");
      
      televerserInput.addEventListener("change", async function () {
        const file = this.files[0];
        const token = sessionStorage.getItem("token");
      
        if (!token) {
          console.error("Token non trouvé dans sessionStorage");
          return;
        }
      
        const maxSize = 1024; // Taille maximale en pixels pour chaque côté de l'image
      
        // Fonction pour redimensionner l'image
        const resizeImage = (image, maxSize) => {
          const canvas = document.createElement("canvas");
          let width = image.width;
          let height = image.height;
      
          // Redimensionner l'image pour s'adapter à la taille maximale
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
      
          canvas.width = width;
          canvas.height = height;
      
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, width, height);
      
          return canvas.toDataURL("image/jpeg"); // Convertir le canvas en URL base64
        };
      
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target.result;
          const image = new Image();
          image.src = base64Image;
      
          // Attendre que l'image soit chargée pour la redimensionner
          image.onload = () => {
            const resizedImage = resizeImage(image, maxSize);
            const body = {
              urlPhoto: resizedImage, // Envoyer l'URL de l'image redimensionnée
              token: token, // Envoyer le token
            };
      
            // Envoyer l'image redimensionnée au serveur
            fetch("/portfolio", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            })
              .then((response) => {
                if (!response.ok) {
                  console.log("Erreur lors du téléversement de l'image");
                }
                return response.json();
              })
              .then((data) => {
                console.log(data.message);
                imageTeleverser.src = resizedImage; // Mettre à jour l'aperçu de l'image
              })
              .catch((error) => {
                console.error("Une erreur est survenue lors du téléversement de l'image :", error);
              });
          };
        };
      
        reader.readAsDataURL(file); // Commencer la lecture du fichier comme URL de données
      });
      
      

/* ------------------------
 *    Au chargement mettre l'image
      du coiffeur 
 * ------------------------ */
// Au chargement, mettre l'image du coiffeur
document.addEventListener("DOMContentLoaded", async function () {
  // Si la page est rechargé, on va modifier la photo par lancienne
  if (performance.navigation.type === 1) {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("/recupererphoto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data && data.imageUrl) {
        const imageUrl = data.imageUrl;

        // Définir la source de l'image avec l'URL créée
        imageTeleverser.src = imageUrl;
      } else {
        // Si l'URL de l'image n'est pas disponible, charger une image de secours
        console.error(
          "Une erreur est survenue lors de la récupération de l'URL de l'image."
        );
      }
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de l'initialisation de l'image :",
        error
      );
    }
  }
});

/* ------------------------
 *   ON RETOURNE TOUT LES SALONS AU CHARGEMENT DE LA PAGE:
 * ------------------------ */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    //ON FAIT UN FETCH POUR RETOURNER TOUTS LES SALONS
    const response = await fetch("/nomsSalons");
    const nomsSalons = await response.json();
    const selectSalon = document.getElementById("salonCoiffure");

    nomsSalons.forEach((salon) => {
      const option = document.createElement("option");
      option.value = salon.idSalon;
      option.textContent = salon.nomSalon;
      selectSalon.appendChild(option);
    });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des noms de salons:",
      error
    );
    alert(
      "Une erreur s'est produite lors de la récupération des noms de salons"
    );
  }
});

/* ------------------------
 *    Modifier les informations
     d'un coiffeur grace au FORMULAIRE
 * ------------------------ */
const boutonEnregistrer = document.getElementById("BoutonEnregistrer");

boutonEnregistrer.addEventListener("click", async () => {
  const form = document.getElementById("profilForm");

  const nomCoiffeur = form.querySelector("#nomCoiffeur").value;
  const prenomCoiffeur = form.querySelector("#prenomCoiffeur").value;
  const email = form.querySelector("#email").value;
  const numCoiffeur = form.querySelector("#numCoiffeur").value;
  const salonCoiffure = form.querySelector("#salonCoiffure").value;
  const newPassword = form.querySelector("#newPassword").value;

  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch("/coiffeurs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        nomCoiffeur,
        prenomCoiffeur,
        email,
        numCoiffeur,
        salonCoiffure,
        password: newPassword,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      tconsole.log(errorMessage);
    }

    const responseData = await response.json();
    alert(responseData.message); 
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la modification du profil :",
      error.message
    );
    alert("Une erreur s'est produite Lors de l'insertion");
  }
});

/* ------------------------
 *   Calendrier dynamique avec les jours, semaines, mois, etc.
 * ------------------------ */
const daysTag = document.querySelector(".days");
const currentDate = document.querySelector(".current-date");
const prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const renderCalendar = () => {
  // Mettre à jour la variable de date à chaque rendu du calendrier
  date = new Date(currYear, currMonth, 1);

  let firstDayofMonth = date.getDay();
  let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate();
  let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay();
  let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
  let liTag = "";

  for (let i = firstDayofMonth; i > 0; i--) {
    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
  }

  for (let i = 1; i <= lastDateofMonth; i++) {
    // Vérifier si le jour appartient au mois en cours
    let isCurrentMonth =
      currMonth === date.getMonth() && currYear === date.getFullYear();
    let isToday = isCurrentMonth && i === date.getDate() ? "active" : "";
    let clickEvent = isCurrentMonth ? "selectDate(this)" : "null";
    liTag += `<li class="${isToday}" onclick="${clickEvent}">${i}</li>`;
  }

  for (let i = lastDayofMonth; i < 6; i++) {
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
  }

  currentDate.innerText = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;
};

prevNextIcon.forEach((icon) => {
  icon.addEventListener("click", () => {
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
    if (currMonth < 0) {
      currMonth = 11;
      currYear--;
    } else if (currMonth > 11) {
      currMonth = 0;
      currYear++;
    }
    renderCalendar();
  });
});

// Fonction pour sélectionner une date
function selectDate(element) {
  const selectedDay = parseInt(element.textContent);
  dateSelectionnee = new Date(currYear, currMonth, selectedDay);

  // Appliquer le style à tous les jours sélectionnés, peu importe le mois
  const allDays = document.querySelectorAll(".days li");
  allDays.forEach((day) => {
    day.classList.remove("selected"); // Supprimer la classe 'selected' de tous les jours
  });
  element.classList.add("selected"); // Ajouter la classe 'selected' au jour sélectionné

  // Formatage de la date sélectionnée en format YYYY-MM-DD
  const year = dateSelectionnee.getFullYear();
  let month = dateSelectionnee.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day = dateSelectionnee.getDate();
  day = day < 10 ? "0" + day : day;

  const formattedDate = `${year}-${month}-${day}`;
  console.log("Date sélectionnée :", formattedDate);

  // Afficher les heures possibles
  afficherHeuresPossibles();
}

/* ----------------
--------
*    Choisir une heure, date de disponibilité et l'envoyer au serveur dans table Disponibilite
* ------------------------ */

// Variables globales pour stocker la date et l'heure sélectionnées
let dateSelectionnee = null;
let heureSelectionnee = []; 

const days = document.querySelectorAll(".days li");

// Fonction pour afficher les heures possibles et le bouton Envoyer
function afficherHeuresPossibles() {
  const heuresPossibles = [
    "8:00", "9:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];
  const choisirDate = document.getElementById("choisirDate");
  choisirDate.innerHTML = ""; // Efface le contenu précédent
  heureSelectionnee = []; // Réinitialiser le tableau des heures sélectionnées

  heuresPossibles.forEach((heure) => {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "heure-disponible";
    input.value = heure;

    const label = document.createElement("label");
    label.textContent = heure;

    input.addEventListener("change", () => {
      if (input.checked) {
        if (!heureSelectionnee.includes(input.value)) {
          heureSelectionnee.push(input.value);
        }
      } else {
        const index = heureSelectionnee.indexOf(input.value);
        if (index !== -1) {
          heureSelectionnee.splice(index, 1);
        }
      }
    });

    choisirDate.appendChild(input);
    choisirDate.appendChild(label);
    choisirDate.appendChild(document.createElement("br"));
  });

  const boutonEnvoyer = document.createElement("button");
  boutonEnvoyer.textContent = "Envoyer les disponibilités";
  boutonEnvoyer.setAttribute("class", "button is-danger");
  boutonEnvoyer.setAttribute("id", "boutonEnvoyer");

  boutonEnvoyer.addEventListener("click", async () => {
    if (!dateSelectionnee || heureSelectionnee.length === 0) {
      console.error("Veuillez sélectionner une date et au moins une heure.");
      return;
    }

    const token = sessionStorage.getItem("token");
    const dateISO = formatDateToISO(dateSelectionnee);

    try {
      const responsePromises = heureSelectionnee.map(async (heure) => {
        const response = await fetch("/disponibilites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateDisponibilite: dateISO,
            heureDisponibilite: heure,
            token,
          }),
        });

        if (!response.ok) {
          console.log("Erreur lors de la requête fetch");
        }

        const data = await response.json();
        return data.idDisponibilite;
      });

      const results = await Promise.all(responsePromises);
      alert("Disponibilités mises à jour");
      console.log("Disponibilités envoyées avec succès:", results);
    } catch (error) {
      console.error("Erreur lors de l'envoi des disponibilités:", error);
    }
  });

  choisirDate.appendChild(boutonEnvoyer);
}


// Fonction pour formater la date en format ISO
const formatDateToISO = (date) => {
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? "0" + month : month; // Ajoute un zéro devant si le mois est inférieur à 10
  let day = date.getDate();
  day = day < 10 ? "0" + day : day; // Ajoute un zéro devant si le jour est inférieur à 10
  return `${year}-${month}-${day}`;
};

renderCalendar();

/* ----------------
--------
*    Upload des photos dans portfolios
* ------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  const imageUploadInputs = document.querySelectorAll(".image-upload");
  imageUploadInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const image = input.parentNode.querySelector("img");
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          image.src = e.target.result;
          sessionStorage.setItem(
            `image_${input.dataset.index}`,
            e.target.result
          );
        };
        reader.readAsDataURL(file);
      } else {
        image.src = "https://via.placeholder.com/300x200";
        input.parentNode.querySelector(".content").textContent =
          "No image selected";
      }
    });
  });
});

const token = sessionStorage.getItem("token");
const urlPhoto = []; 
for (let i = 1; i <= 3; i++) {
  const imageUrl = sessionStorage.getItem(`image_${i}`);
  if (imageUrl) {
    urlPhoto.push(imageUrl); // Utilisation de la méthode push pour ajouter l'URL à urlPhoto
  }
}

// Effectuer une requête fetch pour stocker les images dans la base de données
fetch("/portfolioimages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    urlPhoto: urlPhoto,
    token: token,
  }),
})
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.log("Erreur lors de la requête fetch");
    }
  })
  .then((data) => {
    console.log(data.message); // Afficher le message renvoyé par le serveur
  })
  .catch((error) => {
    console.error("Erreur lors de la requête fetch:", error);
  });

/* 3 photos vont apparaitre au chargfement*/
document.addEventListener("DOMContentLoaded", () => {
  const imageUploadInputs = document.querySelectorAll(".image-upload");
  imageUploadInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const image = input.parentNode.querySelector("img");
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          image.src = e.target.result;
          sessionStorage.setItem(
            `image_${input.dataset.index}`,
            e.target.result
          );
        };
        reader.readAsDataURL(file);
      } else {
        // message si pas de fichier
        image.src = "https://via.placeholder.com/300x200";
        input.parentNode.querySelector(".content").textContent =
          "No image selected";
      }
    });

    const imageUrl = sessionStorage.getItem(`image_${input.dataset.index}`);
    if (imageUrl) {
      const image = input.parentNode.querySelector("img");
      image.src = imageUrl;
    }
  });
});
// Fonction pour récupérer et afficher tous les services
async function getAndRenderServices() {
  try {
    const response = await fetch("/showServices");
    const data = await response.json();

    // Récupérer tous les Coiffeur_Service pour l'utilisateur actuel
    const coiffeurServicesResponse = await fetch("/showCoiffeur_Service");
    const coiffeurServicesData = await coiffeurServicesResponse.json();

    const servicesList = document.getElementById("servicesList");
    servicesList.innerHTML = ""; 

    data.services.forEach((service) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "service";
      checkbox.value = service.idService;
      checkbox.id = `service-${service.idService}`;

      const label = document.createElement("label");
      label.htmlFor = `service-${service.idService}`;
      label.textContent = service.nom;

      // Vérifier si le service est sélectionné pour le coiffeur actuel
      const isSelected = coiffeurServicesData.services.some(
        (coiffeurService) => coiffeurService.idService === service.idService
      );
      checkbox.checked = isSelected;

      // Ajouter un gestionnaire d'événements pour détecter les changements de sélection
      checkbox.addEventListener("change", async (event) => {
        const selectedServiceId = event.target.value;
        if (event.target.checked) {
          // Si la case est cochée, ajoute l'idService à la liste des services sélectionnés
          try {
            const response = await fetch("/CoiffeurService", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idService: selectedServiceId,
                token,
              }),
            });

            if (!response.ok) {
              console.log("Erreur lors de la requête fetch");
            }

            const responseData = await response.json();
            alert(responseData.message); // Afficher un message de succès

            // Mettre à jour les services après chaque ajout
            getAndRenderServices();
          } catch (error) {
            console.error(
              "Une erreur s'est produite lors de l'ajout du service du coiffeur:",
              error.message
            );
            alert(
              "Une erreur s'est produite lors de l'ajout du service du coiffeur."
            );
          }
        } else {
          // Si la case est décochée, supprime l'idService de la liste des services sélectionnés
          try {
            // Trouver l'ID Coiffeur-Service correspondant au service désélectionné
            const coiffeurService = coiffeurServicesData.services.find(
              (coiffeurService) =>
                coiffeurService.idService === service.idService
            );

            if (!coiffeurService) {
              console.log("Relation Coiffeur-Service non trouvée");
            }

            const response = await fetch("/CoiffeurService", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idCoiffeur_Service: coiffeurService.idCoiffeur_Service,
                token,
              }),
            });

            if (!response.ok) {
              console.log("Erreur lors de la requête fetch");
            }

            const responseData = await response.json();
            alert(responseData.message); // Afficher un message de succès

            // Mettre à jour les services après chaque suppression
            getAndRenderServices();
          } catch (error) {
            console.error(
              "Une erreur s'est produite lors de la suppression du service du coiffeur:",
              error.message
            );
            alert(
              "Une erreur s'est produite lors de la suppression du service du coiffeur."
            );
          }
        }
      });

      servicesList.appendChild(checkbox);
      servicesList.appendChild(label);
      servicesList.appendChild(document.createElement("br"));
    });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des services:",
      error
    );
  }
}

// Appeler la fonction pour récupérer et afficher les services lors du chargement de la page
document.addEventListener("DOMContentLoaded", getAndRenderServices);

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);

  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "/conn"; 
    return;
  }

  const loginType = sessionStorage.getItem("loginType");
  updateNavigationBar(loginType);

  document.getElementById('btnDeconnexion').addEventListener('click', deconnexion);
});


// change le navbar en fonction du type de user (client ou coiffeur)
function updateNavigationBar(loginType) {
  let navContent = "";
  const navContainer = document.querySelector(".nav .nav-items"); // Sélectionner le conteneur de la barre de navigation
  const prendreRdv = document.getElementById('btnPriseRdv');

  if (loginType === "client") {
    navContent = `
      <a href="../accueil/accueil.html#section-contact">Contact</a>
        <a href="../avis.html">Avis</a>
        <a href="../AfficherAvis/afficherAvis.html">Tous les avis</a>
        <a href="../favoris/favoris.html">Favoris</a>
        <a href="../RechercheCoiffeur/rechercheCoiffeur.html">Coiffeurs</a>
        <a href="../rendezvousClient/rendezvousClient.html">Mes rendez-vous</a>
        `;
  } else if (loginType === "coiffeur") {
    prendreRdv.style.display = 'none'
    navContent = `
        <a href="../CoiffeurProfil/portfolio.html">Profil</a>
        <a href="../AfficherAvis/afficherAvis.html">Tous les avis</a>
        <a href="../rendezvousCoiffeur/rendezvousCoiffeur.html">Afficher mes rendez vous</a>
        `;
  }

  // Mettre à jour le contenu de la barre de navigation
  navContainer.innerHTML = navContent;
}

//suppression du token lors de la deconnexion
function deconnexion() {
  sessionStorage.removeItem("token");
  window.location.href = "../connexion.html";
}