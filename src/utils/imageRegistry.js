/**
 * GreenRoots image registry.
 * Unsplash image URLs are used for the visual demo; replace with locally licensed
 * product photography before production.
 */
const photo = (id, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const IMAGES = {
  heroBalconyGarden: photo('photo-1497250681960-ef046c08a56e', 1400),
  heroRooftopPlants: photo('photo-1466692476868-aef1dfb1e735', 1200),
  categories: {
    indoorPlants: photo('photo-1501004318641-b39e6451bec6'),
    floweringPlants: photo('photo-1490750967868-88aa4486c946'),
    fruitPlants: photo('photo-1591857177580-dc82b9ac4e1e'),
    manureCompost: photo('photo-1589923188900-85dae523342b'),
    potsPlanters: photo('photo-1485955900006-10f4d324d411'),
    seedsSaplings: photo('photo-1500382017468-9049fed747ef'),
    gardeningAccessories: photo('photo-1416879595882-3373a0480b5b'),
    wateringEquipment: photo('photo-1585320806297-9794b3e4eeae'),
  },
  products: {
    tulsi: photo('photo-1501004318641-b39e6451bec6', 700),
    moneyPlant: photo('photo-1497250681960-ef046c08a56e', 700),
    aloeVera: photo('photo-1596547609652-9cf5d8d76921', 700),
    snakePlant: photo('photo-1593691509543-c55fb32e5cee', 700),
    hibiscus: photo('photo-1490750967868-88aa4486c946', 700),
    desiRose: photo('photo-1494972308805-463bc619d34e', 700),
    marigold: photo('photo-1497250681960-ef046c08a56e', 700),
    bougainvillea: photo('photo-1466692476868-aef1dfb1e735', 700),
    guavaSapling: photo('photo-1591857177580-dc82b9ac4e1e', 700),
    lemonPlant: photo('photo-1501004318641-b39e6451bec6', 700),
    vermicompost: photo('photo-1589923188900-85dae523342b', 700),
    cowDungManure: photo('photo-1585320806297-9794b3e4eeae', 700),
    terracottaGamla: photo('photo-1485955900006-10f4d324d411', 700),
    cocopeat: photo('photo-1416879595882-3373a0480b5b', 700),
    wateringCan: photo('photo-1585320806297-9794b3e4eeae', 700),
  },
}
