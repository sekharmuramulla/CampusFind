/**
 * CampusFind Data Store
 * Exclusive Campus Marketplace for RGUKT Nuzvid, Eluru District, AP
 * Strictly physical equipment rentals: electronics, calculators, cameras, project kits
 */

export const initialProducts = [
  {
    id: "prod-01",
    title: "Casio fx-991EX ClassWiz Scientific Calculator",
    category: "Academic Tools",
    dailyRate: 30,
    weeklyRate: 150,
    deposit: 200,
    condition: "Like New",
    availability: "Available Now",
    owner: {
      name: "Sai Krishna M.",
      dept: "E4 CSE",
      role: "Student Owner",
      pickupSpot: "SAC Ground Floor or Central Library Porch",
      rating: "4.9",
      contactPref: "WhatsApp / In-Person at SAC"
    },
    image: "assets/images/products/calculator.jpg",
    description: "Crucial for Engineering Mathematics, Gate prep, and Semester exams. High-resolution LCD display, 552 functions including matrix, vector, and calculus operations. Battery freshly replaced with protective hard case.",
    includedAccessories: ["Protective Hard Slide-on Case", "Quick Reference Card", "Spare Coin Battery"],
    featured: true,
    tags: ["Exams", "Calculators", "Engineering Maths", "Academic"]
  },
  {
    id: "prod-02",
    title: "Lenovo ThinkPad 15.6\" (Intel Core i5, 16GB RAM, SSD)",
    category: "Electronics",
    dailyRate: 250,
    weeklyRate: 1200,
    deposit: 1500,
    condition: "Excellent",
    availability: "Available Now",
    owner: {
      name: "Pooja Reddy",
      dept: "E3 ECE",
      role: "Student Owner",
      pickupSpot: "Hostel I1 Foyer or AB-2 Foyer",
      rating: "4.8",
      contactPref: "WhatsApp / In-person handover"
    },
    image: "assets/images/products/laptop.jpg",
    description: "Configured specifically for coding, MATLAB, AutoCAD, and heavy simulation workloads. Dual-boot Ubuntu 22.04 LTS & Windows 11 with VS Code, Keil µVision, and Python environments pre-installed.",
    includedAccessories: ["65W Fast Charger", "Laptop Padded Sleeve", "Wireless Mouse"],
    featured: true,
    tags: ["Laptops", "Coding", "MATLAB", "Simulations"]
  },
  {
    id: "prod-03",
    title: "Canon EOS 200D II DSLR with 18-55mm STM Lens",
    category: "Photography",
    dailyRate: 400,
    weeklyRate: 2000,
    deposit: 2000,
    condition: "Excellent",
    availability: "Available Now",
    owner: {
      name: "Karthik Varma (Cygnus Media Team)",
      dept: "E4 MECH",
      role: "Campus Photographer",
      pickupSpot: "Student Activity Center (SAC) Media Room",
      rating: "5.0",
      contactPref: "WhatsApp / SAC Room"
    },
    image: "assets/images/products/dslr-camera.jpg",
    description: "Perfect for college festivals, department farewells, club promotions, and weekend photography. 24.1MP Dual Pixel CMOS AF with 4K recording, eye detection, and articulated touchscreen.",
    includedAccessories: ["18-55mm Kit Lens", "2x LP-E17 Batteries", "Dual Charger", "64GB Extreme SD Card", "Camera Bag"],
    featured: true,
    tags: ["Cameras", "DSLR", "Cygnus", "College Events"]
  },
  {
    id: "prod-04",
    title: "Arduino Uno R3 & 37-in-1 Sensor Project Starter Kit",
    category: "Project Equipment",
    dailyRate: 80,
    weeklyRate: 400,
    deposit: 300,
    condition: "Like New",
    availability: "Available Now",
    owner: {
      name: "Venkatesh Naidu (Robotics Club)",
      dept: "E3 ECE",
      role: "Lab Peer Mentor",
      pickupSpot: "AB-2 ECE Embedded Systems Lab",
      rating: "4.9",
      contactPref: "WhatsApp / AB-2 Corridor"
    },
    image: "assets/images/products/arduino-kit.jpg",
    description: "Complete mini-project bundle for ECE/CSE/EEE engineering labs. Contains genuine Arduino Uno, large 830-point breadboard, ultrasonic sensors, PIR motion sensor, DHT11 temp/humidity, relay module, and jumper wires.",
    includedAccessories: ["Arduino Uno Board", "830-tie Breadboard", "37 Sensor Modules in Organizer Box", "65 Jumper Wires", "USB-B Interface Cable"],
    featured: true,
    tags: ["Arduino", "Sensors", "ECE Mini-Project", "Robotics"]
  },
  {
    id: "prod-05",
    title: "Heavy Duty 65\" Aluminum Camera & Phone Tripod",
    category: "Photography",
    dailyRate: 50,
    weeklyRate: 250,
    deposit: 200,
    condition: "Good",
    availability: "Available Now",
    owner: {
      name: "Divya Sri",
      dept: "E3 Civil",
      role: "Student Owner",
      pickupSpot: "Hostel I2 Entrance or Central Library",
      rating: "4.7",
      contactPref: "WhatsApp"
    },
    image: "assets/images/products/tripod.jpg",
    description: "Stable 3-way pan head tripod suitable for DSLR cameras, mobile phone video shoots, college presentation recordings, and lab surveying recordings. Built-in bubble level and quick release plate.",
    includedAccessories: ["Universal Smartphone Mount Adapter", "Carrying Bag with Shoulder Strap", "Quick Release Plate"],
    featured: false,
    tags: ["Tripod", "Video Shoot", "Presentations"]
  },
  {
    id: "prod-06",
    title: "Portable 1080p LED Projector (HDMI, USB, Audio-Out)",
    category: "Electronics",
    dailyRate: 200,
    weeklyRate: 950,
    deposit: 1000,
    condition: "Like New",
    availability: "Available Now",
    owner: {
      name: "Nuzvid TechRentals",
      dept: "Local Rental Partner",
      role: "Verified Local Store (Campus Gate Access)",
      pickupSpot: "RGUKT Main Security Gate (North Gate)",
      rating: "4.9",
      contactPref: "Call / WhatsApp at Gate"
    },
    image: "assets/images/products/projector.jpg",
    description: "Ideal for club presentations, hostel study group seminars, project slide defense, and weekend movie nights. 4500 lumens brightness, crisp 1080p output up to 120-inch projection with built-in speaker.",
    includedAccessories: ["5-meter HDMI Cable", "Power Adapter", "Infrared Remote", "Compact Tripod Stand"],
    featured: false,
    tags: ["Projector", "Presentations", "Seminars", "Movie Night"]
  },
  {
    id: "prod-07",
    title: "Wireless Collar Clip Microphone (Type-C / 3.5mm)",
    category: "Audio Accessories",
    dailyRate: 100,
    weeklyRate: 450,
    deposit: 400,
    condition: "Like New",
    availability: "Available Now",
    owner: {
      name: "Praveen Kumar",
      dept: "E2 CSE",
      role: "Student Content Creator",
      pickupSpot: "Hostel K2 Walkway or SAC",
      rating: "4.8",
      contactPref: "WhatsApp"
    },
    image: "assets/images/products/microphone.jpg",
    description: "Crystal clear noise-canceling lavalier mic with 20m range. Essential for seminar presentations, college fest anchor vlogging, podcast interviews, and online viva recordings with zero latency.",
    includedAccessories: ["Transmitter & Receiver", "Type-C Adapter", "Lightning Adapter", "3.5mm Jack", "Furry Windscreen"],
    featured: false,
    tags: ["Mic", "Audio", "Presentations", "Vlog"]
  },
  {
    id: "prod-08",
    title: "20,000mAh 22.5W Fast Charging Power Bank with LED",
    category: "Everyday Essentials",
    dailyRate: 25,
    weeklyRate: 120,
    deposit: 150,
    condition: "Good",
    availability: "Available Now",
    owner: {
      name: "Ganesh M.",
      dept: "E3 Mech",
      role: "Student Owner",
      pickupSpot: "Omega Mess Cafeteria Foyer",
      rating: "4.7",
      contactPref: "WhatsApp"
    },
    image: "assets/images/products/powerbank.jpg",
    description: "Heavy capacity power bank with 3 output ports. Lifesaver during exam preparation nights at Central Library or power cuts during project submissions.",
    includedAccessories: ["Type-C Fast Charge Cable", "Micro-USB Cable"],
    featured: false,
    tags: ["Power Bank", "Exams", "Library Prep", "Emergency"]
  },
  {
    id: "prod-09",
    title: "ESP32 IoT Dual-Core Wi-Fi & Bluetooth Dev Board with OLED",
    category: "Project Equipment",
    dailyRate: 60,
    weeklyRate: 300,
    deposit: 250,
    condition: "Like New",
    availability: "Available Now",
    owner: {
      name: "Ananya B.",
      dept: "E4 ECE",
      role: "IoT Research Scholar",
      pickupSpot: "AB-2 ECE Lab Room 204",
      rating: "5.0",
      contactPref: "WhatsApp / In-person at Lab"
    },
    image: "assets/images/products/esp32.jpg",
    description: "High-performance IoT board with integrated 0.96-inch OLED screen, Wi-Fi 802.11 b/g/n, and Bluetooth BLE. Ideal for smart campus projects, sensor telemetry, and hackathon prototypes.",
    includedAccessories: ["ESP32 NodeMCU Board with OLED", "Micro-USB Data Cable", "Jumper Wire Ribbon"],
    featured: false,
    tags: ["ESP32", "IoT", "ECE Project", "Hackathon"]
  },
  {
    id: "prod-10",
    title: "Engineering Mini Drafter & Imperial Drawing Sheet Clips",
    category: "Academic Tools",
    dailyRate: 40,
    weeklyRate: 180,
    deposit: 150,
    condition: "Good",
    availability: "Available Now",
    owner: {
      name: "Suresh Babu",
      dept: "E1 Mech",
      role: "Student Owner",
      pickupSpot: "Drawing Hall AB-1 or Hostel K4",
      rating: "4.6",
      contactPref: "WhatsApp"
    },
    image: "assets/images/products/drafter.jpg",
    description: "Standard mechanical engineering drafter with steel arms and unbreakable scale. Essential for Engineering Graphics and Drawing (EGD) lab sessions and exams without needing a permanent purchase.",
    includedAccessories: ["Mini Drafter with Clamping Clamp", "Hard Plastic Drafter Case", "Set of 4 Steel Sheet Grippers"],
    featured: false,
    tags: ["Drafter", "Engineering Graphics", "EGD", "Mech"]
  }
];

export const categoriesList = [
  { id: "All", name: "All Equipment", count: 10, icon: "grid" },
  { id: "Electronics", name: "Electronics", count: 2, icon: "laptop" },
  { id: "Academic Tools", name: "Academic Tools", count: 2, icon: "calculator" },
  { id: "Photography", name: "Photography", count: 2, icon: "camera" },
  { id: "Audio Accessories", name: "Audio Accessories", count: 1, icon: "mic" },
  { id: "Project Equipment", name: "Project Equipment", count: 2, icon: "cpu" },
  { id: "Everyday Essentials", name: "Everyday Essentials", count: 1, icon: "battery-charging" }
];

export const sampleInitialBookings = [
  {
    id: "book-101",
    productId: "prod-01",
    productTitle: "Casio fx-991EX ClassWiz Scientific Calculator",
    productImage: "assets/images/products/calculator.jpg",
    ownerName: "Sai Krishna M. (E4 CSE)",
    pickupSpot: "SAC Ground Floor",
    startDate: "2026-10-28",
    endDate: "2026-10-30",
    days: 2,
    rate: 30,
    total: 60,
    deposit: 200,
    status: "Approved by Owner",
    statusCode: "approved",
    notes: "Handover agreed for 4:30 PM outside Central Library porch."
  },
  {
    id: "book-102",
    productId: "prod-03",
    productTitle: "Canon EOS 200D II DSLR with 18-55mm STM Lens",
    productImage: "assets/images/products/dslr-camera.jpg",
    ownerName: "Karthik Varma (Cygnus Media)",
    pickupSpot: "SAC Media Room",
    startDate: "2026-11-02",
    endDate: "2026-11-03",
    days: 1,
    rate: 400,
    total: 400,
    deposit: 2000,
    status: "Pending Owner Approval",
    statusCode: "pending",
    notes: "Awaiting owner confirmation for departmental fest coverage."
  }
];

export const sampleInitialUserListings = [
  {
    id: "listing-201",
    title: "Logitech R400 Wireless Presentation Clicker with Laser",
    category: "Electronics",
    dailyRate: 40,
    weeklyRate: 200,
    condition: "Like New",
    status: "Active",
    pickupSpot: "Hostel K3 Common Room",
    inquiriesCount: 3,
    image: "assets/images/products/laptop.jpg"
  }
];
