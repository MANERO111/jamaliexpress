export interface NavItem {
    name: string;
    subcategories?: NavItem[];
}

export const navigationItems: NavItem[] = [
    {
        name: "Visage",
        subcategories: [
            { name: "Crèmes de jour" },
            { name: "Crèmes de nuit" },
            {
                name: "Dermo-nettoyants",
                subcategories: [
                    { name: "Crèmes & laits" },
                    { name: "Gels & huiles & gelée" },
                    { name: "Lotions & toniques" },
                    { name: "Mousses & poudres" },
                    { name: "Savons" },
                    { name: "Sérums & huiles" }
                ]
            },
            { name: "Gommages" },
            {
                name: "Maquillage",
                subcategories: [
                    { name: "Accessoires" },
                    { name: "Camouflage" },
                    { name: "Crayons" },
                    { name: "Fards à joues" },
                    { name: "Fard à paupières & Mascara" },
                    { name: "Poudre" },
                    { name: "Rouge à lèvres" }
                ]
            },
            { name: "Masques" },
            { name: "Protection solaire" },
            { name: "Sérums" },
            { name: "Yeux & lèvres" }
        ]
    },
    {
        name: "Corps",
        subcategories: [
            { name: "Appareils & accessoires" },
            {
                name: "Hydratation Corporelle",
                subcategories: [
                    { name: "Gels" },
                    { name: "Huiles" },
                    { name: "Laits & crèmes" },
                    { name: "Lotions & émulsions" }
                ]
            },
            {
                name: "Hygiène corporel",
                subcategories: [
                    { name: "Crèmes & laits" },
                    { name: "Gommages & exfoliants" },
                    { name: "Déodorants" },
                    { name: "Huiles" },
                    { name: "Hygiène corporel" },
                    { name: "Savons" },
                    { name: "Gels" }
                ]
            },
            { name: "Hygiène intime" },
            { name: "Protection solaire" },
            {
                name: "Soins corporels",
                subcategories: [
                    { name: "Anti-âge" },
                    { name: "Anti-taches" },
                    { name: "Huiles" },
                    { name: "Laits & crèmes" },
                    { name: "Lotions & émulsions" },
                    { name: "Minceur" }
                ]
            },
            {
                name: "Soins des mains",
                subcategories: [
                    { name: "Anti-âge" },
                    { name: "Hydratantes" },
                    { name: "Minceur" },
                    { name: "Soins des ongles" },
                    { name: "Soins des pieds" },
                    { name: "Vernis à ongles" }
                ]
            },
            { name: "Soins des pieds" }
        ]
    },
    {
        name: "Capillaire",
        subcategories: [
            {
                name: "Colorations",
                subcategories: [
                    { name: "Colorations" },
                    { name: "Camouflage capillaire" },
                    { name: "Après-shampoings & conditionners" },
                    { name: "Hennés" }
                ]
            },
            {
                name: "Hygiène",
                subcategories: [
                    { name: "Shampoings" },
                    { name: "Shampoings secs" }
                ]
            },
            { name: "Lotions & ampoules & spray" },
            {
                name: "Soins",
                subcategories: [
                    { name: "Shampoings" },
                    { name: "Après-shampoings & conditionners" },
                    { name: "Masques" },
                    { name: "Sérums & huiles" },
                    { name: "Crèmes & laits" },
                    { name: "Lotions & ampoules & spray" },
                    { name: "Produits coiffants" },
                    { name: "Protection capillaire" }
                ]
            },
            {
                name: "Accessoires cheveux",
                subcategories: [
                    { name: "Appareils coiffants" },
                    { name: "Brosses à cheveux" }
                ]
            }
        ]
    },
    {
        name: "Hygiène",
        subcategories: [
            {
                name: "Accessoires corporels",
                subcategories: [
                    { name: "Accessoires" },
                    { name: "Cotons" },
                    { name: "Cotons disques" },
                    { name: "Coupes ongles" }
                ]
            },
            { name: "Hygiène intime" },
            { name: "Hygiène nasal" },
            { name: "Pansements & compresses" }
        ]
    },
    {
        name: "Bucco-dentaire",
        subcategories: [
            {
                name: "Adultes",
                subcategories: [
                    { name: "Dentifrices" },
                    { name: "Brosses à dents" },
                    { name: "Fils dentaires & brossettes" },
                    { name: "Bains de bouche" },
                    { name: "Soins bucco-dentaire" }
                ]
            },
            {
                name: "Enfants",
                subcategories: [
                    { name: "Dentifrices" },
                    { name: "Brosses à dents" }
                ]
            },
            { name: "Fils dentaires & brossettes" },
            { name: "Soins bucco-dentaire" }
        ]
    },
    {
        name: "Bébés & Mamans",
        subcategories: [
            {
                name: "Puériculture",
                subcategories: [
                    { name: "Accessoires bébé" },
                    { name: "Appareils bébé" },
                    { name: "Biberons & tétines" },
                    { name: "Repas" },
                    { name: "Sucettes" }
                ]
            },
            {
                name: "Hygiène bébés",
                subcategories: [
                    { name: "Change bébé" },
                    { name: "Hydratants bébé" },
                    { name: "Nettoyant bébé" },
                    { name: "Parfum & eau fraîche" },
                    { name: "Soins bébés" },
                    { name: "Protection solaire" }
                ]
            },
            {
                name: "Grossesse",
                subcategories: [
                    { name: "Accessoires" },
                    { name: "Allaitement" },
                    { name: "Anti-vergetures" },
                    { name: "Compléments alimentaires" },
                    { name: "Serviettes & culottes" }
                ]
            }
        ]
    },
    {
        name: "Hommes",
        subcategories: [
            { name: "Hydratants" },
            { name: "Hygiène" },
            { name: "Santé & bien être" },
            { name: "Anti-âge" },
            { name: "Apaisants & cicatrisants" }
        ]
    },
    {
        name: "Compléments alimentaires",
        subcategories: [
            { name: "Cardiovasculaire" },
            { name: "Cheveux & peau et ongles" },
            { name: "Circulation & Elimination" },
            { name: "Compléments Alimentaires" },
            { name: "Confort Urinaire" },
            { name: "Détente & Sommeil" },
            { name: "Digestion & transit & detox" },
            { name: "Immunité" },
            { name: "Mémoire & concentration & intellect" },
            { name: "Ménopause" },
            { name: "Minceur & draineurs" },
            { name: "Prostate" },
            { name: "Rhumatisme & articulation" },
            { name: "Vitamines & minéraux" }
        ]
    }
];
