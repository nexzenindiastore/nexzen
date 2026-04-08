/* eslint-disable @typescript-eslint/no-require-imports */

require('dotenv/config')

const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('@prisma/client')

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.inventoryMovement.deleteMany()
  await prisma.productDependency.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  await prisma.category.createMany({
    data: [
      {
        name: 'Development Boards',
        slug: 'development-boards',
        description: 'Arduino, ESP32, Raspberry Pi and rapid prototyping boards.',
      },
      {
        name: 'Electronic Components',
        slug: 'electronic-components',
        description: 'Passive components, ICs, connectors and breakout parts.',
      },
      {
        name: 'Sensors and Modules',
        slug: 'sensors-modules',
        description: 'Motion, distance, weather and vision modules.',
      },
      {
        name: 'Wireless and IoT',
        slug: 'wireless-iot',
        description: 'Wi-Fi, BLE, LoRa and smart connectivity boards.',
      },
      {
        name: 'Motion Systems',
        slug: 'motors-actuators',
        description: 'Servo motors, steppers, drivers and motion gear.',
      },
      {
        name: 'Maker Kits',
        slug: 'stem-kits',
        description: 'Project-ready kits for students and makers.',
      },
    ],
  })

  const categoryMap = await prisma.category.findMany()

  const getCategoryId = (slug) =>
    categoryMap.find((category) => category.slug === slug)?.id

  await prisma.product.createMany({
    data: [
      {
        sku: 'NX-UNO-R4-001',
        name: 'UNO R4 Creator Board',
        slug: 'uno-r4-creator-board',
        description: 'A modern dev board for robotics, automation, and rapid classroom builds.',
        shortDescription: 'Wi-Fi microcontroller board for rapid prototyping.',
        price: 1499,
        compareAtPrice: 1799,
        costPrice: 1120,
        imageUrl: '/nexzen-logo.png',
        brand: 'Nexzen',
        stockQuantity: 42,
        lowStockThreshold: 6,
        inStock: true,
        categoryId: getCategoryId('development-boards'),
      },
      {
        sku: 'NX-PI-VSN-002',
        name: 'Pi Vision Starter Kit',
        slug: 'pi-vision-starter-kit',
        description: 'Everything needed to prototype AI vision, kiosk, and embedded displays.',
        shortDescription: 'Raspberry Pi vision bundle with cooling and case.',
        price: 8299,
        compareAtPrice: 8999,
        costPrice: 7150,
        imageUrl: '/nexzen-logo.png',
        brand: 'Nexzen',
        stockQuantity: 18,
        lowStockThreshold: 4,
        inStock: true,
        categoryId: getCategoryId('development-boards'),
      },
      {
        sku: 'NX-ESP32-003',
        name: 'ESP32 Mesh Node Pack',
        slug: 'esp32-mesh-node-pack',
        description: 'A dependable board for dashboards, sensors, and smart home deployments.',
        shortDescription: 'ESP32 board pack for IoT and BLE builds.',
        price: 699,
        compareAtPrice: 899,
        costPrice: 470,
        imageUrl: '/nexzen-logo.png',
        brand: 'Nexzen',
        stockQuantity: 76,
        lowStockThreshold: 10,
        inStock: true,
        categoryId: getCategoryId('wireless-iot'),
      },
      {
        sku: 'NX-LIDAR-004',
        name: 'Mini LiDAR Range Module',
        slug: 'mini-lidar-range-module',
        description: 'Precise ranging for obstacle avoidance, SLAM demos, and mobile bots.',
        shortDescription: 'Compact LiDAR module with UART output.',
        price: 2399,
        compareAtPrice: 2699,
        costPrice: 1880,
        imageUrl: '/nexzen-logo.png',
        brand: 'Nexzen',
        stockQuantity: 24,
        lowStockThreshold: 5,
        inStock: true,
        categoryId: getCategoryId('sensors-modules'),
      },
      {
        sku: 'NX-ROBO-005',
        name: 'Robotics Launchpad Kit',
        slug: 'robotics-launchpad-kit',
        description: 'A polished beginner kit that gets students building on day one.',
        shortDescription: 'Starter robotics kit with motors and lessons.',
        price: 3499,
        compareAtPrice: 3999,
        costPrice: 2750,
        imageUrl: '/nexzen-logo.png',
        brand: 'Nexzen',
        stockQuantity: 31,
        lowStockThreshold: 6,
        inStock: true,
        categoryId: getCategoryId('stem-kits'),
      },
      {
        sku: 'NX-SERVO-006',
        name: 'Precision Servo Trio',
        slug: 'precision-servo-trio',
        description: 'Smooth actuation for robotic arms, pan-tilt builds, and kinetic projects.',
        shortDescription: 'Three-pack precision servos for motion systems.',
        price: 899,
        compareAtPrice: 1099,
        costPrice: 620,
        imageUrl: '/nexzen-logo.png',
        brand: 'Nexzen',
        stockQuantity: 54,
        lowStockThreshold: 8,
        inStock: true,
        categoryId: getCategoryId('motors-actuators'),
      },
    ],
  })

  const allProducts = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      stockQuantity: true,
    },
  })

  const bySlug = (slug) => allProducts.find((product) => product.slug === slug)

  await prisma.productDependency.createMany({
    data: [
      {
        productId: bySlug('robotics-launchpad-kit').id,
        dependencyProductId: bySlug('precision-servo-trio').id,
        quantity: 1,
        isOptional: false,
        notes: 'Recommended servo set for the starter robotics kit.',
      },
      {
        productId: bySlug('robotics-launchpad-kit').id,
        dependencyProductId: bySlug('uno-r4-creator-board').id,
        quantity: 1,
        isOptional: false,
        notes: 'Controller board needed for the guided robotics lessons.',
      },
    ],
  })

  await prisma.inventoryMovement.createMany({
    data: allProducts.map((product) => ({
      productId: product.id,
      type: 'IN',
      quantity: product.stockQuantity,
      reason: 'Initial seed stock',
      reference: `seed-${product.slug}`,
    })),
  })

  console.log('Seed completed')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
