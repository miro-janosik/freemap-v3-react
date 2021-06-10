// eslint-disable-next-line
export interface Node extends Record<string, Node | string> {}
export const osmTagToNameMapping: Node = {
  highway: {
    '*': "Road {}",
    track: {
      '*': "Forest road",
      tracktype: {
        grade1: "Compacted forest road",
        grade2: "Mostly compacted forest road",
        grade3: "Less firm, unpaved forest road",
        grade4: "Forest road navigable by tractor or similar vehicles",
        grade5: "Barely discernible forest road"
      }
    },
    residential: "Street",
    living_street: "Residential",
    path: "Path",
    primary: "Primary highway",
    secondary: "Secondary highway",
    tertiary: "Tertiary highway",
    service: {
      '*': "Service driveway road",
      service: {
        '*': "Service road {}",
        driveway: "Driveway",
        parking_aisle: "Parking aisle",
        alley: "Alley",
        emergency_access: "Emergency access road",
        'drive-through': "Drive through",
        bus: "Mass transit road"
      }
    },
    footway: "Sidewalk",
    steps: "Stairs",
    trunk: "Trunk road",
    motorway: "Highway",
    unclassified: "Unclassified road",
    primary_link: "Primary road link",
    secondaty_link: "Secondary road link",
    tertiary_link: "Tertiary road link",
    motorway_link: "Motorway link",
    trunk_link: "Trunk link",
    construction: "Road under construction",
    crossing: "Pedestrian crossing",
    cycleway: "Cycleway"
  },
  boundary: {
    '*': "Region",
    administrative: {
      '*': "Administrative region",
      admin_level: {
        '10': "Cadastre region",
        '9': "Village",
        '8': "District",
        '7': "Region",
        '6': "City",
        '5': "Province",
        '4': "District",
        '3': "Region",
        '2': "Country"
      }
    }
  },
  type: {
    route: {
      '*': "Trail",
      route: {
        '*': "Trail {}",
        hiking: "Hiking trail",
        foot: "Pedestrian trail",
        bicycle: "Bicycle trail",
        ski: "Ski trail",
        piste: "Ski slope or path",
        horse: "Equestrian path",
        railway: "Railway",
        tram: "Tramway",
        bus: "Bus way",
        mtb: "Mountain biking trail"
      }
    }
  },
  building: {
    '*': "Building {}",
    yes: "Building",
    apartments: "Apartments",
    bungalow: "Bungalow",
    cabin: "Cabin",
    detached: "Free standing house",
    dormitory: "Dormitory",
    farm: "Farm",
    hotel: "Hotel building",
    house: "Private house",
    houseboat: "Houseboat",
    residential: "Residential house",
    static_caravan: "Mobile house, caravan",
    terrace: "Row house",
    semidetached_house: "Duplex house",
    // TODO
    commercial: "Commercial building",
    industrial: "Industrial building",
    office: "Office building",
    church: "Church",
    cathedral: "Cathedral",
    chapel: "Chapel",
    mosque: "Mosque",
    synagogue: "Synagogue",
    temple: "Temple",
    shrine: "Shrine",
    garage: "Garage",
    train_station: "Train station"
  },
  amenity: {
    '*': '{}',
    hunting_stand: "Hunting stand",
    toilets: 'WC',
    shelter: {
      '*': "Shelter",
      shelter_type: {
        '*': "Shelter {}",
        basic_hut: "Basic hut",
        changing_rooms: "Changing rooms",
        field_shelter: "Field shelter",
        lean_to: "Lean to",
        picnic_shelter: "Picnic shelter",
        public_transport: "Public transport shelter",
        rock_shelter: "Rock shelter",
        sun_shelter: "Sun shelter",
        weather_shelter: "Weather shelter"
      }
    },
    bench: "Bench",
    atm: "ATM",
    bank: "Bank",
    fuel: "Gas station",
    charging_station: "Charging station",
    hospital: "Hospital",
    clinic: "Clinic",
    doctors: "Doctor's office",
    dentist: "Dentist",
    place_of_worship: "Place of worship",
    restaurant: "Restaurant",
    pub: "Pub",
    fast_food: "Fast food",
    cafe: "Cafe",
    bar: 'Bar',
    school: "School",
    kindergarten: "Kindergarten",
    waste_basket: "Trash bin",
    bicycle_parking: "Bicycle parking",
    pharmacy: "Pharmacy",
    post_box: "Post box",
    recycling: "Recycling",
    drinking_water: "Drinking water",
    post_office: "Post office",
    townhall: "Town hall",
    fountain: "Fountain",
    police: "Police",
    fire_station: "Fire station ",
    waste_disposal: "Waste disposal",
    library: "Library",
    bus_station: "Bus station"
  },
  waterway: {
    '*': "Waterway {}",
    canal: "Canal",
    river: "River",
    stream: "Creek, stream",
    ditch: "Ditch",
    drain: "Drain",
    waterfall: "Waterfall",
    riverbank: "River bank",
    dam: "Dam"
  },
  landuse: {
    '*': '{}',
    forest: "Forest",
    residential: "Residential",
    commercial: "Commercial",
    industrial: "Industrial",
    allotments: "Allotments",
    farmland: "Farmland",
    farmyard: "Farmyard",
    grass: "Grass",
    meadow: "Meadow",
    orchard: "Orchard",
    vineyard: "Vineyard",
    cemetery: "Cemetery",
    reservoir: "Reservoir",
    quarry: "Quarry",
    millitary: "Military area"
  },
  leisure: {
    '*': '{}',
    firepit: "Fireplace",
    pitch: "Pitch",
    swimming_pool: "Swimming pool",
    park: 'Park',
    garden: "Garden",
    playground: "Playground",
    track: "Track",
    picnic_table: "Picnic table",
    stadium: "Stadium"
  },
  natural: {
    '*': '{}',
    wood: "Forest",
    water: "Water body",
    spring: "Spring",
    cave_entrance: "Cave",
    basin: "Basin",
    mountain_range: "Mountain range",
    scrub: "Scrub, bushes",
    heath: "Heathland",
    valley: "Valley",
    ridge: "Ridge",
    saddle: "Saddle",
    peak: "Peak",
    tree: "Tree",
    plateau: "Plateau",
    arch: "Rock arch",
    scree: "Scree"
  },
  man_made: {
    '*': '{}',
    pipeline: "Pipeline",
    beehive: "Beehive",
    chimney: "Chimney",
    clearcut: "Forest clearing",
    mineshaft: "Mineshaft",
    adit: "Adit",
    embankment: "Embankment",
    observatory: "Observatory",
    silo: 'Silo',
    wastewater_plant: "Wastewater plant",
    water_tower: "Water Tower",
    tower: {
      '*': "Tower",
      'tower:type': {
        observation: "Observation tower",
        communication: "Communication tower",
        bell_tower: "Bell tower",
        cooling: "Cooling tower"
      }
    }
  },
  power: {
    '*': '{}',
    pole: "Power pole",
    tower: "Power tower",
    line: "Power line",
    minor_line: "Minor power line"
  },
  railway: "Railroad",
  aerialway: "Aerial way, lift",
  shop: {
    '*': "Shop {}",
    convenience: "Convenience store",
    supermarket: 'Supermarket',
    mall: "Shopping center / mall",
    department_store: "Department store",
    bakery: "Bakery",
    butcher: "Butcher",
    ice_cream: "Ice cream",
    kiosk: "Kiosk",
    greengrocer: "Fruit and vegetables store",
    clothes: "Apparel store",
    shoes: "Shoes",
    fabric: "Textile store",
    chemist: "Drug-store, chemist",
    optician: "Optics",
    jewerly: "Jewerly",
    florist: "Florist",
    garden_center: "Gardening center",
    hardware: "Hardware",
    paint: "Paint shop",
    trade: "Building materials store",
    second_hand: "Secondhand",
    hairdresser: "Hairdresser",
    tattoo: "Tattoo",
    antiques: "Antiques",
    carpet: "Carpet store",
    furniture: "Furniture store",
    computer: "Computer store",
    electronics: "Electronics",
    mobile_phone: "Mobile phone store",
    radiotechnics: "Radiotechnics",
    bicycle: "Bicycle",
    car: "Car dealership",
    car_repair: "Car repair",
    car_parts: "Car parts",
    outdoor: "Outdoor",
    sports: "Sports",
    books: "Book store",
    stationery: "Stationery store",
    copyshop: "Copy shop",
    funeral_directors: "Funeral Services",
    pet: "Pet shop",
    toys: "Toy store"
  },
  historic: {
    '*': "Historic structure",
    wayside_cross: "Wayside cross",
    wayside_shrine: "Wayside shrine",
    archaeological_site: "Archaeological site",
    monument: "Monument",
    monastery: "Monastery",
    tomb: "Tomb",
    ruins: {
      '*': "Ruins",
      ruins: {
        castle: "Castle ruins"
      }
    }
  },
  barrier: {
    '*': "Barrier {}",
    fence: "Fence",
    wall: "Wall",
    hedge: "Hedge",
    block: "Block",
    entrance: "Entrance",
    gate: "Gate",
    lift_gate: "Lift gate",
    swing_gate: "Swing gate",
    bollard: "Bollard",
    chain: "Chain"
  },
  sport: {
    '*': "Sport {}",
    soccer: "Football / soccer",
    tennis: "Tennis"
  },
  tourism: {
    '*': '{}',
    viewpoint: "Viewpoint",
    information: {
      '*': "Information",
      information: {
        '*': "Information {}",
        office: "Information office",
        board: "Information board",
        guidepost: "Guidepost",
        map: "Map"
      }
    },
    hotel: 'Hotel',
    guest_house: "Guest house",
    apartment: "Apartment",
    hostel: 'Hostel',
    motel: 'Motel',
    chalet: "Chalet",
    camp_site: "Campsite",
    caravan_site: "Caravan site",
    attraction: "Attraction",
    artwork: {
      '*': "Art",
      artwork_type: {
        bust: "Bust",
        sculpture: "Sculpture",
        statue: "Statue",
        mural: "Mural",
        painting: "Painting",
        architecture: "Architecture"
      }
    },
    picnic_site: "Picnic site",
    museum: "Museum",
    zoo: 'ZOO'
  },
  place: {
    '*': "Place {}",
    locality: "Locality",
    village: "Village",
    city: "City",
    town: "Town",
    country: "Country",
    state: "State",
    suburb: "Suburb",
    hamlet: "Hamlet",
    isolated_dwelling: "Isolated dwelling"
  }
};
export const colorNames: Record<string, string> = {
  red: "Red",
  blue: "Blue",
  green: "Green",
  yellow: "Yellow",
  orange: "Orange",
  purple: "Purple",
  violet: "Violet",
  white: "White",
  black: "Black",
  gray: "Gray",
  brown: "Brown"
};