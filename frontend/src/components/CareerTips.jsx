import React from 'react';

import {
    BriefcaseIcon,
    FileTextIcon,
    GraduationCapIcon,
    LightbulbIcon,
    TrendingUpIcon,
} from 'lucide-react';

const CareerTips = [
    {
        id: 1,
        title: "Comment rédiger un CV efficace",
        category: "cv",
        icon: <FileTextIcon className="tip-icon" />,
        description: `
            Rédiger un CV efficace est une étape cruciale dans la recherche d'emploi. Un CV bien structuré permet de se distinguer rapidement des autres candidats.
            Dans cet article, nous aborderons les différentes sections essentielles à un CV performant et comment vous pouvez optimiser chaque partie pour maximiser vos chances de décrocher un entretien.

            1. La présentation : Un CV doit être simple, propre et facile à lire. Optez pour une mise en page sobre avec des sections bien délimitées. Utilisez des polices classiques telles que Arial ou Times New Roman pour faciliter la lecture.
            2. Le résumé professionnel : En haut de votre CV, un court paragraphe résumant vos compétences clés et vos objectifs professionnels peut capter l'attention du recruteur.
            3. Les expériences professionnelles : Décrivez vos expériences passées en mettant l'accent sur vos réalisations concrètes plutôt que de simplement lister vos responsabilités. Utilisez des verbes d'action et quantifiez vos résultats lorsque cela est possible.
            4. Les compétences techniques et humaines : Mentionnez les compétences techniques pertinentes pour le poste, mais n'oubliez pas de souligner vos qualités personnelles telles que le travail en équipe, la gestion du stress, et la communication.
        `,
        subTips: [
            {
                subtitle: "Les clés d'un CV efficace",
                points: [
                    "Limitez votre CV à une ou deux pages maximum.",
                    "Commencez par un résumé professionnel percutant.",
                    "Mettez en avant les réalisations plutôt que les responsabilités.",
                    "N'oubliez pas d'ajouter des informations sur vos compétences techniques et personnelles.",
                ],
            },
        ],
    },
    {
        id: 2,
        title: "Réussir son entretien d'embauche",
        category: "entretien",
        icon: <BriefcaseIcon className="tip-icon" />,
        description: `
            Un entretien d'embauche peut être stressant, mais avec une bonne préparation, vous pouvez augmenter considérablement vos chances de succès. Cet article vous guidera à travers les étapes clés pour réussir un entretien.

            1. La recherche préalable : Avant l'entretien, assurez-vous de bien connaître l'entreprise et le poste pour lequel vous postulez. Parcourez le site web de l'entreprise, ses réseaux sociaux, et les articles récents pour vous familiariser avec sa culture et ses projets.
            2. Les questions courantes : Préparez des réponses à des questions fréquemment posées, comme "Parlez-moi de vous", "Quels sont vos points forts et vos points faibles ?", et "Pourquoi voulez-vous travailler ici ?". Ces réponses doivent être concises, mais informatives.
            3. L'entretien pratique : Soyez prêt à répondre à des questions techniques ou pratiques selon le poste. Cela peut inclure des tests de compétences, des études de cas, ou des mises en situation.
        `,
        subTips: [
            {
                subtitle: "Avant l'entretien",
                points: [
                    "Recherchez l'entreprise et le poste en profondeur.",
                    "Préparez des réponses aux questions fréquentes.",
                    "Pratiquez des simulations d'entretien avec un ami ou un mentor.",
                ],
            },
        ],
    },
    {
        id: 3,
        title: "Développer son réseau professionnel",
        category: "carriere",
        icon: <TrendingUpIcon className="tip-icon" />,
        description: `
            Construire un réseau professionnel est essentiel pour accéder à de nouvelles opportunités de carrière. Dans cet article, nous explorerons les meilleures stratégies pour développer et entretenir des relations professionnelles solides.

            1. L'importance des relations personnelles : Un réseau professionnel n'est pas seulement une question de connexions sur LinkedIn. Il s'agit de bâtir des relations authentiques avec des personnes de confiance dans votre domaine d'activité.
            2. Participer à des événements professionnels : Les salons, conférences, et événements de réseautage sont des occasions idéales pour rencontrer des professionnels de votre secteur. N'hésitez pas à vous inscrire à ces événements pour élargir votre réseau.
            3. Entretenir son réseau : Un bon réseau nécessite une attention régulière. Prenez le temps de contacter vos relations de temps en temps pour échanger des nouvelles, partager des articles intéressants, ou organiser des rencontres.
        `,
        subTips: [
            {
                subtitle: "Pourquoi développer son réseau ?",
                points: [
                    "Accéder aux opportunités du marché caché de l'emploi.",
                    "Obtenir des recommandations personnelles.",
                    "Apprendre des autres et trouver des mentors.",
                ],
            },
        ],
    },
    {
        id: 4,
        title: "Se former tout au long de sa carrière",
        category: "formation",
        icon: <GraduationCapIcon className="tip-icon" />,
        description: `
            L'apprentissage continu est une clé fondamentale pour réussir dans le monde du travail. Cet article vous montre comment intégrer l'apprentissage dans votre carrière et quelles ressources exploiter pour vous perfectionner.

            1. Les avantages de la formation continue : Se former régulièrement permet de rester à jour avec les nouvelles tendances et technologies, tout en développant de nouvelles compétences qui peuvent vous ouvrir des portes professionnelles.
            2. Les différentes formes de formation : Que ce soit par des cours en ligne, des certifications, des ateliers en entreprise, ou des conférences, il existe de nombreuses façons d'apprendre. Choisissez celle qui correspond le mieux à vos objectifs professionnels et à votre emploi du temps.
            3. Fixer des objectifs d'apprentissage : Définissez des objectifs clairs et mesurables pour vos formations. Cela vous aidera à rester concentré et à évaluer vos progrès régulièrement.
        `,
        subTips: [
            {
                subtitle: "L'importance de l'apprentissage continu",
                points: [
                    "Rester compétitif sur le marché de l'emploi.",
                    "Ouvrir la porte à de nouvelles opportunités professionnelles.",
                    "Renforcer sa confiance en soi et sa crédibilité auprès des employeurs.",
                ],
            },
        ],
    },
    {
        id: 5,
        title: "Négocier son salaire avec succès",
        category: "carriere",
        icon: <LightbulbIcon className="tip-icon" />,
        description: `
            La négociation salariale peut être un exercice délicat, mais elle est cruciale pour garantir une rémunération juste. Cet article vous guide à travers les étapes pour préparer et réussir une négociation salariale.

            1. Se préparer à la négociation : Avant d'entamer une discussion sur votre salaire, il est important de faire des recherches. Renseignez-vous sur les salaires moyens pour le poste que vous visez dans votre région, ainsi que les avantages supplémentaires offerts par l'entreprise.
            2. Mettre en avant ses réalisations : Lors de la négociation, mettez en avant vos réalisations et votre valeur ajoutée. Expliquez comment vos compétences et votre expérience justifient votre demande salariale.
            3. Être prêt à négocier : Soyez prêt à discuter non seulement du salaire de base, mais aussi des avantages supplémentaires tels que les primes, les congés, et les avantages sociaux.
        `,
        subTips: [
            {
                subtitle: "Préparez-vous avant la négociation",
                points: [
                    "Faites des recherches sur les salaires du marché.",
                    "Identifiez votre valeur ajoutée et vos réalisations concrètes.",
                    "Envisagez des options de compensation autres que le salaire.",
                ],
            },
        ],
    },
];

export default CareerTips;
