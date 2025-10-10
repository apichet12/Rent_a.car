const pool = require('./db');

async function seed() {
  const conn = await pool.getConnection();
  try {
    const cars = [
      {
        name: 'Toyota Camry',
        price: 1200,
        image: '/images/camry.jpg',
        year: 2019,
        seats: 5,
        fuel: 'เบนซิน',
        description: 'Toyota Camry 2019, comfortable and fuel efficient.',
        features: JSON.stringify(['A/C', 'GPS', 'Bluetooth'])
      },
      {
        name: 'Honda Civic',
        price: 1100,
        image: '/images/civic.jpg',
        year: 2018,
        seats: 5,
        fuel: 'เบนซิน',
        description: 'Honda Civic 2018, reliable and compact.',
        features: JSON.stringify(['A/C', 'Bluetooth'])
      }
    ];

    for (const c of cars) {
      await conn.query(
        'INSERT INTO cars (name, price, image, year, seats, fuel, description, features) VALUES (?,?,?,?,?,?,?,?)',
        [c.name, c.price, c.image, c.year, c.seats, c.fuel, c.description, c.features]
      );
    }

    console.log('Seed completed');
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();
